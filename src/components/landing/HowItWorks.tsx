import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useStaticPinsOrPrerender } from "@/hooks/use-prefers-reduced-motion";
import type { ScrollProgress } from "@/hooks/use-scroll-progress";
import { EVENTS, track } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";
import plaidLogo from "@/assets/integrations/plaid.svg";
import quickbooksLogo from "@/assets/integrations/quickbooks-logo-black.png";
import { PinnedSection } from "./PinnedSection";
import { TalkToUsButton } from "./TalkToUsButton";
import { TryItNowButton } from "./TryItNowButton";

/*
 * How it works from handoff 23 (locked 49a desktop, 49b mobile, 4 Nov 2026),
 * replacing 18d. It answers "how much effort is it to start?" and leads into
 * Start. Pinned over 3.6 viewports (kept short: long pins raise bounce), three
 * steps on a rail that fills with scroll and jumps on click. Each step's card
 * is never empty: the three connections go Connect, Connecting..., Connected
 * (and connect on a tap); a progress bar builds the 13-week forecast; a real
 * range input sets the alert threshold (it eases from $330K to $250K with
 * scroll until someone drags it). Start, Talk to us and the trial line appear
 * at 60% of step 3.
 *
 * The steps are an ordered list with H3s, all in the HTML. useStaticPins
 * (reduced motion, short viewport): the three steps stacked, each with its
 * finished card, then the buttons.
 *
 * Copy: titles verbatim; descriptions 1 and 3 are the handoff's approved
 * rewrites, kept as written at the user's request (4 Nov 2026). The trust
 * line keeps "AES-256-GCM tokens", the wording chosen for the proof strip:
 * that encryption covers tokens and secrets, not all data. Chart figures are
 * placeholders from the shared ledger.
 */

const STEPS: { title: string; desc: string; link?: { text: string; to: string } }[] = [
  {
    title: "Connect your data",
    desc: "Sign in to your bank, QuickBooks and HubSpot. All three if you want. No uploads.",
  },
  {
    title: "Watch the projection move",
    desc: "A 13-week projection that redraws itself as invoices post and payroll clears.",
    link: { text: "13-week projection", to: "/blog/what-is-a-13-week-cash-flow-forecast" },
  },
  {
    title: "Set your alert threshold",
    desc: "Slack pings you the moment your projection crosses the line.",
  },
];
const N = STEPS.length;
const PIN_VIEWPORTS = 3.6;

const SOURCES = [
  { key: "plaid", what: "Bank accounts" },
  { key: "quickbooks", what: "Accounting" },
  { key: "hubspot", what: "CRM pipeline" },
] as const;

// Weekly projected balance, week of Nov 3 to week of Jan 26 (placeholders).
const BALANCE = [318400, 296200, 305100, 282300, 268900, 290400, 271600, 248100, 412300, 398700, 296500, 284200, 301000];
const MONTHS: [string, number, number][] = [
  ["Nov", 0, 4],
  ["Dec", 4, 5],
  ["Jan", 9, 4],
];
const SLOT = 100 / 13;
const yPct = (v: number) => 100 - ((v - 200000) / 250000) * 100;
const LINE = BALANCE.map((v, i) => `${i ? "L" : "M"}${(((i + 0.5) / 13) * 1000).toFixed(1)} ${yPct(v).toFixed(2)}`).join(" ");
const fmt = (v: number) => `$${Math.round(v).toLocaleString("en-US")}`;
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const ease = "cubic-bezier(.22,1,.36,1)";

const rise = (on: boolean): CSSProperties => ({
  opacity: on ? 1 : 0,
  transform: on ? "none" : "translateY(14px)",
  transition: `opacity .5s, transform .6s ${ease}`,
});

function Description({ step }: { step: (typeof STEPS)[number] }) {
  const l = step.link;
  const at = l ? step.desc.indexOf(l.text) : -1;
  if (!l || at < 0) return <>{step.desc}</>;
  return (
    <>
      {step.desc.slice(0, at)}
      <Link to={l.to} className="rounded-sm font-medium text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        {l.text}
      </Link>
      {step.desc.slice(at + l.text.length)}
    </>
  );
}

const Axis = ({ small }: { small?: boolean }) => (
  <>
    {[200000, 300000, 400000].map((g) => (
      <div key={g} className="absolute inset-x-0 border-t border-[#F1E6CB]" style={{ top: `${yPct(g)}%` }}>
        <span className={cn("absolute -top-[7px] font-mono text-muted-foreground", small ? "-left-[38px] text-[10px]" : "-left-[38px] text-[10px] min-[1024px]:-left-11 min-[1024px]:text-[11px]")}>
          ${g / 1000}K
        </span>
      </div>
    ))}
  </>
);

interface CardProps {
  step: number;
  p: number;
  tapped: number[];
  onTap: (i: number) => void;
  thr: number | null;
  onThr: (v: number) => void;
  /** Static layout: only this step's panel, in its finished state. */
  only?: number;
}

function StepCard({ step, p, tapped, onTap, thr, onThr, only }: CardProps) {
  const sliderId = useId();
  const show = (i: number) => (only === undefined ? step === i : only === i);
  const fin = only !== undefined;

  const conn = SOURCES.map((src, i) => {
    const ok = fin || step > 0 || p > 0.28 + i * 0.16 || tapped.includes(i);
    const busy = !ok && step === 0 && p > 0.18 + i * 0.16;
    return { ...src, ok, busy };
  });

  const fill = fin || step > 1 ? 1 : step === 1 ? clamp((p - 0.12) / 0.45) : 0;
  const ready = fill >= 1;

  const eased = Math.round((330000 - 80000 * (step === 2 ? clamp((p - 0.1) / 0.45) : 0)) / 5000) * 5000;
  const value = thr ?? (fin ? 250000 : eased);
  const done = fin || (step === 2 && (p > 0.6 || thr !== null));
  const pct = ((value - 200000) / 200000) * 100;

  const panel = (i: number, children: ReactNode, cls: string) => {
    const on = show(i);
    return (
      <div
        className={cn("absolute inset-0 flex flex-col px-4 py-[18px] max-[1023px]:[@media(max-height:820px)]:py-3 min-[1024px]:px-8 min-[1024px]:py-7", cls)}
        style={{ opacity: on ? 1 : 0, transition: "opacity .5s", pointerEvents: on ? "auto" : "none" }}
        aria-hidden={on ? undefined : true}
        {...(on ? {} : { inert: "" })}
      >
        {children}
      </div>
    );
  };

  return (
    <div className={cn("relative overflow-hidden rounded-[18px] border border-border bg-card shadow-[0_40px_80px_-48px_rgba(26,42,40,.45)] min-[1024px]:rounded-[20px]", fin ? "h-[300px] min-[1024px]:h-[360px]" : "h-[300px] max-[1023px]:[@media(max-height:820px)]:h-[244px] min-[1024px]:h-[360px]")}>
      {panel(
        0,
        <>
          <span className="hidden items-baseline justify-between min-[1024px]:flex">
            <span className="text-[15px] font-semibold text-foreground">Connect your sources</span>
            <span className="text-[13px] text-muted-foreground">Tap to try</span>
          </span>
          {conn.map((c, i) => (
            <div
              key={c.key}
              className={cn(
                "flex h-[60px] max-[1023px]:[@media(max-height:820px)]:h-[50px] shrink-0 items-center justify-between gap-2.5 rounded-xl border bg-background px-3 transition-colors duration-300 min-[1024px]:h-16 min-[1024px]:gap-4 min-[1024px]:rounded-[14px] min-[1024px]:px-4",
                c.ok ? "border-primary" : "border-border",
              )}
            >
              <span className="flex min-w-0 items-center gap-3.5">
                <span className="flex items-center min-[1024px]:w-[110px]">
                  {c.key === "plaid" ? (
                    <span className="inline-flex h-6 items-center rounded-full bg-forest px-2.5 min-[1024px]:h-[26px] min-[1024px]:px-3">
                      <img src={plaidLogo} alt="Plaid" className="block h-[13px] w-auto min-[1024px]:h-3.5" />
                    </span>
                  ) : c.key === "quickbooks" ? (
                    // Official Intuit file, unmodified; 18px on phones, 20px
                    // from 1024px, with clear space around it.
                    <img src={quickbooksLogo} alt="Intuit QuickBooks" className="mx-1 block h-[18px] w-auto min-[1024px]:h-5" />
                  ) : (
                    <span className="text-sm font-semibold text-foreground min-[1024px]:text-[15px]">HubSpot</span>
                  )}
                </span>
                <span className="hidden whitespace-nowrap text-sm text-muted-foreground min-[1024px]:inline">{c.what}</span>
              </span>
              <button
                type="button"
                disabled={c.ok}
                onClick={() => onTap(i)}
                aria-label={c.ok ? `${c.key === "plaid" ? "Bank accounts" : c.key === "quickbooks" ? "QuickBooks" : "HubSpot"} connected` : `Connect ${c.key === "plaid" ? "bank accounts" : c.key === "quickbooks" ? "QuickBooks" : "HubSpot"}`}
                className={cn(
                  "relative inline-flex h-8 min-w-[104px] items-center justify-center rounded-full border px-3 text-[12.5px] font-semibold transition-colors duration-300 min-[1024px]:h-[34px] min-[1024px]:min-w-[116px] min-[1024px]:px-3.5 min-[1024px]:text-[13.5px]",
                  "before:absolute before:-inset-1.5 before:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-default",
                  c.ok ? "border-primary bg-[#EEF7EC] text-[hsl(var(--sage-dark))]" : "border-forest bg-forest text-forest-foreground",
                )}
              >
                {c.ok ? "✓ Connected" : c.busy ? "Connecting…" : "Connect"}
              </button>
            </div>
          ))}
          <Link
            to="/security"
            className="flex min-h-[28px] items-center gap-2 rounded-sm text-xs text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-[1024px]:mt-1 min-[1024px]:text-[13px]"
          >
            <span aria-hidden className="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-forest">
              <svg width="10" height="10" viewBox="0 0 24 24">
                <rect x="4.5" y="10" width="15" height="11.5" rx="3" fill="#48D88A" />
                <path d="M7.5 10.5V7.75a4.5 4.5 0 0 1 9 0v2.75" fill="none" stroke="#48D88A" strokeWidth="2.6" />
              </svg>
            </span>
            <span>
              <b className="font-semibold text-foreground">Encrypted, US-hosted</b> · AES-256-GCM tokens
              <span className="hidden min-[1024px]:inline"> · TLS in transit</span>
            </span>
          </Link>
        </>,
        "justify-center gap-2.5 max-[1023px]:[@media(max-height:820px)]:gap-2 min-[1024px]:gap-3",
      )}

      {panel(
        1,
        <>
          <div aria-hidden className="flex items-baseline justify-between gap-2">
            <span className="text-[13.5px] font-semibold text-foreground min-[1024px]:text-[15px]">{ready ? "Your 13-week forecast" : "Building your 13-week forecast"}</span>
            <span className={cn("text-xs font-semibold min-[1024px]:text-[13px]", ready ? "text-[hsl(var(--sage-dark))]" : "text-muted-foreground")}>
              {ready ? "✓ Ready" : `${Math.round(fill * 100)}%`}
            </span>
          </div>
          <div aria-hidden className="mt-2.5 h-[5px] overflow-hidden rounded-[3px] bg-border min-[1024px]:mt-3 min-[1024px]:h-1.5">
            <div className="h-full bg-primary transition-[width] duration-300" style={{ width: `${fill * 100}%` }} />
          </div>
          <div aria-hidden className="relative mb-6 ml-[38px] mt-5 flex-1 min-[1024px]:ml-11 min-[1024px]:mt-[26px]">
            <Axis />
            {BALANCE.map((v, i) => {
              const h = ready ? 100 - yPct(v) : 9 + (i % 3) * 4;
              return (
                <div
                  key={i}
                  className="absolute bottom-0 rounded-t-sm transition-[background-color,height] duration-500"
                  style={{ left: `${i * SLOT + SLOT * 0.22}%`, width: `${SLOT * 0.56}%`, height: `${h}%`, background: ready ? (i === 8 ? "#48D88A" : "#D7E9DC") : "#F1E6CB" }}
                />
              );
            })}
            <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
              <path
                d={LINE}
                fill="none"
                stroke="#0E5C3A"
                strokeWidth="2.25"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                style={{ clipPath: ready ? "inset(-20% 0 -20% 0)" : "inset(-20% 100% -20% 0)", transition: "clip-path .9s ease" }}
              />
            </svg>
            {MONTHS.map(([l, a, n]) => (
              <span key={l} className="absolute top-[calc(100%+6px)] -translate-x-1/2 text-[11px] font-medium text-muted-foreground min-[1024px]:text-xs" style={{ left: `${(a + n / 2) * SLOT}%` }}>
                {l}
              </span>
            ))}
          </div>
        </>,
        "",
      )}

      {panel(
        2,
        <>
          <div className="flex items-baseline justify-between">
            <label htmlFor={sliderId} className="text-[13.5px] font-semibold text-foreground min-[1024px]:text-[15px]">
              Alert threshold <span className="hidden text-[13px] font-normal text-muted-foreground min-[1024px]:inline">· drag to try</span>
            </label>
            <b className="font-mono text-sm font-semibold text-foreground min-[1024px]:text-[15px]">{fmt(value)}</b>
          </div>
          {/* A real range input (44px hit area) under the styled track. */}
          <div className="relative mt-3 flex h-[26px] items-center min-[1024px]:mt-3.5 min-[1024px]:h-7">
            <div aria-hidden className="absolute inset-x-0 h-1 rounded-sm bg-border" />
            <div aria-hidden className="absolute left-0 h-1 rounded-sm bg-primary" style={{ width: `${pct}%` }} />
            <div
              aria-hidden
              className="absolute h-5 w-5 -translate-x-1/2 rounded-full border-2 border-primary bg-card shadow-[0_2px_6px_rgba(26,42,40,.2)] min-[1024px]:h-[22px] min-[1024px]:w-[22px]"
              style={{ left: `${pct}%` }}
            />
            <input
              id={sliderId}
              type="range"
              min={200000}
              max={400000}
              step={5000}
              value={value}
              onChange={(e) => onThr(Number(e.target.value))}
              aria-valuetext={fmt(value)}
              className="hiw-range absolute -left-2.5 h-11 w-[calc(100%+20px)] cursor-grab opacity-0"
            />
          </div>
          <div aria-hidden className="relative ml-[38px] mt-4 h-[110px] max-[1023px]:[@media(max-height:820px)]:mt-3 max-[1023px]:[@media(max-height:820px)]:h-[70px] min-[1024px]:ml-11 min-[1024px]:mt-[22px] min-[1024px]:h-[150px]">
            <Axis />
            <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
              <path d={LINE} fill="none" stroke="#0E5C3A" strokeWidth="2.25" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="absolute inset-x-0 border-t-2 border-dashed border-[#E86A5A] transition-[top] duration-200" style={{ top: `${yPct(value)}%` }} />
          </div>
          <div
            role="status"
            className="mt-auto flex items-center gap-2 rounded-xl bg-forest px-3 py-2.5 text-forest-foreground min-[1024px]:gap-2.5 min-[1024px]:px-3.5 min-[1024px]:py-3"
            style={{ opacity: done ? 1 : 0, transform: done ? "none" : "translateY(8px)", transition: `opacity .5s, transform .5s ${ease}` }}
          >
            <span aria-hidden className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground min-[1024px]:h-[22px] min-[1024px]:w-[22px] min-[1024px]:text-xs">
              ✓
            </span>
            <span className="text-[12.5px] leading-[1.35] min-[1024px]:text-[13.5px] min-[1024px]:leading-[1.4]">
              {done ? `Alert set. Slack #finance when projected cash drops below ${fmt(value)}.` : ""}
            </span>
          </div>
        </>,
        "",
      )}
    </div>
  );
}

function Cta({ visible, className }: { visible: boolean; className?: string }) {
  return (
    <div className={className} style={{ ...rise(visible), pointerEvents: visible ? "auto" : "none" }} {...(visible ? {} : { inert: "" })}>
      <div className="flex gap-3">
        <span className="flex flex-1 min-[1024px]:flex-none" onClickCapture={() => track(EVENTS.HIW_START_CLICK)}>
          <TryItNowButton variant="solid" source="how_it_works" className="h-12 w-full justify-center px-6 min-[1024px]:w-auto" />
        </span>
        <span className="flex flex-1 min-[1024px]:flex-none" onClickCapture={() => track(EVENTS.HIW_TALK_CLICK)}>
          <TalkToUsButton variant="outline" showArrow={false} className="h-12 w-full justify-center px-6 text-base min-[1024px]:w-auto" />
        </span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">14-day free trial, cancel anytime. No charge until it ends.</p>
    </div>
  );
}

function StepText({ step, i, p, active }: { step: (typeof STEPS)[number]; i: number; p: number; active: boolean }) {
  const on = (m: number) => active && p >= m;
  return (
    <>
      <p className="text-[15px] font-semibold text-primary" style={{ opacity: on(0.04) ? 1 : 0, transition: "opacity .4s" }}>
        Step {i + 1} of {N}
      </p>
      <h3 className="mt-2.5 text-balance text-2xl font-bold leading-[1.1] tracking-[-0.03em] text-foreground min-[1024px]:text-[38px]" style={rise(on(0.04))}>
        {step.title}
      </h3>
      <p className="mt-2.5 max-w-[420px] text-pretty text-[15.5px] leading-[1.5] text-muted-foreground min-[1024px]:mt-4 min-[1024px]:text-lg min-[1024px]:leading-[1.55]" style={rise(on(0.22))} {...(on(0.22) ? {} : { inert: "" })}>
        <Description step={step} />
      </p>
    </>
  );
}

const Heading = ({ center }: { center?: boolean }) => (
  <>
    <h2 id="how-it-works-heading" className={cn("m-0 text-[30px] font-bold leading-[1.08] tracking-[-0.03em] text-foreground min-[1024px]:text-[46px] min-[1024px]:leading-[1.05] min-[1024px]:tracking-[-0.035em]", center && "min-[1024px]:text-center")}>
      How it works
    </h2>
    <p className={cn("mt-2 text-[15.5px] leading-[1.5] text-muted-foreground min-[1024px]:mt-3 min-[1024px]:text-lg", center && "min-[1024px]:text-center")}>
      From sign-up to a live cash flow forecast in a few minutes.
    </p>
  </>
);

const HowItWorks = () => {
  const staticPins = useStaticPinsOrPrerender();
  const [pos, setPos] = useState({ step: 0, p: 0 });
  const [tapped, setTapped] = useState<number[]>([]);
  const [thr, setThr] = useState<number | null>(null);
  const dragged = useRef(false);
  const viewed = useRef(-1);

  const onProgress = useCallback(({ progress }: ScrollProgress) => {
    const t = Math.min(0.9999, progress) * N;
    const step = Math.floor(t);
    const p = Math.round((t - step) * 100) / 100;
    setPos((cur) => (cur.step === step && cur.p === p ? cur : { step, p }));
  }, []);

  useEffect(() => {
    if (staticPins || viewed.current === pos.step || pos.p < 0.04) return;
    viewed.current = pos.step;
    track(EVENTS.HIW_STEP_VIEW, { step: pos.step + 1 });
  }, [pos, staticPins]);

  const onTap = (i: number) => {
    setTapped((cur) => (cur.includes(i) ? cur : [...cur, i]));
    track(EVENTS.HIW_CONNECT_TAP, { source: SOURCES[i].key });
  };
  const onThr = (v: number) => {
    setThr(v);
    if (!dragged.current) {
      dragged.current = true;
      track(EVENTS.HIW_THRESHOLD_DRAG);
    }
  };

  const jump = (i: number) => {
    const el = document.getElementById("how-it-works");
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + ((i + 0.55) / N) * (el.offsetHeight - window.innerHeight), behavior: "smooth" });
  };

  if (staticPins) {
    return (
      <section id="how-it-works" aria-labelledby="how-it-works-heading" className="bg-background px-5 py-16 min-[760px]:py-24 min-[1024px]:px-[120px]">
        <div className="mx-auto max-w-[1040px]">
          <Heading />
          <ol className="mt-10 flex flex-col gap-12 min-[1024px]:gap-16">
            {STEPS.map((s, i) => (
              <li key={s.title} className="grid items-center gap-6 min-[1024px]:grid-cols-[minmax(0,1fr)_560px] min-[1024px]:gap-16">
                <div>
                  <StepText step={s} i={i} p={1} active />
                </div>
                <StepCard step={i} p={1} tapped={[0, 1, 2]} onTap={onTap} thr={thr} onThr={onThr} only={i} />
              </li>
            ))}
          </ol>
          <Cta visible className="mt-10" />
        </div>
      </section>
    );
  }

  const { step, p } = pos;
  const ctaOn = step === 2 && p > 0.6;
  return (
    <div className="pin-overlap pb-16 min-[1024px]:pb-0">
      <PinnedSection
        id="how-it-works"
        viewports={PIN_VIEWPORTS}
        onProgress={onProgress}
        aria-labelledby="how-it-works-heading"
        stageClassName="flex flex-col px-5 pb-6 pt-24 max-[1023px]:[@media(max-height:820px)]:pt-[84px] min-[1024px]:justify-center min-[1024px]:px-[120px] min-[1024px]:py-16"
      >
        <div className="mx-auto flex w-full max-w-[1040px] flex-col min-[640px]:max-w-[640px] min-[1024px]:max-w-[1040px] min-[1024px]:pt-8">
          <div className="flex flex-col min-[1024px]:items-center">
            <Heading center />
            <div className="mt-[18px] grid w-full grid-cols-3 gap-2 min-[1024px]:mt-8 min-[1024px]:max-w-[640px] min-[1024px]:gap-3">
              {STEPS.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => jump(i)}
                  aria-current={i === step ? "step" : undefined}
                  className="flex min-h-[44px] flex-col gap-2 rounded-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background min-[1024px]:gap-2.5"
                >
                  <span className="h-[3px] w-full overflow-hidden rounded-sm bg-border">
                    <span className="block h-full bg-primary" style={{ width: `clamp(0%, calc((var(--p, 0) * ${N} - ${i}) * 100%), 100%)` }} />
                  </span>
                  <span className={cn("text-[12.5px] transition-colors duration-300 min-[1024px]:text-sm", i === step ? "font-semibold text-foreground" : "font-medium text-muted-foreground")}>
                    <span className="min-[1024px]:hidden">Step {i + 1}</span>
                    <span className="hidden min-[1024px]:inline">
                      {i + 1}. {s.title}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-1.5 grid gap-5 min-[1024px]:mt-11 min-[1024px]:grid-cols-[minmax(0,1fr)_560px] min-[1024px]:items-center min-[1024px]:gap-16">
            <ol className="order-last grid min-[1024px]:order-none">
              {STEPS.map((s, i) => {
                const active = i === step;
                return (
                  <li
                    key={s.title}
                    className="col-start-1 row-start-1"
                    aria-hidden={active ? undefined : true}
                    {...(active ? {} : { inert: "" })}
                    style={{ pointerEvents: active ? "auto" : "none" }}
                  >
                    <StepText step={s} i={i} p={active ? p : 0} active={active} />
                    {i === N - 1 && <Cta visible={ctaOn} className="mt-5 min-[1024px]:mt-7" />}
                  </li>
                );
              })}
            </ol>
            <StepCard step={step} p={p} tapped={tapped} onTap={onTap} thr={step === 2 ? thr : null} onThr={onThr} />
          </div>
        </div>
      </PinnedSection>
    </div>
  );
};

export default HowItWorks;
