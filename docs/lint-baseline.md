# Lint baseline

Captured 2026-04-17 during Chunk 1 of the marketing redesign.

**Expected:** 4 errors plus 7 warnings (11 problems).

Errors:
1. `src/components/landing/Navbar.tsx:8:14` no-explicit-any (drops after Milestone 4)
2. `src/components/ui/command.tsx:24:11` no-empty-object-type
3. `src/components/ui/textarea.tsx:5:18` no-empty-object-type
4. `tailwind.config.ts:111:13` no-require-imports

Warnings (7): react-refresh/only-export-components across shadcn UI files.

Milestone gate: `npm run lint` problem count must match this baseline on every PR through Milestone 3. After Milestone 4's Navbar rewrite the baseline drops to 3 errors plus 7 warnings.
