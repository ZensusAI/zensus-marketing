import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getSnapshot() {
  return typeof window !== "undefined" && !!window.matchMedia && window.matchMedia(QUERY).matches;
}

// The prerendered HTML is captured without reduced motion, so the server
// snapshot is false. Sections must not depend on this hook alone for their
// reduced-motion end state: pair it with a CSS `prefers-reduced-motion`
// rule (PinnedSection does) so the end state shows before hydration too.
function getServerSnapshot() {
  return false;
}

/** True when the visitor asks for reduced motion. The one hook for the whole site. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
