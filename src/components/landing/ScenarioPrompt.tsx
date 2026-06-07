import { cn } from "@/lib/utils";

const PHRASES = [
  "Can I afford to hire two engineers in Q3?",
  "When do we run out if our biggest client churns?",
  "What happens with 5% monthly churn?",
  "What if we raise prices 15% in January?",
];

interface ScenarioPromptProps {
  className?: string;
  visible?: boolean;
}

export const ScenarioPrompt = ({ className, visible = true }: ScenarioPromptProps) => (
  <div
    className={cn(
      "inline-flex items-center gap-3 rounded-xl border px-4 py-3 font-mono text-sm max-w-full",
      // Forest terminal chip ("Forest holds the data"): stays dark on the
      // cream canvas so the rotating prompts read like a live console.
      "border-[hsl(var(--forest-border))] bg-[hsl(var(--forest))] text-[hsl(var(--forest-foreground))]",
      "transition-all duration-500",
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
      className,
    )}
    aria-label="Example scenario prompts that Zensus can answer"
  >
    <span className="text-[hsl(var(--sage-light))] font-semibold text-base">&gt;</span>
    {/* Fluid on small screens (the fixed 20rem floor used to push the chip
        past a 390px viewport and clip the prompt). Long prompts truncate
        with an ellipsis instead of running off-screen. */}
    <div className="relative h-5 overflow-hidden w-[min(27rem,calc(100vw-8rem))]">
      {PHRASES.map((phrase, i) => (
        <span
          key={phrase}
          className="absolute inset-0 truncate opacity-0"
          style={{
            animation: `scenario-rotate 20s infinite`,
            animationDelay: `${i * 5}s`,
            animationFillMode: "backwards",
          }}
        >
          {phrase}
        </span>
      ))}
    </div>
  </div>
);
