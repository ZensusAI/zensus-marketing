import { describe, it, expect } from "vitest";
import {
  FEDERAL_RESERVE_HOLIDAYS,
  STANDARD_SCHEDULES,
  buildPayrollCalendar,
  buildStandardSchedule,
  generatePayDates,
  isBankingDay,
  nextPaydayStatus,
  normalizePayDate,
  payPeriodFor,
  payrollCalendarCsv,
  payrollCalendarIcs,
  previousBankingDay,
  toIsoDate,
} from "./payroll-calendar";

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

  it("monthly on the 31st clamps to short months and returns to the 31st", () => {
    const dates = generatePayDates(d("2027-01-31"), "monthly", d("2027-01-01"), d("2027-04-30"));
    expect(dates.map(toIsoDate)).toEqual(["2027-01-31", "2027-02-28", "2027-03-31", "2027-04-30"]);
  });
});

// The FAQ lists the 2027 closures by weekday; hold it to the table.
describe("Federal Reserve holidays quoted in the FAQ", () => {
  it("2027 closures fall on the weekdays the FAQ names", () => {
    const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const closures = FEDERAL_RESERVE_HOLIDAYS[2027].map((h) => `${WEEKDAY[d(h.date).getDay()]} ${h.date}`);
    expect(closures).toEqual([
      "Fri 2027-01-01",
      "Mon 2027-01-18",
      "Mon 2027-02-15",
      "Mon 2027-05-31",
      "Mon 2027-07-05",
      "Mon 2027-09-06",
      "Mon 2027-10-11",
      "Thu 2027-11-11",
      "Thu 2027-11-25",
    ]);
    // Juneteenth and Christmas are Saturdays in 2027, so the Fridays before stay open.
    expect(d("2027-06-19").getDay()).toBe(6);
    expect(d("2027-12-25").getDay()).toBe(6);
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

  it("numbers pay dates within each year and carries period bounds", () => {
    const result = buildPayrollCalendar({
      firstPayDate: d("2027-01-08"),
      frequency: "biweekly",
      amountPerRun: 0,
    });
    const y2027 = result.years.find((y) => y.year === 2027)!;
    expect(y2027.payDates.map((p) => p.number)).toEqual(
      Array.from({ length: 26 }, (_, i) => i + 1),
    );
    expect(toIsoDate(y2027.payDates[0].periodStart)).toBe("2026-12-26");
    expect(toIsoDate(y2027.payDates[0].periodEnd)).toBe("2027-01-08");
  });
});

// The FAQ on /tools/payroll-calendar states these as facts about 2027. They
// are arithmetic, so hold the copy to the calendar here.
describe("2027 pay dates quoted in the payroll calendar FAQ", () => {
  const year = (firstPayDate: string, frequency: "weekly" | "biweekly", y: number) =>
    buildPayrollCalendar({ firstPayDate: d(firstPayDate), frequency, amountPerRun: 0 }).years.find(
      (summary) => summary.year === y,
    )!;

  it("a biweekly schedule that pays on Friday, January 1, 2027 has 27 pay dates", () => {
    const y2027 = year("2027-01-01", "biweekly", 2027);

    expect(y2027.totalPeriods).toBe(27);
    expect(y2027.is27PeriodYear).toBe(true);
    expect(y2027.threePaycheckMonths).toEqual(["January", "July", "December"]);
    // The same schedule in 2026: 26, starting Friday, January 2.
    expect(year("2027-01-01", "biweekly", 2026).totalPeriods).toBe(26);
  });

  it("the alternate Fridays have 26, with three paydays in April and October", () => {
    const y2027 = year("2027-01-08", "biweekly", 2027);

    expect(y2027.totalPeriods).toBe(26);
    expect(y2027.threePaycheckMonths).toEqual(["April", "October"]);
  });

  it("weekly payrolls have 53 pay dates on Fridays in 2027 and on Thursdays in 2026", () => {
    expect(year("2027-01-01", "weekly", 2027).totalPeriods).toBe(53);
    expect(year("2026-01-01", "weekly", 2026).totalPeriods).toBe(53);
    expect(year("2027-01-01", "weekly", 2026).totalPeriods).toBe(52);
  });
});

// The holiday rule the page states: paydays settle through ACH, which follows
// the Federal Reserve schedule. Saturday holidays leave the Friday open.
describe("bank holiday adjustment", () => {
  it("moves Friday, January 1, 2027 to Thursday, December 31, 2026", () => {
    expect(toIsoDate(previousBankingDay(d("2027-01-01")))).toBe("2026-12-31");
  });

  it("keeps Friday, December 24, 2027 and Friday, July 3, 2026 as banking days", () => {
    expect(isBankingDay(d("2027-12-24"))).toBe(true);
    expect(isBankingDay(d("2026-07-03"))).toBe(true);
    expect(toIsoDate(previousBankingDay(d("2027-12-24")))).toBe("2027-12-24");
  });

  it("moves Christmas 2026 (a Friday) and Thanksgiving 2027 (a Thursday) back one day", () => {
    expect(toIsoDate(previousBankingDay(d("2026-12-25")))).toBe("2026-12-24");
    expect(toIsoDate(previousBankingDay(d("2027-11-25")))).toBe("2027-11-24");
  });

  it("walks weekends and the observed July 4, 2027 holiday back to Friday, July 2", () => {
    expect(toIsoDate(previousBankingDay(d("2027-07-04")))).toBe("2027-07-02");
    expect(toIsoDate(previousBankingDay(d("2027-07-05")))).toBe("2027-07-02");
  });

  it("turns the January 1, 2027 biweekly schedule into 27 pay dates in 2026 and 26 in 2027", () => {
    const result = buildPayrollCalendar({
      firstPayDate: d("2027-01-01"),
      frequency: "biweekly",
      amountPerRun: 0,
      adjustForBankHolidays: true,
    });
    const y2026 = result.years.find((y) => y.year === 2026)!;
    const y2027 = result.years.find((y) => y.year === 2027)!;
    expect(y2026.totalPeriods).toBe(27);
    expect(y2026.is27PeriodYear).toBe(true);
    expect(y2027.totalPeriods).toBe(26);
    const moved = y2026.payDates[y2026.payDates.length - 1];
    expect(toIsoDate(moved.paid)).toBe("2026-12-31");
    expect(toIsoDate(moved.scheduled)).toBe("2027-01-01");
    expect(moved.movedReason).toBe("New Year's Day");
  });

  it("leaves the January 8, 2027 schedule at 26 and moves only Christmas 2026", () => {
    const result = buildPayrollCalendar({
      firstPayDate: d("2027-01-08"),
      frequency: "biweekly",
      amountPerRun: 0,
      adjustForBankHolidays: true,
    });
    const y2026 = result.years.find((y) => y.year === 2026)!;
    const y2027 = result.years.find((y) => y.year === 2027)!;
    expect(y2027.totalPeriods).toBe(26);
    expect(y2027.payDates.filter((p) => p.movedReason)).toHaveLength(0);
    expect(toIsoDate(y2027.payDates[25].paid)).toBe("2027-12-24");
    const moved2026 = y2026.payDates.filter((p) => p.movedReason);
    expect(moved2026.map((p) => toIsoDate(p.paid))).toEqual(["2026-12-24"]);
  });

  it("weekly Fridays have 52 paid dates in 2027 once January 1 moves into 2026", () => {
    const result = buildPayrollCalendar({
      firstPayDate: d("2027-01-01"),
      frequency: "weekly",
      amountPerRun: 0,
      adjustForBankHolidays: true,
    });
    expect(result.years.find((y) => y.year === 2027)!.totalPeriods).toBe(52);
  });
});

describe("payPeriodFor", () => {
  it("biweekly with no lag ends on payday; a 7-day lag matches a typical arrears calendar", () => {
    const none = payPeriodFor(d("2027-01-08"), "biweekly", 0);
    expect([toIsoDate(none.start), toIsoDate(none.end)]).toEqual(["2026-12-26", "2027-01-08"]);
    // A university biweekly calendar pays the December 19 to January 1 period on January 8.
    const week = payPeriodFor(d("2027-01-08"), "biweekly", 7);
    expect([toIsoDate(week.start), toIsoDate(week.end)]).toEqual(["2026-12-19", "2027-01-01"]);
  });

  it("semimonthly and monthly periods follow the calendar", () => {
    const fifteenth = payPeriodFor(d("2027-03-15"), "semimonthly");
    expect([toIsoDate(fifteenth.start), toIsoDate(fifteenth.end)]).toEqual(["2027-03-01", "2027-03-15"]);
    const last = payPeriodFor(d("2027-02-28"), "semimonthly");
    expect([toIsoDate(last.start), toIsoDate(last.end)]).toEqual(["2027-02-16", "2027-02-28"]);
    const first = payPeriodFor(d("2027-03-01"), "semimonthly");
    expect([toIsoDate(first.start), toIsoDate(first.end)]).toEqual(["2027-02-16", "2027-02-28"]);
    const monthEnd = payPeriodFor(d("2027-01-31"), "monthly");
    expect([toIsoDate(monthEnd.start), toIsoDate(monthEnd.end)]).toEqual(["2027-01-01", "2027-01-31"]);
    const monthStart = payPeriodFor(d("2027-02-01"), "monthly");
    expect([toIsoDate(monthStart.start), toIsoDate(monthStart.end)]).toEqual(["2027-01-01", "2027-01-31"]);
  });
});

describe("nextPaydayStatus", () => {
  const result = buildPayrollCalendar({
    firstPayDate: d("2027-01-08"),
    frequency: "biweekly",
    amountPerRun: 0,
    adjustForBankHolidays: true,
  });

  it("finds the next payday and its position in the year", () => {
    const status = nextPaydayStatus(result, d("2026-10-09"))!;
    expect(toIsoDate(status.nextPayDate)).toBe("2026-10-16");
    expect(status.periodNumber).toBe(21);
    expect(status.totalInYear).toBe(26);
    expect(status.remainingInYear).toBe(6);
    expect(status.year).toBe(2026);
  });

  it("counts a payday that falls on today as the next one", () => {
    const status = nextPaydayStatus(result, d("2026-10-16"))!;
    expect(toIsoDate(status.nextPayDate)).toBe("2026-10-16");
  });

  it("rolls into the next year after the last payday of the year", () => {
    const status = nextPaydayStatus(result, d("2026-12-30"))!;
    expect(toIsoDate(status.nextPayDate)).toBe("2027-01-08");
    expect(status.periodNumber).toBe(1);
    expect(status.year).toBe(2027);
  });

  it("returns undefined past the end of the calendar", () => {
    expect(nextPaydayStatus(result, d("2028-01-15"))).toBeUndefined();
  });
});

describe("standard 2027 schedules", () => {
  const byId = (id: string) =>
    buildStandardSchedule(STANDARD_SCHEDULES.find((s) => s.id === id)!).years.find(
      (y) => y.year === 2027,
    )!;

  it("lists the pay-date counts the page prints", () => {
    expect(byId("biweekly-fridays-from-january-8").totalPeriods).toBe(26);
    expect(byId("biweekly-fridays-from-january-1").totalPeriods).toBe(26);
    expect(byId("weekly-fridays").totalPeriods).toBe(52);
    expect(byId("semimonthly-15th-and-last-day").totalPeriods).toBe(24);
    expect(byId("semimonthly-1st-and-15th").totalPeriods).toBe(24);
    expect(byId("monthly-last-day").totalPeriods).toBe(12);
  });

  it("starts the January 8 schedule on January 8 and ends it on December 24", () => {
    const dates = byId("biweekly-fridays-from-january-8").payDates.map((p) => toIsoDate(p.paid));
    expect(dates[0]).toBe("2027-01-08");
    expect(dates[dates.length - 1]).toBe("2027-12-24");
  });

  it("moves semimonthly and monthly paydays off weekends and holidays", () => {
    // May 15, 2027 is a Saturday; the 15th-and-last schedule pays on Friday, May 14.
    const semi = byId("semimonthly-15th-and-last-day").payDates.map((p) => toIsoDate(p.paid));
    expect(semi).toContain("2027-05-14");
    // January 31, 2027 is a Sunday; the monthly schedule pays on Friday, January 29.
    const monthly = byId("monthly-last-day").payDates.map((p) => toIsoDate(p.paid));
    expect(monthly[0]).toBe("2027-01-29");
  });
});

describe("exports", () => {
  const result = buildPayrollCalendar({
    firstPayDate: d("2027-01-08"),
    frequency: "biweekly",
    amountPerRun: 0,
    adjustForBankHolidays: true,
  });

  it("writes one CSV row per pay date with period bounds and the move reason", () => {
    const csv = payrollCalendarCsv(result);
    const lines = csv.trim().split("\r\n");
    expect(lines[0]).toBe(
      "Year,Pay period,Period start,Period end,Scheduled payday,Paid on,Moved because",
    );
    expect(lines).toHaveLength(1 + 26 + 26);
    expect(lines).toContain("2026,26,2026-12-12,2026-12-25,2026-12-25,2026-12-24,Christmas Day");
    expect(lines).toContain("2027,1,2026-12-26,2027-01-08,2027-01-08,2027-01-08,");
  });

  it("writes one all-day ICS event per pay date", () => {
    const ics = payrollCalendarIcs(result, new Date(Date.UTC(2026, 9, 9, 12, 0, 0)));
    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(52);
    expect(ics).toContain("DTSTART;VALUE=DATE:20270108");
    expect(ics).toContain("DTEND;VALUE=DATE:20270109");
    expect(ics).toContain("UID:payday-20261224@zensus.finance");
    expect(ics).toContain("Moved from Dec 25 (Christmas Day).");
    expect(ics.trim().endsWith("END:VCALENDAR")).toBe(true);
  });
});
