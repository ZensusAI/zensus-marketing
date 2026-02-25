import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Database, TrendingUp } from "lucide-react";

const dataFeatures = [
  "Bank account connection (Plaid)",
  "QuickBooks auto-sync",
  "CSV/Excel upload for forecasting",
  "Daily automatic data refresh",
];

const runwayFeatures = [
  "Real-time runway calculation with zero-cash date",
  "Cash flow projections and burn rate tracking",
  "AI-powered what-if scenario modeling",
  "Expense categorization across 7 business categories",
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        {/* Hero */}
        <section className="section-padding">
          <div className="section-container">
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Simple, <span className="text-gradient">transparent pricing</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to see your financial future clearly
              </p>
            </div>

            {/* Pricing Card */}
            <div className="max-w-lg mx-auto">
              <div className="relative p-10 rounded-3xl bg-card border border-primary/30 glow-sm">
                <div className="text-center mb-8 mt-2">
                  <h2 className="text-3xl font-bold text-foreground mb-4">Zensus Pro</h2>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-foreground">$199</span>
                    <span className="text-xl text-muted-foreground">/month</span>
                  </div>
                  <p className="text-muted-foreground mt-2">
                    Billed monthly • Cancel anytime
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Less than a single hour with a fractional CFO
                  </p>
                </div>

                <div className="space-y-6 mb-10">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Database size={16} className="text-primary" />
                      <span className="text-sm font-semibold text-foreground">Data & Integrations</span>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {dataFeatures.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                            <Check size={12} className="text-primary" />
                          </div>
                          <span className="text-foreground text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp size={16} className="text-primary" />
                      <span className="text-sm font-semibold text-foreground">Runway & Forecasting</span>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {runwayFeatures.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                            <Check size={12} className="text-primary" />
                          </div>
                          <span className="text-foreground text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Button asChild className="w-full" size="lg">
                  <a href="https://app.zensus.app/login">
                    Get Started
                    <ArrowRight size={18} className="ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-padding bg-secondary/30">
          <div className="section-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Pricing <span className="text-gradient">questions</span>
              </h2>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-semibold text-foreground mb-2">
                  What happens after my free trial?
                </h3>
                <p className="text-muted-foreground">
                  After 7 days, you'll be charged $199/month. You can cancel anytime before the trial ends 
                  and you won't be charged.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-semibold text-foreground mb-2">
                  Do you offer annual billing?
                </h3>
                <p className="text-muted-foreground">
                  Not yet, but we're working on it. For now, all plans are billed monthly with 
                  no long-term commitment required.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-semibold text-foreground mb-2">
                  Can I cancel anytime?
                </h3>
                <p className="text-muted-foreground">
                  Yes! There are no contracts or cancellation fees. You can cancel your subscription 
                  at any time from your account settings.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Button asChild variant="outline" size="lg">
                <Link to="/#faq">
                  View all FAQs
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
