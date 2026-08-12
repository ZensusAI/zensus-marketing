import React from "react";
import { cn } from "@/lib/utils";

interface PencilSketchFrameProps {
  className?: string;
}

export const PencilSketchFrame: React.FC<PencilSketchFrameProps> = ({ className }) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute -inset-6 sm:-inset-8 lg:-inset-9 z-0 overflow-visible",
        className
      )}
    >
      <svg
        viewBox="0 0 500 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full overflow-visible animate-[pencil-stop-motion_4s_steps(1)_infinite]"
      >
        <defs>
          <linearGradient id="pencilGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.85" />
            <stop offset="50%" stopColor="hsl(var(--foreground))" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.7" />
          </linearGradient>

          {/* Rough pencil texture filter */}
          <filter id="pencilTexture" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        <g filter="url(#pencilTexture)">
          {/* Main irregular sketch frame path 1 */}
          <path
            d="M 22,28 C 140,18 360,24 478,20 C 484,110 476,220 480,295 C 340,302 120,296 18,300 C 24,190 16,90 22,28 Z"
            stroke="url(#pencilGradient)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="600"
            className="animate-[pencil-draw_12s_linear_infinite]"
          />

          {/* Secondary hand-drawn sketchy overlap path */}
          <path
            d="M 18,22 C 160,26 340,16 482,26 C 474,120 484,210 475,290 C 350,294 140,305 24,295 C 16,200 22,80 18,22 Z"
            stroke="hsl(var(--primary))"
            strokeWidth="1.4"
            strokeOpacity="0.6"
            strokeLinecap="round"
            strokeDasharray="4 6"
          />

          {/* Top-right hand-drawn star accents (inspired by math sketch diagrams) */}
          <g transform="translate(460, -10)">
            {/* Sketched 4-point star 1 */}
            <path
              d="M 0,-12 L 3,-3 L 12,0 L 3,3 L 0,12 L -3,3 L -12,0 L -3,-3 Z"
              fill="hsl(var(--primary))"
              fillOpacity="0.75"
              className="animate-[pencil-spin_16s_linear_infinite]"
            />
          </g>

          <g transform="translate(490, 45)">
            {/* Sketched 4-point star 2 */}
            <path
              d="M 0,-8 L 2,-2 L 8,0 L 2,2 L 0,8 L -2,2 L -8,0 L -2,-2 Z"
              fill="hsl(var(--foreground))"
              fillOpacity="0.4"
            />
          </g>

          {/* Top-left sketch accent dots and mathematical angle arc */}
          <g transform="translate(-10, 10)">
            <path
              d="M 10,40 Q 35,15 60,35"
              stroke="hsl(var(--primary))"
              strokeWidth="1.8"
              strokeDasharray="3 3"
              fill="none"
            />
            <circle cx="10" cy="40" r="2.5" fill="hsl(var(--primary))" />
            <circle cx="60" cy="35" r="2" fill="hsl(var(--foreground))" opacity="0.6" />
          </g>

          {/* Bottom-left hand-drawn pencil star */}
          <g transform="translate(-15, 280)">
            <path
              d="M 0,-10 L 2.5,-2.5 L 10,0 L 2.5,2.5 L 0,10 L -2.5,2.5 L -10,0 L -2.5,-2.5 Z"
              fill="hsl(var(--primary))"
              fillOpacity="0.65"
              className="animate-[pencil-pulse_4s_ease-in-out_infinite]"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};
