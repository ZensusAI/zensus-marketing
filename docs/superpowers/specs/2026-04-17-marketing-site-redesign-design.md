# Zensus Marketing Site Redesign (Phase 1)

**Date:** 2026-04-17
**Status:** Design approved by founder, ready for spec review and implementation plan.
**Repo:** `/Users/ajin/GitHub/zensus-marketing-migration`
**Deploy target:** `zensus.app` (product app lives separately at `app.zensus.app`).

## Overview

A substantial redesign of the Zensus marketing site with two explicit goals: credibility (founders of 10 to 100 person businesses need to trust a financial tool before they pay) and differentiation (move away from the shadcn-default SaaS aesthetic). Positioning and copy stay close to current. The distribution model is shifting to sales-led, so the site loses its free-trial language and its public pricing, and the primary CTA everywhere becomes "Talk to us".

The redesign also ships a real information architecture (dedicated Security page, dedicated Integrations hub with per-integration detail pages) instead of stuffing trust signals into a single FAQ answer.

## Goals

**In scope (Phase 1):**
1. Credibility. Concrete outputs: a trust bar directly under the hero with integration logos plus security claim chips, a dedicated `/security` page, a new homepage Security strip, and real per-integration detail pages that replace hand-waving.
2. Differentiation. Concrete outputs: Geist typography replacing Inter, a disciplined dark "Financial instrument" palette with signal-only accent usage, Integrations-led navigation, and a hero motion (chunked typewriter plus blur-fade plus rotating scenario prompt) that nobody else in the category does.

**Out of scope (explicit):**
- Positioning rewrite or wholesale H1 change. The hero is tightened to two sentences but keeps the same promise.
- Conversion-rate optimization tactics. We are sales-led; the conversion event is the call, not a sign-up form.
- Mobile app product mention. The product mobile app is being sunset in the product repo.
- Interactive sandbox demo.
- Customer testimonials and case studies (no real ones exist yet).
- Changelog page and nav item.
- Founder note homepage block.

## Context and prior session work

An earlier pass in this repo added a Slack Alerts panel to `RunwayFeature.tsx`, removed voice-assistant claims from the FAQ and feature panel 4, tuned the webhook-sync language, strengthened the security FAQ to AES-256-GCM plus account-level isolation, refreshed the pricing bullet list, and reframed the Blog to case-study placeholders. Those edits stand; this redesign builds on top of them.

An independent UX audit of the product repo (`/Users/ajin/GitHub/zensus`) verified which product features are real and which are marketing. Verified features that this spec counts on: Plaid, QuickBooks, and HubSpot integrations with webhook-driven real-time sync; Level 1 to 3 scenario drill-down with baseline-vs-scenario side-by-side; Slack cash-crunch alerts with material-change matrix; vendor normalization; AES-256-GCM on integration tokens; Semgrep plus gitleaks in CI; CSV export (no CSV import; the product is fully integration-powered).

## Design decisions

### 1. Visual direction: Financial instrument

Dark, precise, signal-driven. Reference points: Stripe docs, Bloomberg terminal, a well-kept ledger. Accent color does not decorate; it signals.

### 2. Color tokens

`src/index.css` uses HSL channel notation (`--background: 220 20% 4%;` with `hsl(var(--background))` at the call site). New tokens keep that convention. Hex values are provided alongside HSL for visual reference.

| Role | Hex | HSL channel | Notes |
|---|---|---|---|
| Background | `#0A0A0B` | `240 7% 4%` | Near-black, not pure black |
| Foreground | `#F7F5F2` | `36 27% 96%` | Warm off-white, not pure white |
| Accent: positive / primary | `#21C55C` | `142 71% 45%` | Current green, keep |
| Accent: caution | `#F59E0B` | `38 92% 50%` | Amber, for UI alerts only |
| Accent: negative | `#EF4444` | `0 84% 60%` | Red, for critical UI states only |
| Border subtle | `#1F1F22` | `240 5% 13%` | Card borders, dividers |
| Surface raised | `#14161A` | `220 13% 9%` | Scenario prompt, bento tiles |

Token names in `src/index.css` keep their existing identifiers where values are compatible; add new CSS variables for `--caution`, `--surface-raised` as needed.

**Signal-only discipline.** The three accent colors (green, amber, red) appear only for:
- Live data signals in product screenshots.
- The primary CTA button background.
- The scenario prompt border and caret in the hero.
- Dots in the trust bar chips and security strip.
- The Hero H1 gradient span (one instance on one page).

They never appear as decorative fills, heading treatments elsewhere, or anywhere the content itself is not a signal.

### 3. Typography

| Role | Family | Weights |
|---|---|---|
| Display (H1, H2) | Geist Sans | 500, 600, 700 |
| Body | Geist Sans | 400, 500 |
| Mono (numbers, labels, chips) | Geist Mono | 400, 500, 600 |

Both families from Google Fonts, free and open source. Dollar amounts and statistical callouts always render in Geist Mono with `font-variant-numeric: tabular-nums`.

**Current state check:** There is no Inter `<link>` in `index.html` today. Inter lives only in `tailwind.config.ts` as the `fontFamily.sans` and `fontFamily.display` stack, which falls through to the browser's system Inter or nothing. Geist therefore needs to be loaded fresh, not replaced.

**Implementation:**
- Add Google Fonts `<link>` tags in `index.html` for Geist (weights 400/500/600/700) and Geist Mono (weights 400/500/600). Preconnect to `fonts.googleapis.com` and `fonts.gstatic.com` in the `<head>` as Google recommends.
- Update `tailwind.config.ts`: swap the Inter entries in `fontFamily.sans` and `fontFamily.display` for Geist, with `system-ui, sans-serif` as fallback. Add `fontFamily.mono: ["Geist Mono", "ui-monospace", "monospace"]`.
- Apply `font-mono` class and `font-variant-numeric: tabular-nums` (via Tailwind's `tabular-nums` utility) wherever dollar figures or stat callouts appear.

### 4. Gradient discipline

The gradient accent lives on one phrase, on one page, once: "about it." in the Hero H1.

**Files to update:**
- `src/components/landing/Hero.tsx`: keep the gradient span, it stays on "about it."
- `src/components/landing/Problem.tsx`: remove gradient span around "gut feeling".
- `src/components/landing/HowItWorks.tsx`: remove gradient span around "works".
- `src/components/landing/PricingPreview.tsx`: remove gradient span around "transparent pricing".
- `src/components/landing/FAQ.tsx`: remove gradient span around "questions".
- `src/pages/Pricing.tsx`: remove gradient span around "transparent pricing".
- `src/pages/Blog.tsx`: remove gradient span around "Blog".

The `.text-gradient` CSS class itself stays in `src/index.css` because Hero still uses it.

### 5. Navigation

Primary nav, left to right: **Product · Integrations · Plans · Security**. Secondary: **Sign in** · **Talk to us** (green pill, primary CTA).

Rules:
- "Features" renamed to **Product**, points to `/#features` anchor on homepage.
- **Integrations** links to `/integrations` index page.
- "Pricing" renamed to **Plans**, points to `/pricing` (which now shows the hidden-amount Talk to us block). Renamed because a nav label that says "Pricing" pointing at a page that says "Talk to us for pricing" is incoherent.
- **Security** links to new `/security` page.
- **FAQ** removed from nav. Still exists as a homepage section with a scroll anchor.
- **Book Demo** removed from primary nav entirely. The Calendly link moves into `src/components/landing/Footer.tsx` as a small "Book a call with the team" footer entry. Definitive, not optional.
- **Get Started** renamed to **Talk to us** (primary CTA, routes TBD during implementation, likely Calendly or a contact flow).
- **Sign in** added as secondary CTA for returning customers. Routes to `app.zensus.app/login`.

**Mobile:** Hamburger sheet collapses to the same four links plus Sign in, with a sticky-bottom "Talk to us" pill button. Sticky-bottom CTA is a new pattern; implement via fixed positioning inside the mobile sheet.

**File:** full rewrite of `src/components/landing/Navbar.tsx`. Logo mark stays.

### 6. Distribution and CTA

- No free trial anywhere on the site.
- No dollar amount visible on any marketing surface.
- Primary CTA on every page, every section, every card: **Talk to us**. Destination URL decided at implementation (Calendly, contact form, or internal pipeline).
- Secondary CTA: Sign in. Routes to `app.zensus.app/login`.
- Pricing page replaces the $199 card with a Talk-to-us block.

The backend reality of the current Stripe self-serve flow is handled by the founder in the sales conversation (per founder's explicit instruction this session). This spec does not attempt to reconcile the marketing promise with the current app behavior.

### 7. Hero

**Copy:**
- H1 (two sentences): "Know exactly when your cash runs out. And exactly what to do about it."
- Gradient accent class on the phrase "about it."
- Subhead: "Connect your bank, QuickBooks, and HubSpot. Runway that matches the calendar, not a rough monthly average."
- Primary CTA: "Talk to us" pill button (green fill, dark foreground, right arrow).

**Motion (first visit, no `zensus-hero-seen-v1` entry in `localStorage`):**
1. Sentence 1 typewrites at 40 ms per character. Caret blinks during. Total about 1.5s.
2. Sentence 2 fades in as a block with a simultaneous blur-to-focus transition: `filter: blur(8px) -> blur(0)` over 350 ms, paired with `opacity: 0 -> 1` over 350 ms.
3. 200 ms pause.
4. Scenario prompt fades in from below (opacity 0 to 1, translateY 8px to 0, over 400 ms).
5. Scenario prompt begins its rotation.
6. `zensus-hero-seen-v1` is written to `localStorage`.

**Return visit (entry present):** H1 renders in final state immediately. Scenario prompt visible from first paint. Rotation runs as normal.

**Scenario prompt content (rotating, 5s per phrase, 20s total loop):**
1. "Can I afford to hire two engineers in Q3?"
2. "When do we run out if our biggest client churns?"
3. "What happens with 5% monthly churn?"
4. "What if we raise prices 15% in January?"

**Accessibility:** Respect `prefers-reduced-motion: reduce`. When set, skip the typewriter and the blur-fade entirely, render final state immediately, keep the prompt rotation but switch it to a plain opacity crossfade with no translateY.

**Implementation:**
- Rewrite `src/components/landing/Hero.tsx` as a self-contained component.
- Extract the rotating prompt to `src/components/landing/ScenarioPrompt.tsx`. Keeps the Hero file readable.
- Typewriter runs in a `useEffect` with cleanup on unmount. Prompt rotation uses CSS keyframes, no JS timer.
- No new motion library dependency (Framer Motion etc.).

**`localStorage` key:** `zensus-hero-seen-v1`. Versioned key documented in Maintenance notes at the end of this spec; not a Phase 1 task.

### 8. Trust bar (section 02)

New component: `src/components/landing/TrustBar.tsx`. Rendered directly under Hero.

**Content:**
- Row of four integration logos: Plaid, QuickBooks (Intuit), HubSpot, Slack. Real brand marks from each company's media kit.
- Below logos, four mono chips with green dot bullets:
  1. Bank-level OAuth
  2. AES-256-GCM at rest
  3. Account-level isolation
  4. Credentials never stored

Logos import from `src/assets/integrations/`. **Directory does not exist yet; create it in Milestone 2 and seed with placeholder SVGs until real brand files are sourced.**

### 9. Homepage flow

Full reorder. `src/pages/Index.tsx` renders:

| Order | Render | File / Source | Status |
|---|---|---|---|
| 01 | Hero | `src/components/landing/Hero.tsx` | Full rewrite |
| 02 | Trust bar | `src/components/landing/TrustBar.tsx` | New |
| 03 | Problem | `src/components/landing/Problem.tsx` | Rewrite pain point index 1 |
| 04 | Feature: Subscription drill-down | `RunwayFeature.tsx` `sections[0]` (was index 2) | Reorder, keep content |
| 05 | Feature: Scenarios | `RunwayFeature.tsx` `sections[1]` (was index 4 after earlier edit) | Reorder, keep content, drop "type or speak" line already done |
| 06 | Feature: Alerts | `RunwayFeature.tsx` `sections[2]` (was index 3 after earlier edit) | Reorder, keep content; image stays `/placeholder.svg` per deferral below |
| 07 | Bento | `src/components/landing/Bento.tsx` | New |
| 08 | How it works | `src/components/landing/HowItWorks.tsx` | Copy refresh only |
| 09 | Security strip | `src/components/landing/SecurityStrip.tsx` | New |
| 10 | Pricing preview | `src/components/landing/PricingPreview.tsx` | Rewrite to hidden amount |
| 11 | FAQ | `src/components/landing/FAQ.tsx` | Pricing category rewrite only |
| 12 | Final CTA band | `src/components/landing/FinalCTABand.tsx` | New |
| 13 | Footer | `src/components/landing/Footer.tsx` | Add Calendly "Book a call" entry |

**Section 04 to 06 stay as entries in the existing `RunwayFeature` component's `sections` array.** They are not separate components. `RunwayFeature.tsx` still renders a single multi-panel section; we are only reordering and pruning the `sections` array from 5 entries to 3 (Subscription drill-down, Scenarios, Alerts). Connect and Zero-cash move into the bento.

**Alerts panel image deferral:** The Alerts panel image stays `/placeholder.svg` through Phase 1. Founder to provide a real Slack alert screenshot at their convenience; swap is a trivial one-line edit that does not block Phase 1 sign-off.

Panels 01 to 06 are now the "above the scroll fatigue" zone. Features lead with the three differentiators.

### 10. Feature sections (04 to 06) refactor

Current `RunwayFeature.tsx` renders 5 stacked panels from a `sections` array. Keep the `RunwaySection` component. Rewrite the array to three entries in this order:

1. Subscription drill-down (currently "Drill down to any week or day", index 2).
2. Scenarios (currently "Run scenarios with your runway agent", index 4 after earlier edits).
3. Alerts (currently "Get alerted before cash runs out", index 3 after earlier edits).

Remove from the array: Connect (index 0) and Zero-cash (index 1). Delete the now-unused imports `runwayConnect` and `runwayZerocash`.

The `imageRight: i % 2 === 0` rule still alternates cleanly across three panels (right, left, right).

### 11. Problem block rewrite (section 03)

`src/components/landing/Problem.tsx` currently has four pain points. Rewrite the second one to surface the CSV-paste anti-pattern (this is where the "integration-powered" angle lands).

**Old (index 1):**
- Title: `Logging into 3 tools to get 1 answer`
- Description: `Your bank, QuickBooks, and a spreadsheet that's always outdated`

**New (index 1):**
- Title: `Still pasting CSVs from three different tools`
- Description: `Every export is stale the moment it downloads. Zensus pulls live from every source, no manual imports ever`

Keep the other three pain points as-is. Also remove the `.text-gradient` span around "gut feeling" in the H2.

### 12. Bento block (section 07)

New component: `src/components/landing/Bento.tsx`. 2x2 grid.

| # | Title | Body | Icon |
|---|---|---|---|
| 1 | Connect in 60s | OAuth to Plaid, QuickBooks, HubSpot. No spreadsheets, no CSV uploads. | `Link2` |
| 2 | Real-time webhook sync | The moment a transaction clears, your runway updates. | `Zap` |
| 3 | Zero-cash date | The exact day you run out, recalculated live. | `Target` |
| 4 | Vendor normalization | Stripe payouts, ACH transfers, and card purchases all reconcile cleanly. | `Shuffle` |

Each tile: `#14161A` background, `#1F1F22` border, icon in green accent, title in Geist Sans 600, body in Geist Sans 400 at 0.75 foreground opacity.

### 13. How it works (section 08, condensed)

`src/components/landing/HowItWorks.tsx` already has three steps. Refresh the copy to match the sales-led motion:

1. **Connect your data.** OAuth to Plaid, QuickBooks, or HubSpot. All three if you want. No uploads.
2. **See your runway live.** Zero-cash date, day-by-day drill-down, and scenario chat ready in 60 seconds.
3. **Set your alert threshold.** Slack pings you the moment your 30-day projection crosses the line.

Remove the gradient span around "works" in the H2.

### 14. Security strip (section 09)

New component: `src/components/landing/SecurityStrip.tsx`.

Compact 3-column strip with an icon, title, and one-line description per column:

| # | Title | Body |
|---|---|---|
| 1 | Encryption | AES-256-GCM at rest, TLS in transit, across every data path. |
| 2 | Isolation | Every database query is filtered by account. No cross-account access, ever. |
| 3 | Never stored | Bank and QuickBooks credentials live in Plaid and Intuit OAuth. Zensus holds tokens, not passwords. |

Ends with a link "See our full security posture" to `/security`.

### 15. Pricing preview (section 10, rewrite)

Rebuild `src/components/landing/PricingPreview.tsx`. Remove:
- The `$199/month` block.
- "Less than a single hour with a fractional CFO" line.
- "Get Started" button to `app.zensus.app/login`.
- Both feature lists (`dataFeatures`, `runwayFeatures`). These move to `/pricing` only.

New content: single centered card, Geist typography, dark surface:
- Heading: "Pricing is tailored to your business"
- Paragraph: "Every Zensus account is configured around your data sources and your team shape. We'll walk you through what it looks like for you on a call."
- Primary CTA: Talk to us.

### 16. Final CTA band (section 12)

New component: `src/components/landing/FinalCTABand.tsx`. Sits between FAQ and Footer.

- H2: "Ready to see your real runway?"
- Subhead: "Connect your data in 60 seconds. We'll walk you through it on the call."
- CTA: Talk to us.

No gradient treatment on the H2.

### 17. FAQ rewrites (`src/components/landing/FAQ.tsx`)

Keep the four-category structure (Getting Started, Product, Trust & Security, Pricing).

**Pricing category changes:**
- Remove Q: "Can I cancel anytime?"
- Add Q: "How does pricing work?"
- A: "Zensus pricing is tailored to your business size and data volume. We'll walk you through what it looks like for you on the call."

All other categories keep their current questions. The Alerts Q added in the prior session stays. The webhook-sync A and AES-256-GCM A stay. The voice assistant line was already removed in the prior session.

Remove the gradient span around "questions" in the H2.

### 18. Pricing page rewrite (`src/pages/Pricing.tsx`)

Full rewrite of the main card area. Keep the page shell (Navbar, Footer, section structure).

- H1: "Pricing is tailored to your business" (no gradient).
- Single block: short paragraph explaining the sales-led approach, the feature lists (`dataFeatures`, `runwayFeatures`) as value reinforcement without dollar amounts, and a Talk to us CTA.
- Remove the "Billed monthly · Cancel anytime" line.
- Remove the "Less than a single hour with a fractional CFO" line.
- Remove the three FAQ entries (trial, annual, cancel). Page ends with a link to the homepage FAQ.

### 19. Navbar rewrite (`src/components/landing/Navbar.tsx`)

Full rewrite of the link list. Desktop:
- Logo + "Zensus" mark (unchanged).
- Links: Product, Integrations, Plans, Security.
- CTAs: Sign in (ghost button), Talk to us (green pill).

Mobile:
- Hamburger opens a sheet.
- Sheet contents: same four links stacked, then Sign in.
- Sticky-bottom Talk to us pill button that stays pinned regardless of sheet scroll.

Remove the `Calendar`/`Book Demo` link entirely from primary nav. Calendly link moves to `Footer.tsx` as a small "Book a call with the team" footer entry. This is definitive and matches Section 5.

### 20. New pages

All detail integration pages share a single `IntegrationPage` component.

#### `/security` page (`src/pages/Security.tsx`)

Full-width page following the dark design system. Sections:

1. Hero: H1 "How Zensus handles your financial data", subhead one sentence.
2. Data flow: simple SVG diagram. User -> OAuth (Plaid / Intuit / HubSpot) -> Zensus -> AWS.
3. What Zensus stores: OAuth tokens (encrypted AES-256-GCM), derived runway projections, scenario chat history for your account only.
4. What Zensus never stores: bank or QuickBooks passwords, payment cards, raw transactions outside the sync window.
5. Account isolation: every DB query filtered by user ID, no cross-account access for any Zensus staff or system.
6. CI security: Semgrep SAST on every commit, gitleaks secret scanning. (Synthetic API monitoring on api.zensus.app exists in the product repo but is not yet verified shipped-to-prod for the public-facing claim; confirm during implementation before naming it on this page.)
7. AI training: your data never trains any AI model. Claude is called per-request; nothing is persisted for fine-tuning or memory.
8. Compliance posture: honest current state. "SOC 2 not yet certified. We're working toward it; in the meantime our data-protection and access-control practices are documented and reviewable on request."
9. Contact: security@zensus.app for security questions.
10. Talk to us CTA.

#### `/integrations` index (`src/pages/Integrations.tsx`)

1. Hero: H1 "Every number on Zensus comes from a live integration", subhead "No CSV uploads, no spreadsheets, no manual data entry."
2. Grid of four integration cards: Plaid, QuickBooks, HubSpot, Slack. Each has logo, one-line description, "Learn more" link to its detail page.
3. Trust chips (same four as the TrustBar).
4. Talk to us CTA.

#### `IntegrationPage` shared component (`src/components/integrations/IntegrationPage.tsx`)

Takes props for integration slug, display name, logo, and section content. Each detail page is a thin wrapper passing the props.

Sections per page (structure shared, content varies):
1. Hero: logo + H1 "Connect your [bank / QuickBooks / HubSpot / Slack] with Zensus".
2. What Zensus reads from this integration.
3. What Zensus does NOT read (explicit, builds trust).
4. How it works: connection flow (OAuth), sync cadence (webhooks), data freshness expectations.
5. How to disconnect: one paragraph, step-by-step.
6. Security specifics for this integration.
7. Talk to us CTA (default copy across all pages, no softening).

#### Per-integration detail pages

- `src/pages/integrations/Plaid.tsx`
- `src/pages/integrations/QuickBooks.tsx`
- `src/pages/integrations/HubSpot.tsx`
- `src/pages/integrations/Slack.tsx`

Content is integration-specific, structure is shared via `IntegrationPage`.

**Content authoring load:** The four integration pages require real copy for each of the seven sections. That is 28 content blocks total. This is explicitly part of Milestone 5 and not trivial. Copy can be drafted by referencing the product repo (`/Users/ajin/GitHub/zensus/apps/backend/src` for each integration module) and validated against `app.zensus.app/settings/integrations` UI behavior. Budget time accordingly.

#### Routing (`src/App.tsx`)

Add above the catch-all `*` route:

```tsx
<Route path="/security" element={<Security />} />
<Route path="/integrations" element={<Integrations />} />
<Route path="/integrations/plaid" element={<PlaidIntegration />} />
<Route path="/integrations/quickbooks" element={<QuickBooksIntegration />} />
<Route path="/integrations/hubspot" element={<HubSpotIntegration />} />
<Route path="/integrations/slack" element={<SlackIntegration />} />
```

The comment `ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE` in `App.tsx` remains accurate.

### 21. Cleanup

- Delete `src/components/landing/Testimonials.tsx` entirely (not just unrouted).
- Remove the unused `runwayDashboard` import from `RunwayFeature.tsx`.
- Remove `runwayConnect` and `runwayZerocash` imports after the panels are cut.
- Swap Inter font loading for Geist in `index.html`, `tailwind.config.ts`.
- Remove `.text-gradient` usages in Problem, HowItWorks, PricingPreview, FAQ, Pricing, Blog (keep the class definition in `src/index.css`).

### 22. Shared CTA component

Multiple sections (`Hero`, `PricingPreview`, `SecurityStrip`, `FinalCTABand`, `Security` page, `Integrations` pages, and potentially the Navbar pill) all render a "Talk to us" button with identical appearance and destination. Centralize this as `src/components/landing/TalkToUsButton.tsx`.

Props: size (sm/md/lg), variant (primary pill / ghost link), optional trailing icon. Consumes a single URL constant exported from `src/lib/constants.ts` so the destination (Calendly URL or contact form) lives in exactly one place.

Building this in Milestone 2 means every subsequent milestone just imports and uses it; no copy-paste CTAs that drift out of sync.

### 23. SEO and meta

- Update `public/sitemap.xml` to include every new route.
- Add page-specific `<title>`, `<meta name="description">`, and OpenGraph tags to each new page component.
- `public/robots.txt` needs no changes (the new routes are all indexable).

**Implementation detail:** React Router v6 alone cannot set per-route `<title>` or meta tags. Install `react-helmet-async` (or an equivalent) and wrap the app with `<HelmetProvider>` in `src/App.tsx`. Each new page component then renders a `<Helmet>` block with its route-specific meta. Added as a Phase 1 dependency.

## Phase 1 build plan

Seven sub-milestones, reviewable independently.

### Milestone 1: Foundation
Lowest risk, unblocks everything downstream.

- Swap Inter for Geist in `index.html` and `tailwind.config.ts`.
- Add new color tokens to `src/index.css` (keep existing variable names where the new value is compatible; add amber and raised surface).
- Delete `Testimonials.tsx`.
- Remove unused font and image imports.
- Remove `.text-gradient` uses from Problem, HowItWorks, PricingPreview, FAQ, Pricing, Blog.

### Milestone 2: Hero and trust bar
Highest-visibility change.

- Rewrite `Hero.tsx` with two-sentence H1, chunked typewriter, blur-fade sentence 2, scenario prompt, `localStorage` first-visit gate, `prefers-reduced-motion` respect.
- Extract `ScenarioPrompt` component.
- Create `src/assets/integrations/` directory with placeholder SVG logos (Plaid, QuickBooks, HubSpot, Slack). Real brand marks from each media kit swap in later.
- Build `TrustBar.tsx`.
- Build shared `TalkToUsButton` component (see Section 22). All subsequent milestones reference this one component rather than redefining the CTA.
- Render Hero and TrustBar in `Index.tsx`.
- Draft the Milestone 7 manual QA checklist in parallel so later milestones can test against it as they ship.

### Milestone 3: Homepage rearchitecture

- Rewrite Problem pain point index 1.
- Reorder `RunwayFeature.tsx` sections array to differentiator-first, remove Connect and Zero-cash panels, drop unused imports.
- Build `Bento.tsx`.
- Compact `HowItWorks.tsx` copy.
- Build `SecurityStrip.tsx`.
- Rewrite `PricingPreview.tsx` to hidden-amount.
- Build `FinalCTABand.tsx`.
- Update `Index.tsx` composition to the new 13-section order.

### Milestone 4: Navigation

- Rewrite `Navbar.tsx` with the new link list, CTAs, and mobile sticky button.

### Milestone 5: New pages
Can run in parallel once `IntegrationPage` exists. Content authoring is the dominant cost here, not component code.

- Install `react-helmet-async` and wrap app in `<HelmetProvider>` in `src/App.tsx`.
- Build `IntegrationPage` shared component.
- Build `Security.tsx` page (structure plus copy for all ~10 sections).
- Build `Integrations.tsx` index (structure plus four card blurbs).
- Build four per-integration detail pages (structure plus seven content blocks each, 28 content blocks total; reference the product repo at `/Users/ajin/GitHub/zensus/apps/backend/src` to get the facts right).
- Add routes in `App.tsx` above the catch-all.

### Milestone 6: FAQ and Pricing page

- Update `FAQ.tsx` Pricing category questions.
- Rewrite `Pricing.tsx` around the Talk-to-us block.
- QA pass for legal-copy orphans (billing timing language, automatic renewal wording, anything that assumed a self-serve trial or auto-charge flow). Flag anything that needs to stay for regulatory reasons.

### Milestone 7: SEO and polish

- Update `sitemap.xml`.
- Add page-specific meta tags to every new page.
- Manual QA on desktop and mobile.
- Confirm `/forecast`, `/privacy`, `/support`, `/features` still redirect as expected.

## Phase 2 deferrals

None of these block Phase 1.

- Founder note block on homepage, between Pricing and FAQ.
- Changelog page and nav item.
- Customers and case studies surface.
- Interactive sandbox demo.
- Real case-study blog posts.

## Open implementation questions

These do not block the design. Implementation will resolve them.

1. Real brand logo files. Plaid, Intuit, HubSpot, and Slack all publish media kits permitting "works with" usage. Source these before launch; use placeholder SVGs during development.
2. Talk-to-us destination URL. Calendly, a contact form, or an internal pipeline. Founder decides at implementation.
3. Hero scenario prompt clickability. The earlier audit flagged the opportunity to have clicking a prompt deep-link into the product with the question prefilled. Requires product-side support. Out of Phase 1 unless trivial.
4. Blog page treatment. The Blog page was reframed to case-study placeholders in an earlier session. Decide during Phase 1 whether to keep it in the nav or move it to the footer until real content exists. This spec's nav choice (Integrations-led) does not include Blog; confirm that is acceptable.

## Success criteria for Phase 1

- `npm run build` passes.
- `npm run lint` passes with no new errors beyond the pre-existing baseline below.
- Every route renders without console errors on desktop and mobile.
- Manual QA walk-through passes (checklist drafted in Milestone 2, used continuously through Milestone 7).
- No em-dashes in any generated or authored copy.
- Founder confirms the Hero motion feels right when tested in an actual browser, not in a mockup.
- `prefers-reduced-motion: reduce` users see the final Hero state without the typewriter or blur-fade, and still see the rotating prompt with reduced transform.

### Pre-existing lint baseline (do not regress)

Captured at 2026-04-17 from `npm run lint`. These are inherited from shadcn/ui component templates and Tailwind config; leave alone.

Errors (3):
- `src/components/ui/command.tsx:24:11` `@typescript-eslint/no-empty-object-type`
- `src/components/ui/textarea.tsx:5:18` `@typescript-eslint/no-empty-object-type`
- `tailwind.config.ts:111:13` `@typescript-eslint/no-require-imports`

Warnings (7): `react-refresh/only-export-components` across various shadcn UI files (`button.tsx`, `form.tsx`, `navigation-menu.tsx`, `sidebar.tsx`, `sonner.tsx`, `toggle.tsx`, plus one more). Tolerated.

Milestone gate: every milestone's PR runs `npm run lint` and the count of problems must equal the baseline exactly.

## Maintenance notes (not Phase 1 tasks)

These guide future edits once Phase 1 ships.

- **Hero `localStorage` key versioning.** Key is `zensus-hero-seen-v1`. If the Hero copy or motion changes meaningfully in a later edit, bump to `zensus-hero-seen-v2` so returning visitors see the new animation once. Stale keys can be cleaned up in a subsequent bump.
- **Alerts panel image.** `/placeholder.svg` is temporary. When a real Slack alert screenshot is available, drop it into `src/assets/` and swap the `image:` line in `RunwayFeature.tsx`. One line edit.
- **Testimonials slot.** Deleted from this repo entirely. If a real customer testimonial lands, do not resurrect the deleted file; build a fresh component so the new code has no legacy assumptions.
- **Changelog, founder note, case studies.** Phase 2 candidates. When any of these ships, revisit this spec's homepage flow table and extend from section 11 downward (founder note between Pricing and FAQ, other additions between FAQ and Final CTA as appropriate).
