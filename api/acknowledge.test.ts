/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { mockClient } from "aws-sdk-client-mock";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import handler from "./acknowledge";

const ses = mockClient(SESClient);
const bedrock = mockClient(BedrockRuntimeClient);

function res() {
  const r: any = {};
  r.status = vi.fn(() => r);
  r.json = vi.fn(() => r);
  return r;
}
const body = { name: "Ada", email: "ada@example.com", subject: "Runway", message: "How do I read my runway?" };

beforeEach(() => {
  ses.reset();
  bedrock.reset();
  process.env.SES_FROM = "hello@zensus.app";
  process.env.SES_REGION = "us-east-1";
  process.env.BEDROCK_REGION = "us-east-1";
  process.env.BEDROCK_MODEL_ID = "model";
  process.env.TURNSTILE_SECRET_KEY = "secret";
  process.env.ACK_AWS_ACCESS_KEY_ID = "x";
  process.env.ACK_AWS_SECRET_ACCESS_KEY = "y";
  delete process.env.ACK_DRY_RUN;
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => ({ success: true }) }));
  bedrock.on(ConverseCommand).resolves({ output: { message: { role: "assistant", content: [{ text: "Thanks for asking about runway." }] } } });
  ses.on(SendEmailCommand).resolves({ MessageId: "1" });
});
afterEach(() => vi.restoreAllMocks());

const req = (over: any = {}) => ({ method: "POST", headers: { origin: "https://zensus.app" }, body: { ...body, turnstileToken: "tok" }, ...over });

describe("acknowledge handler", () => {
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
  it("403 on disallowed origin", async () => {
    const r = res();
    await handler(req({ headers: { origin: "https://evil.com" } }) as any, r as any);
    expect(r.status).toHaveBeenCalledWith(403);
  });
  it("400 on invalid input", async () => {
    const r = res();
    await handler(req({ body: { ...body, email: "bad", turnstileToken: "tok" } }) as any, r as any);
    expect(r.status).toHaveBeenCalledWith(400);
    expect(ses.commandCalls(SendEmailCommand).length).toBe(0);
  });
  it("403 when Turnstile fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => ({ success: false }) }));
    const r = res();
    await handler(req() as any, r as any);
    expect(r.status).toHaveBeenCalledWith(403);
  });
  it("still 200 + sends when Bedrock fails (fallback intro)", async () => {
    bedrock.on(ConverseCommand).rejects(new Error("down"));
    const r = res();
    await handler(req() as any, r as any);
    expect(r.status).toHaveBeenCalledWith(200);
    expect(ses.commandCalls(SendEmailCommand).length).toBe(1);
  });
  it("does not send in dry-run", async () => {
    process.env.ACK_DRY_RUN = "true";
    const r = res();
    await handler(req() as any, r as any);
    expect(r.status).toHaveBeenCalledWith(200);
    expect(ses.commandCalls(SendEmailCommand).length).toBe(0);
  });
  it("500 when a required env var is missing", async () => {
    delete process.env.SES_FROM;
    const r = res();
    await handler(req() as any, r as any);
    expect(r.status).toHaveBeenCalledWith(500);
  });
  it("403 when the Turnstile token is missing", async () => {
    const r = res();
    await handler(req({ body: { ...body } }) as any, r as any); // no turnstileToken
    expect(r.status).toHaveBeenCalledWith(403);
  });
  it("503 when Turnstile is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));
    const r = res();
    await handler(req() as any, r as any);
    expect(r.status).toHaveBeenCalledWith(503);
  });
  it("502 when SES send fails permanently", async () => {
    const err = Object.assign(new Error("rejected"), { name: "MessageRejected" });
    ses.on(SendEmailCommand).rejects(err);
    const r = res();
    await handler(req() as any, r as any);
    expect(r.status).toHaveBeenCalledWith(502);
  });
});
