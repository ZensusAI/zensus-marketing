import * as React from "react";
import { cn } from "@/lib/utils";

interface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Width of the border in pixels
   * @default 1
   */
  borderWidth?: number;
  /**
   * Duration of the animation in seconds
   * @default 14
   */
  duration?: number;
  /**
   * Color(s) of the shine effect - can be a single color or array
   * @default "hsl(var(--primary))"
   */
  shineColor?: string | string[];
  /**
   * Border radius class name
   * @default "rounded-lg"
   */
  borderRadius?: string;
}

const ShineBorder = React.forwardRef<HTMLDivElement, ShineBorderProps>(
  (
    {
      borderWidth = 1,
      duration = 14,
      shineColor = "hsl(var(--primary))",
      borderRadius = "rounded-lg",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const colorString = Array.isArray(shineColor)
      ? shineColor.join(", ")
      : shineColor;

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex overflow-hidden p-[1px]",
          borderRadius,
          className
        )}
        style={
          {
            "--border-width": `${borderWidth}px`,
            "--duration": `${duration}s`,
            "--shine-color": colorString,
          } as React.CSSProperties
        }
        {...props}
      >
        {/* Animated gradient border */}
        <div
          className={cn(
            "absolute inset-0 animate-shine",
            borderRadius
          )}
          style={{
            background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, ${colorString} 60deg, transparent 120deg)`,
            backgroundSize: "200% 200%",
          }}
        />
        
        {/* Inner content container */}
        <div
          className={cn(
            "relative z-10 bg-background",
            borderRadius
          )}
        >
          {children}
        </div>
      </div>
    );
  }
);

ShineBorder.displayName = "ShineBorder";

export { ShineBorder };
