# GEOData automatic curator

This workflow fills the existing Firestore collections used by the website:

| Website section | Firestore collection | Discovery method |
| --- | --- | --- |
| Data | `projects` | Public ArcGIS Online items |
| Courses | `courses` | Curated official training pages, with live URL checks |
| Programs | `programs` | Official software repositories and their latest GitHub releases |
| Sites | `sites` | Curated geospatial data portals, with live URL checks |

## One-time setup (required before automatic publishing)

The existing Firestore rules allow public reads and admin-only writes. The agent does not weaken those rules.

1. In Firebase Console, open project `am-a-geo` → Project settings → Service accounts.
2. Generate a private key for a dedicated service account. Keep the JSON file private.
3. In this GitHub repository, open Settings → Secrets and variables → Actions → New repository secret.
4. Name the secret exactly `FIREBASE_SERVICE_ACCOUNT_JSON` and paste the full service-account JSON value.
5. Do not commit the JSON key, paste it into a source file, or share it in chat. If a key is exposed, revoke it in Google Cloud immediately.

The service account must belong to the `am-a-geo` Firebase project. The workflow checks the project ID and refuses to publish to a different project.

## Test first

1. Open the repository's Actions tab.
2. Choose **GEOData automatic curator** → **Run workflow**.
3. Keep `dry_run` enabled for the first run. This collects and validates candidate resources but performs no Firestore writes.
4. Review the workflow log for candidate counts and rejected links.
5. After adding the GitHub secret and reviewing the dry-run, run it again with `dry_run` disabled to publish.

After the secret is configured, the workflow runs every day at 05:17 UTC (07:17 Cairo time during UTC+2). You can also start it manually.

## What it does

- Finds public ArcGIS Online items and labels them as public items, not as guaranteed open-licensed downloads.
- Refreshes software records using official GitHub repositories/releases.
- Checks curated course and portal links before publishing.
- Deduplicates by canonical URL and reuses an existing matching Firestore document where possible.
- Adds source, source URL, update timestamp and reuse/license notes as metadata.
- Caps each run at 80 adds/updates.
- Never automatically deletes old records.
- Does not require Gemini or another paid AI API.

## Important limitations

- Public access does not automatically mean unrestricted reuse. Check the terms on each dataset's own page before using it in a project.
- The course and portal lists are curated in `agent/config/catalog.json`; edit that file to add or remove sources.
- The workflow only publishes items that pass its basic metadata and link checks. It is a conservative curator, not a guarantee that every external resource will remain available forever.
- GitHub Actions and Firebase have free quotas and usage limits. This setup is intended to stay small; monitor your account quotas.
- The agent writes only to the four collections already used by the website. It does not change the site's interface or Firestore security rules.
