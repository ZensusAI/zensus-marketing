import { SITE_URL } from "@/lib/constants";
import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import FinalCTABand from "@/components/landing/FinalCTABand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { breadcrumbSchema, faqPageSchema, HOME_CRUMB } from "@/lib/structured-data";
import { ToolEmailCapture } from "@/components/tools/ToolEmailCapture";
import { trackToolDownload } from "@/lib/tool-lead-analytics";
import {
  buildThirteenWeekForecast,
  MAX_NEXT_PAYROLL_WEEK,
  MIN_NEXT_PAYROLL_WEEK,
  nextMonday,
  parseLocalIsoDate,
  PAY_FREQUENCY_LABELS,
  thirteenWeekCsv,
  toLocalIsoDate,
  WEEKS,
  type PayFrequency,
  type ThirteenWeekInput,
} from "@/lib/thirteen-week";

const linkCls = "font-medium text-primary underline-offset-4 hover:underline";

const PAGE_PATH = "/tools/13-week-cash-flow-template";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const TEMPLATE_PATH = "/templates/13-week-cash-flow-template.xlsx";
const PAGE_TITLE = "Free 13-Week Cash Flow Forecast Template for Excel";
const PAGE_DESCRIPTION =
  "Free 13-week cash flow forecast template for Excel and Google Sheets, formulas included, no email. Or enter your numbers to see your 13 weeks first.";

const breadcrumbs = breadcrumbSchema([
  HOME_CRUMB,
  { name: "13-Week Cash Flow Template", url: PAGE_URL },
]);

const FAQS = [
  {
    question: "Is there a free 13-week cash flow forecast template for Excel?",
    answer:
      "Yes. The XLSX file on this page is free, needs no email, and has the formulas in place: weekly totals for cash in and cash out, net cash flow, a closing balance that carries into the next week's opening balance, and a buffer check that flags any week closing below your cash floor. It has no macros, so it opens in Excel, Google Sheets, and Numbers.",
  },
  {
    question: "Does the 13-week cash flow template work in Google Sheets?",
    answer:
      "Yes. Open Google Sheets, choose File, then Import, and upload the XLSX file. The formulas are plain SUM and IF functions, so nothing changes in the conversion. The CSV download on this page also pastes straight into Sheets or Excel.",
  },
  {
    question: "What does a 13-week cash flow forecast template include?",
    answer:
      "One column of labels and 13 weekly columns. The rows are the week beginning date, the opening balance, a cash in block (customer collections, contract payments, other inflows), a cash out block (payroll and contractors, payroll taxes and benefits, rent, software, marketing, other outflows), total cash in, total cash out, net cash flow, closing balance, your cash buffer floor, and a buffer check for each week.",
  },
  {
    question: "Why 13 weeks?",
    answer:
      "Thirteen weeks is one quarter. It is far enough ahead to act on a shortfall by chasing collections, moving a payment, or delaying a hire, and near enough that you can still name the actual invoices and pay dates in each week instead of guessing. Lenders, restructuring advisers and finance teams use the same horizon, which is why the 13-week cash flow forecast is the standard short-term model.",
  },
  {
    question: "How is this different from the runway calculator?",
    answer:
      "The runway calculator works from monthly averages and projects the date your cash runs out over up to four years. The 13-week forecast on this page works week by week: payroll lands on pay dates, monthly bills land in the week that holds the first of the month, and a one-off payment lands in the week you name. A monthly average can show a healthy quarter while a single week inside it dips below your floor. This forecast shows that week.",
  },
  {
    question: "How often should I update a 13-week cash flow forecast?",
    answer:
      "Every Monday. Replace week 1 with what actually cleared the bank, drop that week off the front, add a new week 13 at the back, and correct any invoice or payment that moved. With the template that takes about thirty minutes once the first version exists.",
  },
  {
    question: "What is a cash buffer floor?",
    answer:
      "The lowest balance you are willing to see in the bank. A common floor is one payroll run plus rent, so that a late customer payment cannot turn into a missed payroll. Enter it once and the sheet flags every week that closes below it.",
  },
];

const faqLd = faqPageSchema(FAQS);

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": `${PAGE_URL}#app`,
  name: "Zensus 13-Week Cash Flow Forecast Template and Builder",
  url: PAGE_URL,
  description: PAGE_DESCRIPTION,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  isAccessibleForFree: true,
  downloadUrl: `${SITE_URL}${TEMPLATE_PATH}`,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: { "@id": `${SITE_URL}/#organization` },
};

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const weekOf = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

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

function NumberField({
  id,
  label,
  value,
  onChange,
  step = 1000,
  hint,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (next: number) => void;
  step?: number;
  hint?: string;
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
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

const ThirteenWeekTemplate = () => {
  const today = useMemo(() => new Date(), []);
  const [startDateIso, setStartDateIso] = useState(() => toLocalIsoDate(nextMonday(today)));
  const [openingBalance, setOpeningBalance] = useState(120000);
  const [cashFloor, setCashFloor] = useState(60000);
  const [weeklyCollections, setWeeklyCollections] = useState(14000);
  const [payrollPerRun, setPayrollPerRun] = useState(32000);
  const [payFrequency, setPayFrequency] = useState<PayFrequency>("biweekly");
  const [nextPayrollWeek, setNextPayrollWeek] = useState(1);
  const [monthlyFixedCosts, setMonthlyFixedCosts] = useState(14000);
  const [weeklyOtherOutflows, setWeeklyOtherOutflows] = useState(3000);
  const [oneOffEnabled, setOneOffEnabled] = useState(true);
  const [oneOffAmount, setOneOffAmount] = useState(45000);
  const [oneOffWeek, setOneOffWeek] = useState(6);

  const startDate = useMemo(
    () => parseLocalIsoDate(startDateIso) ?? nextMonday(today),
    [startDateIso, today],
  );

  const input: ThirteenWeekInput = useMemo(
    () => ({
      openingBalance,
      cashFloor,
      weeklyCollections,
      payrollPerRun,
      payFrequency,
      nextPayrollWeek,
      monthlyFixedCosts,
      weeklyOtherOutflows,
      oneOffEnabled,
      oneOffAmount,
      oneOffWeek,
    }),
    [
      openingBalance,
      cashFloor,
      weeklyCollections,
      payrollPerRun,
      payFrequency,
      nextPayrollWeek,
      monthlyFixedCosts,
      weeklyOtherOutflows,
      oneOffEnabled,
      oneOffAmount,
      oneOffWeek,
    ],
  );

  const result = useMemo(() => buildThirteenWeekForecast(input, startDate), [input, startDate]);
  const emailInputs = useMemo(
    () => ({ ...input, startDate: toLocalIsoDate(startDate) }),
    [input, startDate],
  );
  const showNextPayrollWeek = payFrequency === "weekly" || payFrequency === "biweekly";
  const lowestRow = result.rows[result.lowestWeek - 1];
  const floorRow =
    result.firstWeekBelowFloor === null ? null : result.rows[result.firstWeekBelowFloor - 1];

  const downloadCsv = () => {
    trackToolDownload("thirteen-week", "csv");
    downloadText(
      `zensus-13-week-cash-flow-forecast-${toLocalIsoDate(startDate)}.csv`,
      "text/csv;charset=utf-8",
      thirteenWeekCsv(result),
    );
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
        <meta property="og:image" content={`${SITE_URL}/og/tools-13-week-cash-flow-template.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Zensus free 13-week cash flow forecast template social preview card"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
        <meta name="twitter:image" content={`${SITE_URL}/og/tools-13-week-cash-flow-template.png`} />
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
            Free 13-week cash flow forecast template
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            One sheet, 13 weekly columns, and the formulas already in place. Download the
            Excel template below, or enter your numbers first to see your 13 weeks, find the
            week your balance dips lowest, and download them pre-filled.
          </p>

          {/* The download, first: it is what the page is for. */}
          <div className="rounded-2xl border border-primary/40 bg-primary/5 p-6 mb-10">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
              The template
            </p>
            <p className="font-medium text-foreground mb-1">
              13-week cash flow forecast template (XLSX)
            </p>
            <p className="text-sm text-muted-foreground mb-5">
              Cash in and cash out blocks, weekly totals, a closing balance that carries into
              the next week, and a buffer check that flags any week under your cash floor.
              Opens in Excel, Google Sheets and Numbers. No macros, no email.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Button asChild>
                <a
                  href={TEMPLATE_PATH}
                  download
                  onClick={() => trackToolDownload("thirteen-week", "xlsx")}
                >
                  Download the XLSX template
                </a>
              </Button>
              <a href="#whats-inside" className={`text-sm ${linkCls}`}>
                See what is inside
              </a>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-foreground">
            See your 13 weeks before you open the sheet
          </h2>
          <p className="text-muted-foreground mb-6">
            Enter round numbers. Payroll lands on your pay dates, monthly bills land in the
            week that holds the 1st, and a one-off payment lands in the week you choose. The
            table updates as you type.
          </p>

          {/* Inputs */}
          <div className="rounded-2xl border border-border bg-card/50 p-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <NumberField
                id="opening-balance"
                label="Cash in the bank today"
                value={openingBalance}
                onChange={setOpeningBalance}
                step={10000}
              />
              <NumberField
                id="cash-floor"
                label="Cash buffer floor"
                value={cashFloor}
                onChange={setCashFloor}
                step={5000}
                hint="The lowest balance you will accept. One payroll run plus rent is a common floor."
              />
              <div className="space-y-1.5">
                <Label htmlFor="start-date">Week 1 starts</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDateIso}
                  onChange={(event) => setStartDateIso(event.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Mondays keep the weeks aligned with payroll and bank statements.
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-border pt-6">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
                Cash in
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <NumberField
                  id="weekly-collections"
                  label="Customer collections per week"
                  value={weeklyCollections}
                  onChange={setWeeklyCollections}
                  step={1000}
                  hint="What customers actually pay you in a typical week, not what you invoice."
                />
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Switch
                      id="one-off"
                      checked={oneOffEnabled}
                      onCheckedChange={setOneOffEnabled}
                      aria-label="Toggle a one-off inflow"
                    />
                    <Label htmlFor="one-off">A one-off payment is coming</Label>
                  </div>
                  {oneOffEnabled ? (
                    <div className="grid grid-cols-2 gap-3">
                      <NumberField
                        id="one-off-amount"
                        label="Amount"
                        value={oneOffAmount}
                        onChange={setOneOffAmount}
                        step={5000}
                      />
                      <div className="space-y-1.5">
                        <Label htmlFor="one-off-week">Lands in week</Label>
                        <Input
                          id="one-off-week"
                          type="number"
                          inputMode="numeric"
                          min={1}
                          max={WEEKS}
                          value={oneOffWeek}
                          onChange={(event) =>
                            setOneOffWeek(
                              Math.min(WEEKS, Math.max(1, Math.floor(Number(event.target.value)) || 1)),
                            )
                          }
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-border pt-6">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
                Cash out
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <NumberField
                  id="payroll-per-run"
                  label="Payroll per run"
                  value={payrollPerRun}
                  onChange={setPayrollPerRun}
                  step={1000}
                  hint="Net pay, payroll taxes and contractors for one run."
                />
                <div className="space-y-1.5">
                  <Label htmlFor="pay-frequency">Pay frequency</Label>
                  <Select
                    value={payFrequency}
                    onValueChange={(value) => setPayFrequency(value as PayFrequency)}
                  >
                    <SelectTrigger id="pay-frequency" aria-label="Pay frequency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(PAY_FREQUENCY_LABELS) as PayFrequency[]).map((key) => (
                        <SelectItem key={key} value={key}>
                          {PAY_FREQUENCY_LABELS[key]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {showNextPayrollWeek ? null : (
                    <p className="text-xs text-muted-foreground">
                      Read off the calendar: the 15th and the last day of each month, or the
                      last day only.
                    </p>
                  )}
                </div>
                {showNextPayrollWeek ? (
                  <div className="space-y-1.5">
                    <Label htmlFor="next-payroll-week">Next payroll lands in week</Label>
                    <Input
                      id="next-payroll-week"
                      type="number"
                      inputMode="numeric"
                      min={MIN_NEXT_PAYROLL_WEEK}
                      max={MAX_NEXT_PAYROLL_WEEK}
                      value={nextPayrollWeek}
                      onChange={(event) =>
                        setNextPayrollWeek(
                          Math.min(
                            MAX_NEXT_PAYROLL_WEEK,
                            Math.max(
                              MIN_NEXT_PAYROLL_WEEK,
                              Math.floor(Number(event.target.value)) || MIN_NEXT_PAYROLL_WEEK,
                            ),
                          ),
                        )
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Not sure of your dates? The{" "}
                      <Link to="/tools/payroll-calendar" className={linkCls}>
                        payroll calendar
                      </Link>{" "}
                      lists them.
                    </p>
                  </div>
                ) : null}
                <NumberField
                  id="monthly-fixed"
                  label="Monthly bills"
                  value={monthlyFixedCosts}
                  onChange={setMonthlyFixedCosts}
                  step={1000}
                  hint="Rent, software, insurance: everything that goes out once a month."
                />
                <NumberField
                  id="weekly-other"
                  label="Other spend per week"
                  value={weeklyOtherOutflows}
                  onChange={setWeeklyOtherOutflows}
                  step={500}
                  hint="Marketing, travel, supplies and the rest."
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="rounded-2xl border border-border bg-card/50 p-5">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                Lowest balance
              </p>
              <p className="text-2xl font-bold tracking-tight">{usd.format(result.lowestBalance)}</p>
              <p className="text-sm text-muted-foreground">
                Week {result.lowestWeek}, {weekOf.format(lowestRow.weekStart)}
              </p>
            </div>
            <div
              className={`rounded-2xl border p-5 ${
                floorRow ? "border-destructive/40 bg-destructive/5" : "border-primary/40 bg-primary/5"
              }`}
            >
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                First week under floor
              </p>
              <p className="text-2xl font-bold tracking-tight">
                {floorRow ? `Week ${floorRow.week}` : "None"}
              </p>
              <p className="text-sm text-muted-foreground">
                {floorRow
                  ? `${weekOf.format(floorRow.weekStart)}, closes at ${usd.format(floorRow.closing)}`
                  : `Every week closes above ${usd.format(cashFloor)}`}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card/50 p-5">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                Closing balance, week {WEEKS}
              </p>
              <p className="text-2xl font-bold tracking-tight">{usd.format(result.closingBalance)}</p>
              <p className="text-sm text-muted-foreground">
                In {usd.format(result.totalIn)}, out {usd.format(result.totalOut)}
              </p>
            </div>
          </div>

          {/* 13-week table */}
          <div className="overflow-x-auto rounded-2xl border border-border mb-6">
            <table className="w-full text-sm">
              <caption className="sr-only">Thirteen-week cash flow forecast</caption>
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left">
                  <th className="px-4 py-2.5 font-medium">Week</th>
                  <th className="px-4 py-2.5 font-medium">Beginning</th>
                  <th className="px-4 py-2.5 font-medium text-right">Cash in</th>
                  <th className="px-4 py-2.5 font-medium text-right">Cash out</th>
                  <th className="hidden sm:table-cell px-4 py-2.5 font-medium text-right">Net</th>
                  <th className="px-4 py-2.5 font-medium text-right">Closing</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row) => (
                  <tr
                    key={row.week}
                    className={`border-b border-border/60 last:border-0 ${
                      row.belowFloor ? "bg-destructive/5" : ""
                    }`}
                  >
                    <td className="px-4 py-2">{row.week}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{weekOf.format(row.weekStart)}</td>
                    <td className="px-4 py-2 text-right">{usd.format(row.totalIn)}</td>
                    <td className="px-4 py-2 text-right">
                      {usd.format(row.totalOut)}
                      {row.payrollRuns > 0 ? (
                        <span className="ml-1 text-xs text-muted-foreground">
                          {row.payrollRuns === 1 ? "payroll" : `${row.payrollRuns}x payroll`}
                        </span>
                      ) : null}
                    </td>
                    <td
                      className={`hidden sm:table-cell px-4 py-2 text-right ${
                        row.net < 0 ? "text-muted-foreground" : ""
                      }`}
                    >
                      {row.net >= 0 ? `+${usd.format(row.net)}` : usd.format(row.net)}
                    </td>
                    <td
                      className={`px-4 py-2 text-right font-medium whitespace-nowrap ${
                        row.belowFloor ? "text-destructive" : ""
                      }`}
                    >
                      {usd.format(row.closing)}
                      {row.belowFloor ? (
                        <span className="ml-2 text-[10px] font-mono uppercase tracking-wide">
                          below floor
                        </span>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
            <Button type="button" variant="outline" onClick={downloadCsv}>
              Download my 13 weeks (CSV)
            </Button>
            <Button asChild variant="outline">
              <a
                href={TEMPLATE_PATH}
                download
                onClick={() => trackToolDownload("thirteen-week", "xlsx")}
              >
                Download the blank template (XLSX)
              </a>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-10">
            The CSV has the same rows and week columns as the template, so you can paste it in
            and then replace the flat weekly figures with real invoice due dates and pay dates.
          </p>

          <ToolEmailCapture
            tool="thirteen-week"
            inputs={emailInputs}
            copy={{
              prompt: "Want these 13 weeks and the template link in your inbox?",
              button: "Email my forecast",
              successTitle: "Forecast sent",
              successLead: "Your 13-week forecast is on its way to",
            }}
          />

          {/* What is inside */}
          <section id="whats-inside" className="mb-12 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-foreground">
              What is in the template
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>
                The sheet has one column of labels, 13 columns of weeks, and the rows below.
                Input rows are plain numbers. Everything else is a formula.
              </p>
              <p className="mb-2 font-medium text-foreground">The rows, top to bottom:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Week beginning: the Monday each column covers.</li>
                <li>
                  Opening balance: week 1 is your bank balance today; every later week is a
                  formula that reads the previous week&apos;s closing balance.
                </li>
                <li>
                  Cash in: customer collections, annual and quarterly contract payments, other
                  inflows, and a total.
                </li>
                <li>
                  Cash out: payroll and contractors, payroll taxes and benefits, rent and
                  utilities, software and subscriptions, marketing, other outflows, and a total.
                </li>
                <li>Net cash flow: total cash in minus total cash out.</li>
                <li>Closing balance: opening balance plus net cash flow.</li>
                <li>
                  Cash buffer floor and buffer check: enter the floor once, and each week shows
                  OK or BELOW FLOOR.
                </li>
              </ul>
              <p>
                The six formulas are SUM for the two totals, a subtraction for net cash flow, an
                addition for the closing balance, a cell reference that chains closing into the
                next opening, and an IF for the buffer check. Our guide to{" "}
                <Link to="/blog/how-to-build-a-13-week-cash-flow-forecast-in-excel" className={linkCls}>
                  building a 13-week cash flow forecast in Excel
                </Link>{" "}
                writes each one out, cell by cell.
              </p>
            </div>
          </section>

          {/* How to fill it in */}
          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-foreground">
              How to fill it in
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Put today&apos;s bank balance in week 1&apos;s opening balance and set your
                  cash buffer floor.
                </li>
                <li>
                  List collections by the week you expect the money, not the week you invoice.
                  Due date plus a week is a fair start for most customers.
                </li>
                <li>
                  Put payroll in the weeks that hold a pay date. The{" "}
                  <Link to="/tools/payroll-calendar" className={linkCls}>
                    payroll calendar
                  </Link>{" "}
                  gives you every date, including three-paycheck months.
                </li>
                <li>
                  Put rent, software and other monthly bills in the week that holds the 1st, and
                  any annual renewal in the week it is due.
                </li>
                <li>
                  Read the buffer check row. A BELOW FLOOR week three weeks out is a collections
                  call this week. Our guides to the{" "}
                  <Link to="/blog/zero-cash-date-for-founders" className={linkCls}>
                    zero cash date
                  </Link>{" "}
                  and to{" "}
                  <Link to="/blog/will-i-make-payroll" className={linkCls}>
                    whether you will make payroll
                  </Link>{" "}
                  cover what to do with that week.
                </li>
                <li>
                  Every Monday, replace week 1 with actuals, roll the window forward a week, and
                  fix anything that moved.
                </li>
              </ol>
              <p>
                New to the model? Start with{" "}
                <Link to="/blog/what-is-a-13-week-cash-flow-forecast" className={linkCls}>
                  what a 13-week cash flow forecast is
                </Link>
                , then come back for the file. For a monthly view of how long your cash lasts,
                the free{" "}
                <Link to="/tools/runway-calculator" className={linkCls}>
                  runway calculator
                </Link>{" "}
                gives you a zero-cash date in a minute.
              </p>
            </div>
          </section>

          {/* When a spreadsheet stops being enough */}
          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-foreground">
              When the Monday update costs more than it tells you
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>
                The template is the right tool until the weekly update means exporting from the
                bank, re-keying invoices, and remembering which payment moved. Zensus keeps the
                same 13 weeks current from your connected accounts: it reads bank transactions
                through Plaid, open invoices and bills from{" "}
                <Link to="/quickbooks-cash-flow-forecasting" className={linkCls}>
                  QuickBooks Online
                </Link>
                , and invoices and subscriptions from HubSpot, and sends a Slack alert when a sync
                shows your 30-day projection crossing the floor. Zensus Pro is{" "}
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

export default ThirteenWeekTemplate;
