# ZEN-379: Comparison Pages + /llm-info — Implementation Plan

**Linear:** ZEN-379  
**Branch:** `feature/zen-379-compare-pages-llm-info`  
**Status:** Implemented

---

## Deliverables

| Route | Purpose |
|-------|---------|
| `/compare/zensus-vs-float` | Capture `zensus vs float`, `float alternatives` |
| `/compare/zensus-vs-pulse` | Capture `zensus vs pulse`, `pulse app alternatives` |
| `/llm-info` | Runway.com-style machine-readable entity summary |

## Architecture

- **`src/lib/compare-pages.ts`**: per-competitor config (add new slug + config to ship another page)
- **`src/components/compare/ComparePageLayout.tsx`**: shared template (Helmet, table, FAQs, JSON-LD)
- **`src/pages/compare/ZensusVsFloat.tsx`** / **`ZensusVsPulse.tsx`**: thin wrappers
- **`src/pages/LlmInfo.tsx`**: entity facts page

## SEO / structured data

- Compare pages: `FAQPage` + `BreadcrumbList` JSON-LD, canonical, OG/Twitter
- Methodology caption: "Based on publicly available vendor pages, June 2026"
- Substantiation: `docs/comparison-substantiation-2026-06-07.md` (+ Pulse section)

## Registration

- `src/App.tsx` lazy routes above `*`
- `scripts/prerender.mjs` `STATIC_ROUTES`
- `scripts/generate-sitemap.mjs` `STATIC_URLS`
- `scripts/generate-og.mjs` `CARDS` (`compare-zensus-vs-float`, `compare-zensus-vs-pulse`, `llm-info`)
- Footer: LLM info link
- `public/llms.txt` + `public/llms-full.txt`

## Adding a competitor

1. Add `ComparePageConfig` to `src/lib/compare-pages.ts`
2. Create `src/pages/compare/ZensusVs{Name}.tsx` wrapper
3. Register route, prerender, sitemap, OG card
4. Add substantiation notes to `docs/comparison-substantiation-2026-06-07.md`
