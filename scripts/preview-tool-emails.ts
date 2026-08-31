import { writeFileSync } from "node:fs";
import { composeRunwayToolEmail } from "../api/_lib/tool-email-runway.ts";
import { composePayrollToolEmail } from "../api/_lib/tool-email-payroll.ts";

const runway = composeRunwayToolEmail(
  {
    cash: 250000,
    monthlyRevenue: 30000,
    monthlyExpenses: 55000,
    hires: 0,
    hireSalary: 120000,
    contractEnabled: false,
    contractAmount: 24000,
    contractMonth: 3,
  },
  "hello@zensus.app",
);

const payroll = composePayrollToolEmail(
  {
    firstPayDate: "2026-01-02",
    frequency: "biweekly",
    amountPerRun: 21000,
  },
  "hello@zensus.app",
);

writeFileSync(
  "docs/temp-tool-email-previews.json",
  JSON.stringify({ runway, payroll }, null, 2),
);

console.log("wrote docs/temp-tool-email-previews.json");
