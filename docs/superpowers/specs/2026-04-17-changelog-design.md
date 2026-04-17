# Changelog Page Design (Phase 2)

**Date:** 2026-04-17
**Status:** Design approved by founder, ready for spec review and implementation plan.
**Repo:** `/Users/ajin/GitHub/zensus-marketing-migration`
**Branch:** `feat/phase1-redesign` (Phase 2 work stacks on top of Phase 1; Phase 1 not yet merged to main).

## Overview

Adds a public changelog at `/changelog`. Cadence is per-release (irregular, only when there is real news), format is a date-stamped feed with category tags (New / Improved / Fixed / Security), entries are short (2 to 4 sentences) and hand-authored. Nav swap: Changelog replaces Plans in primary nav; Plans demotes to Footer.

Purpose: give returning visitors a visible shipping-velocity signal without committing to weekly posts. Matches the Linear and Resend changelog pattern that founders recognize.

## Goals

**In scope:**
1. New `/changelog` route rendering a reverse-chronological feed.
2. Primary nav swap: Changelog replaces Plans. Plans moves to Footer alongside Privacy, Terms, and Book a call.
3. Six seed entries drafted from the product audit's verified features, which the founder will edit.
4. Sitemap and meta tags so search engines can index the page.

**Out of scope for this spec:**
- RSS feed.
- Category filtering UI.
- Per-entry permalinks or individual changelog-post routes.
- Images or screenshots in entries.
- Tags beyond the four categories.
- Auto-generation from git log.

## Design decisions

### 1. Route

`/changelog`. Added to `src/App.tsx` above the catch-all, matching the pattern used for `/security` and `/integrations` in Phase 1.

### 2. Nav swap

`src/components/landing/Navbar.tsx` currently has: `Product | Integrations | Plans | Security`. Change to: `Product | Integrations | Changelog | Security`. The `Plans` entry is removed from the desktop list and from the mobile sheet list.

The `/pricing` route itself is unchanged. The link relocates, the destination does not.

### 3. Footer update

`src/components/landing/Footer.tsx` currently has `Book a call | Privacy | Terms`. Add `Plans` to the list. Final order: `Book a call | Plans | Privacy | Terms`.

### 4. Page structure

New file: `src/pages/Changelog.tsx`. Route-level page using the same shell pattern as Blog and Security: Navbar, main content, Footer.

Main content:
- H1 "Changelog" with a one-line subhead ("What we have shipped, most recent first").
- `<Helmet>` block with `<title>Changelog · Zensus</title>`, meta description, og:title, og:description.
- Reverse-chronological list of entries. Entries are stored inline as a TypeScript array in the page module.

### 5. Entry shape

TypeScript type:

```ts
type ChangelogCategory = "New" | "Improved" | "Fixed" | "Security";

interface ChangelogEntry {
  date: string;           // ISO date, e.g. "2026-04-17"
  category: ChangelogCategory;
  title: string;
  body: string;
}
```

Rendering per entry (visual mock):
- Left column (desktop): date in Geist Mono, muted color, e.g. `2026 04 17`.
- Right column: category pill, then H3 title, then body paragraph.
- Stacks to single column on mobile.

Category pill colors (signal-only discipline, using existing tokens):
- `New`: `bg-primary/10 text-primary` (green).
- `Improved`: `bg-muted text-muted-foreground` (neutral).
- `Fixed`: `bg-[hsl(var(--caution))]/10 text-[hsl(var(--caution))]` (amber).
- `Security`: `bg-destructive/10 text-destructive` (red).

### 6. Data storage

Hardcoded TypeScript array in `src/pages/Changelog.tsx`, mirroring the existing `Blog.tsx` pattern. Every new post is a one-commit TypeScript edit. No JSON, no MDX, no CMS, no build step.

### 7. Initial seed

Six entries drafted from the Phase 1 product audit (founder will edit dates and copy before publishing):

```ts
const entries: ChangelogEntry[] = [
  {
    date: "2026-04-17",
    category: "New",
    title: "Slack cash-crunch alerts",
    body: "Set a dollar floor and Zensus fires a Slack alert the moment your 30-day projection crosses it. Re-alerts on material change: a week earlier breach or a 10% dip in minimum balance. Snooze or adjust your threshold directly from Slack.",
  },
  {
    date: "2026-04-14",
    category: "Improved",
    title: "Scenario drill-down with dual projection",
    body: "Scenarios now render side by side with the baseline at day level. Ask a question, see both numbers, decide. Works at month, week, and day granularity with stable scenario identity across levels.",
  },
  {
    date: "2026-04-10",
    category: "New",
    title: "Vendor normalization",
    body: "Stripe payouts, ACH transfers, and card purchases reconcile cleanly. Same-day internal transfers no longer show up as fake burn spikes. Your expense categories are meaningfully accurate now.",
  },
  {
    date: "2026-04-07",
    category: "Security",
    title: "External synthetic monitoring on api.zensus.app",
    body: "Route 53 health checks run against the API every minute from outside our infrastructure. If the API goes down, we get paged in Slack within one cycle. Built into the platform, no action required from you.",
  },
  {
    date: "2026-04-03",
    category: "Improved",
    title: "Subscription-aware projections for HubSpot deals",
    body: "Annual and quarterly contracts in HubSpot now flow into projections on their real billing dates, not smeared into monthly MRR. Your runway forecast respects contract cadence.",
  },
  {
    date: "2026-04-01",
    category: "Improved",
    title: "Real-time webhook sync across Plaid, QuickBooks, HubSpot",
    body: "When a transaction clears in Plaid, an invoice changes in QuickBooks, or a subscription updates in HubSpot, your runway recalculates. No more waiting for scheduled refreshes.",
  },
];
```

### 8. SEO

- `<Helmet>` block in `Changelog.tsx` with title, description, og tags.
- `public/sitemap.xml` gets a new `<url>` entry for `/changelog` with `<loc>`, today's `<lastmod>`, `<changefreq>weekly</changefreq>`, and `<priority>0.7</priority>`. This matches the existing entry pattern in the file.

### 9. Accessibility

- Semantic markup: `<article>` per entry, `<time dateTime="...">` for dates.
- Category pills use color plus text, never color alone.
- Reading order follows visual order.

## Implementation plan (rough shape)

Five small tasks, one commit each:

1. Create `src/pages/Changelog.tsx` with types, seed array, and rendering.
2. Add `/changelog` route in `src/App.tsx` above the catch-all.
3. Swap Plans for Changelog in `src/components/landing/Navbar.tsx` (desktop and mobile lists).
4. Add Plans entry to `src/components/landing/Footer.tsx` `legalLinks` array.
5. Add `/changelog` entry to `public/sitemap.xml` with today's `<lastmod>`.

Verification per task: `npm run build` passes, `npm run lint` stays at the Phase 1 baseline (3 errors + 7 warnings). Manual browser walk after Task 5 to confirm the full flow.

## Success criteria

- `npm run build` passes.
- `npm run lint` stays at 3 errors plus 7 warnings (the Phase 1 post-Navbar baseline).
- `/changelog` renders the six seed entries in reverse-chronological order.
- Primary nav shows `Product | Integrations | Changelog | Security` on desktop and in the mobile sheet.
- Footer shows `Book a call | Plans | Privacy | Terms`.
- Clicking Plans in Footer still lands on `/pricing` as before.
- No em-dashes anywhere in the new copy.

## Open implementation questions

- None. All design decisions are locked. Dates in the seed are the founder's to edit before merging to production.

## Maintenance notes

- Adding a new entry: edit the `entries` array at the top of `src/pages/Changelog.tsx`, commit. The invariant is that the array is authored in reverse chronological order (newest first). The component renders the array as-is, no sort at render time. Diffs stay legible, PR review is trivial.
- Category taxonomy is fixed at four values; adding a fifth requires updating the `ChangelogCategory` type and the pill-color map.
- If cadence slips and the page goes stale for months, consider demoting the nav link back to Footer rather than leaving a visibly stale Changelog in primary nav.
