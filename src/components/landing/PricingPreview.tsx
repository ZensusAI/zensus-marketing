import { Link } from "react-router-dom";
import { TryItNowButton } from "./TryItNowButton";

const PricingPreview = () => (
  <section className="section-padding bg-background">
    <div className="section-container">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
          Start free for 14 days.
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Every integration, real-time cash flow intelligence, scenario
          modeling, and Slack alerts, all included in Zensus Pro: $199/mo
          after your trial. Less than a single hour with a fractional CFO.
        </p>
        {/* Same label and same sign-up path as the hero. This button used to
            read "Start 14-day free trial" and skip the sign-up dialog, so the
            page offered one action under three names and two routes. */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <TryItNowButton size="lg" source="pricing_preview" />
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
