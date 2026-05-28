import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";
import { CopyHeader } from "@/components/blog/CopyHeader";

const linkClass =
  "font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm";

/** Shared MDX element styles for blog posts (also used via MDXProvider). */
export const blogMdxComponents: MDXComponents = {
  h2: ({ children, ...props }: ComponentPropsWithoutRef<"h2">) => (
    <CopyHeader
      level={2}
      className="mb-4 mt-12 border-b border-border/60 pb-2 text-2xl font-semibold tracking-tight text-foreground first:mt-8"
      {...props}
    >
      {children}
    </CopyHeader>
  ),
  h3: ({ children, ...props }: ComponentPropsWithoutRef<"h3">) => (
    <CopyHeader
      level={3}
      className="mb-3 mt-8 text-xl font-semibold tracking-tight text-foreground"
      {...props}
    >
      {children}
    </CopyHeader>
  ),
  p: ({ children, ...props }: ComponentPropsWithoutRef<"p">) => (
    <p
      className="mb-4 text-base leading-7 text-foreground/85 last:mb-0"
      {...props}
    >
      {children}
    </p>
  ),
  ul: ({ children, ...props }: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className="mb-6 list-disc space-y-2 pl-6 text-foreground/85 marker:text-primary/80"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="mb-6 list-decimal space-y-2 pl-6 text-foreground/85 marker:text-foreground/60"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }: ComponentPropsWithoutRef<"li">) => (
    <li className="leading-7 pl-1" {...props}>
      {children}
    </li>
  ),
  a: ({ children, href, ...props }: ComponentPropsWithoutRef<"a">) => (
    <a href={href} className={linkClass} {...props}>
      {children}
    </a>
  ),
  strong: ({ children, ...props }: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-foreground" {...props}>
      {children}
    </strong>
  ),
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...blogMdxComponents,
    ...components,
  };
}
