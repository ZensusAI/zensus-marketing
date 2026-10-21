import { useEffect, type RefObject } from "react";
import { clamp01 } from "@/lib/motion";

export interface ScrollProgress {
  /** Through the pin: 0 when the element's top reaches the viewport top, 1 when its bottom reaches the viewport bottom. */
  progress: number;
  /** Entry: 0 when the element's top is at the viewport bottom, 1 when it reaches the viewport top. */
  entry: number;
  /** Whole run: 0 when the top enters at the bottom, 1 once the element has scrolled its own height past that point. */
  overall: number;
}

interface Options {
  /** Skip the listener entirely (for example under reduced motion). */
  disabled?: boolean;
  /** Called on every animation frame the values change. Write to refs or styles here, not React state. */
  onProgress?: (values: ScrollProgress) => void;
}

/**
 * Scroll progress through a tall element. `progress` is also written to the
 * element as the CSS variable `--p` and `entry` as `--e`, so styles can use
 * calc(var(--p) * ...) without re-rendering React on every scroll frame.
 *
 * Main-thread, coalesced to one update per animation frame. Animate only
 * transform and opacity from it, and never mount or unmount text by progress:
 * every word stays in the HTML for crawlers.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>, { disabled = false, onProgress }: Options = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;

    let raf = 0;
    let last = "";
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      const progress = total <= 0 ? (rect.top < 0 ? 1 : 0) : clamp01(-rect.top / total);
      const entry = clamp01((vh - rect.top) / vh);
      const overall = clamp01((vh - rect.top) / Math.max(1, rect.height));
      const key = `${progress.toFixed(4)}|${entry.toFixed(4)}|${overall.toFixed(4)}`;
      if (key === last) return;
      last = key;
      el.style.setProperty("--p", progress.toFixed(4));
      el.style.setProperty("--e", entry.toFixed(4));
      onProgress?.({ progress, entry, overall });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    // A width-only resize or a rotation can leave all three values unchanged
    // (the track height is in vh), yet sections that size drawings in pixels
    // must redraw, so a resize always calls back.
    const onResize = () => {
      last = "";
      schedule();
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, disabled, onProgress]);
}
