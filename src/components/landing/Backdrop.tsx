import { cn } from "@/lib/utils";

/**
 * What is left of the "ledger paper" backdrop system after the homepage
 * redesign: the registration mark the hero still draws at the corners of its
 * ruled column. The ruled grid, plotted cells and dot field went with the
 * sections that used them.
 */

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
