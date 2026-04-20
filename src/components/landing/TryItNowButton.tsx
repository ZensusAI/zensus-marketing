import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShineBorder } from "@/components/ui/shine-border";
import { SIGN_IN_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface TryItNowButtonProps {
  className?: string;
}

export const TryItNowButton = ({ className }: TryItNowButtonProps) => (
  <ShineBorder
    shineColor={["hsl(42 55% 78%)", "hsl(48 85% 90%)"]}
    duration={3}
    borderRadius={9999}
    borderWidth={1}
    glow
    transparentInner
    className={className}
  >
    <Button
      asChild
      size="lg"
      className={cn(
        "group h-10 px-6 rounded-full bg-primary text-primary-foreground",
        "hover:bg-primary/90 font-semibold text-[15px]",
      )}
    >
      <a href={SIGN_IN_URL} target="_blank" rel="noopener noreferrer">
        Try it Now
        <ArrowRight
          size={16}
          className="ml-2 transition-transform group-hover:translate-x-1"
        />
      </a>
    </Button>
  </ShineBorder>
);
