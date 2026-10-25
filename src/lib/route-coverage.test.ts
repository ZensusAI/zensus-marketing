// Route coverage invariant.
//
// Four files must agree on the site's URL set, and nothing enforces that at
// build time: src/App.tsx (what React serves), scripts/prerender.mjs
// (what Googlebot and AI crawlers get as static HTML), public/sitemap.xml
// (what crawlers are told exists), and scripts/generate-og.mjs (the social
// card per route). A route added to App.tsx but forgotten in STATIC_ROUTES
// ships as an empty SPA shell to every crawler, which is silent and severe.
//
// Blog posts are derived from src/content/blog/*.mdx by blog-slugs.mjs, and
// blog topic pages from scripts/blog-topics.mjs (kept equal to BLOG_TOPICS by
// blog-topics.test.ts), so they cannot drift by construction; they are
// asserted here anyway to catch a stale committed sitemap or a script that
// stops reading the list.

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { BLOG_TOPICS } from "./blog";
import { SITE_URL } from "./constants";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));
const read = (...parts: string[]) =>
  readFileSync(join(repoRoot, ...parts), "utf-8");

// Derived rather than written out, so a domain change does not turn this
// invariant into a false failure that invites someone to "fix" it by editing
// the expectation. If the committed sitemap is stale after a domain change,
// this test should fail loudly and be fixed by regenerating the sitemap.
const ORIGIN = SITE_URL;

/** Static route paths declared in App.tsx, minus :params and the catch-all. */
function appRoutes(): string[] {
  const source = read("src", "App.tsx");
  return [...source.matchAll(/path="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((p) => p.startsWith("/") && !p.includes(":"))
    .sort();
}

/** The STATIC_ROUTES array literal in the prerender script. */
function prerenderRoutes(): string[] {
  const source = read("scripts", "prerender.mjs");
  const block = source.match(/const STATIC_ROUTES = \[([\s\S]*?)\];/);
  if (!block) throw new Error("STATIC_ROUTES array not found in prerender.mjs");
  return [...block[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]).sort();
}

/** Every <loc> in the committed sitemap, as an origin-relative path. */
function sitemapPaths(): string[] {
  const xml = read("public", "sitemap.xml");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].replace(ORIGIN, ""))
    .map((p) => (p === "" ? "/" : p))
    .sort();
}

/** Post slugs on disk, the source of truth blog-slugs.mjs reads. */
function mdxSlugs(): string[] {
  return readdirSync(join(repoRoot, "src", "content", "blog"))
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""))
    .sort();
}

/** Card slugs in generate-og.mjs, e.g. "tools-runway-calculator". */
function ogCardSlugs(): string[] {
  const source = read("scripts", "generate-og.mjs");
  return [...source.matchAll(/^\s*slug:\s*"([^"]+)"/gm)]
    .map((m) => m[1])
    .sort();
}

/** "/tools/runway-calculator" -> "tools-runway-calculator", "/" -> "home". */
function routeToCardSlug(route: string): string {
  return route === "/" ? "home" : route.slice(1).replace(/\//g, "-");
}

describe("route coverage", () => {
  const app = appRoutes();
  const staticSitemap = sitemapPaths().filter((p) => !p.startsWith("/blog/"));
  const topicPaths = BLOG_TOPICS.map((t) => `/blog/topic/${t.id}`).sort();

  it("declares at least the routes we know shipped", () => {
    // Guards against a regex that silently matches nothing and passes.
    expect(app.length).toBeGreaterThanOrEqual(21);
    expect(mdxSlugs().length).toBeGreaterThanOrEqual(13);
  });

  it("prerenders every static route in App.tsx", () => {
    expect(prerenderRoutes()).toEqual(app);
  });

  it("lists every static route in the sitemap", () => {
    expect(staticSitemap).toEqual(app);
  });

  it("lists every blog post in the sitemap", () => {
    const inSitemap = sitemapPaths()
      .filter((p) => p.startsWith("/blog/") && !p.startsWith("/blog/topic/"))
      .map((p) => p.replace("/blog/", ""))
      .sort();
    expect(inSitemap).toEqual(mdxSlugs());
  });

  it("lists every blog topic page in the sitemap", () => {
    expect(sitemapPaths().filter((p) => p.startsWith("/blog/topic/"))).toEqual(topicPaths);
  });

  it("routes, prerenders and cards every blog topic page", () => {
    expect(read("src", "App.tsx")).toContain('path="/blog/topic/:topicId"');
    const prerender = read("scripts", "prerender.mjs");
    expect(prerender).toMatch(/import \{ getTopicRoutes \} from "\.\/blog-topics\.mjs"/);
    expect(prerender).toMatch(/\.\.\.getTopicRoutes\(\)/);
    const og = read("scripts", "generate-og.mjs");
    expect(og).toMatch(/\.\.\.TOPIC_CARDS/);
    expect(read("src", "pages", "BlogTopic.tsx")).toContain("/og/blog-topic-${topic.id}.png");
  });

  it("generates an Open Graph card for every static route", () => {
    expect(ogCardSlugs()).toEqual(app.map(routeToCardSlug).sort());
  });

  // The /sitemap page lists static routes by hand (posts come from the blog
  // loader), so a new route would otherwise be missing from it unnoticed.
  it("links every static route from the /sitemap page", () => {
    const source = read("src", "pages", "Sitemap.tsx");
    const linked = new Set([...source.matchAll(/href: "([^"]+)"/g)].map((m) => m[1]));
    const missing = app.filter((p) => p !== "/sitemap" && !linked.has(p));
    expect(missing).toEqual([]);
  });
});
