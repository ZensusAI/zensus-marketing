import { Link } from "react-router-dom";
import { ArrowUpRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime?: string;
  tags?: string[];
  thumbnail?: string;
  showRightBorder?: boolean;
  featured?: boolean;
}

export function BlogCard({
  slug,
  title,
  description,
  date,
  readTime,
  tags,
  thumbnail,
  showRightBorder = true,
  featured = false,
}: BlogCardProps) {
  return (
    <Link
      to={`/blog/${slug}`}
      className={cn(
        "group relative block bg-card transition-colors hover:bg-card/80",
        showRightBorder && "md:border-r border-border",
        "border-b border-border",
        featured && "md:col-span-2 lg:col-span-3",
      )}
    >
      {thumbnail ? (
        <div
          className={cn(
            "relative w-full overflow-hidden",
            featured ? "h-64 md:h-80" : "h-48",
          )}
        >
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      ) : (
        <div
          className={cn(
            "relative flex w-full items-center justify-center overflow-hidden bg-gradient-to-br from-primary/15 via-background to-primary/5",
            featured ? "h-64 md:h-80" : "h-48",
          )}
          aria-hidden
        >
          <span className="font-display text-6xl font-semibold tracking-tight text-foreground/10 md:text-8xl">
            Zensus
          </span>
        </div>
      )}

      <div
        className={cn(
          "flex flex-col gap-3 p-6",
          featured ? "md:p-8" : undefined,
        )}
      >
        {tags && tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex h-6 items-center rounded-md border border-border bg-muted/40 px-2 text-xs font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <h3
          className={cn(
            "text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary",
            featured && "md:text-3xl",
          )}
        >
          {title}
        </h3>

        <p
          className={cn(
            "text-sm leading-relaxed text-muted-foreground",
            featured && "md:text-base",
          )}
        >
          {description}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <time className="font-medium">{date}</time>
          {readTime ? (
            <span className="inline-flex items-center gap-1">
              <Clock size={12} aria-hidden />
              {readTime}
            </span>
          ) : null}
          <span className="ml-auto inline-flex items-center gap-1 text-primary opacity-0 transition-opacity group-hover:opacity-100">
            Read article <ArrowUpRight size={14} aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}
