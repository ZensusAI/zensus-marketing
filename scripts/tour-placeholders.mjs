// Draw a neutral placeholder screenshot for every step in the private tour's
// manifest (api/_tour/manifest.json), at the step's width and height. Each
// says "Screenshot coming soon", names the step and outlines its hotspot, and
// carries no product data. The capture script replaces them with real
// screenshots later and rewrites the manifest.
//
//   node scripts/tour-placeholders.mjs          # only steps with no image yet
//   node scripts/tour-placeholders.mjs --force  # redraw every step

import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const tourDir = join(dirname(fileURLToPath(import.meta.url)), "..", "api", "_tour");
const force = process.argv.includes("--force");

const escapeXml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function svgFor(step, number) {
  const { width: W, height: H, hotspot } = step;
  const hx = (hotspot.x / 100) * W;
  const hy = (hotspot.y / 100) * H;
  const hw = (hotspot.w / 100) * W;
  const hh = (hotspot.h / 100) * H;
  const font = "Helvetica, Arial, sans-serif";
  // Text sits in the band under the title bar, above every hotspot.
  const tx = Math.round(W * 0.16) + 48;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#f6f5f1"/>
  <rect x="0" y="0" width="${W}" height="56" fill="#ebe9e3"/>
  <circle cx="28" cy="28" r="7" fill="#d6d3cb"/><circle cx="52" cy="28" r="7" fill="#d6d3cb"/><circle cx="76" cy="28" r="7" fill="#d6d3cb"/>
  <rect x="0" y="56" width="${Math.round(W * 0.16)}" height="${H - 56}" fill="#efede8"/>
  <rect x="${hx}" y="${hy}" width="${hw}" height="${hh}" rx="10" fill="#e3efe8" stroke="#2f7a55" stroke-width="3" stroke-dasharray="12 8"/>
  <text x="${tx}" y="104" font-family="${font}" font-size="18" fill="#8a877f">STEP ${number}</text>
  <text x="${tx}" y="146" font-family="${font}" font-size="34" font-weight="700" fill="#4a4842">Screenshot coming soon</text>
  <text x="${tx}" y="180" font-family="${font}" font-size="20" fill="#6f6c64">${escapeXml(step.title)}</text>
</svg>`;
}

const manifest = JSON.parse(await readFile(join(tourDir, "manifest.json"), "utf-8"));
let written = 0;
for (const [index, step] of manifest.steps.entries()) {
  const out = join(tourDir, step.image);
  if (existsSync(out) && !force) continue;
  const image = sharp(Buffer.from(svgFor(step, index + 1)));
  if (step.image.endsWith(".webp")) await image.webp({ quality: 80 }).toFile(out);
  else if (/\.jpe?g$/.test(step.image)) await image.jpeg({ quality: 80 }).toFile(out);
  else await image.png({ palette: true, compressionLevel: 9 }).toFile(out);
  written += 1;
  console.log(`[tour-placeholders] wrote ${out}`);
}
console.log(`[tour-placeholders] ${written} image(s) written`);
