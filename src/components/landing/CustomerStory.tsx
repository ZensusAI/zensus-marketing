import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { SITE_URL } from "@/lib/constants";
import { EVENTS, track } from "@/lib/analytics/events";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

/*
 * Customer story from handoff 19 (locked 41a, 4 Nov 2026), replacing 11a: one
 * idea per screen, video first. A centred heading, the testimonial video
 * (960x480 from 760px, 16:9 on phones) and a caption row naming the speaker
 * and the feature he mentions, inside one <figure>. The feature card, chips
 * and HubSpot description of 11a are gone; HubSpot is plain text (Zensus is
 * not in the HubSpot Marketplace, so no logo).
 *
 * The video is muted autoplay while at least half of it is on screen and
 * pauses when it leaves; it loads only once the section is near. Besides the
 * handoff's sound pill there is a pause pill: the video loops for longer than
 * five seconds, and WCAG 2.2.2 needs a way to stop it. A pause by the viewer
 * sticks until they press play. Reduced motion: no autoplay, the poster with
 * a play button.
 *
 * The cut is the handoff's new 13.8s video trimmed to 9.25s (4 Nov 2026, with
 * the user): its end card showed the old marketing domain, so the video
 * stops on the last studio frame. The captions are burned in; the transcript
 * below repeats them so the testimonial is indexable.
 */

// Self-hosted, kept in public/demo/ and referenced by absolute path so Vite
// does not hash them.
const VIDEO_SRC = "/demo/product-demo.mp4";
// The 1600px poster is the VideoObject thumbnail; the player shows the 1200px
// file. A poster ignores loading="lazy", so it is set only once the section
// nears the viewport; otherwise its bytes compete with the hero.
const POSTER_SRC = "/demo/product-demo-poster.webp";
const POSTER_PLAYER_SRC = "/demo/product-demo-poster-1200.webp";
const VIDEO_NAME = "Zensus customer story: Sangfroid! Studios on cash flow forecasting with HubSpot";
// Read from the burned-in captions. The cut ends mid-sentence, as delivered.
const TRANSCRIPT =
  "One of my favorite features of Zensus is the HubSpot integration. Zensus automatically synced with HubSpot. It was plugged directly in,";

// VideoObject makes the self-hosted testimonial a citable video entity. No
// Review or AggregateRating here: Google does not show star snippets for
// reviews a business publishes about itself (handoff 19, SEO).
const videoLd = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: VIDEO_NAME,
  description: "Jameson Pitts, CEO of Sangfroid! Studios, on why the HubSpot integration is one of his favorite features of Zensus.",
  thumbnailUrl: `${SITE_URL}${POSTER_SRC}`,
  contentUrl: `${SITE_URL}${VIDEO_SRC}`,
  // Full ISO 8601 with an explicit offset: Google's VideoObject validator
  // reports a bare date as an invalid datetime with no timezone. The date of
  // the current cut.
  uploadDate: "2026-11-04T00:00:00+00:00",
  duration: "PT9S",
  transcript: TRANSCRIPT,
};

const pill =
  "relative inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-full bg-[rgba(15,28,22,.72)] px-3.5 text-[13px] font-medium text-forest-foreground backdrop-blur-[8px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white " +
  // 44px hit area on phones without growing the pill.
  "before:absolute before:-inset-1 before:content-[''] min-[760px]:before:hidden";

const CustomerStory = () => {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(true);
  const [near, setNear] = useState(false);
  // Set when the viewer pauses, so scrolling back into view does not resume.
  const userPaused = useRef(false);

  useEffect(() => {
    // Never in the prerendered HTML, where the parser would fetch it at once.
    if ((window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__) return;
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "1200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.5) {
          if (!userPaused.current) video.play().catch(() => {});
        } else if (!video.paused) video.pause();
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
    if (!video.muted) track(EVENTS.CUSTOMER_STORY_SOUND_ON);
    if (video.paused) {
      userPaused.current = false;
      video.play().catch(() => {});
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      video.play().catch(() => {});
    } else {
      userPaused.current = true;
      video.pause();
    }
  };

  // Reduced motion: an explicit click starts playback, with sound.
  const playWithSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.play().catch(() => {});
  };

  return (
    <section
      ref={sectionRef}
      id="customer-story"
      aria-labelledby="customer-story-heading"
      className="flex flex-col items-center bg-background px-5 py-16 text-center min-[760px]:px-8 min-[760px]:py-24"
    >
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(videoLd)}</script>
      </Helmet>
      <p className="text-sm font-semibold text-primary min-[760px]:text-[15px]">Customer story</p>
      <h2
        id="customer-story-heading"
        className="mt-3 text-balance text-[34px] font-bold leading-[1.05] tracking-[-0.035em] text-foreground min-[760px]:text-[44px] min-[1024px]:text-[52px]"
      >
        Hear it from a customer.
      </h2>

      <figure className="mt-8 w-full max-w-[960px] text-left min-[760px]:mt-10">
        {/* The box reserves the video's space before anything loads (no CLS):
            16:9 on phones, the handoff's 960x480 from 760px. */}
        <div className="relative aspect-video w-full overflow-hidden rounded-[20px] bg-forest shadow-[0_40px_80px_-40px_rgba(15,28,22,.55)] min-[760px]:aspect-[2/1]">
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            poster={near ? POSTER_PLAYER_SRC : undefined}
            muted
            loop={!reduced}
            playsInline
            preload={near ? "metadata" : "none"}
            title={VIDEO_NAME}
            aria-label={VIDEO_NAME}
            onVolumeChange={(ev) => setMuted(ev.currentTarget.muted)}
            onPlaying={() => {
              setStarted(true);
              setPaused(false);
            }}
            onPause={() => setPaused(true)}
            // The 2:1 box crops 60px of a 16:9 frame; take it from the top
            // (headroom) so the burned-in captions at the bottom stay whole.
            className="absolute inset-0 h-full w-full object-cover object-bottom"
          />
          {reduced && !started ? (
            <button
              type="button"
              onClick={playWithSound}
              aria-label={`Play ${VIDEO_NAME}`}
              className="absolute inset-0 z-[2] flex items-center justify-center bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-card shadow-lg">
                <Play aria-hidden className="ml-0.5 h-7 w-7 fill-current text-foreground" />
              </span>
            </button>
          ) : (
            <div className="absolute right-4 top-4 z-[2] flex gap-2">
              <button type="button" onClick={togglePlay} className={pill}>
                {paused ? <Play aria-hidden size={15} /> : <Pause aria-hidden size={15} />}
                {paused ? "Play" : "Pause"}
              </button>
              {/* The visible text is the accessible name (WCAG 2.5.3). */}
              <button type="button" onClick={toggleSound} aria-pressed={!muted} className={pill}>
                {muted ? <VolumeX aria-hidden size={15} /> : <Volume2 aria-hidden size={15} />}
                {muted ? "Tap for sound" : "Sound on"}
              </button>
            </div>
          )}
        </div>

        <figcaption className="mt-6 flex flex-col gap-2 text-[15px] text-muted-foreground min-[760px]:flex-row min-[760px]:items-center min-[760px]:justify-between min-[760px]:gap-6">
          <span>
            <span className="font-semibold text-foreground">Jameson Pitts</span>, CEO, Sangfroid! Studios
          </span>
          <span className="flex flex-wrap items-center gap-x-3.5 gap-y-1">
            <span>
              The feature he mentions: <span className="font-semibold text-foreground">HubSpot integration</span>
            </span>
            <Link
              to="/integrations/hubspot"
              onClick={() => track(EVENTS.CUSTOMER_STORY_FEATURE_LINK)}
              className="rounded-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              How the HubSpot integration works →
            </Link>
          </span>
        </figcaption>

        <details className="mt-4 text-[15px] text-muted-foreground">
          <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-sm font-medium text-foreground underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden">
            Read transcript
          </summary>
          <p className="mt-2 max-w-[640px] text-pretty leading-[1.55]">&ldquo;{TRANSCRIPT}&rdquo;</p>
        </details>
      </figure>
    </section>
  );
};

export default CustomerStory;
