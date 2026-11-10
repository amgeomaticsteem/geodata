from __future__ import annotations

import hashlib
import html
import json
import os
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode, urlsplit, urlunsplit, parse_qsl
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parent
CONFIG_PATH = ROOT / "config" / "catalog.json"
PROJECT_ID = os.getenv("FIREBASE_PROJECT_ID", "am-a-geo")
USER_AGENT = "GEOData-Curator/1.0 (+https://amgeomaticsteem.github.io/geodata/)"
TIMEOUT = 25
TRANSLATION_ENDPOINT = "https://api.mymemory.translated.net/get"
TRANSLATION_CONTACT = os.getenv("TRANSLATION_CONTACT_EMAIL", "refathany2005@gmail.com")
MAX_TRANSLATION_CHARS_PER_RUN = 20000
ALLOWED_ARCGIS_TYPES = {
    "Feature Service", "Feature Collection", "CSV", "Shapefile",
    "Image Service", "Raster Layer"
}

def clean_text(value: object, limit: int = 700) -> str:
    if not value:
        return ""
    value = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", str(value), flags=re.I | re.S)
    value = re.sub(r"<[^>]+>", " ", value)
    value = html.unescape(value)
    value = re.sub(r"\s+", " ", value).strip()
    return value[:limit]

def canonical_url(url: str) -> str:
    parts = urlsplit((url or "").strip())
    if parts.scheme.lower() not in {"http", "https"} or not parts.netloc:
        return ""
    host = parts.netloc.lower()
    path = re.sub(r"/+$", "", parts.path) or "/"
    # Remove tracking parameters, but preserve query values needed to identify a resource.
    tracking = {"fbclid", "gclid", "mc_cid", "mc_eid"}
    query = urlencode([(k, v) for k, v in parse_qsl(parts.query, keep_blank_values=True)
                       if k.lower() not in tracking and not k.lower().startswith("utm_")])
    return urlunsplit((parts.scheme.lower(), host, path, query, ""))

def request_bytes(url: str, headers: dict | None = None, method: str = "GET", timeout: int = TIMEOUT):
    merged = {"User-Agent": USER_AGENT, "Accept": "application/json, text/xml, text/html;q=0.9, */*;q=0.8"}
    if headers:
        merged.update(headers)
    req = Request(url, headers=merged, method=method)
    with urlopen(req, timeout=timeout) as response:
        return response.status, response.read(3_000_000), response.headers.get("Content-Type", "")

def request_json(url: str, params: dict | None = None, headers: dict | None = None) -> dict:
    if params:
        url += ("&" if "?" in url else "?") + urlencode(params)
    _, payload, _ = request_bytes(url, headers=headers)
    return json.loads(payload.decode("utf-8"))

def url_is_live(url: str) -> bool:
    url = canonical_url(url)
    if not url:
        return False
    try:
        status, _, _ = request_bytes(url, method="HEAD", timeout=12)
        return 200 <= status < 400
    except (HTTPError, URLError, TimeoutError, ValueError):
        try:
            status, _, _ = request_bytes(url, headers={"Range": "bytes=0-0"}, timeout=12)
            return 200 <= status < 400
        except Exception:
            return False

def source_language(value: str) -> str:
    return "ar" if re.search(r"[\u0600-\u06ff]", value or "") else "en"

def translation_chunks(value: str, limit: int = 420) -> list[str]:
    words = re.findall(r"\S+\s*", value or "") or [value]
    chunks: list[str] = []
    current = ""
    for word in words:
        if current and len((current + word).encode("utf-8")) > limit:
            chunks.append(current.strip())
            current = ""
        if len(word.encode("utf-8")) > limit:
            for char in word:
                if current and len((current + char).encode("utf-8")) > limit:
                    chunks.append(current)
                    current = ""
                current += char
        else:
            current += word
    if current.strip():
        chunks.append(current.strip())
    return chunks

def translate_mymemory(value: str, source: str, target: str) -> str:
    if not value or source == target:
        return value
    translated: list[str] = []
    for chunk in translation_chunks(value):
        params = {
            "q": chunk,
            "langpair": f"{source}|{target}",
            "de": TRANSLATION_CONTACT,
        }
        data = request_json(TRANSLATION_ENDPOINT, params=params)
        if int(data.get("responseStatus", 0)) != 200:
            raise RuntimeError(data.get("responseDetails", "Translation service returned no translation"))
        result = data.get("responseData", {}).get("translatedText", "")
        if not result:
            raise RuntimeError("Translation service returned an empty result")
        translated.append(html.unescape(result))
        time.sleep(0.15)
    return " ".join(translated).strip()

def apply_bilingual_fields(record: dict, existing: dict | None = None,
                           budget: list[int] | None = None) -> dict:
    existing = existing or {}
    budget = budget if budget is not None else [MAX_TRANSLATION_CHARS_PER_RUN]
    output = dict(record)
    for field in ("title", "details", "format", "license"):
        value = clean_text(output.get(field, ""), 1200)
        if not value:
            continue
        source = source_language(value)
        target = "en" if source == "ar" else "ar"
        output[f"{field}_{source}"] = value
        saved_target = existing.get(f"{field}_{target}")
        if saved_target:
            output[f"{field}_{target}"] = saved_target
            continue
        cost = len(value)
        if budget[0] < cost:
            print(f"[WARN] Translation budget reached; leaving {field!r} in its original language.")
            continue
        try:
            translated = translate_mymemory(value, source, target)
            if translated:
                output[f"{field}_{target}"] = translated
                output["translationProvider"] = "MyMemory"
                budget[0] -= cost
        except Exception as exc:
            print(f"[WARN] Could not translate {field!r} to {target}: {exc}")
    # Publisher names are proper names and are intentionally preserved.
    return output

def backfill_public_translations(db, budget: list[int]) -> dict[str, int]:
    counts: dict[str, int] = {}
    for collection_name in ("projects", "courses", "programs", "sites"):
        changed = 0
        try:
            snapshots = db.collection(collection_name).stream()
            for snapshot in snapshots:
                data = snapshot.to_dict() or {}
                localized = apply_bilingual_fields(data, data, budget)
                patch = {
                    key: value for key, value in localized.items()
                    if (key.endswith("_ar") or key.endswith("_en") or key == "translationProvider")
                    and value and value != data.get(key)
                }
                if patch:
                    snapshot.reference.set(patch, merge=True)
                    changed += 1
                if budget[0] <= 0:
                    break
        except Exception as exc:
            print(f"[WARN] Translation backfill skipped for {collection_name}: {exc}")
        counts[collection_name] = changed
        print(f"[INFO] Translation backfill {collection_name}: {changed} record(s) updated.")
        if budget[0] <= 0:
            break
    return counts

def make_record(title: str, details: str, link: str, publisher: str,
                fmt: str = "", date: str = "", source: str = "",
                license_text: str = "") -> dict | None:
    title = clean_text(title, 180)
    details = clean_text(details, 700)
    link = canonical_url(link)
    if len(title) < 3 or not link:
        return None
    record = {
        "title": title,
        "details": details or "See the official resource page for details.",
        "link": link,
        "publisherName": clean_text(publisher, 100) or "Official source",
        "sourceName": clean_text(source or publisher, 100),
        "sourceUrl": link,
        "license": clean_text(license_text, 500) or "Check the source page for applicable reuse terms.",
    }
    if fmt:
        record["format"] = clean_text(fmt, 80)
    if date:
        record["date"] = date
    return record

def search_arcgis(config: dict) -> list[dict]:
    found = {}
    endpoint = "https://www.arcgis.com/sharing/rest/search"
    for term in config.get("arcgis_queries", []):
        try:
            data = request_json(endpoint, {
                "f": "json",
                "q": f'access:public AND "{term}"',
                "num": 50,
                "start": 1,
                "sortField": "modified",
                "sortOrder": "desc",
            })
        except Exception as exc:
            print(f"[WARN] ArcGIS search failed for {term!r}: {exc}")
            continue
        accepted = 0
        for item in data.get("results", []):
            if item.get("access") != "public" or item.get("type") not in ALLOWED_ARCGIS_TYPES:
                continue
            title = clean_text(item.get("title"), 180)
            if len(title) < 5:
                continue
            item_id = item.get("id")
            if not item_id:
                continue
            fmt = item.get("type", "ArcGIS item")
            snippet = clean_text(item.get("snippet") or item.get("description"), 420)
            owner = clean_text(item.get("owner"), 80) or "ArcGIS Online publisher"
            notes = snippet or "Publicly accessible ArcGIS Online item."
            notes += f" Item type: {fmt}. Owner: {owner}. Check the item page for download/service options and reuse terms."
            license_info = clean_text(item.get("licenseInfo"), 300)
            reuse = license_info or "Public access; reuse license not independently confirmed."
            modified = item.get("modified")
            date = ""
            if isinstance(modified, (int, float)) and modified > 0:
                date = datetime.fromtimestamp(modified / 1000, tz=timezone.utc).date().isoformat()
            link = f"https://www.arcgis.com/home/item.html?id={item_id}"
            record = make_record(title, notes, link, owner, fmt, date,
                                 "ArcGIS Online", reuse)
            if record:
                found[record["link"]] = record
                accepted += 1
            if accepted >= int(config.get("max_arcgis_items_per_query", 8)):
                break
        print(f"[INFO] ArcGIS query {term!r}: {accepted} candidate(s)")
        time.sleep(0.25)
    return list(found.values())

def get_github_headers() -> dict:
    token = os.getenv("GITHUB_TOKEN", "").strip()
    return {"Authorization": f"Bearer {token}"} if token else {}

def collect_programs(config: dict) -> list[dict]:
    found = []
    headers = get_github_headers()
    for entry in config.get("program_repositories", []):
        repo = entry["repo"]
        base = f"https://api.github.com/repos/{repo}"
        try:
            metadata = request_json(base, headers=headers)
            try:
                release = request_json(base + "/releases/latest", headers=headers)
            except HTTPError as exc:
                if exc.code != 404:
                    raise
                release = {}
            version = clean_text(release.get("tag_name"), 80)
            release_url = release.get("html_url") or metadata.get("html_url") or f"https://github.com/{repo}"
            summary = entry.get("details", "")
            if version:
                summary += f" Latest published release: {version}."
            published = release.get("published_at", "")
            date = published[:10] if len(published) >= 10 else ""
            record = make_record(
                entry.get("title") or metadata.get("name") or repo,
                summary,
                release_url,
                metadata.get("full_name") or repo,
                entry.get("format", "GIS software"),
                date,
                "Official GitHub repository",
                metadata.get("license", {}).get("spdx_id", "") if isinstance(metadata.get("license"), dict) else ""
            )
            if record:
                found.append(record)
        except Exception as exc:
            print(f"[WARN] GitHub project lookup failed for {repo}: {exc}")
        time.sleep(0.15)
    return found

def collect_catalog(config: dict, section: str) -> list[dict]:
    records = []
    for entry in config.get(section, []):
        link = entry.get("link", "")
        if not url_is_live(link):
            print(f"[WARN] Skipping unavailable {section} link: {link}")
            continue
        record = make_record(
            entry.get("title", ""),
            entry.get("details", ""),
            link,
            entry.get("publisherName", "Official source"),
            entry.get("format", ""),
            entry.get("date", ""),
            entry.get("publisherName", ""),
            entry.get("license", "")
        )
        if record:
            records.append(record)
    return records

def collect_all(config: dict) -> dict[str, list[dict]]:
    return {
        "projects": search_arcgis(config),
        "courses": collect_catalog(config, "courses"),
        "programs": collect_programs(config),
        "sites": collect_catalog(config, "sites"),
    }

def firestore_client():
    secret = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON", "").strip()
    if not secret:
        raise RuntimeError("Missing GitHub Secret FIREBASE_SERVICE_ACCOUNT_JSON.")
    info = json.loads(secret)
    if info.get("project_id") != PROJECT_ID:
        raise RuntimeError(
            f"Service account project_id must be {PROJECT_ID!r}; refusing to write to a different project."
        )
    # Safe identifiers only: never print the private key or the full credential JSON.
    print(f"[INFO] Firebase service account: {info.get('client_email', 'MISSING client_email')}")
    key_id = str(info.get("private_key_id", ""))
    print(f"[INFO] Firebase key ID prefix: {key_id[:8] if key_id else 'MISSING private_key_id'}")
    print(f"[INFO] Firebase credential project_id: {info.get('project_id')}")
    import firebase_admin
    from firebase_admin import credentials, firestore
    if not firebase_admin._apps:
        firebase_admin.initialize_app(credentials.Certificate(info), {"projectId": PROJECT_ID})
    return firestore.client(), firestore

def upsert_records(db, firestore_module, collection_name: str, records: list[dict], limit: int, translation_budget: list[int]) -> tuple[int, int]:
    collection = db.collection(collection_name)
    existing_by_url = {}
    # Reuse existing document IDs when the same link was previously added manually.
    print(f"[INFO] Firestore: listing existing documents in '{collection_name}'.")
    try:
        snapshots = collection.stream()
        for snapshot in snapshots:
            data = snapshot.to_dict() or {}
            key = canonical_url(data.get("link", ""))
            if key:
                existing_by_url.setdefault(key, snapshot.reference)
    except Exception as exc:
        raise RuntimeError(
            f"Firestore READ/LIST failed for collection '{collection_name}'. "
            "Check that the exact service account shown above has roles/datastore.user "
            "on project am-a-geo and that the permission change has propagated. "
            f"Original error: {type(exc).__name__}: {exc}"
        ) from exc
    added = updated = 0
    for record in records:
        key = canonical_url(record["link"])
        if not key:
            continue
        ref = existing_by_url.get(key)
        old = ref.get().to_dict() if ref else None
        if ref is None:
            doc_id = hashlib.sha256(key.encode("utf-8")).hexdigest()[:40]
            ref = collection.document(doc_id)
            old = None
        payload = apply_bilingual_fields(record, old or {}, translation_budget)
        payload["agentUpdatedAt"] = firestore_module.SERVER_TIMESTAMP
        payload["createdAt"] = (old or {}).get("createdAt") or firestore_module.SERVER_TIMESTAMP
        if old:
            updated += 1
        else:
            added += 1
        try:
            ref.set(payload, merge=True)
        except Exception as exc:
            raise RuntimeError(
                f"Firestore WRITE failed for collection '{collection_name}' "
                f"(document {ref.id}). Check roles/datastore.user on project am-a-geo. "
                f"Original error: {type(exc).__name__}: {exc}"
            ) from exc
        if added + updated >= limit:
            break
    return added, updated

def load_config() -> dict:
    with CONFIG_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)

def main() -> int:
    config = load_config()
    print("[INFO] GEOData Curator starting.")
    print(f"[INFO] Firebase project target: {PROJECT_ID}")
    data = collect_all(config)
    total = sum(len(items) for items in data.values())
    print("[INFO] Candidate summary: " + ", ".join(f"{key}={len(value)}" for key, value in data.items()))
    dry_run = os.getenv("DRY_RUN", "false").lower() in {"1", "true", "yes"}
    if dry_run:
        for collection, records in data.items():
            for record in records[:3]:
                print(f"[DRY-RUN] {collection}: {record['title']} -> {record['link']}")
        print(f"[DRY-RUN] No Firestore writes performed. {total} candidate(s) collected.")
        return 0
    if total == 0:
        print("[WARN] No candidate resources passed collection checks; nothing was published.")
        return 0
    db, firestore_module = firestore_client()
    limit = int(config.get("max_new_or_updated_items_per_run", 80))
    remaining = limit
    translation_budget = [MAX_TRANSLATION_CHARS_PER_RUN]
    results = {}
    for collection_name, records in data.items():
        if remaining <= 0:
            results[collection_name] = {"added": 0, "updated": 0, "skipped_by_limit": len(records)}
            continue
        added, updated = upsert_records(db, firestore_module, collection_name, records, remaining, translation_budget)
        used = added + updated
        remaining -= used
        results[collection_name] = {"added": added, "updated": updated}
    print("[INFO] Remaining translation character budget: " + str(translation_budget[0]))
    backfill_results = backfill_public_translations(db, translation_budget)
    print("[DONE] Translation backfill: " + json.dumps(backfill_results, ensure_ascii=False))
    print("[DONE] Firestore publish results: " + json.dumps(results, ensure_ascii=False))
    print("[DONE] Existing records are never automatically deleted.")
    return 0

if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        print(f"[ERROR] {type(error).__name__}: {error}", file=sys.stderr)
        raise SystemExit(1)
