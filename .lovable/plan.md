

# Pricing Section Redesign

## What Changes

Update `PricingPreview.tsx` (homepage) and `Pricing.tsx` (full page) with new copy, restructured feature list, removed free trial, and updated CTAs.

## Changes to `src/components/landing/PricingPreview.tsx`

### Subline
- **Current:** "One plan with everything you need to manage your runway"
- **New:** "Everything you need to see your financial future clearly"

### Remove free trial badge
- Delete the "7-day free trial" badge element

### Price anchoring
- Add line below price: `$199/mo — Less than a single hour with a fractional CFO`

### Features — replace 4 generic bullets with 2 grouped lists

**Data & Integrations**
- Bank account connection (Plaid)
- QuickBooks auto-sync
- CSV/Excel upload for forecasting
- Daily automatic data refresh

**Runway & Forecasting**
- Real-time runway calculation with zero-cash date
- Cash flow projections and burn rate tracking
- AI-powered what-if scenario modeling
- Expense categorization across 7 business categories

### CTA button
- **Current:** "Start Free Trial"
- **New:** "Get Started" (same link)

### Bottom link
- **Current:** "View full pricing details" linking to /pricing
- **New:** "Have questions? Talk to us" linking to /#faq

## Changes to `src/pages/Pricing.tsx`

Same changes mirrored:
- Updated subline
- Removed free trial badge
- Added price anchoring line
- Replaced feature list with the same 2 grouped sections
- Updated CTA from "Start Your 7-Day Free Trial" to "Get Started"
- Removed "No credit card required" note
- Updated billing note from "Billed monthly • Cancel anytime" (keep as is, it's fine)

## Files Changed

| File | Change |
|------|--------|
| `src/components/landing/PricingPreview.tsx` | Full copy and structure redesign |
| `src/pages/Pricing.tsx` | Matching updates |

