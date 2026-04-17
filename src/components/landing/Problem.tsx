import { Clock, HelpCircle, AlertTriangle, TrendingDown } from "lucide-react";

const painPoints = [
  {
    icon: Clock,
    title: '"How many months do I have left?"',
    description: "You check your bank balance, do mental math, and still aren't sure",
  },
  {
    icon: HelpCircle,
    title: "Logging into 3 tools to get 1 answer",
    description: "Your bank, QuickBooks, and a spreadsheet that's always outdated",
  },
  {
    icon: AlertTriangle,
    title: '"Can I afford to hire?"',
    description: "No way to simulate decisions before committing real money",
  },
  {
    icon: TrendingDown,
    title: "Surprises at the end of the month",
    description: "Cash problems are obvious in hindsight but invisible in real-time",
  },
];

const Problem = () => {
  return (
    <section id="problem" className="section-padding bg-background">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            You're making million-dollar decisions on gut feeling
          </h2>
          <p className="text-lg text-muted-foreground">
            Most founders check their bank balance and hope for the best. That's not a financial strategy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {painPoints.map((point, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
                  <point.icon size={24} className="text-destructive" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{point.title}</h3>
                  <p className="text-muted-foreground">{point.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problem;