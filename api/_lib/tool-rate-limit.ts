const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_IP = 10;
const MAX_PER_EMAIL = 3;

const store = new Map<string, number[]>();

function prune(key: string, windowMs: number): number[] {
  const cutoff = Date.now() - windowMs;
  const kept = (store.get(key) ?? []).filter((t) => t > cutoff);
  store.set(key, kept);
  return kept;
}

function count(key: string, windowMs: number): number {
  return prune(key, windowMs).length;
}

function record(key: string, windowMs: number): void {
  const timestamps = prune(key, windowMs);
  timestamps.push(Date.now());
  store.set(key, timestamps);
}

export function checkToolRateLimit(
  ip: string,
  email: string,
): { allowed: boolean; reason?: "ip" | "email" } {
  const ipKey = `ip:${ip || "unknown"}`;
  const emailKey = `email:${email}`;

  if (count(ipKey, WINDOW_MS) >= MAX_PER_IP) {
    return { allowed: false, reason: "ip" };
  }
  if (count(emailKey, WINDOW_MS) >= MAX_PER_EMAIL) {
    return { allowed: false, reason: "email" };
  }

  record(ipKey, WINDOW_MS);
  record(emailKey, WINDOW_MS);
  return { allowed: true };
}

/** Test helper only. */
export function resetToolRateLimitForTests(): void {
  store.clear();
}
