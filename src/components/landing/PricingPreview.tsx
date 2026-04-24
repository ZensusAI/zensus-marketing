import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SIGN_IN_URL } from "@/lib/constants";

const PricingPreview = () => (
  <section className="section-padding bg-background">
    <div className="section-container">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
          One plan. $199 a month.
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Every integration, real-time runway, AI scenarios, and Slack alerts.
          Billed monthly, cancel anytime. Less than a single hour with a
          fractional CFO.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="rounded-full">
            <a href={SIGN_IN_URL} target="_blank" rel="noopener noreferrer">
              Get Started
              <ArrowRight size={18} className="ml-2" />
            </a>
          </Button>
          <Link
            to="/pricing"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            See what is included
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default PricingPreview;
