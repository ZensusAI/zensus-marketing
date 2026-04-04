

# Add Section 1 Screenshot: "Connect in 60 seconds"

## Steps

1. **Copy uploaded screenshot** to `src/assets/integrations-screenshot.png`
2. **Generate a polished product shot** using the product-shot skill with the `aurora` preset (green tones match Zensus branding) — output to `src/assets/runway-connect.png`
3. **Update `RunwayFeature.tsx`** — Import the new image and use it for Section 1 (index 0) instead of the generic `runway-dashboard.png`. Keep the other 3 sections unchanged for now.

## Files Changed

| File | Change |
|------|--------|
| `src/assets/runway-connect.png` | New polished product shot |
| `src/components/landing/RunwayFeature.tsx` | Import `runway-connect.png`, use for first section only |

