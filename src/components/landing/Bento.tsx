import { useCallback, useEffect, useRef, useState } from "react";
import plaidLogo from "@/assets/integrations/plaid.svg";
import quickbooksLogo from "@/assets/integrations/quickbooks.svg";
import hubspotLogo from "@/assets/integrations/hubspot.svg";
import slackLogo from "@/assets/integrations/slack.svg";
import zensusLogo from "@/assets/zensus-logo.png";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type { ScrollProgress } from "@/hooks/use-scroll-progress";
import { clamp01, easeInOutCubic as ease, lerp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { PinnedSection } from "./PinnedSection";

/*
 * Sync section from handoff 08-sync (locked 16d), pinned for 4 viewports, one
 * beat per fact:
 *   1. The source chips connect, their input lines draw, and they get ticks.
 *   2. A glowing shimmer sweeps each input line into the hub ("webhook" /
 *      "daily"; QuickBooks slower), and the Incoming card shows raw bank rows.
 *   3. The output lines draw, the zero-cash date resolves from "Calculating..."
 *      and keeps recalculating, and the shimmer runs out to it and to Slack.
 *   4. Raw bank descriptors flip to clean vendor names ("Normalized").
 * The fact rails fill one per beat; on phones only the active fact shows, but
 * all four stay in the HTML. Geometry, easing and timings are the handoff's
 * renderVals(). Transaction names, amounts and dates are its placeholders.
 * Reduced motion: the end state, still (no shimmer, no ticking).
 *
 * Corrections: the app shows the zero-cash date as a month and year, so the
 * fact says "The month you run out" and the chip cycles months, not days.
 */

const FACTS = [
  { lead: "Connect in 60 seconds.", tail: "OAuth to Plaid, QuickBooks, and HubSpot. No spreadsheets, no CSV uploads." },
  { lead: "Automatic sync.", tail: "Bank and HubSpot changes arrive by webhook. QuickBooks syncs daily." },
  { lead: "Zero-cash date.", tail: "The month you run out, recalculated live." },
  { lead: "Vendor normalization.", tail: "Stripe payouts, ACH transfers, and card purchases all reconcile cleanly." },
];

const SOURCES = [
  // The Plaid file is the full wordmark; cropping it to its left edge leaves the
  // square mark, which is what the 15px icon slot shows (the name is beside it).
  { name: "Plaid", icon: plaidLogo, className: "logo-on-light object-cover object-left", sync: "webhook" },
  { name: "QuickBooks", icon: quickbooksLogo, sync: "daily" },
  { name: "HubSpot", icon: hubspotLogo, sync: "webhook" },
];

const ROWS = [
  { raw: "STRIPE TRANSFER ST-8841XQ", clean: "Stripe payout", amt: "+$18,240" },
  { raw: "ACH DEBIT 0291 GUSTO PAYRL", clean: "Gusto payroll · ACH", amt: "−$42,310" },
  { raw: "AMEX 1004 AWS*BILLING WA", clean: "AWS · card", amt: "−$2,184" },
];

const DATES = ["Mar 2027", "Apr 2027", "Mar 2027"];
const PIN_VIEWPORTS = 4;

type Pt = [number, number];
type Bez = [Pt, Pt, Pt, Pt];
type Box = { x: number; y: number; w: number; h: number };

const bez = (P: Bez, t: number): Pt => {
  const u = 1 - t;
  return [0, 1].map((k) => u * u * u * P[0][k] + 3 * u * u * t * P[1][k] + 3 * u * t * t * P[2][k] + t * t * t * P[3][k]) as Pt;
};
const blen = (P: Bez) => {
  let L = 0;
  let a = bez(P, 0);
  for (let i = 1; i <= 24; i++) {
    const b = bez(P, i / 24);
    L += Math.hypot(b[0] - a[0], b[1] - a[1]);
    a = b;
  }
  return L;
};
const dstr = (P: Bez) => `M${P[0][0]} ${P[0][1]} C ${P[1][0]} ${P[1][1]}, ${P[2][0]} ${P[2][1]}, ${P[3][0]} ${P[3][1]}`;

// Desktop 720x300 and phone 360x440 layouts (below 760px).
const GEO = {
  d: {
    W: 720,
    H: 300,
    hub: [376, 140] as Pt,
    lg: 30,
    fs: 20,
    src: [
      { x: 30, y: 43, w: 120, h: 34 },
      { x: 30, y: 123, w: 120, h: 34 },
      { x: 30, y: 203, w: 120, h: 34 },
    ],
    outs: [
      { x: 560, y: 78, w: 130, h: 44 },
      { x: 560, y: 163, w: 130, h: 34 },
    ],
    card: { x: 246, y: 186, w: 260 },
    inB: (s: Box): Bez => [[150, s.y + 17], [228, s.y + 17], [228, 140], [306, 140]],
    outB: (o: Box): Bez => [[446, 140], [503, 140], [503, o.y + o.h / 2], [560, o.y + o.h / 2]],
    labelT: 0.42,
  },
  m: {
    W: 360,
    H: 440,
    hub: [180, 150] as Pt,
    lg: 28,
    fs: 18,
    src: [
      { x: 14, y: 18, w: 96, h: 32 },
      { x: 128, y: 18, w: 104, h: 32 },
      { x: 250, y: 18, w: 96, h: 32 },
    ],
    outs: [
      { x: 22, y: 236, w: 136, h: 42 },
      { x: 206, y: 240, w: 130, h: 34 },
    ],
    card: { x: 14, y: 302, w: 332 },
    inB: (s: Box): Bez => [[s.x + s.w / 2, 50], [s.x + s.w / 2, 95], [180, 95], [180, 134]],
    outB: (o: Box): Bez => [[180, 166], [180, 205], [o.x + o.w / 2, 205], [o.x + o.w / 2, o.y]],
    labelT: 0,
  },
};

function useNarrow() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 759px)");
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return narrow;
}

const Bento = () => {
  const reduced = usePrefersReducedMotion();
  const narrow = useNarrow();
  const [scrollP, setP] = useState(0);
  const [clock, setNow] = useState(0);
  const diagramRef = useRef<HTMLDivElement>(null);

  const onProgress = useCallback(({ progress }: ScrollProgress) => setP(progress), []);

  // The shimmer, hub pulse and ticking readouts run on a clock, but only while
  // the diagram is on screen and never under reduced motion.
  useEffect(() => {
    const el = diagramRef.current;
    if (reduced || !el || typeof IntersectionObserver === "undefined") return;
    let raf = 0;
    let t0 = 0;
    const tick = (t: number) => {
      if (!t0) t0 = t;
      setNow(t - t0);
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const P = reduced ? 1 : scrollP;
  const now = reduced ? 0 : clock;
  const G = narrow ? GEO.m : GEO.d;
  const { W, H } = G;
  const pc = (x: number, y: number) => [(x / W) * 100, (y / H) * 100];
  const box = (r: Box) => ({ left: `${(r.x / W) * 100}%`, top: `${(r.y / H) * 100}%`, width: `${(r.w / W) * 100}%`, height: `${(r.h / H) * 100}%` });

  const kc = [0, 1, 2].map((i) => ease((P - 0.02 - i * 0.04) / 0.07));
  const kb = [0, 1, 2].map((i) => ease((P - 0.08 - i * 0.03) / 0.12));
  const kFlow = ease((P - 0.26) / 0.06);
  const ko = ease((P - 0.52) / 0.1);
  const kO = [0, 1].map((i) => ease((P - 0.5 - i * 0.06) / 0.08));
  const kZ = ease((P - 0.6) / 0.06);
  const kCard = ease((P - 0.27) / 0.08);

  const ins = G.src.map(G.inB);
  const outs = G.outs.map(G.outB);
  const beams = [...ins.map((B, i) => [B, kb[i]] as const), ...outs.map((B) => [B, ko] as const)].map(([B, k]) => {
    const L = blen(B);
    return { d: dstr(B), len: L, off: L * (1 - k) };
  });

  const shims: { d: string; da: string; off: number; da2: string; off2: number; op: number; gop: number }[] = [];
  if (!reduced && kFlow > 0) {
    const add = (B: Bez, sp: number, o: number, k: number) => {
      const L = blen(B);
      const seg = Math.max(26, L * 0.28);
      const t = (now / sp + o) % 1;
      const pos = t * (L + seg);
      const fade = Math.min(1, t * 5, (1 - t) * 5) * k;
      shims.push({
        d: dstr(B),
        da: `${seg.toFixed(1)} ${(L + seg * 2).toFixed(1)}`,
        off: seg - pos,
        da2: `${(seg * 0.4).toFixed(1)} ${(L + seg * 2).toFixed(1)}`,
        off2: seg * 0.4 - pos + seg * 0.3,
        op: 0.95 * fade,
        gop: 0.45 * fade,
      });
    };
    ins.forEach((B, i) => add(B, i === 1 ? 3400 : 2100, i * 0.31, kFlow));
    if (ko > 0.9) outs.forEach((B, i) => add(B, 2300, 0.15 + i * 0.5, 1));
  }

  const labels = narrow
    ? []
    : ins.map((B, i) => {
        const [x, y] = bez(B, G.labelT);
        const [lx, ly] = pc(x, y - 13);
        return { t: SOURCES[i].sync, x: lx, y: ly };
      });

  const zOn = kZ > 0.5;
  const [hx, hy] = pc(G.hub[0], G.hub[1]);
  const ring = kFlow * (3 + 3 * (0.5 + 0.5 * Math.sin(now / 300)));
  const secs = 1 + (Math.floor(now / 1000) % 5);
  const factFill = [0, 1, 2, 3].map((i) => clamp01(P * 4 - i));
  const activeFact = Math.min(3, Math.floor(P * 4));

  return (
    <PinnedSection id="sync" viewports={PIN_VIEWPORTS} onProgress={onProgress} aria-labelledby="sync-heading" className="bg-background" stageClassName="overflow-hidden">
      <div className="h-full px-5 pb-5 pt-[calc(4rem+28px)] min-[760px]:px-8 min-[760px]:pb-10 min-[760px]:pt-[calc(4rem+52px)]">
        <div className="mx-auto flex h-full max-w-6xl flex-col gap-4 min-[760px]:gap-7">
          <div className="mx-auto max-w-3xl text-center">
            <h2 id="sync-heading" className="text-balance text-[28px] font-bold leading-[1.08] tracking-[-0.025em] text-foreground min-[760px]:text-[46px]">
              Everything stays in sync.
            </h2>
            <p className="mt-2.5 text-pretty text-[15px] leading-[1.55] text-muted-foreground min-[760px]:mt-4 min-[760px]:text-lg">
              Your sources stream through Zensus so the forecast never goes stale.
            </p>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center">
            <div
              ref={diagramRef}
              role="img"
              aria-label="Diagram: Plaid, QuickBooks, and HubSpot stream into Zensus, which outputs your zero-cash date and Slack alerts"
              className="relative w-full max-w-[380px] min-[760px]:max-w-[880px]"
              style={{ aspectRatio: `${W} / ${H}`, maxHeight: "100%" }}
            >
              <svg aria-hidden viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" className="absolute inset-0 overflow-visible">
                <defs>
                  <filter id="sync-shim-glow" x="-20%" y="-50%" width="140%" height="200%">
                    <feGaussianBlur stdDeviation="2.2" />
                  </filter>
                </defs>
                {beams.map((b, i) => (
                  <path
                    key={i}
                    d={b.d}
                    fill="none"
                    stroke="#0E5C3A"
                    strokeOpacity={0.55}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeDasharray={b.len.toFixed(1)}
                    strokeDashoffset={b.off.toFixed(1)}
                  />
                ))}
                {shims.map((s, i) => (
                  <g key={i}>
                    <path d={s.d} fill="none" stroke="#22C573" strokeOpacity={s.gop} strokeWidth={6} strokeLinecap="round" strokeDasharray={s.da} strokeDashoffset={s.off} filter="url(#sync-shim-glow)" />
                    <path d={s.d} fill="none" stroke="#7CF0B0" strokeOpacity={s.op} strokeWidth={2.25} strokeLinecap="round" strokeDasharray={s.da} strokeDashoffset={s.off} />
                    <path d={s.d} fill="none" stroke="#FFFDF7" strokeOpacity={s.op} strokeWidth={1.25} strokeLinecap="round" strokeDasharray={s.da2} strokeDashoffset={s.off2} />
                  </g>
                ))}
              </svg>

              <div aria-hidden>
                {labels.map((l) => (
                  <span
                    key={l.t + l.y}
                    className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-border bg-background px-[7px] py-0.5 font-mono text-[10px] text-sage-dark"
                    style={{ left: `${l.x}%`, top: `${l.y}%`, opacity: kFlow }}
                  >
                    {l.t}
                  </span>
                ))}

                {SOURCES.map((s, i) => (
                  <div
                    key={s.name}
                    className={cn(
                      "absolute flex items-center justify-center gap-[5px] whitespace-nowrap rounded-[9px] border bg-card text-[11.5px] text-foreground transition-colors duration-300 min-[760px]:gap-[7px] min-[760px]:text-[13px]",
                      kb[i] > 0.95 ? "border-primary" : "border-border",
                    )}
                    style={{ ...box(G.src[i]), opacity: 0.25 + 0.75 * kc[i], transform: `scale(${lerp(0.92, 1, kc[i])})` }}
                  >
                    <img src={s.icon} alt="" className={cn("h-[15px] w-[15px] object-contain", s.className)} />
                    <span>{s.name}</span>
                    <span
                      className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground"
                      style={{ transform: `scale(${ease((P - 0.14 - i * 0.03) / 0.04)})` }}
                    >
                      ✓
                    </span>
                  </div>
                ))}

                <div
                  className="absolute flex items-center justify-center gap-[5px] whitespace-nowrap rounded-[9px] border border-border bg-card text-[11.5px] text-foreground min-[760px]:gap-[7px] min-[760px]:text-[13px]"
                  style={{ ...box(G.outs[1]), opacity: 0.25 + 0.75 * kO[1], transform: `scale(${lerp(0.92, 1, kO[1])})` }}
                >
                  <img src={slackLogo} alt="" className="h-[15px] w-[15px]" />
                  <span>Slack alert</span>
                </div>

                <div
                  className={cn(
                    "absolute flex flex-col items-center justify-center gap-px rounded-[9px] border transition-colors duration-[400ms]",
                    zOn ? "border-forest bg-forest text-forest-foreground" : "border-border bg-card text-foreground",
                  )}
                  style={{ ...box(G.outs[0]), opacity: 0.25 + 0.75 * kO[0], transform: `scale(${lerp(0.92, 1, kO[0])})` }}
                >
                  <span className={cn("whitespace-nowrap font-mono text-[9.5px] tracking-[0.08em]", zOn ? "text-forest-muted" : "text-muted-foreground")}>
                    Zero-cash date
                  </span>
                  <span className="whitespace-nowrap text-[13px] font-semibold tracking-[-0.01em] min-[760px]:text-sm">
                    {zOn ? DATES[Math.floor(now / 2600) % DATES.length] : "Calculating…"}
                  </span>
                </div>

                <div className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2" style={{ left: `${hx}%`, top: `${hy}%` }}>
                  <img
                    src={zensusLogo}
                    alt=""
                    className="rounded-[7px]"
                    style={{ width: G.lg, height: G.lg, boxShadow: `0 0 0 ${ring.toFixed(1)}px rgba(34,197,115,.14)` }}
                  />
                  <span className="font-semibold tracking-[-0.02em] text-foreground" style={{ fontSize: G.fs }}>
                    Zensus
                  </span>
                </div>

                <div
                  className="absolute rounded-[10px] border border-border bg-card px-2.5 pb-1.5 pt-2 shadow-[0_18px_32px_-22px_rgba(26,42,40,.45)]"
                  style={{
                    left: `${(G.card.x / W) * 100}%`,
                    top: `${(G.card.y / H) * 100}%`,
                    width: `${(G.card.w / W) * 100}%`,
                    opacity: kCard,
                    transform: `translateY(${((1 - kCard) * 10).toFixed(1)}px)`,
                  }}
                >
                  <div className="flex items-center justify-between gap-2 font-mono text-[10px]">
                    <span className="uppercase tracking-[0.12em] text-muted-foreground">{P > 0.78 ? "Normalized" : "Incoming"}</span>
                    <span className="flex items-center gap-[5px] whitespace-nowrap text-sage-dark">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" style={{ opacity: reduced ? 1 : 0.5 + 0.5 * Math.sin(now / 250) }} />
                      Synced {secs}s ago
                    </span>
                  </div>
                  <div className="mt-1 flex flex-col">
                    {ROWS.map((r, j) => {
                      const kr = ease((P - 0.3 - j * 0.04) / 0.06);
                      const kn = ease((P - 0.78 - j * 0.05) / 0.07);
                      return (
                        <div
                          key={r.raw}
                          className="grid h-[26px] grid-cols-[16px_minmax(0,1fr)_auto] items-center gap-2 border-t border-[#F1E6CB] min-[760px]:h-6"
                          style={{ opacity: kr, transform: `translateX(${((1 - kr) * -10).toFixed(1)}px)` }}
                        >
                          <img src={plaidLogo} alt="" className="logo-on-light h-[13px] w-[13px] object-cover object-left" />
                          <div className="grid min-w-0">
                            <span
                              className="truncate font-mono text-[10.5px] text-muted-foreground [grid-area:1/1]"
                              style={{ opacity: 1 - kn, transform: `translateY(${(-kn * 6).toFixed(1)}px)` }}
                            >
                              {r.raw}
                            </span>
                            <span
                              className="flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-foreground [grid-area:1/1]"
                              style={{ opacity: kn, transform: `translateY(${((1 - kn) * 6).toFixed(1)}px)` }}
                            >
                              <span className="text-[11px] text-primary">✓</span>
                              {r.clean}
                            </span>
                          </div>
                          <span className={cn("whitespace-nowrap font-mono text-[11px]", r.amt.startsWith("+") ? "text-sage-dark" : "text-foreground")}>{r.amt}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* The four facts: rails fill one per beat. Phones show only the
              active fact; all four stay in the HTML. */}
          <div className="mx-auto w-full max-w-[1040px]">
            <ol className="grid grid-cols-4 gap-2.5 min-[760px]:gap-7">
              {FACTS.map((f, i) => (
                <li key={f.lead} className="flex min-w-0 flex-col gap-2.5">
                  <div aria-hidden className="h-0.5 overflow-hidden rounded-sm bg-border">
                    <div className="h-full bg-foreground" style={{ width: `${(factFill[i] * 100).toFixed(1)}%` }} />
                  </div>
                  <p className="hidden text-pretty text-sm leading-[1.55] min-[760px]:block">
                    <span className="mr-1.5 font-mono text-[11px] text-sage-dark">({i + 1})</span>
                    <b className={cn("font-semibold transition-colors duration-300", reduced || i === activeFact ? "text-foreground" : "text-muted-foreground")}>{f.lead}</b>{" "}
                    <span className="text-muted-foreground">{f.tail}</span>
                  </p>
                </li>
              ))}
            </ol>
            <div aria-hidden className="mt-3 grid min-[760px]:hidden">
              {FACTS.map((f, i) => (
                <p
                  key={f.lead}
                  className={cn(
                    "text-sm leading-[1.55] transition-[opacity,transform] duration-[400ms] [grid-area:1/1]",
                    i === activeFact ? "translate-y-0 opacity-100" : i < activeFact ? "-translate-y-2 opacity-0" : "translate-y-2 opacity-0",
                  )}
                >
                  <span className="mr-1.5 font-mono text-[11px] text-sage-dark">({i + 1})</span>
                  <b className="font-semibold">{f.lead}</b> <span className="text-muted-foreground">{f.tail}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PinnedSection>
  );
};

export default Bento;
