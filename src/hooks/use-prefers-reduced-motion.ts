import { useSyncExternalStore } from "react";

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * When the pinned, scroll-scrubbed sections render static instead: reduced
 * motion, or a viewport too short to hold a pinned stage (short phones in
 * landscape, 1366x768 laptops). The same query collapses the pin tracks in
 * index.css, so the static layout shows before hydration too. Keep the two in
 * step.
 */
export const STATIC_PINS_QUERY = "(prefers-reduced-motion: reduce), (max-height: 719px)";

function store(query: string) {
  const subscribe = (onChange: () => void) => {
    if (typeof window === "undefined" || !window.matchMedia) return () => {};
    const mq = window.matchMedia(query);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  };
  const getSnapshot = () => typeof window !== "undefined" && !!window.matchMedia && window.matchMedia(query).matches;
  return { subscribe, getSnapshot };
}

const reducedStore = store(REDUCED_QUERY);
const staticPinsStore = store(STATIC_PINS_QUERY);

// The prerender (scripts/prerender.mjs) captures a 1440x900 viewport with
// normal motion, so the server snapshot is false. Sections must not depend on
// these hooks alone for their static end state: pair them with the matching
// CSS media query (PinnedSection does) so it shows before hydration too.
function getServerSnapshot() {
  return false;
}

/** True when the visitor asks for reduced motion. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(reducedStore.subscribe, reducedStore.getSnapshot, getServerSnapshot);
}

/** True when pinned sections should render static (reduced motion or a short viewport). */
export function useStaticPins(): boolean {
  return useSyncExternalStore(staticPinsStore.subscribe, staticPinsStore.getSnapshot, getServerSnapshot);
}
