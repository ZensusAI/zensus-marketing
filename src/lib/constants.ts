// Primary CTA destination. Update this one constant to change where "Talk to us" routes site-wide.
// Founder to confirm exact URL at implementation time.
export const TALK_TO_US_URL = "https://calendly.com/hello-zensus/introcall";
export const SIGN_IN_URL = "https://app.zensus.app/login";

// Trial CTA destination. Routes new visitors directly to /subscribe after auth
// so they land on the subscription page rather than bouncing from the paywall.
export const START_TRIAL_URL = `${SIGN_IN_URL}?redirect=${encodeURIComponent("/subscribe")}`;

// Product app origin. Google One Tap (ZEN-365) hands off to APP_HANDOFF_URL
// after a successful signInWithIdToken. Defaults to production; override with
// VITE_APP_URL (e.g. http://localhost:3000) when testing against a local app.
export const APP_URL = import.meta.env.VITE_APP_URL ?? "https://app.zensus.app";
export const APP_HANDOFF_URL = `${APP_URL}/auth/handoff`;
