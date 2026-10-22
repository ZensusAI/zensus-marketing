import { useEffect, useRef } from "react";

/**
 * Calls `onFrame(viewportHeight)` once per animation frame while the page
 * scrolls or resizes, and once on mount. For scroll effects that read their
 * own elements' positions (parallax, entry tilts) rather than one pinned
 * track's progress, which is what useScrollProgress is for. Write styles to
 * refs inside the callback, never React state. Pass `enabled: false` (for
 * example under reduced motion) and no listener is attached.
 */
export function useScrollFrame(onFrame: (vh: number) => void, enabled: boolean) {
  const cb = useRef(onFrame);
  cb.current = onFrame;

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const run = () => {
      raf = 0;
      cb.current(window.innerHeight);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };
    run();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled]);
}
