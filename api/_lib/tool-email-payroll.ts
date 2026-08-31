import { buildPayrollCalendar } from "../../src/lib/payroll-calendar.js";
import { escapeHtml } from "./sanitize.js";
import { toolEmailHtml, toolEmailText } from "./tool-email-shell.js";
import type { PayrollToolInput } from "./tool-validate.js";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const FREQUENCY_LABELS: Record<PayrollToolInput["frequency"], string> = {
  weekly: "Weekly",
  biweekly: "Biweekly (every 2 weeks)",
  semimonthly: "Semimonthly (twice per month)",
  monthly: "Monthly",
};

function parseInputDate(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function renderYearTable(year: ReturnType<typeof buildPayrollCalendar>["years"][number], amountPerRun: number) {
  if (year.months.length === 0) {
    return `<p style="margin:0 0 16px;">No pay dates fall in ${year.year} for this schedule.</p>`;
  }

  const rows = year.months
    .map((row) => {
      const extra =
        amountPerRun > 0 &&
        row.isThreePaycheckMonth &&
        row.paycheckCount > year.normalPaychecksPerMonth
          ? ` (+${usd.format(row.cashOutflow - year.normalPaychecksPerMonth * amountPerRun)} vs normal)`
          : "";
      return `<tr>
        <td style="padding:8px 12px; border-bottom:1px solid #f1f3f5;">${escapeHtml(row.monthLabel)}${row.isThreePaycheckMonth ? " (3 paychecks)" : ""}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #f1f3f5;">${escapeHtml(row.payDates.join(", "))}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #f1f3f5; text-align:right;">${row.paycheckCount}</td>
        ${amountPerRun > 0 ? `<td style="padding:8px 12px; border-bottom:1px solid #f1f3f5; text-align:right;">${escapeHtml(usd.format(row.cashOutflow))}${escapeHtml(extra)}</td>` : ""}
      </tr>`;
    })
    .join("");

  return `
    <p style="margin:0 0 12px; font-weight:600; color:#0f172a;">${year.year} calendar</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:14px; border:1px solid #f1f3f5; border-radius:8px; overflow:hidden; margin:0 0 24px;">
      <thead>
        <tr style="background-color:#f8fafc;">
          <th align="left" style="padding:8px 12px;">Month</th>
          <th align="left" style="padding:8px 12px;">Pay dates</th>
          <th align="right" style="padding:8px 12px;">Paychecks</th>
          ${amountPerRun > 0 ? '<th align="right" style="padding:8px 12px;">Cash outflow</th>' : ""}
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

export function composePayrollToolEmail(input: PayrollToolInput, from: string) {
  const result = buildPayrollCalendar({
    firstPayDate: parseInputDate(input.firstPayDate),
    frequency: input.frequency,
    amountPerRun: input.amountPerRun,
  });

  const y2026 = result.years.find((y) => y.year === 2026)!;
  const y2027 = result.years.find((y) => y.year === 2027)!;

  const threePaycheckLabel =
    input.frequency === "biweekly" || input.frequency === "weekly"
      ? String(y2026.threePaycheckMonths.length)
      : "N/A";

  const period27Note = y2026.is27PeriodYear
    ? "Your biweekly schedule lands 27 pay dates inside calendar year 2026. Budgeting payroll as annual cost divided by 12 will understate cash outflows this year."
    : null;

  const bodyHtml = `
    <p style="margin:0 0 20px;">Here is the detailed payroll calendar breakdown from Zensus, based on the schedule you entered.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
      <tr><td style="padding:6px 0;"><strong>First pay date:</strong> ${escapeHtml(input.firstPayDate)}</td></tr>
      <tr><td style="padding:6px 0;"><strong>Frequency:</strong> ${escapeHtml(FREQUENCY_LABELS[input.frequency])}</td></tr>
      ${input.amountPerRun > 0 ? `<tr><td style="padding:6px 0;"><strong>Amount per run:</strong> ${escapeHtml(usd.format(input.amountPerRun))}</td></tr>` : ""}
      <tr><td style="padding:6px 0;"><strong>Pay periods in 2026:</strong> ${y2026.totalPeriods}</td></tr>
      <tr><td style="padding:6px 0;"><strong>Pay periods in 2027:</strong> ${y2027.totalPeriods}</td></tr>
      <tr><td style="padding:6px 0;"><strong>Three-paycheck months (2026):</strong> ${escapeHtml(threePaycheckLabel)}${y2026.threePaycheckMonths.length > 0 ? ` (${escapeHtml(y2026.threePaycheckMonths.join(", "))})` : ""}</td></tr>
    </table>
    ${period27Note ? `<p style="margin:0 0 16px;">${escapeHtml(period27Note)}</p>` : ""}
    ${renderYearTable(y2026, input.amountPerRun)}
    ${renderYearTable(y2027, input.amountPerRun)}
    <p style="margin:0; font-size:14px;">Dividing annual payroll by 12 misses three-paycheck months and 27-period years. Zensus maps payroll and every other outflow on the dates they actually hit your bank.</p>
  `;

  const bodyText = [
    "Here is your detailed payroll calendar breakdown.",
    "",
    `First pay date: ${input.firstPayDate}`,
    `Frequency: ${FREQUENCY_LABELS[input.frequency]}`,
    input.amountPerRun > 0 ? `Amount per run: ${usd.format(input.amountPerRun)}` : "",
    `Pay periods in 2026: ${y2026.totalPeriods}`,
    `Pay periods in 2027: ${y2027.totalPeriods}`,
    `Three-paycheck months (2026): ${threePaycheckLabel}`,
    period27Note ?? "",
    "",
    "See the HTML version of this email for the full month-by-month calendar.",
  ]
    .filter(Boolean)
    .join("\n");

  const shell = {
    preheader: `2026: ${y2026.totalPeriods} pay periods. Three-paycheck months: ${threePaycheckLabel}.`,
    title: "Your detailed payroll calendar breakdown",
    bodyHtml,
    bodyText,
    from,
  };

  return {
    subject: "Your detailed payroll calendar breakdown from Zensus",
    text: toolEmailText(shell),
    html: toolEmailHtml(shell),
  };
}
