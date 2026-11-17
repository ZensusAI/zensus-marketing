import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { squirclePath, squircleRingImage, toRadii, type CornerRadii } from "@/lib/squircle";

/** A radius, or one for phones and one from 820px wide. */
export type SquircleRadius = number | CornerRadii | { base: number | CornerRadii; wide: number | CornerRadii };

const WIDE = "(min-width: 820px)";

function resolve(radius: SquircleRadius): CornerRadii {
  if (typeof radius === "number" || Array.isArray(radius)) return toRadii(radius as number | CornerRadii);
  const r = radius as { base: number | CornerRadii; wide: number | CornerRadii };
  const wide = typeof window !== "undefined" && window.matchMedia(WIDE).matches;
  return toRadii(wide ? r.wide : r.base);
}

/** The radius a plain border-radius fallback should use before the clip is set. */
function fallback(radius: SquircleRadius): CSSProperties["borderRadius"] {
  const r = typeof radius === "number" || Array.isArray(radius) ? toRadii(radius as number | CornerRadii) : toRadii((radius as { base: number | CornerRadii }).base);
  return `${r[0]}px ${r[1]}px ${r[2]}px ${r[3]}px`;
}

/**
 * A box with continuous corners (corner smoothing 0.6, see lib/squircle). The
 * box is clipped to the curve, and an optional 1px border is drawn along the
 * same curve by an aria-hidden overlay, because clip-path would cut a CSS
 * border. Until the clip is set (before the app starts, or without
 * ResizeObserver) the box has a plain border-radius of the same size and a
 * normal CSS border in the ring colour, so nothing is square or unframed.
 */
export function Squircle({
  radius,
  ring,
  ringDash,
  className,
  style,
  as: Tag = "div",
  children,
  ...rest
}: {
  radius: SquircleRadius;
  /** Border colour; omit for no border. */
  ring?: string;
  /** SVG dash pattern for a dashed border. */
  ringDash?: string;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "span" | "li" | "a";
  children?: ReactNode;
  href?: string;
  target?: string;
  rel?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, "style" | "className" | "children">) {
  const ref = useRef<HTMLElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let key = "";
    const apply = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (!w || !h) return;
      const radii = resolve(radius);
      const next = `${w}x${h}:${radii.join(",")}`;
      if (next === key) return;
      key = next;
      el.style.clipPath = `path("${squirclePath(w, h, radii)}")`;
      el.style.borderRadius = "0";
      el.style.border = "0";
      if (ringRef.current && ring) {
        ringRef.current.style.backgroundImage = squircleRingImage(w, h, radii, ring, ringDash);
        ringRef.current.style.backgroundSize = "100% 100%";
        ringRef.current.style.backgroundRepeat = "no-repeat";
      }
    };
    apply();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, [radius, ring, ringDash]);

  const Component = Tag as "div";
  return (
    <Component
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      style={{ position: "relative", borderRadius: fallback(radius), ...(ring ? { border: `1px solid ${ring}` } : null), ...style }}
      {...rest}
    >
      {children}
      {ring ? <span ref={ringRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[3]" /> : null}
    </Component>
  );
}
