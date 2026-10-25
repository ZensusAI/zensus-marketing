import type { MDXComponents } from "mdx/types";
import { Children, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { CopyHeader } from "@/components/blog/CopyHeader";
import {
  TABLE,
  TABLE_CELL,
  TABLE_FRAME,
  TABLE_HEAD_CELL,
  TABLE_HEAD_ROW,
  TABLE_NUMBER,
  NUMBER_TYPE,
  isAmount,
} from "@/components/blog/BlogTable";
import { cn } from "@/lib/utils";

const linkClass = "rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary";

const text = (node: ReactNode): string =>
  Children.toArray(node)
    .map((c) => (typeof c === "string" || typeof c === "number" ? String(c) : ""))
    .join("");

type CellProps = ComponentPropsWithoutRef<"td"> & { align?: string };

/** remark-gfm passes a column's alignment as `align` (or a text-align style).
    Only a column the post marks right-aligned (---:) is right-aligned, so its
    header lines up with it; other amounts just get the number type. */
const alignOf = ({ align, style }: CellProps) => align ?? (style?.textAlign as string | undefined);

/*
 * Shared MDX element styles for blog posts (also used via MDXProvider).
 * Only markdown syntax reaches these: the raw <p>, <ul> and <li> most posts
 * write are styled by `.blog-article-body` in index.css (handoff
 * 16-blog-post-template), so paragraph and list type is set there, not here.
 */
export const blogMdxComponents: MDXComponents = {
  h2: ({ children, ...props }: ComponentPropsWithoutRef<"h2">) => (
    <CopyHeader
      level={2}
      className="mb-[18px] mt-16 text-[26px] font-semibold leading-[1.18] tracking-[-0.03em] text-foreground min-[760px]:mt-20 min-[760px]:text-[32px]"
      {...props}
    >
      {children}
    </CopyHeader>
  ),
  h3: ({ children, ...props }: ComponentPropsWithoutRef<"h3">) => (
    <CopyHeader
      level={3}
      className="mb-3.5 mt-10 text-[21px] font-semibold leading-[1.3] tracking-[-0.02em] text-foreground"
      {...props}
    >
      {children}
    </CopyHeader>
  ),
  h4: ({ children, ...props }: ComponentPropsWithoutRef<"h4">) => (
    <h4 className="mb-3 mt-8 text-[18px] font-semibold tracking-[-0.015em] text-foreground" {...props}>
      {children}
    </h4>
  ),
  a: ({ children, href, ...props }: ComponentPropsWithoutRef<"a">) => (
    <a href={href} className={linkClass} {...props}>
      {children}
    </a>
  ),
  table: ({ children, ...props }: ComponentPropsWithoutRef<"table">) => (
    <div className={TABLE_FRAME}>
      <table className={TABLE} {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: ComponentPropsWithoutRef<"thead">) => (
    <thead className={TABLE_HEAD_ROW} {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }: ComponentPropsWithoutRef<"tbody">) => (
    <tbody className="text-foreground/90 [&>tr>td:first-child]:font-medium [&>tr>td:first-child]:text-foreground [&>tr]:border-t [&>tr]:border-border" {...props}>
      {children}
    </tbody>
  ),
  th: ({ children, align, style, ...props }: CellProps) => (
    <th scope="col" className={cn(TABLE_HEAD_CELL, alignOf({ align, style }) === "right" && "text-right")} {...props}>
      {children}
    </th>
  ),
  td: ({ children, align, style, ...props }: CellProps) => {
    const right = alignOf({ align, style }) === "right";
    return (
      <td className={cn(TABLE_CELL, right ? TABLE_NUMBER : isAmount(text(children)) && NUMBER_TYPE)} {...props}>
        {children}
      </td>
    );
  },
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...blogMdxComponents,
    ...components,
  };
}
