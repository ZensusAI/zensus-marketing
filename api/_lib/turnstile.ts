const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Returns true if the token is valid. Throws on network/timeout so the caller
 * can distinguish "invalid token" (false) from "Cloudflare unreachable" (throw).
 */
export async function verifyTurnstile(
  token: string,
  secret: string,
  remoteip?: string,
  timeoutMs = 3000,
): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteip) body.set("remoteip", remoteip);
    const res = await fetch(SITEVERIFY, {
      method: "POST",
      body,
      signal: controller.signal,
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } finally {
    clearTimeout(timer);
  }
}
