import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";

export interface TextHoverHaloProps {
  /** Plain string. Painted once as real DOM text; the halo layer is a CSS
      pseudo-element fed from data-text, so crawlers that strip tags read the
      text exactly once. Do not widen this to ReactNode: a duplicated element
      child would reintroduce the double-text bug this component used to have,
      where the homepage H1 extracted as "Your cash flow,Your cash flow,...". */
  text: string;
  className?: string;
  as?: React.ElementType;
}

export const TextHoverHalo = ({
  text,
  className,
  as: Component = "span",
}: TextHoverHaloProps) => {
  const [pos, setPos] = useState({ x: 50, y: 50, opacity: 0 });
  const ref = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => setPos((prev) => ({ ...prev, opacity: 0 }));

  return (
    <Component
      ref={ref}
      data-text={text}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        {
          "--halo-x": `${pos.x}%`,
          "--halo-y": `${pos.y}%`,
          "--halo-opacity": pos.opacity,
        } as React.CSSProperties
      }
      className={cn(
        "text-hover-halo relative inline-block cursor-default text-foreground",
        className,
      )}
    >
      {text}
    </Component>
  );
};
