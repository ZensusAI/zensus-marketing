import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HeroShowcase from "./HeroShowcase";

describe("homepage product showcase", () => {
  it("introduces the rolling 13-week forecast after the pain section", () => {
    const markup = renderToStaticMarkup(<HeroShowcase />);

    expect(markup).toContain(
      "See the next 13 weeks before they hit your bank.",
    );
    expect(markup).toContain(
      "Zensus combines your bank, QuickBooks, and HubSpot data into a weekly forecast that reflects when cash actually moves.",
    );
  });
});
