// Regenerate public/sitemap.xml with static routes plus /blog/<slug> entries.
//
// lastmod policy: only blog URLs carry lastmod, sourced from each post's
// exported meta (dateModified, falling back to date). Static routes omit
// lastmod rather than stamping the build date; a lastmod that contradicts
// on-page dates teaches crawlers to distrust the field sitewide.

import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getBlogSlugs } from "./blog-slugs.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const blogDir = join(__dirname, "..", "src", "content", "blog");
const outPath = join(__dirname, "..", "public", "sitemap.xml");

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

// Pull date fields out of a post's `export const meta = {...}` block without
// evaluating MDX. Dates are plain ISO string literals in every post.
async function getPostLastmod(slug) {
  const source = await readFile(join(blogDir, `${slug}.mdx`), "utf-8");
  const field = (name) =>
    source.match(new RegExp(`${name}:\\s*['"](\\d{4}-\\d{2}-\\d{2})['"]`))?.[1];
  return field("dateModified") ?? field("date") ?? null;
}

function urlEntry({ loc, lastmod, changefreq, priority }) {
  const lastmodLine = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : "";
  return `  <url>
    <loc>${loc}</loc>${lastmodLine}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function generate() {
  const slugs = await getBlogSlugs();
  const blogUrls = await Promise.all(
    slugs.map(async (slug) => ({
      loc: `https://zensus.app/blog/${slug}`,
      lastmod: await getPostLastmod(slug),
      changefreq: "weekly",
      priority: "0.85",
    })),
  );

  // The blog index is as fresh as its newest post.
  const newestPost = blogUrls
    .map((u) => u.lastmod)
    .filter(Boolean)
    .sort()
    .at(-1);
  const urls = [...STATIC_URLS, ...blogUrls].map((url) =>
    url.loc === "https://zensus.app/blog" ? { ...url, lastmod: newestPost } : url,
  );

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
