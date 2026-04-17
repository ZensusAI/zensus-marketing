# Lint baseline

Captured 2026-04-17 during Chunk 1 of the marketing redesign. Updated after Chunk 4's Navbar rewrite dropped the `no-explicit-any` error.

**Expected:** 3 errors plus 7 warnings (10 problems).

Errors:
1. `src/components/ui/command.tsx:24:11` no-empty-object-type
2. `src/components/ui/textarea.tsx:5:18` no-empty-object-type
3. `tailwind.config.ts:111:13` no-require-imports

Warnings (7): react-refresh/only-export-components across shadcn UI files.

Milestone gate: `npm run lint` problem count must match this baseline on every PR from Chunk 4 onward.
