import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Comparison from "./Comparison";

/** Each body row as the text a tag-stripping reader would see, cell by cell. */
function rows(): string[][] {
  const markup = renderToStaticMarkup(
    <MemoryRouter>
      <Comparison />
    </MemoryRouter>,
  );
  const body = markup.match(/<tbody[\s\S]*?<\/tbody>/)?.[0] ?? "";
  return [...body.matchAll(/<tr[\s\S]*?<\/tr>/g)].map((row) =>
    [...row[0].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/g)].map((cell) =>
      cell[1].replace(/<[^>]*>/g, "").trim(),
    ),
  );
}

describe("homepage comparison matrix", () => {
  // The marks were icons with an aria-label and no text, so the table read as
  // five rows of empty cells to anything that was not a screen reader.
  it("says every cell in words, not only as an icon", () => {
    const table = rows();

    expect(table).toHaveLength(5);
    for (const row of table) {
      expect(row).toHaveLength(5);
      for (const cell of row) expect(cell).not.toBe("");
    }
  });

  // A cross with "*" records that the vendor's public pages did not mention
  // the capability. It must not read as a flat "No", which claims more than
  // the evidence in docs/comparison-substantiation-*.md supports.
  it("words an unconfirmed cross as not found, and a confirmed one as no", () => {
    const [bankFeed] = rows();

    expect(bankFeed).toEqual([
      "Live bank feed (Plaid)",
      "No ‡",
      "Yes",
      "Not found *",
      "Yes",
    ]);
  });

  it("keeps the note beside a tick readable", () => {
    const crm = rows()[2];

    expect(crm[4]).toBe("Yes: HubSpot");
  });
});
