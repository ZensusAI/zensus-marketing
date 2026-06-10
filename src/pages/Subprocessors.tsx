import { Helmet } from "react-helmet-async";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { TalkToUsButton } from "@/components/landing/TalkToUsButton";
import { breadcrumbSchema, HOME_CRUMB } from "@/lib/structured-data";

const PAGE_URL = "https://zensus.app/subprocessors";
const PAGE_DESCRIPTION =
  "The third-party services Zensus uses to process customer data. Updated whenever we add or remove a subprocessor.";

const breadcrumbs = breadcrumbSchema([
  HOME_CRUMB,
  { name: "Subprocessors", url: PAGE_URL },
]);

type Subprocessor = {
  name: string;
  country: string;
  purpose: string;
  dataCategories: string;
};

type Category = {
  title: string;
  vendors: Subprocessor[];
};

const CATEGORIES: Category[] = [
  {
    title: "Cloud infrastructure and hosting",
    vendors: [
      {
        name: "Amazon Web Services",
        country: "United States",
        purpose:
          "Primary application infrastructure: managed database, object storage, transactional email, log aggregation, and edge hosting for the product app.",
        dataCategories:
          "All customer data classes (encrypted in transit and at rest).",
      },
      {
        name: "Vercel",
        country: "United States",
        purpose: "Hosting for the public marketing site at zensus.app.",
        dataCategories:
          "HTTPS request logs, build artifacts. No customer account data.",
      },
    ],
  },
  {
    title: "Identity and authentication",
    vendors: [
      {
        name: "Supabase",
        country: "United States",
        purpose: "Identity provider for sign-in, sessions, and account recovery.",
        dataCategories:
          "Email address, hashed password, session tokens.",
      },
      {
        name: "Google (Sign-In)",
        country: "United States",
        purpose: "Optional Google OAuth sign-in.",
        dataCategories:
          "Email, name, Google sub identifier (only if you choose Google sign-in).",
      },
      {
        name: "Apple (Sign in with Apple)",
        country: "United States",
        purpose: "Optional Apple OAuth sign-in.",
        dataCategories:
          "Email or relay address, Apple sub identifier (only if you choose Apple sign-in).",
      },
    ],
  },
  {
    title: "Financial data and integrations",
    vendors: [
      {
        name: "Plaid",
        country: "United States",
        purpose:
          "Bank account linking and read-only access to transactions and balances.",
        dataCategories:
          "Account metadata, balances, transactions. Your bank login is held by Plaid and never reaches Zensus.",
      },
      {
        name: "Intuit (QuickBooks Online)",
        country: "United States",
        purpose:
          "Read-only sync of accounting data: purchases, bills, payments, invoices, P&L, balance sheet.",
        dataCategories:
          "OAuth tokens, accounting object data (only if you connect QuickBooks).",
      },
      {
        name: "HubSpot",
        country: "United States",
        purpose:
          "Read-only sync of CRM data and subscription tracking for accounts-receivable forecasting.",
        dataCategories:
          "OAuth tokens, contacts, companies, line items, invoices, subscriptions, admin email (only if you connect HubSpot).",
      },
      {
        name: "Stripe",
        country: "United States",
        purpose: "Subscription billing and payment processing for Zensus itself.",
        dataCategories:
          "Stripe customer ID, billing email, subscription metadata. Card details are handled directly by Stripe and never reach Zensus.",
      },
    ],
  },
  {
    title: "Communications",
    vendors: [
      {
        name: "Slack",
        country: "United States",
        purpose:
          "Delivery of cash-flow alerts to a customer-selected Slack channel; processing of in-Slack actions (snooze, threshold adjust).",
        dataCategories:
          "Workspace metadata, channel IDs, alert message contents, interactivity payloads (only if you connect Slack).",
      },
    ],
  },
  {
    title: "AI and machine learning",
    vendors: [
      {
        name: "Amazon Web Services (Bedrock)",
        country: "United States",
        purpose:
          "Hosted inference for the AI features used to generate scenarios, categorize transactions, and power the conversational assistants. In this configuration, Anthropic (the maker of the Claude models) does not access the data we send to Bedrock.",
        dataCategories:
          "User prompts, conversation history, financial context (cash, MRR, expense breakdown, billing timeline), sanitized transaction descriptors.",
      },
      {
        name: "OpenAI",
        country: "United States",
        purpose: "Speech-to-text transcription for the voice assistant.",
        dataCategories: "Voice audio submitted to the voice agent.",
      },
      {
        name: "Hugging Face",
        country: "United States",
        purpose:
          "Emotion detection on audio-derived text snippets for adaptive voice output.",
        dataCategories: "Short text snippets derived from voice audio.",
      },
    ],
  },
  {
    title: "Security and abuse prevention",
    vendors: [
      {
        name: "ipapi.co",
        country: "United States",
        purpose:
          "VPN and proxy detection on integration connect, as a fraud signal.",
        dataCategories:
          "End-user IP address at the moment of integration connect.",
      },
    ],
  },
  {
    title: "Web fonts and embedded content",
    vendors: [
      {
        name: "Google Maps",
        country: "United States",
        purpose:
          "Embedded city-level map of Austin, TX shown in the marketing-site footer.",
        dataCategories:
          "Visitor IP and user-agent (transmitted to Google when the embedded map loads).",
      },
    ],
  },
  {
    title: "Analytics and marketing intelligence",
    vendors: [
      {
        name: "Apollo.io",
        country: "United States",
        purpose:
          "Marketing-site visitor identification for outbound sales. Apollo matches visitor IP addresses against its database of company IPs and reports which businesses are browsing our site.",
        dataCategories:
          "Visitor IP, user-agent, pageview events.",
      },
      {
        name: "Vercel (Web Analytics and Speed Insights)",
        country: "United States",
        purpose:
          "First-party, cookieless marketing-site performance metrics.",
        dataCategories:
          "Aggregated page-load timings and route-level traffic counts. No persistent identifiers.",
      },
    ],
  },
  {
    title: "Bot and abuse protection",
    vendors: [
      {
        name: "Cloudflare (Turnstile)",
        country: "United States",
        purpose:
          "Invisible bot and abuse protection on the marketing-site support form (zensus.app/support), so the contact and acknowledgment flow cannot be used to send spam.",
        dataCategories:
          "Visitor IP, user-agent, and a verification token (transmitted to Cloudflare when the support form is submitted).",
      },
    ],
  },
];

const Subprocessors = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Subprocessors · Third-Party Services Zensus Uses</title>
      <meta name="description" content={PAGE_DESCRIPTION} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={PAGE_URL} />
      <meta property="og:site_name" content="Zensus" />
      <meta property="og:title" content="Subprocessors · Third-Party Services Zensus Uses" />
      <meta property="og:description" content={PAGE_DESCRIPTION} />
      <meta property="og:image" content="https://zensus.app/og/subprocessors.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Zensus Subprocessors social preview card" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Subprocessors · Third-Party Services Zensus Uses" />
      <meta name="twitter:description" content={PAGE_DESCRIPTION} />
      <meta name="twitter:image" content="https://zensus.app/og/subprocessors.png" />
      <link rel="canonical" href={PAGE_URL} />
      <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>
    </Helmet>
    <Navbar />
    <main className="pt-24 pb-16">
      <div className="section-container max-w-3xl">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
          Subprocessors
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Last updated: June 10, 2026
        </p>
        <p className="text-lg text-muted-foreground mb-12">
          Zensus uses trusted third-party services to operate our platform.
          This page lists every external provider that processes data on
          our behalf, grouped by the role they play.
        </p>

        {CATEGORIES.map((category) => (
          <section key={category.title} className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              {category.title}
            </h2>
            <div className="space-y-5">
              {category.vendors.map((vendor) => (
                <div
                  key={vendor.name}
                  className="rounded-lg border border-border bg-muted/30 p-5"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                    <h3 className="text-base font-semibold text-foreground">
                      {vendor.name}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {vendor.country}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    {vendor.purpose}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground/80">
                      Data shared:
                    </span>{" "}
                    {vendor.dataCategories}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-foreground">
            How we manage subprocessor changes
          </h2>
          <div className="text-muted-foreground leading-relaxed space-y-3">
            <p>
              We update this page whenever we add, remove, or materially
              change a subprocessor. For changes that affect customer data,
              we aim to give reasonable advance notice (typically 30 days)
              through our changelog and, where appropriate, by email to
              account administrators.
            </p>
            <p>
              All subprocessors are bound by data-processing terms with us
              that meet the requirements of applicable privacy regulations
              including GDPR Article 28 where it applies. We rely on the
              EU-US Data Privacy Framework, the UK Extension to the DPF,
              the UK International Data Transfer Addendum, and Standard
              Contractual Clauses for cross-border transfers as needed.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-foreground">
            Questions
          </h2>
          <div className="text-muted-foreground leading-relaxed space-y-3">
            <p>
              For questions about this list or any subprocessor, email{" "}
              <a
                href="mailto:support@zensus.app"
                className="text-primary hover:underline"
              >
                support@zensus.app
              </a>
              .
            </p>
          </div>
        </section>

        <div className="mt-12 text-center">
          <TalkToUsButton size="lg" />
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Subprocessors;
