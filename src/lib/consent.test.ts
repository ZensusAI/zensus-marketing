import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { readConsent, writeConsent, requiresConsent } from "./consent";

// Minimal document.cookie jar (set replaces/deletes by name; get joins).
function makeCookieJar() {
  const store: Record<string, string> = {};
  return {
    get cookie() {
      return Object.entries(store)
        .map(([k, v]) => `${k}=${v}`)
        .join("; ");
    },
    set cookie(str: string) {
      const [pair] = str.split(";");
      const idx = pair.indexOf("=");
      const k = pair.slice(0, idx).trim();
      const v = pair.slice(idx + 1).trim();
      if (/max-age=0\b/.test(str) || /expires=Thu, 01 Jan 1970/.test(str)) {
        delete store[k];
      } else {
        store[k] = v;
      }
    },
  };
}

describe("cookie consent state", () => {
  beforeEach(() => {
    vi.stubGlobal("document", makeCookieJar());
    vi.stubGlobal("window", {
      location: { hostname: "zensus.app", protocol: "https:" },
    });
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("returns null before any decision", () => {
    expect(readConsent()).toBeNull();
  });

  it("round-trips a granted decision", () => {
    writeConsent("granted");
    expect(readConsent()).toBe("granted");
    expect(document.cookie).toContain("zensus_cookie_consent=granted");
  });

  it("round-trips a denied decision", () => {
    writeConsent("denied");
    expect(readConsent()).toBe("denied");
  });
});

describe("requiresConsent (geo gate)", () => {
  beforeEach(() => {
    vi.stubGlobal("window", { location: { hostname: "zensus.app" } });
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("is true when the geo endpoint says so (EEA/UK/CH)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ country: "DE", requiresConsent: true }),
      }),
    );
    await expect(requiresConsent()).resolves.toBe(true);
  });

  it("is false for a non-consent country (implied consent)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ country: "US", requiresConsent: false }),
      }),
    );
    await expect(requiresConsent()).resolves.toBe(false);
  });

  it("fails safe to true on a network error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    await expect(requiresConsent()).resolves.toBe(true);
  });

  it("fails safe to true on a non-OK response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) }),
    );
    await expect(requiresConsent()).resolves.toBe(true);
  });
});
