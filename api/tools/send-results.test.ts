/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { mockClient } from "aws-sdk-client-mock";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import handler from "./send-results";
import { resetToolRateLimitForTests } from "../_lib/tool-rate-limit";

const ses = mockClient(SESClient);

function res() {
  const r: any = {};
  r.status = vi.fn(() => r);
  r.json = vi.fn(() => r);
  return r;
}

const runwayBody = {
  tool: "runway",
  email: "ada@example.com",
  inputs: {
    cash: 250000,
    monthlyRevenue: 30000,
    monthlyExpenses: 55000,
    hires: 0,
    hireSalary: 120000,
    contractEnabled: false,
    contractAmount: 24000,
    contractMonth: 3,
  },
  turnstileToken: "tok",
};

beforeEach(() => {
  ses.reset();
  resetToolRateLimitForTests();
  process.env.SES_FROM = "hello@zensus.app";
  process.env.SES_REGION = "us-east-1";
  process.env.TURNSTILE_SECRET_KEY = "secret";
  process.env.ACK_AWS_ACCESS_KEY_ID = "x";
  process.env.ACK_AWS_SECRET_ACCESS_KEY = "y";
  delete process.env.TOOL_DRY_RUN;
  delete process.env.ACK_DRY_RUN;
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) }),
  );
  ses.on(SendEmailCommand).resolves({ MessageId: "1" });
});

afterEach(() => vi.restoreAllMocks());

const req = (over: any = {}) => ({
  method: "POST",
  headers: { origin: "https://zensus.app" },
  body: { ...runwayBody, ...over.body },
  ...over,
});

describe("tools/send-results handler", () => {
  it("200 + sends on the happy path", async () => {
    const r = res();
    await handler(req() as any, r as any);
    expect(r.status).toHaveBeenCalledWith(200);
    expect(ses.commandCalls(SendEmailCommand).length).toBe(1);
  });

  it("405 on non-POST", async () => {
    const r = res();
    await handler(req({ method: "GET" }) as any, r as any);
    expect(r.status).toHaveBeenCalledWith(405);
  });

  it("400 on invalid input", async () => {
    const r = res();
    await handler(req({ body: { ...runwayBody, email: "bad" } }) as any, r as any);
    expect(r.status).toHaveBeenCalledWith(400);
  });

  it("does not send in dry-run", async () => {
    process.env.TOOL_DRY_RUN = "true";
    const r = res();
    await handler(req() as any, r as any);
    expect(r.status).toHaveBeenCalledWith(200);
    expect(ses.commandCalls(SendEmailCommand).length).toBe(0);
  });

  it("429 when rate limited", async () => {
    for (let i = 0; i < 10; i += 1) {
      const ok = res();
      await handler(
        req({ body: { ...runwayBody, email: `user${i}@example.com` } }) as any,
        ok as any,
      );
      expect(ok.status).toHaveBeenCalledWith(200);
    }
    const blocked = res();
    await handler(req() as any, blocked as any);
    expect(blocked.status).toHaveBeenCalledWith(429);
    expect(ses.commandCalls(SendEmailCommand).length).toBe(10);
  });
});
