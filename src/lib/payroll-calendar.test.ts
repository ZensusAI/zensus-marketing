import { describe, it, expect } from "vitest";
import { buildPayrollCalendar, generatePayDates, normalizePayDate } from "./payroll-calendar";

function d(iso: string): Date {
  const [y, m, day] = iso.split("-").map(Number);
  return normalizePayDate(new Date(y, m - 1, day));
}

describe("generatePayDates", () => {
  it("biweekly from Jan 1 2026 yields 27 pay dates in calendar year 2026", () => {
    const dates = generatePayDates(d("2026-01-01"), "biweekly", d("2026-01-01"), d("2026-12-31"));
    expect(dates.filter((x) => x.getFullYear() === 2026)).toHaveLength(27);
  });

  it("biweekly from Jan 16 2026 yields 26 pay dates in calendar year 2026", () => {
    const dates = generatePayDates(d("2026-01-16"), "biweekly", d("2026-01-01"), d("2026-12-31"));
    expect(dates.filter((x) => x.getFullYear() === 2026)).toHaveLength(26);
  });

  it("semimonthly on 1st/15th yields 24 pay dates per year", () => {
    const dates = generatePayDates(d("2026-01-15"), "semimonthly", d("2026-01-01"), d("2026-12-31"));
    expect(dates.filter((x) => x.getFullYear() === 2026)).toHaveLength(24);
  });

  it("monthly yields 12 pay dates per year", () => {
    const dates = generatePayDates(d("2026-01-31"), "monthly", d("2026-01-01"), d("2026-12-31"));
    expect(dates.filter((x) => x.getFullYear() === 2026)).toHaveLength(12);
  });
});

describe("buildPayrollCalendar", () => {
  it("flags 27-period biweekly year for early January first payday", () => {
    const result = buildPayrollCalendar({
      firstPayDate: d("2026-01-01"),
      frequency: "biweekly",
      amountPerRun: 21000,
    });
    const y2026 = result.years.find((y) => y.year === 2026)!;
    expect(y2026.totalPeriods).toBe(27);
    expect(y2026.is27PeriodYear).toBe(true);
  });

  it("identifies three-paycheck months for biweekly schedules", () => {
    const result = buildPayrollCalendar({
      firstPayDate: d("2026-01-16"),
      frequency: "biweekly",
      amountPerRun: 21000,
    });
    const y2026 = result.years.find((y) => y.year === 2026)!;
    expect(y2026.threePaycheckMonths.length).toBe(2);
    const threePayMonths = y2026.months.filter((m) => m.isThreePaycheckMonth);
    expect(threePayMonths).toHaveLength(2);
    for (const month of threePayMonths) {
      expect(month.cashOutflow).toBe(21000 * 3);
    }
  });

  it("computes monthly cash impact as count times amount per run", () => {
    const result = buildPayrollCalendar({
      firstPayDate: d("2026-01-16"),
      frequency: "biweekly",
      amountPerRun: 21000,
    });
    const y2026 = result.years.find((y) => y.year === 2026)!;
    const normalMonth = y2026.months.find((m) => m.paycheckCount === 2)!;
    expect(normalMonth.cashOutflow).toBe(42000);
  });
});
