import { useEffect, useRef } from "react";

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Scroll motion for /security (handoff 17-security): each `[data-scene]` fades
 * from 12% and rises 28px as it enters, a 2px line tracks reading progress, and
 * desktop gets proximity snap (see `html.security-snap` in index.css).
 *
 * It writes styles straight to the DOM from a single rAF, so scrolling never
 * re-renders the page, and it only ever runs after the bundle loads: the
 * prerendered HTML stays fully visible. Reduced motion skips all of it.
 */
export function useSceneReveal() {
  const rootRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const html = document.documentElement;
    html.classList.add("security-snap");
    const scenes = [...root.querySelectorAll<HTMLElement>("[data-scene]")];
    let frame = 0;

    const measure = () => {
      frame = 0;
      const height = window.innerHeight;
      for (const scene of scenes) {
        const body = scene.firstElementChild as HTMLElement | null;
        if (!body) continue;
        const entered = (height - scene.getBoundingClientRect().top) / (height * 0.5);
        const eased = easeOutCubic(Math.max(0, Math.min(1, entered)));
        body.style.opacity = eased >= 1 ? "" : (0.12 + 0.88 * eased).toFixed(3);
        body.style.transform = eased >= 1 ? "" : `translateY(${(28 * (1 - eased)).toFixed(1)}px)`;
      }
      // Progress runs over the page's own content, so it fills before the footer.
      const span = root.offsetHeight - height;
      const progress = span > 0 ? Math.max(0, Math.min(1, -root.getBoundingClientRect().top / span)) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress.toFixed(4)})`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      html.classList.remove("security-snap");
    };
  }, []);

  return { rootRef, progressRef };
}
