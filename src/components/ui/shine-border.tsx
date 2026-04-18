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
  /**
   * Render a blurred duplicate behind the trace to create an ambient glow.
   * @default false
   */
  glow?: boolean;
  /**
   * Keep the inner content background transparent (so the child provides its own fill).
   * Useful when wrapping a Button that already has a background color.
   * @default false
   */
  transparentInner?: boolean;
}

const ShineBorder: React.FC<ShineBorderProps> = ({
  borderWidth = 2,
  duration = 3,
  shineColor = ["hsl(142 71% 45%)", "hsl(160 84% 39%)"],
  borderRadius = 8,
  glow = false,
  transparentInner = false,
  className,
  children,
  ...props
}) => {
  const colors = Array.isArray(shineColor) ? shineColor : [shineColor];
  const gradient = `conic-gradient(from 0deg, transparent 0deg, ${colors[0]} 60deg, ${colors[1] || colors[0]} 120deg, transparent 180deg, transparent 360deg)`;

  return (
    <div
      className={cn("relative inline-block", className)}
      style={{
        padding: `${borderWidth}px`,
        borderRadius: `${borderRadius}px`,
      }}
      {...props}
    >
      {/* Ambient glow halo (blurred duplicate of the trace) */}
      {glow && (
        <div
          className="absolute pointer-events-none"
          style={{
            inset: "-6px",
            borderRadius: `${borderRadius + 6}px`,
            overflow: "hidden",
            filter: "blur(8px)",
            opacity: 0.12,
          }}
          aria-hidden="true"
        >
          <div
            className="absolute w-[200%] h-[200%] top-1/2 left-1/2"
            style={{
              background: gradient,
              animation: `shine-border-spin ${duration}s linear infinite`,
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
      )}

      {/* Crisp rotating gradient border */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{
          borderRadius: `${borderRadius}px`,
        }}
        aria-hidden="true"
      >
        <div
          className="absolute w-[200%] h-[200%] top-1/2 left-1/2"
          style={{
            background: gradient,
            animation: `shine-border-spin ${duration}s linear infinite`,
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {/* Inner content */}
      <div
        className={cn("relative", !transparentInner && "bg-primary")}
        style={{
          borderRadius: `${Math.max(borderRadius - borderWidth, 0)}px`,
        }}
      >
        {children}
      </div>

      <style>{`
        @keyframes shine-border-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export { ShineBorder };
