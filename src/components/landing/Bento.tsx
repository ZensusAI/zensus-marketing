import { useEffect, useRef, useState } from "react";
import zensusLogo from "@/assets/zensus-logo.png";
import plaidLogo from "@/assets/integrations/plaid.svg";
import quickbooksLogo from "@/assets/integrations/quickbooks.svg";
import hubspotLogo from "@/assets/integrations/hubspot.svg";
import slackLogo from "@/assets/integrations/slack.svg";

/**
 * "Everything stays in sync" pipeline diagram.
 *
 * A hub-and-spoke schematic on a fading dotted graph-paper underlay. The
 * Zensus wordmark sits at the center; when the diagram scrolls into view the
 * connections draw themselves outward from the wordmark to the sources on
 * the left and the outcomes on the right (stroke-dashoffset line drawing,
 * normalized with pathLength so one animation fits every curve). The four
 * facts from the old tile grid survive as a numbered editorial list below,
 * so crawlers and AI engines keep the full copy.
 *
 * The file keeps its historical Bento name so Index.tsx stays untouched.
 */

const FACTS = [
  {
    lead: "Connect in 60 seconds.",
    tail: "OAuth to Plaid, QuickBooks, and HubSpot. No spreadsheets, no CSV uploads.",
  },
  {
    lead: "Real-time webhook sync.",
    tail: "The moment a transaction clears, your forecast moves.",
  },
  {
    lead: "Zero-cash date.",
    tail: "The exact day you run out, recalculated live.",
  },
  {
    lead: "Vendor normalization.",
    tail: "Stripe payouts, ACH transfers, and card purchases all reconcile cleanly.",
  },
] as const;

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

/* Shared class strings for SVG nodes (Tailwind fill/stroke utilities). */
const chipBox = "fill-[hsl(var(--card))] stroke-[hsl(var(--border))]";
const chipText = "fill-foreground";
const beamClass = "stroke-[hsl(var(--sage-deep))] opacity-50";

/* Every beam starts AT the wordmark hub and runs outward, so a single
   dashoffset animation draws all of them away from the brand. */

/* Desktop (viewBox 0 0 720 230): hub edges at x=306 (left) and x=446 (right). */
const D_BEAMS = [
  { d: "M306 115 C 230 115, 230 50, 150 50", delay: 0 },
  { d: "M306 115 L 150 115", delay: 250 },
  { d: "M306 115 C 230 115, 230 180, 150 180", delay: 500 },
  { d: "M446 115 C 500 115, 500 75, 560 75", delay: 400 },
  { d: "M446 115 C 500 115, 500 155, 560 155", delay: 650 },
];

/* Mobile (viewBox 0 0 360 400): hub above center, sources up, outcomes down. */
const M_BEAMS = [
  { d: "M180 150 C 180 100, 62 105, 62 52", delay: 0 },
  { d: "M180 150 L 180 52", delay: 250 },
  { d: "M180 150 C 180 100, 298 105, 298 52", delay: 500 },
  { d: "M180 196 C 180 262, 90 254, 90 318", delay: 400 },
  { d: "M180 196 C 180 262, 270 254, 270 318", delay: 650 },
];

interface BeamProps {
  d: string;
  delay: number;
  drawn: boolean;
  /** Skip the transition entirely (reduced motion): render fully drawn. */
  instant: boolean;
}

function Beam({ d, delay, drawn, instant }: BeamProps) {
  return (
    <path
      d={d}
      pathLength={1}
      strokeWidth="1.5"
      fill="none"
      className={beamClass}
      style={
        instant
          ? undefined
          : {
              strokeDasharray: 1,
              strokeDashoffset: drawn ? 0 : 1,
              transition: `stroke-dashoffset 2000ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
            }
      }
    />
  );
}

interface DiagramProps {
  drawn: boolean;
  instant: boolean;
}

function DesktopDiagram({ drawn, instant }: DiagramProps) {
  return (
    <svg
      viewBox="0 0 720 230"
      role="img"
      aria-label="Diagram: Plaid, QuickBooks, and HubSpot stream into Zensus, which outputs your zero-cash date and Slack alerts"
      className="hidden w-full md:block"
    >
      {D_BEAMS.map((b) => (
        <Beam key={b.d} d={b.d} delay={b.delay} drawn={drawn} instant={instant} />
      ))}

      <g fontSize="13" className="font-sans">
        {/* Source chips: brand mark + name. The Plaid mark is a white SVG, so
            it carries logo-on-light (repainted ink by the cream theme). */}
        <rect x="30" y="33" width="120" height="34" rx="9" className={chipBox} />
        <image href={plaidLogo} x="63" y="42" width="16" height="16" className="logo-on-light" />
        <text x="85" y="55" className={chipText}>Plaid</text>
        <rect x="30" y="98" width="120" height="34" rx="9" className={chipBox} />
        <image href={quickbooksLogo} x="46" y="107" width="16" height="16" />
        <text x="68" y="120" className={chipText}>QuickBooks</text>
        <rect x="30" y="163" width="120" height="34" rx="9" className={chipBox} />
        <image href={hubspotLogo} x="56" y="172" width="16" height="16" />
        <text x="78" y="185" className={chipText}>HubSpot</text>

        {/* Hub: the brand lockup itself (same drawing as navbar and footer),
            no box. The connections grow outward from the wordmark. */}
        <defs>
          <clipPath id="hub-logo-d">
            <rect x="318" y="100" width="30" height="30" rx="7" />
          </clipPath>
        </defs>
        <image
          href={zensusLogo}
          x="318"
          y="100"
          width="30"
          height="30"
          clipPath="url(#hub-logo-d)"
        />
        <text x="356" y="122" fontSize="20" fontWeight="600" letterSpacing="-0.02em" className="fill-foreground">
          Zensus
        </text>

        <rect x="560" y="58" width="130" height="34" rx="9" className={chipBox} />
        <text x="625" y="80" textAnchor="middle" className={chipText}>Zero-cash date</text>
        <rect x="560" y="138" width="130" height="34" rx="9" className={chipBox} />
        <image href={slackLogo} x="580" y="147" width="16" height="16" />
        <text x="602" y="160" className={chipText}>Slack alert</text>
      </g>
    </svg>
  );
}

function MobileDiagram({ drawn, instant }: DiagramProps) {
  return (
    <svg
      viewBox="0 0 360 400"
      role="img"
      aria-label="Diagram: Plaid, QuickBooks, and HubSpot stream into Zensus, which outputs your zero-cash date and Slack alerts"
      className="w-full md:hidden"
    >
      {M_BEAMS.map((b) => (
        <Beam key={b.d} d={b.d} delay={b.delay} drawn={drawn} instant={instant} />
      ))}

      <g fontSize="12" className="font-sans">
        <rect x="14" y="20" width="96" height="32" rx="9" className={chipBox} />
        <image href={plaidLogo} x="37" y="29" width="14" height="14" className="logo-on-light" />
        <text x="56" y="41" className={chipText}>Plaid</text>
        <rect x="128" y="20" width="104" height="32" rx="9" className={chipBox} />
        <image href={quickbooksLogo} x="137" y="29" width="14" height="14" />
        <text x="156" y="41" className={chipText}>QuickBooks</text>
        <rect x="250" y="20" width="96" height="32" rx="9" className={chipBox} />
        <image href={hubspotLogo} x="262" y="29" width="14" height="14" />
        <text x="281" y="41" className={chipText}>HubSpot</text>

        {/* Hub: the brand lockup, no box. */}
        <defs>
          <clipPath id="hub-logo-m">
            <rect x="128" y="159" width="28" height="28" rx="7" />
          </clipPath>
        </defs>
        <image
          href={zensusLogo}
          x="128"
          y="159"
          width="28"
          height="28"
          clipPath="url(#hub-logo-m)"
        />
        <text x="164" y="180" fontSize="18" fontWeight="600" letterSpacing="-0.02em" className="fill-foreground">
          Zensus
        </text>

        <rect x="24" y="318" width="132" height="34" rx="9" className={chipBox} />
        <text x="90" y="340" textAnchor="middle" className={chipText}>Zero-cash date</text>
        <rect x="212" y="318" width="116" height="34" rx="9" className={chipBox} />
        <image href={slackLogo} x="229" y="328" width="14" height="14" />
        <text x="248" y="340" className={chipText}>Slack alert</text>
      </g>
    </svg>
  );
}

const Bento = () => {
  const reducedMotion = usePrefersReducedMotion();
  const diagramRef = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);

  // Draw the connections once, when the diagram scrolls into view.
  useEffect(() => {
    if (reducedMotion) {
      setDrawn(true);
      return;
    }
    const el = diagramRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reducedMotion]);

  return (
    <section className="section-padding bg-background">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Everything stays in sync.
          </h2>
          <p className="text-lg text-muted-foreground">
            Your sources stream through Zensus so the forecast never goes stale.
          </p>
        </div>

        {/* The schematic sits directly on the section: no card, no border.
            The dotted graph paper is an underlay that fades out radially so
            it blends into the cream canvas. */}
        <div ref={diagramRef} className="relative mx-auto max-w-4xl py-4 md:py-8">
          <div
            aria-hidden
            className={[
              "absolute inset-0 pointer-events-none",
              "[background-image:radial-gradient(circle,hsl(var(--border))_1px,transparent_1px)]",
              "[background-size:16px_16px]",
              "[mask-image:radial-gradient(ellipse_72%_78%_at_50%_50%,black_50%,transparent_98%)]",
            ].join(" ")}
          />
          <div className="relative">
            <DesktopDiagram drawn={drawn} instant={reducedMotion} />
            <MobileDiagram drawn={drawn} instant={reducedMotion} />
          </div>
        </div>

        {/* The four facts from the old tiles, kept as a numbered editorial
            list (unboxed, Poke-style) so the copy stays crawlable. */}
        <div className="mx-auto mt-10 grid max-w-4xl gap-x-10 gap-y-5 sm:grid-cols-2">
          {FACTS.map((fact, i) => (
            <div key={fact.lead} className="flex items-baseline gap-3">
              <span className="font-mono text-[11px] text-primary">({i + 1})</span>
              <p className="text-sm leading-relaxed">
                <span className="font-semibold text-foreground">{fact.lead}</span>{" "}
                <span className="text-muted-foreground">{fact.tail}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Bento;
