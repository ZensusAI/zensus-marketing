import { useId, useState } from "react";
import type { BlogFaqItem } from "@/lib/blog";
import { cn } from "@/lib/utils";
import { FOCUS_RING, SQUIRCLE } from "./PostCard";

/**
 * The post's FAQ from meta.faqs (handoff 16-blog-post-template): the first
 * question open, one open at a time. Collapsed answers stay in the HTML,
 * because the FAQPage JSON-LD quotes them and crawlers should find the same
 * words on the page.
 */
export function BlogPostFaq({ items }: { items: BlogFaqItem[] }) {
  const [open, setOpen] = useState(0);
  const base = useId();

  return (
    <section id="faq" aria-labelledby="blog-faq-heading" className="mt-16 min-[760px]:mt-20">
      <h2
        id="blog-faq-heading"
        className="scroll-mt-[136px] text-[26px] font-semibold leading-[1.18] tracking-[-0.03em] text-foreground min-[760px]:text-[32px] min-[1100px]:scroll-mt-28"
      >
        Frequently asked questions
      </h2>
      <div className="mt-5 flex flex-col gap-2.5">
        {items.map((item, i) => {
          const isOpen = i === open;
          const panel = `${base}-a${i}`;
          return (
            <div
              key={item.question}
              className={cn(
                "rounded-[20px] border transition-[border-color,background-color] duration-200",
                SQUIRCLE,
                isOpen ? "border-primary/55 bg-card" : "border-border",
              )}
            >
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panel}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-[20px] px-5 py-[17px] text-left text-base font-semibold leading-[1.4] text-foreground",
                    FOCUS_RING,
                  )}
                >
                  <span>{item.question}</span>
                  <span
                    aria-hidden
                    className={cn(
                      "flex h-6 w-6 flex-none items-center justify-center rounded-full text-[15px] font-normal leading-none transition-[transform,background-color,color] duration-[250ms] motion-reduce:transition-none",
                      isOpen ? "rotate-45 bg-primary text-forest" : "bg-[#F6EBD0] text-sage-dark",
                    )}
                  >
                    +
                  </span>
                </button>
              </h3>
              <div
                id={panel}
                className={cn(
                  "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden" aria-hidden={!isOpen}>
                  <p className="text-pretty px-5 pb-5 text-[16px] leading-[1.65] text-muted-foreground">{item.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
