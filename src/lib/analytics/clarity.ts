/**
 * Microsoft Clarity (heatmaps and session recordings) for the marketing site.
 *
 * Consent first. Clarity sets its own first-party cookies (_clck, _clsk), so
 * it follows the same decision as PostHog: nothing loads until the visitor is
 * opted in (ConsentBanner, or main.tsx for a returning "granted" visitor),
 * and a later "denied" sends Clarity's consent signal to stop and clear them.
 * Clarity requires an explicit consent signal for visitors in the EEA, UK and
 * Switzerland, so every load sends consentV2 with analytics granted and ad
 * storage denied (this site runs no ads).
 *
 * Off the critical path. The Clarity tag is a second script that records from
 * the moment it runs, so it starts on the first scroll, tap or key press, or 10
 * seconds after the opt-in, whichever is first: never during the first paint
 * on a phone (the same reasoning as PostHog's replay in events.ts).
 *
 * Safe by default: no-ops when VITE_CLARITY_PROJECT_ID is unset (local
 * builds, previews without the variable) and during the Puppeteer prerender
 * crawl, so the build never records itself. Input values are masked by
 * Clarity's default masking; keep the project's masking at Balanced or
 * Strict in the Clarity dashboard, since the hero takes an email address.
 *
 * The script loads from www.clarity.ms and reports to *.clarity.ms and
 * c.bing.com; vercel.json's Content-Security-Policy allows exactly those.
 */

import Clarity from "@microsoft/clarity";

const PROJECT_ID = (import.meta.env.VITE_CLARITY_PROJECT_ID as string | undefined)?.trim();

const IDLE_START_MS = 10_000;
const TRIGGERS = ["scroll", "pointerdown", "keydown"] as const;

let loaded = false;
let armed = false;
let wanted = false;
let timer: ReturnType<typeof setTimeout> | undefined;

function isPrerender(): boolean {
  return (window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__ === true;
}

function disarm(start: () => void): void {
  for (const name of TRIGGERS) window.removeEventListener(name, start);
  if (timer !== undefined) clearTimeout(timer);
  timer = undefined;
  armed = false;
}

function load(): void {
  if (loaded || !wanted || !PROJECT_ID) return;
  loaded = true;
  Clarity.init(PROJECT_ID);
  // Queued by the stub init installs until the tag arrives.
  Clarity.consentV2({ ad_Storage: "denied", analytics_Storage: "granted" });
}

/** The visitor opted in: start Clarity soon, off the first paint. */
export function startClarity(): void {
  if (typeof window === "undefined" || !PROJECT_ID || isPrerender()) return;
  wanted = true;
  if (loaded) {
    // Opted back in after a "denied" in the same visit.
    Clarity.consentV2({ ad_Storage: "denied", analytics_Storage: "granted" });
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

/** The visitor declined: never load, or stop and clear Clarity's cookies. */
export function stopClarity(): void {
  wanted = false;
  if (!loaded) return;
  Clarity.consentV2({ ad_Storage: "denied", analytics_Storage: "denied" });
}
