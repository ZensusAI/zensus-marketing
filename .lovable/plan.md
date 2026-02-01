
# Pricing Page Updates and Navigation Fix

## Overview

Two sets of changes:
1. Remove specific features and text from the pricing page
2. Fix navigation links so they work correctly when on the pricing page

---

## Changes

### 1. Update Pricing Page Features (`src/pages/Pricing.tsx`)

**Remove from features list (lines 7-18):**
- "Data export"
- "Priority support"
- "8-week forward projections"
- "Bank-level encryption"

**Updated feature list will be:**
```
- Unlimited forecasts
- QuickBooks integration
- Runway calculations
- Conversational Q&A
- Unlimited what-if scenarios
- Automatic data sync
```

**Remove text (lines 74-76):**
Delete the paragraph: "No credit card required to start"

---

### 2. Fix Navigation Links (`src/components/landing/Navbar.tsx`)

**Problem:** Anchor links like `#features` and `#faq` only work on the landing page. When on `/pricing`, clicking these links does nothing because the browser tries to find those anchors on the current page.

**Solution:** Update the navigation to use full paths (`/#features`, `/#faq`) so clicking them from any page navigates to the landing page with the correct section anchor.

**Changes to navLinks (lines 10-14):**
```tsx
const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing", isRoute: true },
  { href: "/#faq", label: "FAQ" },
];
```

Also update the logo link from `href="#"` to use React Router's `Link` component pointing to `/` so it works correctly from all pages.

---

## File Summary

| File | Changes |
|------|---------|
| `src/pages/Pricing.tsx` | Remove 4 features from list, remove "No credit card required" text |
| `src/components/landing/Navbar.tsx` | Update anchor links to use `/#section` format, update logo to use Link |
