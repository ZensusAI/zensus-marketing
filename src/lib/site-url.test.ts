// Single-origin invariant.
//
// Every absolute URL this site emits (canonicals, og/twitter tags, JSON-LD
// @ids, sitemap entries, OG card footers, the XLSX template note) derives from
// one value. It is declared three times because three runtimes need it and
// none of them can import the others:
//
//   src/lib/constants.ts  the app bundle, via the "@" alias
//   scripts/site.mjs      the build scripts, plain ESM outside Vite
//   api/_lib/site.ts      the serverless handlers, which have no "@" alias
//
// Nothing else enforces that those three agree, and a drift between them is
// silent: the site would serve canonicals on one domain and a sitemap on
// another, which is the exact shape of error that makes a domain migration
// leak rankings. Hence this test.
//
// The second half is the migration guard proper. A hardcoded origin anywhere
// outside the three declaration sites survives a one-line domain change and
// then quietly points at the old host forever, so it fails the build instead.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { SITE_HOST, SITE_URL } from "./constants";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));
const read = (...parts: string[]) =>
  readFileSync(join(repoRoot, ...parts), "utf-8");

/** Pull the SITE_URL string literal out of one of the mirror modules. */
function declaredOrigin(...parts: string[]): string | undefined {
  return read(...parts).match(/export const SITE_URL = "([^"]+)";/)?.[1];
}

/**
 * Files allowed to contain a bare origin literal.
 *
 * The three declaration sites, plus:
 *  - tests, which legitimately assert on concrete URLs
 *  - src/generated/blog-stats.ts, codegen whose URLs are built from SITE_URL
 *    by scripts/generate-blog-stats.mjs and regenerated on every build
 */
const ALLOWED = new Set([
  "src/lib/constants.ts",
  "scripts/site.mjs",
  "api/_lib/site.ts",
  "src/generated/blog-stats.ts",
]);

const SCAN_DIRS = ["src", "api", "scripts"];
const SCAN_EXT = [".ts", ".tsx", ".mjs", ".mdx", ".html"];

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(join(repoRoot, dir))) {
    if (entry === "node_modules" || entry.startsWith(".")) continue;
    const rel = join(dir, entry);
    if (statSync(join(repoRoot, rel)).isDirectory()) {
      walk(rel, out);
    } else if (SCAN_EXT.some((e) => entry.endsWith(e))) {
      out.push(rel);
    }
  }
  return out;
}

describe("site origin", () => {
  it("is declared identically in all three runtimes", () => {
    expect(declaredOrigin("scripts", "site.mjs")).toBe(SITE_URL);
    expect(declaredOrigin("api", "_lib", "site.ts")).toBe(SITE_URL);
  });

  it("derives SITE_HOST from SITE_URL", () => {
    expect(SITE_URL).toMatch(/^https:\/\//);
    expect(SITE_URL).not.toMatch(/\/$/);
    expect(SITE_HOST).toBe(SITE_URL.replace(/^https:\/\//, ""));
  });

  it("is not hardcoded anywhere outside the declaration sites", () => {
    const offenders: string[] = [];

    for (const dir of SCAN_DIRS) {
      for (const file of walk(dir)) {
        const rel = relative(".", file).split("\\").join("/");
        if (ALLOWED.has(rel) || rel.includes(".test.")) continue;
        const source = readFileSync(join(repoRoot, file), "utf-8");
        // Any absolute URL on a zensus domain that is not built from SITE_URL.
        for (const match of source.matchAll(/https:\/\/zensus\.[a-z]+/g)) {
          offenders.push(`${rel}: ${match[0]}`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});
