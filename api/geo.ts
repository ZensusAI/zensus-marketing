import type { VercelRequest, VercelResponse } from "@vercel/node";

// Jurisdictions that require prior opt-in for non-essential (analytics) cookies:
// the EU-27 + the rest of the EEA (Iceland, Liechtenstein, Norway) + the UK +
// Switzerland. Visitors from these get the consent banner; everyone else is
// tracked immediately (implied consent), per our geo-gated consent design.
const CONSENT_REQUIRED = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
  "SI", "ES", "SE", // EU-27
  "IS", "LI", "NO", // EEA (non-EU)
  "GB",             // United Kingdom
  "CH",             // Switzerland (nFADP)
]);

/**
 * Returns the visitor's country (from Vercel's edge geo header) and whether
 * that country requires an opt-in consent banner before analytics.
 *
 * - Unknown country → fails safe to requiresConsent=true (show the banner).
 * - Never cached: a shared cache could otherwise serve one country's answer to
 *   a visitor in another, which for an EU visitor would be a consent failure.
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  const header = req.headers["x-vercel-ip-country"];
  const country =
    (Array.isArray(header) ? header[0] : header)?.toUpperCase() || null;
  const requiresConsent = country ? CONSENT_REQUIRED.has(country) : true;

  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ country, requiresConsent });
}
