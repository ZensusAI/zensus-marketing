import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type { ScrollProgress } from "@/hooks/use-scroll-progress";
import { clamp01, easeInOutCubic as ease, lerp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { PinnedSection } from "./PinnedSection";

/*
 * Runway feature from handoff 07-runway-feature (locked 15a): a pinned, coded
 * cash flow chart that redraws through three steps over 4.2 viewports.
 *   1. Drill-down: monthly bars split into weekly bars; a daily inset pops
 *      over the week when the annual contract lands.
 *   2. Scenarios: bars dim, the projected balance draws, a "You asked"
 *      bubble types the what-if, and a dashed amber scenario line bends away.
 *   3. Alerts: the red dashed cash floor draws, the breach point pulses, and
 *      a Slack alert slides in.
 * Step tabs fill in sync and the copy crossfades. All three steps' copy stays
 * in the HTML; the chart is decorative (aria-hidden). Values and timings are
 * the handoff's renderVals(); chart numbers, dates and the Slack text are the
 * handoff's placeholders, to be replaced before launch.
 *
 * Reduced motion: the end state (weekly bars, both lines, floor, breach dot,
 * Slack alert) and all three steps' copy stacked.
 *
 * Copy correction: the scenario chat has no "pays late" scenario type, so the
 * what-if is churn plus hiring (both supported), not a 30-day late payment.
 */

const STEPS = [
  {
    eyebrow: "Drill-down",
    headline: "Drill down to",
    highlight: "any week or day",
    description:
      "Click any month to see weekly cash flow, then drill into daily details. Subscription-aware projections show when annual and quarterly contracts actually hit your bank.",
    bullets: [
      "Monthly to weekly to daily drill-down with a single click",
      "Subscription-aware projections for annual and quarterly contracts",
      "See when revenue actually hits your bank, not flat monthly estimates",
    ],
  },
  {
    eyebrow: "Scenarios",
    headline: "Run scenarios with",
    highlight: "your cash flow agent",
    description:
      "Ask it in plain English: what if our biggest customer churns and we hire two engineers? Your agent recalculates your cash flow in real time.",
    bullets: [
      "Stack multiple assumptions (hiring, churn, pricing) in a single conversation",
      "Watch your cash flow update live as each scenario layer is applied",
      "Compare before-and-after projections and revert any change instantly",
    ],
  },
  {
    eyebrow: "Alerts",
    headline: "Get alerted",
    highlight: "before cash runs out",
    description:
      "Set your cash floor. Zensus watches your 30-day projection and pings Slack the moment it crosses the line. If the breach moves earlier or your minimum balance drops 10%, you get re-alerted.",
    bullets: [
      "Threshold-based Slack alerts from your projection, not your balance",
      "Re-alerts on material change (a week earlier or a 10% dip in minimum balance)",
      "Snooze or adjust your threshold from Slack in one click",
    ],
  },
];

const QUESTION = "What if our biggest customer churns and we hire two engineers?";
const BASE = [412, 418, 405, 421, 436, 428, 441, 452, 447, 463, 471, 458, 476, 489, 482, 497, 505, 494, 512, 521, 515, 528, 536, 531];
const SCEN = BASE.map((v, i) => v - (i >= 5 && i < 10 ? 80 : 0) - (i >= 6 ? 9 * (i - 5) : 0));
const LO = 250;
const HI = 560;
const FLOOR = 360;
const ALERT_W = 7;
const pct = (v: number) => ((v - LO) / (HI - LO)) * 100;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const LEVELS = ["Monthly", "Weekly", "Daily"];
const WEEK7 = [40, 46, 38, 100, 44, 22, 18];
const PIN_VIEWPORTS = 4.2;
const HIGHLIGHT_BAR = 9;

const stepAt = (p: number) => (p < 0.34 ? 0 : p < 0.67 ? 1 : 2);
const levelAt = (p: number) => {
  const k1 = ease((p - 0.05) / 0.17);
  const kI = ease((p - 0.22) / 0.07) * (1 - ease((p - 0.33) / 0.04));
  return kI > 0.5 ? 2 : k1 > 0.5 ? 1 : 0;
};

// A polyline over the 24 weekly points, drawn up to fraction k of its length.
function partialPath(vals: number[], from: number, k: number, w: number, h: number) {
  if (k <= 0) return "";
  const xy = (i: number, v: number) => [((i + 0.5) / 24) * w, h - (pct(v) / 100) * h];
  const n = 23 - from;
  const upto = from + n * k;
  const last = Math.floor(upto);
  let d = "";
  for (let i = from; i <= last; i++) {
    const [x, y] = xy(i, vals[i]);
    d += `${i === from ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  if (last < 23) {
    const f = upto - last;
    const [x1, y1] = xy(last, vals[last]);
    const [x2, y2] = xy(last + 1, vals[last + 1]);
    d += `L${lerp(x1, x2, f).toFixed(1)} ${lerp(y1, y2, f).toFixed(1)}`;
  }
  return d;
}

const RunwayFeature = () => {
  const reduced = usePrefersReducedMotion();
  const [act, setAct] = useState(0);
  const [level, setLevel] = useState(0);
  const [highlight, setHighlight] = useState(false);

  const chart = useRef<HTMLDivElement>(null);
  const bars = useRef<(HTMLDivElement | null)[]>([]);
  const fills = useRef<(HTMLDivElement | null)[]>([]);
  const basePath = useRef<SVGPathElement>(null);
  const scenPath = useRef<SVGPathElement>(null);
  const floor = useRef<HTMLDivElement>(null);
  const floorLabel = useRef<HTMLSpanElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const inset = useRef<HTMLDivElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const typed = useRef<HTMLSpanElement>(null);
  const caret = useRef<HTMLSpanElement>(null);
  const slack = useRef<HTMLDivElement>(null);
  const legend = useRef<HTMLSpanElement>(null);

  const apply = useCallback((p: number) => {
    const k1 = ease((p - 0.05) / 0.17);
    const kI = ease((p - 0.22) / 0.07) * (1 - ease((p - 0.33) / 0.04));
    const k2a = ease((p - 0.37) / 0.1);
    const k2b = ease((p - 0.49) / 0.13);
    const kB = ease((p - 0.38) / 0.05) * (1 - ease((p - 0.66) / 0.04));
    const typ = clamp01((p - 0.4) / 0.09);
    const k3a = ease((p - 0.69) / 0.08);
    const kD = ease((p - 0.77) / 0.05);
    const kS = ease((p - 0.81) / 0.08);

    bars.current.forEach((el, i) => {
      if (!el) return;
      const m = Math.floor(i / 4);
      const mv = BASE[m * 4 + 3];
      el.style.left = `${(lerp(m / 6 + 0.15 / 6, i / 24 + 0.12 / 24, k1) * 100).toFixed(3)}%`;
      el.style.width = `${(lerp(0.7 / 6, 0.76 / 24, k1) * 100).toFixed(3)}%`;
      el.style.height = `${pct(lerp(mv, BASE[i], k1)).toFixed(2)}%`;
      el.style.opacity = (1 - k2a * 0.62).toFixed(3);
    });
    const fillVals = [clamp01(p / 0.34), clamp01((p - 0.34) / 0.33), clamp01((p - 0.67) / 0.33)];
    fills.current.forEach((el, i) => el && (el.style.width = `${(fillVals[i] * 100).toFixed(1)}%`));

    const w = chart.current?.clientWidth ?? 600;
    const h = chart.current?.clientHeight ?? 270;
    basePath.current?.setAttribute("d", partialPath(BASE, 0, k2a, w, h));
    scenPath.current?.setAttribute("d", partialPath(SCEN, 4, k2b, w, h));
    if (legend.current) legend.current.style.opacity = k2b > 0 ? "1" : "0.5";

    if (floor.current) floor.current.style.width = `${(k3a * 100).toFixed(1)}%`;
    if (floorLabel.current) floorLabel.current.style.opacity = k3a.toFixed(2);
    if (dot.current) dot.current.style.transform = `scale(${kD.toFixed(3)})`;
    if (inset.current) {
      inset.current.style.opacity = kI.toFixed(3);
      inset.current.style.transform = `translateX(-50%) translateY(${((1 - kI) * 10).toFixed(1)}px) scale(${lerp(0.85, 1, kI).toFixed(3)})`;
    }
    if (bubble.current) {
      bubble.current.style.opacity = kB.toFixed(3);
      bubble.current.style.transform = `translateY(${((1 - kB) * 10).toFixed(1)}px)`;
    }
    if (typed.current) typed.current.textContent = QUESTION.slice(0, Math.round(QUESTION.length * typ));
    if (caret.current) caret.current.style.opacity = typ > 0 && typ < 1 ? "1" : "0";
    if (slack.current) {
      slack.current.style.opacity = kS.toFixed(3);
      slack.current.style.transform = `translateY(${((1 - kS) * -14).toFixed(1)}px)`;
    }

    const a = stepAt(p);
    setAct((prev) => (prev === a ? prev : a));
    const l = levelAt(p);
    setLevel((prev) => (prev === l ? prev : l));
    const hl = kI > 0.3;
    setHighlight((prev) => (prev === hl ? prev : hl));
  }, []);

  const onProgress = useCallback(({ progress }: ScrollProgress) => apply(progress), [apply]);

  // Reduced motion: draw the end state once (the scroll listener never runs).
  useEffect(() => {
    if (!reduced) return;
    apply(1);
    const redraw = () => apply(1);
    window.addEventListener("resize", redraw);
    return () => window.removeEventListener("resize", redraw);
  }, [reduced, apply]);

  return (
    <PinnedSection
      id="features"
      viewports={PIN_VIEWPORTS}
      onProgress={onProgress}
      aria-labelledby="runway-heading"
      className="bg-background"
      stageClassName="overflow-hidden"
    >
      <div className="h-full px-5 pb-5 pt-[calc(4rem+28px)] min-[760px]:px-8 min-[760px]:pb-10 min-[760px]:pt-[calc(4rem+52px)]">
        <div className="mx-auto flex h-full max-w-6xl flex-col gap-4 min-[760px]:gap-8">
          <div className="grid items-end gap-x-10 gap-y-3 min-[1024px]:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div>
              <p className="text-sm font-semibold text-primary">The cash flow product</p>
              <h2
                id="runway-heading"
                className="mt-3 text-balance text-[28px] font-bold leading-[1.08] tracking-[-0.025em] text-foreground min-[760px]:text-[42px]"
              >
                From the macro view <span className="text-primary">to the day it hits.</span>
              </h2>
            </div>
            <p className="text-pretty text-sm leading-[1.55] text-muted-foreground min-[760px]:text-base">
              Three moves, one cash flow view. Project, ask, get pinged. So you never find out about a cash crunch from a bank
              balance.
            </p>
          </div>

          <div
            className={cn(
              "grid min-h-0 flex-1 gap-5 min-[1024px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] min-[1024px]:gap-14",
              // Unpinned with all three steps stacked, the copy column is tall:
              // keep the chart at the top beside it instead of floating mid-way.
              reduced ? "items-start" : "items-center",
            )}
          >
            {/* Copy: step tabs, then the active step (all three in the HTML). */}
            <div className="order-2 min-w-0 min-[1024px]:order-1">
              <div className={cn("grid grid-cols-3 gap-3", reduced && "hidden")}>
                {STEPS.map((s, i) => (
                  <div key={s.eyebrow} className="flex flex-col gap-2">
                    <div className="h-0.5 overflow-hidden rounded-sm bg-border">
                      <div ref={(el) => (fills.current[i] = el)} className="h-full w-0 bg-foreground" />
                    </div>
                    <span className={cn("text-[13px] font-semibold transition-colors duration-300", i === act ? "text-primary" : "text-muted-foreground")}>
                      <span className="font-mono text-[11px]">{`0${i + 1}`}</span> {s.eyebrow}
                    </span>
                  </div>
                ))}
              </div>
              <div className={cn("mt-3.5 grid min-[760px]:mt-7", reduced && "mt-0 gap-10 min-[760px]:mt-0")}>
                {STEPS.map((s, i) => {
                  const on = reduced || i === act;
                  return (
                    <div
                      key={s.eyebrow}
                      aria-hidden={!on}
                      className={cn(
                        "transition-[opacity,transform] duration-[450ms] ease-out",
                        !reduced && "[grid-area:1/1]",
                        on ? "translate-y-0 opacity-100" : i < act ? "pointer-events-none -translate-y-3 opacity-0" : "pointer-events-none translate-y-3 opacity-0",
                      )}
                    >
                      <h3 className="text-balance text-[22px] font-bold leading-[1.15] tracking-[-0.02em] text-foreground min-[760px]:text-[28px]">
                        {s.headline} <span className="text-primary">{s.highlight}</span>
                      </h3>
                      <p className="mt-3.5 text-pretty text-sm leading-[1.6] text-muted-foreground min-[760px]:text-[15.5px]">{s.description}</p>
                      <ul className="mt-5 hidden flex-col gap-2.5 border-t border-border pt-4 min-[760px]:flex">
                        {s.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-3 text-[14.5px] leading-[1.5] text-foreground">
                            <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart card (decorative). */}
            <div
              aria-hidden
              className="order-1 min-w-0 rounded-[18px] border border-forest-border bg-forest p-3.5 text-forest-foreground shadow-[0_30px_60px_-30px_rgba(15,28,22,.55)] min-[760px]:p-5 min-[1024px]:order-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-semibold">Cash flow</span>
                <div className="flex gap-0.5 rounded-full border border-forest-border bg-forest-raised p-[3px]">
                  {LEVELS.map((t, i) => (
                    <span
                      key={t}
                      className={cn(
                        "rounded-full px-2.5 py-1 font-mono text-[10.5px] transition-colors duration-300",
                        i === level ? "bg-primary text-primary-foreground" : "text-forest-muted",
                      )}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div ref={chart} className="relative mt-3.5 h-[200px] min-[760px]:mt-5 min-[760px]:h-[230px] min-[1024px]:h-[270px]">
                <div className="absolute inset-x-0 top-0 border-t border-[#1E3329]" />
                <div className="absolute inset-x-0 top-[33%] border-t border-[#1E3329]" />
                <div className="absolute inset-x-0 top-[66%] border-t border-[#1E3329]" />
                <div className="absolute inset-x-0 bottom-0 border-t border-forest-border" />
                {BASE.map((_, i) => (
                  <div
                    key={i}
                    ref={(el) => (bars.current[i] = el)}
                    className={cn("absolute bottom-0 rounded-t-[3px]", i === HIGHLIGHT_BAR && highlight ? "bg-sage-light" : "bg-[#2C5A43]")}
                  />
                ))}
                <svg width="100%" height="100%" className="absolute inset-0 overflow-visible">
                  <path ref={basePath} fill="none" stroke="#48D88A" strokeWidth={2.25} strokeLinejoin="round" strokeLinecap="round" />
                  <path
                    ref={scenPath}
                    fill="none"
                    stroke="#F0B44C"
                    strokeWidth={2.25}
                    strokeDasharray="6 5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </svg>
                <div ref={floor} className="absolute left-0 w-0 border-t-[1.5px] border-dashed border-alert" style={{ top: `${100 - pct(FLOOR)}%` }} />
                <span
                  ref={floorLabel}
                  className="absolute left-1 translate-y-1 font-mono text-[10px] text-alert opacity-0"
                  style={{ top: `${100 - pct(FLOOR)}%` }}
                >
                  Cash floor
                </span>
                <div
                  ref={dot}
                  className="absolute -ml-[7px] -mt-[7px] h-3.5 w-3.5 scale-0 rounded-full bg-alert shadow-[0_0_0_6px_rgba(229,115,90,.22)]"
                  style={{ left: `${((ALERT_W + 0.5) / 24) * 100}%`, top: `${100 - pct(SCEN[ALERT_W])}%` }}
                />

                {/* Drill-down inset: the week the annual contract lands. */}
                <div
                  ref={inset}
                  className="absolute w-[150px] origin-bottom rounded-xl bg-card px-3 py-2.5 text-foreground opacity-0 shadow-[0_18px_30px_-16px_rgba(0,0,0,.6)] min-[760px]:w-[180px]"
                  style={{ left: `${Math.min(82, Math.max(30, (9.5 / 24) * 100))}%`, bottom: `calc(${pct(BASE[HIGHLIGHT_BAR])}% + 14px)` }}
                >
                  <div className="font-mono text-[10px] text-muted-foreground">Week of Mar 9 · daily</div>
                  <div className="relative mt-2 h-12 border-b border-border">
                    {WEEK7.map((hgt, i) => (
                      <div
                        key={i}
                        className={cn("absolute bottom-0 w-[10%] rounded-t-sm", i === 3 ? "bg-primary" : "bg-[#D9CFB4]")}
                        style={{ left: `${i * 14.5 + 2.75}%`, height: `${hgt}%` }}
                      />
                    ))}
                  </div>
                  <div className="relative mt-1 h-3 font-mono text-[9px] text-muted-foreground">
                    {"MTWTFSS".split("").map((t, i) => (
                      <span key={i} className="absolute w-[10%] text-center" style={{ left: `${i * 14.5 + 2.75}%` }}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-1.5 text-[11.5px] font-semibold text-sage-dark">Thu · annual contract lands</div>
                </div>

                {/* Scenario question, typed. */}
                <div
                  ref={bubble}
                  className="absolute left-2.5 top-2.5 max-w-[86%] rounded-[14px_14px_14px_4px] bg-card px-[13px] py-2.5 text-xs leading-[1.45] text-foreground opacity-0 shadow-[0_18px_30px_-16px_rgba(0,0,0,.6)] min-[760px]:max-w-[62%] min-[760px]:text-[13px]"
                >
                  <span className="mb-1 block text-[11px] font-semibold text-sage-dark">You asked</span>
                  <span ref={typed} />
                  <span ref={caret} className="ml-px inline-block h-[1em] w-px bg-foreground align-[-2px] opacity-0" />
                </div>

                {/* Slack alert. */}
                <div
                  ref={slack}
                  className="absolute left-2.5 top-2.5 w-[190px] rounded-xl bg-white px-3.5 py-3 text-foreground opacity-0 shadow-[0_20px_40px_-16px_rgba(0,0,0,.65)] min-[760px]:w-[270px]"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-sage-dark text-[11px] font-bold text-forest-foreground">Z</span>
                    <span className="text-[12.5px] font-bold">Zensus</span>
                    <span className="whitespace-nowrap font-mono text-[10px] text-muted-foreground">#finance · now</span>
                  </div>
                  <p className="mt-2 text-[11.5px] leading-[1.45] min-[760px]:text-[12.5px]">
                    Projected balance drops below your cash floor the week of Feb 23.
                  </p>
                  <div className="mt-2.5 hidden gap-1.5 min-[760px]:flex">
                    <span className="rounded-md border border-border px-2.5 py-1 text-[11px] font-semibold">Snooze</span>
                    <span className="rounded-md border border-border px-2.5 py-1 text-[11px] font-semibold">Adjust threshold</span>
                  </div>
                </div>
              </div>

              <div className="mt-2 grid grid-cols-6 font-mono text-[10px] text-forest-muted-faint">
                {MONTHS.map((m) => (
                  <span key={m} className="text-center">
                    {m}
                  </span>
                ))}
              </div>
              <div className="mt-2.5 flex gap-4 font-mono text-[10px] text-forest-muted">
                <span className="flex items-center gap-1.5">
                  <span className="h-0.5 w-3.5 bg-sage-light" />
                  Projected balance
                </span>
                <span ref={legend} className="flex items-center gap-1.5 opacity-50">
                  <span className="w-3.5 border-t-2 border-dashed border-scenario" />
                  Scenario
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PinnedSection>
  );
};

export default RunwayFeature;
