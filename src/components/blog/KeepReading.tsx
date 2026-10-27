import { Link } from "react-router-dom";
import { getAllPosts, getTopic, topicPath, type BlogPostMeta } from "@/lib/blog";
import { cn } from "@/lib/utils";
import { FOCUS_RING, PostCard } from "./PostCard";

/**
 * "Keep reading in {Topic}" under a post (handoff 16-blog-post-template):
 * the newest three other posts in the same topic, topped up with the newest
 * posts elsewhere when the topic has fewer. Three cards from 1100px, two
 * from 760px, one on phones; the hidden ones stay in the HTML.
 */
export function KeepReading({ post }: { post: BlogPostMeta }) {
  const topic = getTopic(post.topic);
  const others = getAllPosts().filter((p) => p.slug !== post.slug);
  const sameTopic = others.filter((p) => p.topic === post.topic);
  const shown = [...sameTopic, ...others.filter((p) => p.topic !== post.topic)].slice(0, 3);
  if (!topic || shown.length === 0) return null;
  const inTopic = sameTopic.length + 1;

  return (
    <section aria-labelledby="keep-reading-heading" className="pt-28 min-[760px]:pt-44">
      {/* Wraps so a long topic name ("Tools and integrations") pushes the
          link to its own line on phones instead of past the screen edge. */}
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-b border-border pb-[18px]">
        <h2
          id="keep-reading-heading"
          className="text-balance text-[28px] font-semibold leading-[1.1] tracking-[-0.035em] text-foreground min-[760px]:text-[40px]"
        >
          Keep reading in <span className="whitespace-nowrap">{topic.name}</span>
        </h2>
        <Link
          to={topicPath(topic.id)}
          className={cn(
            "inline-flex min-h-11 flex-none items-center whitespace-nowrap rounded-md px-0.5 text-[14px] text-muted-foreground transition-colors duration-200 hover:text-foreground",
            FOCUS_RING,
          )}
        >
          View all {inTopic}
          <span className="sr-only">&nbsp;{topic.name} guides</span>
          {" →"}
        </Link>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-8 min-[760px]:grid-cols-2 min-[1100px]:grid-cols-3">
        {shown.map((p, i) => (
          <PostCard
            key={p.slug}
            post={p}
            className={cn(i >= 1 && "max-[759px]:hidden", i === 2 && "min-[760px]:max-[1099px]:hidden")}
          />
        ))}
      </div>
    </section>
  );
}
