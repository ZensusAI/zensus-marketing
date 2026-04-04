

# Remove CSV/Excel Upload from Pricing Feature Lists

The CSV/Excel upload feature has been removed from the product. Update the pricing feature lists in both files to remove it.

## Changes

### Data & Integrations (now 4 items)
1. Bank account connection (Plaid)
2. QuickBooks auto-sync
3. HubSpot subscription sync — add
4. Automatic data refresh when stale — update wording

### Runway & Forecasting (now 7 items)
Same as previously approved plan.

## Files Changed

| File | Change |
|------|--------|
| `src/components/landing/PricingPreview.tsx` | Remove "CSV/Excel upload" from `dataFeatures`, add HubSpot, update refresh wording, update `runwayFeatures` per prior plan |
| `src/pages/Pricing.tsx` | Same changes |

