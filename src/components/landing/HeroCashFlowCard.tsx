/*
 * The hero's "Cash flow" card (handoff 18-hero-v2, 40a). Coded, not a
 * screenshot: HTML bars, an SVG projected line and a text tooltip, exposed to
 * assistive tech as one image with a label. Every number, date and name is a
 * placeholder from the handoff's shared ledger (series `W`).
 *
 * Phone and desktop differ in data, not just size: 13 weeks below 760px, 26
 * above. Both live in the markup and CSS picks one, because the homepage is
 * prerendered at 1440px and the app bundle starts late on a phone, so a
 * JavaScript switch would show the desktop chart on a phone until it ran.
 * The animation is CSS (index.css, .hero-chart) for the same reason. It plays
 * once, in about 3s, and holds; this component only resets it while the card
 * is off screen, so it replays when the card comes back.
 */

import { useEffect, useRef } from "react";

// Closing balance per week, in $K, from the week of Nov 2, 2026.
const W = [
  471.9, 409.4, 452.7, 441.3, 428.8, 366.1, 299.8, 236.5, 371.3, 315.7, 321.3, 308.8, 315.7, 352.4, 301.9, 338.6,
  327.0, 284.3, 341.7, 329.0, 312.5, 268.9, 334.8, 322.1, 309.6, 266.3,
];
const MAX = 550;
const PHONE_WEEKS = 13;
// The week of Dec 28: the Halvorsen Logistics invoice lands and the tooltip
// points at its bar.
const TIP = 8;
const MONTHS: [string, number][] = [
  ["Nov", 0],
  ["Dec", 5],
  ["Jan", 9],
  ["Feb", 13],
  ["Mar", 17],
  ["Apr", 22],
];

const pct = (v: number) => `${((v / MAX) * 100).toFixed(2)}%`;

function linePath(n: number): string {
  return W.slice(0, n)
    .map((v, i) => `${i ? "L" : "M"}${(((i + 0.5) / n) * 1000).toFixed(1)} ${(100 - (v / MAX) * 100).toFixed(2)}`)
    .join(" ");
}

const LINE_DESKTOP = linePath(W.length);
const LINE_PHONE = linePath(PHONE_WEEKS);

const LABEL =
  "Example weekly cash flow forecast from November 2026 to April 2027. The balance falls to $236,500 in late December, then a $164,200 Halvorsen Logistics invoice in the week of December 28 brings it to $371,300.";

const mono = "font-mono text-[10px] leading-none text-forest-muted-faint";

export function HeroCashFlowCard() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.removeAttribute("data-offscreen");
      else el.setAttribute("data-offscreen", "");
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={LABEL}
      className="hero-chart relative mt-8 flex h-[280px] w-full max-w-[1040px] flex-col rounded-[18px] border border-forest-border bg-forest text-left shadow-[0_-24px_60px_-30px_rgba(15,28,22,.55)] min-[760px]:mt-5 min-[760px]:h-[318px]"
    >
      <div aria-hidden className="flex h-[50px] shrink-0 items-center justify-between gap-3 border-b border-[#1F3329] px-3.5 min-[760px]:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="text-sm font-semibold text-forest-foreground">Cash flow</span>
          <span className="hidden font-mono text-[11px] text-forest-muted-faint min-[760px]:inline">Nov 2, 2026 – Apr 26, 2027</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex gap-0.5 rounded-full border border-forest-border p-[3px] font-mono text-[11px] text-forest-muted">
            <span className="px-2.5 py-1">Monthly</span>
            <span className="rounded-full bg-primary px-2.5 py-1 text-primary-foreground">Weekly</span>
            <span className="px-2.5 py-1">Daily</span>
          </div>
          <span className="hidden rounded-lg border border-forest-border px-2.5 py-[5px] font-mono text-[11px] text-forest-muted min-[760px]:inline">
            Export
          </span>
        </div>
      </div>

      <div aria-hidden className="relative ml-14 mr-3.5 mt-[22px] max-h-[160px] flex-1 min-[760px]:ml-16 min-[760px]:mr-5 min-[760px]:max-h-[196px]">
        <span className={`${mono} absolute -left-[46px] bottom-[-5px]`}>$0</span>
        <span className={`${mono} absolute -left-[46px] bottom-[calc(36.36%-5px)]`}>$200K</span>
        <span className={`${mono} absolute -left-[46px] bottom-[calc(72.73%-5px)]`}>$400K</span>
        <div className="absolute inset-x-0 bottom-[36.36%] border-t border-[#1A2C23]" />
        <div className="absolute inset-x-0 bottom-[72.73%] border-t border-[#1A2C23]" />

        <div className="absolute inset-0 flex items-end gap-1 border-b border-forest-border min-[760px]:gap-1.5">
          {W.map((v, i) => (
            <div
              key={i}
              data-tip={i === TIP || undefined}
              className={`hero-bar flex-1 rounded-t-[3px] ${i === TIP ? "bg-[#3A8A60]" : "bg-[#244A38]"} ${i >= PHONE_WEEKS ? "max-[759px]:hidden" : ""}`}
              style={{ height: pct(v), animationDelay: i === TIP ? `${i * 25}ms, 0ms` : `${i * 25}ms` }}
            />
          ))}
        </div>

        <svg
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
          className="hero-line pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        >
          <path className="max-[759px]:hidden" d={LINE_DESKTOP} fill="none" stroke="#48D88A" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
          <path className="min-[760px]:hidden" d={LINE_PHONE} fill="none" stroke="#48D88A" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        </svg>

        {/* Pinned top-left on phones; beside the Dec 28 bar from 760px. */}
        <div className="hero-tip absolute left-2 top-1.5 flex w-[284px] max-w-[calc(100%-8px)] flex-col gap-[5px] rounded-[10px] border border-border bg-card px-3 py-2.5 shadow-[0_18px_36px_-16px_rgba(0,0,0,.6)] min-[760px]:left-[calc(34.62%+14px)] min-[760px]:w-[304px]">
          <span className="font-mono text-[10px] text-muted-foreground">Week of Dec 28</span>
          <span className="flex justify-between gap-2 text-[12.5px]">
            <span className="text-foreground min-[760px]:whitespace-nowrap">Halvorsen Logistics annual invoice</span>
            <b className="font-mono font-medium text-[hsl(var(--sage-dark))]">+$164,200</b>
          </span>
          <span className="flex justify-between gap-2 border-t border-border pt-[5px] text-xs text-muted-foreground">
            <span>Closing balance</span>
            <span className="font-mono text-foreground">$371,300</span>
          </span>
        </div>
      </div>

      <div aria-hidden className={`${mono} relative mb-3.5 ml-14 mr-3.5 mt-2 h-4 min-[760px]:ml-16 min-[760px]:mr-5`}>
        {MONTHS.map(([label, i]) => (
          <span key={label}>
            {i < PHONE_WEEKS && (
              <span className="absolute min-[760px]:hidden" style={{ left: `${((i / PHONE_WEEKS) * 100).toFixed(2)}%` }}>
                {label}
              </span>
            )}
            <span className="absolute max-[759px]:hidden" style={{ left: `${((i / W.length) * 100).toFixed(2)}%` }}>
              {label}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
