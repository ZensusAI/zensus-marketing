import { useCallback, useRef, type ReactNode } from "react";
import { Linkedin } from "lucide-react";
import { PinnedSection } from "@/components/landing/PinnedSection";
import { usePrefersReducedMotion, useStaticPins, useWide820 } from "@/hooks/use-prefers-reduced-motion";
import { useScrollFrame } from "@/hooks/use-scroll-frame";
import type { ScrollProgress } from "@/hooks/use-scroll-progress";
import { clamp01, easeInOutCubic as ease, segment } from "@/lib/motion";
import { cn } from "@/lib/utils";

/*
 * The About page's scroll motion (22 Oct 2026). Four pieces, one bold:
 *   1. HeroParallax: the glow drifts slower than the copy, which lifts and
 *      fades as the opening scrolls away.
 *   2. StoryParagraphs: the paragraph at the middle of the screen is at full
 *      strength, the rest dimmed, while the heading column stays put (CSS
 *      sticky, see About.tsx).
 *   3. TeamGrid: the cards stand up from a backward tilt as they enter, the
 *      photos move a little inside their frames, and a card leans toward the
 *      mouse.
 *   4. BeliefsStack: the centrepiece. The forest panel pins and the five
 *      beliefs arrive one at a time, each new card sliding up as the one
 *      before it recedes.
 *
 * All of it is position-driven, never time-driven, and writes transform and
 * opacity to refs, so React does not re-render on scroll and the compositor
 * does the work. Under reduced motion nothing moves and every piece shows its
 * finished state; the prerender captures this page with reduced motion, so
 * the static HTML is that state too. The 3D parts (card tilt, photo parallax,
 * the pinned stack) run from 820px wide; narrower screens get the cards'
 * plain rise and the beliefs as a list. Every word stays in the DOM.
 */

/** Motion on at all (not reduced), and the 3D extras (also 820px and wider). */
function useAboutMotion() {
  const reduced = usePrefersReducedMotion();
  const wide = useWide820();
  return { motion: !reduced, depth: !reduced && wide };
}

/* 1. Opening ---------------------------------------------------------------- */

// The ruled column and its marks stay put; only the element marked
// data-parallax-copy (the text) moves, and the glow behind it.
export function HeroParallax({ glow, children }: { glow: string; children: ReactNode }) {
  const { motion } = useAboutMotion();
  const secRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useScrollFrame(() => {
    const sec = secRef.current;
    if (!sec) return;
    const r = sec.getBoundingClientRect();
    const k = clamp01(-r.top / Math.max(1, r.height));
    if (glowRef.current) glowRef.current.style.transform = `translate3d(0, ${(k * 140).toFixed(1)}px, 0) scale(${(1 + k * 0.12).toFixed(3)})`;
    const copy = sec.querySelector<HTMLElement>("[data-parallax-copy]");
    if (copy) {
      copy.style.transform = `translate3d(0, ${(k * -48).toFixed(1)}px, 0)`;
      copy.style.opacity = (1 - k * 0.65).toFixed(3);
    }
  }, motion);

  return (
    <section ref={secRef} className="relative">
      <div ref={glowRef} aria-hidden className={cn("pointer-events-none absolute inset-0 will-change-transform", glow)} />
      {children}
    </section>
  );
}

/* 2. Where it started -------------------------------------------------------- */

export function StoryParagraphs({ paragraphs, className }: { paragraphs: string[]; className?: string }) {
  const { motion } = useAboutMotion();
  const refs = useRef<(HTMLParagraphElement | null)[]>([]);

  useScrollFrame((vh) => {
    for (const el of refs.current) {
      if (!el) continue;
      const r = el.getBoundingClientRect();
      // 0 at the middle of the screen, 1 half a screen away from it.
      const d = Math.abs(r.top + r.height / 2 - vh * 0.5) / (vh * 0.5);
      el.style.opacity = (1 - 0.68 * ease(segment(d, 0.18, 0.75))).toFixed(3);
    }
  }, motion);

  return (
    <div className={className}>
      {paragraphs.map((text, i) => (
        <p
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="transition-opacity duration-150 ease-linear motion-reduce:transition-none"
        >
          {text}
        </p>
      ))}
    </div>
  );
}

/* 3. Our Team ---------------------------------------------------------------- */

export type TeamMember = {
  id: string;
  name: string;
  title: string;
  photo?: string;
  linkedin?: string;
};

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .filter((_, i, a) => i === 0 || i === a.length - 1)
    .join("");

export function TeamGrid({ team, className }: { team: TeamMember[]; className?: string }) {
  const { motion, depth } = useAboutMotion();
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const photos = useRef<(HTMLImageElement | null)[]>([]);

  useScrollFrame((vh) => {
    cards.current.forEach((li, i) => {
      if (!li) return;
      const r = li.getBoundingClientRect();
      // Stands up over the first 80% of a screen after its top enters; the
      // right-hand column a beat behind the left. A card holding keyboard
      // focus is shown finished.
      const raw = clamp01((vh - r.top) / (vh * 0.8) - (i % 2) * 0.12);
      const t = li.contains(document.activeElement) ? 1 : ease(raw);
      const u = 1 - t;
      li.style.opacity = (0.15 + 0.85 * t).toFixed(3);
      li.style.transform = depth
        ? `perspective(1200px) translate3d(0, ${(u * 56).toFixed(1)}px, ${(u * -90).toFixed(1)}px) rotateX(${(u * 24).toFixed(2)}deg)`
        : `translate3d(0, ${(u * 32).toFixed(1)}px, 0)`;
      const img = photos.current[i];
      if (img && depth) {
        // Window parallax: the photo drifts against the card, up to 18px.
        const c = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / vh));
        img.style.transform = `translate3d(0, ${(c * -18).toFixed(1)}px, 0) scale(1.1)`;
      }
    });
  }, motion);

  // The lean toward the mouse: a few degrees, on the inner card so it
  // composes with the scroll transform on the list item.
  const lean = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!depth || e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-dy * 7).toFixed(2)}deg) rotateY(${(dx * 7).toFixed(2)}deg)`;
  };
  const unlean = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "";
  };

  return (
    <ul className={className}>
      {team.map((m, i) => (
        <li
          key={m.id}
          id={m.id}
          ref={(el) => {
            cards.current[i] = el;
          }}
          onFocus={() => {
            const li = cards.current[i];
            if (li) {
              li.style.opacity = "1";
              li.style.transform = "none";
            }
          }}
          className="scroll-mt-24 will-change-transform"
        >
          <div
            onPointerMove={lean}
            onPointerLeave={unlean}
            className="transition-transform duration-300 ease-ui [transform-style:preserve-3d] motion-reduce:transition-none"
          >
            <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-forest shadow-[0_18px_40px_-28px_rgba(15,28,22,.45)]">
              {m.photo ? (
                <img
                  ref={(el) => {
                    photos.current[i] = el;
                  }}
                  src={m.photo}
                  alt={`${m.name}${m.title ? `, ${m.title} at Zensus` : ", Zensus"}`}
                  width={512}
                  height={512}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  aria-hidden
                  className="flex h-full w-full items-center justify-center text-[clamp(2rem,7vw,3.5rem)] font-bold tracking-[-0.02em] text-forest-muted-strong [background:radial-gradient(circle_at_30%_25%,hsl(var(--forest-raised)),hsl(var(--forest))_70%)]"
                >
                  {initials(m.name)}
                </div>
              )}
            </div>
            <div className="mt-4 flex items-start justify-between gap-2 min-[820px]:mt-3.5">
              <div className="min-w-0">
                <h3 className="text-[17px] font-semibold leading-tight text-foreground min-[820px]:text-[15px]">{m.name}</h3>
                {m.title ? <p className="mt-1 text-sm text-muted-foreground min-[820px]:text-[13px]">{m.title}</p> : null}
              </div>
              {m.linkedin ? (
                <a
                  href={m.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${m.name} on LinkedIn (opens in a new tab)`}
                  className="mt-0.5 shrink-0 rounded text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Linkedin size={16} aria-hidden />
                </a>
              ) : null}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* 4. What we believe --------------------------------------------------------- */

export type Belief = { line: string; body: string };

// About four screens of scroll for five beliefs: a short lead-in, one beat
// per arrival, a short hold on the last.
const STACK_VIEWPORTS = 4;

export function BeliefsStack({ beliefs }: { beliefs: Belief[] }) {
  const staticPins = useStaticPins();
  const wide = useWide820();
  const pinned = !staticPins && wide;
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const dims = useRef<(HTMLSpanElement | null)[]>([]);
  const dots = useRef<(HTMLSpanElement | null)[]>([]);
  const n = beliefs.length;

  const onProgress = useCallback(
    ({ progress }: ScrollProgress) => {
      // b runs 0 to n-1: the index of the belief on top, fractional between.
      const b = segment(progress, 0.06, 0.92) * (n - 1);
      cards.current.forEach((el, i) => {
        if (!el) return;
        const arrive = i === 0 ? 1 : ease(clamp01(b - (i - 1)));
        const behind = Math.max(0, b - i); // how far later cards have covered it
        const d = Math.min(behind, 3);
        const y = (1 - arrive) * 300 - d * 26;
        el.style.transform = `translate3d(0, ${y.toFixed(1)}px, ${(-d * 70).toFixed(1)}px) scale(${(1 - d * 0.05).toFixed(3)})`;
        el.style.opacity = (arrive * clamp01(3.2 - behind)).toFixed(3);
        const dim = dims.current[i];
        if (dim) dim.style.opacity = Math.min(0.78, d * 0.34).toFixed(3);
      });
      const on = Math.round(b);
      dots.current.forEach((dot, i) => {
        if (dot) dot.dataset.on = i <= on ? "true" : "false";
      });
    },
    [n],
  );

  const heading = (
    <h2 id="beliefs-heading" className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-forest-muted-strong">
      What we believe
    </h2>
  );

  if (!pinned) {
    return (
      <section aria-labelledby="beliefs-heading" className="px-3 pb-16 min-[820px]:px-6 min-[820px]:pb-24">
        <div className="mx-auto max-w-6xl rounded-[28px] bg-forest px-6 py-14 text-forest-foreground min-[820px]:px-16 min-[820px]:py-20">
          {heading}
          <ul className="mt-8 divide-y divide-forest-border min-[820px]:mt-7">
            {beliefs.map((b) => (
              <li
                key={b.line}
                className="grid gap-2 py-6 first:pt-0 last:pb-0 min-[820px]:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] min-[820px]:items-baseline min-[820px]:gap-12 min-[820px]:py-7"
              >
                <p className="text-balance text-[24px] font-bold leading-[1.2] tracking-[-0.01em] min-[820px]:text-[26px]">{b.line}</p>
                <p className="text-[15.5px] leading-[1.6] text-forest-muted-strong min-[820px]:text-[14px]">{b.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <PinnedSection
      viewports={STACK_VIEWPORTS}
      onProgress={onProgress}
      aria-labelledby="beliefs-heading"
      className="px-6"
      stageClassName="flex items-center"
    >
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-[28px] bg-forest px-16 pb-14 pt-14 text-forest-foreground">
        <div className="flex items-center justify-between">
          {heading}
          <div aria-hidden className="flex gap-1.5">
            {beliefs.map((b, i) => (
              <span
                key={b.line}
                ref={(el) => {
                  dots.current[i] = el;
                }}
                data-on={i === 0 ? "true" : "false"}
                className="h-1.5 w-6 rounded-full bg-forest-border transition-colors duration-300 data-[on=true]:bg-sage-light"
              />
            ))}
          </div>
        </div>
        <ul className="relative mx-auto mt-16 h-[210px] max-w-[760px] [perspective:1200px]">
          {beliefs.map((b, i) => (
            <li
              key={b.line}
              ref={(el) => {
                cards.current[i] = el;
              }}
              style={{ zIndex: i + 1, opacity: i === 0 ? 1 : 0 }}
              className="absolute inset-x-0 top-0 rounded-[22px] border border-forest-border bg-forest-raised px-10 py-9 shadow-[0_30px_60px_-30px_rgba(0,0,0,.6)] will-change-transform"
            >
              <span
                aria-hidden
                ref={(el) => {
                  dims.current[i] = el;
                }}
                className="pointer-events-none absolute inset-0 rounded-[22px] bg-forest opacity-0"
              />
              <p className="relative text-balance text-[28px] font-bold leading-[1.2] tracking-[-0.01em]">{b.line}</p>
              <p className="relative mt-3 max-w-[56ch] text-[15px] leading-[1.6] text-forest-muted-strong">{b.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </PinnedSection>
  );
}
