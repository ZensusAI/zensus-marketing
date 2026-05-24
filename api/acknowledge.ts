import type { VercelRequest, VercelResponse } from "@vercel/node";
import { SESClient } from "@aws-sdk/client-ses";
import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";
import { validateInput } from "./_lib/validate.js";
import { verifyTurnstile } from "./_lib/turnstile.js";
import { generateIntro, FALLBACK_INTRO } from "./_lib/intro.js";
import { sanitizeIntro } from "./_lib/sanitize.js";
import { sendAck } from "./_lib/email.js";

export const config = { maxDuration: 15 };

const ALLOWED_ORIGINS = [/^https:\/\/zensus\.app$/, /^https:\/\/[^.]+\.vercel\.app$/];
const REQUIRED_ENV = [
  "SES_FROM", "SES_REGION", "BEDROCK_REGION", "BEDROCK_MODEL_ID", "TURNSTILE_SECRET_KEY",
  "ACK_AWS_ACCESS_KEY_ID", "ACK_AWS_SECRET_ACCESS_KEY",
];

// Dedicated, distinctly-named credentials for this function's IAM user. We pass
// them explicitly (rather than letting the SDK read the conventional
// AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY from the default chain) so this
// function can never pick up ambient AWS credentials meant for other systems.
function ackCredentials() {
  return {
    accessKeyId: process.env.ACK_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.ACK_AWS_SECRET_ACCESS_KEY as string,
  };
}

function log(stage: string, outcome: string, errorName?: string) {
  console.log(JSON.stringify({ fn: "acknowledge", stage, outcome, error_name: errorName }));
}

function originAllowed(req: VercelRequest): boolean {
  const origin = (req.headers.origin as string) || "";
  return ALLOWED_ORIGINS.some((re) => re.test(origin));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

  const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
  if (missing.length) {
    console.log(JSON.stringify({ fn: "acknowledge", stage: "config", outcome: "missing_env", missing_keys: missing.join(",") }));
    return res.status(500).json({ error: "server_misconfigured" });
  }

  if (!originAllowed(req)) {
    log("origin", "rejected");
    return res.status(403).json({ error: "forbidden" });
  }

  const bodyObj = (req.body ?? {}) as Record<string, unknown>;
  const token = typeof bodyObj.turnstileToken === "string" ? bodyObj.turnstileToken : "";

  const v = validateInput(bodyObj);
  if (!v.ok) {
    log("validate", "rejected", v.error);
    return res.status(400).json({ error: "invalid_input" });
  }
  log("validate", "ok");

  if (!token) {
    log("turnstile", "missing_token");
    return res.status(403).json({ error: "turnstile_required" });
  }
  try {
    const ok = await verifyTurnstile(
      token,
      process.env.TURNSTILE_SECRET_KEY as string,
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim(),
    );
    if (!ok) {
      log("turnstile", "invalid");
      return res.status(403).json({ error: "turnstile_failed" });
    }
  } catch (err) {
    log("turnstile", "unreachable", (err as Error).name);
    return res.status(503).json({ error: "turnstile_unavailable" });
  }
  log("turnstile", "ok");

  const bedrock = new BedrockRuntimeClient({
    region: process.env.BEDROCK_REGION,
    credentials: ackCredentials(),
  });
  const { intro: raw, usedFallback } = await generateIntro(
    { name: v.data.name, subject: v.data.subject, message: v.data.message },
    {
      client: bedrock,
      modelId: process.env.BEDROCK_MODEL_ID as string,
      timeoutMs: Number(process.env.BEDROCK_TIMEOUT_MS ?? 8000),
    },
  );
  const clean = sanitizeIntro(raw) ?? FALLBACK_INTRO;
  const introWasFallback = usedFallback || clean === FALLBACK_INTRO;
  log("ai", introWasFallback ? "fallback" : "ok");

  try {
    const sesClient = new SESClient({
      region: process.env.SES_REGION,
      credentials: ackCredentials(),
    });
    const result = await sendAck(
      { to: v.data.email, name: v.data.name, intro: clean },
      { client: sesClient, from: process.env.SES_FROM as string, dryRun: process.env.ACK_DRY_RUN === "true" },
    );
    log("ses", result.dryRun ? "dry_run" : "sent");
    return res.status(200).json({ ok: true, dryRun: result.dryRun });
  } catch (err) {
    log("ses", "failed", (err as Error).name);
    return res.status(502).json({ error: "send_failed" });
  }
}
