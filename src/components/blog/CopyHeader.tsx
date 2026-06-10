import {
  Children,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function extractText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && "props" in (node as object)) {
    return Children.toArray(
      (node as { props: { children?: ReactNode } }).props.children,
    )
      .map(extractText)
      .join("");
  }
  return "";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

type Level = 2 | 3;
type CopyHeaderProps = ComponentPropsWithoutRef<"h2"> & {
  level?: Level;
};

export function CopyHeader({
  level = 2,
  children,
  className,
  id: forcedId,
  ...rest
}: CopyHeaderProps) {
  const text = extractText(children);
  const id = forcedId ?? slugify(text);
  const HeadingTag = (level === 3 ? "h3" : "h2") as "h2" | "h3";
  const copyOnClick = level === 2;

  const handleClick = async () => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    window.history.pushState({}, "", `#${id}`);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // ignore; clipboard not available
    }
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  if (!copyOnClick) {
    return (
      <HeadingTag id={id} className={cn("scroll-mt-28", className)} {...rest}>
        {children}
      </HeadingTag>
    );
  }

  return (
    <HeadingTag
      id={id}
      onClick={handleClick}
      title="Click to copy link to this section"
      className={cn(
        "group relative flex cursor-pointer scroll-mt-28 items-center gap-2 transition-colors hover:text-primary",
        className,
      )}
      {...rest}
    >
      <span>{children}</span>
      <LinkIcon
        size={16}
        aria-hidden
        className="flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
      />
    </HeadingTag>
  );
}
