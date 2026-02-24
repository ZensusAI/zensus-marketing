

# Hero CTA Hierarchy + Social Proof Improvements

## Overview
Three changes: (1) move "Book Demo" from hero to navbar, (2) remove the Testimonials section, (3) add an integration logo strip near the hero.

---

## 1. Move "Book Demo" to Navbar, Remove from Hero

**Goal:** Make "Try it Now" the sole dominant CTA in the hero. "Book Demo" becomes a secondary option in the navigation bar.

### Changes to `src/components/landing/Hero.tsx`
- Remove the "Book Demo" `<Button>` (lines 51-61)
- Remove the `Calendar` icon import and `getCalApi` setup (the Cal.com embed init moves to Navbar)
- Remove the `@calcom/embed-react` import
- The CTA area becomes just the single "Try it Now" ShineBorder button, centered

### Changes to `src/components/landing/Navbar.tsx`
- Import `getCalApi` from `@calcom/embed-react` and `Calendar` from lucide-react
- Add a `useEffect` to initialize the Cal.com embed (same code currently in Hero)
- Add a "Book Demo" button next to the existing "Get Started" button in the desktop nav
  - Styled as `variant="outline"` with `rounded-full`, smaller than the primary CTA
  - Uses the same `data-cal-*` attributes for the scheduling popup
- Add the same "Book Demo" button in the mobile menu, above "Get Started"

---

## 2. Remove Testimonials Section

**Goal:** Remove placeholder testimonials until real quotes are available.

### Changes to `src/pages/Index.tsx`
- Remove the `Testimonials` import and `<Testimonials />` from the page render
- Note: The `Testimonials.tsx` file itself stays in the codebase for future use

---

## 3. Add Integration Logo Strip

**Goal:** Show trusted partner logos (QuickBooks, Plaid) near the hero to build credibility.

### New component: `src/components/landing/IntegrationLogos.tsx`
- A horizontal strip showing "Integrates with" label + QuickBooks and Plaid logos
- Logos rendered as simple SVG icons or text badges in a muted, trust-bar style
- Centered layout, subtle styling (muted colors, small size) so it doesn't compete with the hero

### Changes to `src/pages/Index.tsx`
- Import and place `<IntegrationLogos />` between `<Hero />` and `<IntegrationBanner />`

---

## Summary of Files Changed

| File | Change |
|------|--------|
| `src/components/landing/Hero.tsx` | Remove Book Demo button + Cal.com setup |
| `src/components/landing/Navbar.tsx` | Add Book Demo button + Cal.com embed init |
| `src/pages/Index.tsx` | Remove Testimonials, add IntegrationLogos |
| `src/components/landing/IntegrationLogos.tsx` | New component -- logo trust bar |

