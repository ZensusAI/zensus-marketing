import { SITE_URL } from "@/lib/constants";
import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import FinalCTABand from "@/components/landing/FinalCTABand";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  BANK_HOLIDAY_SOURCE,
  CALENDAR_YEARS,
  FEDERAL_RESERVE_HOLIDAYS,
  PAYROLL_27_PERIOD_SOURCE,
  STANDARD_SCHEDULES,
  buildPayrollCalendar,
  buildStandardSchedule,
  nextPaydayStatus,
  payrollCalendarCsv,
  payrollCalendarIcs,
  type PayFrequency,
  type YearSummary,
} from "@/lib/payroll-calendar";
import { ToolEmailCapture } from "@/components/tools/ToolEmailCapture";

const PAGE_URL = `${SITE_URL}/tools/payroll-calendar`;
const PAGE_TITLE = "2027 Payroll Calendar and Pay Period Calculator";
const PAGE_DESCRIPTION =
  "Every 2027 pay date for biweekly, weekly, semimonthly and monthly payroll, moved off bank holidays: 26 or 27 pay periods, three-paycheck months, CSV and ICS.";

const linkCls = "font-medium text-primary underline-offset-4 hover:underline";

const breadcrumbs = breadcrumbSchema([
  HOME_CRUMB,
  { name: "Payroll Calendar", url: PAGE_URL },
]);

// The date facts below are arithmetic, checked against the calendar in
// payroll-calendar.test.ts: January 1 and December 31 fall on a Thursday in
// 2026 and on a Friday in 2027, and a biweekly schedule has 27 pay dates in a
// year only when it pays on both. The holiday list is the Federal Reserve's.
const FAQS = [
  {
    question: "How many pay periods are in 2027?",
    answer:
      "It depends on pay frequency and on which dates you pay. Biweekly schedules have 26 pay periods in most years, but 27 in 2027 when one of the paydays is Friday, January 1, 2027. Weekly schedules have 52, or 53 if payday is a Friday. Semimonthly has 24. Monthly has 12. Enter any payday on your schedule above to see your count.",
  },
  {
    question: "Does 2027 have 27 pay periods?",
    answer:
      "For some biweekly schedules, yes. January 1 and December 31, 2027 both fall on a Friday, so a biweekly schedule with a payday on January 1, 2027 has 27 pay dates inside the year. Biweekly schedules that pay on the alternate Fridays, or on another weekday, have 26. If you run the January 1 payroll a day early because New Year's Day is a bank holiday, that pay date lands on Thursday, December 31, 2026, and the 27th pay date moves into 2026 instead.",
  },
  {
    question: "Which 2027 paydays move because of bank holidays?",
    answer:
      "Paydays settle through ACH, which follows the Federal Reserve holiday schedule. In 2027 the banks close on Friday, January 1; Monday, January 18; Monday, February 15; Monday, May 31; Monday, July 5; Monday, September 6; Monday, October 11; Thursday, November 11; and Thursday, November 25. Juneteenth and Christmas fall on Saturdays in 2027, so Friday, June 18 and Friday, December 24 are banking days, though employers that observe those Fridays pay a day earlier. A payday on a closed day or a weekend is paid on the previous banking day, which is why a Friday, January 1, 2027 payday is usually paid on Thursday, December 31, 2026.",
  },
  {
    question: "Which months have three paychecks in 2027?",
    answer:
      "It depends on which dates you pay. A biweekly schedule with a payday on Friday, January 1, 2027 has three paydays in January, July, and December 2027. A biweekly schedule that pays on Friday, January 8, 2027 has three in April and October. The calculator above marks the three-paycheck months for your own schedule.",
  },
  {
    question: "When does a pay period start and end?",
    answer:
      "For weekly and biweekly payroll the period is the 7 or 14 days before payday. Many employers add a lag of a few days to a week between the period end and the pay date so hours can be approved; set that lag above to match your calendar. Semimonthly periods run from the 1st to the 15th and from the 16th to the last day of the month. Monthly periods are the calendar month.",
  },
  {
    question: "Can I download the 2027 payroll calendar?",
    answer:
      "Yes. Download CSV gives one row per payday for 2026 and 2027 with the period start, period end, scheduled date and paid date, for Excel or Google Sheets. Add to calendar gives an ICS file that imports into Google Calendar, Outlook and Apple Calendar as all-day payday events. Print gives a printable version of the tables.",
  },
  {
    question: "How many pay periods are in 2026?",
    answer:
      "It depends on pay frequency and on which dates you pay. Biweekly schedules have 26 pay periods in most years, but 27 in 2026 when one of the paydays is Thursday, January 1, 2026. Weekly schedules have 52, or 53 if payday is a Thursday. Semimonthly has 24. Monthly has 12. Enter any payday on your schedule above to see your count.",
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
  name: "Zensus 2027 Payroll Calendar and Pay Period Calculator",
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

// The common schedules, computed once: they are plain text on the page so the
// 2027 dates are readable without touching the calculator.
const STANDARD = STANDARD_SCHEDULES.map((schedule) => ({
  schedule,
  result: buildStandardSchedule(schedule),
}));

const dayLong = (date: Date) => format(date, "EEE, MMM d, yyyy");
const dayShort = (date: Date) => format(date, "MMM d");

function defaultFirstPayDate(): string {
  return "2027-01-08";
}

function parseInputDate(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function downloadText(filename: string, mime: string, text: string) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
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
    <div className="overflow-x-auto rounded-2xl border border-border mb-4">
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

function PayDateTable({ year, forceOpen }: { year: YearSummary; forceOpen: boolean }) {
  if (year.payDates.length === 0) return null;

  return (
    <details
      className="rounded-2xl border border-border mb-10 open:bg-card/30"
      open={forceOpen ? true : undefined}
    >
      <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-foreground">
        All {year.totalPeriods} pay dates in {year.year}, with period start and end
      </summary>
      <div className="overflow-x-auto border-t border-border">
        <table className="w-full text-sm">
          <caption className="sr-only">
            Every {year.year} payday with its pay period start and end dates
          </caption>
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left">
              <th className="px-4 py-2.5 font-medium">#</th>
              <th className="px-4 py-2.5 font-medium">Pay period</th>
              <th className="px-4 py-2.5 font-medium">Payday</th>
            </tr>
          </thead>
          <tbody>
            {year.payDates.map((d) => (
              <tr key={d.number} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-2 text-muted-foreground">{d.number}</td>
                <td className="px-4 py-2 text-muted-foreground">
                  {dayShort(d.periodStart)} to {format(d.periodEnd, "MMM d, yyyy")}
                </td>
                <td className="px-4 py-2 font-medium">
                  {dayLong(d.paid)}
                  {d.movedReason ? (
                    <span className="block text-xs font-normal text-muted-foreground">
                      moved from {dayShort(d.scheduled)} ({d.movedReason})
                    </span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

const PayrollCalendar = () => {
  const [firstPayDate, setFirstPayDate] = useState(defaultFirstPayDate());
  const [frequency, setFrequency] = useState<PayFrequency>("biweekly");
  const [amountPerRun, setAmountPerRun] = useState(21000);
  const [lagDays, setLagDays] = useState(0);
  const [adjust, setAdjust] = useState(true);
  const [printing, setPrinting] = useState(false);

  const result = useMemo(
    () =>
      buildPayrollCalendar({
        firstPayDate: parseInputDate(firstPayDate),
        frequency,
        amountPerRun,
        adjustForBankHolidays: adjust,
        lagDays,
      }),
    [firstPayDate, frequency, amountPerRun, adjust, lagDays],
  );

  const y2026 = result.years.find((y) => y.year === 2026)!;
  const y2027 = result.years.find((y) => y.year === 2027)!;
  const status = useMemo(() => nextPaydayStatus(result, new Date()), [result]);
  const showLag = frequency === "weekly" || frequency === "biweekly";

  const emailInputs = useMemo(
    () => ({
      firstPayDate,
      frequency,
      amountPerRun,
      lagDays,
      adjustForBankHolidays: adjust,
    }),
    [firstPayDate, frequency, amountPerRun, lagDays, adjust],
  );

  const fileBase = `zensus-payroll-calendar-2026-2027-${frequency}`;
  const downloadCsv = () =>
    downloadText(`${fileBase}.csv`, "text/csv;charset=utf-8", payrollCalendarCsv(result));
  const downloadIcs = () =>
    downloadText(`${fileBase}.ics`, "text/calendar;charset=utf-8", payrollCalendarIcs(result));
  const printPage = () => {
    setPrinting(true);
    window.addEventListener("afterprint", () => setPrinting(false), { once: true });
    window.setTimeout(() => window.print(), 50);
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
        <meta property="og:image" content={`${SITE_URL}/og/tools-payroll-calendar.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Zensus 2027 payroll calendar social preview card" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
        <meta name="twitter:image" content={`${SITE_URL}/og/tools-payroll-calendar.png`} />
        <link rel="canonical" href={PAGE_URL} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>
        <script type="application/ld+json">{JSON.stringify(webAppLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>
      <div className="print:hidden">
        <Navbar />
      </div>
      <main className="pt-24 pb-16 print:pt-4">
        <div className="section-container max-w-3xl">
          <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-4">
            Free tool
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            2027 payroll calendar and pay period calculator
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Every pay date in 2027 and 2026 for your schedule. Enter any payday and your pay
            frequency to get period start and end dates, paydays moved off weekends and bank
            holidays, 26 or 27 pay periods, three-paycheck months and the monthly cash impact.
            Download it as a CSV, add it to your calendar, or print it.
          </p>

          {status ? (
            <p className="rounded-2xl border border-primary/30 bg-primary/5 px-5 py-4 text-sm leading-relaxed mb-8">
              <span className="font-medium text-foreground">
                Next payday: {dayLong(status.nextPayDate)}.
              </span>{" "}
              Pay period {status.periodNumber} of {status.totalInYear} in {status.year},{" "}
              {status.remainingInYear} {status.remainingInYear === 1 ? "payday" : "paydays"} left
              this year on the schedule below. Change the payday and frequency to match yours.
            </p>
          ) : null}

          <div className="rounded-2xl border border-border bg-card/50 p-6 mb-6 print:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="first-pay-date">Any payday on your schedule</Label>
                <Input
                  id="first-pay-date"
                  type="date"
                  value={firstPayDate}
                  onChange={(event) => setFirstPayDate(event.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  The calendar is built backward and forward from this date across 2026 and 2027.
                </p>
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
              <div className="space-y-1.5">
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
              {showLag ? (
                <div className="space-y-1.5">
                  <Label htmlFor="lag">Days from period end to payday</Label>
                  <Input
                    id="lag"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={30}
                    value={lagDays}
                    onChange={(event) =>
                      setLagDays(Math.min(30, Math.max(0, Number(event.target.value) || 0)))
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    0 means the pay period ends on payday. Many employers pay 5 to 7 days after
                    the period ends so hours can be approved.
                  </p>
                </div>
              ) : null}
              <div className="flex items-start gap-3 sm:col-span-2">
                <Checkbox
                  id="adjust"
                  checked={adjust}
                  onCheckedChange={(value) => setAdjust(value === true)}
                  className="mt-0.5"
                />
                <div className="space-y-1">
                  <Label htmlFor="adjust">Move paydays off weekends and bank holidays</Label>
                  <p className="text-xs text-muted-foreground">
                    A payday on a weekend or a Federal Reserve holiday is paid on the previous
                    banking day, which is when ACH settles. The holidays are listed below.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-2 print:hidden">
            <Button type="button" variant="outline" onClick={downloadCsv}>
              Download CSV
            </Button>
            <Button type="button" variant="outline" onClick={downloadIcs}>
              Add to calendar (.ics)
            </Button>
            <Button type="button" variant="outline" onClick={printPage}>
              Print
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mb-8 print:hidden">
            The CSV opens in Excel or Google Sheets, one row per payday with period start and end.
            The ICS file adds every payday to Google Calendar, Outlook or Apple Calendar.
          </p>

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

          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-foreground">
            2026 payroll calendar
          </h2>
          <YearTable year={y2026} amountPerRun={amountPerRun} />
          <PayDateTable year={y2026} forceOpen={printing} />

          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-foreground">
            2027 payroll calendar
          </h2>
          <YearTable year={y2027} amountPerRun={amountPerRun} />
          <PayDateTable year={y2027} forceOpen={printing} />

          <div className="print:hidden">
            <ToolEmailCapture tool="payroll" inputs={emailInputs} />
          </div>

          <section id="2027-payroll-calendars" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-foreground">
              2027 payroll calendars by pay frequency
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Paid dates in 2027 for the common United States schedules, after moving weekends and
              Federal Reserve holidays to the previous banking day. Use the calculator above for any
              other payday.
            </p>
            <div className="space-y-6">
              {STANDARD.map(({ schedule, result: standard }) => {
                const y27 = standard.years.find((y) => y.year === 2027)!;
                const y26 = standard.years.find((y) => y.year === 2026)!;
                const moved = y27.payDates.filter((d) => d.movedReason);
                return (
                  <div key={schedule.id} id={schedule.id}>
                    <h3 className="font-medium text-foreground mb-1">
                      {schedule.label}: {y27.totalPeriods} pay dates in 2027
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {y27.payDates.map((d) => dayShort(d.paid)).join(", ")}.
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {y27.threePaycheckMonths.length > 0
                        ? `Three-paycheck months: ${y27.threePaycheckMonths.join(" and ")}. `
                        : ""}
                      {moved.length > 0
                        ? `Paid early for a weekend or holiday: ${moved
                            .map((d) => `${dayShort(d.paid)} for ${dayShort(d.scheduled)} (${d.movedReason})`)
                            .join("; ")}. `
                        : ""}
                      {schedule.frequency === "biweekly"
                        ? `In 2026 the same schedule has ${y26.totalPeriods} pay dates${
                            y26.is27PeriodYear
                              ? ", because the Friday, January 1, 2027 payday is paid on Thursday, December 31, 2026"
                              : ""
                          }.`
                        : ""}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          <section id="bank-holidays" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-foreground">
              Bank holidays that move paydays in 2026 and 2027
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-5">
              ACH payments settle on Federal Reserve banking days. A payday that falls on one of
              these dates, or on a weekend, is paid on the previous banking day. When a holiday
              falls on a Saturday (Independence Day 2026, Juneteenth 2027 and Christmas 2027) the
              banks stay open on the Friday before it; employers that observe that Friday pay a
              day earlier than the calculator shows. Source:{" "}
              <a
                href={BANK_HOLIDAY_SOURCE.href}
                className={linkCls}
                target="_blank"
                rel="noopener noreferrer"
              >
                {BANK_HOLIDAY_SOURCE.label}
              </a>
              .
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {CALENDAR_YEARS.map((year) => (
                <div key={year}>
                  <h3 className="font-medium text-foreground mb-2">{year}</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {FEDERAL_RESERVE_HOLIDAYS[year].map((holiday) => (
                      <li key={holiday.date}>
                        {dayLong(parseInputDate(holiday.date))}: {holiday.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-foreground">
              How this calculator works
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p className="mb-2 font-medium text-foreground">The math, in plain terms:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Pay dates are generated from the payday you enter, forward and backward across
                  2026 and 2027, at your pay frequency.
                </li>
                <li>
                  With the holiday option on, a payday on a weekend or a Federal Reserve holiday
                  moves to the previous banking day, and the counts use the paid dates.
                </li>
                <li>
                  Weekly and biweekly pay periods are the 7 or 14 days ending the number of lag
                  days you set before payday. Semimonthly and monthly periods follow the calendar.
                </li>
                <li>
                  Biweekly schedules usually have 26 pay periods, but calendar years with an
                  early-January payday can have 27.
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
                A payday that lands on January 1 is paid a day early, which moves it into the year
                before.{" "}
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
        <div className="print:hidden">
          <FinalCTABand />
        </div>
      </main>
      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
};

export default PayrollCalendar;
