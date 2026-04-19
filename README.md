# zensus-marketing

Public marketing site for Zensus — served at [zensus.app](https://zensus.app).

This repo is a standalone project, separate from the Zensus monorepo ([ZensusAI/zensus](https://github.com/ZensusAI/zensus)).

## Stack

- Vite 5 + React 18 + TypeScript
- Tailwind CSS + shadcn/ui (Radix primitives)
- React Router v6
- Supabase client (currently instantiated but not actively used — reserved for future waitlist/signup flows)
- Deployed on Vercel (auto-deploy on push to `main`)

## Local development

```sh
npm install
npm run dev
```

The dev server runs on `http://localhost:8080`.

Required env vars for local dev (copy into a `.env` file at repo root — `.env` is gitignored):

```
VITE_SUPABASE_PROJECT_ID=rrjfwnmkesscyxppanhm
VITE_SUPABASE_URL=https://rrjfwnmkesscyxppanhm.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<supabase anon key — grab from Vercel project env>
```

The Supabase publishable key is the `anon` JWT — designed to be public and embedded in the client bundle. Row-level security policies in Supabase enforce actual access control.

## Deployment

Vercel project: `zensus-marketing` (Hobby tier). `main` branch auto-deploys to production at [zensus.app](https://zensus.app). PRs get preview deploys at `zensus-marketing-git-<branch>-<team>.vercel.app`.

Production env vars are managed in Vercel dashboard → Settings → Environment Variables. Do not commit env values to this repo.

## Scripts

```sh
npm run dev          # local dev server (:8080)
npm run build        # production build → dist/
npm run build:dev    # dev-mode build (unminified output, useful for debugging)
npm run preview      # serve built dist/ locally
npm run lint         # eslint
```

## Project structure

```
src/
├── components/    # UI components + landing sections
├── pages/         # Route-level pages
├── hooks/         # Custom React hooks
├── lib/           # Utilities
└── integrations/
    └── supabase/  # Supabase client + generated types
```

## Links

- Production: [zensus.app](https://zensus.app) · [www.zensus.app](https://www.zensus.app)
- App (separate repo/domain): [app.zensus.app](https://app.zensus.app)
- Zensus monorepo: [ZensusAI/zensus](https://github.com/ZensusAI/zensus)

## License

© Zensus AI. All rights reserved.
