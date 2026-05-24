import { describe, it, expect } from "vitest";
import { validateInput } from "./validate";

const good = { name: "Ada Lovelace", email: "ada@example.com", subject: "Hi", message: "I have a question about runway." };

describe("validateInput", () => {
  it("accepts a good payload and trims", () => {
    const r = validateInput({ ...good, name: "  Ada  " });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.name).toBe("Ada");
  });
  it("rejects when the honeypot is filled", () => {
    expect(validateInput({ ...good, _gotcha: "bot" }).ok).toBe(false);
  });
  it("rejects a missing field", () => {
    expect(validateInput({ ...good, message: "" }).ok).toBe(false);
  });
  it("rejects a bad email", () => {
    expect(validateInput({ ...good, email: "nope" }).ok).toBe(false);
  });
  it("rejects an oversized message", () => {
    expect(validateInput({ ...good, message: "x".repeat(5001) }).ok).toBe(false);
  });
  it("rejects non-object input", () => {
    expect(validateInput("nope").ok).toBe(false);
  });
});
