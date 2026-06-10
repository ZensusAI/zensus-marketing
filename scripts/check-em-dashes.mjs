// Fail the build if an em-dash appears anywhere in source or the llms files.
//
// The site's voice convention (CLAUDE.md) bans em-dashes in code, content,
// copy, and comments. Manual cleanup has lost to new content twice, and the
// strings inside FAQ answers and JSON-LD are quoted verbatim by AI engines,
// so the ban is enforced mechanically at the front of every build.

import { readdir, readFile } from "node:fs/promises";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const SCAN_DIRS = [join(root, "src")];
const SCAN_FILES = [join(root, "public", "llms.txt"), join(root, "public", "llms-full.txt")];
const EXTENSIONS = new Set([".ts", ".tsx", ".mdx", ".md", ".css", ".html", ".txt", ".json", ".mjs"]);
const EM_DASH = "—";

async function collectFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) return collectFiles(full);
      const ext = entry.name.slice(entry.name.lastIndexOf("."));
      return EXTENSIONS.has(ext) ? [full] : [];
    }),
  );
  return files.flat();
}

const files = [...(await Promise.all(SCAN_DIRS.map(collectFiles))).flat(), ...SCAN_FILES];

const violations = [];
for (const file of files) {
  const text = await readFile(file, "utf-8").catch(() => null);
  if (text === null || !text.includes(EM_DASH)) continue;
  text.split("\n").forEach((line, index) => {
    if (line.includes(EM_DASH)) {
      violations.push(`${relative(root, file)}:${index + 1}: ${line.trim().slice(0, 100)}`);
    }
  });
}

if (violations.length > 0) {
  console.error(`[check-em-dashes] ${violations.length} em-dash(es) found. The site convention bans them; use commas, parentheses, semicolons, or split sentences.`);
  for (const violation of violations) console.error(`  ${violation}`);
  process.exit(1);
}
console.log(`[check-em-dashes] clean (${files.length} files scanned)`);
