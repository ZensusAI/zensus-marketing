// Prerender every marketing route to static HTML so Googlebot sees
// real content on first fetch instead of an empty SPA shell.
//
// After `vite build` this script:
// 1. Serves dist/ on a local port via vite preview
// 2. Walks each route with Puppeteer and captures the rendered HTML
// 3. Writes dist/<route>/index.html for every route
//
// Vercel then serves those static files directly for each URL. The
// React bundle still hydrates client-side for interactivity.

import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { getBlogRoutes } from "./blog-slugs.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distDir = join(__dirname, "..", "dist");
const PORT = 4173;

// Static routes to prerender. Must match src/App.tsx (blog slugs appended at runtime).
const STATIC_ROUTES = [
  "/",
  "/pricing",
  "/blog",
  "/changelog",
  "/security",
  "/about",
  "/privacy",
  "/terms",
  "/subprocessors",
  "/support",
  "/integrations",
  "/integrations/plaid",
  "/integrations/quickbooks",
  "/integrations/hubspot",
  "/integrations/slack",
  "/use-cases",
];

// Minimal static file server over dist/ with SPA fallback to index.html
// for unknown paths. Mirrors how Vercel serves the site in production.
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function startServer() {
  return new Promise((resolve, reject) => {
    const server = createServer(async (req, res) => {
      try {
        const urlPath = new URL(req.url, `http://localhost:${PORT}`).pathname;
        const ext = extname(urlPath);
        const filePath = ext
          ? join(distDir, urlPath)
          : join(distDir, "index.html");
        const data = await readFile(filePath);
        res.writeHead(200, { "Content-Type": MIME[ext] || MIME[".html"] });
        res.end(data);
      } catch {
        try {
          const data = await readFile(join(distDir, "index.html"));
          res.writeHead(200, { "Content-Type": MIME[".html"] });
          res.end(data);
        } catch (inner) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end(`Prerender server error: ${inner.message}`);
        }
      }
    });
    server.listen(PORT, (err) => (err ? reject(err) : resolve(server)));
  });
}

async function prerender() {
  const blogRoutes = await getBlogRoutes();
  const ROUTES = [...STATIC_ROUTES, ...blogRoutes];
  console.log(`[prerender] starting on http://localhost:${PORT} (${ROUTES.length} routes)`);
  const server = await startServer();
  // On Vercel we rely on the @sparticuz/chromium binary. Locally we
  // fall back to whichever Chrome/Chromium the machine already has so
  // developers do not need to download the serverless-tuned build.
  const localChrome = process.env.PUPPETEER_EXECUTABLE_PATH
    || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  const executablePath = process.env.VERCEL
    ? await chromium.executablePath()
    : localChrome;
  const browser = await puppeteer.launch({
    args: process.env.VERCEL
      ? chromium.args
      : ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: chromium.defaultViewport,
    executablePath,
    headless: true,
  });

  try {
    for (const route of ROUTES) {
      const url = `http://localhost:${PORT}${route}`;
      const page = await browser.newPage();
      // Signal to client code that this is the prerender crawl, before any app
      // script runs. PostHog (lib/analytics) checks window.__PRERENDER__ and
      // skips init so the build server never emits bot $pageview events.
      await page.evaluateOnNewDocument(() => {
        window.__PRERENDER__ = true;
      });
      // Disable animations so the captured state is stable and deterministic.
      await page.emulateMediaFeatures([
        { name: "prefers-reduced-motion", value: "reduce" },
      ]);
      await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
      // Give React hydration and Helmet an extra beat to settle.
      await new Promise((r) => setTimeout(r, 500));
      // Scrub the snapshot before serializing:
      // 1. Google One Tap injects a render-blocking cross-origin stylesheet,
      //    ~7KB of button CSS, and the gsi/client script while Puppeteer has
      //    the page open. Baking those into every static page penalizes first
      //    paint on all routes; One Tap re-creates everything it needs at
      //    runtime, so the snapshot must not carry them.
      // 2. The static index.html template ships generic og/twitter tags that
      //    Helmet replaces per route. Both copies survive serialization, and
      //    first-tag-wins scrapers then read og:type "website" on articles.
      //    Drop any template tag that a Helmet (data-rh) tag supersedes.
      await page.evaluate(() => {
        document.getElementById("googleidentityservice")?.remove();
        document.getElementById("googleidentityservice_button_styles")?.remove();
        document
          .querySelectorAll('script[src*="accounts.google.com/gsi"]')
          .forEach((el) => el.remove());
        document
          .querySelectorAll("#credential_picker_container, #credential_picker_iframe")
          .forEach((el) => el.remove());

        document.querySelectorAll("meta:not([data-rh])").forEach((tag) => {
          const key = tag.getAttribute("property") ?? tag.getAttribute("name");
          if (!key) return;
          const helmetDup = document.querySelector(
            `meta[data-rh][property="${key}"], meta[data-rh][name="${key}"]`,
          );
          if (helmetDup) tag.remove();
        });
      });
      const html = await page.content();
      await page.close();

      const outPath =
        route === "/"
          ? join(distDir, "index.html")
          : join(distDir, route.replace(/^\//, ""), "index.html");
      await mkdir(dirname(outPath), { recursive: true });
      await writeFile(outPath, html, "utf-8");
      console.log(`[prerender] wrote ${outPath}`);
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log("[prerender] done");
}

prerender().catch((err) => {
  console.error("[prerender] failed:", err);
  process.exit(1);
});
