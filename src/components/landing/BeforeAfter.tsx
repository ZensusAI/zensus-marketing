import { X, Check } from "lucide-react";

const BeforeAfter = () => {
  const beforeItems = [
    "Manual Excel forecasting every week",
    "Guessing if you can afford to hire",
    "Surprised when cash gets tight",
    "Stress about worst-case scenarios",
  ];

  const afterItems = [
    "AI-powered forecasting in seconds",
    "Decision insights for hiring & distributions",
    "Early warning for cash pressure",
    "Three scenarios: optimistic, expected, pessimistic",
  ];

  return (
    <section className="section-padding bg-secondary/30">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Introducing <span className="text-gradient">Zensus</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Before Card */}
          <div className="p-8 rounded-2xl bg-card border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                <X size={20} className="text-destructive" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Without Zensus</h3>
            </div>
            <ul className="space-y-4">
              {beforeItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <X size={18} className="text-destructive mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* After Card */}
          <div className="p-8 rounded-2xl bg-card border border-primary/30 glow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Check size={20} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">With Zensus</h3>
            </div>
            <ul className="space-y-4">
              {afterItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check size={18} className="text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;