import { describe, it, expect } from "vitest";
import { sanitizeIntro, escapeHtml } from "./sanitize";

describe("sanitizeIntro", () => {
  it("accepts a normal sentence", () => {
    expect(sanitizeIntro("Thanks for asking about your runway forecast!")).toBe(
      "Thanks for asking about your runway forecast!",
    );
  });
  it("trims surrounding whitespace", () => {
    expect(sanitizeIntro("  hello  ")).toBe("hello");
  });
  it("rejects over-length output", () => {
    expect(sanitizeIntro("x".repeat(301))).toBeNull();
  });
  it("rejects URLs", () => {
    expect(sanitizeIntro("See https://evil.com now")).toBeNull();
    expect(sanitizeIntro("go to www.evil.com")).toBeNull();
  });
  it("rejects markdown links", () => {
    expect(sanitizeIntro("click [here](http://x)")).toBeNull();
  });
  it("rejects angle brackets", () => {
    expect(sanitizeIntro("<script>alert(1)</script>")).toBeNull();
  });
  it("rejects 3+ newlines and control chars", () => {
    expect(sanitizeIntro("a\n\n\n\nb")).toBeNull();
    expect(sanitizeIntro("a\x1fb")).toBeNull();
  });
  it("allows one or two newlines but rejects 3+", () => {
    expect(sanitizeIntro("Thanks!\nWe got your message.")).toBe("Thanks!\nWe got your message.");
    expect(sanitizeIntro("a\n\n\n\nb")).toBeNull();
  });
  it("rejects dangerous URI schemes", () => {
    expect(sanitizeIntro("javascript:alert(1)")).toBeNull();
    expect(sanitizeIntro("data:text/html,hi")).toBeNull();
  });
});

describe("escapeHtml", () => {
  it("escapes the dangerous characters", () => {
    expect(escapeHtml(`a&<>"'`)).toBe("a&amp;&lt;&gt;&quot;&#39;");
  });
});
