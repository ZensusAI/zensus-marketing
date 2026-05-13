// Ping IndexNow on every Vercel production build so Bing, Yandex, and
// other IndexNow-compatible engines learn about updated URLs within
// minutes instead of days. See https://www.indexnow.org.
//
// Runs after prerender during `npm run build`. Only pings when the
// environment looks like a Vercel production build (VERCEL=1 and
// VERCEL_ENV=production) so local `npm run build` never hits the API.
// Failures are logged but do not break the build.
//
// Key resolution (in order):
// 1. INDEXNOW_KEY environment variable (set in Vercel for production).
// 2. Else: single file public/<32-hex>.txt whose first line matches the stem.
// The key must match https://zensus.app/<key>.txt (see docs/indexnow.md).

import { readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITEMAP_PATH = join(__dirname, "..", "public", "sitemap.xml");
const PUBLIC_DIR = join(__dirname, "..", "public");

const HOST = "zensus.app";
const ENDPOINT = "https://api.indexnow.org/indexnow";

const HEX32_TXT = /^([a-f0-9]{32})\.txt$/i;

async function resolveKey() {
  const fromEnv = process.env.INDEXNOW_KEY?.trim();
  if (fromEnv && /^[a-f0-9]{32}$/i.test(fromEnv)) return fromEnv;

  const names = await readdir(PUBLIC_DIR);
  const keyFiles = names.filter((n) => HEX32_TXT.test(n));
  if (keyFiles.length !== 1) {
    if (keyFiles.length > 1) {
      console.warn(
        "[indexnow] multiple public/*.txt key candidates; set INDEXNOW_KEY explicitly",
      );
    }
    return "";
  }
  const stem = keyFiles[0].replace(/\.txt$/i, "");
  const raw = await readFile(join(PUBLIC_DIR, keyFiles[0]), "utf-8");
  const line = raw.trim().split(/\r?\n/)[0]?.trim() ?? "";
  if (line.toLowerCase() === stem.toLowerCase()) return line;
  return "";
}

async function ping() {
  const onVercelProd =
    process.env.VERCEL === "1" && process.env.VERCEL_ENV === "production";

  if (!onVercelProd) {
    console.log(
      "[indexnow] skipping (not a Vercel production build; set VERCEL=1 and VERCEL_ENV=production to ping)",
    );
    return;
  }

  const key = await resolveKey();
  if (!key) {
    console.warn(
      "[indexnow] no IndexNow key: set INDEXNOW_KEY on Vercel or keep exactly one public/<32-hex>.txt whose body matches the filename",
    );
    return;
  }

  const sitemap = await readFile(SITEMAP_PATH, "utf-8");
  const urlList = [...sitemap.matchAll(/<loc>(.+?)<\/loc>/g)].map((m) => m[1]);

  if (urlList.length === 0) {
    console.warn("[indexnow] no <loc> entries found in sitemap; aborting");
    return;
  }

  console.log(`[indexnow] pinging ${urlList.length} URLs`);

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      host: HOST,
      key,
      keyLocation: `https://${HOST}/${key}.txt`,
      urlList,
    }),
  });

  console.log(`[indexnow] response: ${res.status} ${res.statusText}`);
  if (res.status >= 400) {
    const body = await res.text().catch(() => "");
    console.warn(`[indexnow] body: ${body.slice(0, 300)}`);
  }
}

ping().catch((err) => {
  console.error("[indexnow] failed:", err);
  // Do not fail the build on a ping failure; indexing is a nice-to-have.
});
