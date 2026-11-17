import { useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useScrollFrame } from "@/hooks/use-scroll-frame";
import { clamp01 } from "@/lib/motion";
import { cn } from "@/lib/utils";

/*
 * Scroll parallax for the About page's two full-screen statements, the mission
 * and the vision (handoff 24, 17 Nov 2026). Each section's progress p runs 0 to
 * 1 as it crosses the viewport:
 *
 *   p = clamp((scrollY + vh - sectionTop) / (sectionHeight + vh))
 *
 * (written below from the section's viewport rect, which is the same number),
 * so p is 0.5 when the section fills the screen. Then:
 *
 *   background layers   translateY((p - 0.5) * k)   slower than the page
 *   statement block     translateY((0.5 - p) * 120)  a little faster
 *   statement opacity   clamp((p - 0.18) / 0.2) * clamp((0.92 - p) / 0.17)
 *
 * with every distance multiplied by 0.6 below 820px. Position-driven, never
 * time-driven; transform and opacity only, written to refs so React does not
 * re-render on scroll. Under reduced motion nothing is attached: the layers sit
 * still and the statement is at full opacity. The prerender runs with reduced
 * motion, so the static HTML is that state too, and every word stays in the DOM.
 *
 * This uses the repo's scroll-frame hook rather than CSS scroll-driven
 * animations (animation-timeline: view()), which Firefox does not run.
 */

const NARROW = 820;
const STATEMENT_SHIFT = 120;

export type ParallaxLayer = {
  /** The layer's content; wrapped in an aria-hidden, pointer-events-none div. */
  node: ReactNode;
  /** Distance (px, at full scale) the layer travels over the whole crossing. */
  travel: number;
  /** Classes for the wrapper div (positioning, size). */
  className?: string;
};

export function ParallaxSection({
  labelledBy,
  className,
  layers,
  children,
  contentClassName,
}: {
  labelledBy: string;
  className?: string;
  layers: ParallaxLayer[];
  children: ReactNode;
  contentClassName?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const secRef = useRef<HTMLElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const copyRef = useRef<HTMLDivElement>(null);

  useScrollFrame((vh) => {
    const sec = secRef.current;
    if (!sec) return;
    const r = sec.getBoundingClientRect();
    const p = clamp01((vh - r.top) / (r.height + vh));
    const s = window.innerWidth < NARROW ? 0.6 : 1;
    layers.forEach((layer, i) => {
      const el = layerRefs.current[i];
      if (el) el.style.transform = `translate3d(0, ${((p - 0.5) * layer.travel * s).toFixed(1)}px, 0)`;
    });
    const copy = copyRef.current;
    if (copy) {
      copy.style.transform = `translate3d(0, ${((0.5 - p) * STATEMENT_SHIFT * s).toFixed(1)}px, 0)`;
      copy.style.opacity = (clamp01((p - 0.18) / 0.2) * clamp01((0.92 - p) / 0.17)).toFixed(3);
    }
  }, !reduced);

  return (
    <section ref={secRef} aria-labelledby={labelledBy} className={cn("relative min-h-[100svh] overflow-hidden", className)}>
      {layers.map((layer, i) => (
        <div
          key={i}
          ref={(el) => {
            layerRefs.current[i] = el;
          }}
          aria-hidden="true"
          className={cn("pointer-events-none absolute will-change-transform", layer.className)}
        >
          {layer.node}
        </div>
      ))}
      <div ref={copyRef} className={cn("relative flex min-h-[100svh] flex-col justify-center will-change-transform", contentClassName)}>
        {children}
      </div>
    </section>
  );
}
