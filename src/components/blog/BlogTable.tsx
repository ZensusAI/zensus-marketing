import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/*
 * Table styles from handoff 16-blog-post-template: a card with a warm header
 * row, amounts in mono and right-aligned, a red tint on rows that go negative
 * and a green tint on the row a table builds to. BlogTable uses them, and so
 * do the markdown tables older posts write (see mdx-components.tsx).
 */
export const TABLE_FRAME =
  "not-prose my-9 overflow-x-auto rounded-[24px] border border-border bg-card [corner-shape:squircle]";
export const TABLE = "w-full border-collapse text-left text-[14px] leading-snug min-[760px]:text-[15px]";
export const TABLE_HEAD_ROW = "bg-[#F6EBD0]";
export const TABLE_HEAD_CELL =
  "px-2 py-3 align-bottom text-[12.5px] font-semibold text-muted-foreground first:pl-3.5 last:pr-3.5 min-[760px]:px-3.5 min-[760px]:first:pl-5 min-[760px]:last:pr-5";
export const TABLE_ROW = "border-t border-border text-foreground/90";
export const TABLE_CELL =
  "px-2 py-3 align-top first:pl-3.5 last:pr-3.5 min-[760px]:px-3.5 min-[760px]:first:pl-5 min-[760px]:last:pr-5";
/** Amount cells: digits that line up, kept on one line so a minus sign stays
    with its number. Mono from 760px; phones keep the narrower sans figures so
    a four-column table still fits. */
export const NUMBER_TYPE = "whitespace-nowrap tabular-nums min-[760px]:font-mono min-[760px]:text-[14px]";
export const TABLE_NUMBER = `${NUMBER_TYPE} text-right`;
export const ROW_NEGATIVE = "bg-[oklch(0.95_0.035_40)]";
export const ROW_POSITIVE = "bg-[rgba(34,197,115,.1)]";

/** True for a cell that is only an amount, percentage or count: "$120,000", "−$5,000", "12.5%", "45". */
export const isAmount = (text: string) => /^[−+-]?\$?\d[\d,.]*\s?[%xkKmM]?$/.test(text.trim());

interface BlogTableProps {
  /** Says what the table shows; rendered under it and read as the table's name. */
  caption: string;
  columns: string[];
  /** One array per row. The first cell names the row and becomes its header. */
  rows: ReactNode[][];
  /** Column indexes holding amounts, set in mono and right-aligned. */
  numeric?: number[];
  /** Further column indexes kept on one line, e.g. short dates. */
  nowrap?: number[];
  /** Rows where the cash goes negative (red tint). */
  negativeRows?: number[];
  /** The row the table builds to, e.g. the closing balance (green tint). */
  positiveRows?: number[];
}

/**
 * Data tables for blog MDX. Real thead/th scope markup so screen readers and
 * AI engines read each value against its row and column; the caption names
 * the table. Sized to fit a 360px phone; the frame scrolls only as a fallback.
 */
export function BlogTable({ caption, columns, rows, numeric = [], nowrap = [], negativeRows = [], positiveRows = [] }: BlogTableProps) {
  const captionId = useId();
  const cell = (i: number) => cn(TABLE_CELL, numeric.includes(i) && TABLE_NUMBER, nowrap.includes(i) && "whitespace-nowrap");
  return (
    <figure className="not-prose my-9">
      <div className={cn(TABLE_FRAME, "my-0")}>
        <table className={TABLE} aria-labelledby={captionId}>
          <thead>
            <tr className={TABLE_HEAD_ROW}>
              {columns.map((c, i) => (
                <th key={c} scope="col" className={cn(TABLE_HEAD_CELL, numeric.includes(i) && "text-right")}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr
                key={r}
                className={cn(TABLE_ROW, negativeRows.includes(r) && ROW_NEGATIVE, positiveRows.includes(r) && ROW_POSITIVE)}
              >
                {row.map((value, i) =>
                  i === 0 ? (
                    <th key={i} scope="row" className={cn(cell(i), "font-medium text-foreground")}>
                      {value}
                    </th>
                  ) : (
                    <td key={i} className={cell(i)}>
                      {value}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption id={captionId} className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}
