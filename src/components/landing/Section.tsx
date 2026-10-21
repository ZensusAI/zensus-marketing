import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  as?: ElementType;
  id?: string;
  className?: string;
  containerClassName?: string;
  "aria-labelledby"?: string;
}

/**
 * Homepage redesign container (handoff 00-overview): max-width 1152px, 32px
 * side padding on desktop and 20px on phones. The handoff switches at a 760px
 * section width; Tailwind's md (768px) is the nearest breakpoint.
 */
export const Section = ({
  children,
  as: Tag = "section",
  id,
  className,
  containerClassName,
  "aria-labelledby": labelledBy,
}: SectionProps) => (
  <Tag id={id} aria-labelledby={labelledBy} className={className}>
    <div className={cn("mx-auto w-full max-w-6xl px-5 md:px-8", containerClassName)}>{children}</div>
  </Tag>
);
