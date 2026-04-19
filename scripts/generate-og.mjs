// Generate a per-route Open Graph image by screenshotting a shared
// HTML template with route-specific query params. Runs as part of the
// production build before the prerender step so the generated
// /og/<slug>.png files land in dist/ and the prerendered HTML picks
// them up in og:image / twitter:image meta tags.
//
// Output: dist/og/<slug>.png (1200x630, social-card spec)

import { createServer } from "node:http";
import { readFile, mkdir, writeFile, copyFile } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = join(__dirname, "..");
const distDir = join(repoRoot, "dist");
const PORT = 4174;

// One entry per social-card variant. Slug is the filename stem used
// under dist/og/ and is what each page's Helmet block references.
const CARDS = [
  {
    slug: "home",
    category: "",
    title: "Cash flow forecasting for founders with variable revenue",
    subtitle:
      "Runway that matches the calendar. Connect your bank, QuickBooks, and HubSpot and see exactly when your cash runs out.",
    accent: "green",
  },
  {
    slug: "pricing",
    category: "Plans",
    title: "Plans priced to your stage",
    subtitle:
      "Talk to us for a quote that fits your team size, data volume, and the integrations you need.",
    accent: "green",
  },
  {
    slug: "blog",
    category: "Blog",
    title: "Notes on runway and variable revenue",
    subtitle:
      "Practical guides on cash flow forecasting, runway planning, and financial decisions for founders.",
    accent: "green",
  },
  {
    slug: "changelog",
    category: "Changelog",
    title: "What is shipping in Zensus",
    subtitle:
      "Release notes, what is in progress, and what is coming next.",
    accent: "green",
  },
  {
    slug: "security",
    category: "Security",
    title: "Security at Zensus",
    subtitle:
      "How we handle your financial data, encryption at rest and in transit, access controls, and audits.",
    accent: "green",
  },
  {
    slug: "integrations",
    category: "Integrations",
    title: "Connect the tools that run your business",
    subtitle:
      "Plaid for bank data, QuickBooks for accounting, HubSpot for pipeline, and Slack for alerts.",
    accent: "green",
  },
  {
    slug: "integrations-plaid",
    category: "Integration",
    title: "Plaid integration",
    subtitle:
      "Live bank balances and categorized transactions piped straight into your runway forecast.",
    accent: "plaid",
  },
  {
    slug: "integrations-quickbooks",
    category: "Integration",
    title: "QuickBooks integration",
    subtitle:
      "Sync accounts, invoices, bills, and vendors so your runway matches your books.",
    accent: "quickbooks",
  },
  {
    slug: "integrations-hubspot",
    category: "Integration",
    title: "HubSpot integration",
    subtitle:
      "Pipeline-weighted revenue projections so your forecast reflects the deals you are actually working.",
    accent: "hubspot",
  },
  {
    slug: "integrations-slack",
    category: "Integration",
    title: "Slack integration",
    subtitle:
      "Runway alerts, low-cash warnings, and daily digests delivered where your team already works.",
    accent: "slack",
  },
];

// Minimal static server for the repo root. The template lives at
// /scripts/og/template.html and loads the Zensus logo from
// /src/assets/zensus-logo.png, so we serve from the repo root.
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function startServer() {
  return new Promise((resolve, reject) => {
    const server = createServer(async (req, res) => {
      try {
        const urlPath = new URL(req.url, `http://localhost:${PORT}`).pathname;
        const filePath = join(repoRoot, urlPath);
        if (!filePath.startsWith(repoRoot)) {
          res.writeHead(403);
          res.end("forbidden");
          return;
        }
        const data = await readFile(filePath);
        res.writeHead(200, {
          "Content-Type": MIME[extname(urlPath)] || "application/octet-stream",
        });
        res.end(data);
      } catch {
        res.writeHead(404);
        res.end("not found");
      }
    });
    server.listen(PORT, (err) => (err ? reject(err) : resolve(server)));
  });
}

async function generate() {
  console.log(`[og] starting on http://localhost:${PORT}`);
  const server = await startServer();

  const localChrome =
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  const executablePath = process.env.VERCEL
    ? await chromium.executablePath()
    : localChrome;
  const browser = await puppeteer.launch({
    args: process.env.VERCEL
      ? chromium.args
      : ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: 1200, height: 630, deviceScaleFactor: 1 },
    executablePath,
    headless: true,
  });

  const outDir = join(distDir, "og");
  await mkdir(outDir, { recursive: true });

  try {
    for (const card of CARDS) {
      const qs = new URLSearchParams({
        title: card.title,
        subtitle: card.subtitle,
        category: card.category,
        accent: card.accent,
      }).toString();
      const url = `http://localhost:${PORT}/scripts/og/template.html?${qs}`;

      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
      await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
      // Let Geist finish painting even if networkidle fires early.
      await page.evaluateHandle("document.fonts.ready");
      await new Promise((r) => setTimeout(r, 150));

      const outPath = join(outDir, `${card.slug}.png`);
      await page.screenshot({
        path: outPath,
        type: "png",
        clip: { x: 0, y: 0, width: 1200, height: 630 },
      });
      await page.close();
      console.log(`[og] wrote ${outPath}`);
    }

    // Copy the home card to /og/default.png so any un-overridden
    // Helmet (e.g. future page that forgets to set og:image) still
    // gets a reasonable fallback.
    await copyFile(
      join(outDir, "home.png"),
      join(outDir, "default.png"),
    );
    console.log(`[og] wrote ${join(outDir, "default.png")}`);
  } finally {
    await browser.close();
    server.close();
  }

  console.log("[og] done");
}

generate().catch((err) => {
  console.error("[og] failed:", err);
  process.exit(1);
});
