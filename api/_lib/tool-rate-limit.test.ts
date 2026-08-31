import { describe, it, expect, beforeEach } from "vitest";
import { checkToolRateLimit, resetToolRateLimitForTests } from "./tool-rate-limit";

beforeEach(() => resetToolRateLimitForTests());

describe("checkToolRateLimit", () => {
  it("allows requests under the limit", () => {
    expect(checkToolRateLimit("1.2.3.4", "a@example.com").allowed).toBe(true);
  });

  it("blocks after too many requests from one IP", () => {
    for (let i = 0; i < 10; i += 1) {
      expect(checkToolRateLimit("1.2.3.4", `user${i}@example.com`).allowed).toBe(true);
    }
    const blocked = checkToolRateLimit("1.2.3.4", "new@example.com");
    expect(blocked.allowed).toBe(false);
    expect(blocked.reason).toBe("ip");
  });

  it("blocks after too many requests to one email", () => {
    for (let i = 0; i < 3; i += 1) {
      expect(checkToolRateLimit(`1.2.3.${i}`, "same@example.com").allowed).toBe(true);
    }
    const blocked = checkToolRateLimit("9.9.9.9", "same@example.com");
    expect(blocked.allowed).toBe(false);
    expect(blocked.reason).toBe("email");
  });
});
