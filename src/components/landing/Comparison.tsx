import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type { ScrollProgress } from "@/hooks/use-scroll-progress";
import { clamp01, easeInOutCubic as ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { PinnedSection } from "./PinnedSection";

/**
 * Named-competitor comparison (homepage), from handoff 09-comparison (locked
 * 17d): a pinned deck of capability cards (4.2 viewports) beside a scorecard
 * that fills in as each card lands. After the pin: every footnote, the
 * trademark line and the links to the full comparisons.
 *
 * Legal guardrails (researched June 2026, FTC comparative-advertising policy
 * and Lanham Act substantiation):
 * - Competitor names as plain text only, never logos (nominative fair use).
 * - Every cell is sourced from the vendor's own public pages; crosses that
 *   mean "not found on their public pages" carry the asterisk footnote and
 *   read "Not found", never "No". Only double-dagger cells (the vendor's own
 *   page says it does not offer it) read "No". Caveated yeses carry a
 *   dagger or section mark.
 * - Every mark has words, for screen readers and crawlers alike.
 * - The notes date the comparison. Re-verify vendor pages quarterly (last
 *   review: 21 September 2026; next review: December 2026) or when a
 *   competitor ships changes.
 * Per-cell source notes live in docs/comparison-substantiation-2026-09-21.md.
 * Update that file with every change to ROWS.
 */

type Cell = { mark: "yes"; note?: string } | { mark: "no"; footnote?: boolean; symbol?: string } | { mark: "yes-footnote"; symbol: string };

interface Row {
  label: string;
  cells: [Cell, Cell, Cell, Cell]; // Float, Cash Flow Frog, Forecastr, Zensus
}

const COLUMNS = ["Float", "Cash Flow Frog", "Forecastr", "Zensus"] as const;
// The handoff lists Zensus first everywhere it shows vendors.
const ORDER = [3, 0, 1, 2] as const;

const ROWS: Row[] = [
  {
    label: "Live bank feed (Plaid)",
    cells: [{ mark: "no", symbol: "‡" }, { mark: "yes" }, { mark: "no", footnote: true }, { mark: "yes" }],
  },
  {
    label: "Accounting sync",
    cells: [{ mark: "yes" }, { mark: "yes" }, { mark: "yes" }, { mark: "yes" }],
  },
  {
    label: "CRM-aware forecasting",
    cells: [{ mark: "no", footnote: true }, { mark: "no", symbol: "‡" }, { mark: "yes-footnote", symbol: "§" }, { mark: "yes", note: "HubSpot" }],
  },
  {
    label: "Built-in plain-English scenarios",
    cells: [{ mark: "no", footnote: true }, { mark: "yes-footnote", symbol: "†" }, { mark: "yes-footnote", symbol: "§" }, { mark: "yes" }],
  },
  {
    label: "Slack threshold alerts",
    cells: [{ mark: "no", footnote: true }, { mark: "no", footnote: true }, { mark: "no", footnote: true }, { mark: "yes" }],
  },
];

const NOTES: Record<string, string> = {
  "*": "* Not found on the vendor's public pages as of September 2026.",
  "†": "† Through an external AI assistant (Claude, ChatGPT, Copilot, or Gemini), not built in.",
  "‡": "‡ Stated on the vendor's own pages: Float does not connect directly to banks (bank data arrives through the accounting platform), and Cash Flow Frog has no CRM connection (deals can arrive through Zapier).",
  "§": "§ Forecastr lists CRM integrations on its $10,000/year Growth plan, and a built-in AI chatbot whose scope its public pages do not describe.",
};
const NOTE_ORDER = ["*", "†", "‡", "§"];
const TRADEMARKS =
  "Based on publicly available vendor pages, September 2026. Float, Cash Flow Frog, and Forecastr are trademarks of their respective owners; Zensus is not affiliated with or endorsed by them.";

const symbolOf = (cell: Cell) => (cell.mark === "no" ? (cell.symbol ?? (cell.footnote ? "*" : "")) : cell.mark === "yes-footnote" ? cell.symbol : "");

/**
 * What a cell says in words. A cross with "*" is "Not found", never "No",
 * because all it records is that the vendor's public pages did not mention
 * the capability. A plain "No" is kept for the cells the vendor's own page
 * confirms.
 */
function cellText(cell: Cell): string {
  if (cell.mark === "yes") return "Yes";
  if (cell.mark === "yes-footnote") return "Yes, with a caveat";
  return cell.symbol ? "No" : "Not found";
}

const symbolsIn = (row: Row) => NOTE_ORDER.filter((s) => row.cells.some((c) => symbolOf(c) === s));

const Tick = ({ size, className }: { size: number; className?: string }) => (
  <svg aria-hidden width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
    <path d="M4 10.5l4 4 8-9" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Cross = ({ size, className }: { size: number; className?: string }) => (
  <svg aria-hidden width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
    <path d="M5.5 5.5l9 9M14.5 5.5l-9 9" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />
  </svg>
);

const PIN_VIEWPORTS = 4.2;

const Comparison = () => {
  const reduced = usePrefersReducedMotion();
  const [scrollP, setP] = useState(0);
  const onProgress = useCallback(({ progress }: ScrollProgress) => setP(progress), []);

  const p = reduced ? 1 : scrollP;
  const pos = p * 5.4 - 0.2;
  const act = reduced ? -1 : Math.min(4, Math.max(0, Math.floor(pos + 0.4)));
  const enter = ROWS.map((_, i) => (i === 0 ? 1 : ease((pos - i + 0.7) / 0.6)));

  // Scorecard rows jump to their card.
  const jump = (i: number) => {
    const track = document.getElementById("compare");
    if (!track || reduced) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    const f = clamp01((i + 0.25) / 5.4 + 0.04);
    window.scrollTo({ top: top + f * (track.offsetHeight - window.innerHeight), behavior: "smooth" });
  };

  const card = (row: Row, i: number) => {
    const syms = symbolsIn(row);
    return (
      <article
        className="relative flex h-full flex-col overflow-hidden rounded-[20px] border border-border bg-card p-[18px] shadow-[0_-10px_30px_-18px_rgba(26,42,40,.35),0_30px_60px_-36px_rgba(26,42,40,.45)] min-[760px]:p-7"
        aria-labelledby={`compare-cap-${i}`}
      >
        <p className="text-sm font-semibold text-primary">{`Capability 0${i + 1} of 05`}</p>
        <h3 id={`compare-cap-${i}`} className="mt-2.5 text-balance text-[22px] font-bold leading-[1.15] tracking-[-0.02em] text-foreground min-[760px]:text-[30px]">
          {row.label}
        </h3>
        <ul className="mt-4 flex flex-col gap-1.5 min-[760px]:mt-[22px]">
          {ORDER.map((j) => {
            const c = row.cells[j];
            const z = j === 3;
            const sym = symbolOf(c);
            return (
              <li
                key={j}
                className={cn(
                  "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-3 py-[11px] min-[760px]:px-4 min-[760px]:py-[13px]",
                  z ? "bg-forest text-forest-foreground" : "bg-[#F7EFDC] text-foreground",
                )}
              >
                <span className="text-sm font-semibold min-[760px]:text-[15px]">{COLUMNS[j]}</span>
                <span
                  className={cn(
                    "flex items-center gap-2 whitespace-nowrap text-[12.5px] min-[760px]:text-sm",
                    z ? "text-forest-foreground" : c.mark === "no" ? "text-muted-foreground" : "text-foreground",
                  )}
                >
                  {c.mark === "no" ? (
                    <Cross size={16} className="text-[#9AA9A4]" />
                  ) : (
                    <Tick size={18} className={z ? "text-sage-light" : "text-[#22A862]"} />
                  )}
                  {cellText(c)}
                  {c.mark === "yes" && c.note ? ` · ${c.note}` : ""}
                  {sym && <sup className="text-[11px]">{sym}</sup>}
                </span>
              </li>
            );
          })}
        </ul>
        {syms.length > 0 && (
          <div className="mt-4 flex flex-col gap-1 border-t border-rule-soft pt-3">
            {/* Phones point to the notes below the deck; wider screens show
                the notes that apply to this card. */}
            <p className="text-pretty text-xs leading-[1.5] text-muted-foreground min-[760px]:hidden">{`See notes ${syms.join(" ")} below.`}</p>
            {syms.map((s) => (
              <p key={s} className="hidden text-pretty text-xs leading-[1.5] text-muted-foreground min-[760px]:block">
                {NOTES[s]}
              </p>
            ))}
          </div>
        )}
      </article>
    );
  };

  return (
    <>
      <PinnedSection
        id="compare"
        viewports={PIN_VIEWPORTS}
        onProgress={onProgress}
        aria-labelledby="compare-heading"
        className="bg-background"
        stageClassName={reduced ? undefined : "overflow-hidden"}
      >
        <div className="h-full px-5 pb-5 pt-[calc(4rem+28px)] min-[760px]:px-8 min-[760px]:pb-10 min-[760px]:pt-[calc(4rem+52px)]">
          <div
            className={cn(
              "mx-auto grid h-full max-w-6xl content-center items-center gap-5 min-[760px]:content-stretch min-[1024px]:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] min-[1024px]:gap-[72px]",
              reduced && "h-auto items-start",
            )}
          >
            <div className={cn("flex min-w-0 flex-col gap-[18px] min-[760px]:gap-7", reduced && "min-[1024px]:sticky min-[1024px]:top-24")}>
              <div>
                <h2 id="compare-heading" className="text-[30px] font-bold leading-[1.08] tracking-[-0.025em] text-foreground min-[760px]:text-[46px]">
                  How Zensus compares.
                </h2>
                <p className="mt-2.5 text-pretty text-[15px] leading-[1.55] text-muted-foreground min-[760px]:mt-4 min-[760px]:text-lg">
                  Against the tools businesses actually shortlist for cash flow forecasting.
                </p>
              </div>

              {/* Scorecard: the whole comparison as a real table, in words.
                  Hidden below 760px (the deck carries the same answers), still
                  in the HTML for crawlers. */}
              <table className="hidden w-full border-collapse min-[760px]:table" aria-describedby="compare-notes">
                <caption className="sr-only">Capability comparison: Zensus, Float, Cash Flow Frog, and Forecastr</caption>
                <thead>
                  <tr>
                    <th scope="col" className="pb-2 text-left text-[13px] font-semibold text-muted-foreground">
                      Scorecard
                    </th>
                    {ORDER.map((j) => (
                      <th
                        key={j}
                        scope="col"
                        className={cn("w-16 pb-2 text-center text-[11px] font-semibold leading-[1.2]", j === 3 ? "text-sage-dark" : "text-foreground")}
                      >
                        {COLUMNS[j]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row, i) => {
                    const done = reduced || enter[i] > 0.5;
                    const on = i === act;
                    return (
                      <tr key={row.label} onClick={() => jump(i)} className={cn("border-t border-border", !reduced && "cursor-pointer")}>
                        <th scope="row" className="py-[9px] text-left">
                          <span
                            className={cn(
                              "flex items-center gap-2.5 text-[13.5px] leading-[1.3] transition-colors duration-300",
                              on ? "font-semibold text-foreground" : "font-medium text-muted-foreground",
                            )}
                          >
                            <span
                              aria-hidden
                              className={cn("h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300", on ? "bg-primary" : done ? "bg-foreground" : "bg-border")}
                            />
                            {row.label}
                          </span>
                        </th>
                        {ORDER.map((j, q) => {
                          const c = row.cells[j];
                          const sym = symbolOf(c);
                          return (
                            <td key={j} className="py-[9px] text-center">
                              <span
                                className="relative inline-flex items-start justify-center gap-px transition-[opacity,transform] duration-[350ms] ease-out"
                                style={{
                                  opacity: done ? 1 : 0,
                                  transform: `scale(${done ? 1 : 0.4})`,
                                  transitionDelay: done && !reduced ? `${120 + q * 60}ms` : "0ms",
                                }}
                              >
                                {c.mark === "no" ? (
                                  <Cross size={13} className="text-[#9AA9A4]" />
                                ) : (
                                  <Tick size={15} className={j === 3 ? "text-sage-dark" : "text-[#22A862]"} />
                                )}
                                <span className="sr-only">
                                  {c.mark === "yes" && c.note ? `${cellText(c)}: ${c.note}` : sym ? `${cellText(c)} ` : cellText(c)}
                                </span>
                                {sym && <span className="self-start text-[10px] leading-none text-muted-foreground">{sym}</span>}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Phones: the scorecard becomes a five-step rail. */}
              <div aria-hidden className={cn("grid grid-cols-5 gap-1.5 min-[760px]:hidden", reduced && "hidden")}>
                {ROWS.map((row, i) => (
                  <div key={row.label} className="h-0.5 overflow-hidden rounded-sm bg-border">
                    <div className="h-full bg-primary" style={{ width: `${(clamp01(pos - i + 0.7) * 100).toFixed(1)}%` }} />
                  </div>
                ))}
              </div>
            </div>

            {reduced ? (
              // Reduced motion: no stacking, every card in the flow.
              <div className="flex min-w-0 flex-col gap-4">{ROWS.map((row, i) => <div key={row.label}>{card(row, i)}</div>)}</div>
            ) : (
              <div className="relative h-[380px] min-w-0 self-start min-[760px]:h-[532px] min-[760px]:self-end min-[1024px]:self-center">
                {ROWS.map((row, i) => {
                  let depth = 0;
                  for (let j = i + 1; j < ROWS.length; j++) depth += enter[j];
                  const en = enter[i];
                  return (
                    <div
                      key={row.label}
                      aria-hidden={en < 0.5 || depth > 0.5}
                      className="absolute inset-x-0 bottom-0 h-[350px] origin-top will-change-transform min-[760px]:h-[490px]"
                      style={{
                        zIndex: i + 1,
                        opacity: en > 0.001 ? clamp01(1 - Math.max(0, depth - 2.2)) : 0,
                        transform: `translateY(calc(${((1 - en) * 115).toFixed(2)}% - ${(depth * 14).toFixed(1)}px)) scale(${(1 - Math.min(depth, 3) * 0.045).toFixed(4)})`,
                      }}
                    >
                      {card(row, i)}
                      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[20px] bg-background" style={{ opacity: Math.min(0.55, depth * 0.28) }} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </PinnedSection>

      {/* After the pin: every footnote, the trademark line, the full comparisons. */}
      <div className="bg-background px-5 pb-16 min-[760px]:px-8 min-[760px]:pb-24">
        <div id="compare-notes" className="mx-auto max-w-6xl text-left text-xs leading-relaxed text-muted-foreground">
          {NOTE_ORDER.map((s) => (
            <p key={s} className="pt-1 first:pt-0">
              {NOTES[s]}
            </p>
          ))}
          <p className="pt-1">{TRADEMARKS}</p>
        </div>
        <p className="mx-auto mt-6 max-w-6xl text-sm text-muted-foreground">
          Read the full comparisons:{" "}
          <Link to="/compare/zensus-vs-float" className="font-medium text-primary underline-offset-4 hover:underline">
            Zensus vs Float
          </Link>
          ,{" "}
          <Link to="/compare/zensus-vs-pulse" className="font-medium text-primary underline-offset-4 hover:underline">
            Zensus vs Pulse
          </Link>
          ,{" "}
          <Link to="/compare/zensus-vs-cash-flow-frog" className="font-medium text-primary underline-offset-4 hover:underline">
            Zensus vs Cash Flow Frog
          </Link>
          , and{" "}
          <Link to="/compare/float-alternatives" className="font-medium text-primary underline-offset-4 hover:underline">
            Float alternatives
          </Link>
          .
        </p>
      </div>
    </>
  );
};

export default Comparison;
