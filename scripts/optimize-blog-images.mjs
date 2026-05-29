// Resize and compress blog illustrations under public/blog/**.
//
// Idempotent. Skips PNGs that are already under SIZE_THRESHOLD bytes AND
// at or below MAX_WIDTH pixels wide. Otherwise resizes (longer edge to
// MAX_WIDTH) and re-encodes as compressed PNG.
//
// Generative image tools (Midjourney, Gemini, DALL-E) typically produce
// 2500x1400+ PNGs at 5-6 MB. This brings them to ~300-500 KB without
// visible quality loss inside the BlogFigure container (max-w-xl).
//
// Usage:
//   node scripts/optimize-blog-images.mjs

import { readdir, stat, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_ROOT = join(__dirname, "..", "public", "blog");
const MAX_WIDTH = 1600;
const SIZE_THRESHOLD = 600 * 1024;

async function* walkPngs(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (err) {
    if (err.code === "ENOENT") return;
    throw err;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkPngs(full);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".png")) {
      yield full;
    }
  }
}

let touched = 0;
let skipped = 0;

for await (const file of walkPngs(BLOG_ROOT)) {
  const beforeBytes = (await stat(file)).size;
  const meta = await sharp(file).metadata();
  const width = meta.width ?? 0;

  if (beforeBytes < SIZE_THRESHOLD && width <= MAX_WIDTH) {
    skipped += 1;
    continue;
  }

  const output = await sharp(file)
    .resize({
      width: MAX_WIDTH,
      height: MAX_WIDTH,
      fit: "inside",
      withoutEnlargement: true,
    })
    .png({ compressionLevel: 9, quality: 90 })
    .toBuffer();
  await writeFile(file, output);
  touched += 1;

  const rel = relative(BLOG_ROOT, file);
  const beforeKb = (beforeBytes / 1024).toFixed(0);
  const afterKb = (output.length / 1024).toFixed(0);
  const pct = (((beforeBytes - output.length) / beforeBytes) * 100).toFixed(1);
  console.log(`${rel}: ${beforeKb} KB -> ${afterKb} KB (-${pct}%)`);
}

console.log(`\n${touched} optimized, ${skipped} already small enough.`);
