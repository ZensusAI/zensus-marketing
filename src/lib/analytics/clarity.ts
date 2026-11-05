/**
 * Microsoft Clarity (heatmaps and session recordings) for the marketing site.
 *
 * Consent first. Clarity sets its own first-party cookies (_clck, _clsk), so
 * it follows the same decision as PostHog: nothing loads until the visitor is
 * opted in (ConsentBanner, or main.tsx for a returning "granted" visitor),
 * and a later "denied" clears them and stops the recorder (a denied consent
 * signal alone only switches Clarity to cookieless tracking, which still
 * records, so it is paired with Clarity's "stop" command).
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
/** True after stopClarity stopped a running recorder. */
let stopped = false;
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

/** Clarity's command queue (installed by Clarity.init). */
function command(name: "start" | "stop"): void {
  const clarity = (window as unknown as { clarity?: (cmd: string) => void }).clarity;
  clarity?.(name);
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
    // Opted back in after a "denied" in the same visit: restore the cookies
    // and restart the recorder that stopClarity stopped. A repeat opt-in
    // while it is running changes nothing.
    if (stopped) {
      stopped = false;
      Clarity.consentV2({ ad_Storage: "denied", analytics_Storage: "granted" });
      command("start");
    }
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

/** The visitor declined: never load, or clear Clarity's cookies and stop it. */
export function stopClarity(): void {
  wanted = false;
  if (!loaded) return;
  if (stopped) return;
  stopped = true;
  Clarity.consentV2({ ad_Storage: "denied", analytics_Storage: "denied" });
  command("stop");
}
