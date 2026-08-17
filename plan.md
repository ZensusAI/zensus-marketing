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
1. Rewrite the H1 + subhead
Replace: "Your cash flow, mapped 13 weeks ahead."
With something outcome-first, not window-specific. Options to pick from or riff on:

"Always know how much runway you have — and when it runs out."
"Stop guessing if you'll make payroll."
"Your cash flow, mapped as far ahead as you need it."
Keep subhead as-is: "Built for businesses with unpredictable revenue."

2. Rewrite the intro paragraph under the hero
Currently: "Zensus is 13-week cash flow forecasting software for businesses with unpredictable revenue..."
Change to lead with what it's for, not the feature spec — e.g. "Zensus gives you a live, always-current picture of your cash position — so you're never caught off guard." Save the "13-week / knows your annual contract hits March 14" detail for the feature section further down.

3. Reorder sections
Move the pain section — "You check your bank every Monday and still aren't sure you can make payroll in six weeks" — to sit directly under the hero, before any mention of the 13-week mechanic. Then introduce the 13-week forecast as the flagship feature that resolves that pain, not as the headline identity.

4. Update meta tags / OG / Twitter card
Title, meta description, OG description/title, Twitter description/title all currently say "Your cash flow, mapped 13 weeks ahead" — these drive Google/social click-through, so they need to match whatever the new H1 becomes or we get mismatched clicks.

5. Leave untouched
Drill-down, scenarios, alerts, comparison table, how-it-works, FAQ, pricing — these already do feature→benefit translation correctly, no changes needed there.