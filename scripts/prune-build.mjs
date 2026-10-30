// Remove files from dist/ that the site never serves, so each Vercel
// deployment stores less. Runs after prerender, which is the last step
// that reads dist/.
//
// Blog illustrations: public/blog/<slug>/<name>.png is the editable
// source and its .webp twin is what pages reference (blog-images.test.ts
// enforces that). Vite copies public/ wholesale, so without this every
// deployment carries both. A PNG is only removed when its twin exists.
// vercel.json redirects any old /blog/<slug>/<name>.png URL to the twin.

import { readdir, stat, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_BLOG = join(__dirname, "..", "dist", "blog");

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.isFile()) yield full;
  }
}

let removed = 0;
let bytes = 0;
if (existsSync(DIST_BLOG)) {
  for await (const file of walk(DIST_BLOG)) {
    if (!file.toLowerCase().endsWith(".png")) continue;
    if (!existsSync(file.replace(/\.png$/i, ".webp"))) continue;
    bytes += (await stat(file)).size;
    await unlink(file);
    removed += 1;
  }
}
console.log(
  `[prune] removed ${removed} source PNGs from dist/blog (${(bytes / 1024 / 1024).toFixed(1)} MB)`,
);
