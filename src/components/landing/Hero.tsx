import { useEffect, useRef, useState } from "react";
import { ScenarioPrompt } from "./ScenarioPrompt";
import { TryItNowButton } from "./TryItNowButton";

// Track window.scrollY with rAF-throttled updates. Used to drive a subtle
// parallax on the hero background — the aurora lags behind foreground scroll
// for a sense of depth without turning into a distracting effect.
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
const H1_SENTENCE_2_PLAIN = "And exactly what to do ";
const H1_SENTENCE_2_ACCENT = "about it.";

const CHAR_STAGGER_MS = 32;
const CHAR_ANIMATION_MS = 420;
const CHAR_EASING = "cubic-bezier(0.2, 0.8, 0.2, 1)";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

interface RevealedLineProps {
  text: string;
  startDelayMs?: number;
  animate: boolean;
  globalCharIndexOffset?: number;
}

const RevealedLine = ({
  text,
  startDelayMs = 0,
  animate,
  globalCharIndexOffset = 0,
}: RevealedLineProps) => {
  const words = text.split(" ");
  let charCursor = globalCharIndexOffset;

  return (
    <>
      {words.map((word, wi) => {
        const wordChars = word.split("");
        return (
          <span key={wi} className="inline-block whitespace-nowrap">
            {wordChars.map((ch, ci) => {
              const delay = startDelayMs + charCursor * CHAR_STAGGER_MS;
              charCursor += 1;
              return (
                <span
                  key={ci}
                  className="inline-block"
                  style={
                    animate
                      ? {
                          opacity: 0,
                          animation: `char-reveal ${CHAR_ANIMATION_MS}ms ${CHAR_EASING} ${delay}ms forwards`,
                        }
                      : undefined
                  }
                >
                  {ch}
                </span>
              );
            })}
            {wi < words.length - 1 && "\u00A0"}
          </span>
        );
      })}
    </>
  );
};

const Hero = () => {
  const [fadeInSentence2, setFadeInSentence2] = useState(false);
  const [promptVisible, setPromptVisible] = useState(false);
  const [animate] = useState(() => {
    if (typeof window === "undefined") return false;
    return !prefersReducedMotion();
  });
  const timeoutRefs = useRef<number[]>([]);
  const scrollY = useScrollY();
  // Clamp the parallax travel so the bg never escapes its negative-inset
  // buffer (the image container has -20% top/bottom to hide the movement).
  const parallaxY = Math.min(scrollY * 0.15, 180);

  useEffect(() => {
    if (!animate) {
      setFadeInSentence2(true);
      setPromptVisible(true);
      return;
    }

    const sentence1CompleteMs =
      H1_SENTENCE_1.replace(/\s/g, "").length * CHAR_STAGGER_MS +
      CHAR_ANIMATION_MS;

    timeoutRefs.current.push(
      window.setTimeout(() => setFadeInSentence2(true), sentence1CompleteMs + 80),
    );
    timeoutRefs.current.push(
      window.setTimeout(() => setPromptVisible(true), sentence1CompleteMs + 620),
    );

    return () => {
      timeoutRefs.current.forEach((t) => window.clearTimeout(t));
      timeoutRefs.current = [];
    };
  }, [animate]);

  return (
    <section
      id="hero"
      className="relative flex items-center pt-24 pb-24 md:pt-32 md:pb-32 lg:pt-40 lg:pb-40 overflow-hidden"
    >
      {/* Aurora backdrop with a gentle parallax. The container has -20% top
          and bottom so the transform never reveals the section edges. */}
      <div
        className="absolute inset-x-0 -top-[20%] -bottom-[20%] pointer-events-none will-change-transform"
        style={{ transform: `translate3d(0, ${parallaxY}px, 0)` }}
        aria-hidden
      >
        <picture>
          <source
            srcSet="/hero-aurora-800.webp"
            media="(max-width: 768px)"
            type="image/webp"
          />
          <source
            srcSet="/hero-aurora-1200.webp"
            media="(max-width: 1280px)"
            type="image/webp"
          />
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

      {/* Contrast overlay so the headline stays legible over the aurora.
          Heavier through the middle where the text sits. */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background pointer-events-none"
        aria-hidden
      />

      <div className="section-container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5">
            <span className="block">
              <RevealedLine text={H1_SENTENCE_1} animate={animate} />
            </span>
            <span
              className={`block transition-all duration-500 ${
                fadeInSentence2
                  ? "opacity-100 blur-0"
                  : "opacity-0 blur-md"
              }`}
              aria-hidden={!fadeInSentence2}
            >
              {H1_SENTENCE_2_PLAIN}
              <span className="text-gradient">{H1_SENTENCE_2_ACCENT}</span>
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Connect your bank, QuickBooks, and HubSpot. Runway that knows your
            annual contract hits March 14, not "sometime in Q1."
          </p>

          <div className="flex flex-col items-center gap-4">
            <TryItNowButton />
            <ScenarioPrompt visible={promptVisible} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
