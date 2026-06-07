import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { START_TRIAL_URL } from "@/lib/constants";
import { trackCtaClick } from "@/lib/analytics/events";

const PricingPreview = () => (
  <section className="section-padding bg-background">
    <div className="section-container">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
          Start free for 14 days.
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Every integration, real-time cash flow intelligence, AI scenarios, and
          Slack alerts. Then $199 a month after your trial. Less than a single
          hour with a fractional CFO.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="rounded-full">
            <a
              href={START_TRIAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackCtaClick("pricing_preview", { destination: "trial" })
              }
            >
              Start 14-day free trial
              <ArrowRight size={18} className="ml-2" />
            </a>
          </Button>
          <Link
            to="/pricing"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            See what is included
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default PricingPreview;
