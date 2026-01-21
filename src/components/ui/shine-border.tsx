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

  return (
    <div
      className={cn("relative inline-block", className)}
      style={{
        padding: `${borderWidth}px`,
        borderRadius: `${borderRadius}px`,
      }}
      {...props}
    >
      {/* Rotating gradient border */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          borderRadius: `${borderRadius}px`,
        }}
      >
        <div
          className="absolute w-[200%] h-[200%] top-1/2 left-1/2"
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, ${colors[0]} 60deg, ${colors[1] || colors[0]} 120deg, transparent 180deg, transparent 360deg)`,
            animation: `spin ${duration}s linear infinite`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
      
      {/* Inner content with background */}
      <div
        className="relative bg-primary"
        style={{
          borderRadius: `${borderRadius - borderWidth}px`,
        }}
      >
        {children}
      </div>
      
      <style>{`
        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export { ShineBorder };
