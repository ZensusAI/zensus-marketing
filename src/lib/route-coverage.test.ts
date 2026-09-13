// Route coverage invariant.
//
// Four files must agree on the site's URL set, and nothing enforces that at
// build time: src/App.tsx (what React serves), scripts/prerender.mjs
// (what Googlebot and AI crawlers get as static HTML), public/sitemap.xml
// (what crawlers are told exists), and scripts/generate-og.mjs (the social
// card per route). A route added to App.tsx but forgotten in STATIC_ROUTES
// ships as an empty SPA shell to every crawler, which is silent and severe.
//
// Blog posts are derived from src/content/blog/*.mdx by blog-slugs.mjs, so
// they cannot drift by construction; they are asserted here anyway to catch a
// stale committed sitemap.

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));
const read = (...parts: string[]) =>
  readFileSync(join(repoRoot, ...parts), "utf-8");

const ORIGIN = "https://zensus.app";

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
      .filter((p) => p.startsWith("/blog/"))
      .map((p) => p.replace("/blog/", ""))
      .sort();
    expect(inSitemap).toEqual(mdxSlugs());
  });

  it("generates an Open Graph card for every static route", () => {
    expect(ogCardSlugs()).toEqual(app.map(routeToCardSlug).sort());
  });
});
