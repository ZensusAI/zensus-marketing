import { SITE_HOST, SITE_URL } from "@/lib/constants";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { CornerMark } from "@/components/landing/Backdrop";
import { BLOG_TOPICS, getAllPosts, topicPath } from "@/lib/blog";
import { breadcrumbSchema, HOME_CRUMB } from "@/lib/structured-data";
import sitemapXml from "../../public/sitemap.xml?raw";

const PAGE_URL = `${SITE_URL}/sitemap`;
const TITLE = "Sitemap · Every Page on Zensus";
const DESCRIPTION =
  `Every page on ${SITE_HOST} in one place: the product, pricing, integrations, free cash flow tools, comparisons, every guide on the blog, and the legal pages.`;

interface SitemapLink {
  href: string;
  label: string;
  meta?: string;
  blurb: string;
}

interface SitemapGroup {
  id: string;
  title: string;
  links: SitemapLink[];
}

type StaticGroupId = "product" | "integrations" | "tools" | "compare" | "company" | "legal";

/*
 * Which pages this page lists comes from public/sitemap.xml, which
 * scripts/generate-sitemap.mjs rebuilds before every production build from
 * the static routes, BLOG_TOPICS and src/content/blog/*.mdx. So a new post,
 * topic or route appears here on the next build with nothing to edit, and the
 * count in the opening line is the number of URLs crawlers are told about.
 *
 * Posts and topics take their names and one-liners from the blog loader.
 * Static routes take theirs from STATIC_PAGES below, which only supplies the
 * copy: a route missing from it is still listed, under "Other pages", with a
 * name made from its path. src/lib/route-coverage.test.ts fails if a route in
 * App.tsx has no entry here, so that fallback is a safety net, not the plan.
 */
const STATIC_PAGES: Record<string, { group: StaticGroupId; label: string; blurb: string }> = {
  "/": { group: "product", label: "Home", blurb: "Cash flow forecasting for businesses with unpredictable revenue." },
  "/pricing": { group: "product", label: "Pricing", blurb: "Zensus Pro at $199 a month after a 14-day free trial, and Zensus Custom." },
  "/use-cases": { group: "product", label: "Use cases", blurb: "Who uses Zensus: SaaS contracts, payroll, agencies, seasonal revenue, hiring." },
  "/quickbooks-cash-flow-forecasting": {
    group: "product",
    label: "QuickBooks cash flow forecasting",
    blurb: "What QuickBooks Cash Flow Planner does, and what Zensus adds on top of it.",
  },
  "/security": { group: "product", label: "Security", blurb: "What Zensus stores, what it never stores, and how your data is protected." },

  "/integrations": { group: "integrations", label: "All integrations", blurb: "Every number on Zensus comes from a live integration." },
  "/integrations/plaid": { group: "integrations", label: "Plaid", blurb: "Bank transactions and balances, read-only, synced by webhook." },
  "/integrations/quickbooks": { group: "integrations", label: "QuickBooks", blurb: "Invoices, bills and AR/AP from your books, synced daily." },
  "/integrations/hubspot": { group: "integrations", label: "HubSpot", blurb: "Invoices and subscriptions placed on the dates they pay." },
  "/integrations/slack": { group: "integrations", label: "Slack", blurb: "Alerts when your projected cash crosses a threshold you set." },

  "/tools/runway-calculator": { group: "tools", label: "Runway calculator", blurb: "Your runway and zero-cash date, with a new hire or an annual contract." },
  "/tools/payroll-calendar": { group: "tools", label: "Payroll calendar", blurb: "Every 2026 and 2027 pay date, pay period and three-paycheck month." },
  "/tools/13-week-cash-flow-template": {
    group: "tools",
    label: "13-week cash flow template",
    blurb: "A free 13-week cash flow forecast for Excel and Google Sheets, formulas included.",
  },

  "/compare/zensus-vs-float": { group: "compare", label: "Zensus vs Float", blurb: "Pricing, data sources and forecasting, side by side." },
  "/compare/zensus-vs-pulse": { group: "compare", label: "Zensus vs Pulse", blurb: "Pricing, QuickBooks sync, scenarios and automation, side by side." },
  "/compare/zensus-vs-cash-flow-frog": {
    group: "compare",
    label: "Zensus vs Cash Flow Frog",
    blurb: "Price by revenue tier, free trial, connections, scenarios and alerts.",
  },
  "/compare/float-alternatives": {
    group: "compare",
    label: "Float alternatives",
    blurb: "Cash Flow Frog, Pulse, Helm, Futrli and Zensus on price and data sources.",
  },

  "/about": { group: "company", label: "About", blurb: "Why we built Zensus, the team, and what we believe." },
  "/blog": { group: "company", label: "Blog", blurb: "Practical guides on cash flow forecasting and financial decisions." },
  "/support": { group: "company", label: "Support", blurb: "Common questions, and how to reach a person." },
  "/llm-info": { group: "company", label: "LLM info", blurb: "Facts about Zensus written for AI assistants and search engines." },
  "/sitemap": { group: "company", label: "Sitemap", blurb: "This page: every page on Zensus in one list." },

  "/privacy": { group: "legal", label: "Privacy Policy", blurb: "What personal data we collect and how we use it." },
  "/terms": { group: "legal", label: "Terms of Service", blurb: "The terms that govern your use of Zensus." },
  "/subprocessors": { group: "legal", label: "Subprocessors", blurb: "The third parties that process data on our behalf." },
};

/** Every <loc> in public/sitemap.xml as a site-relative path, in file order. */
function sitemapPaths(xml: string = sitemapXml): string[] {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => {
    const loc = m[1].trim();
    const path = loc.startsWith(SITE_URL) ? loc.slice(SITE_URL.length) : new URL(loc).pathname;
    return path === "" ? "/" : path;
  });
}

// "/tools/some-new-tool" -> "Some new tool", for a route with no copy yet.
const labelFromPath = (path: string) => {
  const last = path.split("/").filter(Boolean).at(-1) ?? "";
  const words = last.replace(/-/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
};

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

/** Every URL in the sitemap, sorted into the sections a visitor looks for. */
function buildGroups(paths: string[] = sitemapPaths()): SitemapGroup[] {
  const listed = new Set(paths);
  const staticIn = (group: StaticGroupId) =>
    Object.entries(STATIC_PAGES)
      .filter(([href, p]) => p.group === group && listed.has(href))
      .map(([href, p]) => ({ href, label: p.label, blurb: p.blurb }));

  const topicHrefs = new Set<string>(BLOG_TOPICS.map((t) => topicPath(t.id)));
  const topics = BLOG_TOPICS.filter((t) => listed.has(topicPath(t.id))).map((t) => ({
    href: topicPath(t.id),
    label: `${t.name} guides`,
    blurb: t.description,
  }));

  // Newest first, as getAllPosts returns them.
  const postHrefs = new Set<string>();
  const guides = getAllPosts()
    .filter((p) => listed.has(`/blog/${p.slug}`))
    .map((p) => {
      postHrefs.add(`/blog/${p.slug}`);
      return { href: `/blog/${p.slug}`, label: p.title, meta: formatDate(p.date), blurb: p.description };
    });

  // Anything in the sitemap that none of the sections above claimed.
  const other = paths
    .filter((p) => !STATIC_PAGES[p] && !topicHrefs.has(p) && !postHrefs.has(p))
    .map((href) => ({ href, label: labelFromPath(href), blurb: `${SITE_HOST}${href}` }));

  return [
    { id: "product", title: "Product", links: staticIn("product") },
    { id: "integrations", title: "Integrations", links: staticIn("integrations") },
    { id: "tools", title: "Free tools", links: staticIn("tools") },
    { id: "compare", title: "Compare", links: staticIn("compare") },
    { id: "topics", title: "Blog topics", links: topics },
    { id: "guides", title: "Guides", links: guides },
    { id: "company", title: "Company", links: staticIn("company") },
    { id: "legal", title: "Legal", links: staticIn("legal") },
    { id: "other", title: "Other pages", links: other },
  ].filter((g) => g.links.length > 0);
}

const GROUPS = buildGroups();
// Every section's rows added up, which is every URL in sitemap.xml.
const pageCount = GROUPS.reduce((n, g) => n + g.links.length, 0);

const breadcrumbs = breadcrumbSchema([HOME_CRUMB, { name: "Sitemap", url: PAGE_URL }]);

const collectionLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": PAGE_URL,
  url: PAGE_URL,
  name: TITLE,
  description: DESCRIPTION,
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: { "@id": `${SITE_URL}/#organization` },
};

const eyebrow = "font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground";
const focusRing =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

// One section: the group's name held beside its links from 820px (as on
// /about), the links as a ruled list of name plus one line on what is there.
function Group({ id, title, count, children }: { id: string; title: string; count: number; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`${id}-heading`} className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-12 min-[820px]:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] min-[820px]:gap-16 min-[820px]:px-16 min-[820px]:py-20">
        <div className="min-[820px]:sticky min-[820px]:top-28 min-[820px]:self-start">
          <h2 id={`${id}-heading`} className="scroll-mt-28 text-balance text-[24px] font-bold leading-[1.15] tracking-[-0.01em] text-foreground">
            {title}
          </h2>
          <p className="mt-2 font-mono text-xs tabular-nums text-muted-foreground">
            {count} {count === 1 ? "page" : "pages"}
          </p>
        </div>
        <ul className="divide-y divide-border border-y border-border">{children}</ul>
      </div>
    </section>
  );
}

function Row({ href, label, meta, blurb }: { href: string; label: string; meta?: string; blurb: string }) {
  return (
    <li>
      <Link to={href} className={`group grid gap-1 py-4 ${focusRing}`}>
        <span className="flex items-baseline justify-between gap-4">
          <span className="text-[15px] font-semibold text-foreground underline-offset-4 group-hover:underline">{label}</span>
          {meta && <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">{meta}</span>}
        </span>
        <span className="text-sm leading-[1.55] text-muted-foreground">{blurb}</span>
      </Link>
    </li>
  );
}

const Sitemap = () => (
  <div className="min-h-screen overflow-x-clip bg-background">
    <Helmet>
      <title>{TITLE}</title>
      <meta name="description" content={DESCRIPTION} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={PAGE_URL} />
      <meta property="og:site_name" content="Zensus" />
      <meta property="og:title" content={TITLE} />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:image" content={`${SITE_URL}/og/sitemap.png`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Zensus sitemap social preview card" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={TITLE} />
      <meta name="twitter:description" content={DESCRIPTION} />
      <meta name="twitter:image" content={`${SITE_URL}/og/sitemap.png`} />
      <link rel="canonical" href={PAGE_URL} />
      <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>
      <script type="application/ld+json">{JSON.stringify(collectionLd)}</script>
    </Helmet>
    <Navbar />

    <main>
      {/* Opening in the homepage hero's ruled column with its registration
          marks, as on /about. */}
      <div className="relative mx-auto max-w-6xl px-4 min-[820px]:px-6">
        <div className="relative border-x border-transparent px-1 pb-12 pt-32 text-center min-[820px]:border-border min-[820px]:px-10 min-[820px]:pb-16 min-[820px]:pt-40">
          <CornerMark className="-left-[6px] top-[4.5rem] hidden min-[820px]:block" />
          <CornerMark className="-right-[6px] top-[4.5rem] hidden min-[820px]:block" />
          <p className={eyebrow}>Sitemap</p>
          <h1 className="mx-auto mt-5 max-w-[16ch] text-balance text-[40px] font-bold leading-[1.05] tracking-[-0.02em] text-foreground min-[820px]:text-[48px]">
            Every page on Zensus
          </h1>
          <p className="mx-auto mt-6 max-w-[540px] text-pretty text-[17px] leading-[1.6] text-muted-foreground min-[820px]:mt-5 min-[820px]:text-[15px]">
            {pageCount} pages, from the product and pricing to every guide on the blog. Search engines can read the same
            list as{" "}
            <a href="/sitemap.xml" className={`font-medium text-foreground underline underline-offset-4 ${focusRing}`}>
              sitemap.xml
            </a>
            .
          </p>
          <nav aria-label="Sitemap sections" className="mt-8">
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
              {GROUPS.map((g) => (
                <li key={g.id}>
                  <a href={`#${g.id}-heading`} className={`text-muted-foreground transition-colors hover:text-foreground ${focusRing}`}>
                    {g.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {GROUPS.map((g) => (
        <Group key={g.id} id={g.id} title={g.title} count={g.links.length}>
          {g.links.map((l) => (
            <Row key={l.href} href={l.href} label={l.label} meta={l.meta} blurb={l.blurb} />
          ))}
        </Group>
      ))}
    </main>

    <Footer />
  </div>
);

export default Sitemap;
