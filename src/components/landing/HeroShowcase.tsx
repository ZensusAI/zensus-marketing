import { useCallback, useRef, useState, type CSSProperties } from "react";
import dashboard1 from "@/assets/dashboard-1.webp";
import dashboard13week from "@/assets/dashboard-13week.webp";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type { ScrollProgress } from "@/hooks/use-scroll-progress";
import { clamp01 } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { PinnedSection } from "./PinnedSection";
import { HERO_MESH } from "./hero-mesh";

/*
 * Product showcase from handoff 04-product-showcase (locked 8a): a pinned
 * camera tour on a forest band. As the band scrolls in, the copy rises and
 * the product frame swings in from a 3D tilt and locks flat; through the pin
 * the camera zooms to four details in turn while the step list highlights the
 * active step and its rail fills. All four step descriptions stay in the HTML.
 * Values (pin 3.4 viewports, easing, zoom origins and scales) are the
 * handoff's renderVals(). Reduced motion: flat frame, no zoom, every step
 * open, enforced in CSS (index.css, .showcase-reveal / -still / -rail /
 * -step-body) so it holds before hydration.
 */

const SHOTS = [
  { src: dashboard1, alt: "Zensus cash flow dashboard with projection chart", width: 2758, height: 1426 },
  { src: dashboard13week, alt: "Zensus 13-week cash flow view and budget breakdown", width: 1984, height: 1468 },
] as const;

// fx/fy: zoom origin in % of the frame; z: zoom scale; img: which screenshot.
const STEPS = [
  { img: 0, title: "All sources synced", body: "Bank, QuickBooks, and HubSpot stay current, with subscriptions and MRR read from your CRM.", fx: 10, fy: 6, z: 2.0 },
  { img: 0, title: "Zero-cash date", body: "The month you would run out, recalculated every time cash moves.", fx: 21, fy: 15, z: 2.0 },
  { img: 1, title: "13 weeks, week by week", body: "Inflows and outflows for each of the next 13 weeks, with your cash line on top.", fx: 36, fy: 40, z: 1.4 },
  { img: 0, title: "Ask in plain English", body: "Ask what happens if revenue dips 50%. The forecast redraws with your scenario on top.", fx: 82, fy: 40, z: 1.7 },
] as const;

const PIN_VIEWPORTS = 3.4;
const NARROW_QUERY = "(max-width: 819px)";

// The handoff's entry easing is ease-out cubic, not the in-out used elsewhere.
const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);

const stepAt = (p: number) => (p < 0.08 ? -1 : Math.min(3, Math.floor(((p - 0.08) / 0.92) * 4)));

const meshStyle = {
  "--mesh-narrow": `url(${HERO_MESH.narrow})`,
  "--mesh-wide": `url(${HERO_MESH.wide})`,
} as CSSProperties;

const HeroShowcase = () => {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(-1);
  const reveal = useRef<(HTMLElement | null)[]>([]);
  const frame = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const dots = useRef<HTMLDivElement>(null);
  const mesh = useRef<HTMLDivElement>(null);

  const onProgress = useCallback(({ progress: p, entry: e, overall: q }: ScrollProgress) => {
    const narrow = window.matchMedia(NARROW_QUERY).matches;
    reveal.current.forEach((el, i) => {
      if (!el) return;
      const t = easeOut((e - 0.3 - i * 0.08) / 0.4);
      el.style.opacity = t.toFixed(3);
      el.style.transform = `translateY(${((1 - t) * 24).toFixed(1)}px)`;
    });
    if (frame.current) {
      const t = 1 - easeOut(e);
      frame.current.style.transform = narrow
        ? `rotateX(${(18 * t).toFixed(2)}deg) translateY(${(60 * t).toFixed(1)}px) scale(${(0.94 + 0.06 * (1 - t)).toFixed(3)})`
        : `rotateY(${(-26 * t).toFixed(2)}deg) rotateX(${(10 * t).toFixed(2)}deg) translateX(${(160 * t).toFixed(1)}px) scale(${(0.9 + 0.1 * (1 - t)).toFixed(3)})`;
    }
    if (rail.current) rail.current.style.height = `${(p * 100).toFixed(1)}%`;
    if (dots.current) dots.current.style.transform = `translateY(${(-q * 140).toFixed(1)}px)`;
    if (mesh.current) mesh.current.style.transform = `translateY(${(-q * 320).toFixed(1)}px) scale(1.1)`;
    const si = stepAt(p);
    setActive((prev) => (prev === si ? prev : si));
  }, []);

  // Clicking a step scrolls to the middle of its stretch of the pin.
  const goTo = (i: number) => {
    const track = document.getElementById("product");
    if (!track) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    const frac = 0.08 + ((i + 0.5) / 4) * 0.92;
    window.scrollTo({ top: top + frac * (track.offsetHeight - window.innerHeight), behavior: "smooth" });
  };

  const current = !reduced && active >= 0 ? STEPS[active] : null;

  return (
    <PinnedSection
      id="product"
      viewports={PIN_VIEWPORTS}
      onProgress={onProgress}
      aria-labelledby="showcase-heading"
      className="bg-[linear-gradient(135deg,#0F1C16_0%,#0E5C3A_60%,#0F1C16_100%)]"
      stageClassName="overflow-hidden"
    >
      {/* Dots on forest, drifting up slower than the page. */}
      <div
        ref={dots}
        aria-hidden
        className="showcase-still pointer-events-none absolute inset-x-0 -inset-y-[20%] bg-[radial-gradient(rgba(254,247,230,.16)_1px,transparent_1.6px)] bg-[length:20px_20px] bg-[position:50%_0] [mask-image:radial-gradient(ellipse_85%_85%_at_50%_50%,black_35%,transparent_100%)]"
      />
      {/* The hero's mesh waves, screened faintly over the band. */}
      <div
        ref={mesh}
        aria-hidden
        style={meshStyle}
        className="showcase-still pointer-events-none absolute inset-x-0 top-[-10%] h-[120%] bg-cover bg-center bg-no-repeat opacity-[0.14] mix-blend-screen [background-image:var(--mesh-narrow)] min-[820px]:[background-image:var(--mesh-wide)]"
      />

      <div
        className={cn(
          "relative mx-auto grid h-full max-w-[1280px] grid-rows-[auto_minmax(0,1fr)] items-center gap-4 pb-7 pl-5 pt-[calc(4rem+28px)]",
          "min-[820px]:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] min-[820px]:grid-rows-1 min-[820px]:gap-14 min-[820px]:pb-12 min-[820px]:pl-10 min-[820px]:pt-[calc(4rem+48px)]",
        )}
      >
        <div className="flex flex-col self-start pr-5 min-[820px]:self-center min-[820px]:pr-0">
          <p ref={(el) => (reveal.current[0] = el)} className="showcase-reveal text-sm font-semibold text-sage-light">
            Rolling cash forecast
          </p>
          <h2
            id="showcase-heading"
            ref={(el) => (reveal.current[1] = el)}
            className="showcase-reveal mt-2 text-balance text-[26px] font-bold leading-[1.1] tracking-[-0.02em] text-forest-foreground min-[820px]:mt-3.5 min-[820px]:text-[40px]"
          >
            See the next 13 weeks before they hit your bank.
          </h2>
          {/* Hidden on phones to fit the pin, as in the handoff; still in the HTML. */}
          <p
            ref={(el) => (reveal.current[2] = el)}
            className="showcase-reveal mt-4 hidden text-[17px] leading-[1.6] text-forest-muted min-[820px]:block"
          >
            Zensus combines your bank, QuickBooks, and HubSpot data into a weekly forecast that reflects when cash actually
            moves.
          </p>

          <div className="relative mt-3.5 pl-[22px] min-[820px]:mt-[26px]">
            <div aria-hidden className="absolute bottom-1.5 left-0 top-1.5 w-0.5 rounded-sm bg-forest-border">
              <div ref={rail} className="showcase-rail h-0 w-full rounded-sm bg-sage-light" />
            </div>
            <ol>
            {STEPS.map((step, i) => {
              const on = i === active;
              const open = reduced || on;
              return (
                <li key={step.title}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    disabled={reduced}
                    aria-current={on ? "step" : undefined}
                    className="w-full rounded py-1.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-light min-[820px]:py-2.5"
                  >
                    <span className="flex items-baseline gap-2.5">
                      <span className={cn("font-mono text-[11px] transition-colors duration-300", on ? "text-sage-light" : "text-forest-muted")}>
                        {`0${i + 1}`}
                      </span>
                      <span
                        className={cn(
                          "text-[15px] font-semibold transition-colors duration-300 min-[820px]:text-[17px]",
                          on || reduced ? "text-forest-foreground" : i < active ? "text-forest-muted-strong" : "text-forest-muted",
                        )}
                      >
                        {step.title}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "showcase-step-body grid transition-[grid-template-rows,opacity] duration-[400ms] ease-out",
                        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <span className="overflow-hidden">
                        <span className="ml-7 block pt-1.5 text-sm leading-[1.55] text-forest-muted">{step.body}</span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
            </ol>
          </div>
        </div>

        <div
          className={cn(
            "relative mr-5 flex h-full items-center [perspective-origin:50%_30%] [perspective:1600px]",
            // Bleed off the right edge at every width, not only inside 1280px.
            "min-[820px]:mr-[calc(-140px-max(0px,(100vw-1280px)/2))] min-[820px]:[perspective-origin:0%_50%]",
          )}
        >
          <div
            ref={frame}
            className="showcase-reveal relative w-full origin-[50%_100%] [transform-style:preserve-3d] will-change-transform min-[820px]:origin-[0%_50%]"
          >
            <div className="overflow-hidden rounded-[14px] border border-forest-border bg-forest shadow-[0_50px_90px_-40px_rgba(0,0,0,.75)] min-[820px]:rounded-l-2xl min-[820px]:rounded-r-none min-[820px]:border-r-0">
              <div aria-hidden className="flex items-center gap-3 border-b border-forest-border/60 bg-forest px-4 py-[11px]">
                <span className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-forest-border" />
                  <span className="h-2.5 w-2.5 rounded-full bg-forest-border" />
                  <span className="h-2.5 w-2.5 rounded-full bg-forest-border" />
                </span>
                <span className="ml-2.5 rounded-md border border-forest-border/80 bg-[rgba(25,41,31,.8)] px-3.5 py-[3px] font-mono text-[11px] text-forest-muted">
                  app.zensus.app
                </span>
                <span className="ml-auto text-[10px] font-medium uppercase tracking-[0.1em] text-sage-light min-[820px]:mr-[140px]">Live</span>
              </div>
              <div className="relative aspect-[16/10] overflow-hidden bg-forest">
                {SHOTS.map((shot, i) => {
                  const shown = (current ? current.img : 0) === i;
                  const zoomed = current && current.img === i;
                  return (
                    <img
                      key={shot.src}
                      src={shot.src}
                      alt={shot.alt}
                      width={shot.width}
                      height={shot.height}
                      decoding="async"
                      loading={i === 0 ? "eager" : "lazy"}
                      style={{
                        transform: zoomed ? `scale(${current.z})` : "scale(1)",
                        transformOrigin: zoomed ? `${current.fx}% ${current.fy}%` : "50% 0%",
                      }}
                      className={cn(
                        "showcase-still absolute inset-0 h-full w-full object-cover object-left-top transition-[opacity,transform] duration-[600ms,900ms] [transition-timing-function:ease,cubic-bezier(.22,1,.36,1)]",
                        shown ? "opacity-100" : "opacity-0",
                      )}
                    />
                  );
                })}
                {current && (
                  <span
                    aria-hidden
                    style={{ left: `${current.fx}%`, top: `${current.fy}%` }}
                    className="absolute -ml-[11px] -mt-[11px] h-[22px] w-[22px] animate-ring-ping rounded-full border-2 border-sage-light bg-[rgba(72,216,138,.18)]"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PinnedSection>
  );
};

export default HeroShowcase;
