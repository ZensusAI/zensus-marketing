

# Performant Scroll Animations for Features Section

## Approach

Use a single lightweight `IntersectionObserver` hook (no scroll listeners, no per-frame JS) that toggles a CSS class. All animations run via CSS `transform` and `opacity` only — these are GPU-composited and never trigger layout/paint. Zero new dependencies.

## How It Works

1. Each feature section starts with `opacity: 0; transform: translateY(40px)` (or translateX for side-sliding)
2. A shared `useScrollAnimation` hook observes elements and adds an `.in-view` class when they enter the viewport (once, then disconnects)
3. CSS transitions handle the rest — GPU-only properties, no JS on every frame

## Changes

### 1. Create `src/hooks/use-scroll-animation.tsx`
- Single hook using `IntersectionObserver` with `threshold: 0.15`
- Returns a ref and `isVisible` boolean
- Observes once, then disconnects (no ongoing cost)
- No scroll event listeners

### 2. Update `tailwind.config.ts`
Add three keyframes:
- `slide-in-left`: translateX(-60px) → 0 + opacity
- `slide-in-right`: translateX(60px) → 0 + opacity  
- `fade-in-up`: translateY(40px) → 0 + opacity (already exists, reuse)

All animations use `will-change: transform, opacity` and `0.7s ease-out`.

### 3. Update `src/components/landing/RunwayFeature.tsx`
- Attach `useScrollAnimation` ref to each section
- When not visible: `opacity-0` (no layout shift, element still occupies space)
- When visible: apply the appropriate animation class based on `imageRight`
- Bullets get staggered `animation-delay` via inline styles (0ms, 80ms, 160ms) — pure CSS, set once
- Icon gets a scale-in animation on visibility

### 4. Add utility class in `src/index.css`
- `.animate-on-scroll` base class with `will-change: transform, opacity` to hint the browser to promote to its own compositor layer

## Performance Guarantees

- **No scroll listeners** — only IntersectionObserver (fires callbacks off main thread)
- **No per-frame JS** — animations are pure CSS transitions
- **GPU-composited only** — transform + opacity never trigger layout or paint
- **Observe-once** — observer disconnects after element is visible
- **No new dependencies** — zero additional bundle size

## Files Changed

| File | Change |
|------|--------|
| `src/hooks/use-scroll-animation.tsx` | **New** — lightweight IntersectionObserver hook |
| `src/components/landing/RunwayFeature.tsx` | Add scroll-triggered animation classes |
| `tailwind.config.ts` | Add `slide-in-left`, `slide-in-right` keyframes |
| `src/index.css` | Add `.animate-on-scroll` utility |

