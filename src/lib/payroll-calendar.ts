import {
  addDays,
  addMonths,
  endOfMonth,
  format,
  getDate,
  getDaysInMonth,
  startOfDay,
} from "date-fns";

export type PayFrequency = "weekly" | "biweekly" | "semimonthly" | "monthly";

export interface PayrollCalendarInput {
  firstPayDate: Date;
  frequency: PayFrequency;
  amountPerRun: number;
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
}

export interface PayrollCalendarResult {
  years: YearSummary[];
}

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

/** Semimonthly: 1st/15th if anchor day <= 15, else 15th/last day of month. */
function semimonthlyPattern(anchor: Date): "first-fifteenth" | "fifteenth-last" {
  return getDate(anchor) <= 15 ? "first-fifteenth" : "fifteenth-last";
}

function semimonthlyDatesInMonth(year: number, month: number, pattern: ReturnType<typeof semimonthlyPattern>): Date[] {
  if (pattern === "first-fifteenth") {
    return [parseYmd(year, month, 1), parseYmd(year, month, 15)];
  }
  return [parseYmd(year, month, 15), endOfMonth(parseYmd(year, month, 1))];
}

function advancePayDate(date: Date, frequency: PayFrequency, direction: 1 | -1): Date {
  const d = normalizePayDate(date);

  if (frequency === "weekly") {
    return addDays(d, direction * 7);
  }

  if (frequency === "biweekly") {
    return addDays(d, direction * 14);
  }

  if (frequency === "monthly") {
    const day = getDate(d);
    const shifted = addMonths(d, direction);
    const clamped = Math.min(day, getDaysInMonth(shifted));
    return parseYmd(shifted.getFullYear(), shifted.getMonth(), clamped);
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
  payDates: Date[],
  frequency: PayFrequency,
  amountPerRun: number,
): YearSummary {
  const inYear = payDates.filter((d) => d.getFullYear() === year);
  const byMonth = new Map<number, Date[]>();

  for (const d of inYear) {
    const m = d.getMonth();
    const list = byMonth.get(m) ?? [];
    list.push(d);
    byMonth.set(m, list);
  }

  const months: MonthSummary[] = [];
  for (let month = 0; month < 12; month += 1) {
    const dates = byMonth.get(month) ?? [];
    dates.sort((a, b) => a.getTime() - b.getTime());
    const paycheckCount = dates.length;
    if (paycheckCount === 0) continue;

    months.push({
      year,
      month,
      monthLabel: `${MONTH_FMT.format(parseYmd(year, month, 1))} ${year}`,
      payDates: dates.map((d) => format(d, "MMM d")),
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
  };
}

export function buildPayrollCalendar(input: PayrollCalendarInput): PayrollCalendarResult {
  const firstPayDate = normalizePayDate(input.firstPayDate);
  const rangeStart = parseYmd(2026, 0, 1);
  const rangeEnd = parseYmd(2027, 11, 31);

  const payDates = generatePayDates(
    firstPayDate,
    input.frequency,
    rangeStart,
    rangeEnd,
  );

  return {
    years: [2026, 2027].map((year) =>
      buildYearSummary(year, payDates, input.frequency, input.amountPerRun),
    ),
  };
}

export function formatPayDateLong(date: Date): string {
  return DATE_FMT.format(date);
}

/** ADP documents 27 biweekly pay dates in 2026 when the schedule aligns with early January. */
export const PAYROLL_27_PERIOD_SOURCE = {
  label: "ADP 2026 payroll calendar",
  href: "https://www.adp.com/resources/articles-and-insights/articles/p/payroll-calendar-2026.aspx",
};
