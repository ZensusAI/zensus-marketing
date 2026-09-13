// Build-time twin of SITE_URL in src/lib/constants.ts. The scripts are plain
// ESM and cannot import the TS module, so the value is mirrored here and
// src/lib/site-url.test.ts asserts the two never drift apart.
export const SITE_URL = "https://zensus.finance";

// Display form, for places that show the domain as text rather than link it.
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");

// The previous public origin, which now redirects to SITE_URL. index.html keeps
// it as a schema.org alternateName so search and AI engines can merge the old
// and new identity rather than treating them as two entities. Mirrors
// LEGACY_SITE_URL in src/lib/constants.ts and api/_lib/site.ts.
export const LEGACY_SITE_URL = "https://zensus.app";
export const LEGACY_SITE_HOST = LEGACY_SITE_URL.replace(/^https?:\/\//, "");
