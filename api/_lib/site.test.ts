import { describe, expect, it } from "vitest";

import { isAllowedOrigin, LEGACY_SITE_URL, SITE_HOST, SITE_URL } from "./site.js";

describe("isAllowedOrigin", () => {
  it("accepts the current site origin", () => {
    expect(isAllowedOrigin(SITE_URL)).toBe(true);
  });

  it("accepts the legacy origin while the old domain still redirects", () => {
    expect(isAllowedOrigin(LEGACY_SITE_URL)).toBe(true);
  });

  it("accepts Vercel preview deployments", () => {
    expect(isAllowedOrigin("https://zensus-marketing-abc123.vercel.app")).toBe(
      true,
    );
  });

  it("rejects a missing Origin header", () => {
    expect(isAllowedOrigin(undefined)).toBe(false);
    expect(isAllowedOrigin("")).toBe(false);
  });

  it("rejects a lookalike that merely starts with our host", () => {
    // The check is an exact origin match, not a prefix or suffix test, so an
    // attacker-controlled host that embeds ours gains nothing.
    expect(isAllowedOrigin(`https://${SITE_HOST}.evil.com`)).toBe(false);
    expect(isAllowedOrigin(`https://evil-${SITE_HOST}`)).toBe(false);
    expect(isAllowedOrigin(`https://${SITE_HOST}.attacker.io`)).toBe(false);
  });

  it("rejects a nested subdomain posing as a preview deploy", () => {
    expect(isAllowedOrigin("https://a.b.vercel.app")).toBe(false);
  });

  it("rejects plain http on our own host", () => {
    expect(isAllowedOrigin(`http://${SITE_HOST}`)).toBe(false);
  });

  it("rejects an unrelated origin", () => {
    expect(isAllowedOrigin("https://example.com")).toBe(false);
  });
});
