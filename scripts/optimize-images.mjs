// One-shot image optimizer for the marketing site's image assets.
// Run with: node scripts/optimize-images.mjs
//
// Shrinks oversized PNGs to the dimensions they actually render at
// (with a 2x retina margin) and re-encodes them with compression.
// Writes results in place.

import { readFile, writeFile, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const assetsDir = join(__dirname, "..", "src", "assets");

// Target: each entry specifies the max dimension (longer edge) and
// output format. We keep PNG for logos (transparency) and convert
// large screenshots to highly-compressed PNG as well since we do not
// want to update every import to WebP in one pass.
const TARGETS = [
  { file: "zensus-logo.png", maxDim: 192, format: "png" },
  { file: "runway-whatif.png", maxDim: 1600, format: "png" },
  { file: "runway-alerts.png", maxDim: 1600, format: "png" },
  { file: "runway-drilldown.png", maxDim: 1600, format: "png" },
];

async function optimize({ file, maxDim, format }) {
  const filePath = join(assetsDir, file);
  const beforeBytes = (await stat(filePath)).size;
  const input = await readFile(filePath);
  const pipeline = sharp(input).resize({
    width: maxDim,
    height: maxDim,
    fit: "inside",
    withoutEnlargement: true,
  });
  const output =
    format === "png"
      ? await pipeline.png({ compressionLevel: 9, palette: true }).toBuffer()
      : await pipeline.webp({ quality: 82 }).toBuffer();
  await writeFile(filePath, output);
  const afterBytes = (await stat(filePath)).size;
  const reduction = (((beforeBytes - afterBytes) / beforeBytes) * 100).toFixed(1);
  console.log(
    `${file}: ${(beforeBytes / 1024).toFixed(0)} KB -> ${(afterBytes / 1024).toFixed(0)} KB (-${reduction}%)`,
  );
}

for (const target of TARGETS) {
  try {
    await optimize(target);
  } catch (err) {
    console.error(`Failed on ${target.file}:`, err.message);
  }
}
