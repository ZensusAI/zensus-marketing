import { Upload, Eye, MessageCircle } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: Upload,
    title: "Connect or Upload",
    description: "Link QuickBooks or upload your cash flow spreadsheet",
  },
  {
    number: "2",
    icon: Eye,
    title: "See Your Runway",
    description: "Get instant visibility into your financial future",
  },
  {
    number: "3",
    icon: MessageCircle,
    title: "Ask Questions",
    description: "Explore scenarios with natural language queries",
  },
];

const HowItWorks = () => {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            How it <span className="text-gradient">works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes, not hours
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 text-center group"
            >
              {/* Step number badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                {step.number}
              </div>
              
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6 mt-2 group-hover:bg-primary/20 transition-colors">
                <step.icon size={28} className="text-primary" />
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
