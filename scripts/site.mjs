// Build-time twin of SITE_URL in src/lib/constants.ts. The scripts are plain
// ESM and cannot import the TS module, so the value is mirrored here and
// src/lib/site-url.test.ts asserts the two never drift apart.
export const SITE_URL = "https://zensus.app";

// Display form, for places that show the domain as text rather than link it.
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");
