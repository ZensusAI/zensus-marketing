import { useCallback, useEffect, useRef, useState } from "react";
import plaidLogo from "@/assets/integrations/plaid.svg";
import quickbooksLogo from "@/assets/integrations/quickbooks.svg";
import hubspotLogo from "@/assets/integrations/hubspot.svg";
import slackLogo from "@/assets/integrations/slack.svg";
import { useStaticPins } from "@/hooks/use-prefers-reduced-motion";
import type { ScrollProgress } from "@/hooks/use-scroll-progress";
import { clamp01, easeInOutCubic as ease, lerp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { PinnedSection } from "./PinnedSection";

/*
 * How it works, from handoff 10-how-it-works (locked 18d): a pinned setup
 * window (3.6 viewports) that plays each step. Each new step opens as a
 * circle (iris) wipe that grows from its own row in the step list (on phones,
 * from its segment of the top rail), edged by a glowing green ring; the
 * previous step scales down, blurs and dims underneath. The active title
 * decodes from scrambled letters over DECODE_MS each time its step becomes
 * active (by time, not scroll, so a parked reader never sees gibberish).
 * Values follow the handoff's renderVals().
 *   1. Connect: Plaid, QuickBooks, HubSpot go queued, connecting, linked.
 *   2. Projection: the 13-week line draws, then revises through three events.
 *   3. Alert: the threshold slides from $400K to $250K and the Slack message
 *      arrives.
 * The scramble is drawn from a data attribute (CSS content), so the heading's
 * text is always the real title, including in the prerendered HTML.
 * Reduced motion or a short viewport: all three windows in their end state,
 * no wipe or scramble.
 *
 * Corrections, to match the app: the projection is the 13-week view (there is
 * no 90-day one); alerts carry the breach and the threshold, not a zero-cash
 * date, and are checked after each sync, not "the moment"; HubSpot is read for
 * subscriptions, not deals; only the connection is OAuth (QuickBooks access
 * is read and write, so "read-only" is not claimed); setup is "a few minutes".
 */

const STEPS = [
  { title: "Connect your data", desc: "OAuth to Plaid, QuickBooks, or HubSpot. All three if you want. No uploads." },
  { title: "Watch the projection move", desc: "A 13-week projection that redraws itself as invoices post and payroll clears." },
  { title: "Set your alert threshold", desc: "Slack pings you when your 30-day projection crosses the line." },
];

const PROVIDERS = [
  { name: "Plaid", logo: plaidLogo, className: "logo-on-light object-cover object-left" },
  { name: "QuickBooks", logo: quickbooksLogo },
  { name: "HubSpot", logo: hubspotLogo },
];

const HIST = "M6 46 C 22 43, 34 47, 48 43 C 54 41, 58 41, 62 40";
const projPath = (a: number[]) =>
  `${HIST} C 70 40, 77 ${a[0]}, 85 ${a[0]} C 93 ${a[0]}, 100 ${a[1]}, 108 ${a[1]} C 116 ${a[1]}, 123 ${a[2]}, 131 ${a[2]} C 139 ${a[2]}, 146 ${a[3]}, 154 ${a[3]}`;
const BASE = [37, 34, 31, 28];
const EVENTS = [
  { label: "Annual invoice posts Dec 14", delta: "+$48K", positive: true, anchors: [37, 22, 19, 16], mi: 1, mx: 108 },
  { label: "Payroll clears on the 1st", delta: "-$31K", positive: false, anchors: [42, 39, 36, 33], mi: 0, mx: 85 },
  { label: "New subscription starts", delta: "+$9K MRR", positive: true, anchors: [35, 28, 20, 11], mi: 2, mx: 131 },
];
const SLACK_MESSAGE = "30-day projection dips below your $250K threshold in 3 weeks.";
const PIN_VIEWPORTS = 3.6;
const DECODE_MS = 600;
const GL = "abcdefghijklmnopqrstuvwxyz";

const scramble = (t: string, k: number, now: number) => {
  if (k >= 1) return t;
  const n = Math.floor(k * t.length);
  const tick = Math.floor(now / 55);
  return t
    .split("")
    .map((ch, j) => (j < n || ch === " " ? ch : GL[(j * 7 + tick * 13 + j * tick) % 26]))
    .join("");
};

const projAt = (s: number) => {
  if (s < 0) return { a: BASE, mop: 0, ev: null as (typeof EVENTS)[number] | null, evOp: 0 };
  const i = Math.floor(s);
  const f = ease(clamp01((s - i) * 4));
  const from = i === 0 ? BASE : EVENTS[(i - 1) % 3].anchors;
  const E = EVENTS[i % 3];
  return { a: from.map((v, j) => lerp(v, E.anchors[j], f)), mop: clamp01(((s - i) * 4 - 0.7) / 0.3), ev: E, evOp: clamp01((s - i) * 6) };
};

function useNarrow() {
  // Read the width up front so phones do not lay out the desktop geometry first.
  const [narrow, setNarrow] = useState(() => typeof window !== "undefined" && !!window.matchMedia && window.matchMedia("(max-width: 759px)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 759px)");
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return narrow;
}

interface WindowProps {
  i: number;
  k: number[];
  s: number;
}

// One setup window's content at progress k (per step) and projection clock s.
function Diorama({ i, k, s }: WindowProps) {
  if (i === 0) {
    const lk = k[0] * 3.3;
    const all = k[0] >= 1;
    return (
      <>
        <p className="mb-[18px] text-sm text-muted-foreground">Connect your sources</p>
        <ul className="flex flex-col gap-4">
          {PROVIDERS.map((pv, j) => {
            const done = lk > j + 1 || all;
            const conn = !done && lk > j;
            return (
              <li key={pv.name} className="flex items-center gap-2.5 text-base text-foreground">
                <img src={pv.logo} alt="" className={cn("h-5 w-5 object-contain", pv.className)} />
                {pv.name}
                <span
                  className={cn(
                    "ml-auto inline-flex items-center gap-1.5 font-mono text-xs",
                    done ? "text-sage-dark" : "text-muted-foreground",
                  )}
                >
                  {conn && (
                    <span
                      aria-hidden
                      className="inline-block h-2.5 w-2.5 animate-spin rounded-full border-[1.5px] border-sage-dark border-t-transparent"
                    />
                  )}
                  {done ? "✓ linked" : conn ? "connecting" : "queued"}
                </span>
              </li>
            );
          })}
        </ul>
        <div className="mt-auto flex justify-between pt-4 font-mono text-[10.5px] text-muted-foreground">
          <span>OAuth · no CSV uploads</span>
          <span className={all ? "text-sage-dark" : "text-muted-foreground"}>{all ? "3 of 3 linked" : `${Math.min(3, Math.floor(lk))} of 3`}</span>
        </div>
      </>
    );
  }
  if (i === 1) {
    const P = projAt(s);
    const dk = clamp01(k[1] / 0.6);
    return (
      <>
        <p className="mb-1.5 text-sm text-muted-foreground">13-week projection</p>
        <svg aria-hidden viewBox="0 0 160 64" width="100%" preserveAspectRatio="xMidYMid meet" className="block min-h-0 flex-1 overflow-visible max-[759px]:max-h-[140px] min-[760px]:max-h-[210px]">
          <line x1="62" y1="6" x2="62" y2="58" stroke="#EBDCB8" strokeWidth={1} strokeDasharray="2 3" />
          <text x="62" y="63" textAnchor="middle" fontSize="5.5" fill="#506864" fontFamily="Geist Mono, monospace">
            today
          </text>
          <path
            d={projPath(P.a)}
            fill="none"
            stroke="#0E5C3A"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray="220"
            strokeDashoffset={(220 * (1 - ease(dk))).toFixed(1)}
          />
          <circle cx={P.ev ? P.ev.mx : 0} cy={P.ev ? P.ev.anchors[P.ev.mi] : 0} r="3.5" fill="none" stroke="#22C573" strokeWidth={1.5} opacity={P.mop} />
          <circle cx="154" cy={P.a[3]} r="3" fill="#22C573" opacity={dk > 0.95 ? 1 : 0} />
        </svg>
        <p className="mt-auto min-h-4 pt-2 font-mono text-xs text-muted-foreground" style={{ opacity: P.ev ? P.evOp : dk > 0.9 ? 1 : 0 }}>
          {P.ev ? P.ev.label : "projection live"}{" "}
          <b className={cn("font-semibold", P.ev?.positive ? "text-sage-dark" : "text-muted-foreground")}>{P.ev ? P.ev.delta : ""}</b>
        </p>
      </>
    );
  }
  const kn = ease(clamp01(k[2] / 0.55));
  const km = ease((k[2] - 0.6) / 0.3);
  const knob = lerp(72, 38, kn);
  return (
    <>
      <p className="mb-[18px] flex items-center gap-1.5 text-sm text-muted-foreground">
        <img src={slackLogo} alt="" className="h-3 w-3" />
        Slack
      </p>
      <div className="mb-3">
        <div className="flex justify-between font-mono text-[10.5px] text-muted-foreground">
          <span>Alert threshold</span>
          <span className="font-semibold text-foreground">${Math.round(lerp(400, 250, kn) / 10) * 10}K</span>
        </div>
        <div className="relative mt-2 h-1 rounded bg-border">
          <div className="absolute inset-y-0 left-0 rounded bg-sage-dark" style={{ width: `${knob}%` }} />
          <span
            className="absolute top-1/2 -ml-[7px] -mt-[7px] h-3.5 w-3.5 rounded-full border-2 border-sage-dark bg-card shadow-[0_2px_6px_rgba(26,42,40,.2)]"
            style={{ left: `${knob}%` }}
          />
        </div>
      </div>
      <div className="rounded-[10px] border border-border bg-background px-3 py-2.5" style={{ opacity: km, transform: `translateY(${((1 - km) * 8).toFixed(1)}px)` }}>
        <p className="text-xs font-semibold text-foreground">
          Zensus <span className="ml-1 font-mono text-[9px] font-normal uppercase text-muted-foreground">app</span>
        </p>
        <p className="mt-1 text-[14px] leading-[1.55] text-muted-foreground max-[759px]:text-xs">{SLACK_MESSAGE}</p>
      </div>
    </>
  );
}

// 300px between 760 and 1023, where the window sits under the step list and
// 340px would run past the bottom of a 900px-tall screen.
const windowClass =
  "relative flex h-[250px] flex-col overflow-hidden rounded-[18px] border border-border bg-card p-5 shadow-[0_30px_60px_-36px_rgba(26,42,40,.45)] min-[760px]:h-[300px] min-[760px]:p-7 min-[1024px]:h-[340px]";

const HowItWorks = () => {
  const reduced = useStaticPins();
  const narrow = useNarrow();
  const [p, setP] = useState(0);
  // The window's measured size (a ResizeObserver, not a read in the scroll
  // handler), for the wipe geometry.
  const [box, setBox] = useState({ w: 900, h: 340 });
  const stageRef = useRef<HTMLDivElement>(null);

  const onProgress = useCallback(({ progress }: ScrollProgress) => setP(progress), []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      const win = el.querySelector<HTMLElement>("[data-window]");
      setBox({ w: el.offsetWidth, h: win?.offsetHeight ?? 340 });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [reduced]);

  const act = Math.min(2, Math.floor(p * 3));
  const loc = clamp01(p * 3 - act);

  // The title scramble: each time a step becomes active inside the pin, its
  // title decodes over DECODE_MS on the handoff's 55ms tick, then the clock
  // stops (the spinner is a CSS animation).
  const pinned = !reduced && p > 0 && p < 1;
  const [dec, setDec] = useState({ act: -1, ms: DECODE_MS });
  useEffect(() => {
    if (!pinned) return;
    const t0 = performance.now();
    setDec({ act, ms: 0 });
    const id = window.setInterval(() => {
      const ms = performance.now() - t0;
      setDec({ act, ms });
      if (ms >= DECODE_MS) window.clearInterval(id);
    }, 55);
    return () => window.clearInterval(id);
  }, [act, pinned]);

  const k = reduced ? [1, 1, 1] : [0, 1, 2].map((i) => (i < act ? 1 : i > act ? 0 : loc));
  const s = reduced ? 0.99 : act === 1 ? (loc < 0.3 ? -1 : ((loc - 0.3) / 0.7) * 2.99) : act > 1 ? 2.99 : -1;

  const { w: sw, h: wH } = box;
  const diag = Math.hypot(sw, wH) * 1.04;
  const rv = (i: number) => (i === 0 ? 1 : ease(clamp01((p * 3 - i + 0.1) / 0.2)));
  const ox = (i: number) => (narrow ? Math.round((sw * (i + 0.5)) / 3) : 0);
  const oy = (i: number) => (narrow ? 0 : Math.round(wH * (0.2 + i * 0.3)));

  const jump = (i: number) => {
    const track = document.getElementById("how-it-works");
    if (!track || reduced) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + ((i + 0.5) / 3) * (track.offsetHeight - window.innerHeight), behavior: "smooth" });
  };

  const titleOf = (i: number) => {
    const shown = pinned && i === act && dec.act === act ? scramble(STEPS[i].title, clamp01(dec.ms / DECODE_MS), dec.ms) : STEPS[i].title;
    const scrambling = shown !== STEPS[i].title;
    return (
      <span className="relative inline-block">
        <span className={scrambling ? "text-transparent" : undefined}>{STEPS[i].title}</span>
        {scrambling && <span aria-hidden data-s={shown} className="absolute inset-0 whitespace-nowrap before:content-[attr(data-s)]" />}
      </span>
    );
  };

  return (
    <PinnedSection
      id="how-it-works"
      viewports={PIN_VIEWPORTS}
      onProgress={onProgress}
      aria-labelledby="how-heading"
      className="bg-background"
      stageClassName={reduced ? undefined : "overflow-hidden"}
    >
      <div className="h-full px-5 pb-5 pt-[calc(4rem+28px)] min-[760px]:px-8 min-[760px]:pb-10 min-[760px]:pt-[calc(4rem+52px)]">
        <div className="mx-auto flex h-full max-w-6xl flex-col gap-5 min-[760px]:gap-7 min-[1024px]:justify-center">
          <div className="grid items-end gap-x-10 gap-y-3 min-[1024px]:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <h2 id="how-heading" className="text-[30px] font-bold leading-[1.08] tracking-[-0.025em] text-foreground min-[760px]:text-[46px]">
              How it works
            </h2>
            <p className="text-pretty text-[15px] leading-[1.55] text-muted-foreground min-[760px]:text-lg">
              From sign-up to a live cash flow forecast in a few minutes.
            </p>
          </div>

          {reduced ? (
            // Reduced motion: every step's window in its end state.
            <ol className="grid gap-8 min-[1024px]:grid-cols-3 min-[1024px]:gap-6">
              {STEPS.map((st, i) => (
                <li key={st.title} className="min-w-0">
                  <div className={windowClass}>
                    <Diorama i={i} k={k} s={s} />
                  </div>
                  <span className="mt-4 block font-mono text-[11px] text-sage-dark">({i + 1})</span>
                  <h3 className="mt-1 text-[19px] font-semibold leading-[1.3] tracking-[-0.01em] text-foreground">{st.title}</h3>
                  <p className="mt-1 text-pretty text-[15px] leading-[1.6] text-muted-foreground">{st.desc}</p>
                </li>
              ))}
            </ol>
          ) : (
            <div className="grid min-h-0 flex-1 min-[1024px]:flex-none items-center gap-5 min-[1024px]:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] min-[1024px]:gap-16">
              {/* Step list (760px and up). */}
              <ol className="hidden flex-col min-[760px]:flex">
                {STEPS.map((st, i) => {
                  const on = i === act;
                  return (
                    <li key={st.title}>
                      {/* A click anywhere on the row jumps the pin to this step;
                          the button in the heading does the same from the
                          keyboard (a heading cannot sit inside a button, but a
                          button can sit inside a heading). */}
                      <div
                        onClick={() => jump(i)}
                        aria-current={on ? "step" : undefined}
                        className="relative w-full cursor-pointer border-t border-border py-5 pl-5 text-left"
                      >
                        <span aria-hidden className="absolute bottom-5 left-0 top-5 w-0.5 overflow-hidden rounded-sm bg-border">
                          <span className="block w-full bg-primary" style={{ height: `${(clamp01(p * 3 - i) * 100).toFixed(1)}%` }} />
                        </span>
                        <span className={cn("font-mono text-[11px]", on ? "text-sage-dark" : "text-muted-foreground")}>({i + 1})</span>
                        <h3 className={cn("mt-1.5 text-[19px] font-semibold leading-[1.3] tracking-[-0.01em] transition-colors duration-300", on ? "text-foreground" : "text-muted-foreground")}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              jump(i);
                            }}
                            className="rounded-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                          >
                            {titleOf(i)}
                          </button>
                        </h3>
                        <span className={cn("grid transition-[grid-template-rows] duration-[450ms] ease-out", on ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                          <span className="overflow-hidden">
                            <span className="mt-2 block text-pretty text-[15px] leading-[1.6] text-muted-foreground">{st.desc}</span>
                          </span>
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ol>

              {/* Phones: a three-segment rail and the active caption. The
                  inactive captions are only faded, so screen readers still get
                  all three steps (the step list above is hidden on phones). */}
              <div className="flex flex-col gap-3 min-[760px]:hidden">
                <div aria-hidden className="grid grid-cols-3 gap-2">
                  {STEPS.map((st, i) => (
                    <div key={st.title} className="h-0.5 overflow-hidden rounded-sm bg-border">
                      <div className="h-full bg-primary" style={{ width: `${(clamp01(p * 3 - i) * 100).toFixed(1)}%` }} />
                    </div>
                  ))}
                </div>
                <div className="grid">
                  {STEPS.map((st, i) => (
                    <div key={st.title} className="transition-opacity duration-[350ms] [grid-area:1/1]" style={{ opacity: i === act ? 1 : 0 }}>
                      <span className="font-mono text-[11px] text-sage-dark">({i + 1})</span>
                      <p className="mt-1 text-lg font-semibold text-foreground">{titleOf(i)}</p>
                      <p className="mt-1.5 text-sm leading-[1.55] text-muted-foreground">{st.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* The setup window: three stacked steps revealed by an iris wipe. */}
              <div ref={stageRef} aria-hidden className="relative min-w-0">
                <div className="grid">
                  {STEPS.map((st, i) => {
                    const r = rv(i);
                    const R = r * diag;
                    const rn = i < 2 ? rv(i + 1) : 0;
                    return (
                      <div
                        key={st.title}
                        className="min-w-0 [grid-area:1/1]"
                        style={{
                          clipPath: r >= 1 || i === 0 ? "none" : `circle(${R.toFixed(1)}px at ${ox(i)}px ${oy(i)}px)`,
                          transform: `scale(${(1 - 0.05 * rn).toFixed(4)})`,
                          filter: rn > 0.01 ? `blur(${(rn * 3).toFixed(2)}px) brightness(${(1 - 0.12 * rn).toFixed(3)})` : "none",
                        }}
                      >
                        <div data-window className={windowClass}>
                          <Diorama i={i} k={k} s={s} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* The glowing ring on each wipe's edge. */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[250px] overflow-hidden rounded-[18px] min-[760px]:h-[340px]">
                  {[1, 2].map((i) => {
                    const r = rv(i);
                    const R = r * diag;
                    return (
                      <span
                        key={i}
                        className="absolute rounded-full border-2 border-primary shadow-[0_0_28px_rgba(34,197,115,.45),inset_0_0_28px_rgba(34,197,115,.22)]"
                        style={{ left: ox(i) - R, top: oy(i) - R, width: 2 * R, height: 2 * R, opacity: r > 0 && r < 1 ? Math.sin(r * Math.PI) : 0 }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PinnedSection>
  );
};

export default HowItWorks;
