import { useCallback, useEffect, useRef, useState } from "react";
import billIcon from "@/assets/integrations/bill-icon.png";
import gmailIcon from "@/assets/integrations/gmail-icon.svg";
import googleDriveIcon from "@/assets/integrations/google-drive-icon.svg";
import plaidLogo from "@/assets/integrations/plaid.svg";
import quickbooksLogo from "@/assets/integrations/quickbooks-logo-black.png";
import rampIcon from "@/assets/integrations/ramp-icon.png";
import zensusLogo from "@/assets/zensus-logo-64.webp";
import { useStaticPins } from "@/hooks/use-prefers-reduced-motion";
import type { ScrollProgress } from "@/hooks/use-scroll-progress";
import { easeInOutCubic as ease, lerp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { PinnedSection } from "./PinnedSection";

/*
 * Sync section, locked 16d: handoff 08-sync, revised by handoff 21 (4 Nov
 * 2026), which removes the four-fact strip, sets the logos by the brand rules
 * and thins the shimmer. Pinned for 4 viewports, four beats:
 *   1. The source chips connect, their input lines draw, and they get ticks.
 *   2. A glowing shimmer sweeps each input line into the hub ("webhook" /
 *      "daily"; QuickBooks slower), and the Incoming card shows raw bank rows.
 *   3. The output lines draw, the zero-cash date resolves from "Calculating..."
 *      and keeps recalculating, and the shimmer runs out to it and to Slack.
 *   4. Raw bank descriptors flip to clean vendor names ("Normalized").
 * Geometry, easing and timings are the handoff's renderVals(). Transaction
 * names, amounts and dates are its placeholders. The diagram is decorative
 * (aria-hidden); a visually hidden sentence names the sources and outputs.
 * Reduced motion or a short viewport: the end state, still (no shimmer, no
 * ticking).
 *
 * Six sources (Plaid, QuickBooks, BILL, Ramp, HubSpot, Gmail and Google
 * Drive; the last three added 10 Nov 2026 on top of the handoff's three):
 * a column of six on desktop, two columns of three on phones.
 *
 * Logos (handoff 21 brand rules): Plaid's white logo, unaltered, on a forest
 * pill; Intuit's official black QuickBooks file with clear space; BILL's and
 * Ramp's square icons, unaltered and alone in their boxes (see SHOW_BILL_LOGO
 * and SHOW_RAMP_LOGO); Google's own Gmail and Drive product icons, each next
 * to the product names (Google: no product icon by itself, first mention of
 * Google Drive with the trademark mark); HubSpot and "Slack alert" as plain
 * text (both restrict their logos); no logo on the transaction rows. The shimmer
 * is the handoff's three strokes, but the glow is a faint wider stroke instead
 * of an SVG blur filter, which repainted on the CPU every frame.
 * The ambient motion (shimmer, hub pulse, ticking readouts) runs for at most
 * CLOCK_MS each time the diagram comes into view, then settles (WCAG 2.2.2).
 *
 * Correction kept from 08-sync: the app shows the zero-cash date as a month
 * and year, so the chip cycles months, not days.
 */

// The sync cadence on each wire matches the app (Plaid and HubSpot webhooks,
// QuickBooks daily; app code, 4 Nov 2026). The newer sources have no label:
// their cadence is not confirmed.
const SOURCES: { name: string; sync?: string }[] = [
  { name: "Plaid", sync: "webhook" },
  { name: "QuickBooks", sync: "daily" },
  { name: "BILL" },
  { name: "Ramp" },
  { name: "HubSpot", sync: "webhook" },
  { name: "Gmail & Google Drive" },
];

// BILL's brand terms (Third Party Trademark Use Terms, Aug 2023) allow its
// logo only with prior written permission, which BILL reviews before
// publication: communications@hq.bill.com. The owner chose to ship it first
// (10 Nov 2026). The icon is the 256px PNG from logo.dev (bill.com), not a
// file from BILL; replace it with BILL's own icon SVG when BILL sends it. It
// is shown square and unaltered, alone in its box, and its box does not scale
// in (BILL bars animating its logo). Set false for the plain name "BILL".
const SHOW_BILL_LOGO = true;
// Ramp: no public logo terms found (Developer Terms are accepted in its
// console; partner messaging guidelines are a PDF in its partner portal). The
// icon is the 256px PNG from logo.dev (ramp.com). Set false for the name.
const SHOW_RAMP_LOGO = true;

const ROWS = [
  { raw: "STRIPE TRANSFER ST-8841XQ", clean: "Stripe payout", amt: "+$18,240" },
  { raw: "ACH DEBIT 0291 GUSTO PAYRL", clean: "Gusto payroll · ACH", amt: "−$42,310" },
  { raw: "AMEX 1004 AWS*BILLING WA", clean: "AWS · card", amt: "−$2,184" },
];

const DATES = ["Mar 2027", "Apr 2027", "Mar 2027"];
const PIN_VIEWPORTS = 4;
const CLOCK_MS = 10000;

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

// Desktop 720x336 and phone 360x466 layouts (below 760px).
const GEO = {
  d: {
    W: 720,
    H: 336,
    hub: [376, 166] as Pt,
    lg: 40,
    fs: 25,
    src: [0, 1, 2, 3, 4, 5].map((i) => ({ x: 24, y: 14 + 52 * i, w: 132, h: 44 })),
    outs: [
      { x: 560, y: 103, w: 130, h: 46 },
      { x: 560, y: 188, w: 130, h: 36 },
    ],
    card: { x: 266, y: 218, w: 250 },
    inB: (s: Box): Bez => [[s.x + s.w, s.y + s.h / 2], [228, s.y + s.h / 2], [228, 166], [306, 166]],
    outB: (o: Box): Bez => [[446, 166], [503, 166], [503, o.y + o.h / 2], [560, o.y + o.h / 2]],
    labelT: 0.42,
  },
  m: {
    W: 360,
    H: 466,
    hub: [180, 214] as Pt,
    lg: 34,
    fs: 22,
    // Two columns of three, funnelling into one trunk down the middle.
    src: [0, 1, 2, 3, 4, 5].map((i) => ({ x: i < 3 ? 14 : 204, y: 14 + 56 * (i % 3), w: 142, h: 44 })),
    outs: [
      { x: 22, y: 284, w: 136, h: 46 },
      { x: 206, y: 288, w: 130, h: 38 },
    ],
    card: { x: 14, y: 346, w: 332 },
    inB: (s: Box): Bez => {
      const left = s.x < 180;
      const y = s.y + s.h / 2;
      return [[left ? s.x + s.w : s.x, y], [180, y], [180, 176], [180, 198]];
    },
    outB: (o: Box): Bez => [[180, 230], [180, 258], [o.x + o.w / 2, 258], [o.x + o.w / 2, o.y]],
    labelT: 0,
  },
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

const Bento = () => {
  const reduced = useStaticPins();
  const narrow = useNarrow();
  const [scrollP, setP] = useState(0);
  const [clock, setNow] = useState(0);
  const diagramRef = useRef<HTMLDivElement>(null);

  const onProgress = useCallback(({ progress }: ScrollProgress) => setP(progress), []);

  const P = reduced ? 1 : scrollP;
  const kFlow = ease((P - 0.26) / 0.06);
  const flowing = !reduced && kFlow > 0;
  const [settled, setSettled] = useState(false);

  // The shimmer, hub pulse and ticking readouts run on a clock, but only once
  // the shimmer has started, only while the diagram is on screen, and for at
  // most CLOCK_MS per visit; never under reduced motion.
  useEffect(() => {
    const el = diagramRef.current;
    if (!flowing || !el || typeof IntersectionObserver === "undefined") return;
    let raf = 0;
    let t0 = 0;
    const tick = (t: number) => {
      if (!t0) t0 = t;
      if (t - t0 > CLOCK_MS) {
        setSettled(true);
        return;
      }
      setNow(t - t0);
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((entries) => {
      const entry = entries[entries.length - 1];
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) {
        t0 = 0;
        setSettled(false);
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [flowing]);

  const still = reduced || settled;
  const now = reduced ? 0 : clock;
  const G = narrow ? GEO.m : GEO.d;
  const { W, H } = G;
  const pc = (x: number, y: number) => [(x / W) * 100, (y / H) * 100];
  const box = (r: Box) => ({ left: `${(r.x / W) * 100}%`, top: `${(r.y / H) * 100}%`, width: `${(r.w / W) * 100}%`, height: `${(r.h / H) * 100}%` });

  const kc = SOURCES.map((_, i) => ease((P - 0.02 - i * 0.022) / 0.06));
  const kb = SOURCES.map((_, i) => ease((P - 0.07 - i * 0.016) / 0.1));
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
  if (!still && kFlow > 0) {
    const add = (B: Bez, sp: number, o: number, k: number) => {
      const L = blen(B);
      const seg = Math.max(34, L * 0.34);
      const t = (now / sp + o) % 1;
      const pos = t * (L + seg);
      const fade = Math.min(1, t * 5, (1 - t) * 5) * k;
      shims.push({
        d: dstr(B),
        da: `${seg.toFixed(1)} ${(L + seg * 2).toFixed(1)}`,
        off: seg - pos,
        da2: `${(seg * 0.4).toFixed(1)} ${(L + seg * 2).toFixed(1)}`,
        off2: seg * 0.4 - pos + seg * 0.3,
        op: 0.6 * fade,
        gop: 0.25 * fade,
      });
    };
    ins.forEach((B, i) => {
      const sp = SOURCES[i].sync === "daily" ? 3000 : 1900;
      add(B, sp, i * 0.31, kFlow);
      add(B, sp, i * 0.31 + 0.5, kFlow);
    });
    if (ko > 0.9)
      outs.forEach((B, i) => {
        add(B, 2000, 0.15 + i * 0.37, 1);
        add(B, 2000, 0.65 + i * 0.37, 1);
      });
  }

  const labels = narrow
    ? []
    : ins.flatMap((B, i) => {
        const sync = SOURCES[i].sync;
        if (!sync) return [];
        const [x, y] = bez(B, G.labelT);
        const [lx, ly] = pc(x, y + (B[0][1] > G.hub[1] ? 13 : -13));
        return [{ t: sync, x: lx, y: ly }];
      });

  const zOn = kZ > 0.5;
  const [hx, hy] = pc(G.hub[0], G.hub[1]);
  const ring = kFlow * (still ? 4.5 : 3 + 3 * (0.5 + 0.5 * Math.sin(now / 300)));
  const secs = 1 + (Math.floor(now / 1000) % 5);

  return (
    <PinnedSection id="sync" viewports={PIN_VIEWPORTS} onProgress={onProgress} aria-labelledby="sync-heading" className="pin-overlap" stageClassName="overflow-hidden">
      <div className="sync-pad h-full px-5 pb-5 pt-[calc(4rem+28px)] min-[760px]:px-8 min-[760px]:pb-10 min-[760px]:pt-[calc(4rem+52px)]">
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
            <p className="sr-only">
              Plaid bank feeds and HubSpot arrive by webhook and QuickBooks syncs daily. BILL, Ramp, and Gmail and
              Google Drive connect as sources too. Zensus normalizes the transactions into clean vendor names, keeps
              your zero-cash date current and sends Slack alerts.
            </p>
            <div
              ref={diagramRef}
              aria-hidden
              className="relative w-full max-w-[380px] min-[760px]:max-w-[880px]"
              style={{ aspectRatio: `${W} / ${H}`, maxHeight: "100%" }}
            >
              <svg aria-hidden viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" className="absolute inset-0 overflow-visible">
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
                    {/* The glow is a wide, faint stroke rather than an SVG blur filter, which repainted on the CPU every frame. */}
                    <path d={s.d} fill="none" stroke="#22C573" strokeOpacity={s.gop} strokeWidth={3.5} strokeLinecap="round" strokeDasharray={s.da} strokeDashoffset={s.off} />
                    <path d={s.d} fill="none" stroke="#5BE59A" strokeOpacity={s.op} strokeWidth={1.5} strokeLinecap="round" strokeDasharray={s.da} strokeDashoffset={s.off} />
                    <path d={s.d} fill="none" stroke="#FFFDF7" strokeOpacity={s.op} strokeWidth={0.8} strokeLinecap="round" strokeDasharray={s.da2} strokeDashoffset={s.off2} />
                  </g>
                ))}
              </svg>

              <div aria-hidden>
                {labels.map((l) => (
                  <span
                    key={l.t + l.y}
                    className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-border bg-background px-[7px] py-0.5 font-mono text-[10px] text-sage-dark"
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
                    style={{
                      ...box(G.src[i]),
                      opacity: 0.25 + 0.75 * kc[i],
                      // BILL's terms bar animating its logo, so that box fades in without the scale.
                      transform: s.name === "BILL" && SHOW_BILL_LOGO ? undefined : `scale(${lerp(0.92, 1, kc[i])})`,
                    }}
                  >
                    {s.name === "Plaid" ? (
                      <span className="inline-flex h-5 items-center rounded-full bg-forest px-2 min-[760px]:h-7 min-[760px]:px-3">
                        <img src={plaidLogo} alt="" className="block h-[11px] w-auto min-[760px]:h-4" />
                      </span>
                    ) : s.name === "QuickBooks" ? (
                      <img src={quickbooksLogo} alt="" className="block h-4 w-auto min-[760px]:h-6" />
                    ) : s.name === "BILL" && SHOW_BILL_LOGO ? (
                      // Square and unaltered, alone in its box: no words or
                      // marks beside it (BILL's terms).
                      <img src={billIcon} alt="" width={36} height={36} loading="lazy" decoding="async" className="block h-7 w-7 min-[760px]:h-8 min-[760px]:w-8 min-[1280px]:h-9 min-[1280px]:w-9" />
                    ) : s.name === "Ramp" && SHOW_RAMP_LOGO ? (
                      <img src={rampIcon} alt="" width={36} height={36} loading="lazy" decoding="async" className="block h-7 w-7 min-[760px]:h-8 min-[760px]:w-8 min-[1280px]:h-9 min-[1280px]:w-9" />
                    ) : s.name === "Gmail & Google Drive" ? (
                      // Google's own Workspace product icons (SVG from its help
                      // center), unaltered, with the product names beside them.
                      <span className="flex flex-col items-center gap-0.5">
                        <span className="flex items-center gap-1.5">
                          <img src={gmailIcon} alt="" width={20} height={20} className="block h-4 w-4 min-[760px]:h-5 min-[760px]:w-5" />
                          <img src={googleDriveIcon} alt="" width={20} height={20} className="block h-4 w-4 min-[760px]:h-5 min-[760px]:w-5" />
                        </span>
                        <span className="text-[10px] font-semibold leading-none max-[359px]:text-[9px] min-[760px]:text-[11.5px]">Gmail &amp; Google Drive&trade;</span>
                      </span>
                    ) : (
                      <span className="font-semibold">{s.name}</span>
                    )}
                    <span
                      className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground"
                      style={{ transform: `scale(${ease((P - 0.1 - i * 0.022) / 0.04)})` }}
                    >
                      ✓
                    </span>
                  </div>
                ))}

                <div
                  className="absolute flex items-center justify-center gap-[5px] whitespace-nowrap rounded-[9px] border border-border bg-card text-[11.5px] text-foreground min-[760px]:gap-[7px] min-[760px]:text-[13px]"
                  style={{ ...box(G.outs[1]), opacity: 0.25 + 0.75 * kO[1], transform: `scale(${lerp(0.92, 1, kO[1])})` }}
                >
                  <span className="font-semibold">Slack alert</span>
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
                    {zOn ? DATES[still ? 0 : Math.floor(now / 2600) % DATES.length] : "Calculating…"}
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
                    <span className="text-muted-foreground">{P > 0.78 ? "Normalized" : "Incoming"}</span>
                    <span className="flex items-center gap-[5px] whitespace-nowrap text-sage-dark">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" style={{ opacity: still ? 1 : 0.5 + 0.5 * Math.sin(now / 250) }} />
                      Synced {still ? 1 : secs}s ago
                    </span>
                  </div>
                  <div className="mt-1 flex flex-col">
                    {ROWS.map((r, j) => {
                      const kr = ease((P - 0.3 - j * 0.04) / 0.06);
                      const kn = ease((P - 0.78 - j * 0.05) / 0.07);
                      return (
                        <div
                          key={r.raw}
                          className="grid h-[26px] grid-cols-[minmax(0,1fr)_auto] items-center gap-2.5 border-t border-[#F1E6CB] min-[760px]:h-6"
                          style={{ opacity: kr, transform: `translateX(${((1 - kr) * -10).toFixed(1)}px)` }}
                        >
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

        </div>
      </div>
    </PinnedSection>
  );
};

export default Bento;
