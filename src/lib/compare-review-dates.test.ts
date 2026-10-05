// Review date invariant for the comparison pages.
//
// Each comparison page shows a caption saying when the vendor's pages were
// read, and emits the same date as lastReviewed in its WebPage markup. They
// come from two fields, and a page verified on its own date has to override
// both. The Cash Flow Frog page shipped with the caption saying 5 October 2026
// and the markup saying 21 September, because only the caption had an
// override. This holds the two together.

import { describe, expect, it } from "vitest";

import { COMPARE_PAGES, METHODOLOGY_REVIEWED } from "./compare-pages";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "2026-10-05" -> "5 October 2026", the form the captions use. */
function longDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

describe("comparison page review dates", () => {
  it("finds the comparison pages it is meant to check", () => {
    expect(Object.keys(COMPARE_PAGES).length).toBeGreaterThanOrEqual(3);
    expect(METHODOLOGY_REVIEWED).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it.each(Object.entries(COMPARE_PAGES))(
    "%s overrides the caption and the markup date together",
    (_slug, config) => {
      expect(Boolean(config.methodology)).toBe(Boolean(config.reviewed));
      if (config.methodology && config.reviewed) {
        expect(config.reviewed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(config.methodology).toContain(longDate(config.reviewed));
      }
    },
  );
});
