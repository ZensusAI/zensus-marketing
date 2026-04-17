import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Database, TrendingUp } from "lucide-react";

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

const PricingPreview = () => {
  return (
    <section className="section-padding bg-background">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to see your financial future clearly
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="relative p-8 rounded-2xl bg-card border border-primary/30 glow-sm">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">Zensus Pro</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-foreground">$199</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Less than a single hour with a fractional CFO
              </p>
            </div>

            <div className="space-y-5 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Database size={16} className="text-primary" />
                  <span className="text-sm font-semibold text-foreground">Data & Integrations</span>
                </div>
                <ul className="space-y-2">
                  {dataFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check size={14} className="text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={16} className="text-primary" />
                  <span className="text-sm font-semibold text-foreground">Runway & Forecasting</span>
                </div>
                <ul className="space-y-2">
                  {runwayFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check size={14} className="text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full" size="lg">
                <a href="https://app.zensus.app/login">
                  Get Started
                  <ArrowRight size={18} className="ml-2" />
                </a>
              </Button>
              <Button asChild variant="ghost" className="w-full" size="sm">
                <Link to="/#faq">
                  Have questions? Talk to us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPreview;
