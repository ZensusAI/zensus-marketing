import { describe, it, expect } from "vitest";
import { generateNonce, buildHandoffUrl } from "@/lib/google-one-tap";
import { cookieDomainForHost } from "@/lib/supabase";

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

describe("generateNonce", () => {
  it("hashedNonce is the SHA-256 hex of the raw nonce", async () => {
    const { nonce, hashedNonce } = await generateNonce();
    expect(hashedNonce).toMatch(/^[0-9a-f]{64}$/);
    // The contract Supabase enforces: raw nonce hashed == the nonce sent to Google.
    expect(await sha256Hex(nonce)).toBe(hashedNonce);
  });

  it("produces a fresh, URL-safe nonce on each call", async () => {
    const a = await generateNonce();
    const b = await generateNonce();
    expect(a.nonce).not.toBe(b.nonce);
    expect(a.nonce).toMatch(/^[A-Za-z0-9_-]+$/);
  });
});

describe("buildHandoffUrl", () => {
  it("defaults to /runway and URL-encodes the redirect", () => {
    expect(buildHandoffUrl()).toBe(
      "https://app.zensus.app/auth/handoff?redirect=%2Frunway",
    );
  });

  it("encodes a nested redirect path", () => {
    expect(buildHandoffUrl("/settings/billing")).toBe(
      "https://app.zensus.app/auth/handoff?redirect=%2Fsettings%2Fbilling",
    );
  });
});

describe("cookieDomainForHost", () => {
  it("returns .zensus.app for the apex and any subdomain", () => {
    expect(cookieDomainForHost("zensus.app")).toBe(".zensus.app");
    expect(cookieDomainForHost("app.zensus.app")).toBe(".zensus.app");
    expect(cookieDomainForHost("www.zensus.app")).toBe(".zensus.app");
  });

  it("returns undefined for localhost and non-zensus hosts", () => {
    expect(cookieDomainForHost("localhost")).toBeUndefined();
    expect(cookieDomainForHost("zensus-marketing.vercel.app")).toBeUndefined();
    // Guards against a naive substring match treating this as a zensus.app host.
    expect(cookieDomainForHost("zensus.app.evil.com")).toBeUndefined();
  });
});
