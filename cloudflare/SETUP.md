# GEOData Assistant — Cloudflare Worker setup

The website UI and public-resource search are in the main GEOData site. This Worker is the private server-side AI gateway. It keeps the AI binding off the public website code.

## 1) Create the Worker

1. Sign in to the [Cloudflare dashboard](https://dash.cloudflare.com/).
2. Open **Workers & Pages**.
3. Select **Create application** → **Create Worker** (or the Hello World Worker option).
4. Name it `geodata-assistant`, then deploy the starter Worker.

## 2) Add the Workers AI binding

1. Open the new `geodata-assistant` Worker.
2. Open **Settings** → **Bindings**.
3. Select **Add** → **Workers AI**.
4. Set the variable/binding name to exactly `AI`.
5. Save the binding and deploy the Worker.

The script calls `env.AI.run()`, so the binding name must be `AI`.

## 3) Install this Worker code

1. Open the Worker and choose **Edit code**.
2. Replace the starter code with the complete contents of [worker.js](./worker.js).
3. Save and deploy.

The model is `@cf/zai-org/glm-4.7-flash`. It is listed by Cloudflare as a multilingual dialogue and instruction-following model. The current Workers AI Free allocation is 10,000 Neurons per day; usage stops when the daily allocation or another plan limit is reached. See [Cloudflare Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/) and [GLM-4.7-Flash model details](https://developers.cloudflare.com/workers-ai/models/glm-4.7-flash/).

## 4) Test the Worker

Open the Worker URL in a browser. It should return JSON similar to:

```json
{"ok":true,"service":"GEOData Assistant","model":"@cf/zai-org/glm-4.7-flash","aiBindingReady":true}
```

The chat endpoint is the same URL followed by `/chat`.

## 5) Connect it to the website

Send the public `workers.dev` URL to the maintainer. The website code will be updated to call:

```
https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev/chat
```

Do not send or publish your Cloudflare password, API token, Account ID, or secret. This Worker uses a Workers AI binding and needs no API key in the website.

## Scope and limits

- The Worker is restricted to GIS, geomatics, surveying, cartography, spatial data, GIS software, and remote sensing. Obvious unrelated requests are refused by a server-side topic gate and the model's system instructions.
- GEOData's browser-side public Firestore search sends only the most relevant public records with each question. It does not send the entire database.
- The Worker allows the GEOData GitHub Pages origin for browser requests.
- A lightweight per-isolate request limiter is included. It is not a substitute for account-level Cloudflare rate limiting against a determined attacker.
- The Workers AI Free allocation is limited, not unlimited. Monitor usage in the Cloudflare dashboard.
