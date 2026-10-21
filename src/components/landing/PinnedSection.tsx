import { useRef, type CSSProperties, type ReactNode } from "react";
import { useStaticPins } from "@/hooks/use-prefers-reduced-motion";
import { useScrollProgress, type ScrollProgress } from "@/hooks/use-scroll-progress";
import { cn } from "@/lib/utils";

interface PinnedSectionProps {
  /** Pin length as a multiple of the viewport height, as the handoff gives it (3 = 300vh). */
  viewports: number;
  children: ReactNode;
  id?: string;
  className?: string;
  stageClassName?: string;
  onProgress?: (values: ScrollProgress) => void;
  "aria-labelledby"?: string;
  /**
   * Deep-link targets inside the pin: each id lands the scroll at progress
   * `at` (0 to 1) through the track, so a link to it opens on that beat.
   * Only rendered while pinned; static sections put the ids on their content.
   */
  anchors?: readonly { id: string; at: number }[];
}

/**
 * A pinned, scroll-scrubbed section. The pin is plain CSS `position: sticky`
 * inside a tall track, which iOS Safari handles without the address-bar jumps
 * of JS pinning. Progress arrives as the CSS variable `--p` (0 to 1) on the
 * track (and the entry value as `--e`), plus the optional `onProgress` callback.
 *
 * Reduced motion or a short viewport (useStaticPins): the `.pin-track` CSS
 * rule collapses the track and sets `--p: 1` before hydration, and the
 * listener never attaches, so the section renders its finished end state.
 * Ancestors must not set `overflow: hidden`, which disables sticky
 * (`overflow: clip` is fine).
 */
export const PinnedSection = ({
  viewports,
  children,
  id,
  className,
  stageClassName,
  onProgress,
  "aria-labelledby": labelledBy,
  anchors,
}: PinnedSectionProps) => {
  const ref = useRef<HTMLElement>(null);
  const reduced = useStaticPins();
  useScrollProgress(ref, { disabled: reduced, onProgress: reduced ? undefined : onProgress });

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={labelledBy}
      className={cn("pin-track relative", className)}
      style={{ "--pin-h": `${viewports * 100}vh` } as CSSProperties}
    >
      {!reduced &&
        anchors?.map((a) => (
          <span
            key={a.id}
            id={a.id}
            aria-hidden
            className="pointer-events-none absolute left-0 h-px w-px"
            style={{ top: `calc(${a.at} * (var(--pin-h) - 100svh))` }}
          />
        ))}
      <div className={cn("pin-stage", stageClassName)}>{children}</div>
    </section>
  );
};
