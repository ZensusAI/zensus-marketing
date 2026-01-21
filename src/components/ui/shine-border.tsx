import * as React from "react";
import { cn } from "@/lib/utils";

interface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Width of the border in pixels
   * @default 2
   */
  borderWidth?: number;
  /**
   * Duration of the animation in seconds
   * @default 3
   */
  duration?: number;
  /**
   * Color(s) of the shine effect - can be a single color or array
   */
  shineColor?: string | string[];
  /**
   * Border radius in pixels
   * @default 8
   */
  borderRadius?: number;
}

const ShineBorder: React.FC<ShineBorderProps> = ({
  borderWidth = 2,
  duration = 3,
  shineColor = ["hsl(142 71% 45%)", "hsl(160 84% 39%)"],
  borderRadius = 8,
  className,
  children,
  ...props
}) => {
  const colors = Array.isArray(shineColor) ? shineColor : [shineColor];
  const gradientColors = colors.join(", ");

  return (
    <div
      className={cn("relative inline-block group", className)}
      {...props}
    >
      {/* Animated border container */}
      <div
        className="absolute -inset-[2px] rounded-lg opacity-75 blur-sm group-hover:opacity-100 transition-opacity"
        style={{
          background: `linear-gradient(90deg, ${gradientColors}, ${colors[0]})`,
          backgroundSize: "200% 100%",
          animation: `shimmer ${duration}s linear infinite`,
          borderRadius: `${borderRadius + 2}px`,
        }}
      />
      
      {/* Static border glow */}
      <div
        className="absolute -inset-[1px] rounded-lg"
        style={{
          background: `linear-gradient(135deg, ${gradientColors})`,
          borderRadius: `${borderRadius + 1}px`,
        }}
      />
      
      {/* Inner content with background */}
      <div
        className="relative bg-background"
        style={{
          borderRadius: `${borderRadius}px`,
        }}
      >
        {children}
      </div>
      
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export { ShineBorder };
