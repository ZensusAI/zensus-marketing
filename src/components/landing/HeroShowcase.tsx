import { useCallback, useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import dashboard1 from "@/assets/dashboard-1.webp";
import dashboard13week from "@/assets/dashboard-13week.webp";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DotField } from "./Backdrop";

const FRAMES = [
  { src: dashboard1, alt: "Zensus cash flow dashboard with projection chart" },
  { src: dashboard13week, alt: "Zensus 13-week cash flow view and budget breakdown" },
] as const;

/** Time each frame stays fully visible before crossfading (6 seconds). */
const FRAME_MS = 6000;

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

// The product, directly under the hero and its proof strip: a wide browser
// frame straddling the cream canvas and a full-bleed forest band, the way the
// category's product bands sit (Drivetrain, Abacum, Float). This section used
// to come after the pain section, so the first screenshot of the product was
// 1,850px down the page.
const HeroShowcase = () => {
  const reducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const advance = useCallback(() => {
    setIndex((i) => (i + 1) % FRAMES.length);
  }, []);

  useEffect(() => {
    if (reducedMotion || paused) return;
    const id = window.setInterval(advance, FRAME_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion, paused, advance]);

  return (
    <section
      className="relative overflow-x-clip bg-background pt-8 pb-16 md:pt-10 md:pb-24"
      aria-label="Product preview"
    >
      <div className="section-container">
        <div className="relative mx-auto max-w-6xl">
          {/* Forest band. Anchored to this wrapper (frame plus caption), not
              the section, so its top edge always lands inside the frame and
              never across text, whatever the viewport width. It runs to the
              section's bottom edge, so the next section starts clean on
              cream. The frame goes first and the words after it: the category
              puts the product straight under the buttons (Float, Drivetrain),
              and a heading above the frame pushed it below the first screen. */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[12%] -bottom-16 w-screen -translate-x-1/2 bg-[linear-gradient(135deg,hsl(var(--forest))_0%,hsl(var(--sage-dark))_60%,hsl(var(--forest))_100%)] md:-bottom-24"
          >
            {/* Dots on forest: the data points behind the product (see
                Backdrop.tsx for the cream-lines, forest-dots rule). */}
            <DotField />
          </div>

          <div
            className={cn(
              "relative overflow-hidden rounded-2xl border border-[hsl(var(--forest-border))] bg-card",
              "shadow-2xl shadow-[hsl(var(--forest)/0.45)] ring-1 ring-black/10",
            )}
          >
            {/* Browser-style window chrome (decorative; not a live browser).
                Forest surface per the brand book: the data window sits in a
                Forest frame on the cream canvas. */}
            <div
              className="flex items-center gap-3 border-b border-[hsl(var(--forest-border)/0.6)] bg-[hsl(var(--forest))] px-3 py-2.5 sm:px-4 sm:py-3"
              aria-hidden
            >
              <div className="flex shrink-0 gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--forest-border))]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--forest-border))]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--forest-border))]" />
              </div>
              <div className="flex min-w-0 flex-1 justify-center">
                <div className="truncate rounded-md border border-[hsl(var(--forest-border)/0.8)] bg-[hsl(var(--forest-raised)/0.8)] px-3 py-1 text-center font-mono text-[11px] text-[hsl(var(--forest-muted))] sm:text-xs sm:px-4">
                  app.zensus.app
                </div>
              </div>
              <span className="shrink-0 text-[10px] font-medium uppercase tracking-widest text-[hsl(var(--sage-light))]">
                Live
              </span>
            </div>

            <div
              className="relative aspect-[16/10] w-full overflow-hidden bg-muted"
              role="group"
              aria-roledescription="carousel"
              aria-label="Cash flow dashboard screenshots"
            >
              {FRAMES.map((frame, i) => (
                <img
                  key={frame.src}
                  src={frame.src}
                  alt={frame.alt}
                  width={1600}
                  height={1000}
                  decoding="async"
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "low"}
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ease-out",
                    i === index ? "opacity-100 z-[1]" : "opacity-0 z-0",
                  )}
                />
              ))}

              {!reducedMotion && (
                <div className="absolute bottom-2 right-2 z-[2]">
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-9 w-9 rounded-full border border-border bg-background/90 shadow-sm backdrop-blur-sm"
                    onClick={() => setPaused((p) => !p)}
                    aria-pressed={paused}
                    aria-label={paused ? "Resume slideshow" : "Pause slideshow"}
                  >
                    {paused ? (
                      <Play className="h-4 w-4" aria-hidden />
                    ) : (
                      <Pause className="h-4 w-4" aria-hidden />
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Caption on the forest band, under the frame. */}
          <div className="relative mx-auto mt-8 max-w-2xl text-center md:mt-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[hsl(var(--sage-light))]">
              Rolling cash forecast
            </p>
            <h2 className="mt-3 text-section text-[hsl(var(--forest-foreground))]">
              See the next 13 weeks before they hit your bank.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-[hsl(var(--forest-muted))] sm:text-lg">
              Zensus combines your bank, QuickBooks, and HubSpot data into a
              weekly forecast that reflects when cash actually moves.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroShowcase;
