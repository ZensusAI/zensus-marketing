import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Check, Database, TrendingUp } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { TalkToUsButton } from "@/components/landing/TalkToUsButton";
import { SIGN_IN_URL } from "@/lib/constants";
import { breadcrumbSchema, HOME_CRUMB } from "@/lib/structured-data";

const breadcrumbs = breadcrumbSchema([
  HOME_CRUMB,
  { name: "Pricing", url: "https://zensus.app/pricing" },
]);

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

const FeatureGroup = ({
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

const pricingFaqs = [
  {
    question: "Do you offer annual billing?",
    answer:
      "Not yet. We are working on it. Every plan is billed monthly right now with no long-term commitment.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. No contracts, no cancellation fees. You can cancel from your account settings any time and you will not be billed again.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Not currently. You can sign up, connect your data, and cancel the same day if Zensus is not the right fit.",
  },
];

const Pricing = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Pricing · Zensus</title>
      <meta
        name="description"
        content="Zensus Pro is $199/month. Billed monthly, cancel anytime. One plan with every integration, real-time runway, AI scenarios, and Slack alerts."
      />
      <meta property="og:title" content="Pricing · Zensus" />
      <meta
        property="og:description"
        content="Zensus Pro is $199/month. One plan with every integration, real-time runway, AI scenarios, and Slack alerts."
      />
      <meta property="og:image" content="https://zensus.app/og/pricing.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:image" content="https://zensus.app/og/pricing.png" />
      <link rel="canonical" href="https://zensus.app/pricing" />
      <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>
    </Helmet>
    <Navbar />
    <main className="pt-24 pb-16">
      <section className="section-padding">
        <div className="section-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-lg text-muted-foreground">
              Everything you need to see your financial future clearly.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="relative p-8 sm:p-10 rounded-3xl bg-card border border-primary/30 glow-sm">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-3">
                  Zensus Pro
                </h2>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-foreground">$199</span>
                  <span className="text-xl text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground mt-2">
                  Billed monthly. Cancel anytime.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Less than a single hour with a fractional CFO.
                </p>
              </div>

              <div className="space-y-6 mb-10">
                <FeatureGroup
                  icon={Database}
                  title="Data and integrations"
                  features={dataFeatures}
                />
                <FeatureGroup
                  icon={TrendingUp}
                  title="Runway and forecasting"
                  features={runwayFeatures}
                />
              </div>

              <Button asChild className="w-full rounded-full" size="lg">
                <a
                  href={SIGN_IN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Started
                  <ArrowRight size={18} className="ml-2" />
                </a>
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-4">
                Prefer a walkthrough first?{" "}
                <a
                  href="https://calendly.com/hello-zensus/introcall"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Talk to us
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-secondary/30">
        <div className="section-container">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Pricing questions
            </h2>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            {pricingFaqs.map((faq) => (
              <div
                key={faq.question}
                className="p-6 rounded-2xl bg-card border border-border"
              >
                <h3 className="font-semibold text-foreground mb-2">
                  {faq.question}
                </h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <TalkToUsButton size="lg" />
            <Link
              to="/#faq"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              More questions? Visit the homepage FAQ.
            </Link>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Pricing;
