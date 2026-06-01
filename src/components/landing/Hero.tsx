import { useEffect, useState } from "react";
import { ScenarioPrompt } from "./ScenarioPrompt";
import { TryItNowButton } from "./TryItNowButton";
import { TextShimmer } from "@/components/ui/text-shimmer";

// Track window.scrollY with rAF-throttled updates. Used to drive a subtle
// parallax on the hero background.
function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    if (typeof window === "undefined") return;
    let raf = 0;
    const update = () => {
      setY(window.scrollY);
      raf = 0;
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return y;
}

const H1_SENTENCE_1 = "Know exactly when your cash runs out.";
const H1_SENTENCE_2 = "And exactly what to do about it.";

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
  const scrollY = useScrollY();
  const parallaxY = Math.min(scrollY * 0.15, 180);

  return (
    <section
      id="hero"
      className="relative flex items-center pt-24 pb-4 md:pt-32 md:pb-6 lg:pt-40 lg:pb-8 overflow-hidden"
    >
      {/* Aurora backdrop with a gentle parallax. This full-bleed image is the
          page's LCP element, so it ships AVIF first (smallest), then WebP, then
          a JPG fallback, and stays eager + high priority. */}
      <div
        className="absolute inset-x-0 -top-[20%] -bottom-[20%] pointer-events-none will-change-transform"
        style={{ transform: `translate3d(0, ${parallaxY}px, 0)` }}
        aria-hidden
      >
        <picture>
          <source srcSet="/hero-aurora-800.avif" media="(max-width: 768px)" type="image/avif" />
          <source srcSet="/hero-aurora-1200.avif" media="(max-width: 1280px)" type="image/avif" />
          <source srcSet="/hero-aurora-1920.avif" type="image/avif" />
          <source srcSet="/hero-aurora-800.webp" media="(max-width: 768px)" type="image/webp" />
          <source srcSet="/hero-aurora-1200.webp" media="(max-width: 1280px)" type="image/webp" />
          <source srcSet="/hero-aurora-1920.webp" type="image/webp" />
          <img
            src="/hero-aurora-1920.jpg"
            alt=""
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover [filter:brightness(0.85)_contrast(1.05)_saturate(1.1)]"
          />
        </picture>
      </div>

      {/* Contrast overlay so the headline stays legible over the aurora. */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background pointer-events-none"
        aria-hidden
      />

      <div className="section-container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5 motion-safe:animate-fade-in">
            <span className="block">
              {shimmer ? (
                <TextShimmer as="span" duration={5} spread={2.5} ease={[0.65, 0, 0.35, 1]}>
                  {H1_SENTENCE_1}
                </TextShimmer>
              ) : (
                <span>{H1_SENTENCE_1}</span>
              )}
            </span>
            <span className="block">
              {shimmer ? (
                <TextShimmer as="span" duration={5} spread={2.5} ease={[0.65, 0, 0.35, 1]}>
                  {H1_SENTENCE_2}
                </TextShimmer>
              ) : (
                <span>{H1_SENTENCE_2}</span>
              )}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-20 md:mb-28 lg:mb-36">
            Connect your bank, QuickBooks, and HubSpot. Runway that knows your
            annual contract hits March 14, not "sometime in Q1."
          </p>

          <div className="flex flex-col items-center gap-4">
            <TryItNowButton />
            <ScenarioPrompt />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
