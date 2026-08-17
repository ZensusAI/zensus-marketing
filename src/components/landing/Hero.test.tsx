import { renderToStaticMarkup } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { describe, expect, it, vi } from "vitest";
import Hero from "./Hero";

vi.mock("./SignupModal", () => ({
  SignupModal: ({ children }: { children: React.ReactNode }) => children,
}));

describe("homepage hero", () => {
  it("leads with cash visibility instead of the 13-week mechanic", () => {
    const markup = renderToStaticMarkup(
      <HelmetProvider>
        <Hero />
      </HelmetProvider>,
    );

    expect(markup).toContain("Your cash flow,");
    expect(markup).toContain("mapped as far ahead as you need.");
    expect(markup).toContain(
      "Built for businesses with unpredictable revenue.",
    );
    expect(markup).toContain(
      "Zensus gives you a live, always-current picture of your cash position, so you can make payroll, hiring, and spending decisions with confidence.",
    );
    expect(markup).not.toContain("13-week cash flow forecasting software");
    expect(markup).not.toContain("March 14");
  });
});
