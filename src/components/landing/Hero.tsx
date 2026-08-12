import { ScenarioPrompt } from "./ScenarioPrompt";
import { TryItNowButton } from "./TryItNowButton";
import { TalkToUsButton } from "./TalkToUsButton";
import HeroTestimonial from "./HeroTestimonial";
import { TextHoverHalo } from "@/components/ui/text-hover-halo";

const H1_LINE_1 = "Your cash flow,";
const H1_LINE_2 = "mapped 13 weeks ahead.";
const H1_SENTENCE_2 = "Built for businesses with unpredictable revenue.";

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative flex items-center pt-24 pb-4 md:pt-24 md:pb-6 lg:pt-32 lg:pb-8 overflow-hidden bg-background"
    >
      {/* Cream brand canvas (tokens come from :root.theme-cream, toggled
          per route by ThemeScope in App.tsx). A faint sage bloom keeps the
          hero from feeling flat without reintroducing a hero image. */}
      <div
        className="absolute inset-0 pointer-events-none [background:radial-gradient(60rem_24rem_at_50%_-4rem,hsl(var(--primary)/0.12),transparent_70%)]"
        aria-hidden
      />

      <div className="section-container relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 xl:px-16">
        {/* Top 2-Column Desktop Grid (Taglines & Description on Left, Video Testimonial on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-24 items-center">
          {/* Left Column: Tagline & Description */}
          <div className="lg:col-span-7 xl:col-span-7 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.08] mb-5 motion-safe:animate-fade-in text-foreground">
              <span className="block lg:whitespace-nowrap">
                <TextHoverHalo as="span">
                  {H1_LINE_1}
                </TextHoverHalo>
              </span>
              <span className="block lg:whitespace-nowrap">
                <TextHoverHalo as="span">
                  {H1_LINE_2}
                </TextHoverHalo>
              </span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl font-medium tracking-tight text-foreground/90 mb-6 leading-snug">
              {H1_SENTENCE_2}
            </p>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Zensus is 13-week cash flow forecasting software for businesses with
              unpredictable revenue. It connects your bank, QuickBooks, and HubSpot
              for a forecast that knows your annual contract hits March 14, not
              "sometime in Q1."
            </p>
          </div>

          {/* Right Column: Customer Testimonial Video */}
          <div className="lg:col-span-5 xl:col-span-5 w-full">
            <HeroTestimonial className="mt-0 w-full max-w-none" />
          </div>
        </div>

        {/* Centered CTAs & Terminal Input Field below the grid */}
        <div className="mt-10 sm:mt-12 flex flex-col items-center justify-center text-center gap-4 max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <TryItNowButton size="lg" />
            <TalkToUsButton
              size="lg"
              variant="ghost"
              className="border border-border bg-card text-foreground hover:border-primary/60"
            />
          </div>
          <ScenarioPrompt />
        </div>
      </div>
    </section>
  );
};

export default Hero;
