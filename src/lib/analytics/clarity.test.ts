import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const init = vi.fn();
const consentV2 = vi.fn();
vi.mock("@microsoft/clarity", () => ({ default: { init, consentV2 } }));

// A minimal window: event listeners and the prerender flag.
function makeWindow() {
  const listeners = new Map<string, Set<() => void>>();
  return {
    __PRERENDER__: false as boolean,
    addEventListener: (name: string, fn: () => void) => {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name)!.add(fn);
    },
    removeEventListener: (name: string, fn: () => void) => listeners.get(name)?.delete(fn),
    fire: (name: string) => [...(listeners.get(name) ?? [])].forEach((fn) => fn()),
  };
}

async function load(projectId: string | undefined) {
  vi.resetModules();
  vi.stubEnv("VITE_CLARITY_PROJECT_ID", projectId ?? "");
  return import("./clarity");
}

describe("Microsoft Clarity loader", () => {
  let win: ReturnType<typeof makeWindow>;

  beforeEach(() => {
    vi.useFakeTimers();
    init.mockClear();
    consentV2.mockClear();
    win = makeWindow();
    vi.stubGlobal("window", win);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("never loads without consent", async () => {
    await load("abc123");
    win.fire("scroll");
    vi.advanceTimersByTime(60_000);
    expect(init).not.toHaveBeenCalled();
  });

  it("waits for the first interaction after consent, then loads with the consent signal", async () => {
    const { startClarity } = await load("abc123");
    startClarity();
    expect(init).not.toHaveBeenCalled();
    win.fire("scroll");
    expect(init).toHaveBeenCalledWith("abc123");
    expect(consentV2).toHaveBeenCalledWith({ ad_Storage: "denied", analytics_Storage: "granted" });
    win.fire("keydown");
    expect(init).toHaveBeenCalledTimes(1);
  });

  it("loads after the idle delay when the visitor does not interact", async () => {
    const { startClarity } = await load("abc123");
    startClarity();
    vi.advanceTimersByTime(9_999);
    expect(init).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(init).toHaveBeenCalledTimes(1);
  });

  it("a denial before the load means it never loads", async () => {
    const { startClarity, stopClarity } = await load("abc123");
    startClarity();
    stopClarity();
    win.fire("scroll");
    vi.advanceTimersByTime(60_000);
    expect(init).not.toHaveBeenCalled();
  });

  it("a denial after the load sends the denied consent signal", async () => {
    const { startClarity, stopClarity } = await load("abc123");
    startClarity();
    win.fire("pointerdown");
    stopClarity();
    expect(consentV2).toHaveBeenLastCalledWith({ ad_Storage: "denied", analytics_Storage: "denied" });
  });

  it("does nothing without a project ID or during the prerender crawl", async () => {
    let mod = await load(undefined);
    mod.startClarity();
    win.fire("scroll");
    vi.advanceTimersByTime(60_000);
    expect(init).not.toHaveBeenCalled();

    win.__PRERENDER__ = true;
    mod = await load("abc123");
    mod.startClarity();
    win.fire("scroll");
    vi.advanceTimersByTime(60_000);
    expect(init).not.toHaveBeenCalled();
  });
});
