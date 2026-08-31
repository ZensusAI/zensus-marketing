import {
  formatRunwayMonthLabel,
  monthlyHireCost,
  simulateRunway,
  LOADED_COST_MULTIPLIER,
  type RunwaySimulationInput,
} from "../../src/lib/runway-calculator.js";
import { escapeHtml } from "./sanitize.js";
import { toolEmailHtml, toolEmailText } from "./tool-email-shell.js";
import type { RunwayToolInput } from "./tool-validate.js";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const dateFmt = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function parseRunwayStartDate(input: RunwayToolInput): Date {
  if (input.startDate) {
    const [y, m, d] = input.startDate.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date();
}

function toSimulationInput(input: RunwayToolInput): RunwaySimulationInput {
  const hireCost = monthlyHireCost(input.hires, input.hireSalary);
  return {
    cash: input.cash,
    monthlyRevenue: input.monthlyRevenue,
    monthlyExpenses: input.monthlyExpenses,
    monthlyHireCost: input.hires > 0 ? hireCost : 0,
    contractAmount: input.contractEnabled ? input.contractAmount : 0,
    contractMonth: input.contractEnabled ? input.contractMonth : 0,
  };
}

export function composeRunwayToolEmail(input: RunwayToolInput, from: string) {
  const startDate = parseRunwayStartDate(input);
  const active = simulateRunway(toSimulationInput(input), startDate);
  const base =
    input.hires > 0
      ? simulateRunway(
          {
            ...toSimulationInput(input),
            monthlyHireCost: 0,
          },
          startDate,
        )
      : null;

  const netMonthly =
    input.monthlyRevenue -
    input.monthlyExpenses -
    (input.hires > 0 ? monthlyHireCost(input.hires, input.hireSalary) : 0);

  const runwayLabel =
    active.runwayMonths === null
      ? "48+ months"
      : `${active.runwayMonths.toFixed(1)} months`;

  const zeroCashLabel = active.zeroCashDate
    ? dateFmt.format(active.zeroCashDate)
    : "None projected within 48 months";

  const hireNote =
    input.hires > 0 && base?.zeroCashDate && active.zeroCashDate
      ? `Hiring ${input.hires} at ${usd.format(input.hireSalary)} base (${LOADED_COST_MULTIPLIER}x fully loaded) moves your zero-cash date from ${dateFmt.format(base.zeroCashDate)} to ${dateFmt.format(active.zeroCashDate)}.`
      : null;

  const contractNote = input.contractEnabled
    ? `Annual contract of ${usd.format(input.contractAmount)} lands in month ${input.contractMonth}.`
    : null;

  const tableRows = active.rows
    .map((row) => {
      const month = escapeHtml(formatRunwayMonthLabel(startDate, row.index));
      const closingCls = row.closing < 0 ? ' style="color:#dc2626;"' : "";
      return `<tr>
        <td style="padding:8px 12px; border-bottom:1px solid #f1f3f5;">${month}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #f1f3f5; text-align:right;">${escapeHtml(usd.format(row.inflow))}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #f1f3f5; text-align:right;">${escapeHtml(usd.format(row.outflow))}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #f1f3f5; text-align:right; font-weight:600;"${closingCls}>${escapeHtml(usd.format(row.closing))}</td>
      </tr>`;
    })
    .join("");

  const bodyHtml = `
    <p style="margin:0 0 20px;">Here is the detailed breakdown from the Zensus startup runway calculator, based on the numbers you entered.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
      <tr><td style="padding:6px 0;"><strong>Net monthly burn:</strong> ${escapeHtml(netMonthly >= 0 ? `+${usd.format(netMonthly)}` : usd.format(netMonthly))}</td></tr>
      <tr><td style="padding:6px 0;"><strong>Runway:</strong> ${escapeHtml(runwayLabel)}</td></tr>
      <tr><td style="padding:6px 0;"><strong>Zero-cash date:</strong> ${escapeHtml(zeroCashLabel)}</td></tr>
    </table>
    ${hireNote ? `<p style="margin:0 0 16px;">${escapeHtml(hireNote)}</p>` : ""}
    ${contractNote ? `<p style="margin:0 0 16px;">${escapeHtml(contractNote)}</p>` : ""}
    <p style="margin:0 0 12px; font-weight:600; color:#0f172a;">Twelve-month cash projection</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:14px; border:1px solid #f1f3f5; border-radius:8px; overflow:hidden;">
      <thead>
        <tr style="background-color:#f8fafc;">
          <th align="left" style="padding:8px 12px;">Month</th>
          <th align="right" style="padding:8px 12px;">Inflows</th>
          <th align="right" style="padding:8px 12px;">Outflows</th>
          <th align="right" style="padding:8px 12px;">Closing</th>
        </tr>
      </thead>
      <tbody>${tableRows}</tbody>
    </table>
    <p style="margin:24px 0 0; font-size:14px;">Flat monthly averages hide timing. When revenue arrives in lumps or payroll spikes, a date-aware forecast like Zensus keeps your zero-cash date current as real transactions clear.</p>
  `;

  const textRows = active.rows
    .map(
      (row) =>
        `${formatRunwayMonthLabel(startDate, row.index)}: in ${usd.format(row.inflow)}, out ${usd.format(row.outflow)}, close ${usd.format(row.closing)}`,
    )
    .join("\n");

  const bodyText = [
    "Here is your detailed runway breakdown.",
    "",
    `Net monthly burn: ${netMonthly >= 0 ? `+${usd.format(netMonthly)}` : usd.format(netMonthly)}`,
    `Runway: ${runwayLabel}`,
    `Zero-cash date: ${zeroCashLabel}`,
    hireNote ?? "",
    contractNote ?? "",
    "",
    "Twelve-month projection:",
    textRows,
    "",
    "Flat monthly averages hide timing. Zensus connects your bank, QuickBooks, and HubSpot for a live forecast.",
  ]
    .filter(Boolean)
    .join("\n");

  const shell = {
    preheader: `Runway: ${runwayLabel}. Zero-cash date: ${zeroCashLabel}.`,
    title: "Your detailed runway breakdown",
    bodyHtml,
    bodyText,
    from,
  };

  return {
    subject: "Your detailed runway breakdown from Zensus",
    text: toolEmailText(shell),
    html: toolEmailHtml(shell),
  };
}
