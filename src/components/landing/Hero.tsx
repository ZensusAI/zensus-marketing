import { TryItNowButton } from "./TryItNowButton";
import { TalkToUsButton } from "./TalkToUsButton";
import { TextHoverHalo } from "@/components/ui/text-hover-halo";

const H1_LINE_1 = "Your cash flow,";
const H1_LINE_2 = "mapped as far ahead as you need.";
const H1_SENTENCE_2 =
  "Cash flow forecasting for businesses with unpredictable revenue.";

// Centred hero in the shape the category uses (Drivetrain, Float, Jirav,
// HiBob Mosaic and Vareto all do this; surveyed 16 Oct 2026): one short
// audience line, the headline, one subhead, the buttons directly under it,
// then a proof strip (TrustBar) and the product itself (HeroShowcase) right
// below. The customer video that used to sit beside the headline has its own
// section after the product. No site in the survey leads with a talking head,
// and beside the headline it pushed the buttons a full screen down on a phone.
const Hero = () => (
  <section
    id="hero"
    className="relative overflow-hidden bg-background pt-28 pb-10 md:pt-32 md:pb-10 lg:pb-12"
  >
    {/* Cream brand canvas (tokens come from :root.theme-cream, toggled per
        route by ThemeScope in App.tsx). A faint sage bloom keeps the hero
        from feeling flat without reintroducing a hero image. */}
    <div
      className="absolute inset-0 pointer-events-none [background:radial-gradient(60rem_24rem_at_50%_-4rem,hsl(var(--primary)/0.12),transparent_70%)]"
      aria-hidden
    />

    <div className="section-container relative z-10 mx-auto max-w-5xl text-center">
      <p className="text-sm font-medium text-muted-foreground sm:text-base">
        {H1_SENTENCE_2}
      </p>

      <h1 className="mx-auto mt-4 text-4xl font-bold tracking-tight leading-[1.05] text-foreground sm:text-5xl lg:text-6xl motion-safe:animate-fade-in">
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

      <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
        Zensus is cash flow forecasting software that connects your bank,
        QuickBooks, and HubSpot to project the exact date your cash runs out.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
  </section>
);

export default Hero;
