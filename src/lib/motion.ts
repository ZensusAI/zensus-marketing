// Easing and progress helpers for the homepage redesign (handoff 00-overview).

/** UI transitions: cubic-bezier(.2,.8,.2,1), 0.3 to 0.6s. Also `ease-ui` in Tailwind. */
export const EASE_UI = "cubic-bezier(.2,.8,.2,1)";

/** Scroll-scrubbed easing: cubic in-out. */
export function easeInOutCubic(x: number): number {
  const t = clamp01(x);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function clamp01(x: number): number {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

/**
 * Local progress of a sub-range of a section's scroll progress: 0 before
 * `start`, 1 after `end`, linear in between. Use it for staggered pieces of
 * one pinned timeline, then ease the result.
 */
export function segment(progress: number, start: number, end: number): number {
  if (end <= start) return progress >= end ? 1 : 0;
  return clamp01((progress - start) / (end - start));
}

export function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}
