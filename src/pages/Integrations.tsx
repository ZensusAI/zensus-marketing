import { SITE_URL } from "@/lib/constants";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { TalkToUsButton } from "@/components/landing/TalkToUsButton";
import plaidLogo from "@/assets/integrations/plaid.svg";
import quickbooksLogo from "@/assets/integrations/quickbooks.svg";
import hubspotLogo from "@/assets/integrations/hubspot.svg";
import slackLogo from "@/assets/integrations/slack.svg";
import { breadcrumbSchema, faqPageSchema, HOME_CRUMB } from "@/lib/structured-data";

const integrationsItemList = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Zensus integrations",
  numberOfItems: 4,
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Plaid", url: `${SITE_URL}/integrations/plaid` },
    { "@type": "ListItem", position: 2, name: "QuickBooks", url: `${SITE_URL}/integrations/quickbooks` },
    { "@type": "ListItem", position: 3, name: "HubSpot", url: `${SITE_URL}/integrations/hubspot` },
    { "@type": "ListItem", position: 4, name: "Slack", url: `${SITE_URL}/integrations/slack` },
  ],
};

const breadcrumbs = breadcrumbSchema([
  HOME_CRUMB,
  { name: "Integrations", url: `${SITE_URL}/integrations` },
]);

interface Card {
  slug: string;
  name: string;
  blurb: string;
  logo: string;
  logoClassName?: string;
}

const CARDS: Card[] = [
  {
    slug: "plaid",
    name: "Plaid",
    blurb: "Bank transactions and balances through Plaid, read-only. Synced by webhook, no CSVs.",
    logo: plaidLogo,
    // The Plaid mark is white; logo-on-light repaints it ink on cream.
    logoClassName: "logo-on-light",
  },
  {
    slug: "quickbooks",
    name: "QuickBooks",
    blurb: "Invoices, bills, and AR/AP straight from your books. Synced daily via Intuit OAuth.",
    logo: quickbooksLogo,
  },
  {
    slug: "hubspot",
    name: "HubSpot",
    blurb: "Invoices and subscriptions feed your cash flow forecast. Annual and quarterly contracts hit on real dates.",
    logo: hubspotLogo,
  },
  {
    slug: "slack",
    name: "Slack",
    blurb: "Cash-crunch alerts, snooze, and threshold adjustments from Slack. No dashboard trip required.",
    logo: slackLogo,
  },
];

/*
 * The questions people ask before connecting anything. Shown on the page and
 * emitted as FAQPage JSON-LD from this one list, so the markup only ever
 * quotes what a reader can see. Each answer stays within what the provider
 * pages already state (sync cadence, read-only access, disconnect behaviour).
 */
const FAQS = [
  {
    question: "Which tools does Zensus connect to?",
    answer:
      "Zensus connects to four tools: your bank through Plaid, QuickBooks Online, HubSpot and Slack. Plaid supplies bank transactions and balances, QuickBooks supplies invoices, bills, receivables and payables, HubSpot supplies invoices and subscriptions, and Slack receives cash alerts.",
  },
  {
    question: "Do I have to upload CSV files or spreadsheets?",
    answer:
      "No. Zensus reads your data through each tool's own sign-in (OAuth), so there is nothing to export or upload, and Zensus does not import spreadsheets or CSV files. You can export your forecast as a CSV.",
  },
  {
    question: "How often does Zensus update my data?",
    answer:
      "Plaid and HubSpot notify Zensus by webhook when something changes, with a daily sync as well. QuickBooks syncs once a day. Zensus also refreshes when you open the app if the data is more than an hour old, and you can sync by hand at any time.",
  },
  {
    question: "Does Zensus see my bank or account passwords?",
    answer:
      "No. You sign in on Plaid's, Intuit's, HubSpot's or Slack's own page, and Zensus receives an access token, never your password. Zensus never stores bank credentials, and every token is encrypted at rest with AES-256-GCM.",
  },
  {
    question: "Can Zensus move money or make payments?",
    answer:
      "No. The bank connection through Plaid is read-only: Zensus reads transactions and balances and has no way to start a payment or a transfer. Zensus uses each connection to read the data its cash flow forecast needs.",
  },
  {
    question: "What happens if I disconnect an integration?",
    answer:
      "Open Settings, then Integrations, in the Zensus app and disconnect it. Zensus revokes its access and deletes the stored tokens. Disconnecting the bank also deletes its synced transactions; QuickBooks and HubSpot data already synced is kept while your account is active, and you can ask for it to be deleted at any time.",
  },
];

const faqLd = faqPageSchema(FAQS);

const CHIPS = [
  "Bank-level OAuth",
  "AES-256-GCM at rest",
  "Account-level isolation",
  "Credentials never stored",
];

const Integrations = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Zensus Integrations · QuickBooks, Plaid, HubSpot, Slack</title>
      <meta
        name="description"
        content="Every number on Zensus comes from a live integration. Plaid, QuickBooks, HubSpot, Slack. No CSV uploads, no manual data entry."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${SITE_URL}/integrations`} />
      <meta property="og:site_name" content="Zensus" />
      <meta property="og:title" content="Zensus Integrations · QuickBooks, Plaid, HubSpot, Slack" />
      <meta
        property="og:description"
        content="Live integrations to Plaid, QuickBooks, HubSpot, and Slack. No manual data entry."
      />
      <meta property="og:image" content={`${SITE_URL}/og/integrations.png`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Integrations page social preview card" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Zensus Integrations · QuickBooks, Plaid, HubSpot, Slack" />
      <meta
        name="twitter:description"
        content="Live integrations to Plaid, QuickBooks, HubSpot, and Slack. No manual data entry."
      />
      <meta name="twitter:image" content={`${SITE_URL}/og/integrations.png`} />
      <link rel="canonical" href={`${SITE_URL}/integrations`} />
      <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>
      <script type="application/ld+json">{JSON.stringify(integrationsItemList)}</script>
      <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
    </Helmet>
    <Navbar />
    <main className="pt-24 pb-16">
      <div className="section-container max-w-4xl">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
          Every number on Zensus comes from a live integration
        </h1>
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
          No CSV uploads, no spreadsheets, no manual data entry. Every dollar
          you see on Zensus was pulled live through OAuth from the tools you
          already use.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {CARDS.map((card) => (
            <Link
              key={card.slug}
              to={`/integrations/${card.slug}`}
              className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3 h-9">
                <img src={card.logo} alt="" className={`h-8 w-auto ${card.logoClassName ?? ""}`} />
                <h2 className="text-lg font-semibold text-foreground">
                  {card.name}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {card.blurb}
              </p>
              <span className="inline-flex items-center gap-1 text-sm text-primary">
                Learn more
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 font-mono text-xs text-muted-foreground mb-12">
          {CHIPS.map((chip) => (
            <span key={chip} className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {chip}
            </span>
          ))}
        </div>

        <section aria-labelledby="integrations-faq-heading" className="mb-12 border-t border-border pt-10">
          <h2 id="integrations-faq-heading" className="text-xl font-semibold mb-6">
            Common questions
          </h2>
          <dl className="space-y-6">
            {FAQS.map((faq) => (
              <div key={faq.question}>
                <dt className="font-medium text-foreground mb-1">{faq.question}</dt>
                <dd className="text-muted-foreground leading-relaxed">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="text-center">
          <TalkToUsButton size="lg" />
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Integrations;
