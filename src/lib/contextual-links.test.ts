// Contextual link floor.
//
// In-content links are how search engines read which page answers which
// topic; the navbar and footer link every page equally and say nothing about
// it. A Frase audit and a link census in October 2026 found the comparison
// pages and the changelog linking nowhere in their body, the QuickBooks Online
// page linked from four pages while it drew QuickBooks forecasting searches,
// and several guides linking only two other guides. This test keeps a floor
// under each of those so an edit that drops links fails instead of passing
// silently. internal-links.test.ts already checks that every target exists.

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { CASH_FLOW_FROG_COMPARE, FLOAT_COMPARE, PULSE_COMPARE } from "./compare-pages";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));
const read = (...parts: string[]) => readFileSync(join(repoRoot, ...parts), "utf-8");
const blogDir = join(repoRoot, "src", "content", "blog");

const slugs = readdirSync(blogDir)
  .filter((f) => f.endsWith(".mdx"))
  .map((f) => f.replace(/\.mdx$/, ""));

/** A post's body: everything after its `export const meta = {...};` block. */
const body = (slug: string) => {
  const source = read("src", "content", "blog", `${slug}.mdx`);
  return source.slice(source.indexOf("};") + 2);
};

const linksTo = (text: string, prefix: string) =>
  new Set([...text.matchAll(/href="(\/[a-z0-9/-]*)"/g)].map((m) => m[1]).filter((u) => u.startsWith(prefix)));

/** Every in-content source: post bodies, page components and homepage sections, not the shared chrome. */
function contentSources(): string[] {
  const pages = (dir: string[]): string[] =>
    readdirSync(join(repoRoot, ...dir), { withFileTypes: true }).flatMap((d) =>
      d.isDirectory() ? pages([...dir, d.name]) : d.name.endsWith(".tsx") ? [read(...dir, d.name)] : [],
    );
  const landing = readdirSync(join(repoRoot, "src", "components", "landing"))
    .filter((f) => f.endsWith(".tsx") && !/^(Navbar|Footer)\.tsx$/.test(f) && !f.endsWith(".test.tsx"))
    .map((f) => read("src", "components", "landing", f));
  return [...slugs.map(body), ...pages(["src", "pages"]), ...landing, read("src", "lib", "compare-pages.ts")];
}

const MIN_GUIDE_LINKS = 4;

describe("contextual links", () => {
  it.each(slugs)("%s links to at least four other guides in its body", (slug) => {
    const others = [...linksTo(body(slug), "/blog/")].filter((u) => u !== `/blog/${slug}`);
    expect(others.length).toBeGreaterThanOrEqual(MIN_GUIDE_LINKS);
  });

  it.each([FLOAT_COMPARE, PULSE_COMPARE, CASH_FLOW_FROG_COMPARE])(
    "the $slug comparison links to at least three Zensus pages beyond pricing",
    (config) => {
      expect(config.related.filter((r) => r.to !== "/pricing").length).toBeGreaterThanOrEqual(3);
    },
  );

  it("links most changelog entries to the page that explains the feature", () => {
    const source = read("src", "pages", "Changelog.tsx");
    const entries = source.match(/^ {4}title: "/gm)?.length ?? 0;
    const linked = source.match(/^ {4}learnMore: \{ to: "/gm)?.length ?? 0;
    expect(entries).toBeGreaterThan(10);
    expect(linked / entries).toBeGreaterThanOrEqual(0.6);
  });

  it.each(["/quickbooks-cash-flow-forecasting", "/blog/can-quickbooks-forecast-cash-flow"])(
    "%s is linked from at least six in-content sources",
    (target) => {
      const pattern = new RegExp(`(?:href|to)(?:=|: )\\{?"${target}"`);
      const count = contentSources().filter((source) => pattern.test(source)).length;
      expect(count).toBeGreaterThanOrEqual(6);
    },
  );
});
