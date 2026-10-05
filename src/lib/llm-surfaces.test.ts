// Guide coverage on the pages written for AI engines.
//
// A new post reaches the sitemap, the prerender and the blog index on its own,
// because those are generated from src/content/blog. The three surfaces below
// are written by hand, and each fell behind without anything noticing:
// /llm-info listed 9 of 13 guides and llms-full.txt 11 of 13. They are the
// pages an AI engine is most likely to read for a summary of the site, so a
// guide missing from them is a guide those engines are less likely to cite.

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));
const read = (...parts: string[]) => readFileSync(join(repoRoot, ...parts), "utf-8");

const slugs = readdirSync(join(repoRoot, "src", "content", "blog"))
  .filter((f) => f.endsWith(".mdx"))
  .map((f) => f.replace(/\.mdx$/, ""));

const SURFACES: [name: string, source: string][] = [
  ["public/llms.txt", read("public", "llms.txt")],
  ["public/llms-full.txt", read("public", "llms-full.txt")],
  ["src/pages/LlmInfo.tsx", read("src", "pages", "LlmInfo.tsx")],
];

describe("pages written for AI engines", () => {
  it("finds the guides it is meant to check", () => {
    expect(slugs.length).toBeGreaterThan(10);
  });

  it.each(SURFACES)("%s lists every guide", (_name, source) => {
    // The slug must end there: a quote, a newline, a bracket. Otherwise a
    // longer slug that starts the same way would satisfy the check.
    const missing = slugs.filter(
      (slug) => !new RegExp(`/blog/${slug}(?![a-z0-9-])`).test(source),
    );

    expect(missing).toEqual([]);
  });
});
