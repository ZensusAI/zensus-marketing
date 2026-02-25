import { Link, BarChart3, SlidersHorizontal, Mic } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: Link,
    title: "Connect your data",
    description: "Link your bank account via Plaid, connect QuickBooks, or both. One click, no spreadsheets needed.",
  },
  {
    number: "2",
    icon: BarChart3,
    title: "See your runway instantly",
    description: "Get your exact months of runway, zero-cash date, and net burn rate — calculated from your real numbers.",
  },
  {
    number: "3",
    icon: SlidersHorizontal,
    title: "Simulate before you spend",
    description: 'Ask "What if I hire 2 people?" or "What if I cut marketing by 30%?" and see the impact on your runway in seconds.',
  },
  {
    number: "4",
    icon: Mic,
    title: "Talk to your finances",
    description: "Ask questions by voice or text. Zensus explains your cash flow, flags risks, and suggests next moves.",
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
            From sign-up to runway number in under 2 minutes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
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
