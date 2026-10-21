import type { CSSProperties } from "react";
import { TryItNowButton } from "./TryItNowButton";
import { TalkToUsButton } from "./TalkToUsButton";
import { CornerMark } from "./Backdrop";
import { HERO_MESH } from "./hero-mesh";

const H1_LINE_1 = "Your cash flow,";
const H1_LINE_2 = "mapped as far ahead as you need.";
const KICKER = "Cash flow forecasting for businesses with unpredictable revenue.";

// Mesh-wave overlay (handoff 02-hero, locked 5a): cover over cream at 0.95,
// masked so it fades toward the copy. See hero-mesh.ts for the file sizes.
const WAVES_MASK =
  "radial-gradient(ellipse 58% 52% at 50% 44%, rgba(0,0,0,.22) 0%, rgba(0,0,0,.3) 40%, black 90%)";
const wavesStyle = {
  "--mesh-narrow": `url(${HERO_MESH.narrow})`,
  "--mesh-wide": `url(${HERO_MESH.wide})`,
  WebkitMaskImage: WAVES_MASK,
  maskImage: WAVES_MASK,
} as CSSProperties;

// Centred hero from handoff 02-hero (variant a, waves texture): audience line,
// two-line headline, subhead, the two buttons and the trial terms, inside a
// ruled column with registration marks at its top corners. No ledger grid,
// no plotted cells and no console card, per the handoff. The responsive
// switch is the handoff's own: 820px.
const Hero = () => (
  <section id="hero" className="relative overflow-hidden bg-background">
    {/* The mask and opacity sit on the outer layer so the fade toward the
        copy stays put; only the inner layer drifts, 6% oversized so its
        edges never show. Transform only, so it runs on the compositor; off
        under reduced motion. */}
    <div aria-hidden style={wavesStyle} className="pointer-events-none absolute inset-0 overflow-hidden opacity-95">
      <div className="absolute -inset-x-[3%] -inset-y-[3%] bg-cover bg-center bg-no-repeat [background-image:var(--mesh-narrow)] motion-safe:animate-mesh-drift min-[820px]:[background-image:var(--mesh-wide)]" />
    </div>
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 [background:radial-gradient(52rem_22rem_at_50%_38%,rgba(34,197,115,.14),transparent_70%)]"
    />

    <div className="relative mx-auto max-w-6xl px-4 min-[820px]:px-6">
      {/* The ruled column runs from the top of the page, behind the fixed
          64px navbar, down to the proof strip. The bottom padding is the
          handoff's 56px plus the proof strip's 56px wave band: the band is
          drawn here rather than as its own layer, because a separate layer
          repainted the waves at a different crop and left a visible seam
          (seen at 1920px). */}
      <div className="relative border-x border-transparent px-1 pb-28 pt-[6.5rem] text-center min-[820px]:border-border min-[820px]:px-10 min-[820px]:pt-32">
        <CornerMark className="-left-[6px] top-[4.5rem] hidden min-[820px]:block" />
        <CornerMark className="-right-[6px] top-[4.5rem] hidden min-[820px]:block" />

        <p className="text-sm font-medium text-muted-foreground min-[820px]:text-base">{KICKER}</p>

        <h1 className="mx-auto mt-4 text-[40px] font-bold leading-[1.05] tracking-[-0.02em] text-foreground min-[820px]:text-[54px] min-[1201px]:text-[62px]">
          <span className="block">{H1_LINE_1}</span>
          {/* Both lines are block spans, so this space draws nothing. It is
              there for anything that reads the H1 as text: without it the
              headline came out as "Your cash flow,mapped as far ahead". */}{" "}
          <span className="block text-balance">{H1_LINE_2}</span>
        </h1>

        <p className="mx-auto mt-6 max-w-[672px] text-pretty text-[17px] leading-[1.55] text-muted-foreground min-[820px]:text-[19px]">
          Zensus is cash flow forecasting software that connects your bank, QuickBooks, and HubSpot to project the
          exact date your cash runs out.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <TryItNowButton variant="solid" trackHeroConversion />
          <TalkToUsButton variant="outline" />
        </div>
        <p className="mt-3 text-balance text-sm text-muted-foreground">14-day free trial, cancel anytime. No charge until it ends.</p>
      </div>
    </div>
  </section>
);

export default Hero;
