import type { CSSProperties } from "react";
import { HeroSignup } from "./HeroSignup";
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
// two-line headline, subhead and the email signup, inside a
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
          64px navbar, down to the proof strip. The waves above the proof
          strip are drawn in this padding rather than as their own layer,
          because a separate layer repainted them at a different crop and
          left a visible seam (seen at 1920px). From 820px the copy is set
          about 15% smaller than the handoff (21 Oct 2026) inside a frame of
          the former height. The block is centred in the visible band, from
          the navbar's bottom edge to the proof strip: the top padding is the
          64px navbar plus the bottom padding (13.5rem = 64px + 9.5rem from
          820px; 8.75rem = 64px + 4.75rem below it). */}
      <div className="relative border-x border-transparent px-1 pb-[4.75rem] pt-[8.75rem] text-center min-[820px]:border-border min-[820px]:px-10 min-[820px]:pb-[9.5rem] min-[820px]:pt-[13.5rem]">
        <CornerMark className="-left-[6px] top-[4.5rem] hidden min-[820px]:block" />
        <CornerMark className="-right-[6px] top-[4.5rem] hidden min-[820px]:block" />

        <p className="text-sm font-medium text-muted-foreground min-[1201px]:text-[15px]">{KICKER}</p>

        <h1 className="mx-auto mt-4 text-[40px] font-bold leading-[1.05] tracking-[-0.02em] text-foreground min-[820px]:mt-3.5 min-[820px]:text-[46px] min-[1201px]:text-[53px]">
          <span className="block">{H1_LINE_1}</span>
          {/* Both lines are block spans, so this space draws nothing. It is
              there for anything that reads the H1 as text: without it the
              headline came out as "Your cash flow,mapped as far ahead". */}{" "}
          <span className="block text-balance">{H1_LINE_2}</span>
        </h1>

        <p className="mx-auto mt-6 max-w-[672px] text-pretty text-[17px] leading-[1.55] text-muted-foreground min-[820px]:mt-5 min-[820px]:max-w-[576px] min-[820px]:text-base">
          Zensus is cash flow forecasting software that connects your bank, QuickBooks, and HubSpot to project the
          month your cash runs out.
        </p>

        <HeroSignup />
      </div>
    </div>
  </section>
);

export default Hero;
