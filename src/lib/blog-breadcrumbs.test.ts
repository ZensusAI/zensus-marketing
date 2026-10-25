// Blog breadcrumbs.
//
// The post page once showed "Blog / {topic}" while its BreadcrumbList said
// Home > Blog > {full title}: different steps, and the topic step pointed at
// /blog?topic=, a filter of /blog. Topics now have their own pages, and posts
// and topic pages build both the visible trail and the markup from one list
// (postBreadcrumbs, topicBreadcrumbs). This keeps every step a canonical,
// prerendered page and keeps the pages using the one list for both.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { BLOG_TOPICS, getAllPosts, postBreadcrumbs, postUrl, topicBreadcrumbs, topicUrl } from "./blog";
import { SITE_URL } from "./constants";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));
const posts = getAllPosts();

describe("blog post breadcrumbs", () => {
  it.each(posts.map((p) => [p.slug, p] as const))("%s: Home, Blog, its topic, then the post", (_slug, post) => {
    const trail = postBreadcrumbs(post);
    expect(trail.map((c) => c.url)).toEqual([`${SITE_URL}/`, `${SITE_URL}/blog`, topicUrl(post.topic), postUrl(post.slug)]);
    expect(trail.map((c) => c.name).slice(0, 2)).toEqual(["Home", "Blog"]);
  });

  it.each(BLOG_TOPICS.map((t) => [t.id, t] as const))("topic %s: Home, Blog, then the topic", (_id, topic) => {
    expect(topicBreadcrumbs(topic)).toEqual([
      { name: "Home", url: `${SITE_URL}/` },
      { name: "Blog", url: `${SITE_URL}/blog` },
      { name: topic.name, url: topicUrl(topic.id) },
    ]);
  });

  it.each(posts.map((p) => [p.slug, p] as const))("%s: every step is a canonical URL with a short name", (_slug, post) => {
    for (const crumb of postBreadcrumbs(post)) {
      expect(crumb.url).not.toMatch(/[?#]/);
      expect(crumb.name.length).toBeGreaterThan(0);
      expect(crumb.name.length).toBeLessThanOrEqual(60);
    }
  });

  it.each([
    ["BlogPost.tsx", /const trail = postBreadcrumbs\(meta\)/],
    ["BlogTopic.tsx", /const trail = topicBreadcrumbs\(topic\)/],
  ])("%s renders the visible trail and the BreadcrumbList from the same list", (file, builds) => {
    const page = readFileSync(join(repoRoot, "src", "pages", file), "utf-8");
    expect(page).toMatch(builds);
    expect(page).toMatch(/breadcrumbSchema\(trail\)/);
    expect(page).toMatch(/<Breadcrumbs trail=\{trail\} \/>/);
  });

  it("marks the current page and links the steps before it", () => {
    const component = readFileSync(join(repoRoot, "src", "components", "blog", "Breadcrumbs.tsx"), "utf-8");
    expect(component).toMatch(/aria-current="page"/);
    expect(component).toMatch(/<ol/);
  });
});
