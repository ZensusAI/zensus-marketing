// Internal link invariant.
//
// A mistyped internal link is silent: the SPA renders NotFound, the prerender
// never visits the bad URL, and nothing in the build complains. Internal links
// are also how the guides, tools, comparison and integration pages pass
// authority to each other, so a dead one costs twice. This test collects every
// literal internal link target in the pages, components and blog posts, and
// asserts each one is a route that exists.
//
// Only string literals are checked. A target built at runtime, such as
// to={`/blog/${slug}`}, is derived from the same slug list the router uses and
// cannot drift this way.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));
const read = (...parts: string[]) => readFileSync(join(repoRoot, ...parts), "utf-8");

const SCAN_DIRS = [
  ["src", "pages"],
  ["src", "components"],
  ["src", "content", "blog"],
  ["src", "lib"],
];

/** Static routes declared in App.tsx, minus :params and the catch-all. */
function staticRoutes(): string[] {
  return [...read("src", "App.tsx").matchAll(/path="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((p) => p.startsWith("/") && !p.includes(":"));
}

/** Edge redirects in vercel.json are valid link targets too. */
function redirectSources(): string[] {
  const config = JSON.parse(read("vercel.json")) as { redirects?: { source: string }[] };
  return (config.redirects ?? []).map((r) => r.source);
}

function blogRoutes(): string[] {
  return readdirSync(join(repoRoot, "src", "content", "blog"))
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => `/blog/${f.replace(/\.mdx$/, "")}`);
}

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(tsx|ts|mdx)$/.test(name) && !/\.test\.tsx?$/.test(name)) out.push(full);
  }
  return out;
}

// to="/x", href="/x", to: "/x", href: "/x", and markdown ](/x). The leading
// slash must be followed by a path character or end the string, so protocol
// relative URLs ("//host") and regex literals do not match.
const LINK_PATTERNS = [
  /\b(?:to|href)=["'](\/[^"']*)["']/g,
  /\b(?:to|href):\s*["'](\/[^"']*)["']/g,
  /\]\((\/[^)\s]*)\)/g,
];

/** Files served from public/ (templates, images, fonts), not routes. */
const isAsset = (path: string) => /\.[a-z0-9]{2,5}$/i.test(path);

function linkTargets(): { file: string; target: string; path: string }[] {
  const found: { file: string; target: string; path: string }[] = [];
  for (const parts of SCAN_DIRS) {
    for (const file of walk(join(repoRoot, ...parts))) {
      const source = readFileSync(file, "utf-8");
      for (const pattern of LINK_PATTERNS) {
        for (const match of source.matchAll(pattern)) {
          const target = match[1];
          if (target.startsWith("//")) continue;
          const path = target.split(/[?#]/)[0].replace(/(.)\/$/, "$1") || "/";
          if (isAsset(path)) continue;
          found.push({ file: relative(repoRoot, file).split(sep).join("/"), target, path });
        }
      }
    }
  }
  return found;
}

describe("internal links", () => {
  const known = new Set([...staticRoutes(), ...blogRoutes(), ...redirectSources()]);
  const targets = linkTargets();

  it("finds the links, so a broken scan cannot pass", () => {
    expect(targets.length).toBeGreaterThan(100);
    expect(targets.map((t) => t.path)).toContain("/pricing");
  });

  it("points every literal internal link at a route that exists", () => {
    const dead = targets
      .filter((t) => !known.has(t.path))
      .map((t) => `${t.file}: ${t.target}`);
    expect(dead).toEqual([]);
  });

  // The pages below had no in-content links before September 2026 (the
  // comparison pages had two). They are the pages a buyer reads last, so the
  // homepage keeps pointing at them from its own content, not only the footer.
  it("keeps the homepage linking to the pages that close a decision", () => {
    const home = [
      read("src", "components", "landing", "Comparison.tsx"),
      read("src", "components", "landing", "Problem.tsx"),
      read("src", "components", "landing", "Resources.tsx"),
      read("src", "components", "landing", "TrustBar.tsx"),
    ].join("\n");
    for (const path of [
      "/compare/zensus-vs-float",
      "/compare/zensus-vs-pulse",
      "/compare/float-alternatives",
      "/use-cases",
      "/tools/runway-calculator",
      "/tools/payroll-calendar",
      "/integrations/plaid",
      "/integrations/quickbooks",
      "/integrations/hubspot",
      "/integrations/slack",
    ]) {
      expect(home, `homepage content should link to ${path}`).toContain(`"${path}"`);
    }
  });
});
