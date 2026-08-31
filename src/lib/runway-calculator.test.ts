import { describe, it, expect } from "vitest";
import { simulateRunway } from "./runway-calculator";

describe("simulateRunway", () => {
  it("computes runway for a simple burn scenario", () => {
    const start = new Date(2026, 0, 1);
    const result = simulateRunway(
      {
        cash: 100000,
        monthlyRevenue: 0,
        monthlyExpenses: 25000,
        monthlyHireCost: 0,
        contractAmount: 0,
        contractMonth: 0,
      },
      start,
    );

    expect(result.runwayMonths).not.toBeNull();
    expect(result.rows).toHaveLength(12);
    expect(result.zeroCashDate).not.toBeNull();
  });

  it("returns null runway when cash never depletes", () => {
    const start = new Date(2026, 0, 1);
    const result = simulateRunway(
      {
        cash: 1_000_000,
        monthlyRevenue: 100000,
        monthlyExpenses: 10000,
        monthlyHireCost: 0,
        contractAmount: 0,
        contractMonth: 0,
      },
      start,
    );

    expect(result.runwayMonths).toBeNull();
    expect(result.zeroCashDate).toBeNull();
  });
});
