import { cn } from "@/lib/utils";
import { SQUIRCLE } from "./PostCard";

interface BlogFigureProps {
  src: string;
  alt: string;
  caption?: string;
  /** Intrinsic pixel dimensions. They let the browser reserve the layout box
      before the image loads, preventing CLS. */
  width: number;
  height: number;
}

/** Inline figures for blog MDX (handoff 16-blog-post-template): the reading
    column's full width, radius 24, caption under it in muted 14px. */
export function BlogFigure({ src, alt, caption, width, height }: BlogFigureProps) {
  return (
    <figure className="not-prose my-9 flex w-full flex-col gap-3">
      <div className={cn("overflow-hidden rounded-[24px] border border-border bg-card", SQUIRCLE)}>
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="block h-auto w-full"
          loading="lazy"
          decoding="async"
        />
      </div>
      {caption ? (
        <figcaption className="text-[14px] leading-relaxed text-muted-foreground">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
