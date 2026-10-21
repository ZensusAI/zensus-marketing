import { useEffect, type RefObject } from "react";
import { clamp01 } from "@/lib/motion";

interface Options {
  /** Skip the listener entirely (for example under reduced motion). */
  disabled?: boolean;
  /** Called on every animation frame the progress changes. Write to refs or styles here, not React state. */
  onProgress?: (progress: number) => void;
}

/**
 * Scroll progress through a tall element, 0 when its top reaches the top of
 * the viewport and 1 when its bottom reaches the bottom. Written to the
 * element as the CSS variable `--p`, so styles can use calc(var(--p) * ...)
 * without re-rendering React on every scroll frame.
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
    let last = -1;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total <= 0 ? (rect.top < 0 ? 1 : 0) : clamp01(-rect.top / total);
      if (p === last) return;
      last = p;
      el.style.setProperty("--p", p.toFixed(4));
      onProgress?.(p);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, disabled, onProgress]);
}
