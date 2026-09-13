// Canonical public origin for this site. Every absolute URL the app emits
// (canonicals, og/twitter tags, JSON-LD @ids, sitemap entries) derives from
// this one constant, so changing domains is a one-line edit rather than a
// find-and-replace across the repo. Must stay in step with scripts/site.mjs;
// src/lib/site-url.test.ts fails the build if the two drift apart.
export const SITE_URL = "https://zensus.app";

// Display form, for places that show the domain as text rather than link it.
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");

// Primary CTA destination. Update this one constant to change where "Talk to us" routes site-wide.
// Founder to confirm exact URL at implementation time.
export const TALK_TO_US_URL = "https://calendly.com/hello-zensus/introcall";
export const SIGN_IN_URL = "https://app.zensus.app/login";

// Trial CTA destination. Routes new visitors directly to /subscribe after auth
// so they land on the subscription page rather than bouncing from the paywall.
export const START_TRIAL_URL = `${SIGN_IN_URL}?redirect=${encodeURIComponent("/subscribe")}`;
