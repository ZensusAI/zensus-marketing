import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

const allFeatures = [
  "Unlimited forecasts",
  "QuickBooks integration",
  "Runway calculations",
  "Conversational Q&A",
  "Data export",
  "Priority support",
  "8-week forward projections",
  "Unlimited what-if scenarios",
  "Bank-level encryption",
  "Automatic data sync",
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
                One plan with everything you need to understand and manage your business runway
              </p>
            </div>

            {/* Pricing Card */}
            <div className="max-w-lg mx-auto">
              <div className="relative p-10 rounded-3xl bg-card border border-primary/30 glow-sm">
                {/* Badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  7-day free trial
                </div>

                <div className="text-center mb-8 mt-2">
                  <h2 className="text-3xl font-bold text-foreground mb-4">Zensus Pro</h2>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-foreground">$199</span>
                    <span className="text-xl text-muted-foreground">/month</span>
                  </div>
                  <p className="text-muted-foreground mt-2">
                    Billed monthly • Cancel anytime
                  </p>
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  {allFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check size={12} className="text-primary" />
                      </div>
                      <span className="text-foreground text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button asChild className="w-full" size="lg">
                  <a href="https://app.zensus.app/login">
                    Start Your 7-Day Free Trial
                    <ArrowRight size={18} className="ml-2" />
                  </a>
                </Button>

                <p className="text-center text-xs text-muted-foreground mt-4">
                  No credit card required to start
                </p>
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
