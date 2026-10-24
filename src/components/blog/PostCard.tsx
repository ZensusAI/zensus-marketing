import { Link } from "react-router-dom";
import { formatPostDate, type BlogPostMeta } from "@/lib/blog";
import { cn } from "@/lib/utils";

/** Squircle corners; browsers without `corner-shape` keep the plain radius. */
export const SQUIRCLE = "[corner-shape:squircle]";

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** The post image on a forest ground, 16:10, in a squircle frame. */
export function PostImage({
  post,
  className,
  priority = false,
}: {
  post: BlogPostMeta;
  className?: string;
  /** The one image expected to be the page's largest paint. */
  priority?: boolean;
}) {
  return (
    <div className={cn("aspect-[16/10] overflow-hidden bg-forest", SQUIRCLE, className)}>
      {post.thumbnail ? (
        <img
          src={post.thumbnail}
          alt={post.title}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          className="block h-full w-full object-cover"
        />
      ) : null}
    </div>
  );
}

/**
 * A guide on the blog index (handoff 15-blog card): image, date and read
 * time, title, and the summary clamped to two lines. The whole card is one
 * link; the full summary stays in the HTML under the clamp.
 */
export function PostCard({ post, className }: { post: BlogPostMeta; className?: string }) {
  return (
    <Link to={`/blog/${post.slug}`} className={cn("group flex flex-col gap-[18px] rounded-[26px] text-foreground", FOCUS_RING, className)}>
      <PostImage post={post} className="rounded-[26px] border border-border" />
      <span className="text-[13px] text-muted-foreground">
        {formatPostDate(post.date)} · {post.readTime}
      </span>
      <h3 className="-mt-1 text-pretty text-[19px] font-semibold leading-[1.28] tracking-[-0.015em] transition-colors duration-200 group-hover:text-sage-dark">
        {post.title}
      </h3>
      <p className="-mt-1 line-clamp-2 text-[14.5px] leading-[1.55] text-muted-foreground">{post.description}</p>
    </Link>
  );
}
