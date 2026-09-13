// Canonical public origin, for the serverless handlers under api/. These run
// outside Vite, so they cannot use the "@/lib/constants" alias; the value is
// mirrored here and guarded by src/lib/site-url.test.ts.
export const SITE_URL = "https://zensus.app";

// Display form, for places that show the domain as text rather than link it.
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");
