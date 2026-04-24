import { Helmet } from "react-helmet-async";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { cn } from "@/lib/utils";
import { breadcrumbSchema, HOME_CRUMB } from "@/lib/structured-data";

const breadcrumbs = breadcrumbSchema([
  HOME_CRUMB,
  { name: "Changelog", url: "https://zensus.app/changelog" },
]);

type ChangelogCategory = "New" | "Improved" | "Fixed" | "Security";

const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const changelogGraph = (items: ChangelogEntry[]) => ({
  "@context": "https://schema.org",
  "@graph": items.map((entry) => {
    const slug = slugify(entry.title);
    return {
      "@type": "Article",
      headline: entry.title,
      description: entry.body,
      datePublished: entry.date,
      dateModified: entry.date,
      articleSection: entry.category,
      url: `https://zensus.app/changelog#${slug}`,
      mainEntityOfPage: "https://zensus.app/changelog",
      author: { "@id": "https://zensus.app/#organization" },
      publisher: { "@id": "https://zensus.app/#organization" },
      inLanguage: "en-US",
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: [`#${slug} h2`, `#${slug} p`],
      },
    };
  }),
});

interface ChangelogEntry {
  date: string;
  category: ChangelogCategory;
  title: string;
  body: string;
}

const entries: ChangelogEntry[] = [
  {
    date: "2026-04-17",
    category: "New",
    title: "Slack cash-crunch alerts",
    body: "Set a dollar floor and Zensus fires a Slack alert the moment your 30-day projection crosses it. Re-alerts on material change: a week earlier breach or a 10% dip in minimum balance. Snooze or adjust your threshold directly from Slack.",
  },
  {
    date: "2026-04-14",
    category: "Improved",
    title: "Scenario drill-down with dual projection",
    body: "Scenarios now render side by side with the baseline at day level. Ask a question, see both numbers, decide. Works at month, week, and day granularity with stable scenario identity across levels.",
  },
  {
    date: "2026-04-10",
    category: "New",
    title: "Vendor normalization",
    body: "Stripe payouts, ACH transfers, and card purchases reconcile cleanly. Same-day internal transfers no longer show up as fake burn spikes. Your expense categories are meaningfully accurate now.",
  },
  {
    date: "2026-04-07",
    category: "Security",
    title: "External synthetic monitoring on api.zensus.app",
    body: "Route 53 health checks run against the API every minute from outside our infrastructure. If the API goes down, we get paged in Slack within one cycle. Built into the platform, no action required from you.",
  },
  {
    date: "2026-04-03",
    category: "Improved",
    title: "Subscription-aware projections for HubSpot deals",
    body: "Annual and quarterly contracts in HubSpot now flow into projections on their real billing dates, not smeared into monthly MRR. Your runway forecast respects contract cadence.",
  },
  {
    date: "2026-04-01",
    category: "Improved",
    title: "Real-time webhook sync across Plaid, QuickBooks, HubSpot",
    body: "When a transaction clears in Plaid, an invoice changes in QuickBooks, or a subscription updates in HubSpot, your runway recalculates. No more waiting for scheduled refreshes.",
  },
];

const CATEGORY_STYLES: Record<ChangelogCategory, string> = {
  New: "bg-primary/10 text-primary",
  Improved: "bg-muted text-muted-foreground",
  Fixed: "bg-[hsl(var(--caution))]/10 text-[hsl(var(--caution))]",
  Security: "bg-destructive/10 text-destructive",
};

const formatDate = (iso: string) => iso.replace(/-/g, " ");

const Changelog = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Changelog · Zensus</title>
      <meta
        name="description"
        content="What we have shipped on Zensus, most recent first. Per-release posts on new features, improvements, fixes, and security work."
      />
      <meta property="og:title" content="Changelog · Zensus" />
      <meta
        property="og:description"
        content="What we have shipped on Zensus, most recent first."
      />
      <meta property="og:image" content="https://zensus.app/og/changelog.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:image" content="https://zensus.app/og/changelog.png" />
      <link rel="canonical" href="https://zensus.app/changelog" />
      <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>
      <script type="application/ld+json">
        {JSON.stringify(changelogGraph(entries))}
      </script>
    </Helmet>
    <Navbar />
    <main className="pt-24 pb-16">
      <div className="section-container max-w-3xl">
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Changelog
          </h1>
          <p className="text-lg text-muted-foreground">
            What we have shipped, most recent first.
          </p>
        </header>

        <ol className="space-y-10 list-none p-0">
          {entries.map((entry) => (
            <li key={entry.date + entry.title} id={slugify(entry.title)}>
              <article className="grid grid-cols-1 sm:grid-cols-[8rem,1fr] gap-4 sm:gap-8">
                <time
                  dateTime={entry.date}
                  className="font-mono text-sm text-muted-foreground tabular-nums"
                >
                  {formatDate(entry.date)}
                </time>
                <div>
                  <span
                    className={cn(
                      "inline-block px-2 py-0.5 rounded-full text-xs font-mono uppercase tracking-wider mb-2",
                      CATEGORY_STYLES[entry.category],
                    )}
                  >
                    {entry.category}
                  </span>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    {entry.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {entry.body}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </main>
    <Footer />
  </div>
);

export default Changelog;
