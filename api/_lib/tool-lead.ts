import type { ToolEmailRequest } from "./tool-validate.js";

const DEFAULT_FORMINIT_URL = "https://forminit.com/f/ho5iwqa3lz1";

export async function notifyToolLead(data: ToolEmailRequest): Promise<void> {
  const endpoint = process.env.TOOL_LEAD_FORMINIT_URL ?? DEFAULT_FORMINIT_URL;
  const summary =
    data.tool === "runway"
      ? `Runway calculator lead. Cash: ${data.inputs.cash}, revenue: ${data.inputs.monthlyRevenue}, expenses: ${data.inputs.monthlyExpenses}.`
      : `Payroll calendar lead. First pay: ${data.inputs.firstPayDate}, frequency: ${data.inputs.frequency}.`;

  const body = new FormData();
  body.append("fi-text-name", "Tool lead");
  body.append("fi-sender-email", data.email);
  body.append("fi-text-subject", `Tool lead: ${data.tool}`);
  body.append("fi-text-message", summary);

  try {
    await fetch(endpoint, { method: "POST", body });
  } catch {
    /* best-effort team notification */
  }
}
