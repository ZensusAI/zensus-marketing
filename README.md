# zensus-marketing

Public marketing site for Zensus — served at [zensus.app](https://zensus.app).

This repo is a standalone project, separate from the Zensus monorepo ([ZensusAI/zensus](https://github.com/ZensusAI/zensus)).

## Stack

- Vite 5 + React 18 + TypeScript
- Tailwind CSS + shadcn/ui (Radix primitives)
- React Router v6
- Deployed on Vercel (auto-deploy on push to `main`)

## Local development

```sh
npm install
npm run dev
```

The dev server runs on `http://localhost:8080`. The marketing site is fully static and has no runtime environment variables.

## Deployment

Vercel project: `zensus-marketing` (Hobby tier). `main` branch auto-deploys to production at [zensus.app](https://zensus.app). PRs get preview deploys at `zensus-marketing-git-<branch>-<team>.vercel.app`.

## Scripts

```sh
npm run dev          # local dev server (:8080)
npm run build        # production build, also generates OG images and prerenders routes
npm run build:dev    # dev-mode build (unminified output, useful for debugging)
npm run preview      # serve built dist/ locally
npm run lint         # eslint
npm run og           # regenerate per-route OG images into dist/og/ (no prerender)
npm run prerender    # prerender all routes into dist/<route>/index.html
```

## Project structure

```
src/
├── components/    # UI components + landing sections
├── pages/         # Route-level pages
├── hooks/         # Custom React hooks
└── lib/           # Utilities

scripts/
├── generate-og.mjs     # Build-time OG image generator
├── prerender.mjs       # Build-time route prerenderer
├── optimize-images.mjs # One-shot image optimizer
└── og/template.html    # Shared HTML template for social cards
```

## Links

- Production: [zensus.app](https://zensus.app) · [www.zensus.app](https://www.zensus.app)
- App (separate repo/domain): [app.zensus.app](https://app.zensus.app)
- Zensus monorepo: [ZensusAI/zensus](https://github.com/ZensusAI/zensus)

## License

© Zensus AI. All rights reserved.
