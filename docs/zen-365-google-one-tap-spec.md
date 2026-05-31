# ZEN-365 Implementation Spec: Google One Tap on the marketing site

Source of truth for two PRs (landing app, then marketing site). Companion to Linear ZEN-365, which holds the locked architecture, edge-case analysis, and acceptance criteria. This doc records the decisions ZEN-365 did not anticipate and the interface contracts to build against.

Status: awaiting approval. No code written until this is signed off.

## Goal (unchanged from ZEN-365)

Add Google One Tap to the "Try it Now" signup modal. A visitor already signed into Google sees a one-tap prompt, taps it, and is signed into Supabase with cross-subdomain cookies on `.zensus.app`, then handed off to `app.zensus.app/runway` (or `/subscribe` / `/settings/billing` per their subscription status, which the existing `SubscriptionGate` already handles).

## Re-verification result (2026-05-31)

All 14 file:line refs in ZEN-365 verified against current source. Two deltas:

1. `findOrCreateBySupabase` call moved from `supabase-jwt.strategy.ts:251` to `:307-310`. Behavior identical (auto-creates Zensus user on first authenticated call).
2. `buildSetCookieHeader` is a local function inside `app/auth/callback/route.ts:15-31`, not a shared util. See decision D2.

Backend confirmed: `CORS_ORIGINS` is env-only, no hardcoded `https://zensus.app`. Landing Supabase deps: `@supabase/ssr ^0.8.0`, `@supabase/supabase-js ^2.89.0`.

## Resolved decisions

**D1. Branch targets.** ZEN-365 says branch both repos from `origin/main`. Wrong for the monorepo. The `zensus` repo develops on `dev` (PRs target `dev`; `main` is promoted via back-merge). So:
- Landing-app PR: branch from `origin/dev`, target `dev`. (No worktree in the monorepo; switch branches in the main checkout per project memory.)
- Marketing PR: branch from `origin/main`, target `main`, squash-merge.

**D2. `buildSetCookieHeader`.** Extract it from `app/auth/callback/route.ts` into `lib/auth/utils.ts`, export it, and import it in both the callback route (behavior unchanged) and the new handoff route. Avoids a copy-paste fork of cookie logic.

**D3. "Continue with Google" button behavior. DECIDED: do not convert; leave both buttons as-is.** ZEN-365's acceptance criteria asks to convert the button to `signInWithIdToken`; we are intentionally not doing that. A click-to-sign-in `signInWithIdToken` flow requires Google's GIS-rendered button (we cannot style it to match the cream theme), and a `signInWithOAuth` redirect from the marketing origin adds PKCE-on-marketing-origin complexity for no user benefit. ZEN-365's own edge cases 6 and 7 call the button "the always-on fallback." So:
- **One Tap** is the new `signInWithIdToken` path (the conversion-rate win).
- **"Continue with Google" and "Continue with Email" buttons stay exactly as they are** (route to `app.zensus.app/login?provider=...`), serving as the universal fallback for every browser where One Tap does not render.
- Net effect: the marketing PR adds a dormant enhancement and changes nothing user-visible until a Google session + config are both present. Maximally safe to ship pre-config.
- (If you want the button converted anyway, say so and I will use the GIS-rendered button overlay.)

**D4. CSP. DECIDED: no CSP change.** Verified against `vercel.json`: the site's only CSP directive is `Content-Security-Policy: frame-ancestors 'none'`. There is no `default-src`, `script-src`, `connect-src`, or `frame-src`, so those resource types are unrestricted, which means the current CSP does NOT block the GIS script, the Supabase connection, or Google's One Tap iframe. (`frame-ancestors` / `X-Frame-Options: DENY` only govern who may frame zensus.app, irrelevant to zensus.app embedding accounts.google.com.) ZEN-365 assumed a CSP needed adding and called it "additive"; in fact adding a partial `script-src` now would be the breaking change, because it would suddenly restrict every currently-unrestricted script (Vercel Analytics, Speed Insights, Turnstile, MDX, inline JSON-LD). So v1 ships with no CSP edit. If a future ticket hardens the CSP (adds `default-src`/`script-src`), it MUST include: `script-src https://accounts.google.com`, `connect-src https://accounts.google.com https://*.supabase.co`, `frame-src https://accounts.google.com`.

**D5. Unit tests. DECIDED: add minimal vitest.** The marketing repo has no test runner by design. Add `vitest` as a dev-dependency (no CI wiring), covering the 3 pure functions below.

**D6. Config absence is a no-op, not a crash.** Every new code path is gated: if `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` / `VITE_GOOGLE_CLIENT_ID` are missing, the Supabase client is null, `isSupabaseConfigured` is false, and `GoogleOneTap` renders nothing. This is what makes "build-first, wire config later" safe in production. Hard requirement: `src/lib/supabase.ts` must **guard before constructing** (`if (url && key) createBrowserClient(...) else null`), never construct-then-null, because the prerender step (Puppeteer) executes module-level code and a throw there would silently break all 17 prerendered routes without necessarily failing the build exit code.

**Build-time inlining caveat (do not miss this).** Vite inlines `import.meta.env.VITE_*` at **build time**, not runtime. Consequence: setting the four `VITE_*` vars on Vercel does **not** activate One Tap on the already-deployed bundle. A **redeploy/rebuild is required** after the env vars are set for them to take effect. Until then the shipped bundle has the values baked as `undefined` and correctly no-ops. The "go live" step is: set Vercel env -> trigger a redeploy -> verify. State this in the PR description so it is not mistaken for a bug.

**D7. Where One Tap fires. DECIDED: on page load on the homepage, not inside the modal.** This sidesteps the Radix-dialog hazard entirely (that was the reason a modal-scoped prompt was risky: on non-FedCM browsers the prompt is an in-page iframe that the dialog's focus-trap / `pointer-events: none` / `aria-hidden` can render visible-but-unclickable). Firing on page load means no dialog is involved, so the prompt is always interactable, and it is the more standard, higher-conversion pattern. Implications for the build:
- `GoogleOneTap` mounts once at the **homepage** level (`src/pages/Index.tsx`), after the existing `PageSkeleton` gate, NOT inside `SignupModal`. It has no `enabled`-from-modal prop; it self-gates (see below).
- `SignupModal` is therefore **unchanged** (consistent with D3: its two buttons stay exactly as they are; they remain the manual path and the universal fallback).
- Self-gating before it prompts: (1) skip if `!isSupabaseConfigured` or no `VITE_GOOGLE_CLIENT_ID`; (2) skip if `supabase.auth.getSession()` already returns a session (already signed in); (3) Google's own frequency-capping / cooldown handles dismissals and repeat visits, so no custom suppression logic is needed.
- Keep `use_fedcm_for_prompt: true`. On page load the non-FedCM iframe renders in the top-right corner and is fully clickable (no dialog inert scope), so no FedCM feature-detection gate is required.
- A quick verification (still wants `VITE_GOOGLE_CLIENT_ID` + `localhost:8080` as an Authorized JS origin) confirms the GIS load + `signInWithIdToken` happy path; it is no longer a dialog-interaction spike.

## PR 1 — Landing app (`zensus/apps/landing`), target `dev`

### New file: `app/auth/handoff/route.ts` (GET)

Contract:
- Input: `GET /auth/handoff?redirect=<relative-path>`. The caller (marketing site) has already set the standard Supabase SDK cookies on `.zensus.app` via `signInWithIdToken`, so they arrive on this request.
- Build a Supabase server client with `createServerClient` from `@supabase/ssr`, reading request cookies (mirror the cookie `getAll`/`setAll` shape in `lib/supabase/middleware.ts:96-114`). Do **not** call `updateSession` (that is about avoiding the cookie-mutation race; it is unrelated to the validation below).
- **Authorize with `getUser()`, not `getSession()`.** `getSession()` reads the cookie without verifying the JWT, so it must not gate an authz decision. This route mints an httpOnly session and redirects to a protected area, so it is an authz decision:
  - `const { data: { user }, error } = await supabase.auth.getUser()` (validates the token against Supabase server-side).
  - `error || !user` -> `307` to `/login?error=handoff_failed`.
  - Then `const { data: { session } } = await supabase.auth.getSession()` purely to pull the token material to encrypt (the token is fresh from `signInWithIdToken`, so no expiry in the happy path).
- Build `sessionToEncrypt = { access_token, refresh_token, expires_in, expires_at, token_type, user }` (mirror `callback/route.ts:206-213`), `encryptSession(...)`, set `sb-session` httpOnly cookie via the extracted `buildSetCookieHeader` with `getCookieDomain(baseUrl)`.
- Set `sb-auth-callback=1` flag cookie, `maxAge: 5`, `httpOnly: false` (mirror `callback/route.ts:312-319`).
- `validateRedirect(searchParams.get('redirect'))` (relative-only, defaults to `/runway`).
- `307` to the validated path.

Rationale: the marketing client sets only **JS-readable** SDK cookies; the primary value of the handoff route is upgrading those to an **httpOnly** `sb-session` (the BFF security posture the callback route already establishes), and it puts the first `/api/auth/me` call on the fast path. Authentication would still work via the SDK-cookie fallback, but without the httpOnly upgrade.

### Edit: `middleware.ts`

Add `/auth/handoff` to the bypass next to `/auth/callback` (`~:65-72`). Same reason: the route reads cookies and must not have `updateSession` mutate them first.

### Edit: `app/auth/callback/route.ts` + `lib/auth/utils.ts`

Extract `buildSetCookieHeader` to `utils.ts` (D2); import it in both places. Callback behavior must be byte-identical.

### Optional test

`app/auth/handoff/__tests__/route.test.ts` (if the landing app has a runner): mock the server client to return a session, assert `sb-session` set + `307` to the validated redirect.

## PR 2 — Marketing site (`zensus-marketing-migration`), target `main`

### Deps
`npm install @supabase/ssr@^0.8.0 @supabase/supabase-js@^2.89.0` (match landing).

### Env (`.env.example` + Vercel; all optional at runtime per D6)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_APP_URL=https://app.zensus.app`

### `src/lib/constants.ts`
Add:
- `APP_URL = import.meta.env.VITE_APP_URL ?? "https://app.zensus.app"`
- `APP_HANDOFF_URL = `${APP_URL}/auth/handoff``

### `src/lib/supabase.ts`
- `createBrowserClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, { cookieOptions: { domain, path: "/", sameSite: "lax", secure: true } })`.
- `domain` = `.zensus.app` when `window.location.hostname === "zensus.app"` or ends with `.zensus.app`; otherwise `undefined` (host-only on localhost/previews). Mirrors landing's `getCookieDomain`.
- Export `supabase` (null when unconfigured) and `isSupabaseConfigured: boolean`.

### `src/lib/google-one-tap.ts` (pure helpers — TDD targets)
- `generateNonce(): Promise<{ nonce: string; hashedNonce: string }>` — random bytes -> base64url `nonce`; `hashedNonce` = SHA-256 of `nonce` (hex). Send `hashedNonce` to Google, pass raw `nonce` to `signInWithIdToken`. Test: re-hashing `nonce` equals `hashedNonce`.
- `buildHandoffUrl(redirect = "/runway"): string` -> `${APP_HANDOFF_URL}?redirect=${encodeURIComponent(redirect)}`. Test: encodes the param.
- `cookieDomainForHost(hostname: string): string | undefined` — the domain logic above, extracted for testing. Test: `zensus.app` and `x.zensus.app` -> `.zensus.app`; `localhost` -> `undefined`.

### `src/components/landing/GoogleOneTap.tsx`
No props. Mounts once on the homepage (see Index wiring). Effect on mount:
1. Skip if `!isSupabaseConfigured` or no `VITE_GOOGLE_CLIENT_ID` (renders nothing).
2. If `await supabase.auth.getSession()` returns a session, skip entirely (already signed in).
3. Load `https://accounts.google.com/gsi/client` once per page (guard against React StrictMode double-invoke with a ref/module flag).
4. `generateNonce()`, then `google.accounts.id.initialize({ client_id, callback, nonce: hashedNonce, use_fedcm_for_prompt: true, auto_select: false })`, then `prompt()`.
5. Callback: `supabase.auth.signInWithIdToken({ provider: "google", token: response.credential, nonce: rawNonce })`. Success -> `window.location.href = buildHandoffUrl("/runway")`. Error -> toast a friendly message; the modal buttons remain the fallback.
6. Unmount: `google.accounts.id.cancel()`.
Renders nothing visible (One Tap paints its own top-right prompt).

### `src/pages/Index.tsx`
Mount `<GoogleOneTap />` once, after the existing `PageSkeleton` gate (so it fires when the real homepage is shown). This is the only wiring change on the page side.

### `src/components/landing/SignupModal.tsx`
**Unchanged** (D3 + D7): both buttons stay exactly as they are; no One Tap inside the modal.

### CSP
Deferred per D4 (separate commit or skipped for v1).

## Backend (`zensus/apps/backend`)
No code. ZEN-365 lists `CORS_ORIGINS += https://zensus.app` as required, but verification shows it is **not load-bearing for One Tap**: the marketing site only fetches its own Vercel `/api/*` functions and the Supabase auth endpoint (`*.supabase.co`, which has its own CORS); it never calls `api.zensus.app` directly. The backend is reached only from `app.zensus.app` (already an allowed origin) after the handoff. Treat the CORS entry as optional hardening for any future direct call, not a blocker for this feature.

## Config you own (build-first; do when ready)
1. Google Cloud Console (the OAuth client Supabase uses): add `https://zensus.app`, `http://localhost:8080`, `http://localhost:3000` to Authorized JavaScript origins; confirm Supabase callback is an authorized redirect URI. Provide the **Client ID** for `VITE_GOOGLE_CLIENT_ID`.
2. Supabase dashboard (`oiqthrddbmhahyqefpva`): Google provider enabled; add `https://zensus.app` and `http://localhost:8080` to Site URL / additional redirect URLs. Provide the public URL + anon key for `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` (same values as `apps/landing`'s `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
3. Backend: `CORS_ORIGINS += https://zensus.app`.
4. Vercel (marketing): the four `VITE_*` vars.

## Build order
1. **PR 1 — landing app** (handoff route + middleware bypass + `buildSetCookieHeader` extract). Target `dev`. Config-free; goes first. Self-testable by visiting `app.zensus.app/auth/handoff?redirect=/runway` while signed in.
2. **PR 2 — marketing** (deps, supabase client, pure helpers + vitest tests, `GoogleOneTap` mounted in `Index.tsx`). Target `main`. Ships dormant until config + redeploy. `SignupModal` untouched.
3. **Quick One Tap verification** (wants `VITE_GOOGLE_CLIENT_ID` + `localhost:8080` as a Google Authorized JS origin): confirm the GIS load + `signInWithIdToken` happy path locally. Can happen during PR 2 if config is ready, else after.
4. You wire prod config; redeploy marketing; then end-to-end test per ZEN-365's verification matrix.

## Testing
- Unit (vitest, D5): `generateNonce` hash match, `buildHandoffUrl` encoding, `cookieDomainForHost` mapping.
- Build: `npm run lint` clean, `npm run build` succeeds, all 17 routes still prerender.
- Manual / Playwright-MCP: One Tap self-gates correctly (no prompt when unconfigured / already signed in), homepage renders, modal buttons still route.
- Cross-subdomain E2E: only against production `app.zensus.app` (Amplify previews can't set `.zensus.app` cookies; ZEN-365 edge case 8). Happens after config.

## Implementation notes (gotchas found in review)

- **Cross-subdomain cookie flow is sound.** `zensus.app` and `app.zensus.app` share the registrable domain `zensus.app`, so they are same-site. `SameSite=Lax` cookies with `Domain=.zensus.app` are sent on the top-level `window.location` navigation to `/auth/handoff`. No `SameSite=None` needed.
- **`signInWithIdToken` persists cookies via the browser client.** `createBrowserClient` from `@supabase/ssr` uses cookie storage by default, so a successful `signInWithIdToken` writes `sb-<projectRef>-auth-token` cookies (chunked) with the configured `Domain`. That is the linchpin the handoff route relies on. Verify the exact options key for the domain in `@supabase/ssr@0.8` (`cookieOptions` vs `cookies`) at build time; landing uses custom `cookies` methods on the server client.
- **Handoff `baseUrl` + default redirect.** The handoff route must derive `baseUrl` for `getCookieDomain()` the same way `callback/route.ts` does (request origin or the site-URL env), so it resolves to `.zensus.app` in prod. Confirm `validateRedirect`'s built-in default; if it is not `/runway`, pass/force `/runway` explicitly in the route.
- **Keep pure helpers env-independent for tests.** `buildHandoffUrl` should accept the base (or read it lazily) so vitest does not depend on prod env. `generateNonce` uses Web Crypto (`crypto.subtle.digest`, `crypto.getRandomValues`) which is available in the Node/vitest environment.
- **Guard GIS init against React StrictMode double-invoke.** In dev, effects run twice. Load the GIS script once, and guard `google.accounts.id.initialize` / `prompt()` with a ref or module flag so they are not called twice.
- **Toast availability.** Confirm a Toaster (shadcn `useToast` or sonner) is mounted in `App.tsx` before relying on `toast(...)` for the error path; if not, fall back to an inline error in the modal.
- **GIS global typing.** Add a minimal `declare global { interface Window { google?: ... } }` (or a narrow type) for the `accounts.id` API rather than `any`.

## Out of scope (separate tickets, per ZEN-365)
Orphaned-Stripe-customer dedup; "already signed in -> Go to app" UX; `/runway`->`/subscribe` flicker pre-population.
