# Lint baseline

Captured 2026-04-17 during the marketing redesign. All inherited template errors cleaned up as of 2026-04-19.

**Expected:** 0 errors plus 7 warnings (7 problems).

Errors: none.

Warnings (7): `react-refresh/only-export-components` across shadcn UI files (button, form, navigation-menu, sidebar, sonner, toggle, plus one more). Harmless; they concern HMR re-render granularity, not correctness.

Milestone gate: `npm run lint` must report 0 errors on every PR. Warnings may fluctuate but should stay bounded around the current level.

History:
- 2026-04-17: 4 errors + 7 warnings (chunk 1 foundation, before Navbar rewrite).
- 2026-04-17: 3 errors + 7 warnings (after Navbar rewrite removed `no-explicit-any`).
- 2026-04-19: 0 errors + 7 warnings (typed shadcn empty interfaces as type aliases; swapped `require()` to ESM import for tailwindcss-animate).
