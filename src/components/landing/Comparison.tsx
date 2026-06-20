import { useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";

/**
 * Named-competitor comparison matrix (homepage).
 *
 * Legal guardrails (researched June 2026, FTC comparative-advertising policy
 * and Lanham Act substantiation):
 * - Competitor names as plain text only, never logos (nominative fair use).
 * - Every cell is sourced from the vendor's own public pages; crosses that
 *   mean "not found on their public pages" carry the asterisk footnote
 *   instead of asserting absence as fact.
 * - The caption dates the comparison. Re-verify vendor pages quarterly
 *   (next review: September 2026) or when a competitor ships changes.
 * Per-cell source notes live in docs/comparison-substantiation-2026-06-07.md
 * (vendor pricing and feature pages for floatapp.com, cashflowfrog.com,
 * forecastr.co). Update that file with every change to ROWS.
 */

type Cell =
  | { mark: "yes"; note?: string }
  | { mark: "no"; footnote?: boolean }
  | { mark: "yes-footnote"; symbol: string };

interface Row {
  label: string;
  cells: [Cell, Cell, Cell, Cell]; // Float, Cash Flow Frog, Forecastr, Zensus
}

const COLUMNS = ["Float", "Cash Flow Frog", "Forecastr", "Zensus"] as const;

const ROWS: Row[] = [
  {
    label: "Live bank feed (Plaid)",
    cells: [
      { mark: "no", footnote: true },
      { mark: "yes" },
      { mark: "no", footnote: true },
      { mark: "yes" },
    ],
  },
  {
    label: "Accounting sync",
    cells: [{ mark: "yes" }, { mark: "yes" }, { mark: "yes" }, { mark: "yes" }],
  },
  {
    label: "CRM-aware forecasting",
    cells: [
      { mark: "no", footnote: true },
      { mark: "no", footnote: true },
      { mark: "no", footnote: true },
      { mark: "yes", note: "HubSpot" },
    ],
  },
  {
    label: "Built-in plain-English scenarios",
    cells: [
      { mark: "no", footnote: true },
      { mark: "yes-footnote", symbol: "†" },
      { mark: "no", footnote: true },
      { mark: "yes" },
    ],
  },
  {
    label: "Slack threshold alerts",
    cells: [
      { mark: "no", footnote: true },
      { mark: "no", footnote: true },
      { mark: "no", footnote: true },
      { mark: "yes" },
    ],
  },
  {
    label: "Transparent self-serve pricing",
    cells: [
      { mark: "yes", note: "from $50/mo" },
      { mark: "yes", note: "from $55/mo" },
      { mark: "no" },
      { mark: "yes", note: "$199/mo flat" },
    ],
  },
];

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

interface CellMarkProps {
  cell: Cell;
  /** Whether the cascade has been triggered (marks pop in top to bottom). */
  landed: boolean;
  /** Per-cell stagger within the cascade. */
  delayMs: number;
  instant: boolean;
}

function CellMark({ cell, landed, delayMs, instant }: CellMarkProps) {
  // Marks scale-pop in once the table scrolls into view, cascading down the
  // rows. Reduced motion renders them in place.
  const reveal = instant
    ? ""
    : `transition-all duration-300 ease-out motion-reduce:transition-none ${
        landed ? "scale-100 opacity-100" : "scale-50 opacity-0"
      }`;
  const style = instant ? undefined : { transitionDelay: `${delayMs}ms` };

  if (cell.mark === "yes") {
    return (
      <span className={`inline-flex flex-col items-center gap-0.5 ${reveal}`} style={style}>
        <Check size={18} strokeWidth={2.5} className="text-primary" aria-label="Yes" />
        {cell.note && (
          <span className="text-[11px] leading-tight text-muted-foreground">{cell.note}</span>
        )}
      </span>
    );
  }
  if (cell.mark === "yes-footnote") {
    return (
      <span className={`inline-flex items-start ${reveal}`} style={style}>
        <Check size={18} strokeWidth={2.5} className="text-primary" aria-label="Yes, with caveat" />
        <span className="text-[11px] text-muted-foreground">{cell.symbol}</span>
      </span>
    );
  }
  return (
    <span className={`inline-flex items-start text-muted-foreground/50 ${reveal}`} style={style}>
      <X size={16} strokeWidth={2} aria-label="No" />
      {cell.footnote && <span className="text-[11px]">*</span>}
    </span>
  );
}

const Comparison = () => {
  const reducedMotion = usePrefersReducedMotion();
  const tableRef = useRef<HTMLDivElement>(null);
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setLanded(true);
      return;
    }
    const el = tableRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLanded(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reducedMotion]);

  return (
  <section id="compare" className="section-padding scroll-mt-28 bg-background">
    <div className="section-container">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
          How Zensus compares.
        </h2>
        <p className="text-lg text-muted-foreground">
          Against the tools businesses actually shortlist for cash flow forecasting.
        </p>
      </div>

      {/* Horizontal scroll on small screens; the matrix needs its width. */}
      <div ref={tableRef} className="mx-auto max-w-4xl overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <caption className="caption-bottom pt-5 text-left text-xs leading-relaxed text-muted-foreground">
            * Not found on the vendor's public pages as of June 2026.{" "}
            <span className="block sm:inline">
              {"†"} Via an external AI connector (ChatGPT or Claude), not built in.
            </span>{" "}
            <span className="block pt-1">
              Based on publicly available vendor pages, June 2026. Float, Cash Flow
              Frog, and Forecastr are trademarks of their respective owners; Zensus
              is not affiliated with or endorsed by them.
            </span>
          </caption>
          <thead>
            <tr>
              <th scope="col" className="w-[30%] pb-3" aria-label="Capability" />
              {COLUMNS.map((name) => (
                <th
                  key={name}
                  scope="col"
                  className={
                    name === "Zensus"
                      ? "rounded-t-lg bg-[hsl(var(--forest))] px-3 py-3 text-center text-[15px] font-semibold text-[hsl(var(--forest-foreground))]"
                      : "px-3 pb-3 pt-3 text-center text-[15px] font-semibold text-foreground"
                  }
                >
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <tr key={row.label} className="border-t border-border">
                <th
                  scope="row"
                  className="py-3.5 pr-4 text-left font-medium text-muted-foreground"
                >
                  {row.label}
                </th>
                {row.cells.map((cell, j) => (
                  <td
                    key={j}
                    className={`px-3 py-3.5 text-center align-middle ${
                      j === 3
                        ? `bg-primary/5 ${i === ROWS.length - 1 ? "rounded-b-lg" : ""}`
                        : ""
                    }`}
                  >
                    {/* Cascade: rows land top to bottom (120ms apart), with a
                        small left-to-right ripple inside each row. */}
                    <CellMark
                      cell={cell}
                      landed={landed}
                      delayMs={i * 120 + j * 45}
                      instant={reducedMotion}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
  );
};

export default Comparison;
