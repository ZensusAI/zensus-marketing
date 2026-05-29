import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  className?: string;
  /** Selector for the article container we should scan for headings. */
  containerSelector?: string;
}

export function TableOfContents({
  className,
  containerSelector = ".blog-article-body",
}: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    const headingElements = container.querySelectorAll("h2");
    const list: Heading[] = [];
    headingElements.forEach((el) => {
      if (el.id) {
        list.push({
          id: el.id,
          text: el.textContent || "",
          level: 2,
        });
      }
    });
    setHeadings(list);
  }, [containerSelector]);

  useEffect(() => {
    if (headings.length === 0) return;

    const computeActive = () => {
      const positions = headings.map((h) => {
        const el = document.getElementById(h.id);
        return {
          id: h.id,
          top: el ? el.getBoundingClientRect().top : Infinity,
        };
      });
      let active = positions.find((p) => p.top >= -50 && p.top <= 120);
      if (!active) {
        const above = positions
          .filter((p) => p.top < -50)
          .sort((a, b) => b.top - a.top);
        active = above[0];
      }
      if (!active) {
        const below = positions
          .filter((p) => p.top > 120)
          .sort((a, b) => a.top - b.top);
        active = below[0];
      }
      if (active && active.id !== activeId) setActiveId(active.id);
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(computeActive);
    };

    computeActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [headings, activeId]);

  const handleClick = async (id: string) => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    window.history.pushState({}, "", `#${id}`);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // best-effort; ignore clipboard failure
    }
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <h4 className="mb-4 text-sm font-semibold text-foreground">
        On this page
      </h4>
      <nav>
        <ul className="space-y-2">
          {headings.map((h) => {
            const active = activeId === h.id;
            return (
              <li key={h.id}>
                <button
                  type="button"
                  onClick={() => handleClick(h.id)}
                  className={cn(
                    "block w-full text-left text-sm leading-snug text-muted-foreground transition-colors hover:text-foreground",
                    active &&
                      "font-medium text-primary underline underline-offset-4",
                  )}
                >
                  {h.text}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
