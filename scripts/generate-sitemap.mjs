// Regenerate public/sitemap.xml with static routes plus /blog/<slug> entries.

import { writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getBlogSlugs } from "./blog-slugs.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "..", "public", "sitemap.xml");

const today = new Date().toISOString().slice(0, 10);

const STATIC_URLS = [
  { loc: "https://zensus.app/", changefreq: "weekly", priority: "1.0" },
  { loc: "https://zensus.app/pricing", changefreq: "monthly", priority: "0.8" },
  { loc: "https://zensus.app/blog", changefreq: "weekly", priority: "0.6" },
  { loc: "https://zensus.app/changelog", changefreq: "weekly", priority: "0.7" },
  { loc: "https://zensus.app/security", changefreq: "monthly", priority: "0.7" },
  { loc: "https://zensus.app/use-cases", changefreq: "monthly", priority: "0.7" },
  { loc: "https://zensus.app/about", changefreq: "monthly", priority: "0.6" },
  { loc: "https://zensus.app/privacy", changefreq: "yearly", priority: "0.3" },
  { loc: "https://zensus.app/terms", changefreq: "yearly", priority: "0.3" },
  { loc: "https://zensus.app/subprocessors", changefreq: "monthly", priority: "0.4" },
  { loc: "https://zensus.app/support", changefreq: "monthly", priority: "0.5" },
  { loc: "https://zensus.app/integrations", changefreq: "monthly", priority: "0.8" },
  { loc: "https://zensus.app/integrations/plaid", changefreq: "monthly", priority: "0.7" },
  { loc: "https://zensus.app/integrations/quickbooks", changefreq: "monthly", priority: "0.7" },
  { loc: "https://zensus.app/integrations/hubspot", changefreq: "monthly", priority: "0.7" },
  { loc: "https://zensus.app/integrations/slack", changefreq: "monthly", priority: "0.7" },
];

function urlEntry({ loc, changefreq, priority }) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function generate() {
  const slugs = await getBlogSlugs();
  const blogUrls = slugs.map((slug) => ({
    loc: `https://zensus.app/blog/${slug}`,
    changefreq: "weekly",
    priority: "0.85",
  }));

  const urls = [...STATIC_URLS, ...blogUrls];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(urlEntry).join("\n")}
</urlset>
`;

  await writeFile(outPath, xml, "utf-8");
  console.log(`[sitemap] wrote ${outPath} (${urls.length} URLs, ${slugs.length} blog posts)`);
}

generate().catch((err) => {
  console.error("[sitemap] failed:", err);
  process.exit(1);
});
