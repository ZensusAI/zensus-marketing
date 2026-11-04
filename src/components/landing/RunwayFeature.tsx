import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { useStaticPinsOrPrerender } from "@/hooks/use-prefers-reduced-motion";
import type { ScrollProgress } from "@/hooks/use-scroll-progress";
import { EVENTS, track } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";
import zensusLogo from "@/assets/zensus-logo-64.webp";
import { PinnedSection } from "./PinnedSection";

/*
 * "The cash flow product" from handoff 20 (locked 45a desktop, 46a mobile,
 * 4 Nov 2026), replacing 15a. Pinned over 4.25 viewports, four questions a
 * finance operator asks, one per scroll step, each answered in a sentence
 * while one chart acts it out: the annual invoice landing in its week, the
 * week traced to its transactions, a hire as a scenario, and a Slack alert
 * under a floor. A rail of four segments fills with scroll; a click jumps to
 * the step.
 *
 * All four steps' text is in the HTML: in the pin they share one grid cell
 * and the inactive ones are transparent and inert. useStaticPins (reduced
 * motion, or a viewport under 720px tall): no pin, the four steps stacked,
 * each with its finished chart.
 *
 * Copy is the handoff's, kept as written at the user's request (4 Nov 2026)
 * although the product does not yet show every part of steps 2 and 4 (a
 * per-row source, a change log, the cause in the Slack message); the team
 * is building them. Every figure, date, invoice number and the Slack text
 * are placeholders from the shared ledger, all in the arrays below.
 */

// ─── Placeholder data (swap for real figures here) ─────────────────────────
const WEEKS = ["Nov 3", "Nov 10", "Nov 17", "Nov 24", "Dec 1", "Dec 8", "Dec 15", "Dec 22", "Dec 29", "Jan 5", "Jan 12", "Jan 19", "Jan 26"];
const BALANCE = [318400, 296200, 305100, 282300, 268900, 290400, 271600, 248100, 412300, 398700, 296500, 284200, 301000];
// Monthly view: [first week, weeks in month] and the month-end balance.
const MONTHS: { label: string; start: number; n: number; end: number }[] = [
  { label: "Nov", start: 0, n: 4, end: 282300 },
  { label: "Dec", start: 4, n: 5, end: 412300 },
  { label: "Jan", start: 9, n: 4, end: 301000 },
];
const MONTH_OF = [0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2];
const INVOICE_WEEK = 8; // Dec 29
// The hire: $16,500 a month from Dec 1, about $3,808 a week.
const SCENARIO = BALANCE.map((v, i) => (i >= 4 ? v - 3808 * (i - 3) : v));
const FLOOR = 250000;
const BREACH = BALANCE.findIndex((v) => v < FLOOR); // Dec 22
const LO = 200000;
const SPAN = 250000; // $200K to $450K
const fmt = (v: number) => `$${Math.round(v).toLocaleString("en-US")}`;
const SCENARIO_END = fmt(Math.round(SCENARIO[12] / 100) * 100);
const TRACE = [
  { name: "Opening balance", amount: "$248,100", src: "Bank · synced 9:42 AM", tone: "text-foreground" },
  { name: "Halvorsen Logistics", amount: "+$164,200", src: "QuickBooks · annual invoice INV-2291, due Dec 28", tone: "text-[hsl(var(--sage-dark))]" },
  { name: "Customer payments", amount: "+$21,400", src: "Bank · 6 transactions", tone: "text-[hsl(var(--sage-dark))]" },
  { name: "Gusto payroll", amount: "−$21,400", src: "Bank · recurring, every 2 weeks", tone: "text-[#A23B2E]" },
];
const ALERT_TEXT = `Cash dips to ${fmt(BALANCE[BREACH])} the week of ${WEEKS[BREACH]}, below your ${fmt(FLOOR)} floor. Halvorsen (+$164,200) lands Dec 29.`;

// ─── Steps ─────────────────────────────────────────────────────────────────
type Beat = "lands" | "trace" | "whatif" | "alerts";
const STEPS: { beat: Beat; rail: string; q: string; s: string; link: { to: string; label: string }; id: string }[] = [
  {
    beat: "lands",
    rail: "When it lands",
    q: "When does the annual contract actually land?",
    s: "Zensus reads billing terms from QuickBooks and HubSpot, so a $164,200 annual invoice shows up in the week it hits your bank, not as twelve equal slices.",
    link: { to: "/blog/arr-vs-cash-for-founders", label: "Why annual contracts and cash disagree" },
    id: "features-annual",
  },
  {
    beat: "trace",
    rail: "Traceable",
    q: "Where did this number come from?",
    s: "Open any week to see every transaction behind it, which system it came from and what changed since last week. Your accountant can check it without asking you.",
    // The handoff's "How Zensus traces every number" has no page yet; the
    // QuickBooks integration page explains where the numbers come from.
    link: { to: "/integrations/quickbooks", label: "How the QuickBooks integration works" },
    id: "features-drill-down",
  },
  {
    beat: "whatif",
    rail: "What if",
    q: "Can we afford the December hire?",
    s: "Type the decision in plain words. Zensus adds it as a scenario and shows every week's balance next to your current plan.",
    link: { to: "/tools/runway-calculator", label: "Test a hire in the runway calculator" },
    id: "features-scenarios",
  },
  {
    beat: "alerts",
    rail: "Alerts",
    q: "Tell me before cash drops below $250K.",
    s: "Set a floor once. If any future week dips under it, Zensus posts to Slack with the date, the amount and the cause.",
    // "How cash alerts work" has no page yet; the Slack integration page
    // covers alerts (the live section's anchor text).
    link: { to: "/integrations/slack", label: "How Slack alerts work" },
    id: "features-alerts",
  },
];
const N = STEPS.length;
const PIN_VIEWPORTS = 4.25;

/**
 * Deep-link targets from the blog and the navbar (/#features,
 * /#features-drill-down, /#features-scenarios, /#features-alerts): each
 * lands on its step's beat in the pin, or on the step itself when static.
 * internal-links.test.ts guards them.
 */
const ANCHORS = STEPS.map((s, i) => ({ id: s.id, at: (i + 0.62) / N }));

// Reveal points within a step (handoff): question 6%, sentence 30%, link
// 55%; the chart's beats at 15%, 25%, 40% and 45%. Progress is quantised to
// these, so React renders only when one is crossed.
const MARKS = [0.06, 0.15, 0.25, 0.3, 0.4, 0.45, 0.55];
const quantise = (p: number) => MARKS.reduce((acc, m) => (p >= m ? m : acc), 0);

interface View {
  split: boolean;
  inv: boolean;
  line: boolean;
  dim: boolean;
  scen: boolean;
  floor: boolean;
  alert: boolean;
  trace: boolean;
  change: boolean;
}
function viewFor(beat: Beat, p: number, step: number): View {
  return {
    split: step > 0 || p > 0.3,
    inv: beat === "lands" && p > 0.3,
    line: beat === "whatif" || beat === "alerts",
    dim: beat !== "lands",
    scen: beat === "whatif" && p > 0.25,
    floor: beat === "alerts" && p > 0.15,
    alert: beat === "alerts" && p > 0.45,
    trace: beat === "trace" && p > 0.15,
    change: beat === "trace" && p > 0.4,
  };
}

// Chart geometry in percent of the plot box: x by week slot, y from $200K.
const SLOT = 100 / 13;
const yPct = (v: number) => 100 - ((v - LO) / SPAN) * 100;
const path = (arr: number[]) =>
  arr.map((v, i) => `${i ? "L" : "M"}${(((i + 0.5) / 13) * 1000).toFixed(1)} ${yPct(v).toFixed(2)}`).join(" ");
const LINE = path(BALANCE);
const SCEN = path(SCENARIO);
const ease = "cubic-bezier(.22,1,.36,1)";

function caption(beat: Beat, p: number): string | null {
  if (beat === "lands" && p > 0.3) return "Halvorsen annual invoice +$164,200 · Dec 29";
  if (beat === "whatif" && p > 0.25) return `Hire Dec 1 · Jan 26: $301,000 → ${SCENARIO_END}`;
  if (beat === "alerts" && p > 0.15) return `Floor ${fmt(FLOOR)} · first breach week of ${WEEKS[BREACH]}`;
  return null;
}

const show = (on: boolean, y = 8): CSSProperties => ({
  opacity: on ? 1 : 0,
  transform: on ? "none" : `translateY(${y}px)`,
  transition: `opacity .5s, transform .6s ${ease}`,
});

function ProductChart({ beat, p, step }: { beat: Beat; p: number; step: number }) {
  const v = viewFor(beat, p, step);
  const cap = caption(beat, p);
  return (
    <div className="relative rounded-[18px] bg-forest px-4 pb-3.5 pt-4 shadow-[0_40px_80px_-40px_rgba(15,28,22,.55)] min-[1024px]:rounded-[20px] min-[1024px]:px-7 min-[1024px]:pb-[22px] min-[1024px]:pt-6">
      <div aria-hidden className="flex items-center justify-between">
        <span className="text-sm font-semibold text-forest-foreground min-[1024px]:text-[15px]">Cash flow</span>
        <span className="flex rounded-full border border-forest-border p-0.5 text-[11.5px] font-medium min-[1024px]:p-[3px] min-[1024px]:text-[12.5px]">
          {["Monthly", "Weekly"].map((l, i) => {
            const on = (i === 1) === v.split;
            return (
              <span
                key={l}
                className={cn("rounded-full px-2.5 py-1 transition-colors duration-300 min-[1024px]:px-3 min-[1024px]:py-[5px]", on ? "bg-primary text-primary-foreground" : "text-forest-muted")}
              >
                {l}
              </span>
            );
          })}
        </span>
      </div>

      {/* Plot: 278x200 on phones, 520x300 from 1024px, both as aspect ratios
          so it shrinks with its column. The axis labels sit in the left
          margin. */}
      <div aria-hidden className="relative ml-10 mt-[18px] aspect-[278/200] max-[1023px]:[@media(max-height:820px)]:aspect-[278/140] min-[1024px]:ml-[52px] min-[1024px]:mt-7 min-[1024px]:aspect-[520/300]">
        {[200000, 300000, 400000].map((g) => (
          <div key={g} className="absolute inset-x-0 border-t border-[#1E3329]" style={{ top: `${yPct(g)}%` }}>
            <span className="absolute -left-10 -top-[7px] font-mono text-[10.5px] text-forest-muted min-[1024px]:-left-[52px] min-[1024px]:text-[11.5px]">
              ${g / 1000}K
            </span>
          </div>
        ))}

        {BALANCE.map((b, i) => {
          // Monthly: every week of a month draws the same month bar, so the
          // split into weeks animates out of it (handoff 45a).
          const m = MONTHS[MONTH_OF[i]];
          const val = v.split ? b : m.end;
          const left = v.split ? i * SLOT + SLOT * 0.2 : m.start * SLOT + SLOT * 0.14;
          const width = v.split ? SLOT * 0.6 : m.n * SLOT - SLOT * 0.28;
          const traced = beat === "trace" && i === INVOICE_WEEK;
          const lit = i === INVOICE_WEEK && (v.inv || traced);
          return (
            <div
              key={i}
              className="absolute bottom-0 rounded-t-[3px] min-[1024px]:rounded-t"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                top: `${yPct(val)}%`,
                background: lit ? "#48D88A" : "#2E5E47",
                opacity: traced ? 1 : v.dim ? 0.32 : 1,
                transition: `all .7s ${ease}`,
              }}
            />
          );
        })}

        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
          <path d={SCEN} fill="none" stroke="#E0A23A" strokeWidth="2.5" strokeDasharray="7 6" vectorEffect="non-scaling-stroke" style={{ opacity: v.scen ? 1 : 0, transition: "opacity .6s" }} />
          <path
            d={LINE}
            fill="none"
            stroke="#48D88A"
            strokeWidth="2.5"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            style={{ clipPath: v.line ? "inset(-20% 0 -20% 0)" : "inset(-20% 100% -20% 0)", transition: "clip-path 1.1s ease" }}
          />
        </svg>

        <div className="absolute inset-x-0 border-t-2 border-dashed border-[#E86A5A]" style={{ top: `${yPct(FLOOR)}%`, opacity: v.floor ? 1 : 0, transition: "opacity .5s" }}>
          <span className="absolute right-0 top-1.5 hidden font-mono text-[11.5px] text-[#F29A8C] min-[1024px]:block">Floor {fmt(FLOOR)}</span>
        </div>
        <div
          className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E86A5A] shadow-[0_0_0_6px_rgba(232,106,90,.25)] min-[1024px]:h-3.5 min-[1024px]:w-3.5 min-[1024px]:shadow-[0_0_0_7px_rgba(232,106,90,.25)]"
          style={{ left: `${(BREACH + 0.5) * SLOT}%`, top: `${yPct(BALANCE[BREACH])}%`, opacity: v.alert ? 1 : 0, transition: "opacity .4s" }}
        />

        {/* Invoice callout (desktop; phones get the caption line). */}
        <div
          className="absolute hidden w-[244px] rounded-[10px] bg-card px-3 py-2.5 text-[12.5px] leading-[1.4] text-foreground shadow-[0_18px_40px_-18px_rgba(0,0,0,.6)] min-[1024px]:block"
          style={{ right: `calc(${100 - INVOICE_WEEK * SLOT}% + 12px)`, top: `calc(${yPct(BALANCE[INVOICE_WEEK])}% - 12px)`, ...show(v.inv) }}
        >
          <span className="flex items-baseline justify-between gap-2">
            <b className="text-[13px] font-semibold">Halvorsen Logistics</b>
            <span className="font-mono font-semibold text-[hsl(var(--sage-dark))]">+$164,200</span>
          </span>
          <span className="mt-0.5 block text-muted-foreground">Annual invoice · week of Dec 29</span>
        </div>

        {MONTHS.map((m) => (
          <span
            key={m.label}
            className="absolute top-[calc(100%+8px)] -translate-x-1/2 text-[11px] font-medium text-forest-muted min-[1024px]:top-[calc(100%+12px)] min-[1024px]:text-xs"
            style={{ left: `${(m.start + m.n / 2) * SLOT}%` }}
          >
            {m.label}
          </span>
        ))}
      </div>

      {/* Phones: one caption line under the plot. */}
      <p aria-hidden className={cn("mt-6 min-h-[18px] whitespace-nowrap text-xs font-medium leading-[1.4] transition-colors duration-300 min-[1024px]:hidden", cap ? "text-forest-foreground" : "text-forest-muted")}>
        {cap ?? "Weekly projected balance"}
      </p>
      {/* Desktop: legend, dimming what the step does not show. */}
      <div aria-hidden className="mt-10 hidden gap-[22px] text-xs font-medium text-forest-muted-strong min-[1024px]:flex">
        <span className="flex items-center gap-[7px] transition-opacity duration-300" style={{ opacity: v.line ? 1 : 0.35 }}>
          <span className="h-0.5 w-4 rounded-sm bg-sage-light" />
          Projected balance
        </span>
        <span className="flex items-center gap-[7px] transition-opacity duration-300" style={{ opacity: v.scen ? 1 : 0.35 }}>
          <span className="w-4 border-t-2 border-dashed border-[#E0A23A]" />
          Scenario
        </span>
        <span className="flex items-center gap-[7px] transition-opacity duration-300" style={{ opacity: v.floor ? 1 : 0.35 }}>
          <span className="w-4 border-t-2 border-dashed border-[#E86A5A]" />
          Floor
        </span>
      </div>

      {/* Scenario pill (desktop). */}
      <div aria-hidden className="absolute left-20 top-[72px] hidden flex-col gap-2 min-[1024px]:flex" style={{ opacity: v.scen ? 1 : 0, transition: "opacity .5s" }}>
        <span className="whitespace-nowrap rounded-full border border-forest-border bg-[#1B2E25] px-3.5 py-[9px] text-[13px] text-forest-foreground">
          What if we hire on Dec 1 at $16,500 a month?
        </span>
        <span className="pl-3.5 text-[12.5px] text-forest-muted-strong">
          Jan 26 balance <b className="font-mono text-forest-foreground">$301,000</b> → <b className="font-mono text-[#E0A23A]">{SCENARIO_END}</b>
        </span>
      </div>

      {/* Week breakdown: inset over the chart on phones, floating from 1024px. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-2.5 top-11 rounded-xl bg-card px-3.5 py-2.5 text-foreground shadow-[0_24px_50px_-20px_rgba(0,0,0,.65)] min-[1024px]:left-20 min-[1024px]:right-auto min-[1024px]:top-[76px] min-[1024px]:w-[300px] min-[1024px]:rounded-[14px] min-[1024px]:px-4 min-[1024px]:pb-3 min-[1024px]:pt-3.5"
        style={show(v.trace, 12)}
      >
        <div className="flex items-baseline justify-between gap-2">
          <b className="text-[13px] font-semibold min-[1024px]:text-[13.5px]">Week of Dec 29</b>
          <span className="whitespace-nowrap font-mono text-xs text-muted-foreground min-[1024px]:text-[12.5px]">
            Closing <b className="font-semibold text-foreground">$412,300</b>
          </span>
        </div>
        <div className="mt-1 flex flex-col min-[1024px]:mt-1.5">
          {TRACE.map((r, i) => (
            <div
              key={r.name}
              className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-2.5 gap-y-px border-t border-border py-1 min-[1024px]:gap-y-0.5 min-[1024px]:py-[7px]"
              style={{ opacity: v.trace ? 1 : 0, transform: v.trace ? "none" : "translateX(-8px)", transition: `opacity .4s ${0.15 + i * 0.09}s, transform .5s ${0.15 + i * 0.09}s` }}
            >
              <span className="text-xs font-medium min-[1024px]:text-[12.5px]">{r.name}</span>
              <span className={cn("font-mono text-xs font-semibold min-[1024px]:text-[12.5px]", r.tone)}>{r.amount}</span>
              <span className="col-span-2 truncate text-[11px] text-muted-foreground min-[1024px]:text-[11.5px]">{r.src}</span>
            </div>
          ))}
        </div>
        <div className="mt-1 rounded-lg bg-[#F8EFD8] px-[9px] py-[7px] text-[11px] leading-[1.4] min-[1024px]:mt-1.5 min-[1024px]:px-2.5 min-[1024px]:py-2 min-[1024px]:text-[11.5px]" style={{ opacity: v.change ? 1 : 0, transition: "opacity .5s .6s" }}>
          <b className="font-semibold">Changed since Monday:</b> Halvorsen due date moved Dec 15 → Dec 28 in QuickBooks.
        </div>
      </div>

      {/* Slack alert. */}
      <div
        aria-hidden
        className="absolute inset-x-2.5 top-12 flex gap-2.5 rounded-xl bg-card px-3.5 py-3 shadow-[0_18px_40px_-18px_rgba(0,0,0,.6)] min-[1024px]:left-[84px] min-[1024px]:right-auto min-[1024px]:top-[72px] min-[1024px]:w-[266px]"
        style={{ opacity: v.alert ? 1 : 0, transform: v.alert ? "none" : "translateY(-10px)", transition: `opacity .5s, transform .5s ${ease}` }}
      >
        <img src={zensusLogo} alt="" width={30} height={30} className="h-7 w-7 shrink-0 rounded-md min-[1024px]:h-[30px] min-[1024px]:w-[30px]" />
        <span className="flex flex-col gap-[3px] text-[12.5px] leading-[1.4] text-foreground">
          <span>
            <b className="font-semibold">Zensus</b> <span className="text-muted-foreground">in #finance · Slack</span>
          </span>
          <span>{ALERT_TEXT}</span>
        </span>
      </div>
    </div>
  );
}

function StepText({ step, i, p, active, onLink }: { step: (typeof STEPS)[number]; i: number; p: number; active: boolean; onLink: () => void }) {
  const on = (m: number) => active && p >= m;
  return (
    <>
      <h3 className="m-0 text-balance text-[22px] font-[650] leading-[1.2] tracking-[-0.02em] text-foreground min-[1024px]:text-[30px] min-[1024px]:leading-[1.15] min-[1024px]:tracking-[-0.025em]" style={show(on(0.06), 14)}>
        {step.q}
      </h3>
      <p className="mt-2.5 text-pretty text-[15.5px] leading-[1.5] text-muted-foreground min-[1024px]:mt-3.5 min-[1024px]:text-lg min-[1024px]:leading-[1.55]" style={show(on(0.3), 14)}>
        {step.s}
      </p>
      <Link
        to={step.link.to}
        onClick={onLink}
        data-step={i + 1}
        className="mt-1 flex min-h-[44px] items-center self-start rounded-sm text-[15px] font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background min-[1024px]:mt-[18px] min-[1024px]:inline-flex min-[1024px]:min-h-0 min-[1024px]:text-base"
        style={show(on(0.55), 14)}
        // Not focusable until it fades in, so the keyboard never lands on an
        // invisible link.
        {...(on(0.55) ? {} : { inert: "" })}
      >
        {step.link.label} →
      </Link>
    </>
  );
}

const Heading = () => (
  <>
    <p className="text-sm font-semibold text-primary min-[1024px]:text-[15px]">The cash flow product</p>
    <h2
      id="cash-flow-product-heading"
      className="mt-2.5 text-balance text-[30px] font-bold leading-[1.08] tracking-[-0.03em] text-foreground min-[1024px]:mt-3.5 min-[1024px]:text-[46px] min-[1024px]:leading-[1.06] min-[1024px]:tracking-[-0.035em]"
    >
      From the macro view <span className="text-primary">to the day it hits.</span>
    </h2>
  </>
);

// The chart is decorative; this table is its text alternative. The wrapper
// is what hides it: a <table> ignores sr-only's 1px width and kept the page
// 561px wide on phones.
const DataTable = () => (
  <div className="sr-only">
  <table>
    <caption>Example weekly projected cash balance, week of Nov 3 to week of Jan 26</caption>
    <thead>
      <tr>
        <th scope="col">Week of</th>
        <th scope="col">Projected balance</th>
      </tr>
    </thead>
    <tbody>
      {WEEKS.map((w, i) => (
        <tr key={w}>
          <th scope="row">{w}</th>
          <td>{fmt(BALANCE[i])}</td>
        </tr>
      ))}
    </tbody>
  </table>
  </div>
);

const RunwayFeature = () => {
  const staticPins = useStaticPinsOrPrerender();
  const [pos, setPos] = useState({ step: 0, p: 0 });
  const viewed = useRef(-1);

  const onProgress = useCallback(({ progress }: ScrollProgress) => {
    const t = Math.min(0.9999, progress) * N;
    const step = Math.floor(t);
    const p = quantise(t - step);
    setPos((cur) => (cur.step === step && cur.p === p ? cur : { step, p }));
  }, []);

  useEffect(() => {
    if (staticPins || pos.p === 0 || viewed.current === pos.step) return;
    viewed.current = pos.step;
    track(EVENTS.RUNWAY_STEP_VIEW, { step: pos.step + 1 });
  }, [pos, staticPins]);

  const jump = (i: number) => {
    track(EVENTS.RUNWAY_RAIL_CLICK, { step: i + 1 });
    const el = document.getElementById("cash-flow-forecast");
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const run = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((i + 0.62) / N) * run, behavior: "smooth" });
  };

  const linkClick = (i: number) => () => track(EVENTS.RUNWAY_LINK_CLICK, { step: i + 1 });

  if (staticPins) {
    return (
      <section id="cash-flow-forecast" aria-labelledby="cash-flow-product-heading" className="bg-background px-5 py-16 min-[1024px]:px-16 min-[1024px]:py-24">
        <div id="features" className="mx-auto max-w-[1152px]">
          <Heading />
          <DataTable />
          <ol className="mt-10 flex flex-col gap-14 min-[1024px]:gap-20">
            {STEPS.map((s, i) => (
              <li key={s.beat} id={s.id} className="grid items-center gap-6 min-[1024px]:grid-cols-[minmax(0,460px)_minmax(0,1fr)] min-[1024px]:gap-14">
                <div className="flex flex-col">
                  <StepText step={s} i={i} p={1} active onLink={linkClick(i)} />
                </div>
                <ProductChart beat={s.beat} p={1} step={i} />
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  const { step, p } = pos;
  return (
    <PinnedSection
      id="cash-flow-forecast"
      viewports={PIN_VIEWPORTS}
      onProgress={onProgress}
      aria-labelledby="cash-flow-product-heading"
      anchors={ANCHORS}
      className="bg-background"
      stageClassName="flex items-center"
    >
      <span id="features" aria-hidden className="pointer-events-none absolute left-0 top-0 h-px w-px" />
      <div className="mx-auto grid w-full max-w-[1280px] gap-5 px-5 pb-4 pt-[76px] max-[1023px]:[@media(max-height:820px)]:gap-3.5 max-[1023px]:[@media(max-height:820px)]:pt-[72px] min-[640px]:max-w-[640px] min-[1024px]:max-w-[1280px] min-[1024px]:grid-cols-[minmax(0,460px)_minmax(0,1fr)] min-[1024px]:items-center min-[1024px]:gap-14 min-[1024px]:px-16 min-[1024px]:py-0">
        <div className="contents flex-col min-[1024px]:flex">
          <div>
            <Heading />
            <DataTable />
            {/* Rail: each segment fills with scroll through its step. */}
            <div className="mt-5 flex gap-1.5 min-[1024px]:mt-11 min-[1024px]:gap-2.5">
              {STEPS.map((s, i) => (
                <button
                  key={s.beat}
                  type="button"
                  onClick={() => jump(i)}
                  aria-current={i === step ? "step" : undefined}
                  className="flex min-h-[44px] flex-1 flex-col gap-2 rounded-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background min-[1024px]:gap-2.5"
                >
                  <span className="h-[3px] w-full overflow-hidden rounded-sm bg-border">
                    <span
                      className="block h-full bg-primary"
                      style={{ width: `clamp(0%, calc((var(--p, 0) * ${N} - ${i}) * 100%), 100%)` }}
                    />
                  </span>
                  <span className={cn("whitespace-nowrap text-xs font-medium min-[1024px]:text-[13.5px]", i === step ? "text-foreground" : "text-muted-foreground")}>
                    {s.rail}
                  </span>
                </button>
              ))}
            </div>
          </div>
          {/* Steps share one cell; only the active one is visible and
              reachable. Phones put this under the chart. */}
          <div className="order-last grid min-[1024px]:order-none min-[1024px]:mt-[22px]">
            {STEPS.map((s, i) => {
              const active = i === step;
              return (
                <div
                  key={s.beat}
                  className="col-start-1 row-start-1 flex flex-col"
                  aria-hidden={active ? undefined : true}
                  {...(active ? {} : { inert: "" })}
                  style={{ pointerEvents: active ? "auto" : "none" }}
                >
                  <StepText step={s} i={i} p={active ? p : 0} active={active} onLink={linkClick(i)} />
                </div>
              );
            })}
          </div>
        </div>
        <ProductChart beat={STEPS[step].beat} p={p} step={step} />
      </div>
    </PinnedSection>
  );
};

export default RunwayFeature;
