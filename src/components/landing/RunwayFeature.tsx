import { Check } from "lucide-react";
import quickbooksIntegration from "@/assets/quickbooks-integration.png";

const bullets = [
  "Connect in 60 seconds — Link your bank account, QuickBooks, or both",
  "Always up to date — Your revenue, expenses, and balances sync daily",
  "See your zero-cash date — Know exactly which month you run out, not a rough guess",
  "Ask \"what if?\" and get answers — Simulate hiring, cutting costs, or raising prices before you commit",
];

const RunwayFeature = () => {
  return (
    <section className="section-padding bg-background">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content - Left */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Know your exact runway —{" "}
              <span className="text-gradient">down to the month</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Connect your bank account or QuickBooks. Zensus pulls your real numbers and shows 
              exactly when cash runs out — and what to do about it.
            </p>
            <ul className="space-y-4">
              {bullets.map((bullet, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <Check size={14} className="text-primary" />
                  </div>
                  <span className="text-foreground">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Image/Visual - Right */}
          <div>
            <div className="relative rounded-2xl overflow-hidden border border-border bg-card">
              <img 
                src={quickbooksIntegration} 
                alt="Zensus QuickBooks Integration" 
                className="w-full h-auto"
              />
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-bl from-[#2CA01C]/5 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RunwayFeature;
