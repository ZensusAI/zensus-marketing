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

const thirteenWeekBody = {
  tool: "thirteen-week",
  email: "founder@example.com",
  inputs: {
    openingBalance: 120000,
    cashFloor: 50000,
    weeklyCollections: 14000,
    payrollPerRun: 32000,
    payFrequency: "biweekly",
    nextPayrollWeek: 1,
    monthlyFixedCosts: 14000,
    weeklyOtherOutflows: 3000,
    oneOffEnabled: true,
    oneOffAmount: 45000,
    oneOffWeek: 6,
    startDate: "2026-11-02",
  },
};

describe("validateToolInput", () => {
  it("accepts 13-week template payloads", () => {
    const r = validateToolInput(thirteenWeekBody);
    expect(r.ok).toBe(true);
    if (r.ok && r.data.tool === "thirteen-week") {
      expect(r.data.inputs.payFrequency).toBe("biweekly");
      expect(r.data.inputs.startDate).toBe("2026-11-02");
    }
  });

  it("rejects 13-week payloads with a week outside the grid", () => {
    for (const bad of [
      { oneOffWeek: 14 },
      { oneOffWeek: 0 },
      { nextPayrollWeek: 5 },
      { payFrequency: "fortnightly" },
      { startDate: "2026-02-30" },
      { startDate: undefined },
      { oneOffEnabled: "yes" },
    ]) {
      const r = validateToolInput({
        ...thirteenWeekBody,
        inputs: { ...thirteenWeekBody.inputs, ...bad },
      });
      expect(r.ok).toBe(false);
    }
  });

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
  // Marketing consent is separate from the transactional breakdown the visitor
  // requested by submitting the form, so it must never gate validation. It is
  // recorded rather than required, and it defaults to false when absent so an
  // omitted field can never be read as an opt-in.
  it("defaults marketingConsent to false when absent", () => {
    const r = validateToolInput(runwayBody);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.marketingConsent).toBe(false);
  });

  it("records marketingConsent when the visitor opts in", () => {
    const r = validateToolInput({ ...runwayBody, marketingConsent: true });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.marketingConsent).toBe(true);
  });

  it("treats a non-boolean marketingConsent as no consent", () => {
    for (const value of ["true", 1, {}, null]) {
      const r = validateToolInput({ ...runwayBody, marketingConsent: value });
      expect(r.ok).toBe(true);
      if (r.ok) expect(r.data.marketingConsent).toBe(false);
    }
  });
});
