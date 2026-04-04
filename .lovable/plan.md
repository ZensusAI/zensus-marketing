

# Move Integration Logos & Break Runway into 4 Sections

## Part 1: Move IntegrationLogos below Problem section

Current order: Hero → IntegrationLogos → IntegrationBanner → Problem → Runway

New order: Hero → IntegrationBanner → Problem → **IntegrationLogos** → Runway sections

This places the "Integrates with: QuickBooks / Plaid" strip directly after the "gut feeling" pain points, serving as a natural bridge into the solution sections.

## Part 2: Break RunwayFeature into 4 alternating sections

Replace the single `RunwayFeature` component with four focused sections, each using an alternating image-left / image-right layout.

### Section 1 — Connect your data (image right)
- Headline: "Connect in 60 seconds"
- Copy: Link your bank via Plaid, QuickBooks, or HubSpot. Data refreshes automatically when stale, with manual sync across all sources.
- Covers bullets: "Connect in 60 seconds" + "Always in sync"

### Section 2 — See your runway (image left)
- Headline: "See your zero-cash date"
- Copy: Know exactly which month you run out of cash — not a rough guess. Real-time runway calculation from your actual numbers.
- Covers bullet: "See your zero-cash date"

### Section 3 — Drill deeper (image right)
- Headline: "Drill down to any week or day"
- Copy: Click any month to see weekly cash flow, then drill into daily details. Subscription-aware projections show when annual and quarterly contracts actually hit your bank.
- Covers bullets: "Drill down" + "Subscription-aware projections"

### Section 4 — AI-powered scenarios (image left)
- Headline: "Ask 'what if?' and get answers"
- Copy: Have a conversation about your finances. Ask about hiring, churn, pricing changes, or subscription upgrades and see the projected impact instantly. Type or speak — Zensus has a built-in voice assistant.
- Covers bullet: "AI scenario analysis"

### Visual approach
- Each section alternates: odd sections have image on the right, even sections on the left.
- For now, all four sections will use the existing `runway-dashboard.png` as a placeholder image. You can swap in dedicated screenshots later.
- Each section gets its own green glow effect and border treatment matching the current style.

## Files Changed

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Move `IntegrationLogos` after `Problem`; replace single `RunwayFeature` with 4 new sub-section components |
| `src/components/landing/RunwayFeature.tsx` | Rewrite into 4 alternating sections (or split into separate files) |

