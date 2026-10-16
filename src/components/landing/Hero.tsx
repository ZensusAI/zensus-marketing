import { TryItNowButton } from "./TryItNowButton";
import { TalkToUsButton } from "./TalkToUsButton";
import { CornerMark, LedgerGrid, PlottedCells } from "./Backdrop";
import { TextHoverHalo } from "@/components/ui/text-hover-halo";

const H1_LINE_1 = "Your cash flow,";
const H1_LINE_2 = "mapped as far ahead as you need.";
const H1_SENTENCE_2 =
  "Cash flow forecasting for businesses with unpredictable revenue.";

/** Ruled-cell size for the hero's ledger grid, in px. */
const CELL = 56;

// Filled cells in the margins, outside the ruled column (the column is
// 1152px wide, so columns 11 and beyond sit past its rules at any width
// where the fills are shown). Dotted cells are the figures nobody pastes
// by hand any more; the sage cell is the one number that matters.
const PLOTTED = [
  { col: -13, row: 2 },
  { col: -12, row: 5, tone: "sage" as const },
  { col: -11, row: 7 },
  { col: 11, row: 3 },
  { col: 12, row: 6 },
  { col: 14, row: 4, tone: "sage" as const },
];

// Centred hero in the shape the category uses (Drivetrain, Float, Jirav,
// HiBob Mosaic and Vareto all do this; surveyed 16 Oct 2026): one short
// audience line, the headline, one subhead, the buttons directly under it,
// then a proof strip (TrustBar) and the product itself (HeroShowcase) right
// below. The copy sits in a ruled column on ledger paper (see Backdrop.tsx):
// a centred grid that clears behind the words and shows toward the margins,
// column rules with registration marks at the corners, a few plotted cells
// outside the rules, and a soft sage bloom behind the headline. Type is
// fluid (text-hero and friends in tailwind.config.ts) so each viewport gets
// a size that fits rather than the nearest breakpoint's.
const Hero = () => (
  <section id="hero" className="relative overflow-hidden bg-background">
    <LedgerGrid cell={CELL} />
    <PlottedCells cell={CELL} cells={PLOTTED} className="hidden lg:block" />
    <div
      className="absolute inset-0 pointer-events-none [background:radial-gradient(52rem_22rem_at_50%_38%,hsl(var(--primary)/0.14),transparent_70%)]"
      aria-hidden
    />

    <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
      {/* The ruled column. It runs from the top of the page (behind the
          fixed navbar) to the trust strip, whose top rule crosses it. */}
      <div className="relative px-2 pt-[6.75rem] pb-10 text-center sm:px-8 md:border-x md:border-border md:pt-[7rem] md:pb-11 lg:px-10 lg:pt-[7.5rem] lg:pb-12">
        <CornerMark className="-left-[6px] top-[4rem] hidden md:block" />
        <CornerMark className="-right-[6px] top-[4rem] hidden md:block" />
        <CornerMark className="-left-[6px] -bottom-[6px] hidden md:block" />
        <CornerMark className="-right-[6px] -bottom-[6px] hidden md:block" />

        <p className="text-hero-kicker font-medium text-muted-foreground">
          {H1_SENTENCE_2}
        </p>

        <h1 className="mx-auto mt-4 text-hero text-foreground motion-safe:animate-fade-in">
          <span className="block">
            <TextHoverHalo as="span" text={H1_LINE_1} />
          </span>
          {/* Both lines are block spans, so this space draws nothing. It is
              there for anything that reads the H1 as text: without it the
              headline came out as "Your cash flow,mapped as far ahead". */}
          {" "}
          <span className="block text-balance">
            <TextHoverHalo as="span" text={H1_LINE_2} />
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-hero-sub text-muted-foreground md:mt-6">
          Zensus is cash flow forecasting software that connects your bank,
          QuickBooks, and HubSpot to project the exact date your cash runs out.
        </p>

        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row md:mt-8">
          <TryItNowButton size="lg" trackHeroConversion />
          <TalkToUsButton
            size="lg"
            variant="ghost"
            className="border border-border bg-card text-foreground hover:border-primary/60"
          />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          14-day free trial, cancel anytime. No charge until it ends.
        </p>
      </div>
    </div>
  </section>
);

export default Hero;
