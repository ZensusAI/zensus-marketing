import { useEffect, useRef, useState } from "react";
import { ScenarioPrompt } from "./ScenarioPrompt";
import { TalkToUsButton } from "./TalkToUsButton";

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
    <section id="hero" className="relative min-h-screen flex items-center pt-16">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />

      <div className="section-container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
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
