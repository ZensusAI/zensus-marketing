

# README Update + Book Demo Calendly Integration

## 1. Update README.md

Replace the generic Lovable template README with a professional Zensus-branded README:
- Product name, tagline, and description (AI-powered cash flow forecasting for founders)
- Tech stack (React, Vite, TypeScript, Tailwind CSS, shadcn/ui)
- Local development setup instructions
- Links to live site (zensus.ai) and app (app.zensus.app)

## 2. Switch "Book Demo" from Cal.com to Calendly popup

### In `index.html`
- Add Calendly widget CSS and JS in `<head>`:
  - `<link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">`
  - `<script src="https://assets.calendly.com/assets/external/widget.js" async>`

### In `src/components/landing/Navbar.tsx`
- Remove `@calcom/embed-react` import and the Cal.com `useEffect` initialization
- Remove all `data-cal-*` attributes from both desktop and mobile Book Demo buttons
- Add `onClick` handler that calls `Calendly.initPopupWidget({ url: 'https://calendly.com/hello-zensus/introcall' })` on both buttons
- Add a TypeScript type declaration for `window.Calendly` (either inline or in `vite-env.d.ts`)

### Cleanup
- Optionally remove `@calcom/embed-react` from `package.json` since it will no longer be used

## Files Changed

| File | Change |
|------|--------|
| `README.md` | Full rewrite with Zensus branding |
| `index.html` | Add Calendly widget CSS/JS |
| `src/components/landing/Navbar.tsx` | Replace Cal.com with Calendly popup |
| `src/vite-env.d.ts` | Add Calendly type declaration |

