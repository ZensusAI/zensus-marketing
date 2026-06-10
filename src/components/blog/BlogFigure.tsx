interface BlogFigureProps {
  src: string;
  alt: string;
  caption?: string;
  /** Intrinsic pixel dimensions. Always pass both: they let the browser
      reserve the layout box before the image loads, preventing CLS. */
  width?: number;
  height?: number;
}

/** Inline figures for blog MDX; rounded clip via overflow-hidden wrapper. */
export function BlogFigure({ src, alt, caption, width, height }: BlogFigureProps) {
  return (
    <figure className="not-prose my-8 flex w-full flex-col items-center">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl sm:max-w-xl">
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="block h-auto w-full max-h-[min(26rem,58vh)] object-contain"
          loading="lazy"
          decoding="async"
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 max-w-lg px-2 text-center text-sm leading-relaxed text-muted-foreground sm:max-w-xl">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
