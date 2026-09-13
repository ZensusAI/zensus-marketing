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

import {
  LEGACY_SITE_HOST,
  LEGACY_SITE_URL,
  SITE_HOST,
  SITE_URL,
} from "./constants";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));
const read = (...parts: string[]) =>
  readFileSync(join(repoRoot, ...parts), "utf-8");

/** Pull a named origin string literal out of one of the mirror modules. */
function declaredConst(name: string, ...parts: string[]): string | undefined {
  return read(...parts).match(
    new RegExp(`export const ${name} = "([^"]+)";`),
  )?.[1];
}

const declaredOrigin = (...parts: string[]) =>
  declaredConst("SITE_URL", ...parts);

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

// .github is here because the IndexNow workflow hardcoded the origin and so
// survived the zensus.finance cutover untouched, returning HTTP 200 while
// telling Bing and Yandex that the old domain had changed. CI config is exactly
// the kind of file that never gets read during a migration and never complains.
const SCAN_DIRS = ["src", "api", "scripts", ".github"];
const SCAN_EXT = [".ts", ".tsx", ".mjs", ".mdx", ".html", ".yml", ".yaml"];

/**
 * Files at the repo root, which none of SCAN_DIRS reaches.
 *
 * index.html is the reason this list exists. It sits outside src/ and is static,
 * so it cannot import the site constants, and it holds the site-wide schema.org
 * @graph: the @id values that search and AI engines use as this site's entity
 * identity. A domain change that missed it would leave the site serving
 * canonicals for one domain while declaring itself to be the entity at another.
 * vite.config.ts now stamps the origin in, so the file should only ever contain
 * the __SITE_URL__ / __SITE_HOST__ / __LEGACY_SITE_HOST__ placeholders.
 */
const ROOT_FILES = ["index.html"];

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

/** Every file the origin guards below look at. */
function scannedFiles(): string[] {
  return [...SCAN_DIRS.flatMap((d) => walk(d)), ...ROOT_FILES];
}

describe("site origin", () => {
  it("is declared identically in all three runtimes", () => {
    expect(declaredOrigin("scripts", "site.mjs")).toBe(SITE_URL);
    expect(declaredOrigin("api", "_lib", "site.ts")).toBe(SITE_URL);
  });

  // The legacy host is mirrored too: api/_lib/site.ts uses it to keep accepting
  // form posts from the old origin, and the legal copy names it when explaining
  // the redirect. If the two drift, one of those silently describes a different
  // domain from the one actually allow-listed.
  it("mirrors the legacy origin in all three runtimes", () => {
    expect(declaredConst("LEGACY_SITE_URL", "api", "_lib", "site.ts")).toBe(
      LEGACY_SITE_URL,
    );
    expect(declaredConst("LEGACY_SITE_URL", "scripts", "site.mjs")).toBe(
      LEGACY_SITE_URL,
    );
    expect(LEGACY_SITE_URL).not.toBe(SITE_URL);
    expect(LEGACY_SITE_HOST).toBe(LEGACY_SITE_URL.replace(/^https:\/\//, ""));
  });

  it("derives SITE_HOST from SITE_URL", () => {
    expect(SITE_URL).toMatch(/^https:\/\//);
    expect(SITE_URL).not.toMatch(/\/$/);
    expect(SITE_HOST).toBe(SITE_URL.replace(/^https:\/\//, ""));
  });

  it("is not hardcoded anywhere outside the declaration sites", () => {
    const offenders: string[] = [];

    for (const file of scannedFiles()) {
      const rel = relative(".", file).split("\\").join("/");
      if (ALLOWED.has(rel) || rel.includes(".test.")) continue;
      const source = readFileSync(join(repoRoot, file), "utf-8");
      // Any absolute URL on a zensus domain that is not built from SITE_URL.
      for (const match of source.matchAll(/https:\/\/zensus\.[a-z]+/g)) {
        offenders.push(`${rel}: ${match[0]}`);
      }
    }

    expect(offenders).toEqual([]);
  });

  // The rule above only catches origins that carry a scheme. Display copy
  // writes the host on its own ("Support form at zensus.app/support", the
  // visible text of a link whose href is already built from SITE_URL), and
  // Security.tsx had one URL-encoded inside a query string. Those survive a
  // domain change silently, and the Privacy page shape is the worst of them:
  // the link goes to the right place while showing the reader the wrong
  // domain, so clicking through it proves nothing.
  //
  // A host preceded by "." or "@" is left alone. Those are the cookie scope
  // (".zensus.app"), the product hosts (app./api.zensus.app) and mail
  // addresses, none of which follow SITE_URL and all of which stay put.
  it("does not hardcode the host in display copy either", () => {
    const offenders: string[] = [];

    for (const file of scannedFiles()) {
      const rel = relative(".", file).split("\\").join("/");
      if (ALLOWED.has(rel) || rel.includes(".test.")) continue;
      const source = readFileSync(join(repoRoot, file), "utf-8");
      for (const match of source.matchAll(/(?<![.@])zensus\.[a-z]{2,}/g)) {
        offenders.push(`${rel}: ${match[0]}`);
      }
    }

    expect(offenders).toEqual([]);
  });
});
