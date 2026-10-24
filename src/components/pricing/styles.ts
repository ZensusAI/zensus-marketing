// Shared classes for the pricing page (handoff 14-pricing).

/**
 * Squircle corners. Browsers without `corner-shape` keep the plain
 * border-radius, which the handoff accepts as the fallback. Radii on squircle
 * surfaces run about 1.6x a normal rounded corner.
 */
export const SQUIRCLE = "[corner-shape:squircle]";

/** The 56px primary button: the homepage's solid green with its cream halo. */
export const PRIMARY_BUTTON =
  "group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary text-base font-semibold text-primary-foreground [corner-shape:squircle] " +
  "shadow-[0_0_0_1px_#EBD9A6,0_0_18px_rgba(235,217,166,.6),0_4px_6px_-1px_rgba(0,0,0,.1)] " +
  "transition-[transform,background-color] duration-300 ease-ui hover:-translate-y-px hover:bg-[hsl(150_70%_41%)] active:translate-y-0 motion-reduce:transform-none " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export const FOCUS_RING =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** Inline links on cream: deep green, underline on hover. */
export const TEXT_LINK = `font-medium text-sage-dark underline-offset-4 hover:underline ${FOCUS_RING}`;
