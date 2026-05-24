export interface AckInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type ValidateResult =
  | { ok: true; data: AckInput }
  | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = { name: 100, email: 254, subject: 150, message: 5000 } as const;

export function validateInput(body: unknown): ValidateResult {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "invalid_body" };
  }
  const b = body as Record<string, unknown>;

  // Honeypot: humans never fill this.
  if (typeof b._gotcha === "string" && b._gotcha.trim() !== "") {
    return { ok: false, error: "honeypot" };
  }

  const fields: (keyof AckInput)[] = ["name", "email", "subject", "message"];
  const out = {} as AckInput;
  for (const f of fields) {
    const v = b[f];
    if (typeof v !== "string") return { ok: false, error: `missing_${f}` };
    const trimmed = v.trim();
    if (trimmed === "") return { ok: false, error: `empty_${f}` };
    if (trimmed.length > LIMITS[f]) return { ok: false, error: `too_long_${f}` };
    out[f] = trimmed;
  }
  if (!EMAIL_RE.test(out.email)) return { ok: false, error: "bad_email" };
  return { ok: true, data: out };
}
