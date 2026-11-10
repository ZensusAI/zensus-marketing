import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import type { CSSProperties } from "react";
import { START_TRIAL_URL, TALK_TO_US_URL } from "@/lib/constants";
import type { TourAction, TourStep } from "@/lib/tour";
import { cn } from "@/lib/utils";

// The tour player's markup, with no hooks and no state: TourPlayer owns the
// step index, the keyboard and the image fetches, and passes everything in.
// Keeping this a plain function is what lets the tests click its buttons
// without a browser DOM.

export type ImageState = { status: "loading" } | { status: "ready"; url: string } | { status: "error" };

export type TourPlayerViewProps = {
  name: string;
  steps: TourStep[];
  /** 0..steps.length-1 is a step; steps.length is the end screen. */
  index: number;
  images: Record<string, ImageState>;
  onAction: (action: TourAction | { goto: number }) => void;
};

const CONTROL =
  "inline-flex h-10 items-center gap-1.5 rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground " +
  "transition-colors hover:border-primary/60 disabled:pointer-events-none disabled:opacity-40 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const PRIMARY =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-[15px] font-semibold text-primary-foreground " +
  "transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const SECONDARY =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-card px-7 text-[15px] font-semibold text-foreground " +
  "transition-colors hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

/**
 * The screenshot frame keeps the image's aspect ratio and fits the viewport
 * height on desktop, so the hotspot's percentages always land on the same
 * pixels of the screenshot. On a phone it is simply the full width.
 */
function frameStyle(step: TourStep): CSSProperties {
  const ratio = step.width / step.height;
  return {
    aspectRatio: `${step.width} / ${step.height}`,
    width: `min(100%, calc((100svh - 15rem) * ${ratio.toFixed(4)}))`,
  };
}

function Screenshot({ step, image, onNext }: { step: TourStep; image: ImageState | undefined; onNext: () => void }) {
  const { x, y, w, h } = step.hotspot;
  return (
    <div
      className="relative mx-auto overflow-hidden rounded-xl border border-border bg-muted shadow-sm"
      style={frameStyle(step)}
    >
      {image?.status === "ready" ? (
        <img
          src={image.url}
          alt={`${step.title}. ${step.caption}`}
          width={step.width}
          height={step.height}
          className="absolute inset-0 h-full w-full select-none object-cover"
          draggable={false}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
          {image?.status === "error" ? "This screenshot could not be loaded." : "Loading screenshot"}
        </div>
      )}
      {/* Phones: a tap anywhere on the screenshot advances. Hidden from
          assistive tech and the tab order; the hotspot and Next cover both. */}
      <button
        type="button"
        data-tour="tap-advance"
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 cursor-pointer sm:hidden"
        onClick={onNext}
      />
      <button
        type="button"
        data-tour="hotspot"
        aria-label={`Next: continue from ${step.title}`}
        className="group absolute rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}
        onClick={onNext}
      >
        <span className="absolute inset-0 rounded-lg border-2 border-primary bg-primary/10 transition-colors group-hover:bg-primary/20" />
        <span className="absolute inset-0 animate-ping rounded-lg border-2 border-primary/70 motion-reduce:animate-none" />
      </button>
    </div>
  );
}

function Dots({ count, index, onAction }: { count: number; index: number; onAction: TourPlayerViewProps["onAction"] }) {
  return (
    <ol className="flex items-center gap-1.5" aria-label="Tour steps">
      {Array.from({ length: count + 1 }, (_, i) => (
        <li key={i}>
          <button
            type="button"
            data-tour="dot"
            aria-label={i === count ? "End of tour" : `Step ${i + 1} of ${count}`}
            aria-current={i === index ? "step" : undefined}
            className={cn(
              "block h-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              i === index ? "w-6 bg-primary" : "w-2.5 bg-border hover:bg-primary/50",
            )}
            onClick={() => onAction({ goto: i })}
          />
        </li>
      ))}
    </ol>
  );
}

function EndScreen() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-2 py-12 text-center sm:py-20">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        That is the tour.
      </h2>
      <p className="mt-3 text-base text-muted-foreground">
        See it on your own numbers. We will walk you through it live, or you can start a free trial now.
      </p>
      <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row">
        <a data-tour="book-demo" href={TALK_TO_US_URL} target="_blank" rel="noopener noreferrer" className={PRIMARY}>
          Book a live demo
          <ArrowRight size={16} aria-hidden />
        </a>
        <a data-tour="start-trial" href={START_TRIAL_URL} rel="noreferrer" className={SECONDARY}>
          Start free trial
        </a>
      </div>
    </div>
  );
}

export function TourPlayerView({ name, steps, index, images, onAction }: TourPlayerViewProps) {
  const count = steps.length;
  const atEnd = index >= count;
  const step = atEnd ? null : steps[index];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-4 sm:px-6">
      <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 pb-4">
        <a href="/" className="text-lg font-semibold tracking-tight text-foreground">
          Zensus
        </a>
        <p className="text-sm text-muted-foreground">
          Prepared for <span className="font-semibold text-foreground">{name}</span>
        </p>
      </header>

      <main>
        <h1 className="sr-only">Zensus product tour</h1>
        {step ? (
          <>
            <Screenshot step={step} image={images[step.id]} onNext={() => onAction("next")} />
            <div className="mx-auto mt-4 max-w-3xl text-center" aria-live="polite">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Step {index + 1} of {count}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-foreground sm:text-xl">{step.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">{step.caption}</p>
            </div>
          </>
        ) : (
          <EndScreen />
        )}
      </main>

      <nav
        aria-label="Tour controls"
        className="mx-auto mt-5 flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-3"
      >
        <button type="button" data-tour="back" className={CONTROL} disabled={index === 0} onClick={() => onAction("back")}>
          <ArrowLeft size={16} aria-hidden />
          Back
        </button>
        <Dots count={count} index={index} onAction={onAction} />
        <button type="button" data-tour="next" className={CONTROL} disabled={atEnd} onClick={() => onAction("next")}>
          Next
          <ArrowRight size={16} aria-hidden />
        </button>
        <button type="button" data-tour="restart" className={CONTROL} onClick={() => onAction("restart")}>
          <RotateCcw size={16} aria-hidden />
          Restart
        </button>
      </nav>
    </div>
  );
}
