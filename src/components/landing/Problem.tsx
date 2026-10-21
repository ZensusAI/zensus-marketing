import { Fragment, useCallback, useRef, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { clamp01 } from "@/lib/motion";

/*
 * Problem section from handoff 06-problem (locked 13b): a stat-led problem
 * for owners, fractional CFOs and finance leaders. Not pinned. Everything
 * starts as a faint blurred ghost and sharpens as it enters: the headline
 * words focus in sequence and a green underline draws under "week six.", and
 * each column's stat rolls like an odometer to its value. Values follow the
 * handoff's renderVals() (variant b). Columns: 4 from 1100px, 2 from 760px,
 * 1 below (the handoff's own switches).
 *
 * Every stat is checked against its source; see
 * docs/problem-section-stats-2026-10-21.md (the 96% line is corrected there).
 * The odometer's digit reels are CSS-generated content, so the text a crawler
 * reads is the real figure ("39%"), not ten digits per reel.
 * Reduced motion: final state in CSS (index.css, .problem-*).
 */

const QB = "https://quickbooks.intuit.com/r/small-business-data/small-business-late-payments-report-2026/";
const AFP =
  "https://www.financialprofessionals.org/training-resources/resources/articles/Details/benchmarks-for-financial-professionals-20-key-stats-on-salaries-fraud-and-tech";
const VENA = "https://www.venasolutions.com/blog/fpa-trends-predictions";

const CARDS = [
  {
    n: 39,
    title: "When does the cash run out?",
    body: "A balance is a number. The question is a date, and it moves every time a customer pays late.",
    statLine: "of small business owners say one late payment made it hard to cover payroll or bills in the past year.",
    src: "QuickBooks Late Payments Report 2026",
    url: QB,
    guide: { to: "/blog/zero-cash-date-for-founders", label: "Find your zero-cash date" },
  },
  {
    n: 61,
    title: "The forecast is only as current as the last export",
    body: "Bank, ledger and CRM CSVs go stale the day they download, and someone has to paste them back together.",
    statLine: "of FP&A professionals say lack of data reliability is their main hurdle.",
    src: "AFP FP&A Benchmarking Survey 2025",
    url: AFP,
    guide: {
      to: "/blog/how-to-build-a-13-week-cash-flow-forecast-in-excel#when-does-a-spreadsheet-stop-being-enough",
      label: "When a spreadsheet stops being enough",
    },
  },
  {
    n: 96,
    title: "\"Can we afford the hire?\"",
    body: "Testing it means copying the model and editing every row the decision touches, before the call ends.",
    // The source says "still used ... for planning", with no frequency.
    statLine: "of FP&A professionals still use spreadsheets for planning.",
    src: "AFP Benchmarks for Financial Professionals 2025",
    url: AFP,
    guide: { to: "/tools/runway-calculator", label: "Test a hire in the runway calculator" },
  },
  {
    n: 52,
    title: "Annual contracts don't arrive monthly",
    body: "Flat monthly estimates hide the quarter when a renewal lands three weeks late.",
    statLine: "of finance leaders say revenue forecasts miss actuals by more than 6%.",
    src: "Vena FP&A Impact Report 2026",
    url: VENA,
    guide: { to: "/blog/arr-vs-cash-for-founders", label: "Why ARR and cash disagree" },
  },
];

const WORDS = "The balance tells you today. Every decision is about week six.".split(" ");
const UNDERLINED_FROM = 9; // "week six."

const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
const st = (k: number, s: number, d: number) => easeOut((k - s) / d);
// Faint blurred ghost to sharp: opacity from a floor, blur down to 0. Once
// sharp, the filter is removed entirely (a leftover blur(0px) still costs a
// filter layer on every frame).
const ghost = (el: HTMLElement | null, k: number, floor: number, blur: number) => {
  if (!el) return;
  el.style.opacity = (floor + (1 - floor) * k).toFixed(3);
  el.style.filter = k >= 0.999 ? "" : `blur(${((1 - k) * blur).toFixed(2)}px)`;
};

type CardRefs = {
  col: HTMLDivElement | null;
  rule: HTMLDivElement | null;
  stat: HTMLSpanElement | null;
  line: HTMLParagraphElement | null;
  divider: HTMLDivElement | null;
  title: HTMLHeadingElement | null;
  body: HTMLParagraphElement | null;
  src: HTMLDivElement | null;
};

const Problem = () => {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const kicker = useRef<HTMLParagraphElement>(null);
  const words = useRef<(HTMLSpanElement | null)[]>([]);
  const sub = useRef<HTMLParagraphElement>(null);
  const foot = useRef<HTMLParagraphElement>(null);
  const cards = useRef<CardRefs[]>(CARDS.map(() => ({ col: null, rule: null, stat: null, line: null, divider: null, title: null, body: null, src: null })));

  // Each piece is driven by its own position in the viewport, as in the
  // handoff (head and each column enter on their own schedule). Every rect is
  // read before any style is written, so the frame forces one layout, not one
  // per card.
  const onFrame = useCallback(() => {
    const vh = window.innerHeight;
    const per = window.innerWidth < 760 ? 1 : window.innerWidth < 1100 ? 2 : 4;
    const rel = (el: Element | null) => (el ? el.getBoundingClientRect().top : vh);
    const headTop = rel(head.current);
    const colTops = cards.current.map((c) => rel(c.col));

    const hk = clamp01((vh - headTop - vh * 0.08) / (vh * 0.45));
    if (kicker.current) {
      const k = st(hk, 0, 0.3);
      kicker.current.style.opacity = k.toFixed(3);
      kicker.current.style.transform = `translateY(${((1 - k) * 10).toFixed(1)}px)`;
    }
    const u = st(hk, 0.7, 0.3);
    words.current.forEach((el, i) => {
      if (!el) return;
      ghost(el, st(hk * 1.5 - i * 0.05, 0, 0.35), 0.12, 10);
      if (i >= UNDERLINED_FROM) el.style.backgroundSize = `${(u * 100).toFixed(1)}% 0.12em`;
    });
    ghost(sub.current, st(hk, 0.45, 0.4), 0.15, 8);

    let lastK = 0;
    cards.current.forEach((c, i) => {
      const raw = clamp01((vh - colTops[i] - vh * 0.06) / (vh * 0.5));
      const lag = per > 1 ? (i % per) * 0.12 : 0;
      const k = clamp01((raw - lag) / (1 - lag * 1.2));
      if (i === CARDS.length - 1) lastK = k;
      const g = (s: number) => st(k, s, 0.45);
      if (c.rule) c.rule.style.transform = `scaleX(${st(k, 0, 0.5).toFixed(3)})`;
      if (c.stat) {
        c.stat.style.setProperty("--roll", easeOut(clamp01(k / 0.75)).toFixed(3));
        ghost(c.stat, g(0), 0.15, 6);
      }
      ghost(c.line, g(0.1), 0.12, 6);
      if (c.divider) c.divider.style.transform = `scaleX(${st(k, 0.2, 0.4).toFixed(3)})`;
      ghost(c.title, g(0.25), 0.12, 6);
      ghost(c.body, g(0.35), 0.12, 6);
      if (c.src) c.src.style.opacity = g(0.5).toFixed(3);
    });
    if (foot.current) foot.current.style.opacity = st(lastK, 0.6, 0.4).toFixed(3);
  }, []);

  useScrollProgress(sectionRef, { disabled: reduced, onProgress: onFrame });

  return (
    <section
      ref={sectionRef}
      id="problem"
      aria-labelledby="problem-heading"
      className="bg-background px-5 py-16 min-[760px]:px-8 min-[760px]:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div ref={head} className="max-w-[780px]">
          <p ref={kicker} className="problem-reveal text-sm font-semibold text-primary">
            The problem
          </p>
          <h2
            id="problem-heading"
            className="mt-3.5 text-[30px] font-bold leading-[1.1] tracking-[-0.025em] text-foreground min-[760px]:text-[46px]"
          >
            {WORDS.map((word, i) => (
              <Fragment key={i}>
                {i > 0 && " "}
                <span className="inline-block pb-[0.1em] align-bottom">
                  <span
                    ref={(el) => (words.current[i] = el)}
                    className={
                      i >= UNDERLINED_FROM
                        ? "problem-ghost problem-underline inline-block bg-[linear-gradient(#22C573,#22C573)] bg-[length:0%_0.12em] bg-[position:0_92%] bg-no-repeat"
                        : "problem-ghost inline-block"
                    }
                  >
                    {word}
                  </span>
                </span>
              </Fragment>
            ))}
          </h2>
          <p
            ref={sub}
            className="problem-ghost mt-[18px] max-w-[620px] text-pretty text-lg leading-[1.55] text-muted-foreground"
          >
            Whether you run the company or advise it, the cash answer still comes from exports and a spreadsheet that's out
            of date by Friday.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 min-[760px]:grid-cols-2 min-[1100px]:grid-cols-4">
          {CARDS.map((card, i) => {
            const r = cards.current[i];
            const digits = String(card.n).split("");
            return (
              <div
                key={card.n}
                ref={(el) => (r.col = el)}
                className={[
                  "relative flex flex-col gap-3 py-6 min-[760px]:px-6 min-[760px]:py-7",
                  // Rule between columns, never before the first in a row.
                  i % 2 === 1 ? "min-[760px]:border-l min-[760px]:border-border" : "",
                  i === 2 ? "min-[1100px]:border-l min-[1100px]:border-border" : "",
                ].join(" ")}
              >
                <div ref={(el) => (r.rule = el)} aria-hidden className="problem-scale absolute inset-x-0 top-0 h-px origin-left bg-foreground" />
                <span
                  ref={(el) => (r.stat = el)}
                  style={{ "--roll": 0 } as CSSProperties}
                  className="problem-ghost problem-stat flex text-[44px] font-semibold leading-none tracking-[-0.04em] text-sage-dark tabular-nums min-[760px]:text-[52px]"
                >
                  <span className="sr-only">{card.n}%</span>
                  <span aria-hidden className="flex">
                    {digits.map((d, j) => (
                      <span key={j} className="inline-block h-[1em] overflow-hidden">
                        <span style={{ "--d": d } as CSSProperties} className="problem-reel block" />
                      </span>
                    ))}
                    <span className="problem-pct" />
                  </span>
                </span>
                <p ref={(el) => (r.line = el)} className="problem-ghost text-pretty text-sm leading-[1.5] text-foreground">
                  {card.statLine}
                </p>
                <div ref={(el) => (r.divider = el)} aria-hidden className="problem-scale my-1.5 h-px origin-left bg-border" />
                <h3 ref={(el) => (r.title = el)} className="problem-ghost text-lg font-semibold leading-[1.3] tracking-[-0.01em] text-foreground">
                  {card.title}
                </h3>
                <p ref={(el) => (r.body = el)} className="problem-ghost text-pretty text-[15px] leading-[1.55] text-muted-foreground">
                  {card.body}
                </p>
                {/* The guide that goes deeper, then the stat's source.
                    !opacity: a keyboard focus is never left on a faded link. */}
                <div ref={(el) => (r.src = el)} className="problem-reveal mt-auto flex flex-col gap-2 pt-1.5 focus-within:!opacity-100">
                  <Link
                    to={card.guide.to}
                    className="w-fit rounded-sm text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {card.guide.label} →
                  </Link>
                  <a
                    href={card.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-fit rounded-sm font-mono text-[11px] tracking-[0.04em] text-muted-foreground hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {card.src}{"\u00a0"}↗
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <p ref={foot} className="problem-reveal mt-9 text-sm text-muted-foreground focus-within:!opacity-100">
          Annual contracts, seasonal income, late-paying clients:{" "}
          <Link to="/use-cases" className="font-medium text-primary underline-offset-4 hover:underline">
            see who uses Zensus and what it solves
          </Link>
          .
        </p>
      </div>
    </section>
  );
};

export default Problem;
