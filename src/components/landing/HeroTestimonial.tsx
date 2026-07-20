import { useEffect, useRef, useState } from "react";
import { Play, VolumeX } from "lucide-react";

// Self-hosted customer testimonial. The MP4 and its poster live in public/demo/
// and are referenced by absolute path (like the other public assets), so Vite
// does not hash them and neither image-optimizer script touches the video.
const VIDEO_SRC = "/demo/product-demo.mp4";
const POSTER_SRC = "/demo/product-demo-poster.webp";

const HeroTestimonial = () => {
  // Motion users get scroll-triggered autoplay; reduced-motion users get a
  // manual click-to-play. On scroll-in we try to start WITH sound, but browsers
  // block autoplay with audio unless the visitor already interacted with the
  // page, so we fall back to muted playback and show a "Tap for sound" control.
  // `started` drops the poster once frames paint; `muted` drives the unmute
  // affordance. Native controls (shown once started) provide pause/seek.
  const [reduced, setReduced] = useState(false);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Scroll-triggered autoplay for motion users. The video only loads once it
  // scrolls into view (preload="none" plus play() on intersection). It pauses
  // when it leaves the viewport, so scrolling away also stops the sound.
  useEffect(() => {
    if (reduced) return;
    const frame = frameRef.current;
    const video = videoRef.current;
    if (!frame || !video) return;

    const playInView = async () => {
      // Prefer sound. If the browser refuses autoplay-with-audio, retry muted.
      try {
        video.muted = false;
        await video.play();
        setMuted(false);
      } catch {
        video.muted = true;
        setMuted(true);
        try {
          await video.play();
        } catch {
          // Playback refused entirely: the poster stays put.
        }
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            playInView();
          } else if (!video.paused) {
            video.pause();
          }
        }
      },
      { threshold: [0, 0.5, 1] },
    );
    io.observe(frame);
    return () => io.disconnect();
  }, [reduced]);

  // Explicit unmute (the tap counts as the gesture browsers require for audio).
  const unmute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    setMuted(false);
    if (video.paused) video.play().catch(() => {});
  };

  // Reduced-motion path: an explicit click starts playback with sound.
  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    setMuted(false);
    setStarted(true);
    video.play().catch(() => {});
  };

  return (
    <figure className="mx-auto mt-10 w-full max-w-2xl">
      <div
        ref={frameRef}
        className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-xl ring-1 ring-black/5 dark:ring-white/10"
      >
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          preload="none"
          playsInline
          muted
          controls={started}
          aria-label="Video testimonial from Jameson Pitts, CEO of Sangfroid! Studios"
          onPlaying={() => setStarted(true)}
          onEnded={() => setStarted(false)}
          className="h-full w-full bg-black object-cover"
        />

        {/* Poster stays mounted until the first frame paints, covering load and
            buffering, and returns after the clip ends. */}
        {!started && (
          <img
            src={POSTER_SRC}
            alt=""
            width={1600}
            height={900}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Muted autoplay (browser blocked audio): one tap turns sound on. */}
        {!reduced && started && muted && (
          <button
            type="button"
            onClick={unmute}
            aria-label="Turn on sound"
            className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white shadow-md backdrop-blur transition-colors hover:bg-black/85"
          >
            <VolumeX className="h-4 w-4" aria-hidden />
            Tap for sound
          </button>
        )}

        {/* Reduced-motion users do not get autoplay, so offer a manual play with
            sound. */}
        {reduced && !started && (
          <button
            type="button"
            onClick={handlePlay}
            aria-label="Play video testimonial from Jameson Pitts, CEO of Sangfroid! Studios"
            className="group absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/25 to-transparent transition-colors hover:from-black/40"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-background/90 shadow-lg ring-1 ring-black/10 backdrop-blur-sm transition-transform duration-200 group-hover:scale-105">
              <Play className="ml-0.5 h-7 w-7 fill-current text-foreground" aria-hidden />
            </span>
          </button>
        )}
      </div>

      <figcaption className="mt-3 text-center text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Jameson Pitts</span>, CEO of Sangfroid! Studios
      </figcaption>
    </figure>
  );
};

export default HeroTestimonial;
