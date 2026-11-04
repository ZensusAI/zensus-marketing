import type { CSSProperties } from "react";
import { HERO_MESH } from "./hero-mesh";
import { HeroSignup } from "./HeroSignup";
import { HeroCashFlowCard } from "./HeroCashFlowCard";
import { TALK_TO_US_URL } from "@/lib/constants";

const H1 = "See every week of cash before it happens.";
const SUBHEAD =
  "Zensus is cash flow forecasting software that connects your bank, QuickBooks, and HubSpot to project the month your cash runs out.";

// Mesh waves (handoff 18-hero-v2): cover over cream at 0.9 for the first
// screen (640px below 760px, 800px above), masked lighter behind the copy.
const WAVES_MASK = "radial-gradient(ellipse 58% 52% at 50% 34%, rgba(0,0,0,.18), black 90%)";
const wavesStyle = {
  "--mesh-narrow": `url(${HERO_MESH.narrow})`,
  "--mesh-wide": `url(${HERO_MESH.wide})`,
  WebkitMaskImage: WAVES_MASK,
  maskImage: WAVES_MASK,
} as CSSProperties;

const focusRing =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

// Hero v2 from handoff 18-hero-v2 (40a), replacing 5a (02-hero). A centred
// stack under the fixed 64px navbar: headline, subhead, the email signup
// (HeroSignup, kept in place of the handoff's Start and Talk to us), the two
// trial lines, and the coded Cash flow card (HeroCashFlowCard). The audience
// kicker is gone by the handoff. Responsive switches are the handoff's: 760px
// (phone) and 1024px (mid). The proof strip follows in Index.tsx, below the
// first screen.
const Hero = () => (
  <section id="hero" className="relative overflow-hidden bg-background">
    {/* Only the inner layer drifts, 6% oversized so its edges never show;
        transform only, off under reduced motion. */}
    <div
      aria-hidden
      style={wavesStyle}
      className="pointer-events-none absolute inset-x-0 top-0 h-[640px] overflow-hidden opacity-90 min-[760px]:h-[800px]"
    >
      <div className="absolute -inset-x-[3%] -inset-y-[3%] bg-cover bg-center bg-no-repeat [background-image:var(--mesh-narrow)] motion-safe:animate-mesh-drift min-[820px]:[background-image:var(--mesh-wide)]" />
    </div>

    <div className="relative mx-auto flex max-w-[1280px] flex-col items-center px-5 pb-8 pt-[104px] text-center min-[760px]:px-16 min-[760px]:pb-10 min-[760px]:pt-[124px]">
      <h1 className="m-0 max-w-[900px] text-balance text-[40px] font-bold leading-[1.02] tracking-[-0.035em] text-foreground min-[760px]:text-[54px] min-[1024px]:text-[64px]">
        {H1}
      </h1>

      <p className="mt-4 max-w-[640px] text-pretty text-[17px] leading-[1.55] text-muted-foreground min-[760px]:mt-5 min-[760px]:text-[19px]">
        {SUBHEAD}
      </p>

      {/* The email signup in place of the handoff's Start and Talk to us
          buttons (restored 4 Nov 2026): it saves the address as an Apollo
          lead, then opens the app login with it. */}
      <HeroSignup />

      <p className="mt-3 text-pretty text-sm leading-[1.5] text-muted-foreground">
        14-day free trial, cancel anytime. No charge until it ends.
      </p>
      <p className="mt-1 text-pretty text-sm leading-[1.5] text-muted-foreground">
        90-day free trial or more available.{" "}
        <a
          href={TALK_TO_US_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`font-medium text-primary underline underline-offset-[3px] ${focusRing}`}
        >
          Talk to us
        </a>{" "}
        to arrange it.
      </p>

      <HeroCashFlowCard />
    </div>
  </section>
);

export default Hero;
