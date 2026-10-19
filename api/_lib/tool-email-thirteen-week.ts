import {
  buildThirteenWeekForecast,
  parseLocalIsoDate,
  PAY_FREQUENCY_LABELS,
  type ThirteenWeekResult,
} from "../../src/lib/thirteen-week.js";
import { escapeHtml } from "./sanitize.js";
import { SITE_URL } from "./site.js";
import { toolEmailHtml, toolEmailText } from "./tool-email-shell.js";
import type { ThirteenWeekToolInput } from "./tool-validate.js";

const TEMPLATE_URL = `${SITE_URL}/templates/13-week-cash-flow-template.xlsx`;
const TOOL_URL = `${SITE_URL}/tools/13-week-cash-flow-template`;

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const weekOf = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

function weekLabel(result: ThirteenWeekResult, week: number): string {
  return `week ${week} (${weekOf.format(result.rows[week - 1].weekStart)})`;
}

export function composeThirteenWeekToolEmail(input: ThirteenWeekToolInput, from: string) {
  // The validator has already checked the date, so this only guards the type.
  const startDate = parseLocalIsoDate(input.startDate) ?? new Date();
  const result = buildThirteenWeekForecast(input, startDate);

  const lowestLine = `Lowest balance: ${usd.format(result.lowestBalance)} in ${weekLabel(result, result.lowestWeek)}.`;
  const floorLine =
    result.firstWeekBelowFloor === null
      ? `Every week closes above your ${usd.format(input.cashFloor)} floor.`
      : `First week under your ${usd.format(input.cashFloor)} floor: ${weekLabel(result, result.firstWeekBelowFloor)}.`;
  const closingLine = `Closing balance after 13 weeks: ${usd.format(result.closingBalance)}.`;
  const totalsLine = `Cash in ${usd.format(result.totalIn)}, cash out ${usd.format(result.totalOut)}, with ${result.payrollRuns} payroll ${result.payrollRuns === 1 ? "run" : "runs"} (${PAY_FREQUENCY_LABELS[input.payFrequency].toLowerCase()}).`;

  const tableRows = result.rows
    .map((row) => {
      const closingStyle = row.belowFloor ? ' style="color:#dc2626;"' : "";
      return `<tr>
        <td style="padding:8px 12px; border-bottom:1px solid #f1f3f5;">${row.week}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #f1f3f5;">${escapeHtml(weekOf.format(row.weekStart))}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #f1f3f5; text-align:right;">${escapeHtml(usd.format(row.totalIn))}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #f1f3f5; text-align:right;">${escapeHtml(usd.format(row.totalOut))}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #f1f3f5; text-align:right; font-weight:600;"${closingStyle}>${escapeHtml(usd.format(row.closing))}</td>
      </tr>`;
    })
    .join("");

  const bodyHtml = `
    <p style="margin:0 0 20px;">Here is the 13-week cash flow forecast you built on the Zensus template page, from the numbers you entered.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
      <tr><td style="padding:6px 0;">${escapeHtml(lowestLine)}</td></tr>
      <tr><td style="padding:6px 0;">${escapeHtml(floorLine)}</td></tr>
      <tr><td style="padding:6px 0;">${escapeHtml(closingLine)}</td></tr>
      <tr><td style="padding:6px 0;">${escapeHtml(totalsLine)}</td></tr>
    </table>
    <p style="margin:0 0 12px; font-weight:600; color:#0f172a;">Week by week</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:14px; border:1px solid #f1f3f5; border-radius:8px; overflow:hidden;">
      <thead>
        <tr style="background-color:#f8fafc;">
          <th align="left" style="padding:8px 12px;">Week</th>
          <th align="left" style="padding:8px 12px;">Beginning</th>
          <th align="right" style="padding:8px 12px;">Cash in</th>
          <th align="right" style="padding:8px 12px;">Cash out</th>
          <th align="right" style="padding:8px 12px;">Closing</th>
        </tr>
      </thead>
      <tbody>${tableRows}</tbody>
    </table>
    <p style="margin:24px 0 0; font-size:14px;">The blank template with the formulas in place is at <a href="${TEMPLATE_URL}" style="color:#22C573; font-weight:600;">${escapeHtml(TEMPLATE_URL)}</a>. Paste these weeks into it, then replace the flat weekly figures with real invoice due dates and pay dates. You can rebuild the forecast any time at <a href="${TOOL_URL}" style="color:#22C573;">${escapeHtml(TOOL_URL)}</a>.</p>
    <p style="margin:16px 0 0; font-size:14px;">When the Monday update starts to cost more than it tells you, Zensus keeps the same 13 weeks current from your bank, QuickBooks and HubSpot, and flags the week your balance drops below the floor.</p>
  `;

  const textRows = result.rows
    .map(
      (row) =>
        `Week ${row.week} (${weekOf.format(row.weekStart)}): in ${usd.format(row.totalIn)}, out ${usd.format(row.totalOut)}, close ${usd.format(row.closing)}${row.belowFloor ? " (below floor)" : ""}`,
    )
    .join("\n");

  const bodyText = [
    "Here is the 13-week cash flow forecast you built on the Zensus template page.",
    "",
    lowestLine,
    floorLine,
    closingLine,
    totalsLine,
    "",
    "Week by week:",
    textRows,
    "",
    `Blank template with formulas: ${TEMPLATE_URL}`,
    `Rebuild the forecast: ${TOOL_URL}`,
    "",
    "When the Monday update starts to cost more than it tells you, Zensus keeps the same 13 weeks current from your bank, QuickBooks and HubSpot.",
  ].join("\n");

  const shell = {
    preheader: `${lowestLine} ${floorLine}`,
    title: "Your 13-week cash flow forecast",
    bodyHtml,
    bodyText,
    from,
  };

  return {
    subject: "Your 13-week cash flow forecast from Zensus",
    text: toolEmailText(shell),
    html: toolEmailHtml(shell),
  };
}
