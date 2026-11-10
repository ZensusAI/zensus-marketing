import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { TOUR_DIR, validateManifest } from "./tour-manifest";

// api/_tour/manifest.json is rewritten by the screenshot capture script. These
// checks make a bad rewrite fail CI instead of shipping a broken tour.
const raw = JSON.parse(readFileSync(join(TOUR_DIR, "manifest.json"), "utf-8"));

describe("private tour manifest", () => {
  const steps = validateManifest(raw);

  it("has the eight planned steps", () => {
    expect(steps.map((s) => s.id)).toEqual([
      "connected-accounts",
      "runway",
      "runway-day",
      "thirteen-week",
      "add-hire",
      "runway-with-hire",
      "ask-zensus",
      "ask-zensus-answer",
    ]);
  });

  it("points every step at an image of the declared size", async () => {
    for (const step of steps) {
      const file = join(TOUR_DIR, step.image);
      expect(existsSync(file), step.image).toBe(true);
      const meta = await sharp(file).metadata();
      expect([meta.width, meta.height], step.image).toEqual([step.width, step.height]);
    }
  });

  it("keeps the screenshots out of public/", () => {
    for (const step of steps) expect(existsSync(join(process.cwd(), "public", step.image))).toBe(false);
    expect(existsSync(join(process.cwd(), "public", "_tour"))).toBe(false);
    expect(existsSync(join(process.cwd(), "public", "tour"))).toBe(false);
  });

  it("rejects what a broken rewrite could produce", () => {
    const step = raw.steps[0];
    const withStep = (over: Record<string, unknown>) => ({ version: 1, steps: [{ ...step, ...over }] });
    expect(() => validateManifest({ version: 2, steps: raw.steps })).toThrow();
    expect(() => validateManifest({ version: 1, steps: [] })).toThrow();
    expect(() => validateManifest({ version: 1, steps: [step, step] })).toThrow(/duplicate/);
    expect(() => validateManifest(withStep({ id: "../x" }))).toThrow();
    expect(() => validateManifest(withStep({ image: "../manifest.json" }))).toThrow();
    expect(() => validateManifest(withStep({ image: "sub/01.png" }))).toThrow();
    expect(() => validateManifest(withStep({ image: "01.gif" }))).toThrow();
    expect(() => validateManifest(withStep({ width: 0 }))).toThrow();
    expect(() => validateManifest(withStep({ title: "" }))).toThrow();
    expect(() => validateManifest(withStep({ hotspot: { x: 90, y: 10, w: 20, h: 10 } }))).toThrow();
    expect(() => validateManifest(withStep({ hotspot: { x: 10, y: 10, w: 0, h: 10 } }))).toThrow();
    expect(() => validateManifest(withStep({ hotspot: undefined }))).toThrow();
    expect(validateManifest(withStep({ image: "x.webp" }))[0].image).toBe("x.webp");
  });
});
