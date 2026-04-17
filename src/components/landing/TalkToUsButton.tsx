import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TALK_TO_US_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface TalkToUsButtonProps {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "ghost";
  className?: string;
  showArrow?: boolean;
}

const sizeClasses = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6",
  lg: "h-12 px-8",
};

export const TalkToUsButton = ({
  size = "md",
  variant = "primary",
  className,
  showArrow = true,
}: TalkToUsButtonProps) => (
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
