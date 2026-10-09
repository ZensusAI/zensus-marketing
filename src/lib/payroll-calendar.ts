import {
  addDays,
  addMonths,
  endOfMonth,
  format,
  getDate,
  getDay,
  getDaysInMonth,
  startOfDay,
  startOfMonth,
} from "date-fns";

export type PayFrequency = "weekly" | "biweekly" | "semimonthly" | "monthly";

export interface PayrollCalendarInput {
  firstPayDate: Date;
  frequency: PayFrequency;
  amountPerRun: number;
  /** Move paydays that fall on a weekend or a Federal Reserve holiday to the
      previous banking day. Off by default so the raw schedule arithmetic in
      the FAQ stays checkable; the page turns it on. */
  adjustForBankHolidays?: boolean;
  /** Days between the end of a pay period and its payday (weekly and biweekly
      only). Zero means the period ends on payday. */
  lagDays?: number;
}

export interface PayDateDetail {
  /** 1-based position within its calendar year, counted on paid dates. */
  number: number;
  scheduled: Date;
  paid: Date;
  /** Why the payday moved, when it did: "Saturday", "Sunday" or a holiday name. */
  movedReason?: string;
  periodStart: Date;
  periodEnd: Date;
}

export interface MonthSummary {
  year: number;
  month: number;
  monthLabel: string;
  payDates: string[];
  paycheckCount: number;
  cashOutflow: number;
  isThreePaycheckMonth: boolean;
}

export interface YearSummary {
  year: number;
  totalPeriods: number;
  is27PeriodYear: boolean;
  threePaycheckMonths: string[];
  months: MonthSummary[];
  normalPaychecksPerMonth: number;
  payDates: PayDateDetail[];
}

export interface PayrollCalendarResult {
  years: YearSummary[];
}

export const CALENDAR_YEARS = [2026, 2027] as const;

const MONTH_FMT = new Intl.DateTimeFormat("en-US", { month: "long" });
const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

/** Local calendar date at midnight (avoids UTC off-by-one in date inputs). */
export function normalizePayDate(date: Date): Date {
  return startOfDay(date);
}

function parseYmd(year: number, month: number, day: number): Date {
  return startOfDay(new Date(year, month, day));
}

export function toIsoDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

// ---------------------------------------------------------------------------
// Bank holidays
//
// Paydays settle through ACH, which follows the Federal Reserve holiday
// schedule. A holiday that falls on a Saturday does not close the banks on the
// Friday before it; one that falls on a Sunday closes them on the Monday after.
// Employers that observe the Friday anyway pay a day earlier than this table
// says, which the page explains next to the toggle.
// ---------------------------------------------------------------------------

export interface BankHoliday {
  date: string;
  name: string;
}

export const FEDERAL_RESERVE_HOLIDAYS: Record<number, BankHoliday[]> = {
  2026: [
    { date: "2026-01-01", name: "New Year's Day" },
    { date: "2026-01-19", name: "Martin Luther King Jr. Day" },
    { date: "2026-02-16", name: "Washington's Birthday" },
    { date: "2026-05-25", name: "Memorial Day" },
    { date: "2026-06-19", name: "Juneteenth" },
    // Independence Day is Saturday, July 4, 2026: the banks are open on Friday, July 3.
    { date: "2026-09-07", name: "Labor Day" },
    { date: "2026-10-12", name: "Columbus Day" },
    { date: "2026-11-11", name: "Veterans Day" },
    { date: "2026-11-26", name: "Thanksgiving Day" },
    { date: "2026-12-25", name: "Christmas Day" },
  ],
  2027: [
    { date: "2027-01-01", name: "New Year's Day" },
    { date: "2027-01-18", name: "Martin Luther King Jr. Day" },
    { date: "2027-02-15", name: "Washington's Birthday" },
    { date: "2027-05-31", name: "Memorial Day" },
    // Juneteenth is Saturday, June 19, 2027: the banks are open on Friday, June 18.
    { date: "2027-07-05", name: "Independence Day (observed)" },
    { date: "2027-09-06", name: "Labor Day" },
    { date: "2027-10-11", name: "Columbus Day" },
    { date: "2027-11-11", name: "Veterans Day" },
    { date: "2027-11-25", name: "Thanksgiving Day" },
    // Christmas is Saturday, December 25, 2027: the banks are open on Friday, December 24.
  ],
};

const HOLIDAY_BY_DATE = new Map<string, string>(
  Object.values(FEDERAL_RESERVE_HOLIDAYS)
    .flat()
    .map((h) => [h.date, h.name]),
);

export function bankHolidayName(date: Date): string | undefined {
  return HOLIDAY_BY_DATE.get(toIsoDate(date));
}

/** Weekday and not a Federal Reserve holiday. Years outside the table count
    every weekday as a banking day. */
export function isBankingDay(date: Date): boolean {
  const day = getDay(date);
  if (day === 0 || day === 6) return false;
  return bankHolidayName(date) === undefined;
}

/** Why a date is not a banking day, for the "moved" label. */
export function nonBankingReason(date: Date): string | undefined {
  const day = getDay(date);
  if (day === 6) return "Saturday";
  if (day === 0) return "Sunday";
  return bankHolidayName(date);
}

export function previousBankingDay(date: Date): Date {
  let cursor = normalizePayDate(date);
  while (!isBankingDay(cursor)) {
    cursor = addDays(cursor, -1);
  }
  return cursor;
}

// ---------------------------------------------------------------------------
// Schedule arithmetic
// ---------------------------------------------------------------------------

/** Semimonthly: 1st/15th if anchor day <= 15, else 15th/last day of month. */
function semimonthlyPattern(anchor: Date): "first-fifteenth" | "fifteenth-last" {
  return getDate(anchor) <= 15 ? "first-fifteenth" : "fifteenth-last";
}

function advancePayDate(date: Date, frequency: PayFrequency, direction: 1 | -1): Date {
  const d = normalizePayDate(date);

  if (frequency === "weekly") {
    return addDays(d, direction * 7);
  }

  if (frequency === "biweekly") {
    return addDays(d, direction * 14);
  }

  // Monthly schedules are generated month by month in generatePayDates, so an
  // anchor on the 31st is not clamped to the 28th for good after February.
  if (frequency === "monthly") {
    return addMonths(d, direction);
  }

  const pattern = semimonthlyPattern(d);
  const day = getDate(d);
  const year = d.getFullYear();
  const month = d.getMonth();

  if (pattern === "first-fifteenth") {
    if (direction === 1) {
      if (day === 1) return parseYmd(year, month, 15);
      const next = addMonths(parseYmd(year, month, 1), 1);
      return parseYmd(next.getFullYear(), next.getMonth(), 1);
    }
    if (day === 15) return parseYmd(year, month, 1);
    const prev = addMonths(parseYmd(year, month, 1), -1);
    return parseYmd(prev.getFullYear(), prev.getMonth(), 15);
  }

  const last = endOfMonth(d);
  if (direction === 1) {
    if (day === 15) return last;
    const next = addMonths(parseYmd(year, month, 1), 1);
    return parseYmd(next.getFullYear(), next.getMonth(), 15);
  }
  if (day === getDate(last)) return parseYmd(year, month, 15);
  const prev = addMonths(parseYmd(year, month, 1), -1);
  return endOfMonth(prev);
}

/** All pay dates from anchor, stepped backward/forward across [rangeStart, rangeEnd]. */
export function generatePayDates(
  firstPayDate: Date,
  frequency: PayFrequency,
  rangeStart: Date,
  rangeEnd: Date,
): Date[] {
  const start = normalizePayDate(rangeStart);
  const end = normalizePayDate(rangeEnd);

  if (frequency === "monthly") {
    // One payday per calendar month on the anchor's day of the month, clamped
    // to the month's length (a 31st anchor pays on February 28 and March 31).
    const anchorDay = getDate(normalizePayDate(firstPayDate));
    const dates: Date[] = [];
    let month = startOfMonth(start);
    while (month <= end) {
      const date = parseYmd(
        month.getFullYear(),
        month.getMonth(),
        Math.min(anchorDay, getDaysInMonth(month)),
      );
      if (date >= start && date <= end) dates.push(date);
      month = addMonths(month, 1);
    }
    return dates;
  }

  let cursor = normalizePayDate(firstPayDate);

  while (cursor > start) {
    const prev = advancePayDate(cursor, frequency, -1);
    if (prev.getTime() === cursor.getTime()) break;
    cursor = prev;
  }

  const dates: Date[] = [];
  const seen = new Set<number>();
  while (cursor <= end) {
    if (cursor >= start) {
      const t = cursor.getTime();
      if (!seen.has(t)) {
        seen.add(t);
        dates.push(new Date(cursor));
      }
    }
    const next = advancePayDate(cursor, frequency, 1);
    if (next.getTime() === cursor.getTime()) break;
    cursor = next;
  }

  return dates.sort((a, b) => a.getTime() - b.getTime());
}

/**
 * The pay period a scheduled payday covers.
 *
 * Weekly and biweekly periods are 7 and 14 days long and end `lagDays` before
 * the scheduled payday (zero means the period ends on payday). Semimonthly and
 * monthly periods follow the calendar: the 15th pays the 1st to the 15th, the
 * last day pays the 16th to the end of the month, the 1st pays the second half
 * of the previous month, and a monthly payday on or before the 5th pays the
 * previous month while any later monthly payday pays its own month.
 */
export function payPeriodFor(
  scheduled: Date,
  frequency: PayFrequency,
  lagDays = 0,
): { start: Date; end: Date } {
  const d = normalizePayDate(scheduled);

  if (frequency === "weekly" || frequency === "biweekly") {
    const length = frequency === "weekly" ? 7 : 14;
    const end = addDays(d, -Math.max(0, lagDays));
    return { start: addDays(end, -(length - 1)), end };
  }

  if (frequency === "monthly") {
    const base = getDate(d) <= 5 ? addMonths(d, -1) : d;
    return { start: startOfMonth(base), end: endOfMonth(base) };
  }

  const day = getDate(d);
  if (day === 15) {
    return { start: startOfMonth(d), end: d };
  }
  if (day === 1) {
    const prev = addMonths(d, -1);
    return { start: parseYmd(prev.getFullYear(), prev.getMonth(), 16), end: endOfMonth(prev) };
  }
  return { start: parseYmd(d.getFullYear(), d.getMonth(), 16), end: endOfMonth(d) };
}

function normalPaychecksPerMonth(frequency: PayFrequency): number {
  switch (frequency) {
    case "weekly":
      return 4;
    case "biweekly":
      return 2;
    case "semimonthly":
      return 2;
    case "monthly":
      return 1;
  }
}

function isHighlightMonth(count: number, frequency: PayFrequency): boolean {
  if (frequency === "biweekly") return count >= 3;
  if (frequency === "weekly") return count >= 5;
  return false;
}

function buildYearSummary(
  year: number,
  details: PayDateDetail[],
  frequency: PayFrequency,
  amountPerRun: number,
): YearSummary {
  const inYear = details.filter((d) => d.paid.getFullYear() === year);
  const byMonth = new Map<number, PayDateDetail[]>();

  for (const d of inYear) {
    const m = d.paid.getMonth();
    const list = byMonth.get(m) ?? [];
    list.push(d);
    byMonth.set(m, list);
  }

  const months: MonthSummary[] = [];
  for (let month = 0; month < 12; month += 1) {
    const dates = byMonth.get(month) ?? [];
    const paycheckCount = dates.length;
    if (paycheckCount === 0) continue;

    months.push({
      year,
      month,
      monthLabel: `${MONTH_FMT.format(parseYmd(year, month, 1))} ${year}`,
      payDates: dates.map((d) => format(d.paid, "MMM d")),
      paycheckCount,
      cashOutflow: paycheckCount * amountPerRun,
      isThreePaycheckMonth: isHighlightMonth(paycheckCount, frequency),
    });
  }

  const threePaycheckMonths = months
    .filter((m) => m.isThreePaycheckMonth)
    .map((m) => MONTH_FMT.format(parseYmd(year, m.month, 1)));

  const totalPeriods = inYear.length;

  return {
    year,
    totalPeriods,
    is27PeriodYear: frequency === "biweekly" && totalPeriods === 27,
    threePaycheckMonths,
    months,
    normalPaychecksPerMonth: normalPaychecksPerMonth(frequency),
    payDates: inYear,
  };
}

export function buildPayrollCalendar(input: PayrollCalendarInput): PayrollCalendarResult {
  const firstPayDate = normalizePayDate(input.firstPayDate);
  const rangeStart = parseYmd(CALENDAR_YEARS[0], 0, 1);
  const rangeEnd = parseYmd(CALENDAR_YEARS[CALENDAR_YEARS.length - 1], 11, 31);
  const adjust = input.adjustForBankHolidays === true;
  const lagDays = input.lagDays ?? 0;

  // Generate one extra cycle past the range so a payday that moves back from
  // the first days of the following year (for example January 1, 2028) is
  // not missed, then keep only paid dates inside the range.
  const scheduled = generatePayDates(
    firstPayDate,
    input.frequency,
    rangeStart,
    addDays(rangeEnd, 31),
  );

  const details: PayDateDetail[] = [];
  for (const date of scheduled) {
    const paid = adjust ? previousBankingDay(date) : date;
    if (paid < rangeStart || paid > rangeEnd) continue;
    const period = payPeriodFor(date, input.frequency, lagDays);
    details.push({
      number: 0,
      scheduled: date,
      paid,
      movedReason: adjust && paid.getTime() !== date.getTime() ? nonBankingReason(date) : undefined,
      periodStart: period.start,
      periodEnd: period.end,
    });
  }

  details.sort((a, b) => a.paid.getTime() - b.paid.getTime());
  const counters = new Map<number, number>();
  for (const d of details) {
    const year = d.paid.getFullYear();
    const n = (counters.get(year) ?? 0) + 1;
    counters.set(year, n);
    d.number = n;
  }

  return {
    years: CALENDAR_YEARS.map((year) =>
      buildYearSummary(year, details, input.frequency, input.amountPerRun),
    ),
  };
}

export function formatPayDateLong(date: Date): string {
  return DATE_FMT.format(date);
}

// ---------------------------------------------------------------------------
// Where are we in the year
// ---------------------------------------------------------------------------

export interface PaydayStatus {
  nextPayDate: Date;
  /** Position of the next payday within its calendar year. */
  periodNumber: number;
  totalInYear: number;
  /** Paydays on or after today in that year, the next one included. */
  remainingInYear: number;
  year: number;
}

export function nextPaydayStatus(
  result: PayrollCalendarResult,
  today: Date,
): PaydayStatus | undefined {
  const day = normalizePayDate(today);
  for (const year of result.years) {
    const next = year.payDates.find((d) => d.paid >= day);
    if (next) {
      return {
        nextPayDate: next.paid,
        periodNumber: next.number,
        totalInYear: year.totalPeriods,
        remainingInYear: year.payDates.filter((d) => d.paid >= day).length,
        year: year.year,
      };
    }
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Standard schedules, rendered as plain text on the page so a reader (or a
// search engine) gets every 2027 pay date without touching the calculator.
// ---------------------------------------------------------------------------

export interface StandardSchedule {
  id: string;
  label: string;
  firstPayDate: Date;
  frequency: PayFrequency;
}

export const STANDARD_SCHEDULES: StandardSchedule[] = [
  {
    id: "biweekly-fridays-from-january-8",
    label: "Biweekly, alternate Fridays from January 8, 2027",
    firstPayDate: parseYmd(2027, 0, 8),
    frequency: "biweekly",
  },
  {
    id: "biweekly-fridays-from-january-1",
    label: "Biweekly, alternate Fridays from January 1, 2027",
    firstPayDate: parseYmd(2027, 0, 1),
    frequency: "biweekly",
  },
  {
    id: "weekly-fridays",
    label: "Weekly, every Friday",
    firstPayDate: parseYmd(2027, 0, 1),
    frequency: "weekly",
  },
  {
    id: "semimonthly-15th-and-last-day",
    label: "Semimonthly, the 15th and the last day of the month",
    firstPayDate: parseYmd(2027, 0, 15),
    frequency: "semimonthly",
  },
  {
    id: "semimonthly-1st-and-15th",
    label: "Semimonthly, the 1st and the 15th",
    firstPayDate: parseYmd(2027, 0, 1),
    frequency: "semimonthly",
  },
  {
    id: "monthly-last-day",
    label: "Monthly, the last day of the month",
    firstPayDate: parseYmd(2027, 0, 31),
    frequency: "monthly",
  },
];

export function buildStandardSchedule(schedule: StandardSchedule): PayrollCalendarResult {
  return buildPayrollCalendar({
    firstPayDate: schedule.firstPayDate,
    frequency: schedule.frequency,
    amountPerRun: 0,
    adjustForBankHolidays: true,
  });
}

// ---------------------------------------------------------------------------
// Exports: CSV for spreadsheets, ICS for calendar apps.
// ---------------------------------------------------------------------------

function csvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function payrollCalendarCsv(result: PayrollCalendarResult): string {
  const rows: string[][] = [
    ["Year", "Pay period", "Period start", "Period end", "Scheduled payday", "Paid on", "Moved because"],
  ];
  for (const year of result.years) {
    for (const d of year.payDates) {
      rows.push([
        String(year.year),
        String(d.number),
        toIsoDate(d.periodStart),
        toIsoDate(d.periodEnd),
        toIsoDate(d.scheduled),
        toIsoDate(d.paid),
        d.movedReason ?? "",
      ]);
    }
  }
  return rows.map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n";
}

export function payrollCalendarIcs(result: PayrollCalendarResult, stamp: Date = new Date()): string {
  const dtstamp = format(stamp, "yyyyMMdd'T'HHmmss'Z'");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Zensus//Payroll Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Paydays (Zensus payroll calendar)",
  ];
  for (const year of result.years) {
    for (const d of year.payDates) {
      const start = format(d.paid, "yyyyMMdd");
      const end = format(addDays(d.paid, 1), "yyyyMMdd");
      const moved = d.movedReason
        ? ` Moved from ${format(d.scheduled, "MMM d")} (${d.movedReason}).`
        : "";
      lines.push(
        "BEGIN:VEVENT",
        `UID:payday-${start}@zensus.finance`,
        `DTSTAMP:${dtstamp}`,
        `DTSTART;VALUE=DATE:${start}`,
        `DTEND;VALUE=DATE:${end}`,
        `SUMMARY:Payday (${d.number} of ${year.totalPeriods} in ${year.year})`,
        `DESCRIPTION:Pay period ${format(d.periodStart, "MMM d")} to ${format(d.periodEnd, "MMM d, yyyy")}.${moved}`,
        "END:VEVENT",
      );
    }
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}

/** ADP documents 27 biweekly pay dates in 2026 when the schedule aligns with early January. */
export const PAYROLL_27_PERIOD_SOURCE = {
  label: "ADP 2026 payroll calendar",
  href: "https://www.adp.com/resources/articles-and-insights/articles/p/payroll-calendar-2026.aspx",
};

/** The Federal Reserve's own holiday list, the source for the table above. */
export const BANK_HOLIDAY_SOURCE = {
  label: "Federal Reserve holiday schedule",
  href: "https://www.federalreserve.gov/aboutthefed/k8.htm",
};
