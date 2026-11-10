// Write dist/tour/index.html: the HTML shell for the private product tour.
//
// /tour is deliberately NOT prerendered (prerendering makes an indexable page
// with real content, and the tour is opened only through a signed link). The
// site has no SPA fallback either: an unknown path gets public/404.html. So
// the tour needs its own empty shell, which is the Vite build's index.html
// with four changes:
//
// 1. A tiny inline script runs first and moves the link token out of the
//    address bar (#t=<token>) into a page variable and sessionStorage, before
//    any other script can read or report the URL.
// 2. robots says noindex, nofollow (vercel.json also sends X-Robots-Tag).
// 3. The Apollo visitor tracker is removed: the tour runs no analytics.
// 4. A neutral title and a no-referrer policy.
//
// Runs after `vite build` and before prerender, which overwrites
// dist/index.html with the prerendered homepage.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const TOUR_TOKEN_KEY = "zensus-tour-token";

// Keep in step with takeTourToken() in src/lib/tour.ts (private-routes.test.ts
// checks the two keys match).
const STASH_SCRIPT =
  `<script data-tour-token>(function(){try{var h=location.hash;if(h.indexOf("#t=")!==0)return;` +
  `var t=h.slice(3);window.__zensusTourToken=t;try{sessionStorage.setItem(${JSON.stringify(TOUR_TOKEN_KEY)},t)}catch(e){}` +
  `history.replaceState(history.state,"",location.pathname+location.search)}catch(e){}})()</script>`;

export function buildTourShell(html) {
  let out = html;

  const head = out.match(/<head[^>]*>/);
  if (!head) throw new Error("[tour-shell] <head> not found");
  out = out.replace(head[0], `${head[0]}\n    ${STASH_SCRIPT}\n    <meta name="referrer" content="no-referrer" />`);

  const robots = /<meta name="robots" content="[^"]*" \/>/;
  if (!robots.test(out)) throw new Error("[tour-shell] robots meta not found");
  out = out.replace(robots, '<meta name="robots" content="noindex, nofollow" />');

  const title = /<title>[^<]*<\/title>/;
  if (!title.test(out)) throw new Error("[tour-shell] <title> not found");
  out = out.replace(title, "<title>Zensus product tour</title>");

  out = out.replace(/<script>(?:(?!<\/script>)[\s\S])*?assets\.apollo\.io[\s\S]*?<\/script>/g, "");
  if (out.includes("assets.apollo.io")) throw new Error("[tour-shell] Apollo tracker still present");

  return out;
}

async function main() {
  const distDir = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
  const html = await readFile(join(distDir, "index.html"), "utf-8");
  if (html.includes("data-app-loader")) {
    throw new Error("[tour-shell] dist/index.html is already prerendered; run this before prerender.mjs");
  }
  const outPath = join(distDir, "tour", "index.html");
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, buildTourShell(html), "utf-8");
  console.log(`[tour-shell] wrote ${outPath}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
