/**
 * Analytics for the Zensus marketing site (Vite + React SPA, zensus.app).
 *
 * Shares the SAME PostHog project as the product app (app.zensus.app) so a
 * visitor is stitched into ONE funnel across the two domains:
 *
 *   marketing  $pageview / marketing_cta_clicked
 *        │  (same anonymous distinct_id via the shared `.zensus.app` cookie)
 *        ▼
 *   app        login_viewed → auth_completed → subscribe_viewed →
 *              checkout_started → subscription_activated
 *
 * The stitch works because zensus.app and app.zensus.app share the registrable
 * domain `zensus.app`; posthog-js `cross_subdomain_cookie` (forced true below)
 * writes the distinct_id cookie on `.zensus.app`, which app.zensus.app reads on
 * arrival. The app already runs with `cross_subdomain_cookie` true (verified
 * live), so a single PostHog project key is all that's required to join them.
 *
 * Loading: posthog-js (~150KB) is **lazy-loaded** via dynamic import so it never
 * ships in the eager homepage bundle. Until the chunk resolves, capture intent
 * is buffered in this module and flushed on load. Buffered intent is only
 * flushed when the visitor is opted in, so nothing is ever captured before
 * consent, and the buffered pageview is a single last-write-wins slot so an
 * implied-consent opt-in that races the load cannot emit a duplicate entry
 * $pageview. This preserves the returning-consented-visitor entry pageview
 * (main.tsx opts in before render; PostHogPageview fires on mount) while keeping
 * the SDK off the critical path.
 *
 * Safe-by-default:
 * - No-ops when VITE_PUBLIC_POSTHOG_KEY is unset (e.g. Vercel preview builds).
 * - Skips init during the Puppeteer prerender crawl (`window.__PRERENDER__`,
 *   set by scripts/prerender.mjs) so the build server never emits bot pageviews.
 * - autocapture is OFF: the funnel only needs $pageview + marketing_cta_clicked;
 *   leaving it on would multiply event volume on launch-spike traffic and
 *   broaden what we collect from EU visitors while the consent banner is a
 *   deferred follow-on.
 */

import type { PostHog } from "posthog-js";

const POSTHOG_KEY = import.meta.env.VITE_PUBLIC_POSTHOG_KEY as
  | string
  | undefined;
const POSTHOG_HOST =
  (import.meta.env.VITE_PUBLIC_POSTHOG_HOST as string | undefined) ??
  "https://us.i.posthog.com";

// ─── Event name constants ────────────────────────────────────────────────────

export const EVENTS = {
  /** Visitor clicked a CTA that hands off to the product app. */
  CTA_CLICKED: "marketing_cta_clicked",
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

// ─── Lazy-load state ─────────────────────────────────────────────────────────

/** The posthog-js singleton, set once the dynamic import resolves and init runs. */
let ph: PostHog | null = null;
/** Guards against kicking off the import more than once. */
let loadStarted = false;
/** Opt intent recorded before the SDK finished loading. */
let optInRequested = false;
let optOutRequested = false;
/** Single last-write-wins pageview slot, flushed on load if opted in. */
let pendingPageview: string | null = null;
/** Named events queued before load, flushed on load if opted in. */
const pendingEvents: Array<{ name: EventName; props?: Record<string, unknown> }> =
  [];

/** True during the Puppeteer prerender crawl (scripts/prerender.mjs). */
function isPrerender(): boolean {
  return (
    typeof window !== "undefined" &&
    (window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__ === true
  );
}

// ─── Init ────────────────────────────────────────────────────────────────────

/**
 * Lazy-load and initialise PostHog once, on the client only. No-ops when the
 * key is unset or during prerender. Returns the load promise so callers/tests
 * can await readiness; main.tsx calls it fire-and-forget before rendering.
 */
export function initAnalytics(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (isPrerender()) return Promise.resolve();
  if (!POSTHOG_KEY) return Promise.resolve();
  if (loadStarted) return Promise.resolve();
  loadStarted = true;

  return import("posthog-js").then(({ default: posthog }) => {
    if (posthog.__loaded) {
      ph = posthog;
      return;
    }
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      // Mirror app.zensus.app: only create a person record after identify().
      person_profiles: "identified_only",
      // $pageview is captured manually in PostHogPageview on each route change,
      // so we get the correct pathname for every client-side navigation.
      capture_pageview: false,
      capture_pageleave: true,
      // See file header — funnel-only events, cost + EU data minimisation.
      autocapture: false,
      // Write the distinct_id cookie on `.zensus.app` so app.zensus.app reads
      // the same anonymous id and the two sites form a single funnel.
      cross_subdomain_cookie: true,
      // Start opted OUT — no capture and no analytics cookie until consent is
      // resolved. ConsentBanner calls grantCapturing()/denyCapturing() based on
      // the visitor's region + choice; main.tsx opts in synchronously for a
      // returning "granted" visitor. (See lib/consent.ts + ConsentBanner.tsx.)
      opt_out_capturing_by_default: true,
    });
    ph = posthog;

    // Apply opt intent recorded while the SDK was loading.
    if (optOutRequested) {
      posthog.opt_out_capturing();
    } else if (optInRequested) {
      posthog.opt_in_capturing();
    }
    // Flush buffered intent ONLY when the visitor is opted in, so we never
    // capture before consent.
    if (optInRequested && !optOutRequested) {
      if (pendingPageview) {
        posthog.capture("$pageview", { $current_url: pendingPageview });
      }
      for (const e of pendingEvents) posthog.capture(e.name, e.props);
    }
    pendingPageview = null;
    pendingEvents.length = 0;
  });
}

/** Start capturing (call once the visitor has consented / implied consent). */
export function grantCapturing(): void {
  optInRequested = true;
  optOutRequested = false;
  if (ph) ph.opt_in_capturing();
}

/** Stop capturing and clear analytics persistence (visitor declined). */
export function denyCapturing(): void {
  optOutRequested = true;
  optInRequested = false;
  // Drop anything buffered before the decision; a declined visitor is not
  // captured retroactively.
  pendingPageview = null;
  pendingEvents.length = 0;
  if (ph) ph.opt_out_capturing();
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Capture a $pageview for the given absolute URL. Buffers until the SDK loads. */
export function capturePageview(url: string): void {
  if (ph) {
    ph.capture("$pageview", { $current_url: url });
    return;
  }
  pendingPageview = url;
}

/** Fire a named event with optional properties. Buffers until the SDK loads. */
export function track(event: EventName, props?: Record<string, unknown>): void {
  if (ph) {
    ph.capture(event, props);
    return;
  }
  pendingEvents.push({ name: event, props });
}

/** Convenience: record a CTA click with its on-page location. */
export function trackCtaClick(
  location: string,
  props?: Record<string, unknown>,
): void {
  track(EVENTS.CTA_CLICKED, { location, ...props });
}
