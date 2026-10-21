import { useRef, type CSSProperties, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { cn } from "@/lib/utils";

interface PinnedSectionProps {
  /** Pin length as a multiple of the viewport height, as the handoff gives it (3 = 300vh). */
  viewports: number;
  children: ReactNode;
  id?: string;
  className?: string;
  stageClassName?: string;
  onProgress?: (progress: number) => void;
  "aria-labelledby"?: string;
}

/**
 * A pinned, scroll-scrubbed section. The pin is plain CSS `position: sticky`
 * inside a tall track, which iOS Safari handles without the address-bar jumps
 * of JS pinning. Progress arrives as the CSS variable `--p` (0 to 1) on the
 * track, plus the optional `onProgress` callback.
 *
 * Reduced motion: the `.pin-track` CSS rule collapses the track and sets
 * `--p: 1` before hydration, and the listener never attaches, so the section
 * renders its finished end state. Ancestors must not set `overflow: hidden`,
 * which disables sticky.
 */
export const PinnedSection = ({
  viewports,
  children,
  id,
  className,
  stageClassName,
  onProgress,
  "aria-labelledby": labelledBy,
}: PinnedSectionProps) => {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  useScrollProgress(ref, { disabled: reduced, onProgress: reduced ? undefined : onProgress });

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={labelledBy}
      className={cn("pin-track relative", className)}
      style={{ "--pin-h": `${viewports * 100}vh` } as CSSProperties}
    >
      <div className={cn("pin-stage", stageClassName)}>{children}</div>
    </section>
  );
};
