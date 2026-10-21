import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Play, Volume2, VolumeX } from "lucide-react";
import hubspotLogo from "@/assets/integrations/hubspot.svg";
import { SITE_URL } from "@/lib/constants";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useScrollProgress, type ScrollProgress } from "@/hooks/use-scroll-progress";
import { clamp01, easeInOutCubic } from "@/lib/motion";
import { cn } from "@/lib/utils";

/*
 * Customer story from handoff 05-customer-story (locked 11a): a video
 * testimonial from Jameson Pitts beside a forest card on the feature he
 * mentions. Not pinned; scrubbed as the section scrolls in: the heading words
 * roll up, the video opens through a rounded clip-path window while settling
 * from a slight zoom, then the card slides in and its chips stagger in. "Tap
 * for sound" appears once the reveal completes. Values follow the handoff's
 * renderVals(). The G2 quote is not repeated here (it is in the proof strip).
 *
 * The video is muted autoplay while at least half of it is on screen, and it
 * loads only then (preload="none"). Reduced motion: everything in its final
 * place (index.css, .story-*), and a click-to-play poster instead of autoplay.
 */

// Self-hosted, with burned-in captions so muted playback stays legible. Kept in
// public/demo/ and referenced by absolute path so Vite does not hash them.
const VIDEO_SRC = "/demo/product-demo.mp4";
const POSTER_SRC = "/demo/product-demo-poster.webp";
const VIDEO_LABEL = "Video testimonial from Jameson Pitts, CEO of Sangfroid! Studios";

// VideoObject makes the self-hosted testimonial a citable video entity for AI
// engines and Google Video. The same customer's verified 5-star G2 review is a
// Review node on SoftwareApplication in index.html.
const videoLd = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "Zensus customer testimonial: Jameson Pitts, CEO of Sangfroid! Studios",
  description: "Customer video testimonial for Zensus by Jameson Pitts, CEO of Sangfroid! Studios.",
  thumbnailUrl: `${SITE_URL}${POSTER_SRC}`,
  contentUrl: `${SITE_URL}${VIDEO_SRC}`,
  // Full ISO 8601 with an explicit offset: Google's VideoObject validator
  // reports a bare date as an invalid datetime with no timezone.
  uploadDate: "2026-07-21T00:00:00+00:00",
  duration: "PT9S",
};

const HEADING = "Hear it from a customer.";
// HubSpot syncs invoices and subscriptions; it never reads deals (app code,
// 2026-10-05), so the handoff's "Deals" chip is "Invoices" here.
const CHIPS = ["Invoices", "Subscriptions", "Annual + quarterly contracts"];
// The homepage FAQ's HubSpot answer, verbatim.
const HUBSPOT_ANSWER =
  "Zensus syncs your HubSpot subscriptions (including annual and quarterly contracts) so your cash flow projections reflect when revenue actually hits your bank, not just flat monthly estimates.";

const NARROW_QUERY = "(max-width: 819px)";
const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
const rise = (el: HTMLElement | null, k: number, px: number) => {
  if (!el) return;
  el.style.opacity = k.toFixed(3);
  el.style.transform = `translateY(${((1 - k) * px).toFixed(1)}px)`;
};

const CustomerStory = () => {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const kicker = useRef<HTMLParagraphElement>(null);
  const name = useRef<HTMLParagraphElement>(null);
  const words = useRef<(HTMLSpanElement | null)[]>([]);
  const shadow = useRef<HTMLDivElement>(null);
  const clip = useRef<HTMLDivElement>(null);
  const zoom = useRef<HTMLDivElement>(null);
  const sound = useRef<HTMLButtonElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const chips = useRef<(HTMLSpanElement | null)[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [started, setStarted] = useState(false);

  const onProgress = useCallback(({ entry: e }: ScrollProgress) => {
    const narrow = window.matchMedia(NARROW_QUERY).matches;
    rise(kicker.current, easeOut((e - 0.15) / 0.3), 10);
    words.current.forEach((el, i) => {
      if (!el) return;
      const k = easeOut(((e - 0.2) / 0.35) * 1.6 - i * 0.12);
      el.style.opacity = k.toFixed(3);
      el.style.transform = `translateY(${((1 - k) * 110).toFixed(1)}%)`;
    });
    rise(name.current, easeOut((e - 0.4) / 0.3), 10);

    const k = easeInOutCubic((e - 0.25) / 0.55);
    if (clip.current) {
      clip.current.style.clipPath = `inset(${((1 - k) * 16).toFixed(2)}% ${((1 - k) * (narrow ? 8 : 20)).toFixed(2)}% round ${(18 + (1 - k) * (narrow ? 14 : 40)).toFixed(1)}px)`;
    }
    if (zoom.current) zoom.current.style.transform = `scale(${(1 + (1 - k) * 0.25).toFixed(3)})`;
    if (shadow.current) shadow.current.style.opacity = k.toFixed(3);
    if (sound.current) {
      const s = clamp01((k - 0.85) / 0.15);
      sound.current.style.opacity = s.toFixed(3);
      sound.current.style.pointerEvents = s > 0.5 ? "auto" : "none";
    }

    const k2 = easeOut((e - 0.55) / 0.35);
    if (card.current) {
      card.current.style.opacity = k2.toFixed(3);
      card.current.style.transform = narrow
        ? `translateY(${((1 - k2) * 50).toFixed(1)}px)`
        : `translateX(${((1 - k2) * 90).toFixed(1)}px)`;
    }
    const chipBase = (e - 0.75) / 0.2;
    chips.current.forEach((el, i) => rise(el, easeOut(chipBase * 2 - i * 0.35), 10));
  }, []);

  useScrollProgress(sectionRef, { disabled: reduced, onProgress });

  // Muted autoplay while at least half the video is on screen; pause when it
  // leaves, so scrolling away also stops any sound the viewer turned on.
  useEffect(() => {
    const video = videoRef.current;
    if (reduced || !video || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) video.play().catch(() => {});
        else if (!video.paused) video.pause();
      },
      { threshold: [0, 0.5] },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [reduced]);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    if (video.paused) video.play().catch(() => {});
  };

  // Reduced motion: an explicit click starts playback, with sound.
  const playWithSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.play().catch(() => {});
  };

  const headingWords = HEADING.split(" ");

  return (
    <section
      ref={sectionRef}
      aria-labelledby="customer-story-heading"
      className="bg-background px-5 pb-8 pt-12 min-[820px]:px-8 min-[820px]:pb-14 min-[820px]:pt-[72px]"
    >
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(videoLd)}</script>
      </Helmet>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <div>
            <p ref={kicker} className="story-reveal text-sm font-semibold text-primary">
              Customer story
            </p>
            {/* Real spaces between the word masks, so the heading reads as
                "Hear it from a customer." to crawlers and screen readers. */}
            <h2
              id="customer-story-heading"
              className="mt-3 text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-foreground min-[820px]:text-[40px]"
            >
              {headingWords.map((word, i) => (
                <Fragment key={i}>
                  {i > 0 && " "}
                  <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                    <span ref={(el) => (words.current[i] = el)} className="story-reveal inline-block">
                      {word}
                    </span>
                  </span>
                </Fragment>
              ))}
            </h2>
          </div>
          <p ref={name} className="story-reveal text-[15px] text-muted-foreground">
            <span className="font-semibold text-foreground">Jameson Pitts</span>, CEO of Sangfroid! Studios
          </p>
        </div>

        <div className="mt-8 grid items-center gap-5 min-[820px]:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="relative aspect-video w-full self-start">
            <div ref={shadow} aria-hidden className="story-reveal absolute inset-0 rounded-[18px] shadow-[0_30px_60px_-30px_rgba(26,42,40,.45)]" />
            <div ref={clip} className="story-clip absolute inset-0 overflow-hidden rounded-[18px] border border-border bg-forest">
              <div ref={zoom} className="story-still absolute inset-0">
                <video
                  ref={videoRef}
                  src={VIDEO_SRC}
                  poster={POSTER_SRC}
                  muted
                  loop={!reduced}
                  playsInline
                  preload="none"
                  aria-label={VIDEO_LABEL}
                  onVolumeChange={(ev) => setMuted(ev.currentTarget.muted)}
                  onPlaying={() => setStarted(true)}
                  className="absolute inset-0 h-full w-full bg-black object-cover"
                />
              </div>
              {reduced ? (
                !started && (
                  <button
                    type="button"
                    onClick={playWithSound}
                    aria-label={`Play ${VIDEO_LABEL.toLowerCase()}`}
                    className="absolute inset-0 z-[2] flex items-center justify-center bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-card shadow-lg">
                      <Play aria-hidden className="ml-0.5 h-7 w-7 fill-current text-foreground" />
                    </span>
                  </button>
                )
              ) : (
                <button
                  ref={sound}
                  type="button"
                  onClick={toggleSound}
                  aria-label={muted ? "Turn on sound" : "Mute sound"}
                  className="story-sound absolute right-3 top-3 z-[2] inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-black/75 px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {muted ? <VolumeX aria-hidden size={14} /> : <Volume2 aria-hidden size={14} />}
                  {muted ? "Tap for sound" : "Sound on"}
                </button>
              )}
            </div>
          </div>

          <div ref={card} className="story-reveal flex min-[820px]:min-h-full">
            <div className="flex flex-1 flex-col gap-3 rounded-[18px] bg-forest p-5 text-forest-foreground min-[820px]:gap-3.5 min-[820px]:p-[26px]">
              <p className="text-sm font-semibold text-sage-light">The feature he mentions</p>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-card">
                  <img src={hubspotLogo} alt="" width={24} height={24} className="h-6 w-6" />
                </span>
                <h3 className="text-xl font-bold tracking-[-0.02em]">HubSpot integration</h3>
              </div>
              <p className="text-pretty text-sm leading-[1.6] text-forest-muted min-[820px]:text-[14.5px]">{HUBSPOT_ANSWER}</p>
              <ul className="mt-auto flex flex-wrap gap-1.5">
                {CHIPS.map((chip, i) => (
                  <li
                    key={chip}
                    ref={(el) => (chips.current[i] = el)}
                    className="story-reveal whitespace-nowrap rounded-full border border-forest-border px-[9px] py-[5px] font-mono text-[11px] text-forest-muted-strong"
                  >
                    {chip}
                  </li>
                ))}
              </ul>
              <Link
                to="/integrations/hubspot"
                className="rounded text-sm font-semibold text-sage-light hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-light"
              >
                How the HubSpot integration works →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerStory;
