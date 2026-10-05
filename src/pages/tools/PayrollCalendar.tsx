import { SITE_URL } from "@/lib/constants";
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
import { ToolEmailCapture } from "@/components/tools/ToolEmailCapture";

const PAGE_URL = `${SITE_URL}/tools/payroll-calendar`;
const PAGE_TITLE = "Payroll Calendar Calculator for 2027 (and 2026)";
const PAGE_DESCRIPTION =
  "Free payroll calendar calculator: count pay periods in 2027 and 2026, find three-paycheck months and 27-period biweekly years, and see the cash impact.";

const linkCls = "font-medium text-primary underline-offset-4 hover:underline";

const breadcrumbs = breadcrumbSchema([
  HOME_CRUMB,
  { name: "Payroll Calendar", url: PAGE_URL },
]);

// The date facts below are arithmetic, checked against the calendar: January 1
// and December 31 fall on a Thursday in 2026 and on a Friday in 2027, and a
// biweekly schedule has 27 pay dates in a year only when it pays on both.
const FAQS = [
  {
    question: "How many pay periods are in 2027?",
    answer:
      "It depends on pay frequency and on which dates you pay. Biweekly schedules have 26 pay periods in most years, but 27 in 2027 when one of the paydays is Friday, January 1, 2027. Weekly schedules have 52, or 53 if payday is a Friday. Semimonthly has 24. Monthly has 12. Enter your first pay date above to see your count.",
  },
  {
    question: "Does 2027 have 27 pay periods?",
    answer:
      "For some biweekly schedules, yes. January 1 and December 31, 2027 both fall on a Friday, so a biweekly schedule with a payday on January 1, 2027 has 27 pay dates inside the year. Biweekly schedules that pay on the alternate Fridays, or on another weekday, have 26. If you run the January 1 payroll a day early because New Year's Day is a bank holiday, that pay date lands on Thursday, December 31, 2026, and the 27th pay date moves into 2026 instead.",
  },
  {
    question: "Which months have three paychecks in 2027?",
    answer:
      "It depends on which dates you pay. A biweekly schedule with a payday on Friday, January 1, 2027 has three paydays in January, July, and December 2027. A biweekly schedule that pays on Friday, January 8, 2027 has three in April and October. The calculator above marks the three-paycheck months for your own schedule.",
  },
  {
    question: "How many pay periods are in 2026?",
    answer:
      "It depends on pay frequency and on which dates you pay. Biweekly schedules have 26 pay periods in most years, but 27 in 2026 when one of the paydays is Thursday, January 1, 2026. Weekly schedules have 52, or 53 if payday is a Thursday. Semimonthly has 24. Monthly has 12. Enter your first pay date above to see your count.",
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
  publisher: { "@id": `${SITE_URL}/#organization` },
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

  const emailInputs = useMemo(
    () => ({
      firstPayDate,
      frequency,
      amountPerRun,
    }),
    [firstPayDate, frequency, amountPerRun],
  );

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
        <meta property="og:image" content={`${SITE_URL}/og/tools-payroll-calendar.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Zensus payroll calendar calculator social preview card" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
        <meta name="twitter:image" content={`${SITE_URL}/og/tools-payroll-calendar.png`} />
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
            How many pay periods in 2027? Which months have three paychecks? Enter your first pay
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
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
            {[y2026, y2027].map((y) => (
              <div key={y.year} className="rounded-2xl border border-primary/40 bg-primary/5 p-5">
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                  Three-paycheck months ({y.year})
                </p>
                <p className="text-2xl font-bold tracking-tight">
                  {frequency === "biweekly" || frequency === "weekly"
                    ? y.threePaycheckMonths.length
                    : "N/A"}
                </p>
                {y.threePaycheckMonths.length > 0 ? (
                  <p className="text-xs text-muted-foreground mt-1">
                    {y.threePaycheckMonths.join(", ")}
                  </p>
                ) : null}
              </div>
            ))}
          </div>

          {/* The notice used to exist for 2026 only, so a schedule whose 27th
              pay date falls in 2027 (the default one on this page) showed 27
              in the card above and no explanation. */}
          {[y2026, y2027]
            .filter((y) => y.is27PeriodYear)
            .map((y) => (
              <div
                key={y.year}
                className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5 mb-8 text-sm leading-relaxed"
              >
                <p className="font-medium text-foreground mb-1">27 pay periods in {y.year}</p>
                <p className="text-muted-foreground">
                  Your biweekly schedule lands 27 pay dates inside calendar year {y.year}. For any
                  one schedule that happens about once every 11 years. Budgeting payroll as annual
                  cost divided by 12 will understate cash outflows in {y.year}.
                  {y.year === 2026 ? (
                    <>
                      {" "}
                      See{" "}
                      <a
                        href={PAYROLL_27_PERIOD_SOURCE.href}
                        className={linkCls}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {PAYROLL_27_PERIOD_SOURCE.label}
                      </a>{" "}
                      for provider documentation.
                    </>
                  ) : null}
                </p>
              </div>
            ))}

          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-foreground">2026 calendar</h2>
          <YearTable year={y2026} amountPerRun={amountPerRun} />

          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-foreground">2027 calendar</h2>
          <YearTable year={y2027} amountPerRun={amountPerRun} />

          <ToolEmailCapture tool="payroll" inputs={emailInputs} />

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
                A payday that lands on January 1 is often paid a day early, which moves it into
                the year before.{" "}
                <Link to="/blog/27-pay-periods-2026-2027" className={linkCls}>
                  27 pay periods in 2026 or 2027
                </Link>{" "}
                explains how that one payday decides which year has the extra run.
              </p>
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
                outflow on the dates they actually hit. Zensus Pro is{" "}
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
