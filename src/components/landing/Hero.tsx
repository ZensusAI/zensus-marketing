import { useState } from "react";
import { ScenarioPrompt } from "./ScenarioPrompt";
import { TryItNowButton } from "./TryItNowButton";
import { TalkToUsButton } from "./TalkToUsButton";
import { TextShimmer } from "@/components/ui/text-shimmer";

const H1_SENTENCE_1 = "Cash flow forecasting for startups.";
const H1_SENTENCE_2 = "Know exactly when cash runs out.";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Hero = () => {
  // The shimmer is decorative; fall back to plain text under reduced motion.
  // The headline itself ALWAYS renders visible — it's the page's value
  // proposition and must never wait on JS hydration to appear (the entrance
  // is a pure-CSS `motion-safe:animate-fade-in`, so it runs at first paint,
  // not after the bundle hydrates).
  const [shimmer] = useState(() => {
    if (typeof window === "undefined") return false;
    return !prefersReducedMotion();
  });
  return (
    <section
      id="hero"
      className="relative flex items-center pt-24 pb-4 md:pt-32 md:pb-6 lg:pt-40 lg:pb-8 overflow-hidden bg-background"
    >
      {/* Cream brand canvas (tokens come from :root.theme-cream, toggled
          per route by ThemeScope in App.tsx). A faint sage bloom keeps the
          hero from feeling flat without reintroducing a hero image. */}
      <div
        className="absolute inset-0 pointer-events-none [background:radial-gradient(60rem_24rem_at_50%_-4rem,hsl(var(--primary)/0.12),transparent_70%)]"
        aria-hidden
      />

      <div className="section-container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5 motion-safe:animate-fade-in text-foreground">
            <span className="block">
              {shimmer ? (
                <TextShimmer
                  as="span"
                  duration={5}
                  spread={2.5}
                  ease={[0.65, 0, 0.35, 1]}
                  className="[--base-color:hsl(var(--foreground))]"
                >
                  {H1_SENTENCE_1}
                </TextShimmer>
              ) : (
                <span>{H1_SENTENCE_1}</span>
              )}
            </span>
            <span className="block">
              {shimmer ? (
                <TextShimmer
                  as="span"
                  duration={5}
                  spread={2.5}
                  ease={[0.65, 0, 0.35, 1]}
                  className="[--base-color:hsl(var(--foreground))]"
                >
                  {H1_SENTENCE_2}
                </TextShimmer>
              ) : (
                <span>{H1_SENTENCE_2}</span>
              )}
            </span>
          </h1>

          {/* Tight gap to the CTAs: the old mb-20/28/36 existed to let the
              aurora hero image breathe behind the text. On the flat cream
              canvas it read as dead space and pushed the CTAs below the
              natural eye path. */}
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 md:mb-12">
            Connect your bank, QuickBooks, and HubSpot. Cash flow that knows your
            annual contract hits March 14, not "sometime in Q1."
          </p>

          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <TryItNowButton />
              <TalkToUsButton
                variant="ghost"
                className="h-10 border border-border bg-card text-foreground hover:border-primary/60"
              />
            </div>
            <ScenarioPrompt />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
