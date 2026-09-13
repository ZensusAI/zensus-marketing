# IndexNow (Bing, Yandex, and other partners)

[IndexNow](https://www.indexnow.org) lets you notify participating search engines when URLs change so they can recrawl sooner than on their default schedule.

**Participating engines** include Bing, Yandex, Seznam, Naver, and DuckDuckGo (via Bing). **Google does not use IndexNow** (as of public documentation). Treat this as a **Bing ecosystem** lever (including experiences that lean on Bing's index), not a Google ranking lever.

## Key file (proof of ownership)

- **Location:** `public/<KEY>.txt` where `<KEY>` is 32 hexadecimal characters (no extension beyond `.txt`).
- **Contents:** A single line holding the key string only, matching the filename stem.
- **Live URL:** `https://zensus.finance/<KEY>.txt` must return **200** with that body.
- **Rotation:** Changing the key requires updating **every** place that references it (the Vercel env `INDEXNOW_KEY` if set, and this file name + contents), then waiting for engines to accept the new `keyLocation`. Coordinate with Bing Webmaster Tools if submissions stop working during rotation.

## Where pings run

| Mechanism | When | What is submitted |
|-----------|------|-------------------|
| **`scripts/indexnow-ping.mjs`** | End of `npm run build` on **Vercel production** only (`VERCEL=1` and `VERCEL_ENV=production`) | All `<loc>` URLs from `public/sitemap.xml` |

Local `npm run build` does **not** call the IndexNow API.

**There used to be a second mechanism**, `.github/workflows/indexnow.yml`, which POSTed the homepage and sitemap on every push to `main`. It was removed on 2026-09-13. It never submitted anything: it required a repository secret `INDEXNOW_KEY` that was never set, so every run logged `INDEXNOW_KEY is not set. Skipping IndexNow.` and exited green. It was also redundant, since the Vercel build ping above submits all sitemap URLs rather than just two. Its only practical effect was a red X on the Actions tab whenever GitHub failed to allocate a runner. Do not re-add it without a reason the build-time ping does not already cover.

### Env

- **Vercel (optional but recommended):** Set **`INDEXNOW_KEY`** in Production environment variables so the key is not only inferred from the repo. If unset, the build script still resolves the key from the single `public/<32-hex>.txt` file when its first line matches the stem.

## Verify submissions

1. After deploy: `curl -sS -o /dev/null -w "%{http_code}" https://zensus.finance/<KEY>.txt` → `200`.
2. **Vercel** → the production deployment → **Build Logs** → confirm `[indexnow] pinging N URLs` followed by a **200** or **202** response.
3. **Bing Webmaster Tools:** URL / IndexNow reporting may show activity within **24–48 hours**.

## If pings fail

- Confirm the `INDEXNOW_KEY` env var, if set, matches the live key file (no typos, no extra newline).
- Confirm `https://zensus.finance/<KEY>.txt` is reachable from the public internet. IndexNow requires `keyLocation` to sit on the **same host** as the submitted URLs, so the key file has to be served by the current origin, not by a domain that redirects to it.
- Read the build log for HTTP **4xx/5xx** and the truncated response body.
- IndexNow allows on the order of **10k URLs per day** for this host, and we stay well under that.

## Related code

- `scripts/indexnow-ping.mjs`, the build-time full sitemap submission. This is the only mechanism.

When adding new marketing routes, keep **`src/App.tsx`**, **`scripts/prerender.mjs`**, and **`public/sitemap.xml`** in sync (see `CLAUDE.md`).
