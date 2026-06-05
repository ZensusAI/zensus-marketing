# Three-Item Navbar + /use-cases Page

**Date:** 2026-06-05
**Status:** Approved pending user spec review
**Scope:** `src/components/landing/Navbar.tsx`, new `src/pages/UseCases.tsx`, route plumbing

## Goal

Restructure the marketing site navigation from four mixed entries (Product anchor, Integrations link, Resources dropdown, Security link) to exactly three dropdown menus: Product, Resources, Company. Add the missing destination page for Use Cases.

## Navigation structure

All three top-level entries become dropdowns using the existing `DesktopMenu` (Radix NavigationMenu, `forceMount` so links remain in prerendered HTML) and `MobileMenuGroup` components.

| Product | Resources | Company |
|---|---|---|
| Features → `/#features` (anchor) | Blog → `/blog` | About → `/about` |
| Integrations → `/integrations` | Changelog → `/changelog` | |
| Use Cases → `/use-cases` (new page) | FAQ → `/#faq` (anchor) | |
| Security → `/security` | | |

Each child keeps the existing pattern: label plus one-line description.

### Child descriptions

- Features: "Runway, alerts, and scenario planning in one view."
- Integrations: "Plaid, QuickBooks, HubSpot, and Slack."
- Use Cases: "Who Zensus is for and the problems it solves."
- Security: "How Zensus protects your financial data."
- Blog: "Guides, product updates, and announcements." (unchanged)
- Changelog: "Ship notes and what's new in Zensus." (unchanged)
- FAQ: "Quick answers about pricing, data, and setup."
- About: "The company and the founder behind Zensus."

## Navbar component changes

1. Extend `NavChild` with optional `isRoute?: boolean` (default `true`). Anchor children (`/#features`, `/#faq`) render as plain `<a href>` in both `DesktopMenu` and `MobileMenuGroup`, matching how the current top-level Product anchor works (full navigation from other routes, native jump on the homepage). Router children keep `Link`/`NavLink`.
2. Replace the `NAV` array with the three-menu structure above. `NavLinkItem` top-level entries become unused by the data but the type union and render branches stay (cheap, and future top-level links remain possible).
3. Active-state dots: `groupActive` already checks `pathname` against children; anchor children never match a pathname, which is correct.
4. No styling changes. Desktop spacing (`gap-8`) and the mobile accordion behavior are unchanged.
5. **Three independent `NavigationMenu.Root` instances** (one per dropdown), exactly as `DesktopMenu` works today. A single shared Root would require reworking the per-item panel positioning (`absolute left-0` anchors to the Root, not the Item). Three Roots keep the change minimal; the only trade-off is no Radix-coordinated hover handoff between adjacent menus, which the current site never had anyway.

## /use-cases page

New file `src/pages/UseCases.tsx`, modeled on the structure of existing static pages (Security/Integrations): Navbar, Helmet block, breadcrumb JSON-LD, content sections, FinalCTABand, Footer.

### Meta

- Title: `Use Cases · Zensus` (pattern matches other pages)
- Description: one extractable sentence naming the audiences (founders with variable revenue, annual contracts, seasonal income, usage-based pricing).
- Canonical `https://zensus.app/use-cases`, og/twitter tags, OG image `/og/use-cases.png`.
- Breadcrumb JSON-LD via `breadcrumbSchema([HOME_CRUMB, { name: "Use Cases", url: ... }])`.

### Content (GEO-structured: question-shaped H2s, lead-in lines, short standalone sentences)

- **Hero**: H1 "Who uses Zensus" plus a one-sentence answer covering the five audiences.
- **Section 1: SaaS founders with annual and quarterly contracts.** Lumpy revenue, runway that respects payment dates. Links: `/integrations/quickbooks`, 13-week forecast guide.
- **Section 2: Making payroll with confidence.** Projection to each payroll date, Slack alerts on the cash floor. Links: `/blog/will-i-make-payroll`, `/integrations/slack`.
- **Section 3: Agencies and client services with late payers.** Date inflows by actual payment behavior. Links: `/blog/what-is-cash-flow-forecasting`, `/integrations/plaid`.
- **Section 4: Seasonal and usage-based revenue.** Buffer sizing when inflows swing. Links: `/pricing`, cash flow guide.
- **Section 5: Hiring and runway scenario planning.** Ask the agent what a hire does to the zero-cash date. Links: `/#features`, `/security`.
- **FinalCTABand** (existing component).

No em-dashes anywhere. Real brand name in examples.

## Route plumbing (per CLAUDE.md checklist)

1. `src/App.tsx`: lazy `UseCases` route at `/use-cases`, above the catch-all.
2. `scripts/prerender.mjs`: add `/use-cases` to `STATIC_ROUTES`.
3. `scripts/generate-og.mjs`: add a `CARDS` entry (the script keeps its own list; verified it does not reuse `STATIC_ROUTES`): `{ slug: "use-cases", category: "Use Cases", title: "Who uses Zensus", subtitle: "Founders with annual contracts, seasonal revenue, usage-based pricing, and payroll on the line.", accent: "green" }`.
4. `scripts/generate-sitemap.mjs`: add `{ loc: "https://zensus.app/use-cases", changefreq: "monthly", priority: "0.7" }` to `STATIC_URLS`, regenerate `public/sitemap.xml`.
5. `public/llms.txt` and `public/llms-full.txt`: add a Use Cases link.

## Error handling

No new dynamic behavior: static page, existing dropdown primitives. The only failure mode is a missed plumbing step, which the verification list below catches.

## Testing / verification

No test runner exists. Verification is build-based:

- `npm run lint`: 0 errors.
- `npx vite build` + `node scripts/prerender.mjs`: pass; `dist/use-cases/index.html` exists and contains the H1, meta, and breadcrumb JSON-LD.
- Prerendered homepage HTML contains all dropdown links (Product, Resources, Company children) via `forceMount`.
- Manual: dev server check of desktop dropdowns, mobile accordion, anchor scrolling from `/use-cases` back to `/#features` and `/#faq`.

## Out of scope

- Pricing stays out of the nav (reachable via landing PricingPreview and footer).
- No new landing sections or use-case illustrations in v1.
- Footer link groups unchanged.
