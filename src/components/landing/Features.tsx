import { TrendingUp, FileSpreadsheet, Users, AlertCircle } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Three-Scenario Forecasts",
    description: "Get optimistic, expected, and pessimistic projections for your cash flow over the next 8 weeks.",
  },
  {
    icon: FileSpreadsheet,
    title: "AI Data Extraction",
    description: "Upload your Excel or CSV files. Our AI extracts and structures your financial data automatically.",
  },
  {
    icon: Users,
    title: "Decision Insights",
    description: "Know exactly when you can hire, take distributions, or need to pause spending.",
  },
  {
    icon: AlertCircle,
    title: "Early Warning System",
    description: "Get alerted before cash pressure hits. Never be surprised by a tight week again.",
  },
];

const Features = () => {
  return (
    <section id="features" className="section-padding bg-background">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            What changes when everything{" "}
            <span className="text-gradient">lives in one place?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stop juggling spreadsheets. Start making decisions with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 hover:glow-sm transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <feature.icon size={28} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;