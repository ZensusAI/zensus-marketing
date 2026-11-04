import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { EVENTS, track } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";

/*
 * Problem section from handoff 19 (locked 43a desktop, 44a mobile, 4 Nov
 * 2026), replacing 13b. One screen, not pinned: "Which sounds like your
 * week?" with the four live problems. From 760px they are tabs beside a
 * forest panel showing the picked one; below 760px they are an accordion
 * whose open card turns forest.
 *
 * One DOM serves both layouts, so every title, stat, line, body, guide link
 * and source is in the prerendered HTML exactly once. Each item is a wrapper
 * (the accordion card on phones) holding a button and its body; from 760px
 * the wrapper is display: contents, so buttons stack in the left column and
 * all four bodies share the right column's grid cell, with only the selected
 * one displayed (index.css, .problem-*). Phones collapse closed bodies with
 * CSS, not by removing them.
 *
 * Copy is verbatim from the live section (13b). Every stat is checked against
 * its source; see docs/problem-section-stats-2026-10-21.md (the 96% line is
 * corrected there). The subhead's "cash answer" became "cash flow forecast"
 * (approved in the handoff, 4 Nov 2026).
 *
 * Semantics are an accordion (button aria-expanded + region) at every width,
 * with arrow keys between headers. The handoff asks for tabs from 760px, but
 * a tablist cannot contain its panels, and the single DOM puts each panel
 * beside its button.
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
      to: "/blog/how-to-build-a-13-week-cash-flow-forecast-in-excel#excel-vs-automated-forecasting-tools",
      label: "Excel vs automated forecasting tools",
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

const WIDE = "(min-width: 760px)";

const Problem = () => {
  const base = useId();
  // Desktop always shows one item; phones may close them all. `open` is the
  // phone state, `shown` what the desktop panel shows (the last pick).
  const [open, setOpen] = useState<number | null>(0);
  const [shown, setShown] = useState(0);
  // From 760px one item is always shown (a pick cannot close it); below,
  // tapping the open card closes it. The prerender is wide.
  const [wide, setWide] = useState(true);
  const seen = useRef(new Set([0]));
  const [seenCount, setSeenCount] = useState(1);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia(WIDE);
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const pick = (i: number) => {
    const closing = !wide && open === i;
    setOpen(closing ? null : i);
    setShown(i);
    if (closing) return;
    track(EVENTS.PROBLEM_PICK, { item: i + 1, viewport: wide ? "desktop" : "mobile" });
    if (!seen.current.has(i)) {
      seen.current.add(i);
      setSeenCount(seen.current.size);
      if (seen.current.size === CARDS.length) track(EVENTS.PROBLEM_EXPLORED_ALL);
    }
  };

  // Arrow keys move between the headers (the accordion pattern allows it);
  // from 760px they also select, like tabs.
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = CARDS.length - 1;
    const next =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? (i === last ? 0 : i + 1)
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? (i === 0 ? last : i - 1)
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    tabs.current[next]?.focus();
    if (wide) pick(next);
  };

  return (
    <section
      id="cash-flow-problems"
      aria-labelledby={`${base}-h`}
      className="problem-grid relative mx-auto bg-background px-5 py-16 min-[760px]:grid min-[760px]:min-h-[640px] min-[760px]:max-w-[1280px] min-[760px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] min-[760px]:grid-rows-[1fr_auto_auto_auto_auto_auto_1fr] min-[760px]:gap-x-10 min-[760px]:px-8 min-[760px]:py-24 min-[1024px]:gap-x-16 min-[1280px]:grid-cols-[minmax(0,1fr)_minmax(0,560px)]"
    >
      <div className="min-[760px]:col-start-1 min-[760px]:row-start-2">
        <p className="text-sm font-semibold text-primary min-[760px]:text-[15px]">The problem</p>
        <h2
          id={`${base}-h`}
          className="mt-2.5 text-balance text-[32px] font-bold leading-[1.08] tracking-[-0.03em] text-foreground min-[760px]:mt-4 min-[760px]:text-[40px] min-[760px]:leading-[1.06] min-[760px]:tracking-[-0.035em] min-[1024px]:text-[48px]"
        >
          The balance tells you today. Every decision is about{" "}
          <span className="underline decoration-primary decoration-4 underline-offset-[6px] min-[760px]:decoration-[5px] min-[760px]:underline-offset-8">
            week six.
          </span>
        </h2>
        <p className="mt-3.5 max-w-[500px] text-pretty text-base leading-[1.5] text-muted-foreground min-[760px]:mt-5 min-[760px]:text-[17px] min-[760px]:leading-[1.55]">
          Whether you run the company or advise it, the cash flow forecast still comes from exports and a spreadsheet
          that's out of date by Friday.
        </p>
        <div className="mt-6 flex items-baseline justify-between gap-3 min-[760px]:mb-3 min-[760px]:mt-8">
          <p id={`${base}-q`} className="text-[15px] font-semibold text-foreground">
            Which sounds like your week?
          </p>
          <span className="text-[12.5px] text-muted-foreground min-[760px]:hidden" aria-live="polite">
            {seenCount} of {CARDS.length} explored
          </span>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 min-[760px]:contents">
        {CARDS.map((card, i) => {
          const isOpen = wide ? shown === i : open === i;
          const btnId = `${base}-t${i}`;
          const bodyId = `${base}-p${i}`;
          return (
            <div key={card.title} data-open={isOpen || undefined} className="problem-item">
              <h3 className="m-0 min-[760px]:col-start-1" style={{ gridRowStart: i + 3 }}>
                <button
                  ref={(el) => (tabs.current[i] = el)}
                  id={btnId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={bodyId}
                  onClick={() => pick(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  className="problem-tab flex min-h-[52px] w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-[15px] font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                >
                  {card.title}
                  <span aria-hidden className="problem-icon shrink-0 text-lg leading-none" />
                </button>
              </h3>
              <div
                id={bodyId}
                role="region"
                aria-labelledby={btnId}
                className="problem-body"
              >
                <div className="problem-body-inner">
                  <div className="problem-body-content">
                    <p className="m-0 text-[72px] font-semibold leading-[.9] tracking-[-0.05em] text-sage-light min-[760px]:text-[96px] min-[1024px]:text-[120px]">
                      {card.n}%
                    </p>
                    <p className="mt-3 text-pretty text-base leading-[1.45] text-forest-foreground min-[760px]:mt-5 min-[760px]:text-[19px] min-[760px]:leading-[1.4] min-[1024px]:text-[21px]">
                      {card.statLine}
                    </p>
                    <p className="mt-3 border-t border-forest-border pt-3 text-pretty text-sm leading-[1.5] text-forest-muted-strong min-[760px]:mt-6 min-[760px]:pt-5 min-[760px]:text-base min-[760px]:leading-[1.55]">
                      {card.body}
                    </p>
                    <Link
                      to={card.guide.to}
                      onClick={() => track(EVENTS.PROBLEM_GUIDE_CLICK, { item: i + 1 })}
                      className="mt-3.5 flex min-h-[44px] items-center text-[15px] font-semibold text-sage-light underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-light focus-visible:ring-offset-2 focus-visible:ring-offset-forest min-[760px]:mt-6 min-[760px]:inline-flex min-[760px]:min-h-0 min-[760px]:text-base"
                    >
                      {card.guide.label}
                    </Link>
                    <a
                      href={card.url}
                      target="_blank"
                      rel="noopener"
                      className="flex min-h-[24px] items-center self-start text-xs text-forest-muted underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-light min-[760px]:mt-4 min-[760px]:text-[13px]"
                    >
                      {card.src} ↗<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Problem;
