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
import { getTopicRoutes } from "./blog-topics.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distDir = join(__dirname, "..", "dist");
const PORT = 4173;

// Static routes to prerender. Must match src/App.tsx (topic pages and blog slugs appended at runtime).
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
  "/tools/runway-calculator",
  "/tools/payroll-calendar",
  "/tools/13-week-cash-flow-template",
  "/compare/zensus-vs-float",
  "/compare/zensus-vs-pulse",
  "/compare/float-alternatives",
  "/compare/zensus-vs-cash-flow-frog",
  "/quickbooks-cash-flow-forecasting",
  "/llm-info",
  "/sitemap",
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

// The prerendered HTML is the whole visible page, so the app bundle (about
// 160 KB) is not needed to paint it. Left as a plain module script it starts
// downloading with the HTML and splits a slow connection's bandwidth with the
// hero image and fonts, which pushes LCP back by seconds on mobile. Start it
// once the page has loaded and its largest element has painted (or after
// 2.5s, whichever comes first). main.tsx still uses createRoot, so React
// rebuilds the same DOM when it arrives.
// Idempotent: later routes are served this rewritten index.html as their
// fallback, so the crawl's injected tag is dropped and the loader kept.
const LOADER_ATTR = "data-app-loader";
function deferAppScript(html) {
  const out = html.replace(/<script\b[^>]*\bdata-deferred-app\b[^>]*><\/script>/g, "");
  if (out.includes(LOADER_ATTR)) return out;
  const tag = /<script type="module" crossorigin(?:="")? src="([^"]+)"><\/script>/;
  const match = out.match(tag);
  if (!match) throw new Error("[prerender] app module script not found");
  const loader =
    `<script ${LOADER_ATTR}>(function(){var done=false,loaded=false,painted=false;function go(){if(done)return;done=true;` +
    `var s=document.createElement("script");s.type="module";s.crossOrigin="";s.src=${JSON.stringify(match[1])};` +
    `s.setAttribute("data-deferred-app","");document.head.appendChild(s)}` +
    `function check(){if(loaded&&painted)go()}` +
    `try{new PerformanceObserver(function(){painted=true;check()}).observe({type:"largest-contentful-paint",buffered:true})}catch(e){painted=true}` +
    `function onLoad(){loaded=true;check()}` +
    `if(document.readyState==="complete")onLoad();else addEventListener("load",onLoad,{once:true});setTimeout(go,2500)})()</script>`;
  return out.replace(tag, loader);
}

async function prerender() {
  const blogRoutes = await getBlogRoutes();
  const ROUTES = [...STATIC_ROUTES, ...getTopicRoutes(), ...blogRoutes];
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
    // Seconds per route in the log, so a page that slows the build stands
    // out (a blog post loop once took the build from 5 to 20 minutes).
    const started = Date.now();
    for (const route of ROUTES) {
      const routeStart = Date.now();
      const url = `http://localhost:${PORT}${route}`;
      const page = await browser.newPage();
      // Signal to client code that this is the prerender crawl, before any app
      // script runs. PostHog (lib/analytics) checks window.__PRERENDER__ and
      // skips init so the build server never emits bot $pageview events.
      await page.evaluateOnNewDocument(() => {
        window.__PRERENDER__ = true;
      });
      // Disable animations so the captured state is stable and deterministic.
      // Except on the homepage: its pinned sections render a different, static
      // layout under reduced motion, and most visitors (and Googlebot) do not
      // ask for it. Capturing that layout made the first paint the stacked
      // version, which then swapped to the pinned one and shifted. Its own
      // motion is scroll-driven, so at scroll 0 the capture is still
      // deterministic, and every word stays in the DOM either way.
      // The homepage also needs a desktop-sized viewport: Puppeteer's default
      // is 800x600, and a viewport under 720px tall renders the pins static
      // too (STATIC_PINS_QUERY in use-prefers-reduced-motion.ts).
      if (route === "/") {
        await page.setViewport({ width: 1440, height: 900 });
      } else {
        await page.emulateMediaFeatures([
          { name: "prefers-reduced-motion", value: "reduce" },
        ]);
      }
      await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
      // Give React hydration and Helmet an extra beat to settle.
      await new Promise((r) => setTimeout(r, 500));
      // Scrub the snapshot before serializing. The static index.html template
      // ships generic og/twitter tags that Helmet replaces per route. Both
      // copies survive serialization, and first-tag-wins scrapers then read
      // og:type "website" on articles. Drop any template tag that a Helmet
      // (data-rh) tag supersedes.
      await page.evaluate(() => {
        document.querySelectorAll("meta:not([data-rh])").forEach((tag) => {
          const key = tag.getAttribute("property") ?? tag.getAttribute("name");
          if (!key) return;
          const helmetDup = document.querySelector(
            `meta[data-rh][property="${key}"], meta[data-rh][name="${key}"]`,
          );
          if (helmetDup) tag.remove();
        });
      });
      const html = deferAppScript(await page.content());
      await page.close();

      const outPath =
        route === "/"
          ? join(distDir, "index.html")
          : join(distDir, route.replace(/^\//, ""), "index.html");
      await mkdir(dirname(outPath), { recursive: true });
      await writeFile(outPath, html, "utf-8");
      console.log(`[prerender] wrote ${outPath} (${((Date.now() - routeStart) / 1000).toFixed(1)}s)`);
    }
    console.log(`[prerender] ${ROUTES.length} routes in ${((Date.now() - started) / 1000).toFixed(0)}s`);
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
