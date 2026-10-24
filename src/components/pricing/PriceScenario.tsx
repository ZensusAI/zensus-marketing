import { useCallback, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { useStaticPins } from "@/hooks/use-prefers-reduced-motion";
import type { ScrollProgress } from "@/hooks/use-scroll-progress";
import { PinnedSection } from "@/components/landing/PinnedSection";
import { START_TRIAL_URL } from "@/lib/constants";
import { trackCtaClick } from "@/lib/analytics/events";
import { clamp01, easeInOutCubic as ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { PRIMARY_BUTTON, SQUIRCLE } from "./styles";

/*
 * Pricing scroll section, handoff 14-pricing variant 27a: the price as a
 * Zensus scenario. A question types into the ask bar, the bar rises, and a
 * forecast chart draws what Pro costs: $0 through the 14-day trial, then $199
 * a month. The numbers are real; the chart is illustrative.
 *
 * Pinned for 1.6 viewports of scroll past the stage. Under static pins
 * (reduced motion or a short viewport) and in the prerendered HTML it is the
 * finished end state: no inline styles are written until apply() runs, and
 * every word (the full question included) is in the markup from the start.
 */

const QUESTION = "What if we add Zensus Pro?";

// Chart space, in % of the chart box: days 0 to 80 across, dollars 0 to 700
// up, with a left gutter for the axis labels.
const GX = 7;
const XMAX = 80;
const YMAX = 700;
const TOP = 12;
const BOT = 96;
const px = (d: number) => GX + (d / XMAX) * (100 - GX - 1);
const py = (v: number) => BOT - (v / YMAX) * (BOT - TOP);

// Cumulative amount paid: free to day 14, $199 on day 15 and every 30 days.
const STEP: [number, number][] = [
  [0, 0],
  [15, 0],
  [15, 199],
  [45, 199],
  [45, 398],
  [75, 398],
  [75, 597],
  [80, 597],
];
const STEP_D = "M" + STEP.map(([d, v]) => `${(px(d) * 10).toFixed(1)} ${py(v).toFixed(2)}`).join(" L");
const DOTS: [number, number, number][] = [
  [15, 199, 0.5],
  [45, 398, 0.72],
  [75, 597, 0.92],
];
const Y_TICKS = [0, 200, 400, 600];
const X_TICKS: [number, string][] = [
  [0, "Day 0"],
  [14, "14"],
  [45, "Day 45"],
  [75, "Day 75"],
];

const NOTE_TRIAL = "Trial ends on day 14. We email you first; cancel before and pay nothing.";
const NOTE_CANCEL = "No contract. Cancel anytime and the line stops.";

/** Pin length: the stage plus 1.6 viewports of scroll. */
const PIN_VIEWPORTS = 2.6;

const PriceScenario = () => {
  const reduced = useStaticPins();

  const ask = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const typed = useRef<HTMLSpanElement>(null);
  const caret = useRef<HTMLSpanElement>(null);
  const send = useRef<HTMLSpanElement>(null);
  const below = useRef<HTMLDivElement>(null);
  const answer = useRef<HTMLParagraphElement>(null);
  const chart = useRef<HTMLDivElement>(null);
  const band = useRef<HTMLDivElement>(null);
  const bandLabel = useRef<HTMLSpanElement>(null);
  const line = useRef<SVGSVGElement>(null);
  const dots = useRef<(HTMLDivElement | null)[]>([]);
  const notes = useRef<(HTMLDivElement | null)[]>([]);
  const cta = useRef<HTMLDivElement>(null);
  const caption = useRef<HTMLParagraphElement>(null);
  // Height of the content under the ask bar, kept by a ResizeObserver so the
  // scroll handler never reads layout. The bar starts centred over it.
  const belowH = useRef(480);
  const lastP = useRef(1);

  const apply = useCallback((p: number) => {
    lastP.current = p;
    const kq = clamp01(p / 0.12);
    const press = Math.sin(Math.PI * clamp01((p - 0.125) / 0.035));
    const ks = ease((p - 0.16) / 0.1);
    const ka = ease((p - 0.24) / 0.07);
    const kx = ease((p - 0.26) / 0.07);
    const kb = ease((p - 0.32) / 0.1);
    const kl = clamp01((p - 0.38) / 0.34);
    const kc = ease((p - 0.82) / 0.1);

    if (typed.current) typed.current.textContent = QUESTION.slice(0, Math.round(kq * QUESTION.length));
    if (caret.current) caret.current.style.opacity = ks < 0.5 ? "1" : "0";
    if (ask.current) {
      ask.current.style.transform = `translateY(${((1 - ks) * (belowH.current / 2 + 16)).toFixed(1)}px) scale(${(1 + 0.04 * (1 - ks)).toFixed(3)})`;
    }
    if (bar.current) {
      bar.current.style.boxShadow = `0 0 0 ${((1 - ks) * 6).toFixed(1)}px rgba(34,197,115,.16)`;
      bar.current.style.borderColor = ks < 0.5 ? "#22C573" : "";
    }
    if (send.current) {
      send.current.style.background = kq >= 1 ? "" : "#C9BB93";
      send.current.style.transform = `scale(${(1 - 0.14 * press).toFixed(3)})`;
    }
    if (below.current) {
      below.current.style.opacity = ks.toFixed(3);
      below.current.style.transform = `translateY(${((1 - ks) * 48).toFixed(1)}px)`;
    }
    if (answer.current) {
      answer.current.style.opacity = ka.toFixed(3);
      answer.current.style.transform = `translateY(${((1 - ka) * 8).toFixed(1)}px)`;
    }
    if (chart.current) chart.current.style.opacity = kx.toFixed(3);
    if (band.current) band.current.style.transform = `scaleX(${kb.toFixed(3)})`;
    if (bandLabel.current) bandLabel.current.style.opacity = kb.toFixed(3);
    // The line only moves rightward, so revealing it left to right is
    // drawing it. (A pathLength dash does not survive non-scaling-stroke.)
    if (line.current) line.current.style.clipPath = `inset(-8px ${((1 - kl) * 100).toFixed(2)}% -8px -8px)`;
    dots.current.forEach((el, i) => {
      if (el) el.style.transform = `scale(${ease((p - DOTS[i][2]) / 0.05).toFixed(3)})`;
    });
    [0.52, 0.62, 0.86].forEach((at, i) => {
      const el = notes.current[i];
      if (!el) return;
      const k = ease((p - at) / 0.07);
      el.style.opacity = k.toFixed(3);
      el.style.translate = `0 ${((1 - k) * 8).toFixed(1)}px`;
    });
    if (cta.current) {
      cta.current.style.opacity = kc.toFixed(3);
      cta.current.style.transform = `translateY(${((1 - kc) * 10).toFixed(1)}px)`;
    }
    if (caption.current) caption.current.style.opacity = kc.toFixed(3);
  }, []);

  const onProgress = useCallback(({ progress }: ScrollProgress) => apply(progress), [apply]);

  useEffect(() => {
    const el = below.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      belowH.current = el.offsetHeight;
      apply(lastP.current);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [apply]);

  // Static pins: draw the end state once (the scroll listener never runs).
  useEffect(() => {
    if (reduced) apply(1);
  }, [reduced, apply]);

  return (
    <>
      <section className="border-t border-border px-[18px] pb-2 pt-11 text-center min-[760px]:px-10 min-[760px]:pt-20">
        <div className="mx-auto flex max-w-[780px] flex-col items-center gap-4">
          <h2
            id="price-scenario-heading"
            className="text-balance text-[32px] font-semibold leading-[1.05] tracking-[-0.035em] text-foreground min-[760px]:text-[48px]"
          >
            Run the numbers on us.
          </h2>
          <p className="max-w-[580px] text-pretty text-base leading-[1.55] text-muted-foreground min-[760px]:text-[19px]">
            Ask Zensus what Pro costs and it answers the way it answers everything else: as a line on your forecast.
          </p>
        </div>
      </section>

      <PinnedSection viewports={PIN_VIEWPORTS} onProgress={onProgress} aria-labelledby="price-scenario-heading">
        <div
          className={cn(
            "flex h-full items-center px-[18px] min-[760px]:px-10",
            reduced ? "py-10 min-[760px]:py-14" : "pt-16",
          )}
        >
          <div
            className={cn(
              "mx-auto w-full max-w-[1080px] rounded-[35px] border border-border bg-card p-4 shadow-[0_30px_60px_-36px_rgba(15,28,22,.35)] min-[760px]:p-[30px]",
              SQUIRCLE,
            )}
          >
            <div ref={ask} className="relative z-[2] origin-center">
              <div
                ref={bar}
                className={cn(
                  "flex h-14 items-center gap-2.5 rounded-full border border-border bg-background pl-5 pr-[9px] transition-[border-color] duration-200",
                  SQUIRCLE,
                )}
              >
                <span className="min-w-0 flex-1 truncate text-[15px] text-foreground min-[760px]:text-[17px]">
                  <span ref={typed}>{QUESTION}</span>
                  {/* Shown while the question types (opacity set by scroll); the
                      blink runs on the inner bar so it cannot override that. */}
                  <span ref={caret} aria-hidden className="ml-0.5 inline-block align-[-2px] opacity-0">
                    <span className="block h-[1.05em] w-0.5 animate-caret-blink bg-sage-dark motion-reduce:animate-none" />
                  </span>
                </span>
                <span
                  ref={send}
                  aria-hidden
                  className={cn(
                    "flex h-10 w-10 flex-none items-center justify-center rounded-full bg-sage-dark text-base text-card transition-[background-color] duration-200",
                    SQUIRCLE,
                  )}
                >
                  ↑
                </span>
              </div>
            </div>

            <div ref={below}>
              <p
                ref={answer}
                className="mx-1 mt-4 text-pretty text-[17px] font-medium leading-[1.45] text-foreground min-[760px]:text-[22px]"
              >
                Free for 14 days, then <span className="text-sage-dark">$199 a month</span>, billed monthly. Cancel anytime and
                the line stops.
              </p>

              <div ref={chart} className="relative mt-[18px] h-[250px] min-[760px]:h-[300px]">
                <span className="absolute -top-0.5 left-0 text-xs text-muted-foreground">Total paid to Zensus</span>
                {Y_TICKS.map((v) => (
                  <div key={v} aria-hidden>
                    <div className="absolute right-0 border-t border-dashed border-border" style={{ left: `${GX}%`, top: `${py(v)}%` }} />
                    <span
                      className="absolute left-0 -translate-y-1/2 font-mono text-[11px] text-muted-foreground"
                      style={{ top: `${py(v)}%` }}
                    >
                      ${v}
                    </span>
                  </div>
                ))}
                <div
                  ref={band}
                  aria-hidden
                  className="absolute origin-left border-l-[1.5px] border-r-[1.5px] border-l-primary border-r-primary bg-primary/[.14] [border-right-style:dashed]"
                  style={{ left: `${GX}%`, top: `${TOP - 6}%`, bottom: `${100 - BOT}%`, width: `${px(14) - GX}%` }}
                />
                <span
                  ref={bandLabel}
                  className="absolute -translate-x-1/2 whitespace-nowrap text-[12.5px] font-semibold text-sage-dark"
                  style={{ left: `${(GX + px(14)) / 2}%`, top: `${TOP - 2}%` }}
                >
                  <span className="min-[760px]:hidden">Free</span>
                  <span className="max-[759px]:hidden">14 days free</span>
                </span>
                <svg
                  ref={line}
                  viewBox="0 0 1000 100"
                  preserveAspectRatio="none"
                  aria-hidden
                  className="absolute inset-0 h-full w-full overflow-visible"
                >
                  <path
                    d={STEP_D}
                    fill="none"
                    stroke="hsl(var(--foreground))"
                    strokeWidth={2.5}
                    vectorEffect="non-scaling-stroke"
                    strokeLinejoin="round"
                  />
                </svg>
                {DOTS.map(([d, v], i) => (
                  <div
                    key={d}
                    ref={(el) => (dots.current[i] = el)}
                    aria-hidden
                    className="absolute -ml-[5.5px] -mt-[5.5px] h-[11px] w-[11px] rounded-full border-2 border-card bg-primary shadow-[0_0_0_1px_#22C573]"
                    style={{ left: `${px(d)}%`, top: `${py(v)}%` }}
                  />
                ))}
                <div
                  ref={(el) => (notes.current[0] = el)}
                  className={cn(
                    "absolute max-w-[220px] rounded-2xl bg-card px-[11px] py-2 text-[12.5px] leading-[1.35] text-foreground shadow-[0_6px_16px_-8px_rgba(15,28,22,.35)] max-[759px]:hidden",
                    SQUIRCLE,
                  )}
                  style={{ left: `${px(14) + 1}%`, top: "34%" }}
                >
                  {NOTE_TRIAL}
                </div>
                <div
                  ref={(el) => (notes.current[1] = el)}
                  className={cn(
                    "absolute w-max whitespace-nowrap rounded-2xl bg-forest px-[11px] py-2 text-[12.5px] leading-[1.35] text-forest-foreground shadow-[0_6px_16px_-8px_rgba(15,28,22,.35)]",
                    SQUIRCLE,
                  )}
                  style={{ left: `${px(15) + 1.2}%`, top: `${py(199) + 3}%` }}
                >
                  $199, billed monthly
                </div>
                <div
                  ref={(el) => (notes.current[2] = el)}
                  className={cn(
                    "absolute right-[1%] max-w-[220px] -translate-y-full rounded-2xl bg-card px-[11px] py-2 text-[12.5px] leading-[1.35] text-foreground shadow-[0_6px_16px_-8px_rgba(15,28,22,.35)] max-[759px]:hidden",
                    SQUIRCLE,
                  )}
                  style={{ top: `${py(597) - 4}%` }}
                >
                  {NOTE_CANCEL}
                </div>
                {X_TICKS.map(([d, label]) => (
                  <span
                    key={d}
                    aria-hidden
                    className="absolute -bottom-5 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] text-muted-foreground"
                    style={{ left: `${px(d)}%` }}
                  >
                    {label}
                  </span>
                ))}
              </div>

              {/* Phones: the trial note leaves the chart and sits under it. */}
              <p ref={caption} className="mt-[34px] text-[13.5px] leading-[1.45] text-muted-foreground min-[760px]:hidden">
                {NOTE_TRIAL}
              </p>
              <div
                ref={cta}
                className="mt-3.5 flex flex-wrap items-center gap-x-[18px] gap-y-3 min-[760px]:mt-[38px]"
              >
                <a
                  href={START_TRIAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackCtaClick("pricing_page", { destination: "trial", section: "scenario" })}
                  className={cn(PRIMARY_BUTTON, "px-[30px]")}
                >
                  Start 14-day free trial
                  <ArrowRight size={18} aria-hidden />
                </a>
                <span className="text-[13.5px] text-muted-foreground">
                  No charge today. We email you before your first charge.
                </span>
              </div>
            </div>
          </div>
        </div>
      </PinnedSection>
    </>
  );
};

export default PriceScenario;
