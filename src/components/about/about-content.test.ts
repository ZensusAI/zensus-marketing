import { describe, expect, it } from "vitest";
import { BARS, BELIEFS, FOUNDER_PATH, HERO, MISSION, ORIGIN, SERVICE, TEAM, VISION } from "./about-content";

const strings = (value: unknown): string[] =>
  typeof value === "string" ? [value] : value && typeof value === "object" ? Object.values(value).flatMap(strings) : [];

describe("About page copy (handoff 24)", () => {
  const all = strings({ HERO, MISSION, VISION, ORIGIN, FOUNDER_PATH, SERVICE, BELIEFS, TEAM });

  it("has no em-dashes anywhere", () => {
    const emDash = String.fromCharCode(0x2014);
    for (const s of all) expect(s).not.toContain(emDash);
  });

  it("reads as three sentences, each ending in its green word", () => {
    const text = HERO.lines.map((l) => `${l.lead} can ${l.word}`).join(" ");
    expect(text).toBe("Foresight you can trace. Judgment you can defend. Numbers you can audit.");
  });

  it("keeps the lines the handoff removed out of the page", () => {
    const joined = all.join(" ");
    expect(joined).not.toContain("surviving on a story");
    expect(joined).not.toContain("NASA");
    expect(joined).not.toContain("Your data stays yours");
    expect(joined).not.toContain("A public price");
  });

  it("has four work rows, three beliefs and 13 bars with the ninth the tallest", () => {
    expect(SERVICE.rows).toHaveLength(4);
    expect(BELIEFS).toHaveLength(3);
    expect(BARS).toHaveLength(13);
    expect(BARS[8]).toBe(Math.max(...BARS));
  });

  it("never describes Zensus as a financial services provider or as AI", () => {
    const joined = all.join(" ").toLowerCase();
    expect(joined).not.toMatch(/financial services|\bai\b|artificial intelligence/);
  });

  it("keeps each person's anchor id, which blog bylines and schema.org link to", () => {
    expect(TEAM.map((m) => m.id)).toEqual(["ajin-sunny", "john-george", "joe-anglim"]);
    for (const m of TEAM) {
      expect(m.photo).toMatch(/^\/team\/.+\.webp$/);
      expect(m.linkedin).toMatch(/^https:\/\/www\.linkedin\.com\/in\//);
    }
  });
});
