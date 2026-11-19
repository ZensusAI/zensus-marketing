// The /sitemap page must list exactly the URLs in public/sitemap.xml, and its
// headline count must equal that list and the sum of its section counts. It
// once said "44 pages" while its sections added up to 48 and sitemap.xml held
// more than either.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { getAllPostSlugs } from "@/lib/blog";
import { SITE_URL } from "@/lib/constants";
import Sitemap from "./Sitemap";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));
const xml = readFileSync(join(repoRoot, "public", "sitemap.xml"), "utf-8");
const sitemapPaths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1].replace(SITE_URL, ""))
  .map((p) => (p === "" ? "/" : p));

const markup = renderToStaticMarkup(
  <HelmetProvider>
    <MemoryRouter initialEntries={["/sitemap"]}>
      <Sitemap />
    </MemoryRouter>
  </HelmetProvider>,
);
const main = markup.slice(markup.indexOf("<main"), markup.indexOf("</main>"));
const rows = [...main.matchAll(/<li><a[^>]*href="(\/[^"]*)"/g)].map((m) => m[1]);

describe("/sitemap page", () => {
  it("lists every URL in sitemap.xml exactly once, and nothing else", () => {
    expect(new Set(rows).size).toBe(rows.length);
    expect([...rows].sort()).toEqual([...sitemapPaths].sort());
  });

  it("lists every blog post on disk, newest included", () => {
    for (const slug of getAllPostSlugs()) expect(rows).toContain(`/blog/${slug}`);
  });

  it("states a page count equal to its rows and to the sum of its sections", () => {
    const headline = Number(main.match(/(\d+) pages, from/)?.[1]);
    const sections = [...main.matchAll(/>(\d+) pages?<\/p>/g)].map((m) => Number(m[1]));
    expect(sections.length).toBeGreaterThan(0);
    expect(headline).toBe(rows.length);
    expect(sections.reduce((a, b) => a + b, 0)).toBe(rows.length);
  });

  it("files no route under the fallback section", () => {
    expect(main).not.toContain('id="other-heading"');
  });
});
