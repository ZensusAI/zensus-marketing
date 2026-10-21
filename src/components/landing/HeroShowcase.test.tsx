import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import HeroShowcase from "./HeroShowcase";

describe("homepage product showcase", () => {
  it("introduces the rolling 13-week forecast after the pain section", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <HeroShowcase />
      </MemoryRouter>,
    );

    expect(markup).toContain(
      "See the next 13 weeks before they hit your bank.",
    );
    expect(markup).toContain(
      "Zensus combines your bank, QuickBooks, and HubSpot data into a weekly forecast that reflects when cash actually moves.",
    );
  });
});
