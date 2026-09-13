// Cookie-consent state.
//
// The decision is stored in a cookie scoped to the site's registrable domain,
// derived from SITE_HOST rather than hardcoded, so it follows a domain change
// without an edit here. On a host that is not the site (localhost, Vercel
// previews) the cookie is host-only: a Domain attribute naming a domain you are
// not on is silently dropped by the browser.
//
// The consent cookie itself is strictly necessary, so it is fine to set before
// the visitor has opted into analytics.

import { SITE_HOST } from "@/lib/constants";

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

/** Persist the decision, scoped to SITE_HOST (host-only anywhere else). */
export function writeConsent(decision: ConsentDecision): void {
  if (typeof document === "undefined") return;
  const host = window.location.hostname;
  const onSite = host === SITE_HOST || host.endsWith(`.${SITE_HOST}`);
  const domain = onSite ? `; domain=.${SITE_HOST}` : "";
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
