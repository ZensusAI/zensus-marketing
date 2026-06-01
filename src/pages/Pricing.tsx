import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Check, Database, TrendingUp } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { TalkToUsButton } from "@/components/landing/TalkToUsButton";
import { START_TRIAL_URL } from "@/lib/constants";
import { trackCtaClick } from "@/lib/analytics/events";
import { breadcrumbSchema, HOME_CRUMB } from "@/lib/structured-data";

const breadcrumbs = breadcrumbSchema([
  HOME_CRUMB,
  { name: "Pricing", url: "https://zensus.app/pricing" },
]);

const dataFeatures = [
  "Bank account connection (Plaid)",
  "QuickBooks auto-sync",
  "HubSpot subscription sync",
];

const cashFlowFeatures = [
  "Real-time cash position with zero-cash-date forecast",
  "AI scenario modeling with chat history",
  "Slack alerts when your cash crosses a threshold you set",
  "Subscription-aware revenue projections",
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
    <div className="flex items-center gap-2 mb-2">
      <Icon size={16} className="text-primary" />
      <span className="text-sm font-semibold text-foreground">{title}</span>
    </div>
    <ul className="space-y-2">
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
      "Yes — 14 days, no charge today. We collect your card up front so the subscription continues automatically if Zensus is working for you, and you can cancel anytime before the trial ends with no charge.",
  },
];

const Pricing = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Zensus Pricing · $199/mo Cash Flow Forecasting for Founders</title>
      <meta
        name="description"
        content="Try Zensus Pro free for 14 days. Then $199/month. One plan with every integration, real-time cash flow intelligence, AI scenarios, and Slack alerts."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://zensus.app/pricing" />
      <meta property="og:site_name" content="Zensus" />
      <meta property="og:title" content="Zensus Pricing · $199/mo Cash Flow Forecasting for Founders" />
      <meta
        property="og:description"
        content="Try Zensus Pro free for 14 days. Then $199/month. One plan with every integration, real-time cash flow intelligence, AI scenarios, and Slack alerts."
      />
      <meta property="og:image" content="https://zensus.app/og/pricing.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Pricing page social preview card" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Zensus Pricing · $199/mo Cash Flow Forecasting for Founders" />
      <meta
        name="twitter:description"
        content="Try Zensus Pro free for 14 days. Then $199/month. One plan with every integration, real-time cash flow intelligence, AI scenarios, and Slack alerts."
      />
      <meta name="twitter:image" content="https://zensus.app/og/pricing.png" />
      <link rel="canonical" href="https://zensus.app/pricing" />
      <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>
    </Helmet>
    <Navbar />
    <main className="pt-24 pb-16">
      <section className="pt-6 pb-12">
        <div className="section-container">
          <div className="text-center max-w-xl mx-auto mb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-3">
              Start free. 14 days on us.
            </h1>
            <p className="text-sm text-muted-foreground">
              Every integration, real-time cash flow intelligence, and AI scenarios. 14-day free trial, then $199 a month. Cancel anytime.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="relative p-6 sm:p-7 rounded-3xl bg-card border border-primary/30 glow-sm">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-full bg-primary/10 border border-primary/25 text-xs font-semibold text-primary">
                  14-day free trial
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Zensus Pro
                </h2>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-foreground">$199</span>
                  <span className="text-lg text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground mt-2">
                  After your 14-day free trial. Cancel anytime.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Less than a single hour with a fractional CFO.
                </p>
              </div>

              <div className="space-y-3 mb-5">
                <FeatureGroup
                  icon={Database}
                  title="Data and integrations"
                  features={dataFeatures}
                />
                <FeatureGroup
                  icon={TrendingUp}
                  title="Cash flow intelligence"
                  features={cashFlowFeatures}
                />
              </div>

              <Button asChild className="w-full rounded-full" size="lg">
                <a
                  href={START_TRIAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackCtaClick("pricing_page", { destination: "trial" })
                  }
                >
                  Start 14-day free trial
                  <ArrowRight size={18} className="ml-2" />
                </a>
              </Button>

              <p className="text-center text-xs text-muted-foreground mt-3">
                No charge today. Cancel anytime before your trial ends.
              </p>

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
