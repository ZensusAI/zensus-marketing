import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyTurnstile } from "./_lib/turnstile.js";
import { checkToolRateLimit } from "./_lib/tool-rate-limit.js";
import { createApolloContact, type SignupSource } from "./_lib/apollo.js";
import { isAllowedOrigin } from "./_lib/site.js";

export const config = { maxDuration: 10 };

// The homepage hero's email field posts here, then sends the visitor on to the
// app's login page with the address. This handler only records the lead in
// Apollo, so a visitor who never finishes signup can still be followed up.
// The client redirects whatever this returns: a lead that fails to save is a
// lost follow-up, never a lost signup.
const REQUIRED_ENV = ["TURNSTILE_SECRET_KEY", "APOLLO_API_KEY"];

// Matches the hero field and the app login, which both use this rule.
const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const SOURCES = new Set<SignupSource>(["hero"]);

function log(stage: string, outcome: string, errorName?: string) {
  console.log(JSON.stringify({ fn: "signup-lead", stage, outcome, error_name: errorName }));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

  const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
  if (missing.length) {
    console.log(
      JSON.stringify({ fn: "signup-lead", stage: "config", outcome: "missing_env", missing_keys: missing.join(",") }),
    );
    return res.status(500).json({ error: "server_misconfigured" });
  }

  if (!isAllowedOrigin(req.headers.origin as string | undefined)) {
    log("origin", "rejected");
    return res.status(403).json({ error: "forbidden" });
  }

  const body = (req.body ?? {}) as Record<string, unknown>;
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const source = (typeof body.source === "string" ? body.source : "hero") as SignupSource;
  const token = typeof body.turnstileToken === "string" ? body.turnstileToken : "";

  if (!email || email.length > 254 || !EMAIL_RE.test(email) || !SOURCES.has(source)) {
    log("validate", "rejected");
    return res.status(400).json({ error: "invalid_input" });
  }

  if (!token) {
    log("turnstile", "missing_token");
    return res.status(403).json({ error: "turnstile_required" });
  }

  const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim();
  try {
    const ok = await verifyTurnstile(token, process.env.TURNSTILE_SECRET_KEY as string, clientIp);
    if (!ok) {
      log("turnstile", "invalid");
      return res.status(403).json({ error: "turnstile_failed" });
    }
  } catch (err) {
    log("turnstile", "unreachable", (err as Error).name);
    return res.status(503).json({ error: "turnstile_unavailable" });
  }

  // The calculators' hourly limits (10 per IP, 3 per address), in a namespace
  // of their own: a visitor who emailed themselves three calculator results
  // must still be recorded when they sign up.
  const rate = checkToolRateLimit(`signup:${clientIp ?? "unknown"}`, `signup:${email}`);
  if (!rate.allowed) {
    log("rate_limit", "rejected", rate.reason);
    return res.status(429).json({ error: "rate_limit" });
  }

  const saved = await createApolloContact(email, source, process.env.APOLLO_API_KEY as string);
  log("apollo", saved ? "saved" : "failed");
  if (!saved) return res.status(502).json({ error: "lead_failed" });
  return res.status(200).json({ ok: true });
}
