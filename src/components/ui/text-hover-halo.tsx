import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";

export interface TextHoverHaloProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const TextHoverHalo = ({
  children,
  className,
  as: Component = "span",
}: TextHoverHaloProps) => {
  const [pos, setPos] = useState({ x: 50, y: 50, opacity: 0 });
  const ref = useRef<HTMLSpanElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x, y, opacity: 1 });
  };

  const handleMouseLeave = () => {
    setPos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <Component
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("relative inline-block cursor-default select-none", className)}
    >
      {/* Base text layer (always visible & stable) */}
      <span className="text-foreground">{children}</span>

      {/* Halo gradient overlay text layer (fades smoothly without layout shift or text flicker) */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-clip-text text-transparent pointer-events-none transition-opacity duration-300 ease-out"
        style={{
          opacity: pos.opacity,
          backgroundImage: `radial-gradient(circle 180px at ${pos.x}% ${pos.y}%, hsl(var(--primary)) 0%, hsl(var(--foreground)) 75%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {children}
      </span>
    </Component>
  );
};
