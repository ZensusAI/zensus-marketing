# Phase 1 QA checklist

Run before declaring any milestone complete.

## Every milestone
- [ ] `npm run build` passes
- [ ] `npm run lint` matches baseline in `docs/lint-baseline.md`
- [ ] No console errors on `/`, `/pricing`, `/blog`
- [ ] Existing redirects still work: `/privacy`, `/support`, `/features` redirect to `app.zensus.app`
- [ ] `/forecast` still redirects to `app.zensus.app/forecast`
- [ ] No em-dashes in any authored copy

## Homepage (after Milestone 3)
- [ ] Hero H1 reads as two sentences with gradient on "about it."
- [ ] Hero motion runs once on first visit, static on return (incognito for first-visit test)
- [ ] Rotating scenario prompt cycles through all four phrases
- [ ] Trust bar renders four logos plus four chip claims
- [ ] Problem section shows "Still pasting CSVs from three different tools" as pain point 2
- [ ] RunwayFeature section shows 3 panels (drill-down, scenarios, alerts) in order, alternating image sides
- [ ] Bento tile block renders 2x2 with 4 tiles
- [ ] HowItWorks shows 3 refreshed steps
- [ ] SecurityStrip renders with 3 columns, links to `/security`
- [ ] PricingPreview says "Pricing is tailored to your business", no dollar amount
- [ ] FinalCTABand renders between FAQ and Footer with Talk to us button

## Navigation (after Milestone 4)
- [ ] Desktop nav shows Product, Integrations, Plans, Security
- [ ] Sign in and Talk to us CTAs render on desktop
- [ ] Mobile hamburger opens sheet with same items plus sticky-bottom Talk to us
- [ ] "Book Demo" nav link removed
- [ ] Clicking Talk to us opens the destination URL in a new tab

## New pages (after Milestone 5)
- [ ] `/security` loads with all sections, no console errors
- [ ] `/integrations` loads with 4 integration cards
- [ ] `/integrations/plaid`, `/integrations/quickbooks`, `/integrations/hubspot`, `/integrations/slack` all load
- [ ] Each integration page renders all 7 content sections
- [ ] Talk to us CTA renders at bottom of every new page
- [ ] Each new page has correct `<title>` and meta description (DevTools, Elements tab)

## FAQ and Pricing (after Milestone 6)
- [ ] FAQ Pricing category has "How does pricing work?" instead of trial/cancel questions
- [ ] `/pricing` page shows "Pricing is tailored" messaging, no dollar amount
- [ ] No orphaned "trial" or "cancel anytime" language anywhere

## Reduced motion
- [ ] In DevTools, enable `prefers-reduced-motion: reduce`
- [ ] Hero skips typewriter and blur fade, renders final state immediately
- [ ] Rotating prompt still cycles but with opacity only, no translate

## Cross-device
- [ ] Desktop 1440 wide, 1024 wide
- [ ] Mobile 375 wide, 414 wide
- [ ] Every page renders without horizontal scroll on mobile
