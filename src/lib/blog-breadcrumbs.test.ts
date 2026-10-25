// Blog post breadcrumbs.
//
// The post page showed "Blog / {topic}" while its BreadcrumbList said
// Home > Blog > {full title}: different steps, and the topic step pointed at
// /blog?topic=, a filter that canonicalizes to /blog. Both now come from
// postBreadcrumbs(). This keeps the trail to canonical, prerendered pages and
// keeps the page using the one list for both.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { getAllPosts, postBreadcrumbs, postUrl } from "./blog";
import { SITE_URL } from "./constants";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));
const posts = getAllPosts();

describe("blog post breadcrumbs", () => {
  it.each(posts.map((p) => [p.slug, p] as const))("%s: Home, Blog, then the post", (_slug, post) => {
    const trail = postBreadcrumbs(post);
    expect(trail.map((c) => c.url)).toEqual([`${SITE_URL}/`, `${SITE_URL}/blog`, postUrl(post.slug)]);
    expect(trail.map((c) => c.name).slice(0, 2)).toEqual(["Home", "Blog"]);
  });

  it.each(posts.map((p) => [p.slug, p] as const))("%s: every step is a canonical URL with a short name", (_slug, post) => {
    for (const crumb of postBreadcrumbs(post)) {
      expect(crumb.url).not.toMatch(/[?#]/);
      expect(crumb.name.length).toBeGreaterThan(0);
      expect(crumb.name.length).toBeLessThanOrEqual(60);
    }
  });

  it("renders the visible trail and the BreadcrumbList from the same list", () => {
    const page = readFileSync(join(repoRoot, "src", "pages", "BlogPost.tsx"), "utf-8");
    expect(page).toMatch(/const trail = postBreadcrumbs\(meta\)/);
    expect(page).toMatch(/breadcrumbSchema\(trail\)/);
    expect(page).toMatch(/trail\.map\(/);
    expect(page).toMatch(/aria-current="page"/);
  });
});
