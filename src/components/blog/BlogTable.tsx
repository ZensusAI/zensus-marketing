import { cn } from "@/lib/utils";

interface BlogTableProps {
  /** Says what the table shows; rendered under it and read as the table's name. */
  caption: string;
  columns: string[];
  /** One array per row. The first cell names the row and becomes its header. */
  rows: string[][];
  /** Column indexes holding amounts or dates, right-aligned so digits line up. */
  numeric?: number[];
  /** Further column indexes kept on one line, e.g. short dates. */
  nowrap?: number[];
  /** Row index to set in bold, e.g. the low point of a cash walk. */
  highlightRow?: number;
}

/**
 * Data tables for blog MDX. Real thead/th scope markup so screen readers and
 * AI engines read each value against its row and column. Sized to fit a
 * 360px phone without sideways scroll; the wrapper scrolls only as a fallback.
 */
export function BlogTable({ caption, columns, rows, numeric = [], nowrap = [], highlightRow }: BlogTableProps) {
  const align = (i: number) => (numeric.includes(i) ? "text-right" : "text-left");
  // Body amounts never wrap, so a minus sign stays with its number; headers may.
  const cell = (i: number) => cn(align(i), (numeric.includes(i) || nowrap.includes(i)) && "whitespace-nowrap");
  return (
    <div className="not-prose my-8 overflow-x-auto">
      <table className="w-full border-collapse text-[14px] leading-snug tabular-nums sm:text-[15px]">
        <caption className="caption-bottom pt-3 text-left text-sm leading-relaxed text-muted-foreground">{caption}</caption>
        <thead>
          <tr className="border-b-2 border-border">
            {columns.map((c, i) => (
              <th
                key={c}
                scope="col"
                className={cn("pb-2.5 pr-3 align-bottom font-semibold text-foreground last:pr-0 sm:pr-6", align(i))}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr
              key={row[0]}
              className={cn("border-b border-border", r === highlightRow ? "font-semibold text-foreground" : "text-foreground/85")}
            >
              {row.map((value, i) =>
                i === 0 ? (
                  <th key={i} scope="row" className={cn("py-2.5 pr-3 align-top sm:pr-6", r === highlightRow ? "font-semibold" : "font-normal", cell(i))}>
                    {value}
                  </th>
                ) : (
                  <td key={i} className={cn("py-2.5 pr-3 align-top last:pr-0 sm:pr-6", cell(i))}>
                    {value}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
