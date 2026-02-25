

# How It Works Section Redesign

## What Changes

Expand from 3 steps to 4 in `src/components/landing/HowItWorks.tsx`, update subline, and use new copy and icons per the user's spec. Same card layout style, now in a 2x2 grid on desktop instead of 3-column.

## Changes to `src/components/landing/HowItWorks.tsx`

### Subline
- **Current:** "Get started in minutes, not hours"
- **New:** "From sign-up to runway number in under 2 minutes"

### Steps (3 → 4)

| # | Title | Description | Icon |
|---|-------|-------------|------|
| 1 | Connect your data | Link your bank account via Plaid, connect QuickBooks, or both. One click, no spreadsheets needed. | `Link` (lucide) |
| 2 | See your runway instantly | Get your exact months of runway, zero-cash date, and net burn rate — calculated from your real numbers. | `BarChart3` (lucide) |
| 3 | Simulate before you spend | Ask "What if I hire 2 people?" or "What if I cut marketing by 30%?" and see the impact on your runway in seconds. | `SlidersHorizontal` (lucide) |
| 4 | Talk to your finances | Ask questions by voice or text. Zensus explains your cash flow, flags risks, and suggests next moves. | `Mic` (lucide) |

### Layout change
- Grid switches from `md:grid-cols-3` to `md:grid-cols-2 lg:grid-cols-4` so all 4 steps sit in one row on large screens and 2x2 on medium.

### No other changes
Same section background, card styling, step number badges, and hover effects.

## Files Changed

| File | Change |
|------|--------|
| `src/components/landing/HowItWorks.tsx` | Updated subline, expanded to 4 steps with new copy and icons |

