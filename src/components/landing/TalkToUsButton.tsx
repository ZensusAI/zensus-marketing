import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TALK_TO_US_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface TalkToUsButtonProps {
  size?: "sm" | "md" | "lg";
  /**
   * "outline" is the homepage redesign's secondary button (handoff
   * 00-overview): 52px, 1px rule border on card, 15px/600, green border on
   * hover. It ignores `size`.
   */
  variant?: "primary" | "ghost" | "outline";
  className?: string;
  showArrow?: boolean;
}

const sizeClasses = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6",
  lg: "h-12 px-8",
};

const OUTLINE =
  "group inline-flex h-[52px] items-center gap-2 rounded-full border border-border bg-card px-[30px] text-[15px] font-semibold text-foreground " +
  "transition-[transform,border-color] duration-300 ease-ui hover:-translate-y-px hover:border-primary/60 active:translate-y-0 motion-reduce:transform-none " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export const TalkToUsButton = ({
  size = "md",
  variant = "primary",
  className,
  showArrow = true,
}: TalkToUsButtonProps) => {
  if (variant === "outline") {
    return (
      <a href={TALK_TO_US_URL} target="_blank" rel="noopener noreferrer" className={cn(OUTLINE, className)}>
        Talk to us
        {showArrow && <ArrowRight size={16} aria-hidden />}
      </a>
    );
  }

  return (
    <Button
      asChild
      className={cn(
        "rounded-full font-semibold",
        variant === "primary"
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "bg-transparent hover:bg-primary/10 text-foreground",
        sizeClasses[size],
        className,
      )}
    >
      <a href={TALK_TO_US_URL} target="_blank" rel="noopener noreferrer">
        Talk to us
        {showArrow && <ArrowRight size={16} className="ml-2" />}
      </a>
    </Button>
  );
};
