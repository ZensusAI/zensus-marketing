// Generate a per-route Open Graph image by screenshotting a shared
// HTML template with route-specific query params. Runs as part of the
// production build before the prerender step so the generated
// /og/<slug>.png files land in dist/ and the prerendered HTML picks
// them up in og:image / twitter:image meta tags.
//
// Output: dist/og/<slug>.png (1200x630, social-card spec)

import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { readFile, readdir, mkdir, copyFile } from "node:fs/promises";
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
    category: "Pricing",
    title: "Zensus Pro, $199 a month",
    subtitle:
      "One plan. Every integration. Real-time runway, AI scenarios, Slack alerts. Billed monthly, cancel anytime.",
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
    slug: "use-cases",
    category: "Use Cases",
    title: "Who uses Zensus",
    subtitle:
      "Founders with annual contracts, seasonal revenue, usage-based pricing, and payroll on the line.",
    accent: "green",
  },
  {
    slug: "about",
    category: "About",
    title: "About Zensus",
    subtitle:
      "Cash flow forecasting for founders with variable revenue. Built because too many startups fail from missed cash flow, not missed missions.",
    accent: "green",
  },
  {
    slug: "privacy",
    category: "Privacy",
    title: "Privacy Policy",
    subtitle:
      "How Zensus collects, uses, and protects your information. Bank credentials stay with Plaid, never with us, and your data never trains an AI model.",
    accent: "green",
  },
  {
    slug: "terms",
    category: "Terms",
    title: "Terms of Service",
    subtitle:
      "Subscription terms, acceptable use, intellectual property, and account responsibilities for the Zensus platform.",
    accent: "green",
  },
  {
    slug: "subprocessors",
    category: "Subprocessors",
    title: "Subprocessors",
    subtitle:
      "The third-party services Zensus uses to process customer data. Updated whenever we add or remove a subprocessor.",
    accent: "green",
  },
  {
    slug: "support",
    category: "Support",
    title: "Support",
    subtitle:
      "Get help with your account, integrations, or billing. Reach the team through the contact form or email hello@zensus.app.",
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
  {
    slug: "austin",
    category: "Austin",
    title: "Zensus Austin",
    subtitle:
      "Cash flow forecasting for Austin founders with variable revenue and real billing-date runway visibility.",
    accent: "green",
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

/** Read a single-quoted meta string (supports line breaks after the colon). */
function readMetaString(text, field) {
  const match = text.match(
    new RegExp(`${field}:\\s*(?:\\n\\s*)?['"]([^'"]+)['"]`),
  );
  return match?.[1]?.trim();
}

/** @returns {Promise<Array<{ slug: string, category: string, title: string, subtitle: string, accent: string, nested?: string }>>} */
export async function loadBlogCards() {
  const blogDir = join(repoRoot, "src", "content", "blog");
  const files = await readdir(blogDir);
  const cards = [];
  for (const file of files.filter((f) => f.endsWith(".mdx"))) {
    const text = await readFile(join(blogDir, file), "utf-8");
    const slug = file.replace(/\.mdx$/, "");
    const pageTitle = readMetaString(text, "title");
    const description = readMetaString(text, "description");
    const ogTitle = readMetaString(text, "ogTitle");
    const ogSubtitle = readMetaString(text, "ogSubtitle");
    const category = readMetaString(text, "category") ?? "Blog";
    if (!pageTitle || !description) {
      console.warn(`[og] skipping ${file}: missing title or description in meta`);
      continue;
    }
    cards.push({
      slug,
      category,
      title: ogTitle || pageTitle,
      subtitle: ogSubtitle || description,
      accent: "green",
      nested: "blog",
    });
  }
  return cards;
}

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

async function resolveChromePath() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  if (process.env.VERCEL) {
    return await chromium.executablePath();
  }
  if (process.platform === "win32") {
    const candidates = [
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      join(
        process.env.LOCALAPPDATA || "",
        "Google",
        "Chrome",
        "Application",
        "chrome.exe",
      ),
    ];
    for (const candidate of candidates) {
      if (candidate && existsSync(candidate)) return candidate;
    }
  }
  return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
}

async function generate() {
  const blogOnly = process.argv.includes("--blog-only");
  console.log(
    `[og] starting on http://localhost:${PORT}${blogOnly ? " (blog posts only)" : ""}`,
  );
  const server = await startServer();

  const executablePath = await resolveChromePath();
  const browser = await puppeteer.launch({
    args: process.env.VERCEL
      ? chromium.args
      : ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: 1200, height: 630, deviceScaleFactor: 1 },
    executablePath,
    headless: true,
  });

  const outDir = join(distDir, "og");
  const publicOgDir = join(repoRoot, "public", "og", "blog");
  await mkdir(outDir, { recursive: true });
  await mkdir(publicOgDir, { recursive: true });

  const blogCards = await loadBlogCards();
  const allCards = blogOnly ? blogCards : [...CARDS, ...blogCards];

  try {
    for (const card of allCards) {
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

      const distPath = card.nested
        ? join(outDir, card.nested, `${card.slug}.png`)
        : join(outDir, `${card.slug}.png`);
      const publicPath = card.nested
        ? join(publicOgDir, `${card.slug}.png`)
        : null;

      if (card.nested) {
        await mkdir(join(outDir, card.nested), { recursive: true });
      }

      const screenshotTarget = publicPath ?? distPath;
      await page.screenshot({
        path: screenshotTarget,
        type: "png",
        clip: { x: 0, y: 0, width: 1200, height: 630 },
      });

      if (publicPath && publicPath !== distPath) {
        await mkdir(dirname(distPath), { recursive: true });
        await copyFile(publicPath, distPath);
        console.log(`[og] wrote ${publicPath}`);
      } else {
        console.log(`[og] wrote ${distPath}`);
      }

      await page.close();
    }

    if (!blogOnly) {
      // Copy the home card to /og/default.png so any un-overridden
      // Helmet (e.g. future page that forgets to set og:image) still
      // gets a reasonable fallback.
      await copyFile(join(outDir, "home.png"), join(outDir, "default.png"));
      console.log(`[og] wrote ${join(outDir, "default.png")}`);
    }
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
