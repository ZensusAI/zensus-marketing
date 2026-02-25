

# Runway Feature Section Copy Redesign

## What Changes

Update headline, subline, and all 4 bullet points in `src/components/landing/RunwayFeature.tsx` to be integration-agnostic and outcome-focused instead of anchoring to QuickBooks.

## Changes to `src/components/landing/RunwayFeature.tsx`

### Headline + Subline
- **Current headline:** "Runway: Your QuickBooks Financial Copilot"
- **New headline:** "Know your exact runway — <span gradient>down to the month</span>"
- **Current subline:** "Connect QuickBooks in one click. We pull your financial data automatically and calculate your runway. Then ask questions to see how decisions impact your future."
- **New subline:** "Connect your bank account or QuickBooks. Zensus pulls your real numbers and shows exactly when cash runs out — and what to do about it."

### Bullet Points (outcome-driven)

| # | Current | New |
|---|---------|-----|
| 1 | One-click QuickBooks connection | Connect in 60 seconds — Link your bank account, QuickBooks, or both |
| 2 | Automatic data sync | Always up to date — Your revenue, expenses, and balances sync daily |
| 3 | Real-time runway calculation | See your zero-cash date — Know exactly which month you run out, not a rough guess |
| 4 | Conversational Q&A about your finances | Ask "what if?" and get answers — Simulate hiring, cutting costs, or raising prices before you commit |

### No layout/styling changes
Same two-column grid, same image, same check icons. Copy-only update.

## Files Changed

| File | Change |
|------|--------|
| `src/components/landing/RunwayFeature.tsx` | Updated headline, subline, and 4 bullet points |

