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
      "Cash flow forecasting for businesses with unpredictable revenue.",
    );
    expect(markup).toContain(
      "Zensus is cash flow forecasting software that connects your bank, QuickBooks, and HubSpot to project the exact date your cash runs out.",
    );
    expect(markup).not.toContain("13-week cash flow forecasting software");
    expect(markup).not.toContain("March 14");
  });

  // The halo effect used to paint the H1 twice (a visible span plus an
  // aria-hidden opacity-0 clone), so tag-stripping extractors read the
  // headline as "Your cash flow,Your cash flow,mapped as far ahead as you
  // need.mapped as far ahead as you need." The gradient layer is now a CSS
  // pseudo-element, whose content is not DOM text. Guard the regression.
  it("renders each H1 line exactly once in the DOM text", () => {
    const markup = renderToStaticMarkup(
      <HelmetProvider>
        <Hero />
      </HelmetProvider>,
    );

    const h1 = markup.match(/<h1[\s\S]*?<\/h1>/)?.[0] ?? "";
    const text = h1.replace(/<[^>]*>/g, "");

    expect(text).toBe("Your cash flow,mapped as far ahead as you need.");
    expect(text.match(/Your cash flow,/g)).toHaveLength(1);
    expect(text.match(/mapped as far ahead as you need\./g)).toHaveLength(1);
  });
});
