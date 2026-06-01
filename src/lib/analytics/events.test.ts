import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import posthog from "posthog-js";
import { track, trackCtaClick, capturePageview, EVENTS } from "./events";

vi.mock("posthog-js", () => ({
  default: { __loaded: false, init: vi.fn(), capture: vi.fn() },
}));

function setLoaded(loaded: boolean) {
  (posthog as unknown as { __loaded: boolean }).__loaded = loaded;
}

describe("marketing analytics helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // posthog-js touches `window` internally; the helpers also guard on it.
    vi.stubGlobal("window", { location: { origin: "https://zensus.app" } });
    setLoaded(false);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("no-ops when PostHog has not been initialised", () => {
    track(EVENTS.CTA_CLICKED, { location: "navbar_desktop" });
    capturePageview("https://zensus.app/");
    expect(posthog.capture).not.toHaveBeenCalled();
  });

  it("captures a $pageview once initialised", () => {
    setLoaded(true);
    capturePageview("https://zensus.app/pricing");
    expect(posthog.capture).toHaveBeenCalledWith("$pageview", {
      $current_url: "https://zensus.app/pricing",
    });
  });

  it("records a CTA click with its location under the shared event name", () => {
    setLoaded(true);
    trackCtaClick("pricing_preview", { destination: "trial" });
    expect(posthog.capture).toHaveBeenCalledWith("marketing_cta_clicked", {
      location: "pricing_preview",
      destination: "trial",
    });
  });
});
