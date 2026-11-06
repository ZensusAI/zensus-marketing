import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// A minimal window and document: listeners, the prerender flag, the
// dataLayer, and the script tags appended to <head>.
function makeEnv() {
  const listeners = new Map<string, Set<() => void>>();
  const scripts: { src: string; async: boolean }[] = [];
  const win = {
    __PRERENDER__: false as boolean,
    dataLayer: undefined as unknown[] | undefined,
    addEventListener: (name: string, fn: () => void) => {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name)!.add(fn);
    },
    removeEventListener: (name: string, fn: () => void) => listeners.get(name)?.delete(fn),
    fire: (name: string) => [...(listeners.get(name) ?? [])].forEach((fn) => fn()),
  };
  const doc = {
    createElement: () => ({ src: "", async: false }),
    head: { appendChild: (el: { src: string; async: boolean }) => scripts.push(el) },
  };
  return { win, doc, scripts };
}

async function load(id: string | undefined) {
  vi.resetModules();
  vi.stubEnv("VITE_GTM_ID", id ?? "");
  return import("./gtm");
}

/** The Consent Mode commands pushed so far, as plain arrays. */
const consentCalls = (dl: unknown[] | undefined) =>
  (dl ?? []).map((e) => Array.from(e as ArrayLike<unknown>)).filter((a) => a[0] === "consent");

describe("Google Tag Manager loader", () => {
  let env: ReturnType<typeof makeEnv>;

  beforeEach(() => {
    vi.useFakeTimers();
    env = makeEnv();
    vi.stubGlobal("window", env.win);
    vi.stubGlobal("document", env.doc);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("never loads without consent", async () => {
    await load("GTM-TEST1");
    env.win.fire("scroll");
    vi.advanceTimersByTime(60_000);
    expect(env.scripts).toHaveLength(0);
  });

  it("after consent, waits for an interaction, sets Consent Mode defaults, then loads the container", async () => {
    const { startTagManager } = await load("GTM-TEST1");
    startTagManager();
    expect(env.scripts).toHaveLength(0);
    env.win.fire("pointerdown");
    expect(env.scripts).toHaveLength(1);
    expect(env.scripts[0].src).toBe("https://www.googletagmanager.com/gtm.js?id=GTM-TEST1");
    expect(env.scripts[0].async).toBe(true);
    expect(consentCalls(env.win.dataLayer)[0]).toEqual([
      "consent",
      "default",
      { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" },
    ]);
    expect(env.win.dataLayer).toContainEqual(expect.objectContaining({ event: "gtm.js" }));
    env.win.fire("scroll");
    expect(env.scripts).toHaveLength(1);
  });

  it("loads after the idle delay when the visitor does not interact", async () => {
    const { startTagManager } = await load("GTM-TEST1");
    startTagManager();
    vi.advanceTimersByTime(10_000);
    expect(env.scripts).toHaveLength(1);
  });

  it("a denial before the load means it never loads", async () => {
    const { startTagManager, stopTagManager } = await load("GTM-TEST1");
    startTagManager();
    stopTagManager();
    env.win.fire("scroll");
    vi.advanceTimersByTime(60_000);
    expect(env.scripts).toHaveLength(0);
  });

  it("a denial after the load denies every Consent Mode signal", async () => {
    const { startTagManager, stopTagManager } = await load("GTM-TEST1");
    startTagManager();
    env.win.fire("scroll");
    stopTagManager();
    expect(consentCalls(env.win.dataLayer).at(-1)).toEqual([
      "consent",
      "update",
      { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" },
    ]);
  });

  it("does nothing without a container ID or during the prerender crawl", async () => {
    let mod = await load(undefined);
    mod.startTagManager();
    vi.advanceTimersByTime(60_000);
    expect(env.scripts).toHaveLength(0);

    env.win.__PRERENDER__ = true;
    mod = await load("GTM-TEST1");
    mod.startTagManager();
    vi.advanceTimersByTime(60_000);
    expect(env.scripts).toHaveLength(0);
  });
});
