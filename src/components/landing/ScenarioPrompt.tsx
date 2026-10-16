import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const PHRASES = [
  "Can I afford to hire two engineers in Q3?",
  "When do we run out if our biggest client churns?",
  "What happens with 5% monthly churn?",
  "What if we raise prices 15% in January?",
];

interface ScenarioPromptProps {
  className?: string;
}

// Rotating example questions. The chip is a link to the scenarios feature
// further down the page, with an arrow, so it reads as a pointer. Before
// this it was an unlabeled terminal line that looked like a text box and did
// nothing when clicked or typed into.
export const ScenarioPrompt = ({ className }: ScenarioPromptProps) => (
  <a
    href="#features-scenarios"
    className={cn(
      "group inline-flex items-center gap-3 rounded-xl border px-4 py-3 font-mono text-sm max-w-full",
      // Forest terminal chip ("Forest holds the data"): stays dark on the
      // cream canvas so the rotating prompts read like a live console.
      "border-[hsl(var(--forest-border))] bg-[hsl(var(--forest))] text-[hsl(var(--forest-foreground))]",
      "transition-colors hover:border-primary/60",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      className,
    )}
    aria-label="Example questions you can ask Zensus. Jump to the scenarios feature."
  >
    <span className="text-[hsl(var(--sage-light))] font-semibold text-base" aria-hidden>
      &gt;
    </span>
    {/* Fluid width on small screens. A phone gets two lines (every phrase
        fits in two) instead of the ellipsis that used to cut the question
        off mid-word at 390px. */}
    <div className="relative h-10 overflow-hidden leading-5 w-[min(27rem,calc(100vw-9.5rem))] sm:h-5">
      {PHRASES.map((phrase, i) => (
        <span
          key={phrase}
          className="absolute inset-0 opacity-0 sm:truncate"
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
    <ArrowRight
      size={14}
      className="shrink-0 text-[hsl(var(--sage-light))] transition-transform group-hover:translate-x-0.5"
      aria-hidden
    />
  </a>
);
