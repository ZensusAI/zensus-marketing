export type ToolId = "runway" | "payroll";

export type PayFrequency = "weekly" | "biweekly" | "semimonthly" | "monthly";

export interface RunwayToolInput {
  cash: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  hires: number;
  hireSalary: number;
  contractEnabled: boolean;
  contractAmount: number;
  contractMonth: number;
  /** Client-local calendar date (YYYY-MM-DD) anchoring month labels in emails. */
  startDate?: string;
}

export interface PayrollToolInput {
  firstPayDate: string;
  frequency: PayFrequency;
  amountPerRun: number;
}

export interface ToolEmailRequest {
  tool: ToolId;
  email: string;
  inputs: RunwayToolInput | PayrollToolInput;
}

export type ValidateToolResult =
  | { ok: true; data: ToolEmailRequest }
  | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const PAY_FREQUENCIES = new Set<PayFrequency>([
  "weekly",
  "biweekly",
  "semimonthly",
  "monthly",
]);

const LIMITS = {
  email: 254,
  cash: 1_000_000_000,
  monthly: 1_000_000_000,
  hires: 100,
  salary: 10_000_000,
  contractAmount: 1_000_000_000,
  contractMonth: 12,
  amountPerRun: 1_000_000_000,
} as const;

function num(v: unknown, max: number): number | null {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0 || v > max) return null;
  return v;
}

function parseRunwayInputs(raw: unknown): RunwayToolInput | null {
  if (typeof raw !== "object" || raw === null) return null;
  const b = raw as Record<string, unknown>;
  const cash = num(b.cash, LIMITS.cash);
  const monthlyRevenue = num(b.monthlyRevenue, LIMITS.monthly);
  const monthlyExpenses = num(b.monthlyExpenses, LIMITS.monthly);
  const hires = num(b.hires, LIMITS.hires);
  const hireSalary = num(b.hireSalary, LIMITS.salary);
  const contractAmount = num(b.contractAmount, LIMITS.contractAmount);
  const contractMonth = num(b.contractMonth, LIMITS.contractMonth);
  if (
    cash === null ||
    monthlyRevenue === null ||
    monthlyExpenses === null ||
    hires === null ||
    hireSalary === null ||
    contractAmount === null ||
    contractMonth === null
  ) {
    return null;
  }
  if (typeof b.contractEnabled !== "boolean") return null;
  if (contractMonth < 1 || contractMonth > 12) return null;

  let startDate: string | undefined;
  if (b.startDate !== undefined) {
    if (typeof b.startDate !== "string" || !DATE_RE.test(b.startDate)) return null;
    const [sy, sm, sd] = b.startDate.split("-").map(Number);
    const startParsed = new Date(sy, sm - 1, sd);
    if (
      startParsed.getFullYear() !== sy ||
      startParsed.getMonth() !== sm - 1 ||
      startParsed.getDate() !== sd
    ) {
      return null;
    }
    startDate = b.startDate;
  }

  return {
    cash,
    monthlyRevenue,
    monthlyExpenses,
    hires: Math.floor(hires),
    hireSalary,
    contractEnabled: b.contractEnabled,
    contractAmount,
    contractMonth: Math.floor(contractMonth),
    startDate,
  };
}

function parsePayrollInputs(raw: unknown): PayrollToolInput | null {
  if (typeof raw !== "object" || raw === null) return null;
  const b = raw as Record<string, unknown>;
  if (typeof b.firstPayDate !== "string" || !DATE_RE.test(b.firstPayDate)) return null;
  if (typeof b.frequency !== "string" || !PAY_FREQUENCIES.has(b.frequency as PayFrequency)) {
    return null;
  }
  const amountPerRun = num(b.amountPerRun, LIMITS.amountPerRun);
  if (amountPerRun === null) return null;
  const [y, m, d] = b.firstPayDate.split("-").map(Number);
  const parsed = new Date(y, m - 1, d);
  if (
    parsed.getFullYear() !== y ||
    parsed.getMonth() !== m - 1 ||
    parsed.getDate() !== d
  ) {
    return null;
  }
  return {
    firstPayDate: b.firstPayDate,
    frequency: b.frequency as PayFrequency,
    amountPerRun,
  };
}

export function validateToolInput(body: unknown): ValidateToolResult {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "invalid_body" };
  }
  const b = body as Record<string, unknown>;

  if (typeof b._gotcha === "string" && b._gotcha.trim() !== "") {
    return { ok: false, error: "honeypot" };
  }

  if (b.tool !== "runway" && b.tool !== "payroll") {
    return { ok: false, error: "invalid_tool" };
  }

  if (typeof b.email !== "string") return { ok: false, error: "missing_email" };
  const email = b.email.trim().toLowerCase();
  if (email === "" || email.length > LIMITS.email) return { ok: false, error: "empty_email" };
  if (!EMAIL_RE.test(email)) return { ok: false, error: "bad_email" };

  const inputs =
    b.tool === "runway" ? parseRunwayInputs(b.inputs) : parsePayrollInputs(b.inputs);
  if (!inputs) return { ok: false, error: "invalid_inputs" };

  return { ok: true, data: { tool: b.tool, email, inputs } };
}
