import { useEffect, useRef, useState } from "react";
import plaidLogo from "@/assets/integrations/plaid.svg";
import quickbooksLogo from "@/assets/integrations/quickbooks.svg";
import hubspotLogo from "@/assets/integrations/hubspot.svg";
import slackLogo from "@/assets/integrations/slack.svg";

/**
 * "How it works" as three living dioramas: each step is a miniature piece
 * of product UI that performs its own outcome when the row scrolls into
 * view, staggered left to right.
 *
 *   (1) Connect: provider rows flip from connecting to linked, one by one.
 *   (2) Projection: the forecast line draws in, then keeps fluctuating as
 *       cash events land (SMIL path morph; the history half stays fixed,
 *       the projection half moves).
 *   (3) Alert: a Slack notification slides in, the way step 3's outcome
 *       actually arrives.
 *
 * No pinning, no terminal. Reduced motion and the prerender get the
 * finished states: everything linked, a static projection, the message
 * visible.
 */

const PROVIDERS = [
  { name: "Plaid", logo: plaidLogo, logoClass: "logo-on-light" },
  { name: "QuickBooks", logo: quickbooksLogo, logoClass: "" },
  { name: "HubSpot", logo: hubspotLogo, logoClass: "" },
];

/* The projection half of the line is a chain of anchors at x = 85, 108,
   131, 154. A cash event REVISES the trajectory: the anchors interpolate
   to the event's shape (a one-time re-draw, the way a real forecast
   updates), instead of bouncing on a loop. The history half (left of the
   today divider) never moves. */
const HIST = "M6 46 C 22 43, 34 47, 48 43 C 54 41, 58 41, 62 40";
const buildProjD = (a: number[]) =>
  `${HIST} C 70 40, 77 ${a[0]}, 85 ${a[0]} C 93 ${a[0]}, 100 ${a[1]}, 108 ${a[1]}` +
  ` C 116 ${a[1]}, 123 ${a[2]}, 131 ${a[2]} C 139 ${a[2]}, 146 ${a[3]}, 154 ${a[3]}`;

const BASE_ANCHORS = [37, 34, 31, 28];

/* Each event: where the kink happens on the timeline (markerX points at
   the anchor whose index is markerIdx), how the trajectory reshapes, and
   the quantified impact. Shapes match the cause: an annual invoice steps
   the line UP from its date; payroll steps it DOWN early; a new contract
   steepens the slope progressively. */
const EVENTS = [
  {
    label: "Annual invoice posts Mar 14",
    delta: "+$48K",
    positive: true,
    anchors: [37, 22, 19, 16],
    markerIdx: 1,
    markerX: 108,
  },
  {
    label: "Payroll clears on the 1st",
    delta: "-$31K",
    positive: false,
    anchors: [42, 39, 36, 33],
    markerIdx: 0,
    markerX: 85,
  },
  {
    label: "New contract signed",
    delta: "+$9K MRR",
    positive: true,
    anchors: [35, 28, 20, 11],
    markerIdx: 2,
    markerX: 131,
  },
];

const STEPS = [
  {
    title: "Connect your data",
    description: "OAuth to Plaid, QuickBooks, or HubSpot. All three if you want. No uploads.",
  },
  {
    title: "Watch the projection move",
    description: "A 90-day projection that redraws itself the moment an invoice posts or payroll clears.",
  },
  {
    title: "Set your alert threshold",
    description: "Slack pings you the moment your 30-day projection crosses the line.",
  },
];

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

/* Shared mini-window chrome for the dioramas. */
const windowClass =
  "rounded-xl border border-border bg-card p-4 shadow-sm min-h-[150px]";

const HowItWorks = () => {
  const reducedMotion = usePrefersReducedMotion();
  const rowRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  // Number of provider rows that have finished linking (diorama 1).
  const [linked, setLinked] = useState(0);
  // Which cash event last revised the projection (diorama 2). -1 = none yet.
  const [eventIdx, setEventIdx] = useState(-1);
  const projPathRef = useRef<SVGPathElement>(null);
  const projDotRef = useRef<SVGCircleElement>(null);
  const anchorsRef = useRef<number[]>([...BASE_ANCHORS]);
  const projRafRef = useRef(0);

  useEffect(() => {
    if (reducedMotion) {
      setActive(true);
      setLinked(PROVIDERS.length);
      return;
    }
    const el = rowRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reducedMotion]);

  // Diorama 1: checkmarks land one by one once the row activates.
  useEffect(() => {
    if (!active || reducedMotion) return;
    const timers = [350, 800, 1250].map((ms, i) =>
      window.setTimeout(() => setLinked(i + 1), ms),
    );
    return () => timers.forEach(clearTimeout);
  }, [active, reducedMotion]);

  // Diorama 2: every few seconds a cash event lands and the projection
  // half of the line re-draws to its revised trajectory (rAF interpolation
  // of the anchor points; attributes mutated directly to avoid re-renders).
  useEffect(() => {
    if (!active || reducedMotion) return;

    const reviseTo = (target: number[]) => {
      cancelAnimationFrame(projRafRef.current);
      const from = [...anchorsRef.current];
      const t0 = performance.now();
      const DUR = 700;
      const tick = (now: number) => {
        const p = Math.min((now - t0) / DUR, 1);
        const e = 1 - Math.pow(1 - p, 3); // ease-out cubic
        const a = from.map((v, i) => v + (target[i] - v) * e);
        anchorsRef.current = a;
        projPathRef.current?.setAttribute("d", buildProjD(a));
        projDotRef.current?.setAttribute("cy", String(a[3]));
        if (p < 1) projRafRef.current = requestAnimationFrame(tick);
      };
      projRafRef.current = requestAnimationFrame(tick);
    };

    let idx = -1;
    let intervalId = 0;
    const advance = () => {
      idx = (idx + 1) % EVENTS.length;
      setEventIdx(idx);
      reviseTo(EVENTS[idx].anchors);
    };
    // First revision after the draw-in finishes, then a steady cadence.
    const first = window.setTimeout(() => {
      advance();
      intervalId = window.setInterval(advance, 3400);
    }, 2100);
    return () => {
      clearTimeout(first);
      clearInterval(intervalId);
      cancelAnimationFrame(projRafRef.current);
    };
  }, [active, reducedMotion]);

  return (
    <section id="how-it-works" className="section-padding scroll-mt-28 bg-secondary/30">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            How it works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From sign-up to a live cash flow forecast in under 2 minutes
          </p>
        </div>

        <div ref={rowRef} className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
          {/* (1) Connect: providers link one by one. */}
          <div>
            <div className={windowClass}>
              <p className="mb-3 text-xs text-muted-foreground">Connect your sources</p>
              <ul className="space-y-2.5">
                {PROVIDERS.map((p, i) => {
                  const done = i < linked;
                  const connecting = active && !done && i === linked;
                  return (
                    <li key={p.name} className="flex items-center gap-2.5 text-sm text-foreground">
                      <img
                        src={p.logo}
                        alt=""
                        width={16}
                        height={16}
                        className={`h-4 w-4 ${p.logoClass}`}
                      />
                      {p.name}
                      <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[10px]">
                        {done ? (
                          <span className="text-[hsl(var(--sage-deep))]">&#10003; linked</span>
                        ) : connecting ? (
                          <>
                            <span
                              aria-hidden
                              className="h-2.5 w-2.5 animate-spin rounded-full border-[1.5px] border-[hsl(var(--sage-deep))] border-t-transparent motion-reduce:hidden"
                            />
                            <span className="text-muted-foreground">connecting</span>
                          </>
                        ) : (
                          <span className="text-muted-foreground/60">queued</span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="mt-4">
              <span className="font-mono text-[11px] text-primary">(1)</span>
              <h3 className="mt-1 text-base font-semibold text-foreground">{STEPS[0].title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {STEPS[0].description}
              </p>
            </div>
          </div>

          {/* (2) Projection: the line draws, then fluctuates as events land. */}
          <div>
            <div className={windowClass}>
              <p className="mb-2 text-xs text-muted-foreground">90-day projection</p>
              <svg viewBox="0 0 160 64" role="img" aria-label="Cash flow projection line that is revised each time a cash event lands" className="w-full">
                {/* Today divider: history left, projection right. */}
                <line x1="62" y1="6" x2="62" y2="58" strokeDasharray="2 3" strokeWidth="1" className="stroke-[hsl(var(--border))]" />
                <text x="62" y="63" textAnchor="middle" fontSize="5.5" className="fill-[hsl(var(--muted-foreground))] font-mono">
                  today
                </text>
                <path
                  ref={projPathRef}
                  d={buildProjD(BASE_ANCHORS)}
                  pathLength={1}
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="stroke-[hsl(var(--sage-deep))]"
                  style={
                    reducedMotion
                      ? undefined
                      : {
                          strokeDasharray: 1,
                          strokeDashoffset: active ? 0 : 1,
                          transition: "stroke-dashoffset 1200ms cubic-bezier(0.22, 1, 0.36, 1) 400ms",
                        }
                  }
                />
                {/* Kink marker: where the current event hit the timeline. */}
                {eventIdx >= 0 && (
                  <circle
                    key={eventIdx}
                    cx={EVENTS[eventIdx].markerX}
                    cy={EVENTS[eventIdx].anchors[EVENTS[eventIdx].markerIdx]}
                    r="3.5"
                    fill="none"
                    strokeWidth="1.5"
                    className="animate-fade-in stroke-[hsl(var(--primary))]"
                  />
                )}
                <circle ref={projDotRef} cx="154" cy={BASE_ANCHORS[3]} r="3" className="fill-[hsl(var(--primary))]" />
              </svg>
              {/* The cash event that just revised the line, with its impact. */}
              <p className="mt-2 h-4 font-mono text-[10px] text-muted-foreground" aria-live="off">
                {eventIdx >= 0 ? (
                  <span key={eventIdx} className="inline-block animate-fade-in">
                    {EVENTS[eventIdx].label}{" "}
                    <span
                      className={
                        EVENTS[eventIdx].positive
                          ? "font-semibold text-[hsl(var(--sage-dark))]"
                          : "font-semibold text-foreground/70"
                      }
                    >
                      {EVENTS[eventIdx].delta}
                    </span>
                  </span>
                ) : (
                  <span className={reducedMotion ? "" : "text-muted-foreground/60"}>
                    {reducedMotion ? `${EVENTS[0].label} ${EVENTS[0].delta}` : "projection live"}
                  </span>
                )}
              </p>
            </div>
            <div className="mt-4">
              <span className="font-mono text-[11px] text-primary">(2)</span>
              <h3 className="mt-1 text-base font-semibold text-foreground">{STEPS[1].title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {STEPS[1].description}
              </p>
            </div>
          </div>

          {/* (3) Alert: the Slack ping arrives. */}
          <div>
            <div className={windowClass}>
              <p className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <img src={slackLogo} alt="" width={12} height={12} className="h-3 w-3" />
                Slack
              </p>
              <div
                className={`rounded-lg border border-border border-l-[3px] border-l-primary bg-background px-3 py-2.5 transition-all duration-500 motion-reduce:transition-none ${
                  active ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                }`}
                style={reducedMotion ? undefined : { transitionDelay: "1400ms" }}
              >
                <p className="text-xs font-semibold text-foreground">
                  Zensus{" "}
                  <span className="ml-1 font-mono text-[9px] font-normal uppercase text-muted-foreground">
                    app
                  </span>
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  30-day projection crossed your $250K minimum. Zero-cash date moved
                  to Oct 2.
                </p>
              </div>
            </div>
            <div className="mt-4">
              <span className="font-mono text-[11px] text-primary">(3)</span>
              <h3 className="mt-1 text-base font-semibold text-foreground">{STEPS[2].title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {STEPS[2].description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
