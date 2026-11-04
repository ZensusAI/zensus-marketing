import { Fragment, useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { useStaticPinsOrPrerender } from "@/hooks/use-prefers-reduced-motion";
import type { ScrollProgress } from "@/hooks/use-scroll-progress";
import { EVENTS, track } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";
import { PinnedSection } from "./PinnedSection";

/**
 * Named-competitor comparison (homepage), from handoff 22 (locked 48a desktop,
 * 48b mobile, 4 Nov 2026), replacing 17d. One server-rendered <table>, pinned
 * over six scroll steps: rows 1 to 5 fill one at a time (Zensus first, each
 * cell 90ms after the last), the active row's own footnotes open below it,
 * and step 6 compacts the table and shows every note, the trademark line and
 * the links. Clicking a row jumps to its step. The fill is progressive
 * enhancement: every cell and note is in the HTML on load. useStaticPins
 * (reduced motion, short viewport): the completed table, unpinned.
 *
 * Rows 2 to 5 were renamed to search terms (approved in the handoff, 4 Nov
 * 2026); their cells did not change. "Slack" stays in row 5's name because
 * competitors have generic alerts, so "Not found" only holds for Slack.
 *
 * Legal guardrails (researched June 2026, FTC comparative-advertising policy
 * and Lanham Act substantiation):
 * - Competitor names as plain text only, never logos (nominative fair use).
 * - Every cell is sourced from the vendor's own public pages; crosses that
 *   mean "not found on their public pages" carry the asterisk footnote and
 *   read "Not found", never "No". Only double-dagger cells (the vendor's own
 *   page says it does not offer it) read "No". Caveated yeses carry a
 *   dagger or section mark.
 * - Every mark has words, for screen readers and crawlers alike; the symbols
 *   are aria-hidden.
 * - The notes date the comparison. Re-verify vendor pages quarterly (last
 *   review: 21 September 2026; next review: December 2026) or when a
 *   competitor ships changes, and update "September 2026" in the notes.
 * Per-cell source notes live in docs/comparison-substantiation-2026-09-21.md.
 * Update that file with every change to ROWS.
 */

type Cell = { mark: "yes"; note?: string } | { mark: "no"; footnote?: boolean; symbol?: string } | { mark: "yes-footnote"; symbol: string };

interface Row {
  label: string;
  cells: [Cell, Cell, Cell, Cell]; // Float, Cash Flow Frog, Forecastr, Zensus
}

const COLUMNS = ["Float", "Cash Flow Frog", "Forecastr", "Zensus"] as const;
// Zensus is shown first.
const ORDER = [3, 0, 1, 2] as const;

const ROWS: Row[] = [
  {
    label: "Live bank feed (Plaid)",
    cells: [{ mark: "no", symbol: "‡" }, { mark: "yes" }, { mark: "no", footnote: true }, { mark: "yes" }],
  },
  {
    label: "QuickBooks sync",
    cells: [{ mark: "yes" }, { mark: "yes" }, { mark: "yes" }, { mark: "yes" }],
  },
  {
    label: "HubSpot pipeline in the forecast",
    cells: [{ mark: "no", footnote: true }, { mark: "no", symbol: "‡" }, { mark: "yes-footnote", symbol: "§" }, { mark: "yes", note: "HubSpot" }],
  },
  {
    label: "Scenario planning in plain English",
    cells: [{ mark: "no", footnote: true }, { mark: "yes-footnote", symbol: "†" }, { mark: "yes-footnote", symbol: "§" }, { mark: "yes" }],
  },
  {
    label: "Low-cash alerts in Slack",
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
const NOTE_ID: Record<string, string> = { "*": "compare-note-1", "†": "compare-note-2", "‡": "compare-note-3", "§": "compare-note-4" };
const TRADEMARKS =
  "Based on publicly available vendor pages, September 2026. Float, Cash Flow Frog, and Forecastr are trademarks of their respective owners; Zensus is not affiliated with or endorsed by them.";

// The handoff links Float and Cash Flow Frog; Pulse and Float alternatives stay
// because the homepage must keep linking to them (internal-links.test.ts).
const LINKS = [
  { to: "/compare/zensus-vs-float", label: "Zensus vs Float", vendor: "float" },
  { to: "/compare/zensus-vs-cash-flow-frog", label: "Zensus vs Cash Flow Frog", vendor: "cash_flow_frog" },
  { to: "/compare/zensus-vs-pulse", label: "Zensus vs Pulse", vendor: "pulse" },
  { to: "/compare/float-alternatives", label: "Float alternatives", vendor: "float_alternatives" },
];

const symbolOf = (cell: Cell) => (cell.mark === "no" ? (cell.symbol ?? (cell.footnote ? "*" : "")) : cell.mark === "yes-footnote" ? cell.symbol : "");

/**
 * What a cell says in words. A cross with "*" is "Not found", never "No",
 * because all it records is that the vendor's public pages did not mention
 * the capability. A plain "No" is kept for the cells the vendor's own page
 * confirms.
 */
function cellText(cell: Cell): string {
  if (cell.mark === "yes") return cell.note ? `Yes · ${cell.note}` : "Yes";
  if (cell.mark === "yes-footnote") return "Yes, with a caveat";
  return cell.symbol ? "No" : "Not found";
}

const notesIn = (row: Row) => NOTE_ORDER.filter((s) => row.cells.some((c) => symbolOf(c) === s));

const N_STEPS = ROWS.length + 1;
const PIN_VIEWPORTS = 6;
const ease = "cubic-bezier(.22,1,.36,1)";

// Grid columns for every row: label then the four vendors, from 760px; on
// phones the label takes its own line over four equal columns.
const GRID = "grid grid-cols-4 min-[760px]:grid-cols-[minmax(0,300px)_repeat(4,minmax(0,1fr))]";

type State = "done" | "act" | "fut";

const Comparison = () => {
  const staticPins = useStaticPinsOrPrerender();
  const [pos, setPos] = useState({ s: N_STEPS - 1, p: 1 });
  const viewed = useRef(-1);

  const onProgress = useCallback(({ progress }: ScrollProgress) => {
    const t = Math.min(0.9999, progress) * N_STEPS;
    const s = Math.floor(t);
    // Quantised to the reveal points, so React renders only when one passes.
    const raw = t - s;
    const p = [0.08, 0.17, 0.26, 0.35, 0.4].reduce((acc, m) => (raw >= m ? m : acc), 0);
    setPos((cur) => (cur.s === s && cur.p === p ? cur : { s, p }));
  }, []);

  useEffect(() => {
    if (staticPins || pos.s >= ROWS.length || viewed.current === pos.s) return;
    viewed.current = pos.s;
    track(EVENTS.COMPARE_ROW_VIEW, { row: pos.s + 1 });
  }, [pos, staticPins]);

  const jump = (i: number) => {
    track(EVENTS.COMPARE_ROW_CLICK, { row: i + 1 });
    const el = document.getElementById("compare");
    if (!el || staticPins) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + ((i + 0.6) / N_STEPS) * (el.offsetHeight - window.innerHeight), behavior: "smooth" });
  };

  // Footnote marks. Static, the ids sit on the one visible copy of the notes
  // and the plain anchor works. Pinned, phones show the copy after the pin,
  // which carries no ids, and from 760px the notes stay closed until the last
  // step, so scroll to whichever applies instead.
  const goToNote = (sym: string, ev: MouseEvent) => {
    // The row under the mark has its own click (jump to that row); this one
    // goes to the note instead.
    ev.stopPropagation();
    if (staticPins) return;
    ev.preventDefault();
    const afterPin = document.querySelector<HTMLElement>(`[data-note-after-pin="${NOTE_ID[sym]}"]`);
    if (afterPin && afterPin.getClientRects().length > 0) {
      afterPin.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const el = document.getElementById("compare");
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + el.offsetHeight - window.innerHeight, behavior: "smooth" });
  };

  const pinned = !staticPins;
  const { s, p } = pinned ? pos : { s: N_STEPS - 1, p: 1 };
  const finished = s === N_STEPS - 1;

  const table = (
    // The rows are CSS grids, which drops native table semantics in some
    // browsers, so every part carries its ARIA role explicitly.
    <table
      role="table"
      aria-label="Zensus compared with Float, Cash Flow Frog and Forecastr"
      className="mt-4 block w-full min-[760px]:mt-8 min-[760px]:max-w-[1040px]"
    >
      <thead role="rowgroup" className="block">
        <tr role="row" className={GRID}>
          <th role="columnheader" scope="col" className="hidden h-14 items-end px-5 pb-3.5 text-left text-sm font-semibold text-muted-foreground min-[760px]:flex">
            Capability
          </th>
          {ORDER.map((ci, j) => (
            <th
              key={ci}
              role="columnheader"
              scope="col"
              className={cn(
                "flex h-11 items-end justify-center px-1 pb-2 text-center text-xs font-semibold leading-[1.2] min-[760px]:h-14 min-[760px]:whitespace-nowrap min-[760px]:px-2 min-[760px]:pb-3.5 min-[760px]:text-[15px]",
                j === 0 ? "rounded-t-xl bg-forest text-forest-foreground" : "text-foreground",
              )}
            >
              {COLUMNS[ci]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody role="rowgroup" className="block">
      {ROWS.map((row, i) => {
        const st: State = i < s ? "done" : i === s ? "act" : "fut";
        const act = st === "act";
        const last = i === ROWS.length - 1;
        const notes = notesIn(row);
        const open = pinned && act && notes.length > 0;
        return (
          <Fragment key={row.label}>
            <tr
              role="row"
              className={cn(GRID, "cursor-pointer border-t border-border transition-colors duration-300", act ? "bg-card" : "bg-transparent")}
              onClick={pinned ? () => jump(i) : undefined}
            >
              <th
                role="rowheader"
                scope="row"
                className={cn(
                  "col-span-4 flex items-center gap-3 px-1 pb-0.5 pt-2.5 text-left text-[14.5px] transition-colors duration-300 min-[760px]:col-span-1 min-[760px]:px-5 min-[760px]:py-0 min-[760px]:text-[17px]",
                  act ? "font-[650] text-foreground" : st === "fut" ? "font-medium text-muted-foreground" : "font-medium text-foreground",
                  act ? "min-[760px]:min-h-[60px]" : "min-[760px]:min-h-[52px]",
                )}
              >
                <span aria-hidden className={cn("my-3.5 hidden w-[3px] self-stretch rounded-sm transition-colors duration-300 min-[760px]:block", act ? "bg-primary" : "bg-transparent")} />
                {row.label}
              </th>
              {ORDER.map((ci, j) => {
                const cell = row.cells[ci];
                const z = j === 0;
                const sym = symbolOf(cell);
                const vis = !pinned || st === "done" || (act && p > 0.08 + j * 0.09);
                const no = cell.mark === "no";
                return (
                  <td
                    key={ci}
                    role="cell"
                    className={cn(
                      "flex min-h-[46px] items-center justify-center px-1 text-center transition-[min-height] duration-300 min-[760px]:px-2",
                      act ? "min-[760px]:min-h-[60px]" : "min-[760px]:min-h-[52px]",
                      z && "bg-forest",
                      z && last && !open && "rounded-b-xl",
                    )}
                  >
                    <span
                      className="relative inline-flex flex-col items-center gap-px min-[760px]:flex-row min-[760px]:gap-[7px]"
                      style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(6px)", transition: `opacity .35s, transform .45s ${ease}` } as CSSProperties}
                    >
                      {/* SVG, not a glyph, so the mark is not part of the text. */}
                      <svg
                        aria-hidden
                        viewBox="0 0 20 20"
                        fill="none"
                        className={cn("h-3.5 w-3.5 shrink-0 min-[760px]:h-4 min-[760px]:w-4", z ? "text-sage-light" : no ? "text-[#6F807A]" : "text-[#178A4F]")}
                      >
                        {no ? (
                          <path d="M5.5 5.5l9 9M14.5 5.5l-9 9" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" />
                        ) : (
                          <path d="M4 10.5l4 4 8-9" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
                        )}
                      </svg>
                      <span
                        className={cn(
                          "text-[11.5px] leading-[1.25] min-[760px]:whitespace-nowrap min-[760px]:text-[15px]",
                          z ? "font-semibold text-forest-foreground" : no ? "font-medium text-muted-foreground" : "font-medium text-foreground",
                        )}
                      >
                        {/* The full wording at every width (the handoff shortens it on
                            phones, but two variants would both be in the text). */}
                        {cellText(cell)}
                        {sym && (
                          <>
                            {" "}
                            <sup className="text-[9.5px] min-[760px]:absolute min-[760px]:left-full min-[760px]:top-[-4px] min-[760px]:pl-0.5 min-[760px]:text-[11px]">
                              <a href={`#${NOTE_ID[sym]}`} onClick={(ev) => goToNote(sym, ev)} onMouseDown={(ev) => ev.preventDefault()} aria-hidden tabIndex={-1} className="no-underline">
                                {sym}
                              </a>
                            </sup>
                          </>
                        )}
                      </span>
                    </span>
                  </td>
                );
              })}
            </tr>
            {notes.length > 0 && pinned && (
              // The active row's own notes, a visual aid only: the full notes
              // below the table are the ones assistive tech and crawlers use.
              <tr aria-hidden data-notes className={GRID}>
                <td className="hidden min-[760px]:block" />
                <td
                  className={cn("hidden bg-forest min-[760px]:block", last && "rounded-b-xl")}
                  style={{ maxHeight: open ? 160 : 0, transition: `max-height .45s ${ease}` }}
                />
                <td className="col-span-4 overflow-hidden min-[760px]:col-span-3" style={{ maxHeight: open ? 220 : 0, transition: `max-height .45s ${ease}` }}>
                  <div className="flex flex-col gap-1 px-1 pb-2.5 pt-1.5 min-[760px]:gap-1.5 min-[760px]:px-5 min-[760px]:pb-[18px] min-[760px]:pt-0.5" style={{ opacity: open && p > 0.35 ? 1 : 0, transition: "opacity .4s" }}>
                    {notes.map((n) => (
                      <p key={n} className="text-pretty text-xs leading-[1.4] text-muted-foreground min-[760px]:text-[13.5px] min-[760px]:leading-[1.5]">
                        {NOTES[n]}
                      </p>
                    ))}
                  </div>
                </td>
              </tr>
            )}
          </Fragment>
        );
      })}
      </tbody>
    </table>
  );

  // Pinned, the notes render twice (in the stage from 760px, after the pin on
  // phones; CSS shows one). Only the first copy carries the ids.
  const endBlock = (cls: string, style?: CSSProperties, ids = true) => (
    <div id={ids ? "compare-notes" : undefined} className={cls} style={style}>
      <div className="grid gap-x-10 gap-y-2 min-[760px]:grid-cols-2 min-[760px]:gap-y-1.5">
        {NOTE_ORDER.map((sym) => (
          <p key={sym} id={ids ? NOTE_ID[sym] : undefined} data-note-after-pin={ids ? undefined : NOTE_ID[sym]} className="text-pretty text-[12.5px] leading-[1.5] text-muted-foreground">
            {NOTES[sym]}
          </p>
        ))}
        <p className="text-[12.5px] leading-[1.5] text-muted-foreground min-[760px]:col-span-2 min-[760px]:mt-1">{TRADEMARKS}</p>
      </div>
      <div className="mt-1.5 flex flex-col min-[760px]:flex-row min-[760px]:flex-wrap min-[760px]:gap-x-6">
        {LINKS.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            onClick={() => track(EVENTS.COMPARE_LINK_CLICK, { vendor: l.vendor })}
            className="flex min-h-[44px] items-center self-start rounded-sm text-[15px] font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background min-[760px]:min-h-0 min-[760px]:py-1"
          >
            {l.label} →
          </Link>
        ))}
      </div>
    </div>
  );

  const heading = (
    <>
      <h2
        id="compare-heading"
        className="m-0 text-[30px] font-bold leading-[1.08] tracking-[-0.03em] text-foreground min-[760px]:text-center min-[760px]:text-[46px] min-[760px]:leading-[1.05] min-[760px]:tracking-[-0.035em]"
      >
        How Zensus compares.
      </h2>
      <p className="mt-2 text-[15.5px] leading-[1.5] text-muted-foreground min-[760px]:mt-3 min-[760px]:text-center min-[760px]:text-lg">
        Against the tools businesses actually shortlist for cash flow forecasting.
      </p>
    </>
  );

  if (staticPins) {
    return (
      <section id="compare" aria-labelledby="compare-heading" className="bg-background px-5 py-16 min-[760px]:px-[120px] min-[760px]:py-24">
        <div className="mx-auto flex max-w-[1040px] flex-col min-[760px]:items-center">
          {heading}
          {table}
          <div className="w-full border-t border-border" />
          {endBlock("w-full pt-4")}
        </div>
      </section>
    );
  }

  return (
    <div className="pin-overlap pb-16 min-[760px]:pb-0">
      <PinnedSection
        id="compare"
        viewports={PIN_VIEWPORTS}
        onProgress={onProgress}
        aria-labelledby="compare-heading"
        stageClassName="flex flex-col px-5 pt-[92px] min-[760px]:items-center min-[760px]:justify-center min-[760px]:px-[120px] min-[760px]:py-16"
      >
        <div className="mx-auto flex w-full max-w-[1040px] flex-col min-[760px]:items-center min-[760px]:pt-8">
          {heading}
          {table}
          <div className="w-full border-t border-border" />
          {/* Desktop: the notes open under the table on the last step. */}
          <div
            className="hidden w-full overflow-hidden min-[760px]:block"
            style={{ maxHeight: finished ? 260 : 0, pointerEvents: finished ? "auto" : "none", transition: `max-height .5s ${ease}` }}
            {...(finished ? {} : { inert: "" })}
          >
            {endBlock("pt-4", { opacity: finished ? 1 : 0, transform: finished ? "none" : "translateY(10px)", transition: `opacity .5s, transform .6s ${ease}` })}
          </div>
          <p className="mt-3 text-[13px] text-muted-foreground min-[760px]:hidden" style={{ opacity: finished ? 1 : 0, transition: "opacity .4s" }}>
            Full notes and sources below.
          </p>
        </div>
      </PinnedSection>
      {/* Phones: the notes and links follow the pin. */}
      {endBlock("px-5 pt-2 min-[760px]:hidden", undefined, false)}
    </div>
  );
};

export default Comparison;
