import { ScenarioPrompt } from "./ScenarioPrompt";
import { TryItNowButton } from "./TryItNowButton";
import { TalkToUsButton } from "./TalkToUsButton";
import HeroTestimonial from "./HeroTestimonial";
import { TextHoverHalo } from "@/components/ui/text-hover-halo";

const H1_LINE_1 = "Your cash flow,";
const H1_LINE_2 = "mapped as far ahead as you need.";
const H1_SENTENCE_2 =
  "Cash flow forecasting for businesses with unpredictable revenue.";

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative flex items-center pt-24 pb-10 md:pt-24 md:pb-12 lg:pt-32 lg:pb-16 overflow-hidden bg-background"
    >
      {/* Cream brand canvas (tokens come from :root.theme-cream, toggled
          per route by ThemeScope in App.tsx). A faint sage bloom keeps the
          hero from feeling flat without reintroducing a hero image. */}
      <div
        className="absolute inset-0 pointer-events-none [background:radial-gradient(60rem_24rem_at_50%_-4rem,hsl(var(--primary)/0.12),transparent_70%)]"
        aria-hidden
      />

      <div className="section-container relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 xl:px-16">
        {/* Two columns on desktop: the pitch and its buttons on the left,
            the customer video on the right. The buttons live in the copy
            column on purpose. They used to sit centred under both columns,
            which put them a full screen below the headline on a phone and
            sent the eye headline, video, button on a desktop. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-24 items-center">
          <div className="lg:col-span-7 xl:col-span-7 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.08] mb-5 motion-safe:animate-fade-in text-foreground">
              <span className="block lg:whitespace-nowrap">
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

            <p className="text-lg sm:text-xl lg:text-2xl font-medium tracking-tight text-foreground/90 mb-5 leading-snug">
              {H1_SENTENCE_2}
            </p>

            {/* One entity-defining sentence. The sentence that used to follow
                it ("a live, always-current picture...") restated the subhead
                and pushed the buttons down another three lines. */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Zensus is cash flow forecasting software that connects your bank,
              QuickBooks, and HubSpot to project the exact date your cash runs
              out.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
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

            <div className="mt-6 flex justify-center lg:justify-start">
              <ScenarioPrompt />
            </div>
          </div>

          <div className="lg:col-span-5 xl:col-span-5 w-full">
            <HeroTestimonial className="mt-0 w-full max-w-none" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
