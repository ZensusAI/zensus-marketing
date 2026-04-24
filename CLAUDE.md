# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository purpose

Marketing site for Zensus (`zensus.app`). The **product app** lives at a separate domain (`app.zensus.app`) and is not in this repo. This repo serves the public landing, pricing, blog, changelog, security, and integrations pages (hub + per-provider sub-pages for Plaid, QuickBooks, HubSpot, and Slack). Routes that point at product surfaces (`/privacy`, `/support`, `/features`, `/forecast`, `/terms`) are 301'd to `app.zensus.app` at the edge via `vercel.json`, not by a React component.

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

**This project is pinned to npm.** `bun.lock`, `bun.lockb`, `pnpm-lock.yaml`, and `yarn.lock` are gitignored to prevent cross-tool drift. Do not commit or generate them; always use `npm install`.

## Architecture

**Stack:** React 18 + TypeScript + Vite (SWC) + Tailwind + shadcn/ui + React Router v6 + TanStack Query. Path alias `@` → `src/`.

**Routing (`src/App.tsx`):** Single `BrowserRouter`. Home is eager; every other route (Pricing, Blog, Changelog, Security, Integrations, and per-provider integration pages) is lazy-loaded under a `Suspense` boundary. The catch-all `*` stays last (a comment in the file calls this out). Product-surface redirects live in `vercel.json`, not in React, so hitting `/privacy` etc. never touches the SPA.

**Landing page composition (`src/pages/Index.tsx`):** A deliberate 300ms `<PageSkeleton />` gate before rendering the real page to avoid flash-of-unstyled-content, then hash-scrolls to any `#section` in the URL after mount. Section components live under `src/components/landing/` and are composed top-to-bottom inside `<Index>`.

**Styling:** shadcn/ui (slate base) with CSS variables. `tailwind.config.ts` defines custom animations (`fade-in`, `fade-in-up`, `slide-in-*`, `pulse-glow`, `shine`) that the landing sections rely on; prefer these over adding new one-offs. Fonts are **Geist** (sans/display) and **Geist Mono**, loaded from Google Fonts in `index.html` and wired through `fontFamily.sans`, `fontFamily.display`, and `fontFamily.mono` in `tailwind.config.ts`.

## SEO and prerender

Every route listed in `src/App.tsx` is also listed in `scripts/prerender.mjs` and `public/sitemap.xml`. The production build runs `vite build` then `scripts/generate-og.mjs` (per-route Open Graph PNGs into `dist/og/`) then `scripts/prerender.mjs` (Puppeteer walks each route and writes `dist/<route>/index.html` so Googlebot sees real HTML on first fetch) then `scripts/indexnow-ping.mjs` (POSTs every sitemap URL to the IndexNow API so Bing and Yandex learn about changes immediately; gated on `VERCEL=1` + `VERCEL_ENV=production` so local builds never ping). When adding a new route, update **all three** lists.

Per-route `<title>`, description, canonical, and og/twitter tags are emitted by `react-helmet-async` inside each page component. The FAQ section emits the only `FAQPage` JSON-LD block; site-wide Organization / WebSite / SoftwareApplication lives in `index.html`. Breadcrumb JSON-LD is built via `src/lib/structured-data.ts`.

## Deployment

Deployed via Vercel. `main` auto-deploys to production. The site has no runtime environment variables today (the old Supabase waitlist was removed), so there is nothing to configure in the Vercel dashboard.

## ESLint note

`@typescript-eslint/no-unused-vars` is disabled in `eslint.config.js`. Don't rely on it to flag dead code; remove unused identifiers yourself.
