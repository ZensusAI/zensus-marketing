import { describe, expect, it } from "vitest";
import { clamp01, easeInOutCubic, lerp, segment } from "./motion";

describe("motion helpers", () => {
  it("eases cubic in-out with fixed ends and midpoint", () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(0.5)).toBe(0.5);
    expect(easeInOutCubic(1)).toBe(1);
    expect(easeInOutCubic(0.25)).toBeCloseTo(0.0625);
    expect(easeInOutCubic(-1)).toBe(0);
    expect(easeInOutCubic(2)).toBe(1);
  });

  it("maps a sub-range of progress to 0..1", () => {
    expect(segment(0.1, 0.2, 0.6)).toBe(0);
    expect(segment(0.4, 0.2, 0.6)).toBeCloseTo(0.5);
    expect(segment(0.9, 0.2, 0.6)).toBe(1);
    expect(segment(0.5, 0.5, 0.5)).toBe(1);
  });

  it("clamps and interpolates", () => {
    expect(clamp01(-0.2)).toBe(0);
    expect(clamp01(1.4)).toBe(1);
    expect(lerp(10, 20, 0.25)).toBe(12.5);
  });
});
