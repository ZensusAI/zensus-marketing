// Search snippet invariant.
//
// Google cuts a title at roughly 60 characters and a description at roughly
// 155 to 160. A cut-off snippet is silent: the page still renders, the build
// passes, and the only symptom is a lower click-through rate nobody traces back
// to a string. In September 2026 four of thirteen posts and four static pages
// had descriptions running to 165 to 190 characters, so this recurs whenever a
// page or post is added. The limits below are the ones results pages enforce,
// not style preferences.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TITLE_MAX = 60;
const DESCRIPTION_MAX = 160;
const BRAND_SUFFIX = " | Zensus";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));
const rel = (file: string) => relative(repoRoot, file).split(sep).join("/");

function walk(dir: string, match: RegExp, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, match, out);
    else if (match.test(name) && !/\.test\.tsx?$/.test(name)) out.push(full);
  }
  return out;
}

// A quoted string literal, single or double, allowing escaped quotes.
const STR = `(?:"((?:[^"\\\\]|\\\\.)*)"|'((?:[^'\\\\]|\\\\.)*)')`;
const unescape = (s: string) => s.replace(/\\(['"])/g, "$1");

interface Snippet {
  where: string;
  value: string;
}

function collect(files: string[], patterns: RegExp[], suffix = ""): Snippet[] {
  const found: Snippet[] = [];
  for (const file of files) {
    const source = readFileSync(file, "utf-8");
    for (const pattern of patterns) {
      for (const m of source.matchAll(pattern)) {
        const value = unescape(m[1] ?? m[2] ?? "");
        if (value) found.push({ where: rel(file), value: value + suffix });
      }
    }
  }
  return found;
}

const posts = walk(join(repoRoot, "src", "content", "blog"), /\.mdx$/);
const pages = [
  ...walk(join(repoRoot, "src", "pages"), /\.tsx$/),
  join(repoRoot, "src", "lib", "compare-pages.ts"),
];

const descriptions: Snippet[] = [
  // Post meta: `description: "..."`, often wrapped onto the next line.
  ...collect(posts, [new RegExp(`^\\s{2}description:\\s*${STR}`, "gm")]),
  ...collect(pages, [
    new RegExp(`name="description"\\s+content=${STR}`, "g"),
    new RegExp(`(?:PAGE_DESCRIPTION|metaDescription)\\s*[=:]\\s*${STR}`, "g"),
  ]),
];

const titles: Snippet[] = [
  ...collect(posts, [new RegExp(`^\\s{2}seoTitle:\\s*${STR}`, "gm")]),
  ...collect(pages, [
    /<title>([^<{]+)<\/title>/g,
    new RegExp(`metaTitle\\s*[=:]\\s*${STR}`, "g"),
  ]),
  // The tool pages render `{PAGE_TITLE} | Zensus`.
  ...collect(pages, [new RegExp(`const PAGE_TITLE\\s*=\\s*${STR}`, "g")], BRAND_SUFFIX),
];

describe("search snippets", () => {
  it("finds the titles and descriptions, so a broken scan cannot pass", () => {
    expect(posts.length).toBeGreaterThanOrEqual(13);
    // One description per post, plus the static pages.
    expect(descriptions.length).toBeGreaterThanOrEqual(posts.length + 10);
    expect(titles.length).toBeGreaterThanOrEqual(posts.length + 10);
  });

  it(`keeps every meta description within ${DESCRIPTION_MAX} characters`, () => {
    const long = descriptions
      .filter((d) => d.value.length > DESCRIPTION_MAX)
      .map((d) => `${d.where} (${d.value.length}): ${d.value}`);
    expect(long).toEqual([]);
  });

  it(`keeps every title within ${TITLE_MAX} characters`, () => {
    const long = titles
      .filter((t) => t.value.length > TITLE_MAX)
      .map((t) => `${t.where} (${t.value.length}): ${t.value}`);
    expect(long).toEqual([]);
  });
});
