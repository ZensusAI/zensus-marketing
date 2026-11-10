// The inverse of route-coverage.test.ts. That file asserts every public route
// is prerendered, in the sitemap and carded; this one asserts each private
// route (opened only through a signed link) is in none of those places, is
// not linked from anywhere on the site, and is served as a noindex shell.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { buildTourShell, TOUR_TOKEN_KEY as SHELL_TOKEN_KEY } from "../../scripts/tour-shell.mjs";
import { PRIVATE_ROUTES, isPrivateRoute } from "./private-routes";
import { TOUR_TOKEN_KEY } from "./tour";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));
const read = (...parts: string[]) => readFileSync(join(repoRoot, ...parts), "utf-8");

/** Matches the route as a path, not as a prefix of another ("/tour-image", "/tours"). */
const routePattern = (route: string) => new RegExp(`${route.replace(/[/-]/g, "\\$&")}(?![\\w-])`);

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(relative(repoRoot, full).split(sep).join("/"));
  }
  return out;
}

// Files that may name the tour: its route registration, the tour page and
// its own modules, this list, the build step that writes its shell, and tests.
const ALLOWED = [
  /^src\/App\.tsx$/,
  /^src\/pages\/Tour\.tsx$/,
  /^src\/components\/tour\//,
  /^src\/lib\/tour\.ts$/,
  /^src\/lib\/private-routes\.ts$/,
  /\.test\.tsx?$/,
];

describe("private routes", () => {
  it("lists /tour, and is registered in App.tsx", () => {
    expect(PRIVATE_ROUTES).toContain("/tour");
    for (const route of PRIVATE_ROUTES) expect(read("src", "App.tsx")).toContain(`path="${route}"`);
    expect(isPrivateRoute("/tour")).toBe(true);
    expect(isPrivateRoute("/tour/")).toBe(true);
    expect(isPrivateRoute("/tours")).toBe(false);
    expect(isPrivateRoute("/")).toBe(false);
  });

  for (const route of PRIVATE_ROUTES) {
    const pattern = routePattern(route);

    it(`${route} is not prerendered`, () => {
      const block = read("scripts", "prerender.mjs").match(/const STATIC_ROUTES = \[([\s\S]*?)\];/)?.[1] ?? "";
      expect(block.length).toBeGreaterThan(0);
      expect(block).not.toMatch(pattern);
    });

    it(`${route} is not in the sitemap, the sitemap generator or the /sitemap page`, () => {
      expect(read("public", "sitemap.xml")).not.toMatch(pattern);
      expect(read("scripts", "generate-sitemap.mjs")).not.toMatch(pattern);
      expect(read("src", "pages", "Sitemap.tsx")).not.toMatch(pattern);
    });

    it(`${route} is not in robots.txt (naming it there would advertise it)`, () => {
      expect(read("public", "robots.txt")).not.toMatch(pattern);
    });

    it(`${route} has no Open Graph card`, () => {
      const og = read("scripts", "generate-og.mjs");
      const slug = route.slice(1).replace(/\//g, "-");
      expect(og).not.toMatch(new RegExp(`slug:\\s*"${slug}"`));
      expect(og).not.toMatch(pattern);
    });

    it(`${route} is not in the llms files or index.html`, () => {
      for (const file of [["public", "llms.txt"], ["public", "llms-full.txt"], ["index.html"]]) {
        expect(read(...file), file.join("/")).not.toMatch(pattern);
      }
    });

    it(`nothing under src/ links to ${route} except the route registration and the tour itself`, () => {
      const files = walk(join(repoRoot, "src"));
      // Prove the walk can see: App.tsx does name the route.
      expect(files).toContain("src/App.tsx");
      expect(read("src", "App.tsx")).toMatch(pattern);
      const offenders = files.filter(
        (f) => /\.(tsx?|mdx?|json|css|html)$/.test(f) && !ALLOWED.some((a) => a.test(f)) && pattern.test(read(f)),
      );
      expect(offenders).toEqual([]);
    });
  }

  it("serves /tour as a noindex shell with no referrer and its own headers", () => {
    const config = JSON.parse(read("vercel.json")) as {
      headers: { source: string; headers: { key: string; value: string }[] }[];
      functions?: Record<string, { includeFiles?: string }>;
    };
    const sources = config.headers.map((h) => h.source);
    const tour = config.headers.find((h) => h.source === "/tour");
    const value = (key: string) => tour?.headers.find((h) => h.key === key)?.value;
    expect(value("Referrer-Policy")).toBe("no-referrer");
    expect(value("X-Robots-Tag")).toBe("noindex, nofollow, noarchive");
    // Later header rules override earlier ones for the same key, so the tour's
    // rule must come after the site-wide one that sets Referrer-Policy.
    expect(sources.indexOf("/tour")).toBeGreaterThan(sources.indexOf("/(.*)"));
    // The tour functions read api/_tour/ at runtime; Vercel must bundle it.
    expect(config.functions?.["api/tour-access.ts"]?.includeFiles).toBe("api/_tour/**");
    expect(config.functions?.["api/tour-image.ts"]?.includeFiles).toBe("api/_tour/**");
  });

  it("builds the shell before prerender overwrites dist/index.html", () => {
    const build = (JSON.parse(read("package.json")) as { scripts: { build: string } }).scripts.build;
    const shell = build.indexOf("node scripts/tour-shell.mjs");
    expect(shell).toBeGreaterThan(build.indexOf("vite build"));
    expect(shell).toBeLessThan(build.indexOf("node scripts/prerender.mjs"));
  });

  it("the shell is noindex, strips the token first and loads no tracker", () => {
    const shell: string = buildTourShell(read("index.html"));
    expect(shell).toContain('<meta name="robots" content="noindex, nofollow" />');
    expect(shell).not.toContain('content="index, follow"');
    expect(shell).toContain('<meta name="referrer" content="no-referrer" />');
    expect(shell).not.toContain("assets.apollo.io");
    // The token-stash script is the first thing in <head>, before any other script.
    const head = shell.slice(shell.indexOf("<head"));
    expect(head.indexOf("<script")).toBe(head.indexOf("<script data-tour-token>"));
    expect(shell).toContain('history.replaceState(history.state,"",location.pathname+location.search)');
    // The page reads the token back from the key the shell stashed it under.
    expect(SHELL_TOKEN_KEY).toBe(TOUR_TOKEN_KEY);
    expect(shell).toContain(JSON.stringify(TOUR_TOKEN_KEY));
    // The original template keeps its tracker and index directive.
    expect(read("index.html")).toContain("assets.apollo.io");
  });
});
