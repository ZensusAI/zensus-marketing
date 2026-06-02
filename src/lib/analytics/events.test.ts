import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// posthog-js is dynamically imported inside events.ts; vi.mock intercepts both
// static and dynamic imports. Each test resets modules and re-imports so the
// lazy-load state in events.ts (ph / opt flags / buffers) starts clean.
vi.mock("posthog-js", () => ({
  default: {
    init: vi.fn(),
    capture: vi.fn(),
    opt_in_capturing: vi.fn(),
    opt_out_capturing: vi.fn(),
  },
}));

async function loadFresh() {
  const posthog = (await import("posthog-js")).default;
  const events = await import("./events");
  return { posthog, events };
}

describe("marketing analytics helpers", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    // posthog-js touches `window` internally; the helpers also guard on it.
    vi.stubGlobal("window", { location: { origin: "https://zensus.app" } });
    // initAnalytics no-ops without a key; provide one so the lazy load runs.
    vi.stubEnv("VITE_PUBLIC_POSTHOG_KEY", "phc_test");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("buffers capture before the SDK loads (no capture until then)", async () => {
    const { posthog, events } = await loadFresh();
    events.track(events.EVENTS.CTA_CLICKED, { location: "navbar_desktop" });
    events.capturePageview("https://zensus.app/");
    expect(posthog.capture).not.toHaveBeenCalled();
    expect(posthog.init).not.toHaveBeenCalled();
  });

  it("drops buffered intent on load when the visitor never opted in", async () => {
    const { posthog, events } = await loadFresh();
    events.capturePageview("https://zensus.app/");
    await events.initAnalytics();
    expect(posthog.init).toHaveBeenCalled();
    // Not opted in: the buffered pageview must not be captured.
    expect(posthog.capture).not.toHaveBeenCalled();
  });

  it("flushes the entry pageview once a consented visitor's SDK loads", async () => {
    const { posthog, events } = await loadFresh();
    // Order mirrors main.tsx: opt-in intent + entry pageview recorded before the
    // lazy SDK chunk resolves.
    events.grantCapturing();
    events.capturePageview("https://zensus.app/");
    await events.initAnalytics();
    expect(posthog.opt_in_capturing).toHaveBeenCalled();
    expect(posthog.capture).toHaveBeenCalledWith("$pageview", {
      $current_url: "https://zensus.app/",
    });
  });

  it("does not emit a duplicate entry pageview (single last-write-wins slot)", async () => {
    const { posthog, events } = await loadFresh();
    events.grantCapturing();
    events.capturePageview("https://zensus.app/"); // entry (PostHogPageview mount)
    events.capturePageview("https://zensus.app/"); // implied-consent re-capture
    await events.initAnalytics();
    const pageviewCalls = posthog.capture.mock.calls.filter(
      (c) => c[0] === "$pageview",
    );
    expect(pageviewCalls).toHaveLength(1);
  });

  it("captures directly once initialised and opted in", async () => {
    const { posthog, events } = await loadFresh();
    events.grantCapturing();
    await events.initAnalytics();
    posthog.capture.mockClear();
    events.capturePageview("https://zensus.app/pricing");
    expect(posthog.capture).toHaveBeenCalledWith("$pageview", {
      $current_url: "https://zensus.app/pricing",
    });
  });

  it("records a CTA click with its location under the shared event name", async () => {
    const { posthog, events } = await loadFresh();
    events.grantCapturing();
    await events.initAnalytics();
    posthog.capture.mockClear();
    events.trackCtaClick("pricing_preview", { destination: "trial" });
    expect(posthog.capture).toHaveBeenCalledWith("marketing_cta_clicked", {
      location: "pricing_preview",
      destination: "trial",
    });
  });

  it("opting out drops buffered intent and opts out on load", async () => {
    const { posthog, events } = await loadFresh();
    events.capturePageview("https://zensus.app/");
    events.denyCapturing();
    await events.initAnalytics();
    expect(posthog.opt_out_capturing).toHaveBeenCalled();
    expect(posthog.capture).not.toHaveBeenCalled();
  });
});
