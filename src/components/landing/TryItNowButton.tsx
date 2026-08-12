import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShineBorder } from "@/components/ui/shine-border";
import { SignupModal } from "./SignupModal";
import { cn } from "@/lib/utils";

interface TryItNowButtonProps {
  className?: string;
  size?: "md" | "lg";
}

export const TryItNowButton = ({ className, size = "md" }: TryItNowButtonProps) => (
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
        className={cn(
          "group rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-[15px] shadow-md transition-transform active:scale-[0.98]",
          size === "lg" ? "h-12 px-8" : "h-10 px-6",
        )}
      >
        Start free trial
        <ArrowRight
          size={16}
          className="ml-2 transition-transform group-hover:translate-x-1"
        />
      </Button>
    </SignupModal>
  </ShineBorder>
);
