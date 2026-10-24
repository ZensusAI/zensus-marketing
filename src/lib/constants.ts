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

// The same destination with the visitor's address, from the homepage hero's
// email field. The app's login page prefills it and sends the magic link on
// arrival (apps/landing/app/login/page.tsx in the product repo).
export function trialUrlFor(email: string): string {
  return `${SIGN_IN_URL}?${new URLSearchParams({ email, redirect: "/subscribe" })}`;
}

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
// and on the Wikidata item Q141775682. The footer shows LinkedIn, X,
// Instagram and Google: GitHub was dropped in the redesign (handoff 13-footer) and
// YouTube at the user's request (21 Oct 2026). Both stay here and in sameAs
// because they are still the company's profiles. `google` is the Google
// Business Profile (Maps place 0x8640cd947ac66ab9:0xaedbbf85b706ba47, the
// Houston address), linked by its CID, the stable form of a Maps place URL.
export const COMPANY_PROFILES = {
  linkedin: "https://www.linkedin.com/company/zensusai",
  x: "https://x.com/zensusai",
  youtube: "https://www.youtube.com/channel/UCfQAlHd9bQN-aZmV-e5x1VQ",
  instagram: "https://www.instagram.com/zensus.finance/",
  github: "https://github.com/ZensusAI",
  google: "https://maps.google.com/?cid=12599874963521321543",
} as const;

// The Google Business Profile's map, as Google's own "Embed a map" code gives
// it (Maps, Share, Embed a map). Shown in the footer; frame-src in
// vercel.json's Content-Security-Policy allows https://www.google.com for it.
export const GOOGLE_MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3456.792802252794!2d-95.54152859999999!3d29.956637899999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640cd947ac66ab9%3A0xaedbbf85b706ba47!2sZensus!5e0!3m2!1sen!2sus!4v1792775739957!5m2!1sen!2sus";
