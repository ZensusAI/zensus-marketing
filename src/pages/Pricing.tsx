import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Check, Database, TrendingUp } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { TalkToUsButton } from "@/components/landing/TalkToUsButton";

const dataFeatures = [
  "Bank account connection (Plaid)",
  "QuickBooks auto-sync",
  "HubSpot subscription sync",
  "Real-time webhook sync across all sources",
];

const runwayFeatures = [
  "Real-time runway calculation with zero-cash date",
  "Cash flow projections and burn rate tracking",
  "AI scenario modeling with persistent chat history",
  "Slack alerts when your runway crosses a threshold you set",
  "Expense categorization across 8 business categories",
  "Subscription-aware revenue projections",
  "Weekly and daily cash flow drill-down",
  "CSV export at monthly, weekly, or daily granularity",
];

const FeatureList = ({
  icon: Icon,
  title,
  features,
}: {
  icon: typeof Database;
  title: string;
  features: string[];
}) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <Icon size={16} className="text-primary" />
      <span className="text-sm font-semibold text-foreground">{title}</span>
    </div>
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {features.map((feature) => (
        <li key={feature} className="flex items-center gap-3">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
            <Check size={12} className="text-primary" />
          </div>
          <span className="text-foreground text-sm">{feature}</span>
        </li>
      ))}
    </ul>
  </div>
);

const Pricing = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Plans · Zensus</title>
      <meta
        name="description"
        content="Zensus pricing is tailored to your business size and data volume. Schedule a 20-minute call with the team to walk through what it looks like for you."
      />
      <meta property="og:title" content="Plans · Zensus" />
      <meta
        property="og:description"
        content="Zensus pricing is tailored to your business. Talk to us for a walkthrough."
      />
    </Helmet>
    <Navbar />
    <main className="pt-24 pb-16">
      <section className="section-padding">
        <div className="section-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Pricing is tailored to your business
            </h1>
            <p className="text-lg text-muted-foreground">
              Every Zensus account is configured around your data sources and
              your team shape. We will walk you through what it looks like for
              you on a 20-minute call.
            </p>
          </div>

          <div className="max-w-2xl mx-auto rounded-3xl border border-border bg-card p-8 sm:p-10 mb-10">
            <div className="space-y-8">
              <FeatureList
                icon={Database}
                title="Data and integrations"
                features={dataFeatures}
              />
              <FeatureList
                icon={TrendingUp}
                title="Runway and forecasting"
                features={runwayFeatures}
              />
            </div>
            <div className="mt-10 flex justify-center">
              <TalkToUsButton size="lg" />
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Have a specific question? Visit the{" "}
            <Link to="/#faq" className="text-primary hover:underline">
              homepage FAQ
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Pricing;
