import { describe, expect, it } from "vitest";
import { squirclePath, squircleRingImage, toRadii } from "./squircle";

describe("squirclePath", () => {
  it("is a plain rectangle when every radius is zero", () => {
    expect(squirclePath(100, 50, [0, 0, 0, 0])).toBe("M100 0L100 50L0 50L0 0Z");
  });

  it("starts on the top edge, is closed, and is made only of finite numbers", () => {
    const d = squirclePath(320, 320, [24, 24, 24, 24]);
    expect(d.startsWith("M")).toBe(true);
    expect(d.endsWith("Z")).toBe(true);
    expect(d).not.toMatch(/NaN|Infinity|undefined/);
    // Four corners, each a curve, an arc and a curve.
    expect(d.match(/a24 24 0 0 1/g)).toHaveLength(4);
  });

  it("curves only the corners that have a radius (top corners only, as the mission bars)", () => {
    const d = squirclePath(60, 200, [8, 8, 0, 0]);
    expect(d.match(/a8 8 0 0 1/g)).toHaveLength(2);
    expect(d).toContain("L60 200");
    expect(d).toContain("L0 200");
  });

  it("clamps a radius larger than half the box instead of producing NaN", () => {
    const d = squirclePath(40, 40, [60, 60, 60, 60]);
    expect(d).not.toMatch(/NaN|Infinity/);
  });

  it("offsets the whole path, which is how a border is inset by half its width", () => {
    const d = squirclePath(99, 49, [0, 0, 0, 0], 0.5, 0.5);
    expect(d).toBe("M99.5 0.5L99.5 49.5L0.5 49.5L0.5 0.5Z");
  });
});

describe("toRadii", () => {
  it("spreads one radius over four corners and keeps a list as is", () => {
    expect(toRadii(12)).toEqual([12, 12, 12, 12]);
    expect(toRadii([5, 5, 0, 0])).toEqual([5, 5, 0, 0]);
  });
});

describe("squircleRingImage", () => {
  it("draws a 1px stroke as a data URL, dashed when asked", () => {
    const solid = squircleRingImage(100, 100, [20, 20, 20, 20], "#EBDCB8");
    expect(solid.startsWith('url("data:image/svg+xml,')).toBe(true);
    expect(decodeURIComponent(solid)).toContain('stroke="#EBDCB8"');
    expect(decodeURIComponent(solid)).not.toContain("stroke-dasharray");
    expect(decodeURIComponent(squircleRingImage(100, 100, [20, 20, 20, 20], "#C9B385", "5 4"))).toContain('stroke-dasharray="5 4"');
  });
});
