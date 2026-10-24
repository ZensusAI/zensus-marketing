import { useState } from "react";
import { Link } from "react-router-dom";
import { getTopic, type BlogPostMeta } from "@/lib/blog";
import { cn } from "@/lib/utils";
import { FOCUS_RING, PostImage, SQUIRCLE } from "./PostCard";

/*
 * The blog index's featured carousel: the newest posts, one at a time, in a
 * warm panel. Every slide is rendered and stacked in one grid cell, so all
 * titles and summaries are in the HTML (and the prerender) and the panel
 * keeps the height of the tallest slide. Hidden slides use visibility, which
 * also takes their links out of the tab order.
 */
export function FeaturedCarousel({ posts }: { posts: BlogPostMeta[] }) {
  const [active, setActive] = useState(0);
  const n = posts.length;
  const go = (i: number) => setActive((i + n) % n);

  return (
    <section aria-roledescription="carousel" aria-label="Featured guides" className="px-6 min-[760px]:px-12">
      <div className="mx-auto max-w-[1152px]">
        <div className="grid">
          {posts.map((post, i) => {
            const on = i === active;
            return (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                aria-hidden={!on}
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${n}`}
                className={cn(
                  "grid gap-6 rounded-[38px] bg-[#F6EBD0] p-5 text-foreground [grid-area:1/1] min-[760px]:gap-16 min-[760px]:p-8 min-[1100px]:min-h-[420px] min-[1100px]:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]",
                  SQUIRCLE,
                  FOCUS_RING,
                  !on && "invisible",
                )}
              >
                <div className="flex flex-col justify-center gap-4 px-2 pb-2 pt-3 min-[760px]:px-4 min-[760px]:pb-2 min-[760px]:pt-4 min-[1100px]:py-10 min-[1100px]:pl-11 min-[1100px]:pr-4">
                  <span className="text-sm text-muted-foreground">
                    {getTopic(post.topic)?.name} · {post.readTime}
                  </span>
                  <h2 className="text-balance text-[28px] font-semibold leading-[1.08] tracking-[-0.035em] min-[760px]:text-[34px] min-[1100px]:text-[42px]">
                    {post.title}
                  </h2>
                  <p className="text-pretty text-base leading-[1.55] text-muted-foreground">{post.description}</p>
                  <span className="mt-1.5 text-[14.5px] font-semibold text-sage-dark">Read the guide →</span>
                </div>
                <PostImage post={post} priority={i === 0} className="rounded-[28px]" />
              </Link>
            );
          })}
        </div>

        <div className="mt-9 flex items-center gap-6">
          <div className="grid flex-1 grid-cols-4 gap-2.5">
            {posts.map((post, i) => (
              <button
                key={post.slug}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show ${post.title}`}
                aria-current={i === active}
                className={cn("py-2.5", FOCUS_RING)}
              >
                <span className={cn("block h-0.5 transition-colors duration-200", i === active ? "bg-foreground" : "bg-[#D9C79A]")} />
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {[
              { label: "Previous", glyph: "←", to: active - 1 },
              { label: "Next", glyph: "→", to: active + 1 },
            ].map((b) => (
              <button
                key={b.label}
                type="button"
                onClick={() => go(b.to)}
                aria-label={b.label}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-[17px] transition-colors duration-200 hover:border-foreground",
                  FOCUS_RING,
                )}
              >
                {b.glyph}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
