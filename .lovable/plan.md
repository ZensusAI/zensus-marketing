

# Remove Forecast Section & Revamp Runway Feature Section

## Step 1: Remove ForecastFeature section

- Remove `<ForecastFeature />` from `src/pages/Index.tsx` and its import
- Delete `src/components/landing/ForecastFeature.tsx`
- Delete `src/assets/forecast-dashboard.png` (if it exists and is unused elsewhere)

## Step 2: Update RunwayFeature section copy

**In `src/components/landing/RunwayFeature.tsx`:**

Keep the headline: *"Know your exact runway — down to the month"*

Update the description paragraph to:
> Connect your bank account, QuickBooks, or HubSpot. Zensus pulls your real numbers — including subscription billing schedules — and shows exactly when cash runs out and what to do about it.

Replace the 4 bullets with these 6:

1. **Connect in 60 seconds** — Link your bank account, QuickBooks, HubSpot, or all three
2. **Subscription-aware projections** — See when annual and quarterly contracts actually hit your bank, not just flat monthly estimates
3. **See your zero-cash date** — Know exactly which month you run out, not a rough guess
4. **Drill down to any week or day** — Click any month to see weekly cash flow, then drill into daily details
5. **AI scenario analysis** — Have a conversation about your finances. Ask about hiring, churn, pricing changes, or subscription upgrades and see the projected impact instantly
6. **Always in sync** — Data refreshes automatically when stale, with manual sync across all connected sources

## Files Changed

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Remove ForecastFeature import and usage |
| `src/components/landing/ForecastFeature.tsx` | Delete file |
| `src/components/landing/RunwayFeature.tsx` | Update description + bullets |

