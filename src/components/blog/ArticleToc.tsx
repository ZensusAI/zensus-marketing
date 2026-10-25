import { useEffect, useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FOCUS_RING } from "./PostCard";

export interface Section {
  id: string;
  text: string;
}

/** The article and its FAQ: every H2 with an id inside is a section. */
const ARTICLE = "[data-article]";

/** Scroll to a section, leaving room for the sticky bars above it, and put
    its anchor in the URL. */
export function goToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  window.history.pushState({}, "", `#${id}`);
  const offset = parseFloat(getComputedStyle(el).scrollMarginTop) || 112;
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: reduce ? "auto" : "smooth" });
}

/**
 * The article's sections (one per H2, plus the FAQ) and the one being read.
 * A section is current once its heading has scrolled above the top third
 * of the viewport; before the first one, the first section is current.
 * `key` (the post's slug) re-reads the headings when the post changes.
 */
export function useArticleSections(key?: string) {
  const [sections, setSections] = useState<Section[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const found = [...document.querySelectorAll<HTMLHeadingElement>(`${ARTICLE} h2[id]`)].map((el) => ({
      id: el.id,
      text: el.textContent?.trim() ?? "",
    }));
    setSections(found);
  }, [key]);

  useEffect(() => {
    if (sections.length === 0) return;
    let raf = 0;
    const compute = () => {
      raf = 0;
      const line = window.innerHeight / 3;
      let current = sections[0].id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= line) current = s.id;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [sections]);

  return { sections, activeId };
}

type TocProps = ReturnType<typeof useArticleSections>;

/** Desktop rail: 200px, sticky beside the reading column. */
export function TocRail({ sections, activeId }: TocProps) {
  if (sections.length === 0) return null;
  return (
    <nav aria-label="On this page" className="sticky top-[104px] max-h-[calc(100vh-128px)] overflow-y-auto pb-6">
      <p className="mb-3.5 text-[13px] font-semibold text-foreground">On this page</p>
      <ul className="flex flex-col">
        {sections.map((s) => {
          const on = s.id === activeId;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={on ? "location" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  goToSection(s.id);
                }}
                className={cn(
                  "block border-l-2 py-[7px] pl-3.5 text-[13px] leading-[1.4] transition-colors duration-200",
                  FOCUS_RING,
                  on ? "border-primary font-semibold text-foreground" : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {s.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Below 1100px: a bar under the navbar naming the current section, which
    opens the full list. */
export function TocBar({ sections, activeId }: TocProps) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  if (sections.length === 0) return null;
  const current = sections.find((s) => s.id === activeId) ?? sections[0];

  return (
    <div className="sticky top-[calc(4rem+3px+env(safe-area-inset-top))] z-40 border-b border-border bg-background/95 backdrop-blur-[12px] min-[1100px]:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
        className={cn("flex min-h-12 w-full items-center gap-2.5 px-6 text-left min-[760px]:px-12", FOCUS_RING)}
      >
        <span className="flex-none text-[13px] text-muted-foreground">On this page</span>
        <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-foreground">{current.text}</span>
        <ChevronDown
          size={16}
          aria-hidden
          className={cn("flex-none text-muted-foreground transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      <nav id={listId} aria-label="On this page" hidden={!open} className="max-h-[60vh] overflow-y-auto border-t border-border px-6 pb-4 pt-2 min-[760px]:px-12">
        <ul className="flex flex-col">
          {sections.map((s) => {
            const on = s.id === current.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={on ? "location" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(false);
                    goToSection(s.id);
                  }}
                  className={cn(
                    "block border-l-2 py-2.5 pl-3.5 text-[14px] leading-[1.4]",
                    FOCUS_RING,
                    on ? "border-primary font-semibold text-foreground" : "border-border text-muted-foreground",
                  )}
                >
                  {s.text}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

/** The 2px reading line under the navbar: how far through the article you are. */
export function ReadingLine() {
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!el) return;
    const article = document.querySelector<HTMLElement>(ARTICLE);
    if (!article) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = article.getBoundingClientRect();
      const span = r.height - window.innerHeight * 0.6;
      const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 1;
      el.style.transform = `scaleX(${p.toFixed(4)})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [el]);

  return (
    <div
      aria-hidden
      className="fixed left-0 right-0 top-[calc(4rem+1px+env(safe-area-inset-top))] z-40 h-0.5 bg-border"
    >
      <div ref={setEl} className="h-full origin-left scale-x-0 bg-primary" />
    </div>
  );
}
