import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import FinalCTABand from "@/components/landing/FinalCTABand";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { breadcrumbSchema, faqPageSchema, HOME_CRUMB } from "@/lib/structured-data";

const PAGE_URL = "https://zensus.app/tools/runway-calculator";
const PAGE_TITLE = "Startup Runway Calculator · Zero-Cash Date and Hiring Impact";
const PAGE_DESCRIPTION =
  "Free startup runway calculator: enter cash, revenue, and expenses to get your zero-cash date, then model what a new hire or an annual contract does to it.";

// Fully loaded employee cost vs base salary (payroll taxes, benefits,
// equipment). 1.25x to 1.4x is the common planning range; we use the middle.
const LOADED_COST_MULTIPLIER = 1.3;
const MAX_MONTHS = 48;
const linkCls = "font-medium text-primary underline-offset-4 hover:underline";

const breadcrumbs = breadcrumbSchema([
  HOME_CRUMB,
  { name: "Runway Calculator", url: PAGE_URL },
]);

const FAQS = [
  {
    question: "How do I calculate startup runway?",
    answer:
      "Divide your current cash balance by your monthly net burn (expenses minus revenue). $250,000 in cash with $25,000 of net monthly burn is 10 months of runway. This calculator also projects the calendar date your balance crosses zero, which is the number investors actually ask about.",
  },
  {
    question: "What is a zero-cash date?",
    answer:
      "Your zero-cash date is the calendar date your bank balance hits zero if nothing changes. It is more useful than a month count because it forces payment timing into the math: an annual contract landing in March changes the date, even though it does not change your average burn.",
  },
  {
    question: "What does a new hire really cost?",
    answer:
      "Plan on 1.25x to 1.4x base salary once payroll taxes, benefits, and equipment are included. This calculator uses 1.3x, so a $120,000 hire costs about $13,000 a month of runway, not $10,000.",
  },
  {
    question: "How much runway should a startup have?",
    answer:
      "Current guidance is 18 to 24 months after a raise. Carta's State of Seed data shows the median time from seed to Series A now runs over two years, so a 12-month plan leaves no room for a slow fundraise.",
  },
  {
    question: "Is this calculator accurate for lumpy revenue?",
    answer:
      "A flat monthly average hides timing: an annual contract is one big inflow on one date, not twelve smooth slices. Use the annual contract toggle here for a rough view, then a date-aware cash flow forecast like Zensus when the answer has to be right to the week.",
  },
];

const faqLd = faqPageSchema(FAQS);

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": `${PAGE_URL}#app`,
  name: "Zensus Startup Runway Calculator",
  url: PAGE_URL,
  description: PAGE_DESCRIPTION,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: { "@id": "https://zensus.app/#organization" },
};

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

interface SimulationInput {
  cash: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  monthlyHireCost: number;
  contractAmount: number;
  /** 1-indexed month (from now) the contract payment lands; 0 disables it. */
  contractMonth: number;
}

interface MonthRow {
  index: number;
  inflow: number;
  outflow: number;
  closing: number;
}

interface SimulationResult {
  rows: MonthRow[];
  /** Months until the balance crosses zero, fractional; null if it never does. */
  runwayMonths: number | null;
  zeroCashDate: Date | null;
}

function simulate(input: SimulationInput, startDate: Date): SimulationResult {
  const rows: MonthRow[] = [];
  let balance = input.cash;
  let runwayMonths: number | null = null;

  for (let month = 1; month <= MAX_MONTHS; month += 1) {
    const contractInflow = month === input.contractMonth ? input.contractAmount : 0;
    const inflow = input.monthlyRevenue + contractInflow;
    const outflow = input.monthlyExpenses + input.monthlyHireCost;
    const opening = balance;
    balance = opening + inflow - outflow;

    if (rows.length < 12) {
      rows.push({ index: month, inflow, outflow, closing: balance });
    }
    if (runwayMonths === null && balance <= 0 && opening > 0) {
      const burnedThisMonth = opening - balance;
      const fraction = burnedThisMonth > 0 ? opening / burnedThisMonth : 0;
      runwayMonths = month - 1 + fraction;
    }
    if (runwayMonths !== null && rows.length >= 12) break;
  }

  let zeroCashDate: Date | null = null;
  if (runwayMonths !== null) {
    zeroCashDate = new Date(startDate);
    const wholeMonths = Math.floor(runwayMonths);
    zeroCashDate.setMonth(zeroCashDate.getMonth() + wholeMonths);
    zeroCashDate.setDate(
      zeroCashDate.getDate() + Math.round((runwayMonths - wholeMonths) * 30.4),
    );
  }

  return { rows, runwayMonths, zeroCashDate };
}

const dateFmt = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function NumberField({
  id,
  label,
  value,
  onChange,
  step = 1000,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (next: number) => void;
  step?: number;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        inputMode="numeric"
        min={0}
        step={step}
        value={value}
        onChange={(event) => onChange(Math.max(0, Number(event.target.value) || 0))}
      />
    </div>
  );
}

const RunwayCalculator = () => {
  const [cash, setCash] = useState(250000);
  const [monthlyRevenue, setMonthlyRevenue] = useState(30000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(55000);
  const [hires, setHires] = useState(0);
  const [hireSalary, setHireSalary] = useState(120000);
  const [contractEnabled, setContractEnabled] = useState(false);
  const [contractAmount, setContractAmount] = useState(24000);
  const [contractMonth, setContractMonth] = useState(3);

  const today = useMemo(() => new Date(), []);
  const monthlyHireCost = (hires * hireSalary * LOADED_COST_MULTIPLIER) / 12;

  const base = useMemo(
    () =>
      simulate(
        {
          cash,
          monthlyRevenue,
          monthlyExpenses,
          monthlyHireCost: 0,
          contractAmount: contractEnabled ? contractAmount : 0,
          contractMonth: contractEnabled ? contractMonth : 0,
        },
        today,
      ),
    [cash, monthlyRevenue, monthlyExpenses, contractEnabled, contractAmount, contractMonth, today],
  );

  const withHires = useMemo(
    () =>
      simulate(
        {
          cash,
          monthlyRevenue,
          monthlyExpenses,
          monthlyHireCost,
          contractAmount: contractEnabled ? contractAmount : 0,
          contractMonth: contractEnabled ? contractMonth : 0,
        },
        today,
      ),
    [cash, monthlyRevenue, monthlyExpenses, monthlyHireCost, contractEnabled, contractAmount, contractMonth, today],
  );

  const active = hires > 0 ? withHires : base;
  const netMonthly = monthlyRevenue - monthlyExpenses - monthlyHireCost;
  const monthLabel = (index: number) => {
    const d = new Date(today);
    d.setMonth(d.getMonth() + index);
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{PAGE_TITLE} | Zensus</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:site_name" content="Zensus" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:image" content="https://zensus.app/og/tools-runway-calculator.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Zensus startup runway calculator social preview card" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
        <meta name="twitter:image" content="https://zensus.app/og/tools-runway-calculator.png" />
        <link rel="canonical" href={PAGE_URL} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>
        <script type="application/ld+json">{JSON.stringify(webAppLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="section-container max-w-3xl">
          <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-4">
            Free tool
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            Startup runway calculator
          </h1>
          <p className="text-lg text-muted-foreground mb-10">
            Enter your cash, revenue, and expenses to get your runway and your
            zero-cash date. Then model what a new hire (at fully loaded cost)
            or an annual contract payment does to both.
          </p>

          {/* Inputs */}
          <div className="rounded-2xl border border-border bg-card/50 p-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <NumberField id="cash" label="Cash in the bank" value={cash} onChange={setCash} step={10000} />
              <NumberField id="revenue" label="Monthly revenue" value={monthlyRevenue} onChange={setMonthlyRevenue} step={5000} />
              <NumberField id="expenses" label="Monthly expenses" value={monthlyExpenses} onChange={setMonthlyExpenses} step={5000} />
            </div>

            <div className="mt-6 border-t border-border pt-6">
              <div className="flex items-center justify-between mb-3">
                <Label htmlFor="hires">
                  What if I hire? ({hires} {hires === 1 ? "hire" : "hires"})
                </Label>
                <span className="text-sm text-muted-foreground">
                  {hires > 0
                    ? `${usd.format(monthlyHireCost)} per month fully loaded`
                    : "drag to add hires"}
                </span>
              </div>
              <Slider
                id="hires"
                value={[hires]}
                onValueChange={(next) => setHires(next[0] ?? 0)}
                min={0}
                max={10}
                step={1}
                aria-label="Number of new hires"
              />
              {hires > 0 ? (
                <div className="mt-4 max-w-xs">
                  <NumberField
                    id="salary"
                    label="Base salary per hire"
                    value={hireSalary}
                    onChange={setHireSalary}
                    step={10000}
                  />
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Costed at {LOADED_COST_MULTIPLIER}x base for payroll taxes,
                    benefits, and equipment.
                  </p>
                </div>
              ) : null}
            </div>

            <div className="mt-6 border-t border-border pt-6">
              <div className="flex items-center gap-3">
                <Switch
                  id="contract"
                  checked={contractEnabled}
                  onCheckedChange={setContractEnabled}
                  aria-label="Toggle annual contract payment"
                />
                <Label htmlFor="contract">Annual contract payment lands soon</Label>
              </div>
              {contractEnabled ? (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-md">
                  <NumberField
                    id="contract-amount"
                    label="Contract amount"
                    value={contractAmount}
                    onChange={setContractAmount}
                    step={1000}
                  />
                  <div className="space-y-1.5">
                    <Label htmlFor="contract-month">Lands in month</Label>
                    <Input
                      id="contract-month"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={12}
                      value={contractMonth}
                      onChange={(event) =>
                        setContractMonth(Math.min(12, Math.max(1, Number(event.target.value) || 1)))
                      }
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="rounded-2xl border border-border bg-card/50 p-5">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                Net monthly burn
              </p>
              <p className="text-2xl font-bold tracking-tight">
                {netMonthly >= 0 ? `+${usd.format(netMonthly)}` : usd.format(netMonthly)}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card/50 p-5">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                Runway
              </p>
              <p className="text-2xl font-bold tracking-tight">
                {active.runwayMonths === null
                  ? "48+ months"
                  : `${active.runwayMonths.toFixed(1)} months`}
              </p>
            </div>
            <div className="rounded-2xl border border-primary/40 bg-primary/5 p-5">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                Zero-cash date
              </p>
              <p className="text-2xl font-bold tracking-tight">
                {active.zeroCashDate ? dateFmt.format(active.zeroCashDate) : "None projected"}
              </p>
            </div>
          </div>

          {hires > 0 && base.zeroCashDate && withHires.zeroCashDate ? (
            <p className="text-sm text-muted-foreground mb-8">
              Hiring {hires} at {usd.format(hireSalary)} base moves your
              zero-cash date from {dateFmt.format(base.zeroCashDate)} to{" "}
              {dateFmt.format(withHires.zeroCashDate)}
              {base.runwayMonths !== null && withHires.runwayMonths !== null
                ? ` (${(base.runwayMonths - withHires.runwayMonths).toFixed(1)} months sooner)`
                : ""}
              .
            </p>
          ) : null}

          {/* 12-month projection table */}
          <div className="overflow-x-auto rounded-2xl border border-border mb-12">
            <table className="w-full text-sm">
              <caption className="sr-only">
                Twelve-month cash balance projection
              </caption>
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left">
                  <th className="px-4 py-2.5 font-medium">Month</th>
                  <th className="px-4 py-2.5 font-medium text-right">Inflows</th>
                  <th className="px-4 py-2.5 font-medium text-right">Outflows</th>
                  <th className="px-4 py-2.5 font-medium text-right">Closing balance</th>
                </tr>
              </thead>
              <tbody>
                {active.rows.map((row) => (
                  <tr key={row.index} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-2">{monthLabel(row.index)}</td>
                    <td className="px-4 py-2 text-right">{usd.format(row.inflow)}</td>
                    <td className="px-4 py-2 text-right">{usd.format(row.outflow)}</td>
                    <td
                      className={`px-4 py-2 text-right font-medium ${row.closing < 0 ? "text-destructive" : ""}`}
                    >
                      {usd.format(row.closing)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* How it works */}
          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-foreground">
              How this calculator works
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p className="mb-2 font-medium text-foreground">The math, in plain terms:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Runway is cash divided by net monthly burn (expenses minus revenue).</li>
                <li>
                  The zero-cash date projects your balance month by month and
                  interpolates the day your balance crosses zero.
                </li>
                <li>
                  New hires are costed at {LOADED_COST_MULTIPLIER}x base salary,
                  the common planning multiplier for payroll taxes, benefits,
                  and equipment.
                </li>
                <li>
                  An annual contract is one inflow on one date. That single
                  payment can move your zero-cash date by months without
                  changing your average burn at all.
                </li>
              </ul>
              <p>
                If your revenue and expenses are smooth, this estimate is
                close. If your cash arrives in lumps (annual contracts,
                seasonal spikes, late-paying clients), a monthly average
                misleads: Paul Graham's{" "}
                <a
                  href="https://paulgraham.com/aord.html"
                  className={linkCls}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  default alive or default dead
                </a>{" "}
                question deserves a date-level answer. For the weekly
                discipline, see our guides to{" "}
                <Link to="/blog/what-is-cash-flow-forecasting" className={linkCls}>
                  cash flow forecasting
                </Link>{" "}
                and the{" "}
                <Link to="/blog/what-is-a-13-week-cash-flow-forecast" className={linkCls}>
                  13-week cash flow forecast
                </Link>
                , or check whether{" "}
                <Link to="/blog/will-i-make-payroll" className={linkCls}>
                  you will make payroll
                </Link>
                , learn the 7-day response in{" "}
                <Link to="/blog/what-happens-if-you-miss-payroll" className={linkCls}>
                  what happens if you miss payroll
                </Link>
                , or map your pay dates with the{" "}
                <Link to="/tools/payroll-calendar" className={linkCls}>
                  payroll calendar calculator
                </Link>
                .
              </p>
              <p>
                Zensus answers the same questions with your live financials:
                it connects your bank, QuickBooks, and HubSpot and keeps your
                zero-cash date current as real transactions clear. One plan,{" "}
                <Link to="/pricing" className={linkCls}>
                  $199 per month
                </Link>
                .
              </p>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="border-t border-border pt-10">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-foreground">
              Frequently asked questions
            </h2>
            <dl className="space-y-6">
              {FAQS.map((faq) => (
                <div key={faq.question}>
                  <dt className="font-medium text-foreground mb-1">{faq.question}</dt>
                  <dd className="text-muted-foreground leading-relaxed">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
        <FinalCTABand />
      </main>
      <Footer />
    </div>
  );
};

export default RunwayCalculator;
