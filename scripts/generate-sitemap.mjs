// Regenerate public/sitemap.xml with static routes plus /blog/<slug> entries.
//
// lastmod policy: never the build date. A lastmod that contradicts on-page
// dates teaches crawlers to distrust the field sitewide. Blog URLs take it from
// each post's exported meta (dateModified, falling back to date). Static routes
// take the date of the last commit that touched the files that make up the page
// (its `sources`), so a footer or navbar edit does not re-date every page. When
// history is unusable (a shallow clone makes every file look touched by the
// newest commit), the value already committed in public/sitemap.xml is kept
// instead. Regenerate locally and commit the result.

import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getBlogSlugs } from "./blog-slugs.mjs";
import { SITE_URL } from "./site.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const blogDir = join(__dirname, "..", "src", "content", "blog");
const outPath = join(__dirname, "..", "public", "sitemap.xml");

const repoRoot = join(__dirname, "..");

// Date (YYYY-MM-DD) of the newest commit touching `sources`, or null when the
// history cannot be trusted: not a repo, a shallow clone, or no commits for the paths.
function lastCommitDate(sources) {
  try {
    const run = (args) =>
      execFileSync("git", args, { cwd: repoRoot, encoding: "utf-8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    if (run(["rev-parse", "--is-shallow-repository"]) !== "false") return null;
    return run(["log", "-1", "--format=%cs", "--", ...sources]) || null;
  } catch {
    return null;
  }
}

// lastmod values from the sitemap already on disk, keyed by loc.
async function readCommittedLastmods() {
  try {
    const xml = await readFile(outPath, "utf-8");
    const map = new Map();
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)) map.set(m[1], m[2]);
    return map;
  } catch {
    return new Map();
  }
}

const STATIC_URLS = [
  { loc: `${SITE_URL}/`, sources: ["src/pages/Index.tsx", "src/components/landing", ":(exclude)src/components/landing/Footer.tsx", ":(exclude)src/components/landing/Navbar.tsx", ":(exclude)src/components/landing/SignupModal.tsx"], changefreq: "weekly", priority: "1.0" },
  { loc: `${SITE_URL}/pricing`, sources: ["src/pages/Pricing.tsx"], changefreq: "monthly", priority: "0.8" },
  { loc: `${SITE_URL}/blog`, changefreq: "weekly", priority: "0.6" },
  { loc: `${SITE_URL}/changelog`, sources: ["src/pages/Changelog.tsx"], changefreq: "weekly", priority: "0.7" },
  { loc: `${SITE_URL}/security`, sources: ["src/pages/Security.tsx"], changefreq: "monthly", priority: "0.7" },
  { loc: `${SITE_URL}/use-cases`, sources: ["src/pages/UseCases.tsx"], changefreq: "monthly", priority: "0.7" },
  { loc: `${SITE_URL}/tools/runway-calculator`, sources: ["src/pages/tools/RunwayCalculator.tsx"], changefreq: "monthly", priority: "0.8" },
  { loc: `${SITE_URL}/tools/payroll-calendar`, sources: ["src/pages/tools/PayrollCalendar.tsx"], changefreq: "monthly", priority: "0.8" },
  { loc: `${SITE_URL}/tools/13-week-cash-flow-template`, sources: ["src/pages/tools/ThirteenWeekTemplate.tsx"], changefreq: "monthly", priority: "0.8" },
  { loc: `${SITE_URL}/compare/zensus-vs-float`, sources: ["src/pages/compare/ZensusVsFloat.tsx", "src/lib/compare-pages.ts"], changefreq: "monthly", priority: "0.7" },
  { loc: `${SITE_URL}/compare/zensus-vs-pulse`, sources: ["src/pages/compare/ZensusVsPulse.tsx", "src/lib/compare-pages.ts"], changefreq: "monthly", priority: "0.7" },
  { loc: `${SITE_URL}/compare/float-alternatives`, sources: ["src/pages/compare/FloatAlternatives.tsx", "src/lib/compare-pages.ts"], changefreq: "monthly", priority: "0.7" },
  { loc: `${SITE_URL}/compare/zensus-vs-cash-flow-frog`, sources: ["src/pages/compare/ZensusVsCashFlowFrog.tsx", "src/lib/compare-pages.ts"], changefreq: "monthly", priority: "0.7" },
  { loc: `${SITE_URL}/quickbooks-cash-flow-forecasting`, sources: ["src/pages/QuickBooksForecasting.tsx"], changefreq: "monthly", priority: "0.8" },
  { loc: `${SITE_URL}/llm-info`, sources: ["src/pages/LlmInfo.tsx"], changefreq: "monthly", priority: "0.6" },
  { loc: `${SITE_URL}/sitemap`, sources: ["src/pages/Sitemap.tsx"], changefreq: "weekly", priority: "0.4" },
  { loc: `${SITE_URL}/about`, sources: ["src/pages/About.tsx"], changefreq: "monthly", priority: "0.6" },
  { loc: `${SITE_URL}/privacy`, sources: ["src/pages/Privacy.tsx"], changefreq: "yearly", priority: "0.3" },
  { loc: `${SITE_URL}/terms`, sources: ["src/pages/Terms.tsx"], changefreq: "yearly", priority: "0.3" },
  { loc: `${SITE_URL}/subprocessors`, sources: ["src/pages/Subprocessors.tsx"], changefreq: "monthly", priority: "0.4" },
  { loc: `${SITE_URL}/support`, sources: ["src/pages/Support.tsx"], changefreq: "monthly", priority: "0.5" },
  { loc: `${SITE_URL}/integrations`, sources: ["src/pages/Integrations.tsx"], changefreq: "monthly", priority: "0.8" },
  { loc: `${SITE_URL}/integrations/plaid`, sources: ["src/pages/integrations/Plaid.tsx"], changefreq: "monthly", priority: "0.7" },
  { loc: `${SITE_URL}/integrations/quickbooks`, sources: ["src/pages/integrations/QuickBooks.tsx"], changefreq: "monthly", priority: "0.7" },
  { loc: `${SITE_URL}/integrations/hubspot`, sources: ["src/pages/integrations/HubSpot.tsx"], changefreq: "monthly", priority: "0.7" },
  { loc: `${SITE_URL}/integrations/slack`, sources: ["src/pages/integrations/Slack.tsx"], changefreq: "monthly", priority: "0.7" },
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
  const committed = await readCommittedLastmods();
  const blogUrls = await Promise.all(
    slugs.map(async (slug) => ({
      loc: `${SITE_URL}/blog/${slug}`,
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
  const staticUrls = STATIC_URLS.map(({ sources, ...url }) => ({
    ...url,
    lastmod: sources ? (lastCommitDate(sources) ?? committed.get(url.loc) ?? null) : null,
  }));
  const urls = [...staticUrls, ...blogUrls].map((url) =>
    url.loc === `${SITE_URL}/blog` ? { ...url, lastmod: newestPost } : url,
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
