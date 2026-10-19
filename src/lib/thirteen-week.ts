// The 13-week cash flow forecast behind /tools/13-week-cash-flow-template.
//
// Pure functions, no React and no DOM, because the serverless email handler
// (api/_lib/tool-email-thirteen-week.ts) builds the same 13 rows from the same
// inputs so the email matches what the visitor saw on the page. Keep it that
// way: anything that needs `window` belongs in the page.
//
// The model places cash on the week it lands rather than smoothing it:
// payroll on pay dates, monthly bills in the week that holds the 1st, a
// one-off inflow in the week the visitor names. That lumpiness is the point of
// a 13-week forecast and the thing a monthly average hides.

export const WEEKS = 13;
export const MIN_NEXT_PAYROLL_WEEK = 1;
export const MAX_NEXT_PAYROLL_WEEK = 4;

export type PayFrequency = "weekly" | "biweekly" | "semimonthly" | "monthly";

export const PAY_FREQUENCY_LABELS: Record<PayFrequency, string> = {
  weekly: "Weekly",
  biweekly: "Biweekly (every 2 weeks)",
  semimonthly: "Semimonthly (15th and month end)",
  monthly: "Monthly (month end)",
};

export interface ThirteenWeekInput {
  /** Bank balance at the start of week 1. */
  openingBalance: number;
  /** The minimum balance the visitor wants to stay above. */
  cashFloor: number;
  /** Customer collections expected every week. */
  weeklyCollections: number;
  /** Cash out per payroll run, including taxes and contractors. */
  payrollPerRun: number;
  payFrequency: PayFrequency;
  /** For weekly and biweekly payroll: the week (1 to 4) of the next run. */
  nextPayrollWeek: number;
  /** Rent, software, insurance and other bills that land once a month. */
  monthlyFixedCosts: number;
  /** Everything else that goes out every week. */
  weeklyOtherOutflows: number;
  oneOffEnabled: boolean;
  /** A single inflow such as an annual contract payment. */
  oneOffAmount: number;
  /** The week (1 to 13) the one-off inflow lands. */
  oneOffWeek: number;
}

export interface ThirteenWeekRow {
  week: number;
  weekStart: Date;
  opening: number;
  collections: number;
  oneOff: number;
  totalIn: number;
  payroll: number;
  payrollRuns: number;
  fixed: number;
  other: number;
  totalOut: number;
  net: number;
  closing: number;
  belowFloor: boolean;
}

export interface ThirteenWeekResult {
  rows: ThirteenWeekRow[];
  totalIn: number;
  totalOut: number;
  payrollRuns: number;
  lowestBalance: number;
  lowestWeek: number;
  /** The first week whose closing balance is under the floor, or null. */
  firstWeekBelowFloor: number | null;
  closingBalance: number;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + days);
  return next;
}

function lastDayOfMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** The Monday on or after `date`, at local midnight. */
export function nextMonday(date: Date): Date {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const offset = (8 - day.getDay()) % 7;
  return addDays(day, offset);
}

/** YYYY-MM-DD in local time, the form the page sends to the email handler. */
export function toLocalIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Parse YYYY-MM-DD as a local date. Returns null when the string is not a real date. */
export function parseLocalIsoDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y, m, d] = value.split("-").map(Number);
  const parsed = new Date(y, m - 1, d);
  if (parsed.getFullYear() !== y || parsed.getMonth() !== m - 1 || parsed.getDate() !== d) {
    return null;
  }
  return parsed;
}

/**
 * How many pay dates fall inside the seven days starting at `weekStart`.
 *
 * Weekly and biweekly schedules are counted from the week of the next run.
 * Semimonthly pays on the 15th and the last day of the month, monthly on the
 * last day, so those two are read off the calendar. Pay dates are not moved
 * off weekends here; the payroll calendar tool does that, and in a weekly
 * grid a one-day move rarely changes the week.
 */
export function payrollRunsInWeek(
  week: number,
  weekStart: Date,
  frequency: PayFrequency,
  nextPayrollWeek: number,
): number {
  if (frequency === "weekly") return 1;
  if (frequency === "biweekly") {
    if (week < nextPayrollWeek) return 0;
    return (week - nextPayrollWeek) % 2 === 0 ? 1 : 0;
  }
  let runs = 0;
  for (let i = 0; i < 7; i += 1) {
    const day = addDays(weekStart, i);
    const date = day.getDate();
    const last = lastDayOfMonth(day.getFullYear(), day.getMonth());
    if (date === last) runs += 1;
    if (frequency === "semimonthly" && date === 15) runs += 1;
  }
  return runs;
}

/** Whether the seven days starting at `weekStart` include the 1st of a month. */
export function holdsFirstOfMonth(weekStart: Date): boolean {
  for (let i = 0; i < 7; i += 1) {
    if (addDays(weekStart, i).getDate() === 1) return true;
  }
  return false;
}

export function buildThirteenWeekForecast(
  input: ThirteenWeekInput,
  startDate: Date,
): ThirteenWeekResult {
  const rows: ThirteenWeekRow[] = [];
  let opening = input.openingBalance;
  let totalIn = 0;
  let totalOut = 0;
  let payrollRuns = 0;
  let lowestBalance = Number.POSITIVE_INFINITY;
  let lowestWeek = 1;
  let firstWeekBelowFloor: number | null = null;

  for (let week = 1; week <= WEEKS; week += 1) {
    const weekStart = addDays(startDate, (week - 1) * 7);
    const runs = payrollRunsInWeek(week, weekStart, input.payFrequency, input.nextPayrollWeek);
    const oneOff = input.oneOffEnabled && input.oneOffWeek === week ? input.oneOffAmount : 0;
    const collections = input.weeklyCollections;
    const payroll = runs * input.payrollPerRun;
    const fixed = holdsFirstOfMonth(weekStart) ? input.monthlyFixedCosts : 0;
    const other = input.weeklyOtherOutflows;
    const weekIn = collections + oneOff;
    const weekOut = payroll + fixed + other;
    const net = weekIn - weekOut;
    const closing = opening + net;
    const belowFloor = closing < input.cashFloor;

    rows.push({
      week,
      weekStart,
      opening,
      collections,
      oneOff,
      totalIn: weekIn,
      payroll,
      payrollRuns: runs,
      fixed,
      other,
      totalOut: weekOut,
      net,
      closing,
      belowFloor,
    });

    totalIn += weekIn;
    totalOut += weekOut;
    payrollRuns += runs;
    if (closing < lowestBalance) {
      lowestBalance = closing;
      lowestWeek = week;
    }
    if (belowFloor && firstWeekBelowFloor === null) firstWeekBelowFloor = week;
    opening = closing;
  }

  return {
    rows,
    totalIn,
    totalOut,
    payrollRuns,
    lowestBalance,
    lowestWeek,
    firstWeekBelowFloor,
    closingBalance: rows[WEEKS - 1].closing,
  };
}

function csvCell(value: string | number): string {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/**
 * The forecast as CSV in the template's orientation: one row per line item,
 * one column per week, so it pastes straight into the XLSX template.
 */
export function thirteenWeekCsv(result: ThirteenWeekResult): string {
  const weeks = result.rows;
  const line = (label: string, values: (string | number)[]) =>
    [label, ...values].map(csvCell).join(",");
  const lines = [
    line("Line item", weeks.map((r) => `Week ${r.week}`)),
    line("Week beginning", weeks.map((r) => toLocalIsoDate(r.weekStart))),
    line("Opening balance", weeks.map((r) => r.opening)),
    line("CASH IN", weeks.map(() => "")),
    line("Customer collections", weeks.map((r) => r.collections)),
    line("One-off inflow", weeks.map((r) => r.oneOff)),
    line("Total cash in", weeks.map((r) => r.totalIn)),
    line("CASH OUT", weeks.map(() => "")),
    line("Payroll and contractors", weeks.map((r) => r.payroll)),
    line("Monthly fixed costs", weeks.map((r) => r.fixed)),
    line("Other outflows", weeks.map((r) => r.other)),
    line("Total cash out", weeks.map((r) => r.totalOut)),
    line("Net cash flow", weeks.map((r) => r.net)),
    line("Closing balance", weeks.map((r) => r.closing)),
    line("Buffer check", weeks.map((r) => (r.belowFloor ? "BELOW FLOOR" : "OK"))),
  ];
  return `${lines.join("\n")}\n`;
}
