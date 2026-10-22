import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { clamp01, easeInOutCubic as ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import meshInverted960 from "@/assets/hero-mesh-inverted-960.webp";
import meshInverted1440 from "@/assets/hero-mesh-inverted-1440.webp";
import { HERO_MESH } from "./hero-mesh";
import { TalkToUsButton } from "./TalkToUsButton";
import { TryItNowButton } from "./TryItNowButton";

/*
 * Final CTA, from handoff 12-final-cta (locked 21c): the forest finale band.
 * The last section asks for the same action as the first (the trial), with a
 * call as the secondary route. Motion is scroll-scrubbed on entry, not pinned:
 * the band widens from an inset rounded shape to full bleed and the headline
 * rolls up word by word, then the subhead and buttons follow. A soft green
 * spotlight follows a mouse pointer and the Start button leans toward it when
 * it comes within 140px. The band's rounded bottom corners sit on the cream
 * footer (13-footer).
 * Reduced motion: full bleed, static headline, no spotlight or magnet.
 *
 * Below the buttons, one plain line states the price and links to /pricing,
 * the homepage's only in-content price since PricingPreview left it.
 * When keyboard focus lands inside the band, it jumps to its finished state so
 * a focused button is never half faded in.
 */

const WORDS = "Stop rebuilding that spreadsheet every Monday.".split(" ");
const MAGNET_PX = 140;
const MAGNET_PULL = 0.18;

// `compact` (the About page, 22 Oct 2026): the same band at the same size,
// with its copy and buttons about 15% smaller from 760px, matching that
// page's scale. The homepage and other pages keep the full size.
const FinalCTABand = ({ compact = false }: { compact?: boolean }) => {
  const reduced = usePrefersReducedMotion();
  const secRef = useRef<HTMLElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const magnetRef = useRef<HTMLSpanElement>(null);
  const [e, setE] = useState(0);
  const [focused, setFocused] = useState(false);

  // Entry progress: 0 as the band's top meets the bottom of the viewport, 1
  // once it has travelled half a viewport plus 60% of its own height. The
  // scroll listener is attached only while the band is near the viewport.
  useEffect(() => {
    const sec = secRef.current;
    if (reduced || !sec) return;
    let raf = 0;
    let listening = false;
    const measure = () => {
      raf = 0;
      const r = sec.getBoundingClientRect();
      const vh = window.innerHeight;
      setE(clamp01((vh - r.top) / (vh * 0.5 + r.height * 0.6)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    const listen = (on: boolean) => {
      if (on === listening) return;
      listening = on;
      if (on) {
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        measure();
      } else {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        measure();
      }
    };
    const io =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver((entries) => listen(entries[entries.length - 1].isIntersecting), { rootMargin: "50% 0px" });
    if (io) io.observe(sec);
    else listen(true);
    measure();
    return () => {
      io?.disconnect();
      listen(false);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  // Pointer effects write styles directly, so a mouse move never re-renders.
  // Touch and pen are skipped: a tap fires no leave event, so the button
  // would stay offset.
  const onMove = (ev: React.PointerEvent<HTMLElement>) => {
    if (reduced || ev.pointerType !== "mouse" || !secRef.current) return;
    const r = secRef.current.getBoundingClientRect();
    spotRef.current?.style.setProperty("--mx", `${ev.clientX - r.left}px`);
    spotRef.current?.style.setProperty("--my", `${ev.clientY - r.top}px`);
    const m = magnetRef.current;
    const anchor = m?.parentElement;
    if (!m || !anchor) return;
    // Measure the untransformed wrapper, not the moving button, so the pull
    // does not feed back into its own distance test.
    const b = anchor.getBoundingClientRect();
    const dx = ev.clientX - (b.left + b.width / 2);
    const dy = ev.clientY - (b.top + b.height / 2);
    const near = Math.hypot(dx, dy) < MAGNET_PX;
    m.style.transform = near ? `translate(${(dx * MAGNET_PULL).toFixed(1)}px, ${(dy * MAGNET_PULL).toFixed(1)}px)` : "";
  };
  const onLeave = () => {
    spotRef.current?.style.setProperty("--mx", "-999px");
    if (magnetRef.current) magnetRef.current.style.transform = "";
  };

  const still = reduced || focused;
  const p = still ? 1 : e;
  const kg = ease((p - 0.05) / 0.35);
  const ks = ease((p - 0.42) / 0.2);
  const kb = ease((p - 0.52) / 0.16);
  const clip = still
    ? undefined
    : `inset(0 calc(${((1 - kg) * 100).toFixed(2)}% * var(--cta-inset)) round ${((1 - kg) * 32).toFixed(1)}px ${((1 - kg) * 32).toFixed(1)}px 0 0)`;

  return (
    <section
      ref={secRef}
      aria-labelledby="final-cta-heading"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onFocus={() => setFocused(true)}
      onBlur={(ev) => {
        if (!ev.currentTarget.contains(ev.relatedTarget as Node | null)) setFocused(false);
      }}
      className="relative overflow-hidden rounded-b-[24px] bg-forest px-5 py-[88px] [--cta-inset:0.04] min-[760px]:rounded-b-[40px] min-[760px]:px-8 min-[760px]:py-[140px] min-[760px]:[--cta-inset:0.07]"
      style={{ clipPath: clip }}
    >
      {/* The hero waves, inverted, fading out toward the bottom. The inversion
          is baked into the files (invert plus a 180deg hue turn), so the band
          does not run a CSS filter over a full-width image while it animates. */}
      <picture>
        <source media={`(min-width: ${HERO_MESH.switchPx}px)`} srcSet={meshInverted1440} />
        <img
          src={meshInverted960}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[.16] mix-blend-screen [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
        />
      </picture>
      {!reduced && (
        <div
          ref={spotRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 [--mx:-999px] [--my:-999px] [background:radial-gradient(520px_circle_at_var(--mx)_var(--my),rgba(72,216,138,.16),transparent_60%)]"
        />
      )}

      <div className="relative mx-auto max-w-[720px] text-center">
        <h2
          id="final-cta-heading"
          className={cn(
            "text-balance text-[32px] font-bold leading-[1.1] tracking-[-0.025em] text-forest-foreground min-[760px]:text-[54px]",
            compact && "min-[760px]:text-[46px]",
          )}
        >
          {WORDS.map((w, i) => {
            const k = ease((p - 0.3 - i * 0.035) / 0.22);
            return (
              <span key={i}>
                <span className="inline-block overflow-hidden pb-[.08em] align-top">
                  <span
                    className={cn("inline-block", i >= 4 && "text-sage-light")}
                    style={still ? undefined : { transform: `translateY(${((1 - k) * 105).toFixed(1)}%)`, opacity: k }}
                  >
                    {w}
                  </span>
                </span>
                {i < WORDS.length - 1 ? " " : null}
              </span>
            );
          })}
        </h2>
        <p
          className={cn(
            "mx-auto mt-3.5 max-w-[560px] text-pretty text-base leading-[1.55] text-forest-muted-strong min-[760px]:mt-[18px] min-[760px]:text-lg",
            compact && "min-[760px]:mt-4 min-[760px]:max-w-[480px] min-[760px]:text-[15.5px]",
          )}
          style={still ? undefined : { opacity: ks, transform: `translateY(${((1 - ks) * 12).toFixed(1)}px)` }}
        >
          Connect your data in a few minutes. If you would rather see it first, we will walk you through it on a call.
        </p>
        <div style={still ? undefined : { opacity: kb, transform: `translateY(${((1 - kb) * 12).toFixed(1)}px)` }}>
          <div className={cn("mt-8 flex flex-col flex-wrap items-center justify-center gap-3 min-[760px]:flex-row", compact && "min-[760px]:mt-7")}>
            <span className="inline-flex w-full max-w-[300px] justify-center min-[760px]:w-auto min-[760px]:max-w-none">
              <span ref={magnetRef} className="inline-flex w-full justify-center transition-transform duration-200 ease-out min-[760px]:w-auto">
                <TryItNowButton
                  variant="solid"
                  source="final_cta_band"
                  className={cn(
                    "w-full justify-center shadow-[0_0_0_1px_rgba(72,216,138,.5),0_0_28px_rgba(34,197,115,.35)] focus-visible:ring-offset-forest min-[760px]:w-auto",
                    compact && "min-[760px]:h-[44px] min-[760px]:px-6 min-[760px]:text-[14.5px]",
                  )}
                />
              </span>
            </span>
            <TalkToUsButton
              variant="outline"
              className={cn(
                "w-full max-w-[300px] justify-center border-[#3E5A4B] bg-transparent text-forest-foreground focus-visible:ring-offset-forest min-[760px]:w-auto min-[760px]:max-w-none",
                compact && "min-[760px]:h-[44px] min-[760px]:px-6 min-[760px]:text-[14px]",
              )}
            />
          </div>
          <p className={cn("mt-5 text-sm text-forest-muted-strong", compact && "min-[760px]:mt-4 min-[760px]:text-[13px]")}>
            Zensus Pro is $199 a month after a 14-day free trial.{" "}
            <Link
              to="/pricing"
              className="whitespace-nowrap font-medium text-sage-light underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-light focus-visible:ring-offset-2 focus-visible:ring-offset-forest"
            >
              See pricing
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTABand;
