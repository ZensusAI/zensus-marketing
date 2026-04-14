

# Fix Google Search Console Indexing Issues for zensus.app

The core problem: all canonical URLs, sitemap entries, OG tags, and structured data reference `zensus.ai` instead of `zensus.app`. Google sees your site at zensus.app but the canonical says "the real version is at zensus.ai," so it skips indexing.

## Changes

### 1. Update `index.html` — switch all URLs from zensus.ai to zensus.app
- Canonical: `https://zensus.app`
- OG/Twitter URLs: `https://zensus.app/`
- Structured data `url`: `https://zensus.app`

### 2. Update `public/sitemap.xml` — all `<loc>` entries to zensus.app
- `https://zensus.app/`, `/pricing`, `/forecast`, `/blog`

### 3. Update `public/robots.txt` — sitemap URL to zensus.app
- `Sitemap: https://zensus.app/sitemap.xml`

### 4. Remove `/forecast` from sitemap
- The Forecast page is just a redirect to `app.zensus.app/forecast` — it has no indexable content and is likely one of the "page with redirect" issues. Remove it from the sitemap so Google doesn't try to index a redirect page.

### 5. Add per-page meta tags (optional but recommended)
- Each page (Pricing, Blog) currently shares the same `<title>` and `<meta description>` from `index.html`. Since this is an SPA without SSR, this is a known limitation. For now, the sitemap and canonical fixes are the priority.

## Impact
These changes should resolve the "Page with redirect," "Alternate page with proper canonical tag," and most "Crawled - currently not indexed" issues. The 404 and 403 issues likely involve specific URLs that Google discovered elsewhere — you may want to check GSC for the exact URLs to investigate further.

