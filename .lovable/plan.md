

# Update Hero Headline

## Change
Replace the current two-line headline in the hero section with the new benefit-driven copy:

**"Know exactly when your cash runs out -- and what to do about it."**

## What happens
- In `src/components/landing/Hero.tsx`, the `<h1>` content changes from:
  ```
  Runway Intelligence. Decide with Clarity.
  ```
  to:
  ```
  Know exactly when your cash runs out —
  and what to do about it.
  ```
- The "and what to do about it." portion will use the existing `text-gradient` style to maintain the visual accent on the actionable part of the headline.
- No layout, animation, or structural changes -- just the copy swap.

## Technical Detail
Single edit to `src/components/landing/Hero.tsx`, lines ~27-30, replacing the `<h1>` inner content.

