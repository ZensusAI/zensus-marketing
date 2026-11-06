/**
 * Google Tag Manager for the marketing site (container VITE_GTM_ID).
 *
 * Consent first, like PostHog and Clarity: the container loads only once the
 * visitor is opted in (ConsentBanner, or main.tsx for a returning "granted"
 * visitor). Google Consent Mode v2 defaults are set before the container
 * runs: analytics storage granted, and ad storage, ad user data and ad
 * personalization denied, because the cookie banner asks about analytics
 * only. Google's own tags in the container (GA4, Google Ads) follow those
 * signals; tags from other vendors added in GTM do not, so configure their
 * consent checks in GTM before publishing one.
 *
 * A later "denied" updates Consent Mode to deny everything. A loaded
 * container cannot be unloaded, so non-Google tags that already ran stay
 * loaded until the next page load (when the denied cookie keeps GTM off).
 *
 * Off the critical path: the container starts on the first scroll, tap or
 * key press, or 10 seconds after the opt-in, never during the first paint.
 * No-ops when VITE_GTM_ID is unset and during the prerender crawl.
 *
 * Single-page navigation: use GTM's History Change trigger for page views;
 * the router changes the URL with pushState and fires no page loads.
 *
 * vercel.json's Content-Security-Policy allows www.googletagmanager.com,
 * Google Analytics, and the Meta Pixel (connect.facebook.net for the script,
 * www.facebook.com for its requests), which the container sends events to.
 * A tag from any other host needs that host added there, or the browser
 * blocks it.
 */

const CONTAINER_ID = (import.meta.env.VITE_GTM_ID as string | undefined)?.trim();

const IDLE_START_MS = 10_000;
const TRIGGERS = ["scroll", "pointerdown", "keydown"] as const;

type DataLayerWindow = Window & { dataLayer?: unknown[] };

let loaded = false;
let armed = false;
let wanted = false;
let timer: ReturnType<typeof setTimeout> | undefined;

function isPrerender(): boolean {
  return (window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__ === true;
}

/** Google's gtag(): pushes the arguments object, which Consent Mode reads. */
function gtag(..._args: unknown[]): void {
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  w.dataLayer.push(arguments);
}

function disarm(start: () => void): void {
  for (const name of TRIGGERS) window.removeEventListener(name, start);
  if (timer !== undefined) clearTimeout(timer);
  timer = undefined;
  armed = false;
}

function load(): void {
  if (loaded || !wanted || !CONTAINER_ID) return;
  loaded = true;
  gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(CONTAINER_ID)}`;
  document.head.appendChild(script);
}

/** The visitor opted in: start Tag Manager soon, off the first paint. */
export function startTagManager(): void {
  if (typeof window === "undefined" || !CONTAINER_ID || isPrerender()) return;
  wanted = true;
  if (loaded) {
    // Opted back in after a "denied" in the same visit.
    gtag("consent", "update", { analytics_storage: "granted" });
    return;
  }
  if (armed || typeof window.addEventListener !== "function") return;
  armed = true;
  const start = () => {
    disarm(start);
    load();
  };
  for (const name of TRIGGERS) window.addEventListener(name, start, { passive: true, once: true });
  timer = setTimeout(start, IDLE_START_MS);
}

/** The visitor declined: never load, or deny every Consent Mode signal. */
export function stopTagManager(): void {
  wanted = false;
  if (!loaded) return;
  gtag("consent", "update", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}
