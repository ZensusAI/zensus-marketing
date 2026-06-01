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
 * Safe-by-default:
 * - No-ops when VITE_PUBLIC_POSTHOG_KEY is unset (e.g. Vercel preview builds).
 * - Skips init during the Puppeteer prerender crawl (`window.__PRERENDER__`,
 *   set by scripts/prerender.mjs) so the build server never emits bot pageviews.
 * - autocapture is OFF: the funnel only needs $pageview + marketing_cta_clicked;
 *   leaving it on would multiply event volume on launch-spike traffic and
 *   broaden what we collect from EU visitors while the consent banner is a
 *   deferred follow-on.
 */

import posthog from "posthog-js";

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

// ─── Init ────────────────────────────────────────────────────────────────────

/** True during the Puppeteer prerender crawl (scripts/prerender.mjs). */
function isPrerender(): boolean {
  return (
    typeof window !== "undefined" &&
    (window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__ === true
  );
}

/**
 * Initialise PostHog once, on the client only. No-ops when the key is unset or
 * during prerender. Call from main.tsx before rendering the app.
 */
export function initAnalytics(): void {
  if (typeof window === "undefined") return;
  if (isPrerender()) return;
  if (!POSTHOG_KEY) return;
  if (posthog.__loaded) return;

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
    // Write the distinct_id cookie on `.zensus.app` so app.zensus.app reads the
    // same anonymous id and the two sites form a single funnel.
    cross_subdomain_cookie: true,
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Returns the posthog singleton only when it is available and initialised. */
function getPostHog(): typeof posthog | null {
  if (typeof window === "undefined") return null;
  if (!posthog.__loaded) return null;
  return posthog;
}

/** Capture a $pageview for the given absolute URL. No-ops if uninitialised. */
export function capturePageview(url: string): void {
  const ph = getPostHog();
  if (!ph) return;
  ph.capture("$pageview", { $current_url: url });
}

/** Fire a named event with optional properties. No-ops if uninitialised. */
export function track(event: EventName, props?: Record<string, unknown>): void {
  const ph = getPostHog();
  if (!ph) return;
  ph.capture(event, props);
}

/** Convenience: record a CTA click with its on-page location. */
export function trackCtaClick(
  location: string,
  props?: Record<string, unknown>,
): void {
  track(EVENTS.CTA_CLICKED, { location, ...props });
}
