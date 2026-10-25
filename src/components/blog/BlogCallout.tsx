import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import meshInverted960 from "@/assets/hero-mesh-inverted-960.webp";
import { TALK_TO_US_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { SQUIRCLE } from "./PostCard";

interface BlogCalloutProps {
  title?: string;
  children: ReactNode;
}

const BUTTON = cn(
  "blog-button inline-flex h-[42px] items-center rounded-full px-5 text-[14px] font-semibold transition-colors duration-200",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-light focus-visible:ring-offset-2 focus-visible:ring-offset-forest",
);

/**
 * The end-of-post call to action (handoff 16-blog-post-template): forest
 * panel with the hero mesh at 20%, the post's own pitch, then the two next
 * steps every post offers.
 */
export function BlogCallout({ title, children }: BlogCalloutProps) {
  return (
    <aside
      className={cn(
        "blog-callout not-prose relative mt-14 overflow-hidden rounded-[32px] bg-forest px-6 py-7 text-forest-foreground min-[760px]:p-10",
        SQUIRCLE,
      )}
    >
      <img
        src={meshInverted960}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-screen"
      />
      <div className="relative flex flex-col gap-3">
        {title ? (
          <p className="text-[24px] font-semibold leading-[1.2] tracking-[-0.025em] text-forest-foreground">{title}</p>
        ) : null}
        <div className="blog-callout-body text-[16px] leading-[1.65] text-forest-foreground/75">{children}</div>
        <div className="mt-2 flex flex-wrap gap-2.5">
          <a href={TALK_TO_US_URL} className={cn(BUTTON, "bg-primary text-forest hover:bg-sage-light")}>
            Talk to us
          </a>
          <Link to="/pricing" className={cn(BUTTON, "border border-forest-border text-forest-foreground hover:bg-forest-raised")}>
            Explore pricing
          </Link>
        </div>
      </div>
    </aside>
  );
}
