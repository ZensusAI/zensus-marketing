import { describe, it, expect } from "vitest";
import { validateToolInput } from "./tool-validate";

const runwayBody = {
  tool: "runway",
  email: "founder@example.com",
  inputs: {
    cash: 250000,
    monthlyRevenue: 30000,
    monthlyExpenses: 55000,
    hires: 1,
    hireSalary: 120000,
    contractEnabled: false,
    contractAmount: 24000,
    contractMonth: 3,
  },
  turnstileToken: "tok",
};

const payrollBody = {
  tool: "payroll",
  email: "founder@example.com",
  inputs: {
    firstPayDate: "2026-01-02",
    frequency: "biweekly",
    amountPerRun: 21000,
  },
};

describe("validateToolInput", () => {
  it("accepts runway payloads", () => {
    const r = validateToolInput(runwayBody);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.tool).toBe("runway");
  });

  it("accepts payroll payloads", () => {
    const r = validateToolInput(payrollBody);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.tool).toBe("payroll");
  });

  it("rejects invalid email", () => {
    const r = validateToolInput({ ...runwayBody, email: "not-an-email" });
    expect(r.ok).toBe(false);
  });

  it("rejects honeypot fills", () => {
    const r = validateToolInput({ ...runwayBody, _gotcha: "spam" });
    expect(r.ok).toBe(false);
  });

  it("rejects invalid payroll dates", () => {
    const r = validateToolInput({
      ...payrollBody,
      inputs: { ...payrollBody.inputs, firstPayDate: "2026-13-40" },
    });
    expect(r.ok).toBe(false);
  });

  it("accepts optional runway startDate", () => {
    const r = validateToolInput({
      ...runwayBody,
      inputs: { ...runwayBody.inputs, startDate: "2026-08-31" },
    });
    expect(r.ok).toBe(true);
    if (r.ok && r.data.tool === "runway") {
      expect(r.data.inputs.startDate).toBe("2026-08-31");
    }
  });

  it("rejects invalid runway startDate", () => {
    const r = validateToolInput({
      ...runwayBody,
      inputs: { ...runwayBody.inputs, startDate: "2026-02-30" },
    });
    expect(r.ok).toBe(false);
  });
});
