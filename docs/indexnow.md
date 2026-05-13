# IndexNow (Bing, Yandex, and other partners)

[IndexNow](https://www.indexnow.org) lets you notify participating search engines when URLs change so they can recrawl sooner than on their default schedule.

**Participating engines** include Bing, Yandex, Seznam, Naver, and DuckDuckGo (via Bing). **Google does not use IndexNow** (as of public documentation). Treat this as a **Bing ecosystem** lever (including experiences that lean on Bing’s index), not a Google ranking lever.

## Key file (proof of ownership)

- **Location:** `public/<KEY>.txt` where `<KEY>` is 32 hexadecimal characters (no extension beyond `.txt`).
- **Contents:** A single line — the key string only — matching the filename stem.
- **Live URL:** `https://zensus.app/<KEY>.txt` must return **200** with that body.
- **Rotation:** Changing the key requires updating **every** place that references it (GitHub secret `INDEXNOW_KEY`, Vercel env `INDEXNOW_KEY` if set, and this file name + contents), then waiting for engines to accept the new `keyLocation`. Coordinate with Bing Webmaster Tools if submissions stop working during rotation.

## Where pings run

| Mechanism | When | What is submitted |
|-----------|------|-------------------|
| **`scripts/indexnow-ping.mjs`** | End of `npm run build` on **Vercel production** only (`VERCEL=1` and `VERCEL_ENV=production`) | All `<loc>` URLs from `public/sitemap.xml` |
| **`.github/workflows/indexnow.yml`** | On **push to `main`** (and manual `workflow_dispatch`) | `https://zensus.app/` and `https://zensus.app/sitemap.xml` (v1) |

Local `npm run build` does **not** call the IndexNow API.

### Secrets and env

- **GitHub:** Repository secret **`INDEXNOW_KEY`** — same 32-char hex as in `public/<KEY>.txt`. Used only by the workflow; it is **not** printed in logs (only HTTP status and a short response snippet).
- **Vercel (optional but recommended):** Set **`INDEXNOW_KEY`** in Production environment variables so the key is not only inferred from the repo. If unset, the build script still resolves the key from the single `public/<32-hex>.txt` file when its first line matches the stem.

## Verify submissions

1. After deploy: `curl -sS -o /dev/null -w "%{http_code}" https://zensus.app/<KEY>.txt` → `200`.
2. GitHub → **Actions** → **IndexNow** workflow → latest run → confirm HTTP **200** or **202** in the log.
3. **Bing Webmaster Tools:** URL / IndexNow reporting may show activity within **24–48 hours**.

## If pings fail

- Confirm `INDEXNOW_KEY` matches the live key file (no typos, no extra newline in the secret).
- Confirm `https://zensus.app/<KEY>.txt` is reachable from the public internet.
- Read the workflow or build log for HTTP **4xx/5xx** and the truncated response body.
- IndexNow allows on the order of **10k URLs per day** for this host — we stay well under that.

## Related code

- `scripts/indexnow-ping.mjs` — build-time full sitemap submission.
- `.github/workflows/indexnow.yml` — post-merge lightweight submission.

When adding new marketing routes, keep **`src/App.tsx`**, **`scripts/prerender.mjs`**, and **`public/sitemap.xml`** in sync (see `CLAUDE.md`).
