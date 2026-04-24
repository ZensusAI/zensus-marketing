// Ping IndexNow on every Vercel production build so Bing, Yandex, and
// other IndexNow-compatible engines learn about updated URLs within
// minutes instead of days. See https://www.indexnow.org.
//
// Runs after prerender during `npm run build`. Only pings when the
// environment looks like a Vercel production build (VERCEL=1 and
// VERCEL_ENV=production) so local `npm run build` never hits the API.
// Failures are logged but do not break the build.

import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITEMAP_PATH = join(__dirname, "..", "public", "sitemap.xml");

const KEY = "50e6a09d8eaa8f7b9871da6766dbaea1";
const HOST = "zensus.app";
const ENDPOINT = "https://api.indexnow.org/IndexNow";

async function ping() {
  const onVercelProd =
    process.env.VERCEL === "1" && process.env.VERCEL_ENV === "production";

  if (!onVercelProd) {
    console.log(
      "[indexnow] skipping (not a Vercel production build; set VERCEL=1 and VERCEL_ENV=production to ping)",
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
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
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
