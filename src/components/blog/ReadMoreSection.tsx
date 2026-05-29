import { Link } from "react-router-dom";
import { formatPostDate, getAllPosts } from "@/lib/blog";
import { cn } from "@/lib/utils";

interface ReadMoreSectionProps {
  currentSlug: string;
  currentTags?: string[];
  limit?: number;
  className?: string;
}

export function ReadMoreSection({
  currentSlug,
  currentTags = [],
  limit = 3,
  className,
}: ReadMoreSectionProps) {
  const others = getAllPosts()
    .filter((post) => post.slug !== currentSlug)
    .map((post) => ({
      ...post,
      overlap: currentTags.filter((t) => post.tags?.includes(t)).length,
    }))
    .sort((a, b) => {
      if (a.overlap !== b.overlap) return b.overlap - a.overlap;
      return b.date.localeCompare(a.date);
    })
    .slice(0, limit);

  if (others.length === 0) return null;

  return (
    <section className={cn("border-t border-border", className)}>
      <div className="py-12">
        <h2 className="mb-8 text-2xl font-semibold tracking-tight">
          Read more
        </h2>
        <div className="flex flex-col gap-6">
          {others.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group grid grid-cols-1 items-start gap-4 rounded-lg border border-transparent p-4 transition-colors hover:border-border hover:bg-card/40 lg:grid-cols-12"
            >
              {post.thumbnail ? (
                <div className="col-span-1 lg:col-span-4">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="aspect-video w-full rounded-lg object-cover transition-opacity group-hover:opacity-90"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div
                  className="col-span-1 flex aspect-video items-center justify-center rounded-lg bg-gradient-to-br from-primary/15 via-background to-primary/5 lg:col-span-4"
                  aria-hidden
                >
                  <span className="font-display text-4xl font-semibold text-foreground/10">
                    Zensus
                  </span>
                </div>
              )}
              <div className="col-span-1 flex flex-col gap-2 lg:col-span-8">
                {post.tags && post.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex h-5 items-center rounded-md border border-border bg-muted/40 px-2 text-[11px] font-medium text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
                <h3 className="line-clamp-2 text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
                  {post.title}
                </h3>
                <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {post.description}
                </p>
                <time className="text-xs font-medium text-muted-foreground">
                  {formatPostDate(post.date)}
                </time>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
