import { Link2, Target, BarChart3, MessageCircle } from "lucide-react";
import runwayDashboard from "@/assets/runway-dashboard.png";
import runwayConnect from "@/assets/runway-connect.png";
import runwayZerocash from "@/assets/runway-zerocash.png";
import runwayDrilldown from "@/assets/runway-drilldown.png";
import runwayWhatif from "@/assets/runway-whatif.png";

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
  const content = (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
        {headline}{" "}
        <span className="text-gradient">{highlight}</span>
      </h2>
      <p className="text-lg text-muted-foreground mb-6">{description}</p>
      <ul className="space-y-3">
        {bullets.map((bullet, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2.5" />
            <span className="text-foreground">{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const imageEl = (
    <div className="relative rounded-2xl overflow-hidden border border-border bg-card">
      <img
        src={image}
        alt="Zensus dashboard"
        className="w-full h-auto"
      />
      <div className="absolute inset-0 bg-gradient-to-bl from-[hsl(var(--primary))]/5 via-transparent to-transparent pointer-events-none" />
    </div>
  );

  return (
    <section className="section-padding bg-background">
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
    headline: "Connect in",
    highlight: "60 seconds",
    description:
      "Link your bank via Plaid, QuickBooks, or HubSpot. Data refreshes automatically when stale, with manual sync across all sources.",
    bullets: [
      "Connect your bank account, QuickBooks, HubSpot, or all three",
      "Data refreshes automatically when stale — no manual work needed",
      "Manually sync all connected sources at any time",
    ],
    icon: <Link2 size={20} className="text-primary" />,
    image: runwayConnect,
  },
  {
    headline: "See your",
    highlight: "zero-cash date",
    description:
      "Know exactly which month you run out of cash — not a rough guess. Real-time runway calculation from your actual numbers.",
    bullets: [
      "Exact month-by-month runway based on real data",
      "Real-time recalculation as new transactions come in",
      "Clear visual timeline so you can plan ahead",
    ],
    icon: <Target size={20} className="text-primary" />,
    image: runwayZerocash,
  },
  {
    headline: "Drill down to",
    highlight: "any week or day",
    description:
      "Click any month to see weekly cash flow, then drill into daily details. Subscription-aware projections show when annual and quarterly contracts actually hit your bank.",
    bullets: [
      "Monthly → weekly → daily drill-down with a single click",
      "Subscription-aware projections for annual and quarterly contracts",
      "See when revenue actually hits your bank, not flat monthly estimates",
    ],
    icon: <BarChart3 size={20} className="text-primary" />,
    image: runwayDrilldown,
  },
  {
    headline: "Ask 'what if?' and",
    highlight: "get answers",
    description:
      "Have a conversation about your finances. Ask about hiring, churn, pricing changes, or subscription upgrades and see the projected impact instantly. Type or speak — Zensus has a built-in voice assistant.",
    bullets: [
      "\"Can I afford to hire two engineers next quarter?\"",
      "\"What if we lose our largest annual contract?\"",
      "\"What happens with 5% monthly churn?\"",
    ],
    icon: <MessageCircle size={20} className="text-primary" />,
    image: runwayWhatif,
  },
];

const RunwayFeature = () => {
  return (
    <>
      {sections.map((section, i) => (
        <RunwaySection key={i} {...section} imageRight={i % 2 === 0} />
      ))}
    </>
  );
};

export default RunwayFeature;
