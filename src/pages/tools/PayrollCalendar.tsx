import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import FinalCTABand from "@/components/landing/FinalCTABand";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { breadcrumbSchema, faqPageSchema, HOME_CRUMB } from "@/lib/structured-data";
import {
  PAYROLL_27_PERIOD_SOURCE,
  buildPayrollCalendar,
  type PayFrequency,
  type YearSummary,
} from "@/lib/payroll-calendar";

const PAGE_URL = "https://zensus.app/tools/payroll-calendar";
const PAGE_TITLE = "Payroll Calendar Calculator · Pay Periods in 2026 and 2027";
const PAGE_DESCRIPTION =
  "Free payroll calendar calculator: count pay periods in 2026 and 2027, see three-paycheck months, spot a 27-period biweekly year, and model monthly cash impact.";

const linkCls = "font-medium text-primary underline-offset-4 hover:underline";

const breadcrumbs = breadcrumbSchema([
  HOME_CRUMB,
  { name: "Payroll Calendar", url: PAGE_URL },
]);

const FAQS = [
  {
    question: "How many pay periods are in 2026?",
    answer:
      "It depends on pay frequency and your first pay date. Biweekly schedules usually have 26 pay periods in a year, but 2026 can have 27 when your first payday falls on or near January 1. Weekly schedules have 52 or 53. Semimonthly has 24. Monthly has 12. Enter your first pay date above to see your count.",
  },
  {
    question: "Which months have three paychecks in 2026?",
    answer:
      "On a biweekly schedule, most months have two paychecks, but two months each year typically have three because 26 pay periods do not divide evenly across 12 calendar months. This calculator highlights those months and shows the extra cash outflow if you enter an amount per run.",
  },
  {
    question: "Why does 2026 have 27 pay periods for biweekly payroll?",
    answer:
      "Biweekly pay is every 14 days. Over a 365-day calendar year that works out to about 26.07 cycles, so an early-January first payday can produce 27 pay dates that land inside the same calendar year. ADP and other payroll providers document this for 2026 schedules.",
  },
  {
    question: "How does payroll timing affect cash flow forecasting?",
    answer:
      "Spreading annual payroll evenly across 12 months understates cash outflows in three-paycheck months and in 27-period years. Cash flow forecasts need pay dates on the calendar, not a flat monthly average. That is why payroll is often the first line item founders get wrong in a spreadsheet.",
  },
  {
    question: "How do I plan for three-paycheck months?",
    answer:
      "Identify the months with three runs, multiply by your per-payroll cost, and compare to your normal two-paycheck months. Build those spikes into your cash projection before you hire or commit to spend. A rolling 13-week cash flow forecast makes the timing visible week by week.",
  },
];

const faqLd = faqPageSchema(FAQS);

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": `${PAGE_URL}#app`,
  name: "Zensus Payroll Calendar Calculator",
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

const FREQUENCY_LABELS: Record<PayFrequency, string> = {
  weekly: "Weekly",
  biweekly: "Biweekly (every 2 weeks)",
  semimonthly: "Semimonthly (twice per month)",
  monthly: "Monthly",
};

function defaultFirstPayDate(): string {
  return "2026-01-02";
}

function parseInputDate(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function YearTable({ year, amountPerRun }: { year: YearSummary; amountPerRun: number }) {
  if (year.months.length === 0) {
    return (
      <p className="text-sm text-muted-foreground mb-8">
        No pay dates fall in {year.year} for this schedule.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border mb-10">
      <table className="w-full text-sm">
        <caption className="sr-only">
          {year.year} payroll calendar by month with paycheck counts and cash outflow
        </caption>
        <thead>
          <tr className="border-b border-border bg-muted/30 text-left">
            <th className="px-4 py-2.5 font-medium">Month</th>
            <th className="px-4 py-2.5 font-medium">Pay dates</th>
            <th className="px-4 py-2.5 font-medium text-right">Paychecks</th>
            {amountPerRun > 0 ? (
              <th className="px-4 py-2.5 font-medium text-right">Cash outflow</th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {year.months.map((row) => (
            <tr
              key={`${row.year}-${row.month}`}
              className={`border-b border-border/60 last:border-0 ${
                row.isThreePaycheckMonth ? "bg-primary/5" : ""
              }`}
            >
              <td className="px-4 py-2 font-medium">
                {row.monthLabel}
                {row.isThreePaycheckMonth ? (
                  <span className="ml-2 text-xs font-mono uppercase tracking-wide text-primary">
                    3 paychecks
                  </span>
                ) : null}
              </td>
              <td className="px-4 py-2 text-muted-foreground">{row.payDates.join(", ")}</td>
              <td className="px-4 py-2 text-right">{row.paycheckCount}</td>
              {amountPerRun > 0 ? (
                <td className="px-4 py-2 text-right font-medium">
                  {usd.format(row.cashOutflow)}
                  {row.isThreePaycheckMonth && row.paycheckCount > year.normalPaychecksPerMonth ? (
                    <span className="block text-xs font-normal text-muted-foreground">
                      +{usd.format(row.cashOutflow - year.normalPaychecksPerMonth * amountPerRun)}{" "}
                      vs normal month
                    </span>
                  ) : null}
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const PayrollCalendar = () => {
  const [firstPayDate, setFirstPayDate] = useState(defaultFirstPayDate());
  const [frequency, setFrequency] = useState<PayFrequency>("biweekly");
  const [amountPerRun, setAmountPerRun] = useState(21000);

  const result = useMemo(
    () =>
      buildPayrollCalendar({
        firstPayDate: parseInputDate(firstPayDate),
        frequency,
        amountPerRun,
      }),
    [firstPayDate, frequency, amountPerRun],
  );

  const y2026 = result.years.find((y) => y.year === 2026)!;
  const y2027 = result.years.find((y) => y.year === 2027)!;

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
        <meta property="og:image" content="https://zensus.app/og/tools-payroll-calendar.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Zensus payroll calendar calculator social preview card" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
        <meta name="twitter:image" content="https://zensus.app/og/tools-payroll-calendar.png" />
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
            Payroll calendar calculator
          </h1>
          <p className="text-lg text-muted-foreground mb-10">
            How many pay periods in 2026? Which months have three paychecks? Enter your first pay
            date and frequency to see pay periods in 2026 and 2027, spot a 27-period biweekly year,
            and model monthly payroll cash impact.
          </p>

          <div className="rounded-2xl border border-border bg-card/50 p-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="first-pay-date">First pay date (on or after this date)</Label>
                <Input
                  id="first-pay-date"
                  type="date"
                  value={firstPayDate}
                  onChange={(event) => setFirstPayDate(event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="frequency">Pay frequency</Label>
                <Select
                  value={frequency}
                  onValueChange={(value) => setFrequency(value as PayFrequency)}
                >
                  <SelectTrigger id="frequency" aria-label="Pay frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(FREQUENCY_LABELS) as PayFrequency[]).map((key) => (
                      <SelectItem key={key} value={key}>
                        {FREQUENCY_LABELS[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="amount">Amount per payroll run</Label>
                <Input
                  id="amount"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={500}
                  value={amountPerRun}
                  onChange={(event) =>
                    setAmountPerRun(Math.max(0, Number(event.target.value) || 0))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Used to show monthly cash outflow. A $21,000 biweekly run means two-paycheck months
                  cost $42,000 and three-paycheck months cost $63,000.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="rounded-2xl border border-border bg-card/50 p-5">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                Pay periods in 2026
              </p>
              <p className="text-2xl font-bold tracking-tight">{y2026.totalPeriods}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card/50 p-5">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                Pay periods in 2027
              </p>
              <p className="text-2xl font-bold tracking-tight">{y2027.totalPeriods}</p>
            </div>
            <div className="rounded-2xl border border-primary/40 bg-primary/5 p-5">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                Three-paycheck months (2026)
              </p>
              <p className="text-2xl font-bold tracking-tight">
                {frequency === "biweekly" || frequency === "weekly"
                  ? y2026.threePaycheckMonths.length
                  : "N/A"}
              </p>
              {y2026.threePaycheckMonths.length > 0 ? (
                <p className="text-xs text-muted-foreground mt-1">
                  {y2026.threePaycheckMonths.join(", ")}
                </p>
              ) : null}
            </div>
          </div>

          {y2026.is27PeriodYear ? (
            <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5 mb-8 text-sm leading-relaxed">
              <p className="font-medium text-foreground mb-1">27 pay periods in 2026</p>
              <p className="text-muted-foreground">
                Your biweekly schedule lands 27 pay dates inside calendar year 2026. That is rare
                (the next similar year for many schedules is around 2037). Budgeting payroll as
                annual cost divided by 12 will understate cash outflows this year. See{" "}
                <a
                  href={PAYROLL_27_PERIOD_SOURCE.href}
                  className={linkCls}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {PAYROLL_27_PERIOD_SOURCE.label}
                </a>{" "}
                for provider documentation.
              </p>
            </div>
          ) : null}

          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-foreground">2026 calendar</h2>
          <YearTable year={y2026} amountPerRun={amountPerRun} />

          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-foreground">2027 calendar</h2>
          <YearTable year={y2027} amountPerRun={amountPerRun} />

          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-foreground">
              How this calculator works
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p className="mb-2 font-medium text-foreground">The math, in plain terms:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Pay dates are generated from your first pay date forward and backward across 2026
                  and 2027.
                </li>
                <li>
                  Biweekly schedules usually have 26 pay periods, but calendar years with an
                  early-January anchor can have 27.
                </li>
                <li>
                  Even in a 26-period year, two months typically contain three paychecks because pay
                  cycles do not align with calendar months.
                </li>
                <li>
                  Dividing annual payroll by 12 misses those spikes. Cash flow forecasts need actual
                  pay dates on the calendar.
                </li>
              </ul>
              <p>
                For the weekly discipline of knowing whether payroll clears, see{" "}
                <Link to="/blog/will-i-make-payroll" className={linkCls}>
                  Will I Make Payroll?
                </Link>
                {" "}and{" "}
                <Link to="/blog/what-happens-if-you-miss-payroll" className={linkCls}>
                  What Happens If You Miss Payroll?
                </Link>
                , our guide to{" "}
                <Link to="/blog/what-is-cash-flow-forecasting" className={linkCls}>
                  cash flow forecasting
                </Link>
                , and the{" "}
                <Link to="/blog/what-is-a-13-week-cash-flow-forecast" className={linkCls}>
                  13-week cash flow forecast
                </Link>
                . Model runway with the free{" "}
                <Link to="/tools/runway-calculator" className={linkCls}>
                  startup runway calculator
                </Link>
                .
              </p>
              <p>
                Zensus connects your bank, QuickBooks, and HubSpot and keeps payroll and every other
                outflow on the dates they actually hit. One plan,{" "}
                <Link to="/pricing" className={linkCls}>
                  $199 per month
                </Link>
                .
              </p>
            </div>
          </section>

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

export default PayrollCalendar;
