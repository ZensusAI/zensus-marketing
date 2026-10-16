import { cn } from "@/lib/utils";

/**
 * Zensus backdrop system: "ledger paper".
 *
 * The homepage canvas is cream and the data surfaces are forest. Each gets
 * one texture, in theme tokens only:
 *
 * - Cream surfaces get ruled lines (LedgerGrid), the graph paper a forecast
 *   is drawn on. A few cells can be "plotted" (PlottedCells): dotted cells
 *   are the figures nobody pastes by hand any more, and one sage cell is the
 *   number that matters.
 * - Forest surfaces get dots (DotField), the data points behind the product.
 *
 * Every layer is masked so the middle, where the words sit, stays clear and
 * the texture shows toward the margins (the same move as the grid-and-dot
 * backgrounds at ui.aceternity.com, recoloured for this palette). Layers are
 * aria-hidden and pointer-events-none; they never carry content.
 */

type MaskShape = "clear-center" | "fade-edges" | "fade-bottom" | "none";

const MASKS: Record<MaskShape, string | undefined> = {
  // Hidden behind the centred copy, visible toward the sides.
  "clear-center":
    "radial-gradient(ellipse 60% 64% at 50% 42%, transparent 0%, transparent 20%, black 80%)",
  // Visible in the middle, gone at the edges (for bands behind a frame).
  "fade-edges":
    "radial-gradient(ellipse 85% 85% at 50% 50%, black 35%, transparent 100%)",
  // Full at the top, gone by the bottom.
  "fade-bottom": "linear-gradient(to bottom, black 55%, transparent 100%)",
  none: undefined,
};

function maskStyle(mask: MaskShape) {
  const m = MASKS[mask];
  return m ? { maskImage: m, WebkitMaskImage: m } : {};
}

interface LedgerGridProps {
  /** Cell size in CSS px. The grid is centred, so a cell straddles the middle. */
  cell?: number;
  /** Line alpha on the ink token. */
  strength?: number;
  mask?: MaskShape;
  className?: string;
}

export function LedgerGrid({
  cell = 56,
  strength = 0.07,
  mask = "clear-center",
  className,
}: LedgerGridProps) {
  const line = `hsl(var(--foreground) / ${strength})`;
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage: `linear-gradient(to right, ${line} 1px, transparent 1px), linear-gradient(to bottom, ${line} 1px, transparent 1px)`,
        backgroundSize: `${cell}px ${cell}px`,
        backgroundPosition: "50% 0",
        ...maskStyle(mask),
      }}
    />
  );
}

interface DotFieldProps {
  /** Distance between dots in CSS px. */
  pitch?: number;
  tone?: "forest" | "ink";
  mask?: MaskShape;
  className?: string;
}

export function DotField({
  pitch = 20,
  tone = "forest",
  mask = "fade-edges",
  className,
}: DotFieldProps) {
  const dot =
    tone === "forest"
      ? "hsl(var(--forest-foreground) / 0.16)"
      : "hsl(var(--foreground) / 0.2)";
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage: `radial-gradient(${dot} 1px, transparent 1.6px)`,
        backgroundSize: `${pitch}px ${pitch}px`,
        backgroundPosition: "50% 0",
        ...maskStyle(mask),
      }}
    />
  );
}

export interface PlottedCell {
  /** Columns from the centre cell (negative = left). */
  col: number;
  /** Rows from the top of the grid. */
  row: number;
  tone?: "dots" | "sage";
}

interface PlottedCellsProps {
  cell?: number;
  cells: PlottedCell[];
  className?: string;
}

/**
 * Cells of a LedgerGrid filled in. Must share the grid's `cell` size and sit
 * in the same positioned parent so the fills land exactly on the ruled cells
 * (the grid is centred, so column 0 straddles the middle).
 */
export function PlottedCells({ cell = 56, cells, className }: PlottedCellsProps) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      {cells.map(({ col, row, tone = "dots" }) => (
        <span
          key={`${col}:${row}`}
          className={cn(
            "absolute block",
            tone === "sage" && "bg-primary/[0.14] ring-1 ring-inset ring-primary/30",
          )}
          style={{
            width: cell,
            height: cell,
            top: row * cell,
            left: `calc(50% + ${(col - 0.5) * cell}px)`,
            ...(tone === "dots"
              ? {
                  backgroundImage:
                    "radial-gradient(hsl(var(--foreground) / 0.22) 1px, transparent 1.5px)",
                  backgroundSize: "8px 8px",
                  backgroundPosition: "4px 4px",
                }
              : {}),
          }}
        />
      ))}
    </div>
  );
}

/** Registration mark: a small cross at a corner of a ruled column. */
export function CornerMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute h-[11px] w-[11px]",
        "before:absolute before:left-0 before:top-[5px] before:h-px before:w-full before:bg-foreground/40",
        "after:absolute after:left-[5px] after:top-0 after:h-full after:w-px after:bg-foreground/40",
        className,
      )}
    />
  );
}
