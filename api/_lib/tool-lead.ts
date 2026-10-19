import type { ToolEmailRequest } from "./tool-validate.js";

const DEFAULT_FORMINIT_URL = "https://forminit.com/f/ho5iwqa3lz1";

function leadSummary(data: ToolEmailRequest): string {
  if (data.tool === "runway") {
    return `Runway calculator lead. Cash: ${data.inputs.cash}, revenue: ${data.inputs.monthlyRevenue}, expenses: ${data.inputs.monthlyExpenses}.`;
  }
  if (data.tool === "thirteen-week") {
    return `13-week template lead. Opening: ${data.inputs.openingBalance}, floor: ${data.inputs.cashFloor}, weekly collections: ${data.inputs.weeklyCollections}, payroll per run: ${data.inputs.payrollPerRun} (${data.inputs.payFrequency}).`;
  }
  return `Payroll calendar lead. First pay: ${data.inputs.firstPayDate}, frequency: ${data.inputs.frequency}.`;
}

export async function notifyToolLead(data: ToolEmailRequest): Promise<void> {
  const endpoint = process.env.TOOL_LEAD_FORMINIT_URL ?? DEFAULT_FORMINIT_URL;
  const summary = leadSummary(data);

  const body = new FormData();
  body.append("fi-text-name", "Tool lead");
  body.append("fi-sender-email", data.email);
  body.append("fi-text-subject", `Tool lead: ${data.tool}`);
  body.append(
    "fi-text-message",
    `${summary} Marketing opt-in: ${data.marketingConsent ? "yes" : "no"}.`,
  );

  try {
    await fetch(endpoint, { method: "POST", body });
  } catch {
    /* best-effort team notification */
  }
}
