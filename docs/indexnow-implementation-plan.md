# IndexNow implementation plan (zensus-marketing)

**Status:** Implemented — see `scripts/indexnow-ping.mjs`, `.github/workflows/indexnow.yml`, and `docs/indexnow.md`. Add repository secret **`INDEXNOW_KEY`** before relying on the GitHub Action.

**Goal:** Satisfy GEO audit “ship IndexNow (key file + deploy-hook ping)” for Bing / Yandex / other IndexNow partners — **not** Google (non-participant).

**Caveat:** Google does not use IndexNow; value is mainly Bing-backed surfaces (e.g. Copilot, DDG via Bing).

---

## Current repo state (important)

| Piece | Status |
|-------|--------|
| **Key file** | `public/50e6a09d8eaa8f7b9871da6766dbaea1.txt` exists; body is a single line matching the filename stem (32 hex chars). |
| **Build-time ping** | `scripts/indexnow-ping.mjs` runs at end of `npm run build`; POSTs **all** `<loc>` URLs from `public/sitemap.xml` to `https://api.indexnow.org/IndexNow`. |
| **Gate** | Only runs when `VERCEL=1` and `VERCEL_ENV=production` — local builds do not ping. |
| **Key in code** | Key is **hardcoded** in `indexnow-ping.mjs` (must move to env/secret for hygiene and for GitHub Actions). |
| **GitHub Actions** | No `.github/workflows/` yet — **this is the main gap** vs the ticket. |

---

## Phase 1 — Key file and secrets

1. **Keep or rotate the key**
   - **If keeping:** Ensure `https://zensus.app/50e6a09d8eaa8f7b9871da6766dbaea1.txt` returns `200` and body equals the key (one line, no BOM). Already true if production matches repo.
   - **If rotating:** Generate new 32-char hex key → add `public/<newkey>.txt` (content **only** the key) → update Bing/Webmaster key location after deploy → **do not** delete old key file until engines have picked up the new `keyLocation` (coordination burden; document in README).

2. **Secrets (GitHub)**
   - Add repository secret **`INDEXNOW_KEY`** = the key string (same as file body).
   - Never echo the key in workflow logs (use masked secret; log only HTTP status and safe response snippets).

3. **Secrets (Vercel) — recommended for one source of truth**
   - Set **`INDEXNOW_KEY`** in Vercel Production env for the marketing project.
   - Refactor `scripts/indexnow-ping.mjs` to read `process.env.INDEXNOW_KEY` and **fail closed** (skip ping with warning) if missing in production, instead of hardcoding. Keeps key out of git.

4. **Verify after deploy**
   - `curl -sS https://zensus.app/<KEY>.txt` → `200`, body matches key.

---

## Phase 2 — GitHub Action (`.github/workflows/indexnow.yml`)

### Trigger

- **`on: push: branches: [main]`** as specified.
- Optional: `workflow_dispatch` for manual re-ping without a commit.

### Timing nuance (read before coding)

- **Push to `main`** fires **before** Vercel may finish deploying. If `urlList` is only `https://zensus.app/sitemap.xml` and `https://zensus.app/`, crawlers usually refetch those URLs and then crawl linked locs — **acceptable v1** per ticket.
- **Stricter:** Ping only after deploy (e.g. `workflow_run` on a “deploy succeeded” workflow, or Vercel **Deploy Hook** → `repository_dispatch`). Defer unless you see 404s on new routes in Bing logs.

### Payload

- POST `https://api.indexnow.org/indexnow` (lowercase path per spec; current script uses `/IndexNow` — align to spec in one place when touching).
- JSON body:

```json
{
  "host": "zensus.app",
  "key": "<from secrets.INDEXNOW_KEY>",
  "keyLocation": "https://zensus.app/<KEY>.txt",
  "urlList": ["…"]
}
```

### v1 `urlList` strategy (pick one for first merge)

| Strategy | Pros | Cons |
|----------|------|------|
| **A. Sitemap + homepage** | Matches ticket “simplest v1”; tiny payload. | Homepage often already in sitemap (harmless duplicate). |
| **B. All sitemap `<loc>`** (parity with current Node script) | Maximum coverage on every merge. | Larger POST; redundant with Vercel build ping if both run. |

**Recommendation:** Start with **A** for the Action to keep CI fast and ticket-aligned; leave **full sitemap ping** on **Vercel production build** as today (or switch build script to env-backed key only).

### v2 — Diff-based URLs (ZEN-240 / ZEN-241)

- On `push` to `main`, `git diff ${{ github.event.before }} ${{ github.sha }} --name-only` (or `paths` filters).
- Map changed files → URLs (e.g. `src/pages/Pricing.tsx` → `/pricing`; future `src/content/blog/*.mdx` → `/blog/...`).
- Cap list size (e.g. 100) and always include `sitemap.xml` as safety net.
- **ZEN-241:** When `/austin` ships, add mapping once in the workflow or a small `scripts/indexnow-urls-from-diff.mjs`.

### Logging

- Log: `HTTP status`, `statusText`, and response body **truncated** (no secrets).
- Treat **200** and **202** as success; **4xx/5xx** as failure (exit `1` if you want a red CI run, or `0` with warning to match “don’t block deploy” philosophy — **decision:** recommend **`continue-on-error: true`** or non-zero exit only on 400+ for visibility without blocking merges).

---

## Phase 3 — Documentation

Add **`docs/indexnow.md`** (or a README subsection) covering:

- What IndexNow is / which engines / **Google does not participate**.
- Where **`public/<KEY>.txt`** lives and that **rotating the key** requires updating secrets + `keyLocation` + waiting for engines to trust the new file.
- Where **`scripts/indexnow-ping.mjs`** runs (Vercel production build) and where **`.github/workflows/indexnow.yml`** runs (push to `main`).
- GitHub secret name **`INDEXNOW_KEY`** (and Vercel env if used).
- How to verify: **Bing Webmaster Tools** URL submission / IndexNow reports; optional `/geo crawlers` check from GEO skill.
- If pings fail: check key file 200, secret value, API status body, rate limits (10k URLs/day — unlikely here).

Update **`CLAUDE.md`** one line to mention the GitHub Action in addition to the build script.

---

## Cross-ticket notes

| Ticket | Interaction |
|--------|-------------|
| **ZEN-240** | New `.mdx` posts: diff-based workflow should include `src/content/blog/**` when that path exists. |
| **ZEN-244** | OG-only edits do not need IndexNow; diff approach can ignore `public/og/`, `scripts/generate-og.mjs` if desired. |

---

## Acceptance criteria mapping

| Criterion | Plan |
|-----------|------|
| Key file at `public/<key>.txt`, 200 on prod | Phase 1 verify / rotate doc. |
| Workflow on `push` to `main` | Phase 2 `.github/workflows/indexnow.yml`. |
| First run logs 200/202 | Phase 2 + manual check after merge. |
| Bing WMT shows submissions | Doc + manual 24–48h check. |
| No secret in logs | Phase 2 review step. |
| Documentation | Phase 3 `docs/indexnow.md` + CLAUDE.md touch. |

---

## Implementation order (suggested)

1. Refactor **`indexnow-ping.mjs`** to use `INDEXNOW_KEY` from env (no key in source).
2. Set **Vercel** `INDEXNOW_KEY` + **GitHub** `INDEXNOW_KEY` to current key value.
3. Add **`.github/workflows/indexnow.yml`** (v1: homepage + sitemap).
4. Add **`docs/indexnow.md`** + **CLAUDE.md** tweak.
5. Merge → confirm workflow log + `curl` key file + Bing after a day.

---

## Out of scope (per ticket)

- Google-specific / AI Overviews submission flows.
- Per-edit real-time pings; sophisticated rate-limit backoff beyond logging.
