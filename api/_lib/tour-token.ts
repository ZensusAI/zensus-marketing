// Verification of the signed, per-person links that open the private product
// tour (/tour#t=<token>). The token format is shared with the zensus repo,
// which holds the private key and mints the links; this site holds only the
// public key, so it can check a link but never create one.
//
// Token (v1): "v1." + b64url(payloadJSON) + "." + b64url(signature)
// - b64url is base64url without padding.
// - payloadJSON is a JSON object with exactly the keys i, n and e:
//   i = link id (16 lowercase hex chars), used for revocation;
//   n = who the link is for (1 to 60 chars, no control chars);
//   e = expiry in unix seconds (integer).
// - signature is Ed25519 over the ASCII bytes of the first two parts,
//   "v1." + b64url(payloadJSON), exactly as they appear in the token.
//
// Every failure returns the same shape with a reason for logs only; callers
// answer every invalid token identically so a visitor learns nothing about
// why a link was refused.

import { createPublicKey, verify, type KeyObject } from "node:crypto";

export const TOKEN_PREFIX = "v1";
export const MAX_TOKEN_LENGTH = 600;
export const MAX_NAME_LENGTH = 60;

export type TourLink = { id: string; name: string; expiresAt: number };

export type TourTokenResult =
  | { ok: true; data: TourLink }
  | { ok: false; error: string };

export type TourTokenOptions = {
  /** Base64 of the Ed25519 public key's SPKI DER (env TOUR_LINK_PUBLIC_KEY). */
  publicKey: string | undefined;
  /** Comma-separated revoked link ids (env TOUR_REVOKED_IDS). */
  revokedIds?: string | undefined;
  /** Current time in unix seconds. */
  nowSeconds: number;
};

const B64URL = /^[A-Za-z0-9_-]+$/;
const LINK_ID = /^[0-9a-f]{16}$/;
// C0 and C1 control characters, plus DEL.
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u001f\u007f-\u009f]/;
const PAYLOAD_KEYS = ["e", "i", "n"];

/**
 * Strict base64url decode. Rejects padding, characters outside the alphabet
 * and non-canonical encodings (trailing bits that a re-encode would not
 * reproduce), so one payload has exactly one textual form.
 */
function decodeB64url(part: string): Buffer | null {
  if (!B64URL.test(part)) return null;
  if (part.length % 4 === 1) return null;
  const bytes = Buffer.from(part, "base64url");
  if (bytes.toString("base64url") !== part) return null;
  return bytes;
}

let cachedKey: { source: string; key: KeyObject | null } | null = null;

function publicKeyFrom(source: string): KeyObject | null {
  if (cachedKey && cachedKey.source === source) return cachedKey.key;
  let key: KeyObject | null = null;
  try {
    const parsed = createPublicKey({
      key: Buffer.from(source.trim(), "base64"),
      format: "der",
      type: "spki",
    });
    key = parsed.asymmetricKeyType === "ed25519" ? parsed : null;
  } catch {
    key = null;
  }
  cachedKey = { source, key };
  return key;
}

/** Revoked ids from the env value: comma-separated, whitespace ignored. */
export function parseRevokedIds(value: string | undefined): Set<string> {
  if (!value) return new Set();
  return new Set(
    value
      .replace(/\s+/g, "")
      .split(",")
      .filter((id) => id.length > 0),
  );
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function verifyTourToken(token: unknown, options: TourTokenOptions): TourTokenResult {
  if (typeof token !== "string" || token.length === 0) return { ok: false, error: "missing" };
  if (token.length > MAX_TOKEN_LENGTH) return { ok: false, error: "too_long" };

  const parts = token.split(".");
  if (parts.length !== 3) return { ok: false, error: "shape" };
  const [prefix, payloadPart, signaturePart] = parts;
  if (prefix !== TOKEN_PREFIX) return { ok: false, error: "prefix" };

  const payloadBytes = decodeB64url(payloadPart);
  const signature = decodeB64url(signaturePart);
  if (!payloadBytes || !signature) return { ok: false, error: "encoding" };
  if (signature.length !== 64) return { ok: false, error: "signature_length" };

  if (!options.publicKey) return { ok: false, error: "no_public_key" };
  const key = publicKeyFrom(options.publicKey);
  if (!key) return { ok: false, error: "bad_public_key" };

  const signed = Buffer.from(`${prefix}.${payloadPart}`, "ascii");
  let signatureValid = false;
  try {
    signatureValid = verify(null, signed, key, signature);
  } catch {
    signatureValid = false;
  }
  if (!signatureValid) return { ok: false, error: "signature" };

  let payload: unknown;
  try {
    payload = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(payloadBytes));
  } catch {
    return { ok: false, error: "payload_json" };
  }
  if (!isPlainObject(payload)) return { ok: false, error: "payload_shape" };
  const keys = Object.keys(payload).sort();
  if (keys.length !== PAYLOAD_KEYS.length || keys.some((k, idx) => k !== PAYLOAD_KEYS[idx])) {
    return { ok: false, error: "payload_keys" };
  }

  const { i, n, e } = payload;
  if (typeof i !== "string" || !LINK_ID.test(i)) return { ok: false, error: "payload_id" };
  if (typeof n !== "string") return { ok: false, error: "payload_name" };
  const nameLength = [...n].length;
  if (nameLength < 1 || nameLength > MAX_NAME_LENGTH || CONTROL_CHARS.test(n)) {
    return { ok: false, error: "payload_name" };
  }
  if (typeof e !== "number" || !Number.isInteger(e)) return { ok: false, error: "payload_expiry" };

  if (e <= options.nowSeconds) return { ok: false, error: "expired" };
  if (parseRevokedIds(options.revokedIds).has(i)) return { ok: false, error: "revoked" };

  return { ok: true, data: { id: i, name: n, expiresAt: e } };
}

/** Verifies against the deployment's env and the current clock. */
export function verifyTourTokenFromEnv(token: unknown): TourTokenResult {
  return verifyTourToken(token, {
    publicKey: process.env.TOUR_LINK_PUBLIC_KEY,
    revokedIds: process.env.TOUR_REVOKED_IDS,
    nowSeconds: Math.floor(Date.now() / 1000),
  });
}
