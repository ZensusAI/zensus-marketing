import { useCallback, useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import dashboard1 from "@/assets/dashboard-1.png";
import dashboard2 from "@/assets/dashboard-2.png";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const FRAMES = [
  { src: dashboard1, alt: "Zensus runway dashboard with projection chart" },
  { src: dashboard2, alt: "Zensus runway dashboard alternate view" },
] as const;

/** Time each frame stays fully visible before crossfading (between 2–3s). */
const FRAME_MS = 3500;

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
      className="section-padding bg-background pb-10 pt-2 md:pb-14 md:pt-4"
      aria-label="Product preview"
    >
      <div className="section-container">
        <div className="mx-auto max-w-5xl">
          <div
            className={cn(
              "overflow-hidden rounded-2xl border border-border bg-card shadow-xl",
              "ring-1 ring-black/5 dark:ring-white/10",
            )}
          >
            {/* Browser-style window chrome (decorative; not a live browser). */}
            <div
              className="flex items-center gap-3 border-b border-white/[0.06] bg-zinc-950 px-3 py-2.5 sm:px-4 sm:py-3"
              aria-hidden
            >
              <div className="flex shrink-0 gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              </div>
              <div className="flex min-w-0 flex-1 justify-center">
                <div className="truncate rounded-full border border-white/10 bg-zinc-900/80 px-3 py-1 text-center font-mono text-[11px] text-zinc-400 sm:text-xs sm:px-4">
                  app.zensus.app
                </div>
              </div>
              <span className="shrink-0 text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                Live
              </span>
            </div>

            <div
              className="relative aspect-[16/10] w-full overflow-hidden bg-muted"
              role="group"
              aria-roledescription="carousel"
              aria-label="Runway dashboard screenshots"
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
                  fetchPriority="low"
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
        </div>
      </div>
    </section>
  );
};

export default HeroShowcase;
