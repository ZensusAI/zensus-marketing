import { describe, it, expect } from "vitest";
import { mockClient } from "aws-sdk-client-mock";
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { generateIntro, FALLBACK_INTRO } from "./intro";

const bedrock = mockClient(BedrockRuntimeClient);
const input = { name: "Ada", subject: "Runway", message: "How do I read my runway chart?" };
const opts = () => ({ client: new BedrockRuntimeClient({}), modelId: "model", timeoutMs: 8000 });

describe("generateIntro", () => {
  it("returns the model text on success", async () => {
    bedrock.reset();
    bedrock.on(ConverseCommand).resolves({
      output: { message: { role: "assistant", content: [{ text: "Thanks for asking about your runway." }] } },
    });
    const r = await generateIntro(input, opts());
    expect(r.intro).toBe("Thanks for asking about your runway.");
    expect(r.usedFallback).toBe(false);
  });
  it("falls back when Bedrock throws", async () => {
    bedrock.reset();
    bedrock.on(ConverseCommand).rejects(new Error("throttled"));
    const r = await generateIntro(input, opts());
    expect(r.intro).toBe(FALLBACK_INTRO);
    expect(r.usedFallback).toBe(true);
  });
  it("falls back when the model returns no text", async () => {
    bedrock.reset();
    bedrock.on(ConverseCommand).resolves({ output: { message: { role: "assistant", content: [] } } });
    const r = await generateIntro(input, opts());
    expect(r.usedFallback).toBe(true);
  });
});
