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

interface Card {
  slug: string;
  name: string;
  blurb: string;
  logo: string;
}

const CARDS: Card[] = [
  {
    slug: "plaid",
    name: "Plaid",
    blurb: "Live bank transactions and balances through bank-level OAuth. Real-time sync, no CSVs.",
    logo: plaidLogo,
  },
  {
    slug: "quickbooks",
    name: "QuickBooks",
    blurb: "Expenses, invoices, and AR/AP straight from your books. Real-time sync via Intuit OAuth.",
    logo: quickbooksLogo,
  },
  {
    slug: "hubspot",
    name: "HubSpot",
    blurb: "Deals and subscriptions feed your runway. Annual and quarterly contracts hit on real dates.",
    logo: hubspotLogo,
  },
  {
    slug: "slack",
    name: "Slack",
    blurb: "Cash-crunch alerts, snooze, and threshold adjustments from Slack. No dashboard trip required.",
    logo: slackLogo,
  },
];

const CHIPS = [
  "Bank-level OAuth",
  "AES-256-GCM at rest",
  "Account-level isolation",
  "Credentials never stored",
];

const Integrations = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Integrations · Zensus</title>
      <meta
        name="description"
        content="Every number on Zensus comes from a live integration. Plaid, QuickBooks, HubSpot, Slack. No CSV uploads, no manual data entry."
      />
      <meta property="og:title" content="Integrations · Zensus" />
      <meta
        property="og:description"
        content="Live integrations to Plaid, QuickBooks, HubSpot, and Slack. No manual data entry."
      />
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
              <div className="flex items-center gap-3 mb-3">
                <img src={card.logo} alt="" width={36} height={36} />
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

        <div className="text-center">
          <TalkToUsButton size="lg" />
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Integrations;
