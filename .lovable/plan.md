

# Add "Book Demo" Button with Cal.com Modal

## Overview

Add a "Book Demo" button next to the "Try it Now" button in the Hero section. Clicking it opens a Cal.com scheduling modal directly on the landing page using the `@calcom/embed-react` package.

---

## Changes

### 1. Install Dependency

Add `@calcom/embed-react` package to the project.

### 2. Update Hero Section (`src/components/landing/Hero.tsx`)

- Import `getCalApi` from `@calcom/embed-react` and `useEffect` from React
- Import `Calendar` icon from `lucide-react`
- Add a `useEffect` hook to initialize the Cal.com embed API with the `"30min"` namespace and month view layout
- Add a new "Book Demo" button next to the existing "Try it Now" button using `data-cal-*` attributes to trigger the modal
- Style as an outline/secondary variant button with a calendar icon, pill-shaped to match the existing CTA style
- Wrap both buttons in a flex container with a gap for spacing

**Button layout:**
```
[ Try it Now -> ]  [ Calendar Icon  Book Demo ]
```

The "Book Demo" button will use Cal.com's data attributes:
- `data-cal-namespace="30min"`
- `data-cal-link="zensus/30min"`
- `data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'`

These attributes tell the Cal.com embed script to open the scheduling modal when clicked.

---

## File Summary

| Action | File |
|--------|------|
| Install | `@calcom/embed-react` package |
| Edit | `src/components/landing/Hero.tsx` - Add Book Demo button with Cal.com embed integration |

