import { describe, expect, it } from "vitest";
import { cashRelease, workingCapitalHealth } from "./working-capital";

describe("working capital tools (net working capital guide)", () => {
  it("reproduces the guide's marketing agency example", () => {
    const h = workingCapitalHealth({
      cash: 20000,
      marketableSecurities: 0,
      receivables: 60000,
      inventory: 0,
      prepaid: 5000,
      otherCurrentAssets: 0,
      payables: 25000,
      accrued: 10000,
      shortTermDebt: 5000,
      otherCurrentLiabilities: 0,
    });
    expect(h.currentAssets).toBe(85000);
    expect(h.currentLiabilities).toBe(40000);
    expect(h.netWorkingCapital).toBe(45000);
    expect(h.currentRatio?.toFixed(3)).toBe("2.125");
    expect(h.quickRatio).toBe(2);
    expect(h.cashRatio).toBe(0.5);
  });

  it("returns no ratios when there are no current liabilities", () => {
    const h = workingCapitalHealth({
      cash: 1000, marketableSecurities: 0, receivables: 0, inventory: 0, prepaid: 0, otherCurrentAssets: 0,
      payables: 0, accrued: 0, shortTermDebt: 0, otherCurrentLiabilities: 0,
    });
    expect(h.netWorkingCapital).toBe(1000);
    expect([h.currentRatio, h.quickRatio, h.cashRatio]).toEqual([null, null, null]);
  });

  it("reproduces the guide's $46,027 scenario", () => {
    expect(
      cashRelease({ annualCreditSales: 1_200_000, annualCogs: 480_000, collectDaysFaster: 10, inventoryDaysFewer: 5, supplierDaysLonger: 5 }),
    ).toEqual({ collections: 32877, inventory: 6575, suppliers: 6575, total: 46027 });
  });
});
