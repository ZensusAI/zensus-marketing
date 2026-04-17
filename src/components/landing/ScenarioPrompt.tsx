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
      "inline-flex items-center gap-3 rounded-xl border px-4 py-3 font-mono text-sm",
      "border-primary/30 bg-[hsl(var(--surface-raised))] text-foreground",
      "transition-all duration-500",
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
      className,
    )}
    aria-label="Example scenario prompts that Zensus can answer"
  >
    <span className="text-primary font-semibold text-base">&gt;</span>
    <div className="relative flex-1 h-5 overflow-hidden min-w-[20rem] max-w-[36rem]">
      {PHRASES.map((phrase, i) => (
        <span
          key={phrase}
          className="absolute inset-0 whitespace-nowrap opacity-0"
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
