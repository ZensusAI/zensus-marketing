import { BarChart3, MessageCircle, Bell } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import runwayDrilldown from "@/assets/runway-drilldown.png";
import runwayWhatif from "@/assets/runway-whatif.png";
import runwayAlerts from "@/assets/runway-alerts.png";

interface RunwaySectionProps {
  headline: string;
  highlight: string;
  description: string;
  bullets: string[];
  icon: React.ReactNode;
  image: string;
  imageRight: boolean;
}

const RunwaySection = ({ headline, highlight, description, bullets, icon, image, imageRight }: RunwaySectionProps) => {
  const { ref, isVisible } = useScrollAnimation(0.15);

  const contentAnimation = isVisible
    ? imageRight ? "animate-slide-in-left" : "animate-slide-in-right"
    : "opacity-0";

  const imageAnimation = isVisible
    ? imageRight ? "animate-slide-in-right" : "animate-slide-in-left"
    : "opacity-0";

  const content = (
    <div className={`animate-on-scroll ${contentAnimation}`}>
      <div className={`flex items-center gap-3 mb-4 ${isVisible ? "animate-scale-in" : "opacity-0"}`}>
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
        {headline} {highlight}
      </h2>
      <p className="text-lg text-muted-foreground mb-6">{description}</p>
      <ul className="space-y-3">
        {bullets.map((bullet, i) => (
          <li
            key={i}
            className={`flex items-start gap-3 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
            style={{ animationDelay: isVisible ? `${i * 100}ms` : "0ms" }}
          >
            <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2.5" />
            <span className="text-foreground">{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const imageEl = (
    <div className={`relative rounded-2xl overflow-hidden border border-border bg-card animate-on-scroll ${imageAnimation}`}>
      <img
        src={image}
        alt={`${headline} ${highlight}. Zensus cash flow forecasting.`}
        className="w-full h-auto"
        loading="lazy"
        width={800}
        height={500}
      />
      <div className="absolute inset-0 bg-gradient-to-bl from-[hsl(var(--primary))]/5 via-transparent to-transparent pointer-events-none" />
    </div>
  );

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {imageRight ? (
            <>{content}{imageEl}</>
          ) : (
            <>{imageEl}{content}</>
          )}
        </div>
      </div>
    </section>
  );
};

const sections: Omit<RunwaySectionProps, "imageRight">[] = [
  {
    headline: "Drill down to",
    highlight: "any week or day",
    description:
      "Click any month to see weekly cash flow, then drill into daily details. Subscription-aware projections show when annual and quarterly contracts actually hit your bank.",
    bullets: [
      "Monthly to weekly to daily drill-down with a single click",
      "Subscription-aware projections for annual and quarterly contracts",
      "See when revenue actually hits your bank, not flat monthly estimates",
    ],
    icon: <BarChart3 size={20} className="text-primary" />,
    image: runwayDrilldown,
  },
  {
    headline: "Run scenarios with",
    highlight: "your runway agent",
    description:
      "Layer hiring plans, churn assumptions, and pricing changes into multi-turn scenarios. Your agent recalculates runway in real time.",
    bullets: [
      "Stack multiple assumptions (hiring, churn, pricing) in a single conversation",
      "Watch your runway update live as each scenario layer is applied",
      "Compare before-and-after projections and revert any change instantly",
    ],
    icon: <MessageCircle size={20} className="text-primary" />,
    image: runwayWhatif,
  },
  {
    headline: "Get alerted",
    highlight: "before cash runs out",
    description:
      "Set your cash floor. Zensus watches your 30-day projection and pings Slack the moment it crosses the line. If the breach moves earlier or your minimum balance drops 10%, you get re-alerted.",
    bullets: [
      "Threshold-based Slack alerts from your projection, not your balance",
      "Re-alerts on material change (a week earlier or a 10% dip in minimum balance)",
      "Snooze or adjust your threshold from Slack in one click",
    ],
    icon: <Bell size={20} className="text-primary" />,
    image: runwayAlerts,
  },
];

const RunwayFeature = () => {
  return (
    <div id="features">
      {sections.map((section, i) => (
        <RunwaySection key={i} {...section} imageRight={i % 2 === 0} />
      ))}
    </div>
  );
};

export default RunwayFeature;
