import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

const features = [
  "Unlimited forecasts",
  "QuickBooks integration",
  "Runway calculations",
  "Conversational Q&A",
];

const PricingPreview = () => {
  return (
    <section className="section-padding bg-background">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Simple, <span className="text-gradient">transparent pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            One plan with everything you need to manage your runway
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="relative p-8 rounded-2xl bg-card border border-primary/30 glow-sm">
            {/* Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              7-day free trial
            </div>

            <div className="text-center mb-6 mt-2">
              <h3 className="text-2xl font-bold text-foreground mb-2">Zensus Pro</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-foreground">$199</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check size={18} className="text-primary flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-3">
              <Button asChild className="w-full" size="lg">
                <a href="https://app.zensus.app/login">
                  Start Free Trial
                  <ArrowRight size={18} className="ml-2" />
                </a>
              </Button>
              <Button asChild variant="ghost" className="w-full" size="sm">
                <Link to="/pricing">
                  View full pricing details
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
