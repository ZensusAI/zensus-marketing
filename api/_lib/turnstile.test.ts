import { describe, it, expect, vi, afterEach } from "vitest";
import { verifyTurnstile } from "./turnstile";

afterEach(() => vi.restoreAllMocks());

describe("verifyTurnstile", () => {
  it("returns true when Cloudflare says success", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      json: async () => ({ success: true }),
    }));
    await expect(verifyTurnstile("tok", "secret")).resolves.toBe(true);
  });
  it("returns false when Cloudflare says failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      json: async () => ({ success: false }),
    }));
    await expect(verifyTurnstile("tok", "secret")).resolves.toBe(false);
  });
  it("throws when siteverify is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));
    await expect(verifyTurnstile("tok", "secret")).rejects.toThrow();
  });
});
