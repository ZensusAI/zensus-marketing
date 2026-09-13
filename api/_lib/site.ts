// Canonical public origin, for the serverless handlers under api/. These run
// outside Vite, so they cannot use the "@/lib/constants" alias; the value is
// mirrored here and guarded by src/lib/site-url.test.ts.
export const SITE_URL = "https://zensus.finance";

// Display form, for places that show the domain as text rather than link it.
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");

/**
 * The previous public origin. Kept in the allow-list because the old domain
 * still redirects here: a visitor with a stale tab open on it can post a form
 * whose Origin header names the old host. Remove once the redirect is retired.
 */
export const LEGACY_SITE_URL = "https://zensus.app";

/**
 * Origins accepted by the browser-facing handlers under api/. Previously each
 * handler carried its own copy of this regex, so widening it meant remembering
 * to edit both; missing one silently 403s either the support form or the
 * calculator email.
 */
export function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return false;
  if (origin === SITE_URL || origin === LEGACY_SITE_URL) return true;
  // Vercel preview deployments.
  return /^https:\/\/[^.]+\.vercel\.app$/.test(origin);
}

