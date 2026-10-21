// Canonical public origin for this site. Every absolute URL the app emits
// (canonicals, og/twitter tags, JSON-LD @ids, sitemap entries) derives from
// this one constant, so changing domains is a one-line edit rather than a
// find-and-replace across the repo. Must stay in step with scripts/site.mjs;
// src/lib/site-url.test.ts fails the build if the two drift apart.
export const SITE_URL = "https://zensus.finance";

// Display form, for places that show the domain as text rather than link it.
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");

// The previous public origin. The marketing site moved to SITE_URL and this
// host now redirects to it, apex and www only; the product and API subdomains
// are untouched. Named here rather than written into copy as a literal so every
// place that depends on the redirect is findable when it is eventually retired.
// Mirrored by LEGACY_SITE_URL in api/_lib/site.ts.
export const LEGACY_SITE_URL = "https://zensus.app";
export const LEGACY_SITE_HOST = LEGACY_SITE_URL.replace(/^https?:\/\//, "");

// The product application. This is a different registrable domain from
// SITE_URL now that the marketing site has moved, which is the reason no cookie
// is shared between the two; see src/lib/analytics/events.ts.
export const APP_URL = "https://app.zensus.app";
export const APP_HOST = APP_URL.replace(/^https?:\/\//, "");

// Primary CTA destination. Update this one constant to change where "Talk to us" routes site-wide.
// Founder to confirm exact URL at implementation time.
export const TALK_TO_US_URL = "https://calendly.com/hello-zensus/introcall";
export const SIGN_IN_URL = `${APP_URL}/login`;

// Trial CTA destination. Routes new visitors directly to /subscribe after auth
// so they land on the subscription page rather than bouncing from the paywall.
export const START_TRIAL_URL = `${SIGN_IN_URL}?redirect=${encodeURIComponent("/subscribe")}`;

// The legal entity, its registered addresses and its support mailbox, as
// published in the footer, the legal pages' contact blocks and /llm-info.
// index.html cannot import this file, so its Organization schema repeats the
// same values as literals; keep the two in step. Mail stays on zensus.app.
export const LEGAL_NAME = "Zensus Inc.";
export const SUPPORT_EMAIL = "support@zensus.app";
export const COMPANY_ADDRESSES = [
  {
    label: "Delaware",
    street: "254 Chapman Rd, Ste 208 #23940",
    locality: "Newark",
    region: "DE",
    postalCode: "19702",
    country: "US",
  },
  {
    label: "Texas",
    street: "17350 State Hwy 249, Ste 220 #32525",
    locality: "Houston",
    region: "TX",
    postalCode: "77064",
    country: "US",
  },
] as const;

// Public profiles. The same URLs sit in the Organization sameAs in index.html
// and on the Wikidata item Q141775682. The footer shows every one except
// GitHub (dropped from the footer in the redesign, handoff 13-footer); it
// stays here and in sameAs because it is still the company's profile.
export const COMPANY_PROFILES = {
  linkedin: "https://www.linkedin.com/company/zensusai",
  x: "https://x.com/zensusai",
  youtube: "https://www.youtube.com/channel/UCfQAlHd9bQN-aZmV-e5x1VQ",
  instagram: "https://www.instagram.com/zensus.finance/",
  github: "https://github.com/ZensusAI",
} as const;
