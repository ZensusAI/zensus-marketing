import { useRef, useState } from "react";
import { Play } from "lucide-react";

// Self-hosted customer testimonial. The MP4 and its poster live in public/demo/
// and are referenced by absolute path (like the other public assets), so Vite
// does not hash them and neither image-optimizer script touches the video.
// preload="none" plus click-to-play means zero video bytes are fetched until the
// visitor opts in, so the video never competes with the hero's first paint.
const VIDEO_SRC = "/demo/product-demo.mp4";
const POSTER_SRC = "/demo/product-demo-poster.webp";

const HeroTestimonial = () => {
  // `started` = the visitor clicked play, so swap the poster button for native
  // controls. `playing` = the video is actually rendering frames, so the poster
  // overlay can drop. Keeping them separate leaves the poster up during buffering
  // so there is no black flash between the click and the first painted frame.
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // play() runs synchronously inside the click handler so the browser counts
  // playback as user-initiated and allows sound. (Mounting a fresh <video
  // autoplay> from setState can lose the gesture and get muted or blocked.)
  const handlePlay = () => {
    setStarted(true);
    videoRef.current?.play().catch(() => {
      // Sound playback refused: native controls stay available for a manual press.
    });
  };

  return (
    <figure className="mx-auto mt-10 w-full max-w-2xl">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-xl ring-1 ring-black/5 dark:ring-white/10">
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          preload="none"
          playsInline
          controls={started}
          aria-label="Video testimonial from Jameson Pitts, CEO of Sangfroid! Studios"
          onPlaying={() => setPlaying(true)}
          onEnded={() => {
            setStarted(false);
            setPlaying(false);
          }}
          className="h-full w-full bg-black object-cover"
        />

        {/* Poster stays mounted until the first frame paints, covering buffering. */}
        {!playing && (
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

        {/* Play affordance, shown only before the first click. */}
        {!started && (
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
