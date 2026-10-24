import { SITE_HOST, SITE_URL } from "@/lib/constants";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { CornerMark } from "@/components/landing/Backdrop";
import { getAllPosts } from "@/lib/blog";
import { breadcrumbSchema, HOME_CRUMB } from "@/lib/structured-data";

const PAGE_URL = `${SITE_URL}/sitemap`;
const TITLE = "Sitemap · Every Page on Zensus";
const DESCRIPTION =
  `Every page on ${SITE_HOST} in one place: the product, pricing, integrations, free cash flow tools, comparisons, every guide on the blog, and the legal pages.`;

interface SitemapLink {
  href: string;
  label: string;
  blurb: string;
}

interface SitemapGroup {
  id: string;
  title: string;
  links: SitemapLink[];
}

/*
 * Every static route, grouped the way a visitor looks for it. Blog posts are
 * not listed here: they come from getAllPosts(), so a new post appears on its
 * own. src/lib/route-coverage.test.ts fails if a route in App.tsx is missing
 * from this list, so the page cannot fall behind the site.
 */
const GROUPS: SitemapGroup[] = [
  {
    id: "product",
    title: "Product",
    links: [
      { href: "/", label: "Home", blurb: "Cash flow forecasting for businesses with unpredictable revenue." },
      { href: "/pricing", label: "Pricing", blurb: "Zensus Pro at $199 a month after a 14-day free trial, and Zensus Custom." },
      { href: "/use-cases", label: "Use cases", blurb: "Who uses Zensus: SaaS contracts, payroll, agencies, seasonal revenue, hiring." },
      {
        href: "/quickbooks-cash-flow-forecasting",
        label: "QuickBooks cash flow forecasting",
        blurb: "What QuickBooks Cash Flow Planner does, and what Zensus adds on top of it.",
      },
      { href: "/security", label: "Security", blurb: "What Zensus stores, what it never stores, and how your data is protected." },
      { href: "/changelog", label: "Changelog", blurb: "What we have shipped, most recent first." },
    ],
  },
  {
    id: "integrations",
    title: "Integrations",
    links: [
      { href: "/integrations", label: "All integrations", blurb: "Every number on Zensus comes from a live integration." },
      { href: "/integrations/plaid", label: "Plaid", blurb: "Bank transactions and balances, read-only, synced by webhook." },
      { href: "/integrations/quickbooks", label: "QuickBooks", blurb: "Invoices, bills and AR/AP from your books, synced daily." },
      { href: "/integrations/hubspot", label: "HubSpot", blurb: "Invoices and subscriptions placed on the dates they pay." },
      { href: "/integrations/slack", label: "Slack", blurb: "Alerts when your projected cash crosses a threshold you set." },
    ],
  },
  {
    id: "tools",
    title: "Free tools",
    links: [
      { href: "/tools/runway-calculator", label: "Runway calculator", blurb: "Your runway and zero-cash date, with a new hire or an annual contract." },
      { href: "/tools/payroll-calendar", label: "Payroll calendar", blurb: "Every 2026 and 2027 pay date, pay period and three-paycheck month." },
      { href: "/tools/13-week-cash-flow-template", label: "13-week cash flow template", blurb: "A free 13-week cash flow forecast for Excel and Google Sheets, formulas included." },
    ],
  },
  {
    id: "compare",
    title: "Compare",
    links: [
      { href: "/compare/zensus-vs-float", label: "Zensus vs Float", blurb: "Pricing, data sources and forecasting, side by side." },
      { href: "/compare/zensus-vs-pulse", label: "Zensus vs Pulse", blurb: "Pricing, QuickBooks sync, scenarios and automation, side by side." },
      { href: "/compare/zensus-vs-cash-flow-frog", label: "Zensus vs Cash Flow Frog", blurb: "Price by revenue tier, free trial, connections, scenarios and alerts." },
      { href: "/compare/float-alternatives", label: "Float alternatives", blurb: "Cash Flow Frog, Pulse, Helm, Futrli and Zensus on price and data sources." },
    ],
  },
  {
    id: "company",
    title: "Company",
    links: [
      { href: "/about", label: "About", blurb: "Why we built Zensus, the team, and what we believe." },
      { href: "/blog", label: "Blog", blurb: "Practical guides on cash flow forecasting and financial decisions." },
      { href: "/support", label: "Support", blurb: "Common questions, and how to reach a person." },
      { href: "/llm-info", label: "LLM info", blurb: "Facts about Zensus written for AI assistants and search engines." },
    ],
  },
  {
    id: "legal",
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy", blurb: "What personal data we collect and how we use it." },
      { href: "/terms", label: "Terms of Service", blurb: "The terms that govern your use of Zensus." },
      { href: "/subprocessors", label: "Subprocessors", blurb: "The third parties that process data on our behalf." },
    ],
  },
];

const posts = getAllPosts();
const pageCount = GROUPS.reduce((n, g) => n + g.links.length, 0) + posts.length + 1;

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

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

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
              {[...GROUPS.slice(0, 4), { id: "guides", title: "Guides" }, ...GROUPS.slice(4)].map((g) => (
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

      {GROUPS.slice(0, 4).map((g) => (
        <Group key={g.id} id={g.id} title={g.title} count={g.links.length}>
          {g.links.map((l) => (
            <Row key={l.href} href={l.href} label={l.label} blurb={l.blurb} />
          ))}
        </Group>
      ))}

      <Group id="guides" title="Guides" count={posts.length}>
        {posts.map((p) => (
          <Row key={p.slug} href={`/blog/${p.slug}`} label={p.title} meta={formatDate(p.date)} blurb={p.description} />
        ))}
      </Group>

      {GROUPS.slice(4).map((g) => (
        <Group key={g.id} id={g.id} title={g.title} count={g.links.length}>
          {g.links.map((l) => (
            <Row key={l.href} href={l.href} label={l.label} blurb={l.blurb} />
          ))}
        </Group>
      ))}
    </main>

    <Footer />
  </div>
);

export default Sitemap;
