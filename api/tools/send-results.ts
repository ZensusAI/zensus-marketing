import type { VercelRequest, VercelResponse } from "@vercel/node";
import { SESClient } from "@aws-sdk/client-ses";
import { verifyTurnstile } from "../_lib/turnstile.js";
import { validateToolInput } from "../_lib/tool-validate.js";
import { composeRunwayToolEmail } from "../_lib/tool-email-runway.js";
import { composePayrollToolEmail } from "../_lib/tool-email-payroll.js";
import { sendToolEmail } from "../_lib/tool-email.js";
import { notifyToolLead } from "../_lib/tool-lead.js";
import { checkToolRateLimit } from "../_lib/tool-rate-limit.js";

export const config = { maxDuration: 15 };

const ALLOWED_ORIGINS = [/^https:\/\/zensus\.app$/, /^https:\/\/[^.]+\.vercel\.app$/];
const REQUIRED_ENV = [
  "SES_FROM",
  "SES_REGION",
  "TURNSTILE_SECRET_KEY",
  "ACK_AWS_ACCESS_KEY_ID",
  "ACK_AWS_SECRET_ACCESS_KEY",
];

function ackCredentials() {
  return {
    accessKeyId: process.env.ACK_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.ACK_AWS_SECRET_ACCESS_KEY as string,
  };
}

function log(stage: string, outcome: string, errorName?: string) {
  console.log(
    JSON.stringify({ fn: "tools/send-results", stage, outcome, error_name: errorName }),
  );
}

function originAllowed(req: VercelRequest): boolean {
  const origin = (req.headers.origin as string) || "";
  return ALLOWED_ORIGINS.some((re) => re.test(origin));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

  const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
  if (missing.length) {
    console.log(
      JSON.stringify({
        fn: "tools/send-results",
        stage: "config",
        outcome: "missing_env",
        missing_keys: missing.join(","),
      }),
    );
    return res.status(500).json({ error: "server_misconfigured" });
  }

  if (!originAllowed(req)) {
    log("origin", "rejected");
    return res.status(403).json({ error: "forbidden" });
  }

  const bodyObj = (req.body ?? {}) as Record<string, unknown>;
  const token = typeof bodyObj.turnstileToken === "string" ? bodyObj.turnstileToken : "";

  const v = validateToolInput(bodyObj);
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

  const clientIp =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ?? "unknown";
  const rate = checkToolRateLimit(clientIp, v.data.email);
  if (!rate.allowed) {
    log("rate_limit", "rejected", rate.reason);
    return res.status(429).json({ error: "rate_limit" });
  }

  const from = process.env.SES_FROM as string;
  const composed =
    v.data.tool === "runway"
      ? composeRunwayToolEmail(v.data.inputs, from)
      : composePayrollToolEmail(v.data.inputs, from);

  try {
    const sesClient = new SESClient({
      region: process.env.SES_REGION,
      credentials: ackCredentials(),
    });
    const dryRun =
      process.env.TOOL_DRY_RUN === "true" || process.env.ACK_DRY_RUN === "true";
    const result = await sendToolEmail(
      {
        to: v.data.email,
        subject: composed.subject,
        text: composed.text,
        html: composed.html,
      },
      { client: sesClient, from, dryRun },
    );
    log("ses", result.dryRun ? "dry_run" : "sent");

    if (!result.dryRun) {
      await notifyToolLead(v.data);
    }

    return res.status(200).json({ ok: true, dryRun: result.dryRun });
  } catch (err) {
    log("ses", "failed", (err as Error).name);
    return res.status(502).json({ error: "send_failed" });
  }
}
