import { useEffect, useRef, useState, type RefObject } from "react";
import { BarChart3, Bell, Check, MessageCircle } from "lucide-react";
import runwayDrilldownWeekly from "@/assets/runway-drilldown-weekly.png";
import runwayDrilldownDaily from "@/assets/runway-drilldown-daily.png";
import runwayWhatifOverview from "@/assets/runway-whatif-overview.png";
import runwayWhatifMonthly from "@/assets/runway-whatif-monthly.png";
import runwayWhatifWeekly from "@/assets/runway-whatif-weekly.png";
import runwayAlertsA from "@/assets/runway-alerts-a.png";
import runwayAlertsB from "@/assets/runway-alerts-b.png";

type StepDef = {
  eyebrow: string;
  headline: string;
  highlight: string;
  description: string;
  bullets: string[];
  icon: typeof BarChart3;
  images: string[];
  /** width / height ratio of the source screenshots so they fit without crop */
  aspect: string;
};

const STEPS: StepDef[] = [
  {
    eyebrow: "Drill-down",
    headline: "Drill down to",
    highlight: "any week or day",
    description:
      "Click any month to see weekly cash flow, then drill into daily details. Subscription-aware projections show when annual and quarterly contracts actually hit your bank.",
    bullets: [
      "Monthly to weekly to daily drill-down with a single click",
      "Subscription-aware projections for annual and quarterly contracts",
      "See when revenue actually hits your bank, not flat monthly estimates",
    ],
    icon: BarChart3,
    images: [runwayDrilldownWeekly, runwayDrilldownDaily],
    aspect: "16 / 10",
  },
  {
    eyebrow: "Scenarios",
    headline: "Run scenarios with",
    highlight: "your runway agent",
    description:
      "Ask it in plain English: what if our biggest customer pays 30 days late and we hire two engineers? Your agent recalculates runway in real time.",
    bullets: [
      "Stack multiple assumptions (hiring, churn, pricing) in a single conversation",
      "Watch your runway update live as each scenario layer is applied",
      "Compare before-and-after projections and revert any change instantly",
    ],
    icon: MessageCircle,
    images: [runwayWhatifOverview, runwayWhatifMonthly, runwayWhatifWeekly],
    aspect: "2 / 1",
  },
  {
    eyebrow: "Alerts",
    headline: "Get alerted",
    highlight: "before cash runs out",
    description:
      "Set your cash floor. Zensus watches your 30-day projection and pings Slack the moment it crosses the line. If the breach moves earlier or your minimum balance drops 10%, you get re-alerted.",
    bullets: [
      "Threshold-based Slack alerts from your projection, not your balance",
      "Re-alerts on material change (a week earlier or a 10% dip in minimum balance)",
      "Snooze or adjust your threshold from Slack in one click",
    ],
    icon: Bell,
    images: [runwayAlertsA, runwayAlertsB],
    aspect: "4 / 3",
  },
];

function useActiveStep(refs: RefObject<HTMLElement | null>[]) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    refs.forEach((ref, i) => {
      const el = ref.current;
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(i);
        },
        { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [refs]);

  return active;
}

function useSubStateCycle(active: boolean, count: number, intervalMs = 2400) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active || count <= 1) {
      setIndex(0);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [active, count, intervalMs]);

  return index;
}

function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) {
        setProgress(rect.top < 0 ? 1 : 0);
        return;
      }
      const scrolled = Math.max(0, -rect.top);
      setProgress(Math.max(0, Math.min(1, scrolled / total)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(raf);
    };
  }, [ref]);

  return progress;
}

function ProductCanvas({
  activeIndex,
  subStates,
}: {
  activeIndex: number;
  subStates: number[];
}) {
  const flatImages = STEPS.flatMap((step, stepIdx) =>
    step.images.map((src, subIdx) => ({ stepIdx, subIdx, src }))
  );

  return (
    <div className="relative">
      {/* Soft glow under the frame */}
      <div className="pointer-events-none absolute -inset-x-12 -bottom-12 h-40 bg-gradient-to-t from-primary/10 via-primary/5 to-transparent blur-3xl" />

      {/* Browser chrome card */}
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-[hsl(var(--surface-raised))] shadow-2xl shadow-black/50 ring-1 ring-white/5">
        {/* Top bar */}
        <div className="flex items-center gap-3 border-b border-border/60 bg-card/40 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
          </div>
          <div className="flex flex-1 justify-center">
            <div className="rounded-md border border-border/60 bg-background/40 px-3 py-1 font-mono text-[11px] text-muted-foreground">
              app.zensus.app/runway
            </div>
          </div>
          <div className="hidden font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:block">
            Live
          </div>
        </div>

        {/* Canvas surface: aspect resizes per active step to match the source screenshots */}
        <div
          className="relative bg-background/40 transition-[aspect-ratio] duration-500 ease-out"
          style={{ aspectRatio: STEPS[activeIndex]?.aspect ?? "16 / 10" }}
        >
          {/* Grid texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Screenshot stack: one img per (step, sub-state) pair */}
          {flatImages.map(({ stepIdx, subIdx, src }, i) => {
            const stepActive = activeIndex === stepIdx;
            const isActive = stepActive && subStates[stepIdx] === subIdx;
            return (
              <img
                key={`${stepIdx}-${subIdx}`}
                src={src}
                alt={`${STEPS[stepIdx].headline} ${STEPS[stepIdx].highlight}. Zensus runway.`}
                loading={i === 0 ? "eager" : "lazy"}
                width={1600}
                height={1000}
                className={`absolute inset-0 h-full w-full object-contain transition-all duration-700 ease-out ${
                  isActive
                    ? "scale-100 opacity-100"
                    : stepActive
                    ? "scale-[1.02] opacity-0"
                    : activeIndex > stepIdx
                    ? "scale-[1.04] opacity-0"
                    : "scale-[0.98] opacity-0"
                }`}
              />
            );
          })}

          {/* Vignette */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
}

const RunwayFeature = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  const activeIndex = useActiveStep(stepRefs);
  const progress = useScrollProgress(sectionRef);

  const sub0 = useSubStateCycle(activeIndex === 0, STEPS[0].images.length);
  const sub1 = useSubStateCycle(activeIndex === 1, STEPS[1].images.length);
  const sub2 = useSubStateCycle(activeIndex === 2, STEPS[2].images.length);
  const subStates = [sub0, sub1, sub2];

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative overflow-x-clip bg-background"
    >
      {/* Ambient grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      {/* Atmospheric glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[800px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, hsl(var(--primary) / 0.18), transparent 70%)",
        }}
      />

      <div className="section-container relative">
        {/* Header */}
        <div className="mx-auto max-w-3xl pt-24 text-center md:pt-32">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/40 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
            <span className="h-1 w-1 rounded-full bg-primary" />
            The runway product
          </span>
          <h2 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            From the macro view{" "}
            <span className="text-gradient">to the day it hits.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            Three moves, one runway. Project, ask, get pinged. So you never find out about a
            cash crunch from a bank balance.
          </p>
        </div>

        {/* Pinned-scroll body */}
        <div className="mt-20 grid gap-12 pb-32 lg:mt-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-20">
          {/* Text column */}
          <div className="relative">
            {/* Step rail (desktop only) */}
            <div
              className="absolute left-3 top-2 bottom-2 hidden w-px bg-border lg:block"
              aria-hidden
            />
            <div
              className="absolute left-3 top-2 hidden w-px bg-gradient-to-b from-primary via-primary to-primary/0 transition-[height] duration-200 ease-out lg:block"
              style={{ height: `calc(${progress * 100}% - 16px)` }}
              aria-hidden
            />

            {STEPS.map((step, i) => {
              const isActive = activeIndex === i;
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  ref={stepRefs[i]}
                  className="relative flex flex-col justify-start pb-24 lg:min-h-[90vh] lg:justify-center lg:pb-0 lg:pl-14"
                >
                  {/* Rail dot */}
                  <span
                    className={`absolute left-[5px] top-1 hidden h-[10px] w-[10px] rounded-full ring-4 ring-background transition-all duration-500 lg:block ${
                      isActive
                        ? "bg-primary shadow-[0_0_18px_hsl(var(--primary))]"
                        : "bg-border"
                    }`}
                    aria-hidden
                  />

                  {/* Oversized step number */}
                  <span
                    className="pointer-events-none absolute -top-6 right-0 font-display text-[7rem] font-bold leading-none text-primary/[0.06] lg:-top-10 lg:right-auto lg:left-12 lg:text-[10rem]"
                    aria-hidden
                  >
                    0{i + 1}
                  </span>

                  {/* Eyebrow */}
                  <div className="relative mb-5 flex items-center gap-3">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                      {`[ 0${i + 1} ]`}
                    </span>
                    <span className="h-px flex-1 max-w-[24px] bg-border" />
                    <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                      {step.eyebrow}
                    </div>
                  </div>

                  {/* Headline */}
                  <h3 className="relative font-display text-3xl font-bold tracking-tight sm:text-4xl">
                    {step.headline}{" "}
                    <span className="text-gradient">{step.highlight}</span>
                  </h3>

                  {/* Description */}
                  <p className="relative mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
                    {step.description}
                  </p>

                  {/* Bullets */}
                  <ul className="relative mt-7 space-y-3">
                    {step.bullets.map((bullet, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/30">
                          <Check className="h-3 w-3 text-primary" strokeWidth={2.5} />
                        </span>
                        <span className="text-foreground/90">{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Mobile inline canvas: pin its step active so its callouts render */}
                  <div className="mt-10 lg:hidden">
                    <ProductCanvas
                      activeIndex={i}
                      subStates={subStates.map((s, j) => (j === i ? s : 0))}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky canvas (desktop) */}
          <div className="relative hidden lg:block">
            <div className="sticky top-[14vh]">
              <ProductCanvas activeIndex={activeIndex} subStates={subStates} />

              {/* Step indicator under canvas */}
              <div className="mt-6 flex items-center justify-center gap-2">
                {STEPS.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      activeIndex === i
                        ? "w-8 bg-primary"
                        : "w-4 bg-border"
                    }`}
                    aria-hidden
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RunwayFeature;
