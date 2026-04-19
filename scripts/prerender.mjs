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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distDir = join(__dirname, "..", "dist");
const PORT = 4173;

// Routes to prerender. Must match the routes registered in src/App.tsx.
const ROUTES = [
  "/",
  "/pricing",
  "/blog",
  "/changelog",
  "/security",
  "/integrations",
  "/integrations/plaid",
  "/integrations/quickbooks",
  "/integrations/hubspot",
  "/integrations/slack",
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
  console.log(`[prerender] starting on http://localhost:${PORT}`);
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
      // Disable animations so the captured state is stable and deterministic.
      await page.emulateMediaFeatures([
        { name: "prefers-reduced-motion", value: "reduce" },
      ]);
      await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
      // Give React hydration and Helmet an extra beat to settle.
      await new Promise((r) => setTimeout(r, 500));
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
