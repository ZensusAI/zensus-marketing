import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  HEALTH_INTERVAL_MS,
  HEALTH_TIMEOUT_MS,
  checkHealth,
  startHealthMonitor,
  type VisibilityTarget,
} from "./status-health";

const URL_ = "https://api.example.test/health";

const okResponse = (body: unknown = { status: "ok" }, status = 200) =>
  ({ status, json: async () => body }) as unknown as Response;

function fakeDoc(initial = "visible") {
  const listeners = new Set<() => void>();
  const doc = {
    visibilityState: initial,
    addEventListener: (_t: string, l: () => void) => void listeners.add(l),
    removeEventListener: (_t: string, l: () => void) => void listeners.delete(l),
    set(state: string) {
      doc.visibilityState = state;
      listeners.forEach((l) => l());
    },
    listenerCount: () => listeners.size,
  };
  return doc as typeof doc & VisibilityTarget;
}

function setup(responses: Array<() => Promise<Response>>, docState = "visible") {
  const doc = fakeDoc(docState);
  let i = 0;
  const fetchImpl = vi.fn((_url: unknown, _init?: unknown) => {
    const next = responses[Math.min(i, responses.length - 1)];
    i += 1;
    return next();
  });
  const onUpgrade = vi.fn();
  const onHealthy = vi.fn();
  const stop = startHealthMonitor({
    url: URL_,
    doc,
    onHealthy,
    onUpgrade,
    fetchImpl: fetchImpl as unknown as typeof fetch,
  });
  return { doc, fetchImpl, onUpgrade, onHealthy, stop };
}

const healthy = () => Promise.resolve(okResponse());
const down = () => Promise.resolve(okResponse({ status: "down" }, 503));
const blocked = () => Promise.reject(new TypeError("Failed to fetch"));
const tick = (ms = HEALTH_INTERVAL_MS) => vi.advanceTimersByTimeAsync(ms);

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("checkHealth", () => {
  const sig = () => new AbortController().signal;

  it("is healthy only for HTTP 200 with status ok", async () => {
    expect(await checkHealth(URL_, sig(), async () => okResponse())).toBe(true);
    expect(await checkHealth(URL_, sig(), async () => okResponse({ status: "ok" }, 503))).toBe(false);
    expect(await checkHealth(URL_, sig(), async () => okResponse({ status: "degraded" }))).toBe(false);
    expect(await checkHealth(URL_, sig(), async () => okResponse(null))).toBe(false);
    expect(await checkHealth(URL_, sig(), async () => okResponse("ok"))).toBe(false);
  });

  it("treats a rejected fetch or unreadable body as not healthy, never throwing", async () => {
    expect(await checkHealth(URL_, sig(), async () => Promise.reject(new TypeError("cors")))).toBe(false);
    const badJson = {
      status: 200,
      json: async () => {
        throw new SyntaxError("x");
      },
    } as unknown as Response;
    expect(await checkHealth(URL_, sig(), async () => badJson)).toBe(false);
  });

  it("sends a plain GET with no credentials and no custom headers", async () => {
    const f = vi.fn(async (_u: unknown, _i?: unknown) => okResponse());
    await checkHealth(URL_, sig(), f as unknown as typeof fetch);
    const init = f.mock.calls[0][1] as RequestInit;
    expect(init.method).toBe("GET");
    expect(init.credentials).toBe("omit");
    expect(init.headers).toBeUndefined();
  });
});

describe("startHealthMonitor", () => {
  it("checks once on load, and one healthy check does not upgrade", async () => {
    const { fetchImpl, onUpgrade, stop } = setup([healthy]);
    await tick(0);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(onUpgrade).not.toHaveBeenCalled();
    stop();
  });

  it("upgrades after two consecutive healthy checks, once", async () => {
    const { onUpgrade, onHealthy, stop } = setup([healthy]);
    await tick(0);
    await tick();
    expect(onUpgrade).toHaveBeenCalledTimes(1);
    await tick();
    expect(onUpgrade).toHaveBeenCalledTimes(1);
    expect(onHealthy).toHaveBeenCalledTimes(3);
    stop();
  });

  it("resets the count when a check fails in between", async () => {
    const { onUpgrade, stop } = setup([healthy, down, healthy, healthy]);
    await tick(0); // healthy (1)
    await tick(); // 503, reset
    await tick(); // healthy (1)
    expect(onUpgrade).not.toHaveBeenCalled();
    await tick(); // healthy (2)
    expect(onUpgrade).toHaveBeenCalledTimes(1);
    stop();
  });

  it("leaves the page unchanged when fetch is rejected or blocked", async () => {
    const { onUpgrade, onHealthy, stop } = setup([blocked]);
    await tick(0);
    await tick();
    await tick();
    expect(onUpgrade).not.toHaveBeenCalled();
    expect(onHealthy).not.toHaveBeenCalled();
    stop();
  });

  it("aborts a check that exceeds the timeout and counts it as a failure", async () => {
    let aborted = false;
    const hang = vi.fn(
      (_u: unknown, init?: unknown) =>
        new Promise<Response>((_res, rej) => {
          (init as RequestInit).signal!.addEventListener("abort", () => {
            aborted = true;
            rej(new DOMException("aborted", "AbortError"));
          });
        }),
    );
    const onUpgrade = vi.fn();
    const stop = startHealthMonitor({
      url: URL_,
      doc: fakeDoc(),
      onHealthy: vi.fn(),
      onUpgrade,
      fetchImpl: hang as unknown as typeof fetch,
    });
    await tick(HEALTH_TIMEOUT_MS - 1);
    expect(aborted).toBe(false);
    await tick(1);
    expect(aborted).toBe(true);
    expect(onUpgrade).not.toHaveBeenCalled();
    stop();
  });

  it("stops polling while hidden and checks again on becoming visible", async () => {
    const { doc, fetchImpl, stop } = setup([healthy]);
    await tick(0);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    doc.set("hidden");
    await tick(HEALTH_INTERVAL_MS * 5);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    doc.set("visible");
    await tick(0);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    stop();
  });

  it("does not start while the tab is hidden at load", async () => {
    const { fetchImpl, stop } = setup([healthy], "hidden");
    await tick(HEALTH_INTERVAL_MS * 3);
    expect(fetchImpl).not.toHaveBeenCalled();
    stop();
  });

  it("needs fresh proof after the tab was hidden", async () => {
    const { doc, onUpgrade, stop } = setup([healthy]);
    await tick(0); // healthy (1)
    doc.set("hidden");
    doc.set("visible");
    await tick(0); // healthy (1 again, not 2)
    expect(onUpgrade).not.toHaveBeenCalled();
    await tick();
    expect(onUpgrade).toHaveBeenCalledTimes(1);
    stop();
  });

  it("stops timers and listeners on unmount, and ignores late results", async () => {
    let resolveLate: (r: Response) => void = () => {};
    const late = () => new Promise<Response>((r) => (resolveLate = r));
    const { doc, fetchImpl, onHealthy, onUpgrade, stop } = setup([late]);
    stop();
    resolveLate(okResponse());
    await tick(0);
    expect(onHealthy).not.toHaveBeenCalled();
    expect(onUpgrade).not.toHaveBeenCalled();
    await tick(HEALTH_INTERVAL_MS * 5);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(doc.listenerCount()).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
  });
});
