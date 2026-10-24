// Blog topic invariant.
//
// The blog index groups posts into the five BLOG_TOPICS, one per post, set in
// each post's MDX meta. MDX is not typechecked, so a post with no topic or a
// misspelled one would silently drop out of every topic section and the
// Explore topics counts.

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { BLOG_TOPICS } from "./blog";

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
});
