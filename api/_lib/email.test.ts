import { describe, it, expect, beforeEach } from "vitest";
import { mockClient } from "aws-sdk-client-mock";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { composeEmail, sendAck } from "./email";

const ses = mockClient(SESClient);
const FROM = "hello@zensus.app";
const params = { to: "ada@example.com", name: "Ada", intro: "Thanks for asking about runway." };

beforeEach(() => ses.reset());

describe("composeEmail", () => {
  it("builds correct envelope and bodies", () => {
    const m = composeEmail(params, FROM);
    expect(m.subject).toBe("Thanks for contacting Zensus");
    expect(m.text).toContain("Thanks for asking about runway.");
    expect(m.text).toContain("hello@zensus.app");
    expect(m.html).toContain("Thanks for asking about runway.");
  });
  it("html-escapes the intro", () => {
    const m = composeEmail({ ...params, intro: "a & b" }, FROM);
    expect(m.html).toContain("a &amp; b");
  });
});

describe("sendAck", () => {
  it("sends via SES with the right addresses", async () => {
    ses.on(SendEmailCommand).resolves({ MessageId: "1" });
    const r = await sendAck(params, { client: new SESClient({}), from: FROM, dryRun: false });
    expect(r.sent).toBe(true);
    const call = ses.commandCalls(SendEmailCommand)[0].args[0].input;
    expect(call.Source).toBe(FROM);
    expect(call.ReplyToAddresses).toEqual([FROM]);
    expect(call.Destination?.ToAddresses).toEqual(["ada@example.com"]);
  });
  it("skips sending in dry-run", async () => {
    const r = await sendAck(params, { client: new SESClient({}), from: FROM, dryRun: true });
    expect(r.sent).toBe(false);
    expect(r.dryRun).toBe(true);
    expect(ses.commandCalls(SendEmailCommand).length).toBe(0);
  });
  it("retries once on a transient error then succeeds", async () => {
    const err = Object.assign(new Error("throttled"), { name: "ThrottlingException" });
    ses.on(SendEmailCommand).rejectsOnce(err).resolves({ MessageId: "2" });
    const r = await sendAck(params, { client: new SESClient({}), from: FROM, dryRun: false });
    expect(r.sent).toBe(true);
    expect(ses.commandCalls(SendEmailCommand).length).toBe(2);
  });
});
