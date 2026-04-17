import { useEffect, useRef, useState } from "react";
import { ScenarioPrompt } from "./ScenarioPrompt";
import { TalkToUsButton } from "./TalkToUsButton";

const H1_SENTENCE_1 = "Know exactly when your cash runs out.";
const H1_SENTENCE_2_PLAIN = "And exactly what to do ";
const H1_SENTENCE_2_ACCENT = "about it.";
const LOCAL_STORAGE_KEY = "zensus-hero-seen-v1";
const TYPE_SPEED_MS = 40;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Hero = () => {
  const [typedLength, setTypedLength] = useState(0);
  const [fadeInSentence2, setFadeInSentence2] = useState(false);
  const [promptVisible, setPromptVisible] = useState(false);
  const [animateOnMount] = useState(() => {
    if (typeof window === "undefined") return false;
    if (prefersReducedMotion()) return false;
    return !localStorage.getItem(LOCAL_STORAGE_KEY);
  });
  const timeoutRefs = useRef<number[]>([]);

  useEffect(() => {
    if (!animateOnMount) {
      setTypedLength(H1_SENTENCE_1.length);
      setFadeInSentence2(true);
      setPromptVisible(true);
      return;
    }

    let i = 0;
    const type = () => {
      if (i <= H1_SENTENCE_1.length) {
        setTypedLength(i);
        i++;
        timeoutRefs.current.push(window.setTimeout(type, TYPE_SPEED_MS));
      } else {
        timeoutRefs.current.push(
          window.setTimeout(() => setFadeInSentence2(true), 50),
        );
        timeoutRefs.current.push(
          window.setTimeout(() => {
            setPromptVisible(true);
            localStorage.setItem(LOCAL_STORAGE_KEY, "1");
          }, 550),
        );
      }
    };
    type();

    return () => {
      timeoutRefs.current.forEach((t) => window.clearTimeout(t));
      timeoutRefs.current = [];
    };
  }, [animateOnMount]);

  const typedText = H1_SENTENCE_1.slice(0, typedLength);
  const showCaret = animateOnMount && typedLength < H1_SENTENCE_1.length;

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-16">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />

      <div className="section-container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span>{typedText}</span>
            {showCaret && (
              <span
                aria-hidden="true"
                className="inline-block w-[2px] h-[0.9em] bg-primary ml-1 align-text-bottom animate-pulse"
              />
            )}
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

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Connect your bank, QuickBooks, and HubSpot. Runway that matches the
            calendar, not a rough monthly average.
          </p>

          <div className="flex flex-col items-center gap-8">
            <TalkToUsButton size="lg" />
            <ScenarioPrompt visible={promptVisible} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
