# Homepage Outcome Positioning and Custom Card Mock Plan

**Status:** Ready for implementation  
**Date:** 2026-08-17  
**Owner:** Ashwin

## Goal

Reposition the homepage around the outcome of continuous cash visibility, establish the payroll and runway pain before product mechanics, then introduce the rolling 13-week forecast as the flagship response.

Create a separate static Custom card mock for visual review. The mock is not a pricing change and will not be added to production.

## Success checks

- Primary metric: hero-to-trial CTR, measured when the hero's **Start free trial** button opens the signup modal.
- Target: at least 10% relative lift in the 28 days after release compared with the preceding 28 days.
- Rollback threshold: Ashwin reviews and reverts if CTR falls by 5% or more.
- The before-and-after comparison is directional. It does not isolate seasonality or traffic-mix changes.
- Only visitors whose consent state allows PostHog capture are included.

## Non-goals

- Do not change drill-down, scenarios, alerts, comparison, how-it-works, FAQ, or pricing copy and behavior.
- Do not add an A/B experiment.
- Do not introduce a production Custom plan or alter the existing $199 pricing promise.
- Do not change product forecast behavior.

## Approved copy

### Hero

**H1**

> Your cash flow, mapped as far ahead as you need.

**Subhead**

> Built for businesses with unpredictable revenue.

**Intro**

> Zensus gives you a live, always-current picture of your cash position, so you can make payroll, hiring, and spending decisions with confidence.

"Always-current" is an accepted absolute marketing claim. The practical outage and sync-delay risk is documented in the ADR.

### Product showcase bridge

**Heading**

> See the next 13 weeks before they hit your bank.

**Paragraph**

> Zensus combines your bank, QuickBooks, and HubSpot data into a weekly forecast that reflects when cash actually moves.

## Target section order

1. Hero
2. Pain section
3. Product showcase, with the new bridge heading and paragraph
4. Trust bar
5. Runway features
6. Remaining sections in their existing order

## Implementation steps

### 1. Add hero-specific CTA measurement

Files:

- `src/components/landing/TryItNowButton.tsx`
- `src/components/landing/Hero.tsx`
- `src/lib/analytics/events.test.ts`

Work:

- Add an optional analytics location prop or click callback to `TryItNowButton`.
- Record `marketing_cta_clicked` with a hero-specific location when the hero button opens the signup modal.
- Avoid double-counting the later Google or email choice inside `SignupModal`.
- Add a focused test for the event properties.

Acceptance:

- A hero trial click can be distinguished from navbar, pricing, and signup-modal handoff events.
- The event remains a no-op when analytics is unavailable or consent is denied.

### 2. Update hero messaging

File:

- `src/components/landing/Hero.tsx`

Work:

- Replace the two existing H1 constants with the approved H1 while preserving responsive line control and hover treatment.
- Keep the approved subhead unchanged.
- Replace the feature-led paragraph with the approved outcome-led intro.
- Remove the 13-week and March 14 detail from the hero.

Acceptance:

- The H1 has sensible line breaks on mobile, tablet, and desktop.
- The hero testimonial, CTA group, and scenario prompt remain unchanged.

### 3. Reorder the opening homepage sections

File:

- `src/pages/Index.tsx`

Work:

- Change the sequence from Hero, Product showcase, Trust bar, Pain to Hero, Pain, Product showcase, Trust bar.
- Leave every later section in its current order.

Acceptance:

- The pain section is the first section after the hero.
- Hash links and existing section IDs continue to work.
- No duplicate sections are rendered.

### 4. Introduce the 13-week showcase bridge

File:

- `src/components/landing/HeroShowcase.tsx`

Work:

- Add the approved heading and paragraph above the existing screenshot carousel.
- Preserve carousel timing, pause control, reduced-motion behavior, images, and browser frame.
- Adjust top and bottom spacing so Pain and Product showcase read as problem followed by resolution.

Acceptance:

- The 13-week mechanic appears after the pain statement, not in the homepage identity.
- Existing dashboard screenshots remain uncropped and accessible.

### 5. Align SEO and social metadata

Files:

- `src/pages/Index.tsx`
- `index.html`
- `scripts/generate-og.mjs`, only if card copy is hard-coded there

Work:

- Update document title and fallback title.
- Update meta description.
- Update Open Graph title and description.
- Update Twitter title and description.
- Keep canonical URL and social image dimensions unchanged.
- Generate a fresh homepage OG image using the new positioning.

Recommended metadata draft:

- **Title:** `Zensus · Your cash flow, mapped as far ahead as you need`
- **Description:** `Get a live, always-current picture of your cash position. Zensus helps businesses with unpredictable revenue plan payroll, hiring, and spending with confidence.`

Acceptance:

- No production source retains the old "mapped 13 weeks ahead" homepage headline.
- Visible hero copy and social metadata express the same positioning.
- The generated `home.png` reflects the new title.

### 6. Produce the standalone Custom card mock

Input:

- User-provided dark card reference image

Output:

- One standalone static image mock, stored outside production UI until approved

Approved content:

- Label: **Custom**
- Subtitle: **Tailored setup for complex cash flow operations**
- Large price text: **Custom**
- CTA: **Talk to us**
- Tailored forecast setup
- Custom integrations
- Dedicated onboarding
- Priority support
- Team training

Visual direction:

- Preserve the reference hierarchy: label, subtitle, large price treatment, full-width CTA, and checked service list.
- Apply Zensus typography and dark forest color tokens rather than copying the reference colors literally.
- Do not use the word "Enterprise."
- Do not include request limits, API access, uptime SLA, or other unsupported reference content.
- Do not insert the mock into the homepage or pricing page.

## Verification

Run:

```sh
npm run lint
npm run build
```

Manual checks:

- Review the hero and first four sections at mobile, tablet, and desktop widths.
- Confirm the pain section follows the hero with no awkward spacing transition.
- Confirm the showcase heading does not compete visually with the pain heading.
- Confirm hero CTA tracking emits one hero-specific event.
- Inspect title, description, canonical, Open Graph, and Twitter tags in the prerendered homepage.
- Inspect regenerated `home.png`.
- Search for the old homepage headline across source and generated metadata.
- Review the Custom card mock against the supplied reference and approved copy.

## Rollout

1. Record the current 28-day hero-to-trial CTR baseline before deployment.
2. Ship the messaging, order, metadata, instrumentation, and OG changes together.
3. Keep the Custom card mock outside production.
4. Check analytics shortly after release to confirm event capture.
5. Review CTR after 28 days.
6. Revert if CTR is down by 5% or more. Retain the change if it reaches the 10% relative-lift target. Use judgment for results between those thresholds.

## References

- `docs/grill/adrs/2026-08-17-homepage-outcome-positioning.md`
- `docs/grill/adrs/2026-08-17-custom-card-mock.md`
- `docs/grill/glossary.md`
