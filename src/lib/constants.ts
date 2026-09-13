// Primary CTA destination. Update this one constant to change where "Talk to us" routes site-wide.
// Founder to confirm exact URL at implementation time.
export const TALK_TO_US_URL = "https://calendly.com/hello-zensus/introcall";
export const SIGN_IN_URL = "https://app.zensus.app/login";

// Trial CTA destination. Routes new visitors directly to /subscribe after auth
// so they land on the subscription page rather than bouncing from the paywall.
export const START_TRIAL_URL = `${SIGN_IN_URL}?redirect=${encodeURIComponent("/subscribe")}`;
