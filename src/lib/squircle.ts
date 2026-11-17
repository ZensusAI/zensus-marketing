/*
 * Continuous ("squircle") corners, the Apple-style shape Figma calls corner
 * smoothing. A plain border-radius is a quarter circle that meets each edge at
 * a sudden change of curvature; here the curve eases in over a longer run, so a
 * rounded rectangle reads as softer without looking rounder.
 *
 * Ported from the About page handoff (24-about-page, sqPath), which follows
 * Figma's published algorithm; written here without the figma-squircle package
 * to keep the dependency list as it is. The result is an SVG path string for
 * CSS `clip-path: path(...)`, and for a border drawn along the same curve.
 */

export const SQUIRCLE_SMOOTHING = 0.6;

/** Radii for the four corners: top-left, top-right, bottom-right, bottom-left. */
export type CornerRadii = readonly [number, number, number, number];

const rad = (deg: number) => (deg * Math.PI) / 180;
const fx = (n: number) => String(+n.toFixed(3));

type Corner = { r: number; p: number; a: number; b: number; c: number; d: number; L: number };

function corner(radius: number, smoothing: number, budget: number): Corner {
  if (!radius) return { r: 0, p: 0, a: 0, b: 0, c: 0, d: 0, L: 0 };
  const r = Math.min(radius, budget);
  const s = Math.min(smoothing, budget / r - 1);
  const p = Math.min((1 + smoothing) * r, budget);
  const arc = 90 * (1 - s);
  const L = Math.sin(rad(arc / 2)) * r * Math.SQRT2;
  const c = r * Math.tan(rad((90 - arc) / 4)) * Math.cos(rad(45 * s));
  const d = c * Math.tan(rad(45 * s));
  const b = (p - L - c - d) / 3;
  return { r, p, a: 2 * b, b, c, d, L };
}

/**
 * The outline of a w by h rectangle with continuous corners, starting at the
 * top edge and running clockwise. `ox` and `oy` offset it, which is how a
 * stroke is inset by half its width so it stays inside the clipped shape.
 */
export function squirclePath(w: number, h: number, radii: CornerRadii, ox = 0, oy = 0, smoothing = SQUIRCLE_SMOOTHING): string {
  const budget = Math.min(w, h) / 2;
  const [TL, TR, BR, BL] = radii.map((r) => corner(r, smoothing, budget));

  const seg = (q: Corner, k: 0 | 1 | 2 | 3): string => {
    if (!q.r) return "";
    const { r, a, b, c, d, L } = q;
    const s1 = a + b;
    const s2 = a + b + c;
    const arc = `a${fx(r)} ${fx(r)} 0 0 1 `;
    if (k === 0) return `c${fx(a)} 0 ${fx(s1)} 0 ${fx(s2)} ${fx(d)}${arc}${fx(L)} ${fx(L)}c${fx(d)} ${fx(c)} ${fx(d)} ${fx(b + c)} ${fx(d)} ${fx(s2)}`;
    if (k === 1) return `c0 ${fx(a)} 0 ${fx(s1)} ${fx(-d)} ${fx(s2)}${arc}${fx(-L)} ${fx(L)}c${fx(-c)} ${fx(d)} ${fx(-(b + c))} ${fx(d)} ${fx(-s2)} ${fx(d)}`;
    if (k === 2) return `c${fx(-a)} 0 ${fx(-s1)} 0 ${fx(-s2)} ${fx(-d)}${arc}${fx(-L)} ${fx(-L)}c${fx(-d)} ${fx(-c)} ${fx(-d)} ${fx(-(b + c))} ${fx(-d)} ${fx(-s2)}`;
    return `c0 ${fx(-a)} 0 ${fx(-s1)} ${fx(d)} ${fx(-s2)}${arc}${fx(L)} ${fx(-L)}c${fx(c)} ${fx(-d)} ${fx(b + c)} ${fx(-d)} ${fx(s2)} ${fx(-d)}`;
  };

  return (
    `M${fx(ox + w - TR.p)} ${fx(oy)}${seg(TR, 0)}` +
    `L${fx(ox + w)} ${fx(oy + h - BR.p)}${seg(BR, 1)}` +
    `L${fx(ox + BL.p)} ${fx(oy + h)}${seg(BL, 2)}` +
    `L${fx(ox)} ${fx(oy + TL.p)}${seg(TL, 3)}Z`
  );
}

/** One radius for all four corners, or a CSS-style "tl tr br bl" list. */
export function toRadii(value: number | CornerRadii): CornerRadii {
  return typeof value === "number" ? [value, value, value, value] : value;
}

/**
 * An SVG (as a data URL for a CSS background) that strokes a border along the
 * same curve as `squirclePath`. clip-path cuts a normal CSS border, so the
 * border is drawn as an overlay instead.
 */
export function squircleRingImage(w: number, h: number, radii: CornerRadii, stroke: string, dash?: string): string {
  const sw = 1;
  const inner = radii.map((r) => Math.max(0, r - sw / 2)) as unknown as CornerRadii;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
    `<path d="${squirclePath(w - sw, h - sw, inner, sw / 2, sw / 2)}" fill="none" stroke="${stroke}" stroke-width="${sw}"` +
    `${dash ? ` stroke-dasharray="${dash}"` : ""}/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
