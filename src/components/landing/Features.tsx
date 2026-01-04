import { Shield, TrendingUp, Lightbulb, Check } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Enterprise-Grade Data Sovereignty",
    description: "Your data stays yours. Always.",
    bullets: [
      "All AI processing within your AWS account (Bedrock)",
      "Your data never leaves your infrastructure",
      "No third-party API data sharing",
    ],
  },
  {
    icon: TrendingUp,
    title: "Cash Flow Forecasting",
    description: "See your financial future with clarity.",
    bullets: [
      "AI-generated financial projections",
      "Scenario modeling",
      "Runway calculations for startups",
    ],
  },
  {
    icon: Lightbulb,
    title: "Decision Insights",
    description: "Make confident business decisions.",
    bullets: [
      "Know when you can afford to hire",
      "Distribution timing recommendations",
      "Early warning for cash pressure",
    ],
  },
];

const Features = () => {
  return (
    <section id="features" className="section-padding bg-secondary/30">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Introducing <span className="text-gradient">Zensus</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enterprise-grade cash flow intelligence for modern finance teams
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 hover:glow-sm transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <feature.icon size={28} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground mb-4">{feature.description}</p>
              <ul className="space-y-3">
                {feature.bullets.map((bullet, bulletIndex) => (
                  <li key={bulletIndex} className="flex items-start gap-3">
                    <Check
                      size={18}
                      className="text-primary mt-0.5 flex-shrink-0"
                    />
                    <span className="text-muted-foreground text-sm leading-relaxed">
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
