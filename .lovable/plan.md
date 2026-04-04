

# Update FAQ Section

## Changes in `src/components/landing/FAQ.tsx`

### Getting Started (was 2 → now 3 questions)

1. **"Do I need QuickBooks to use Zensus?"** — Update answer:
   > "No. You can connect your bank account directly via Plaid, connect QuickBooks, sync your HubSpot subscriptions, or use any combination. No single integration is required to get started."

2. **"Can I connect my HubSpot account?"** — Add new:
   > "Yes. Zensus syncs your HubSpot subscriptions — including annual and quarterly contracts — so your runway projections reflect when revenue actually hits your bank, not just flat monthly estimates."

3. **"How long does setup take?"** — Keep as-is.

### Product (3 questions → 2, remove Forecast question)

1. ~~"What's the difference between Runway and Forecast?"~~ — **Remove.** The Forecast feature has been removed from the product.

2. **"What kind of questions can I ask?"** — Update answer:
   > "Anything about your finances. Examples: 'When will I run out of cash?', 'Can I afford to hire two engineers?', 'What if we lose our largest annual contract?', 'What happens with 5% monthly churn?', 'What if we switch a client from monthly to annual billing?' You can type or speak — Zensus has a built-in voice assistant."

3. **"How often does my data update?"** — Update answer:
   > "Your connected data syncs automatically whenever it's more than an hour stale — triggered each time you open the dashboard. You can also manually sync all sources at any time. Your runway recalculates in real-time as new data comes in."

### Trust & Security — No changes.

### Pricing — No changes.

## File Changed

| File | Change |
|------|--------|
| `src/components/landing/FAQ.tsx` | Update QuickBooks answer, add HubSpot FAQ, remove Forecast FAQ, update questions answer, update data refresh answer |

