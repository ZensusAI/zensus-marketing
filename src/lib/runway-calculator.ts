export const LOADED_COST_MULTIPLIER = 1.3;
export const MAX_RUNWAY_MONTHS = 48;

export interface RunwaySimulationInput {
  cash: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  monthlyHireCost: number;
  contractAmount: number;
  /** 1-indexed month (from now) the contract payment lands; 0 disables it. */
  contractMonth: number;
}

export interface RunwayMonthRow {
  index: number;
  inflow: number;
  outflow: number;
  closing: number;
}

export interface RunwaySimulationResult {
  rows: RunwayMonthRow[];
  /** Months until the balance crosses zero, fractional; null if it never does. */
  runwayMonths: number | null;
  zeroCashDate: Date | null;
}

export function simulateRunway(
  input: RunwaySimulationInput,
  startDate: Date,
): RunwaySimulationResult {
  const rows: RunwayMonthRow[] = [];
  let balance = input.cash;
  let runwayMonths: number | null = null;

  for (let month = 1; month <= MAX_RUNWAY_MONTHS; month += 1) {
    const contractInflow = month === input.contractMonth ? input.contractAmount : 0;
    const inflow = input.monthlyRevenue + contractInflow;
    const outflow = input.monthlyExpenses + input.monthlyHireCost;
    const opening = balance;
    balance = opening + inflow - outflow;

    if (rows.length < 12) {
      rows.push({ index: month, inflow, outflow, closing: balance });
    }
    if (runwayMonths === null && balance <= 0 && opening > 0) {
      const burnedThisMonth = opening - balance;
      const fraction = burnedThisMonth > 0 ? opening / burnedThisMonth : 0;
      runwayMonths = month - 1 + fraction;
    }
    if (runwayMonths !== null && rows.length >= 12) break;
  }

  let zeroCashDate: Date | null = null;
  if (runwayMonths !== null) {
    zeroCashDate = new Date(startDate);
    const wholeMonths = Math.floor(runwayMonths);
    zeroCashDate.setMonth(zeroCashDate.getMonth() + wholeMonths);
    zeroCashDate.setDate(
      zeroCashDate.getDate() + Math.round((runwayMonths - wholeMonths) * 30.4),
    );
  }

  return { rows, runwayMonths, zeroCashDate };
}

export function monthlyHireCost(hires: number, hireSalary: number): number {
  return (hires * hireSalary * LOADED_COST_MULTIPLIER) / 12;
}

export function formatRunwayMonthLabel(startDate: Date, index: number): string {
  const d = new Date(startDate);
  d.setMonth(d.getMonth() + index);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/** Local calendar date as YYYY-MM-DD (not UTC). */
export function formatLocalDateIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
