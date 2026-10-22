import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Footer from "./Footer";
import { SITE_URL } from "@/lib/constants";

const render = () =>
  renderToStaticMarkup(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>,
  );

describe("footer address", () => {
  // Each visual line break carries a hidden comma, so text read without
  // layout (tag-stripping extractors, AI crawlers) stays one clean address
  // per office rather than "Rd" running into "Ste".
  it("reads as two complete addresses when tags are stripped", () => {
    const address = render().match(/<address[\s\S]*?<\/address>/)?.[0] ?? "";
    const text = address
      .replace(/<[^>]*>/g, "")
      .replace(/&#x27;/g, "'")
      .replace(/\s+/g, " ")
      .trim();
    expect(text).toBe(
      "Zensus Inc. Delaware: 254 Chapman Rd, Ste 208 #23940, Newark, DE 19702, United States. " +
        "Texas: 17350 State Hwy 249, Ste 220 #32525, Houston, TX 77064, United States.",
    );
  });

  // The microdata must name the same Organization @id as the JSON-LD in
  // index.html, or engines read a second, unnamed organization.
  it("ties the addresses to the sitewide Organization", () => {
    // HTML attribute names are case-insensitive; React writes "itemID" and
    // "itemProp", so compare in lower case.
    const html = render().toLowerCase();
    expect(html).toContain(`itemid="${SITE_URL}/#organization"`);
    expect(html.match(/itemprop="address"/g)).toHaveLength(2);
    expect(html).toContain('<span itemprop="streetaddress">');
  });
});
