# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository purpose

Marketing site for Zensus (`zensus.app`). The **product app** lives at a separate domain (`app.zensus.app`) and is not in this repo. This repo serves the public landing, pricing, blog, and `/forecast` pages; routes for product surfaces (`/privacy`, `/support`, `/features`) redirect to the app via `src/components/RedirectToApp.tsx`.

## Commands

```sh
npm run dev        # Vite dev server on http://localhost:8080 (port set in vite.config.ts, not default 5173)
npm run build      # Production build
npm run build:dev  # Build with development mode (unminified output, useful for debugging)
npm run lint       # ESLint
npm run preview    # Preview the production build locally
```

No test runner is configured.

## Lockfile policy

**This project is pinned to npm.** `bun.lock`, `bun.lockb`, `pnpm-lock.yaml`, and `yarn.lock` are gitignored to prevent cross-tool drift. Do not commit or generate them — always use `npm install`.

## Architecture

**Stack:** React 18 + TypeScript + Vite (SWC) + Tailwind + shadcn/ui + React Router v6 + TanStack Query. Path alias `@` → `src/`.

**Routing (`src/App.tsx`):** Single `BrowserRouter` with a small route table. The catch-all `*` must stay last — a comment in the file calls this out explicitly. Routes that point to product surfaces render `<RedirectToApp />`, which `window.location.replace`s to `app.zensus.app` preserving the pathname and injects a `<meta name="robots" content="noindex">` to keep the redirect out of SERPs.

**Landing page composition (`src/pages/Index.tsx`):** A deliberate 300ms `<PageSkeleton />` gate before rendering the real page to avoid flash-of-unstyled-content, then hash-scrolls to any `#section` in the URL after mount. Section components live under `src/components/landing/` and are composed top-to-bottom inside `<Index>`.

**Styling:** shadcn/ui (slate base) with CSS variables. `tailwind.config.ts` defines custom animations (`fade-in`, `fade-in-up`, `slide-in-*`, `pulse-glow`, `shine`) that the landing sections rely on — prefer these over adding new one-offs. Font is Inter via `fontFamily.sans`/`display`.

## Deployment

Deployed via Vercel. `main` auto-deploys to production. The site has no runtime environment variables today (the old Supabase waitlist was removed), so there is nothing to configure in the Vercel dashboard.

## ESLint note

`@typescript-eslint/no-unused-vars` is disabled in `eslint.config.js`. Don't rely on it to flag dead code; remove unused identifiers yourself.
