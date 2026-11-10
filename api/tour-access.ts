import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyTourTokenFromEnv } from "./_lib/tour-token.js";
import { loadTourSteps, publicSteps } from "./_lib/tour-manifest.js";
import { INVALID_LINK, logTour, setTourHeaders } from "./_lib/tour-http.js";

// POST { t: <token> } from /tour. Answers 200 with who the link is for, when
// it expires and the step list, or 404 { code: "invalid" } for every token
// that is missing, malformed, tampered with, expired or revoked. The token
// arrives in the body (it lives in the page's URL fragment), so it never sits
// in a request URL or an access log.

export const MAX_BODY_BYTES = 2048;

function bodySize(req: VercelRequest): number {
  const header = Number(req.headers["content-length"]);
  if (Number.isFinite(header) && header > 0) return header;
  const body = req.body;
  if (body === undefined || body === null) return 0;
  if (typeof body === "string") return Buffer.byteLength(body);
  if (Buffer.isBuffer(body)) return body.length;
  try {
    return Buffer.byteLength(JSON.stringify(body));
  } catch {
    return Infinity;
  }
}

function tokenFrom(body: unknown): unknown {
  let value = body;
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      return undefined;
    }
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) return undefined;
  return (value as Record<string, unknown>).t;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  setTourHeaders(res);
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ code: "method_not_allowed" });
  }
  if (bodySize(req) > MAX_BODY_BYTES) return res.status(413).json({ code: "too_large" });

  const v = verifyTourTokenFromEnv(tokenFrom(req.body));
  // `=== false`, not `!v.ok`: Vercel typechecks against the root tsconfig,
  // where strictNullChecks is off and `!v.ok` does not narrow the union.
  if (v.ok === false) {
    logTour("tour-access", "refused", v.error);
    return res.status(404).json(INVALID_LINK);
  }

  logTour("tour-access", "granted");
  return res.status(200).json({
    name: v.data.name,
    expiresAt: new Date(v.data.expiresAt * 1000).toISOString(),
    steps: publicSteps(loadTourSteps()),
  });
}
