/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import accessHandler from "../tour-access";
import imageHandler from "../tour-image";
import { TOUR_DIR, loadTourSteps } from "../_lib/tour-manifest";

// Spec test vector (see api/_lib/tour-token.test.ts). Expires 2100-01-01.
const PUBLIC_KEY = "MCowBQYDK2VwAyEAqd7nwhCM01XmeUI6vTJQahbUnyAv+sCPmI4xQ9RCtyY=";
const TOKEN =
  "v1.eyJpIjoiMDEyMzQ1Njc4OWFiY2RlZiIsIm4iOiJBY21lIFJvYm90aWNzIiwiZSI6NDEwMjQ0NDgwMH0." +
  "u87t-h-ZNzk4wY7xFZ9DIWPtzeLE3YU0CJv9A-ncFnBjNxpFNhanktfmyqAqv4vd5PGmPly-p9K_2aeiunN3CA";

function res() {
  const r: any = { headers: {} as Record<string, string> };
  r.setHeader = vi.fn((k: string, v: string) => {
    r.headers[k.toLowerCase()] = v;
    return r;
  });
  r.status = vi.fn((code: number) => {
    r.statusCode = code;
    return r;
  });
  r.json = vi.fn((body: unknown) => {
    r.body = body;
    return r;
  });
  r.send = vi.fn((body: unknown) => {
    r.body = body;
    return r;
  });
  return r;
}

function expectPrivateHeaders(r: any) {
  expect(r.headers["cache-control"]).toBe("no-store");
  expect(r.headers["x-robots-tag"]).toBe("noindex, nofollow, noarchive");
}

const post = (body: unknown, headers: Record<string, string> = {}) =>
  ({ method: "POST", headers, body, query: {} }) as any;
const get = (s: unknown, token?: string) =>
  ({ method: "GET", headers: token === undefined ? {} : { "x-tour-token": token }, query: { s }, body: undefined }) as any;

beforeEach(() => {
  process.env.TOUR_LINK_PUBLIC_KEY = PUBLIC_KEY;
  delete process.env.TOUR_REVOKED_IDS;
  vi.spyOn(console, "log").mockImplementation(() => {});
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("POST /api/tour-access", () => {
  it("200 with the name, ISO expiry and the steps, without image file names", () => {
    const r = res();
    accessHandler(post({ t: TOKEN }), r);
    expect(r.statusCode).toBe(200);
    expectPrivateHeaders(r);
    expect(r.body.name).toBe("Acme Robotics");
    expect(r.body.expiresAt).toBe("2100-01-01T00:00:00.000Z");
    expect(r.body.steps).toHaveLength(loadTourSteps().length);
    for (const step of r.body.steps) {
      expect(Object.keys(step).sort()).toEqual(["caption", "height", "hotspot", "id", "title", "width"]);
    }
  });

  it("accepts a JSON string body", () => {
    const r = res();
    accessHandler(post(JSON.stringify({ t: TOKEN })), r);
    expect(r.statusCode).toBe(200);
  });

  it("answers every bad token with the same 404 and no detail", () => {
    const [p, payload, sig] = TOKEN.split(".");
    const cases: unknown[] = [
      {},
      { t: "" },
      { t: 42 },
      { t: "garbage" },
      { t: `${p}.${payload}.${sig.slice(0, -2)}AA` },
      { t: `v2.${payload}.${sig}` },
      { t: TOKEN + "A".repeat(700) },
      "not json",
      null,
    ];
    for (const body of cases) {
      const r = res();
      accessHandler(post(body), r);
      expect(r.statusCode).toBe(404);
      expect(r.body).toEqual({ code: "invalid" });
      expectPrivateHeaders(r);
    }
  });

  it("404s an expired link (fake clock past the expiry)", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2100-01-01T00:00:01Z"));
    const r = res();
    accessHandler(post({ t: TOKEN }), r);
    expect(r.statusCode).toBe(404);
    expect(r.body).toEqual({ code: "invalid" });
  });

  it("404s a revoked link", () => {
    process.env.TOUR_REVOKED_IDS = "ffffffffffffffff, 0123456789abcdef";
    const r = res();
    accessHandler(post({ t: TOKEN }), r);
    expect(r.statusCode).toBe(404);
  });

  it("404s everything when the public key env is not set", () => {
    delete process.env.TOUR_LINK_PUBLIC_KEY;
    const r = res();
    accessHandler(post({ t: TOKEN }), r);
    expect(r.statusCode).toBe(404);
  });

  it("413 on a body over 2 KB", () => {
    const r = res();
    accessHandler(post({ t: TOKEN, pad: "x".repeat(3000) }), r);
    expect(r.statusCode).toBe(413);
    expectPrivateHeaders(r);
    const r2 = res();
    accessHandler(post({ t: TOKEN }, { "content-length": "5000" }), r2);
    expect(r2.statusCode).toBe(413);
  });

  it("405 on GET, still no-store", () => {
    const r = res();
    accessHandler({ method: "GET", headers: {}, query: {} } as any, r);
    expect(r.statusCode).toBe(405);
    expectPrivateHeaders(r);
  });
});

describe("GET /api/tour-image", () => {
  const first = loadTourSteps()[0];

  it("sends the step's image with its content type to a valid token", async () => {
    const r = res();
    await imageHandler(get(first.id, TOKEN), r);
    expect(r.statusCode).toBe(200);
    expectPrivateHeaders(r);
    const ext = first.image.split(".").pop();
    expect(r.headers["content-type"]).toBe(ext === "webp" ? "image/webp" : ext === "png" ? "image/png" : "image/jpeg");
    const onDisk = readFileSync(join(TOUR_DIR, first.image));
    expect(Buffer.compare(r.body, onDisk)).toBe(0);
    expect(r.headers["content-length"]).toBe(String(onDisk.length));
  });

  it("sends no image without a valid token", async () => {
    for (const token of [undefined, "", "garbage", TOKEN.slice(0, -4) + "AAAA"]) {
      const r = res();
      await imageHandler(get(first.id, token), r);
      expect(r.statusCode).toBe(404);
      expect(r.body).toEqual({ code: "invalid" });
      expect(r.send).not.toHaveBeenCalled();
      expectPrivateHeaders(r);
    }
  });

  it("does not accept the token in the query string", async () => {
    const r = res();
    await imageHandler({ method: "GET", headers: {}, query: { s: first.id, t: TOKEN } } as any, r);
    expect(r.statusCode).toBe(404);
  });

  it("404s an unknown step", async () => {
    const r = res();
    await imageHandler(get("no-such-step", TOKEN), r);
    expect(r.statusCode).toBe(404);
    expect(r.body).toEqual({ code: "not_found" });
  });

  it("refuses path traversal and odd step values without touching the filesystem", async () => {
    for (const s of ["../manifest", "..%2Fmanifest", "../../package.json", "manifest.json", "/etc/passwd", first.image, ["a", "b"], undefined]) {
      const r = res();
      await imageHandler(get(s, TOKEN), r);
      expect(r.statusCode).toBe(404);
      expect(r.send).not.toHaveBeenCalled();
    }
  });

  it("405 on POST", async () => {
    const r = res();
    await imageHandler({ method: "POST", headers: { "x-tour-token": TOKEN }, query: { s: first.id } } as any, r);
    expect(r.statusCode).toBe(405);
  });
});
