// Cross-domain cookie-consent state.
//
// The decision is stored in a cookie scoped to the registrable domain
// (.zensus.app) so app.zensus.app honors the same choice the visitor made on
// the marketing site; they only see one banner across the whole funnel. This
// rides the same cross-subdomain cookie mechanism PostHog uses for the
// distinct_id. The consent cookie itself is strictly necessary, so it's fine to
// set before the visitor has opted into analytics.

export type ConsentDecision = "granted" | "denied";

const COOKIE = "zensus_cookie_consent";
const MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/** Read the stored consent decision, or null if the visitor hasn't chosen. */
export function readConsent(): ConsentDecision | null {
  if (typeof document === "undefined") return null;
  const entry = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE}=`));
  const value = entry?.split("=")[1];
  return value === "granted" || value === "denied" ? value : null;
}

/** Persist the decision on .zensus.app (host-only off a zensus.app domain). */
export function writeConsent(decision: ConsentDecision): void {
  if (typeof document === "undefined") return;
  const onZensus = /(^|\.)zensus\.app$/.test(window.location.hostname);
  const domain = onZensus ? "; domain=.zensus.app" : "";
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE}=${decision}; path=/${domain}; max-age=${MAX_AGE}; SameSite=Lax${secure}`;
}

/**
 * True when the visitor is in a jurisdiction that requires prior opt-in
 * (EEA / UK / Switzerland). Resolved server-side via /api/geo (Vercel edge
 * geo). Fails safe to true so a network error never results in an EU visitor
 * being tracked before they consent.
 */
export async function requiresConsent(): Promise<boolean> {
  try {
    const res = await fetch("/api/geo", {
      headers: { accept: "application/json" },
    });
    if (!res.ok) return true;
    const data = (await res.json()) as { requiresConsent?: boolean };
    return data.requiresConsent !== false;
  } catch {
    return true;
  }
}
