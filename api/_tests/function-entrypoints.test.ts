import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// Vercel deploys every file under api/ as its own serverless function, except
// files and directories whose names start with "_" or ".". A test file outside
// those is deployed as a public endpoint, bundled with vitest and its mocks, and
// typechecked by Vercel against the root tsconfig.json, which logs errors into
// every production build. acknowledge.test.ts and tools/send-results.test.ts
// sat directly in api/ and shipped that way until they moved into api/_tests/.
const apiRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..");

function functionEntrypoints(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name.startsWith("_") || name.startsWith(".")) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) functionEntrypoints(full, out);
    else out.push(relative(apiRoot, full).split(sep).join("/"));
  }
  return out;
}

describe("api/ function entrypoints", () => {
  const entrypoints = functionEntrypoints(apiRoot);

  it("finds the real handlers, so a broken walk cannot pass", () => {
    expect(entrypoints).toContain("acknowledge.ts");
    expect(entrypoints).toContain("tools/send-results.ts");
  });

  it("contains no test files", () => {
    const tests = entrypoints.filter((f) => /\.(test|spec)\.[cm]?[jt]sx?$/.test(f));
    expect(tests).toEqual([]);
  });
});
