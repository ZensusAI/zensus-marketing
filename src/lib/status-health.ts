// Quiet background health check for the /status page.
//
// The page is static and is correct without this. The check can only ever
// move the page UP, to "operational", and only on proof: a failed, blocked,
// timed-out or non-200 check changes nothing, never shows an error and never
// shows "outage". It is framework-free so it can be tested with fake timers.

export const HEALTH_INTERVAL_MS = 30_000;
export const HEALTH_TIMEOUT_MS = 4_000;
/** Consecutive healthy checks needed before the page upgrades. */
export const HEALTHY_CHECKS_REQUIRED = 2;

/** The slice of `document` the monitor needs (so tests can fake it). */
export interface VisibilityTarget {
  readonly visibilityState: string;
  addEventListener(type: "visibilitychange", listener: () => void): void;
  removeEventListener(type: "visibilitychange", listener: () => void): void;
}

export interface HealthMonitorOptions {
  url: string;
  doc: VisibilityTarget;
  /** Called after every healthy check. */
  onHealthy: (at: Date) => void;
  /** Called once, after HEALTHY_CHECKS_REQUIRED consecutive healthy checks. */
  onUpgrade: () => void;
  fetchImpl?: typeof fetch;
}

/**
 * Healthy means HTTP 200 AND a JSON body with `status === "ok"`.
 * Never throws: any failure (network, CORS, timeout, bad JSON) is "not healthy".
 */
export async function checkHealth(
  url: string,
  signal: AbortSignal,
  fetchImpl: typeof fetch,
): Promise<boolean> {
  try {
    // Plain GET, no credentials, no custom headers: a "simple" request, so the
    // browser sends no CORS preflight.
    const res = await fetchImpl(url, {
      method: "GET",
      credentials: "omit",
      cache: "no-store",
      signal,
    });
    if (res.status !== 200) return false;
    const body: unknown = await res.json();
    return (body as { status?: unknown } | null)?.status === "ok";
  } catch {
    return false;
  }
}

/** Starts monitoring and returns a function that stops it and cleans up. */
export function startHealthMonitor(opts: HealthMonitorOptions): () => void {
  const fetchImpl = opts.fetchImpl ?? fetch;
  let timer: ReturnType<typeof setInterval> | undefined;
  let inflight: AbortController | undefined;
  let streak = 0;
  let upgraded = false;
  let stopped = false;

  const run = async () => {
    if (inflight) return; // never overlap checks
    const controller = new AbortController();
    inflight = controller;
    const timeout = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);
    const healthy = await checkHealth(opts.url, controller.signal, fetchImpl);
    clearTimeout(timeout);
    if (inflight === controller) inflight = undefined;
    // A check that finished after stop() or after the tab was hidden (timer
    // cleared) is ignored.
    if (stopped || timer === undefined) return;
    if (!healthy) {
      streak = 0;
      return;
    }
    streak += 1;
    opts.onHealthy(new Date());
    if (!upgraded && streak >= HEALTHY_CHECKS_REQUIRED) {
      upgraded = true;
      opts.onUpgrade();
    }
  };

  const begin = () => {
    if (timer !== undefined || stopped) return;
    timer = setInterval(run, HEALTH_INTERVAL_MS);
    void run();
  };

  const pause = () => {
    if (timer !== undefined) clearInterval(timer);
    timer = undefined;
    inflight?.abort();
    inflight = undefined;
    streak = 0; // proof must be fresh after the tab was hidden
  };

  const onVisibility = () => {
    if (opts.doc.visibilityState === "visible") begin();
    else pause();
  };

  opts.doc.addEventListener("visibilitychange", onVisibility);
  if (opts.doc.visibilityState === "visible") begin();

  return () => {
    stopped = true;
    pause();
    opts.doc.removeEventListener("visibilitychange", onVisibility);
  };
}
