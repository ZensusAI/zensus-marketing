import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShineBorder } from "@/components/ui/shine-border";
import { SignupModal } from "./SignupModal";
import { cn } from "@/lib/utils";
import { trackCtaClick, trackHeroTrialClick } from "@/lib/analytics/events";

interface TryItNowButtonProps {
  className?: string;
  size?: "md" | "lg";
  trackHeroConversion?: boolean;
  /**
   * Analytics location for placements other than the hero (for example
   * "pricing_preview"). Ignored when trackHeroConversion is set, which keeps
   * the hero's existing event name intact.
   */
  source?: string;
  /**
   * "shine" (default) keeps the animated border used across the site.
   * "solid" is the homepage redesign's primary button (handoff 00-overview):
   * 52px, 30px padding, 16px/600, a cream halo instead of the shine.
   */
  variant?: "shine" | "solid";
}

// Redesign primary button. The halo is the handoff's shadow exactly; the hover
// lift is 1px, off under reduced motion.
const SOLID =
  "group inline-flex h-[52px] items-center gap-2 rounded-full bg-primary px-[30px] text-base font-semibold text-primary-foreground " +
  "shadow-[0_0_0_1px_#EBD9A6,0_0_18px_rgba(235,217,166,.6),0_4px_6px_-1px_rgba(0,0,0,.1)] " +
  "transition-[transform,background-color] duration-300 ease-ui hover:-translate-y-px hover:bg-[hsl(150_70%_41%)] active:translate-y-0 motion-reduce:transform-none " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export const TryItNowButton = ({
  className,
  size = "md",
  trackHeroConversion = false,
  source,
  variant = "shine",
}: TryItNowButtonProps) => {
  const onClick = trackHeroConversion
    ? trackHeroTrialClick
    : source
      ? () =>
          trackCtaClick(source, {
            destination: "trial",
            action: "open_signup_modal",
          })
      : undefined;

  if (variant === "solid") {
    return (
      <SignupModal>
        <button type="button" onClick={onClick} className={cn(SOLID, className)}>
          Start
          <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" />
        </button>
      </SignupModal>
    );
  }

  return (
    <ShineBorder
      shineColor={["hsl(42 55% 78%)", "hsl(48 85% 90%)"]}
      duration={3}
      borderRadius={9999}
      borderWidth={1}
      glow
      transparentInner
      className={cn("inline-flex shrink-0", className)}
    >
      <SignupModal>
        <Button
          type="button"
          onClick={onClick}
          className={cn(
            "group rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-[15px] shadow-md transition-transform active:scale-[0.98]",
            size === "lg" ? "h-12 px-8" : "h-10 px-6",
          )}
        >
          Start
          <ArrowRight
            size={16}
            className="ml-2 transition-transform group-hover:translate-x-1"
          />
        </Button>
      </SignupModal>
    </ShineBorder>
  );
};
