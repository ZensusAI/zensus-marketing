import { Check, FileSpreadsheet } from "lucide-react";

const bullets = [
  "Upload Excel/CSV cash flow statements",
  "AI-powered scenario modeling",
  "Ask natural language questions",
  "8-week forward projections",
];

const ForecastFeature = () => {
  return (
    <section id="features" className="section-padding bg-secondary/30">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image/Visual - Left */}
          <div className="order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden border border-border bg-card p-8 aspect-[4/3] flex items-center justify-center">
              {/* Placeholder visual */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <FileSpreadsheet size={40} className="text-primary" />
                </div>
                <p className="text-muted-foreground text-sm">
                  Dashboard mockup coming soon
                </p>
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Content - Right */}
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Forecast:{" "}
              <span className="text-gradient">Scenario Planning Made Simple</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Upload your cash flow statement and explore unlimited what-if scenarios. 
              Ask questions like "What if revenue drops 20%?" and see instant projections.
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
        </div>
      </div>
    </section>
  );
};

export default ForecastFeature;
