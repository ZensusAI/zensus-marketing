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
      description: entry.body.join(" "),
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
        cssSelector: [`#${slug} h2`, `#${slug} li`],
      },
    };
  }),
});

interface ChangelogEntry {
  date: string;
  category: ChangelogCategory;
  title: string;
  body: string[];
}

const entries: ChangelogEntry[] = [
  {
    date: "2026-05-31",
    category: "New",
    title: "Sign in with Google from the homepage",
    body: [
      "One-tap Google sign-in on the homepage.",
      "Create or return to your account without filling out a form.",
    ],
  },
  {
    date: "2026-05-24",
    category: "Improved",
    title: "Support page and acknowledgment email",
    body: [
      "Support form at zensus.app/support, no login required.",
      "Instant confirmation email sent the moment you submit.",
    ],
  },
  {
    date: "2026-05-19",
    category: "New",
    title: "14-day free trial",
    body: [
      "Full access for 14 days before your card is charged.",
      "No feature limits during the trial period.",
    ],
  },
  {
    date: "2026-05-05",
    category: "New",
    title: "Runway empty state and sharper financial summaries",
    body: [
      "Runway shows a clear empty state before you connect any accounts.",
      "Revenue appears explicitly in breakdowns; summary rows include hover explanations.",
    ],
  },
  {
    date: "2026-05-02",
    category: "Improved",
    title: "Activity tab: next dates and cleaner vendor rows",
    body: [
      "Recurring rows show the expected next transaction date.",
      "Noisy vendor partitions collapse under a single expandable parent row.",
    ],
  },
  {
    date: "2026-04-19",
    category: "New",
    title: "Forecast categories and Financials overrides",
    body: [
      "Override any forecast line when reality differs from the model.",
      "Revert a single row or reset everything from the Financials tab.",
    ],
  },
  {
    date: "2026-04-17",
    category: "New",
    title: "Slack cash-crunch alerts",
    body: [
      "Set a dollar floor; Zensus fires a Slack alert when your 30-day projection crosses it.",
      "Re-alerts on a week-earlier breach or a 10% balance dip; snooze or adjust from Slack.",
    ],
  },
  {
    date: "2026-04-14",
    category: "Improved",
    title: "Scenario drill-down with dual projection",
    body: [
      "Scenarios render side by side with the baseline at month, week, or day granularity.",
      "Ask a question, see both numbers, decide.",
    ],
  },
  {
    date: "2026-04-10",
    category: "New",
    title: "Vendor normalization",
    body: [
      "Stripe payouts, ACH transfers, and card purchases reconcile cleanly.",
      "Internal transfers no longer appear as burn spikes.",
    ],
  },
  {
    date: "2026-04-03",
    category: "Improved",
    title: "Subscription-aware projections for HubSpot deals",
    body: [
      "Annual and quarterly contracts flow into projections on their real billing dates, not smeared as MRR.",
      "Runway forecast respects contract cadence.",
    ],
  },
  {
    date: "2026-04-01",
    category: "Improved",
    title: "Real-time webhook sync across Plaid, QuickBooks, HubSpot",
    body: [
      "Plaid, QuickBooks, and HubSpot sync on change, not a schedule.",
      "Runway recalculates the moment a transaction clears or an invoice changes.",
    ],
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
      <title>Zensus Changelog · Product Updates and New Features</title>
      <meta
        name="description"
        content="What we have shipped on Zensus, most recent first. Per-release posts on new features, improvements, fixes, and security work."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://zensus.app/changelog" />
      <meta property="og:site_name" content="Zensus" />
      <meta property="og:title" content="Zensus Changelog · Product Updates and New Features" />
      <meta
        property="og:description"
        content="What we have shipped on Zensus, most recent first."
      />
      <meta property="og:image" content="https://zensus.app/og/changelog.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Changelog page social preview card" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Zensus Changelog · Product Updates and New Features" />
      <meta
        name="twitter:description"
        content="What we have shipped on Zensus, most recent first."
      />
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
                  <ul className="space-y-1 list-disc list-inside text-muted-foreground leading-relaxed">
                    {entry.body.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
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
