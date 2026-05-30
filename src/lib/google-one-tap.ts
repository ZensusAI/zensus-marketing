import { APP_HANDOFF_URL } from "@/lib/constants";

/**
 * Generate a fresh nonce pair for Google One Tap + Supabase signInWithIdToken
 * (ZEN-365).
 *
 * The HASHED nonce is sent to Google (it is embedded in the returned ID token);
 * the RAW nonce is passed to supabase.auth.signInWithIdToken, which re-hashes
 * it and checks it matches the token's nonce claim. This is the canonical
 * Supabase "With ID token" pattern and is what defeats token replay.
 */
export async function generateNonce(): Promise<{
  nonce: string;
  hashedNonce: string;
}> {
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  const nonce = btoa(String.fromCharCode(...randomBytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  const hashedNonce = await sha256Hex(nonce);
  return { nonce, hashedNonce };
}

async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Build the URL the browser navigates to after a successful signInWithIdToken.
 * `redirect` is a relative app path; the landing app's /auth/handoff route
 * re-validates it server-side (relative paths only).
 */
export function buildHandoffUrl(redirect = "/runway"): string {
  return `${APP_HANDOFF_URL}?redirect=${encodeURIComponent(redirect)}`;
}
