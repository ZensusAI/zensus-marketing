/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import handler from "../signup-lead";
import { resetToolRateLimitForTests } from "../_lib/tool-rate-limit";

function res() {
  const r: any = {};
  r.status = vi.fn(() => r);
  r.json = vi.fn(() => r);
  return r;
}

const req = (over: any = {}) => ({
  method: "POST",
  headers: { origin: "https://zensus.finance", "x-forwarded-for": "203.0.113.9" },
  ...over,
  body: { email: "Owner@Example.com", source: "hero", turnstileToken: "tok", ...over.body },
});

let fetchMock: ReturnType<typeof vi.fn>;

// Turnstile and Apollo are both reached through fetch; route by URL.
function stubFetch(apolloOk = true, turnstileOk = true) {
  fetchMock = vi.fn(async (url: string) => {
    if (url.includes("turnstile")) return { ok: true, json: async () => ({ success: turnstileOk }) };
    return { ok: apolloOk, json: async () => ({}) };
  });
  vi.stubGlobal("fetch", fetchMock);
}

const apolloCalls = () => fetchMock.mock.calls.filter(([url]) => String(url).includes("apollo.io"));

beforeEach(() => {
  resetToolRateLimitForTests();
  process.env.TURNSTILE_SECRET_KEY = "secret";
  process.env.APOLLO_API_KEY = "apollo-key";
  stubFetch();
});

afterEach(() => vi.unstubAllGlobals());

describe("signup-lead handler", () => {
  it("creates a deduplicated Apollo contact with the signup labels", async () => {
    const r = res();
    await handler(req() as any, r as any);
    expect(r.status).toHaveBeenCalledWith(200);
    const [[url, init]] = apolloCalls();
    expect(url).toBe("https://api.apollo.io/api/v1/contacts");
    expect(init.headers["x-api-key"]).toBe("apollo-key");
    expect(JSON.parse(init.body)).toEqual({
      email: "owner@example.com",
      label_names: ["Website signup", "Website signup: hero"],
      run_dedupe: true,
    });
  });

  it("rejects other origins", async () => {
    const r = res();
    await handler(req({ headers: { origin: "https://evil.example" } }) as any, r as any);
    expect(r.status).toHaveBeenCalledWith(403);
    expect(apolloCalls()).toHaveLength(0);
  });

  it("rejects an invalid email or unknown source", async () => {
    for (const body of [{ email: "nope" }, { source: "footer" }]) {
      const r = res();
      await handler(req({ body }) as any, r as any);
      expect(r.status).toHaveBeenCalledWith(400);
    }
    expect(apolloCalls()).toHaveLength(0);
  });

  it("requires a valid Turnstile token", async () => {
    let r = res();
    await handler(req({ body: { turnstileToken: "" } }) as any, r as any);
    expect(r.status).toHaveBeenCalledWith(403);
    stubFetch(true, false);
    r = res();
    await handler(req() as any, r as any);
    expect(r.status).toHaveBeenCalledWith(403);
    expect(apolloCalls()).toHaveLength(0);
  });

  it("limits repeats of one address", async () => {
    for (let i = 0; i < 3; i++) await handler(req() as any, res() as any);
    const r = res();
    await handler(req() as any, r as any);
    expect(r.status).toHaveBeenCalledWith(429);
  });

  it("reports 502 when Apollo refuses, and 500 without a key", async () => {
    stubFetch(false);
    let r = res();
    await handler(req() as any, r as any);
    expect(r.status).toHaveBeenCalledWith(502);
    delete process.env.APOLLO_API_KEY;
    r = res();
    await handler(req() as any, r as any);
    expect(r.status).toHaveBeenCalledWith(500);
  });
});
