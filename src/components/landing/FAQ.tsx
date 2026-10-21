import { type ReactNode, useId, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

/*
 * FAQ, from handoff 11-faq (locked 20c): search-first. Typing filters the
 * questions and answers live and highlights the matches; category buttons
 * narrow the list; with a query, one or two remaining results open on their
 * own. Every question and answer stays in the HTML whether it is collapsed
 * or filtered out (filtered items are only hidden), and the FAQPage JSON-LD
 * below is the page's only FAQPage block. Each heading holds only its
 * question (the category tag and the + sit beside it), so extracted headings
 * match the JSON-LD names. Nothing here is scroll-driven, so reduced motion
 * only drops the expand transitions.
 */

const faqGroups = [
  {
    category: "Getting started",
    items: [
      {
        question: "Do I need QuickBooks to use Zensus?",
        answer: "No. You can connect your bank account directly via Plaid, connect QuickBooks, sync your HubSpot subscriptions, or use any combination. No single integration is required to get started.",
      },
      {
        question: "Can I connect my HubSpot account?",
        answer: "Yes. Zensus syncs your HubSpot subscriptions (including annual and quarterly contracts) so your cash flow projections reflect when revenue actually hits your bank, not just flat monthly estimates.",
      },
      {
        question: "How long does setup take?",
        answer: "A few minutes. Connect your bank or QuickBooks with one click, and your cash flow forecast is calculated instantly. No manual data entry.",
      },
    ],
  },
  {
    category: "Product",
    items: [
      {
        question: "What kind of questions can I ask?",
        answer: "Anything about your finances. Examples: \"When will I run out of cash?\", \"Can I afford to hire two engineers?\", \"What if we lose our largest annual contract?\", \"What happens with 5% monthly churn?\", \"What if we switch a client from monthly to annual billing?\"",
      },
      {
        question: "Can I get notified when I'm running low on cash?",
        answer: "Yes. Zensus watches your 30-day projection and sends a Slack alert when a sync shows it dropping below a threshold you set. Alerts are checked after every sync and once a day. It re-alerts on material change (if the breach moves a week earlier or your projected low drops by 10%, at least $1,000), and you can snooze or adjust your threshold directly from Slack.",
      },
      {
        question: "How often does my data update?",
        answer: "Bank transactions from Plaid and invoices and subscriptions from HubSpot arrive by webhook when they change. QuickBooks syncs once a day. Every source also refreshes when you open Zensus if its data is more than an hour old, and you can trigger a manual sync at any time. Your cash flow forecast recalculates after each sync.",
      },
    ],
  },
  {
    category: "Trust and security",
    items: [
      {
        question: "Is my financial data secure?",
        answer: "Yes. All integration tokens are encrypted at rest with AES-256-GCM. Your bank and QuickBooks credentials are never stored on our servers; we rely on OAuth managed by Plaid and Intuit. Every query is isolated by account at the database level, and data sits on encrypted AWS infrastructure.",
      },
      {
        question: "Who can see my data?",
        answer: "Only you. Your financial data is never shared, sold, or used to train AI models. Each account is completely isolated.",
      },
    ],
  },
  {
    category: "Pricing",
    items: [
      {
        question: "How does pricing work?",
        answer: "Zensus Pro is $199 a month, billed monthly, cancel anytime. It includes every integration (Plaid, QuickBooks, HubSpot, Slack), real-time cash flow, scenario modeling, and alerts. Every new account starts with a 14-day free trial. Your card is collected up front but not charged until the trial ends. Cancel anytime before then at no cost. Annual billing is not available yet. Teams that need a tailored setup, custom integrations, or dedicated onboarding can talk to us about Zensus Custom.",
      },
    ],
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqGroups
    .flatMap((g) => g.items)
    .map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
};

const ALL = faqGroups.flatMap((g, gi) =>
  g.items.map((q, qi) => ({ ...q, category: g.category, key: `${gi}-${qi}` })),
);
const CATEGORIES = ["All", ...faqGroups.map((g) => g.category)];

// Splits text around case-insensitive matches of q, marking the matches.
const highlight = (text: string, q: string, markClass: string) => {
  if (!q) return text;
  const lo = text.toLowerCase();
  const ql = q.toLowerCase();
  const out: ReactNode[] = [];
  let i = 0;
  while (i < text.length) {
    const j = lo.indexOf(ql, i);
    if (j < 0) {
      out.push(text.slice(i));
      break;
    }
    if (j > i) out.push(text.slice(i, j));
    out.push(
      <mark key={j} className={cn("rounded-[3px] bg-primary/25", markClass)}>
        {text.slice(j, j + q.length)}
      </mark>,
    );
    i = j + q.length;
  }
  return out;
};

const FAQ = () => {
  const uid = useId();
  // The alert question starts open, as in the handoff.
  const [open, setOpen] = useState<string | null>("1-1");
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  // Results a search opened on its own (one or two left) that the visitor
  // has since closed. Cleared whenever the query changes.
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const onQuery = (q: string) => {
    setQuery(q);
    setDismissed(new Set());
  };

  const ql = query.trim();
  const matches = (q: (typeof ALL)[number]) =>
    (cat === "All" || q.category === cat) && (!ql || `${q.question} ${q.answer}`.toLowerCase().includes(ql.toLowerCase()));
  const count = ALL.filter(matches).length;
  const label = ql ? `${count} result${count === 1 ? "" : "s"} for “${ql}”` : `${count} questions`;

  return (
    <section id="faq" aria-labelledby="faq-heading" className="bg-background px-5 py-[72px] min-[760px]:px-8 min-[760px]:py-28">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>
      <div className="mx-auto max-w-[820px]">
        <div className="text-center">
          <h2 id="faq-heading" className="text-[30px] font-bold leading-[1.08] tracking-[-0.025em] text-foreground min-[760px]:text-[46px]">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-base leading-[1.55] text-muted-foreground min-[760px]:text-lg">Everything you need to know about Zensus.</p>
        </div>

        <div className="relative mt-9">
          <Search aria-hidden className="pointer-events-none absolute left-[18px] top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" strokeWidth={2.25} />
          <input
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            aria-label="Search questions"
            aria-controls={`${uid}-list`}
            placeholder="Search questions, e.g. Slack, HubSpot, pricing"
            className="h-14 w-full rounded-2xl border border-border bg-card pl-[50px] pr-12 text-base text-foreground shadow-[0_18px_40px_-30px_rgba(26,42,40,.45)] outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-search-cancel-button]:appearance-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-[#F1E6CB] text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X aria-hidden className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter by category">
          {CATEGORIES.map((t) => {
            const on = cat === t;
            const n = t === "All" ? ALL.length : ALL.filter((q) => q.category === t).length;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setCat(t)}
                aria-pressed={on}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3.5 py-[7px] text-[13px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  on ? "border-forest bg-forest text-forest-foreground" : "border-border bg-card text-foreground hover:border-primary/60",
                )}
              >
                {t}
                <span className="font-mono text-[10.5px] opacity-70">{n}</span>
              </button>
            );
          })}
        </div>

        <p aria-live="polite" className="mb-2 mt-7 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </p>
        <ul id={`${uid}-list`} className="flex flex-col gap-2.5">
          {ALL.map((q) => {
            const shown = matches(q);
            const auto = !!ql && count <= 2 && !dismissed.has(q.key);
            const on = open === q.key || auto;
            const toggle = () => {
              if (on) {
                if (open === q.key) setOpen(null);
                if (auto) setDismissed((d) => new Set(d).add(q.key));
              } else {
                setOpen(q.key);
              }
            };
            const panel = `${uid}-a-${q.key}`;
            return (
              <li
                key={q.key}
                hidden={!shown}
                className={cn(
                  "rounded-[14px] border bg-card px-5 transition-[border-color,box-shadow] duration-[250ms] motion-reduce:transition-none",
                  on ? "border-primary shadow-[0_18px_40px_-30px_rgba(26,42,40,.45)]" : "border-border",
                )}
              >
                {/* The button's ::before stretches over the whole row, so the
                    tag and the + beside the heading still toggle it. */}
                <div className="relative flex items-center gap-4">
                  <h3 className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={toggle}
                      aria-expanded={on}
                      aria-controls={panel}
                      className="w-full rounded-sm py-[18px] text-left text-base font-medium leading-[1.4] text-foreground before:absolute before:inset-0 before:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {highlight(q.question, ql, "text-inherit")}
                    </button>
                  </h3>
                  <span aria-hidden className="pointer-events-none flex shrink-0 items-center gap-2.5">
                    {cat === "All" && (
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground max-[759px]:hidden">{q.category}</span>
                    )}
                    <span className={cn("text-lg leading-none text-sage-dark transition-transform duration-[250ms] motion-reduce:transition-none", on && "rotate-45")}>
                      +
                    </span>
                  </span>
                </div>
                <div
                  id={panel}
                  className={cn(
                    "grid transition-[grid-template-rows] duration-[350ms] ease-ui motion-reduce:transition-none",
                    on ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="text-pretty pb-[18px] text-[15px] leading-[1.65] text-muted-foreground">
                      {highlight(q.answer, ql, "text-foreground")}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        {count === 0 && <p className="mt-3 text-center text-[15px] text-muted-foreground">No matching questions.</p>}
      </div>
    </section>
  );
};

export default FAQ;
