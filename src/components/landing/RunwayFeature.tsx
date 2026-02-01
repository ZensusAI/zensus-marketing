import { Check, Link2 } from "lucide-react";

const bullets = [
  "One-click QuickBooks connection",
  "Automatic data sync",
  "Real-time runway calculation",
  "Conversational Q&A about your finances",
];

const RunwayFeature = () => {
  return (
    <section className="section-padding bg-background">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content - Left */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Runway:{" "}
              <span className="text-gradient">Your QuickBooks Financial Copilot</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Connect QuickBooks in one click. We pull your financial data automatically 
              and calculate your runway. Then ask questions to see how decisions impact your future.
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
            <div className="relative rounded-2xl overflow-hidden border border-border bg-card p-8 aspect-[4/3] flex items-center justify-center">
              {/* Placeholder visual */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-[#2CA01C]/10 flex items-center justify-center mx-auto mb-4">
                  <Link2 size={40} className="text-[#2CA01C]" />
                </div>
                <p className="text-muted-foreground text-sm">
                  QuickBooks integration mockup coming soon
                </p>
              </div>
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
