import { describe, expect, it } from "vitest";
import {
  buildThirteenWeekForecast,
  holdsFirstOfMonth,
  nextMonday,
  parseLocalIsoDate,
  payrollRunsInWeek,
  thirteenWeekCsv,
  toLocalIsoDate,
  type ThirteenWeekInput,
} from "./thirteen-week";

// Monday, 2 November 2026. The 13 weeks run to Sunday, 31 January 2027 and
// hold two first-of-month dates, 1 December and 1 January, which the tests
// below count explicitly. 1 November is the day before week 1 starts.
const START = new Date(2026, 10, 2);

const BASE: ThirteenWeekInput = {
  openingBalance: 120000,
  cashFloor: 50000,
  weeklyCollections: 14000,
  payrollPerRun: 32000,
  payFrequency: "biweekly",
  nextPayrollWeek: 1,
  monthlyFixedCosts: 14000,
  weeklyOtherOutflows: 3000,
  oneOffEnabled: true,
  oneOffAmount: 45000,
  oneOffWeek: 6,
};

describe("payrollRunsInWeek", () => {
  it("pays weekly payroll every week", () => {
    for (let week = 1; week <= 13; week += 1) {
      expect(payrollRunsInWeek(week, new Date(2026, 10, 2 + (week - 1) * 7), "weekly", 3)).toBe(1);
    }
  });

  it("pays biweekly payroll every other week from the next run", () => {
    const runs = Array.from({ length: 13 }, (_, i) =>
      payrollRunsInWeek(i + 1, new Date(2026, 10, 2 + i * 7), "biweekly", 2),
    );
    expect(runs).toEqual([0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]);
  });

  it("reads semimonthly pay dates off the calendar", () => {
    // 9 to 15 Nov 2026 holds the 15th; 30 Nov to 6 Dec holds the 30th.
    expect(payrollRunsInWeek(2, new Date(2026, 10, 9), "semimonthly", 1)).toBe(1);
    expect(payrollRunsInWeek(5, new Date(2026, 10, 30), "semimonthly", 1)).toBe(1);
    expect(payrollRunsInWeek(1, new Date(2026, 10, 2), "semimonthly", 1)).toBe(0);
  });

  it("pays monthly payroll only in the week that holds the month end", () => {
    expect(payrollRunsInWeek(5, new Date(2026, 10, 30), "monthly", 1)).toBe(1);
    expect(payrollRunsInWeek(2, new Date(2026, 10, 9), "monthly", 1)).toBe(0);
  });

  it("counts February correctly in a non-leap year", () => {
    // 22 to 28 Feb 2027 holds the 28th, the last day of that month.
    expect(payrollRunsInWeek(1, new Date(2027, 1, 22), "monthly", 1)).toBe(1);
  });
});

describe("holdsFirstOfMonth", () => {
  it("is true for the week that contains the 1st", () => {
    expect(holdsFirstOfMonth(new Date(2026, 10, 30))).toBe(true); // 1 Dec inside
    expect(holdsFirstOfMonth(new Date(2026, 10, 9))).toBe(false);
  });
});

describe("buildThirteenWeekForecast", () => {
  const result = buildThirteenWeekForecast(BASE, START);

  it("produces 13 rows that chain closing into the next opening", () => {
    expect(result.rows).toHaveLength(13);
    for (let i = 1; i < 13; i += 1) {
      expect(result.rows[i].opening).toBe(result.rows[i - 1].closing);
    }
    expect(result.rows[0].opening).toBe(120000);
  });

  it("adds every inflow and outflow into the row totals", () => {
    for (const row of result.rows) {
      expect(row.totalIn).toBe(row.collections + row.oneOff);
      expect(row.totalOut).toBe(row.payroll + row.fixed + row.other);
      expect(row.net).toBe(row.totalIn - row.totalOut);
      expect(row.closing).toBe(row.opening + row.net);
    }
  });

  it("lands the one-off inflow in the named week only", () => {
    expect(result.rows.filter((r) => r.oneOff > 0).map((r) => r.week)).toEqual([6]);
    expect(result.rows[5].oneOff).toBe(45000);
  });

  it("ignores the one-off inflow when it is switched off", () => {
    const off = buildThirteenWeekForecast({ ...BASE, oneOffEnabled: false }, START);
    expect(off.rows.every((r) => r.oneOff === 0)).toBe(true);
    expect(off.totalIn).toBe(14000 * 13);
  });

  it("charges monthly fixed costs in the weeks that hold a 1st", () => {
    // 2 Nov start: weeks starting 30 Nov (1 Dec) and 28 Dec (1 Jan) hold a 1st.
    expect(result.rows.filter((r) => r.fixed > 0).map((r) => r.week)).toEqual([5, 9]);
  });

  it("counts seven biweekly runs from week 1", () => {
    expect(result.payrollRuns).toBe(7);
    expect(result.rows.map((r) => r.payrollRuns)).toEqual([1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]);
  });

  it("reports the lowest balance and the first week under the floor", () => {
    const lowest = Math.min(...result.rows.map((r) => r.closing));
    expect(result.lowestBalance).toBe(lowest);
    expect(result.rows[result.lowestWeek - 1].closing).toBe(lowest);
    const firstBelow = result.rows.find((r) => r.closing < BASE.cashFloor);
    expect(result.firstWeekBelowFloor).toBe(firstBelow ? firstBelow.week : null);
    expect(result.closingBalance).toBe(result.rows[12].closing);
  });

  it("returns null for the first week below the floor when none is", () => {
    const safe = buildThirteenWeekForecast({ ...BASE, cashFloor: 0 }, START);
    expect(safe.firstWeekBelowFloor).toBeNull();
    expect(safe.rows.every((r) => !r.belowFloor)).toBe(true);
  });
});

describe("thirteenWeekCsv", () => {
  it("writes one line per line item with 13 week columns", () => {
    // A 60,000 floor puts week 13 (closing 56,000) under it.
    const csv = thirteenWeekCsv(buildThirteenWeekForecast({ ...BASE, cashFloor: 60000 }, START));
    const lines = csv.trim().split("\n");
    expect(lines[0]).toBe(`Line item,${Array.from({ length: 13 }, (_, i) => `Week ${i + 1}`).join(",")}`);
    expect(lines[1].startsWith("Week beginning,2026-11-02,2026-11-09")).toBe(true);
    for (const line of lines) expect(line.split(",")).toHaveLength(14);
    expect(lines[lines.length - 1].startsWith("Buffer check,")).toBe(true);
    expect(csv).toContain("BELOW FLOOR");
  });
});

describe("date helpers", () => {
  it("nextMonday returns the same day for a Monday and the following Monday otherwise", () => {
    expect(toLocalIsoDate(nextMonday(new Date(2026, 10, 2)))).toBe("2026-11-02");
    expect(toLocalIsoDate(nextMonday(new Date(2026, 10, 4)))).toBe("2026-11-09");
    expect(toLocalIsoDate(nextMonday(new Date(2026, 10, 8)))).toBe("2026-11-09");
  });

  it("parseLocalIsoDate rejects impossible dates", () => {
    expect(parseLocalIsoDate("2026-02-30")).toBeNull();
    expect(parseLocalIsoDate("not a date")).toBeNull();
    expect(toLocalIsoDate(parseLocalIsoDate("2026-11-02")!)).toBe("2026-11-02");
  });
});
