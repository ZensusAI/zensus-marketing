// Blog topic invariant.
//
// The blog index groups posts into the five BLOG_TOPICS, one per post, set in
// each post's MDX meta. MDX is not typechecked, so a post with no topic or a
// misspelled one would silently drop out of every topic section and the
// Explore topics counts. Each topic also has its own page, whose title and
// description go into search results, and the build scripts read a copy of
// the list from scripts/blog-topics.mjs.

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { BLOG_TOPICS } from "./blog";
import { BLOG_TOPICS as SCRIPT_TOPICS } from "../../scripts/blog-topics.mjs";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));
const blogDir = join(repoRoot, "src", "content", "blog");
const ids = new Set<string>(BLOG_TOPICS.map((t) => t.id));

const posts = readdirSync(blogDir)
  .filter((f) => f.endsWith(".mdx"))
  .map((f) => ({ file: f, topics: [...readFileSync(join(blogDir, f), "utf-8").matchAll(/^\s*topic: '([^']*)',$/gm)].map((m) => m[1]) }));

describe("blog topics", () => {
  it("finds the posts", () => {
    expect(posts.length).toBeGreaterThan(10);
  });

  it("gives every post exactly one known topic", () => {
    const bad = posts.filter((p) => p.topics.length !== 1 || !ids.has(p.topics[0])).map((p) => p.file);
    expect(bad).toEqual([]);
  });

  it("leaves no topic empty", () => {
    const used = new Set(posts.flatMap((p) => p.topics));
    expect(BLOG_TOPICS.filter((t) => !used.has(t.id)).map((t) => t.id)).toEqual([]);
  });

  it("keeps the build scripts' topic list equal to BLOG_TOPICS", () => {
    const pick = (t: { id: string; name: string; metaDescription: string }) => ({ id: t.id, name: t.name, metaDescription: t.metaDescription });
    expect((SCRIPT_TOPICS as (typeof BLOG_TOPICS)[number][]).map(pick)).toEqual(BLOG_TOPICS.map(pick));
  });

  // Google cuts titles near 60 characters and descriptions near 160, and asks
  // for both to be unique to the page (SEO Starter Guide).
  it.each(BLOG_TOPICS.map((t) => [t.id, t] as const))("%s: a unique title, description and intro that fit search results", (_id, t) => {
    expect(t.seoTitle.length).toBeLessThanOrEqual(60);
    expect(t.seoTitle.endsWith(" | Zensus")).toBe(true);
    expect(t.metaDescription.length).toBeGreaterThanOrEqual(110);
    expect(t.metaDescription.length).toBeLessThanOrEqual(160);
    expect(t.intro.split(/\s+/).length).toBeGreaterThanOrEqual(40);
    expect(`${t.seoTitle} ${t.metaDescription} ${t.intro}`).not.toMatch(/\u2014/);
    expect(BLOG_TOPICS.filter((o) => o.seoTitle === t.seoTitle || o.metaDescription === t.metaDescription)).toHaveLength(1);
  });
});
