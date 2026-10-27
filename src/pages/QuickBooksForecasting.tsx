import { SITE_URL } from "@/lib/constants";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import FinalCTABand from "@/components/landing/FinalCTABand";
import { TalkToUsButton } from "@/components/landing/TalkToUsButton";
import { breadcrumbSchema, faqPageSchema, HOME_CRUMB } from "@/lib/structured-data";

// Product page for people who run their books on QuickBooks Online and want
// more forecasting than the built-in Cash Flow Planner gives them.
//
// Two rules for anyone editing this page:
//
// 1. Every statement about QuickBooks comes from Intuit's own help pages, is
//    linked to the page it came from, and was read on the date in
//    INTUIT_REVIEWED. Intuit rewords these pages (it renamed a product in one
//    of the sentences quoted here between September and October 2026), so
//    re-read them before changing the date.
// 2. Every statement about Zensus has to be true of the app as it ships.
//    These were checked against the app's code in October 2026: QuickBooks
//    syncs once a day, the forecast uses one currency and converts nothing,
//    and HubSpot means invoices and subscriptions, not deals.
//
// The exact Intuit sentences quoted below, with the "Updated" stamp each page
// carried when it was read, are recorded in
// docs/quickbooks-intuit-substantiation-2026-10-19.md.

const PAGE_PATH = "/quickbooks-cash-flow-forecasting";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const PAGE_TITLE = "QuickBooks Online Cash Flow Forecasting Software | Zensus";
const PAGE_DESCRIPTION =
  "QuickBooks Online cash flow forecasting software. Zensus reads QuickBooks Online, adds your bank feed and HubSpot, and projects cash weekly, with scenarios.";
const OG_IMAGE = `${SITE_URL}/og/quickbooks-cash-flow-forecasting.png`;
const INTUIT_REVIEWED = "October 2026";

const INTUIT = {
  planner:
    "https://quickbooks.intuit.com/learn-support/en-us/help-article/budget-planning/use-cash-flow-planner-quickbooks-online/L3pbHqdoF_US_en_US",
  plannerFaq:
    "https://quickbooks.intuit.com/learn-support/en-global/help-article/money-movement/cash-flow-planner/L8kvVEdNC_ROW_en",
  plannerUse:
    "https://quickbooks.intuit.com/learn-support/en-us/help-article/budget-forecast-reports/use-cash-flow-planner-quickbooks-online/L2l59mIqe_US_en_US",
  cashFlowChart:
    "https://quickbooks.intuit.com/learn-support/en-us/help-article/banking-reports/quickbooks-calculates-cash-flow/L28q0Ucu6_US_en_US",
  desktopProjector:
    "https://quickbooks.intuit.com/learn-support/en-us/help-article/accounts-payable/set-cash-flow-projector-quickbooks-desktop/L0BSJYlHq_US_en_US",
  desktopHub:
    "https://quickbooks.intuit.com/learn-support/en-us/help-article/cash-flow/cash-flow-hub-quickbooks-desktop/L0yzfiruI_US_en_US",
  forecastGrid:
    "https://quickbooks.intuit.com/learn-support/en-us/help-article/forecasting/use-cash-flow-forecast-grid-quickbooks-online/L9SPec2UI_US_en_US",
  advancedForecasts:
    "https://quickbooks.intuit.com/learn-support/en-us/help-article/budget-forecast-reports/create-manage-forecasts-quickbooks-online/L7SlFsgsy_US_en_US",
  intelligence:
    "https://quickbooks.intuit.com/learn-support/en-us/help-article/tasks/forecast-financial-performance-intuit-intelligence/L7o5sk5t2_US_en_US",
};

const linkCls = "font-medium text-primary underline-offset-4 hover:underline";

const breadcrumbs = breadcrumbSchema([
  HOME_CRUMB,
  { name: "QuickBooks Online cash flow forecasting software", url: PAGE_URL },
]);

const webPageLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${PAGE_URL}#webpage`,
  url: PAGE_URL,
  name: "QuickBooks Online cash flow forecasting software",
  description: PAGE_DESCRIPTION,
  inLanguage: "en-US",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: { "@id": `${SITE_URL}/#software` },
  primaryImageOfPage: OG_IMAGE,
};

const FAQS = [
  {
    question: "Does QuickBooks have cash flow forecasting built in?",
    answer:
      "Yes. QuickBooks Online includes a cash flow planner. Intuit says it bases its projection on your QuickBooks data, such as future invoices, bills, and expenses, and on historical data from the bank accounts connected to QuickBooks Online. Every QuickBooks Online plan also has a cash flow forecast grid that shows cash by account group over 13 weeks. Intuit Intelligence forecasting also projects income, expenses, and cash flow for the next 12 months once your books hold at least two years of transaction history.",
  },
  {
    question: "Is there a forecasting tool that connects to QuickBooks Online?",
    answer:
      "Yes. Intuit's own options are the Cash Flow Planner, the 13-week cash flow forecast grid, Forecasts in QuickBooks Online Advanced, and Intuit Intelligence forecasting. Third-party tools connect through Intuit's API with OAuth, and Zensus is one of them. It reads invoices, bills, payments, and purchases from QuickBooks Online, syncs once a day, and combines them with your bank feed and HubSpot subscriptions in one weekly cash flow projection.",
  },
  {
    question: "Does QuickBooks do sales or demand forecasting?",
    answer:
      "Intuit describes its forecasts as projections of income, cost of sales, and expenses (Forecasts in QuickBooks Online Advanced) or of income, expenses, and cash flow (Intuit Intelligence). Neither is described as a demand, sales pipeline, or purchase cycle forecast. Zensus does not forecast demand either. It forecasts cash: when invoices, bills, payroll, and subscriptions will move money in and out of the bank.",
  },
  {
    question: "How far ahead does the QuickBooks cash flow planner forecast?",
    answer:
      "Intuit's Cash Flow Planner FAQ says the 24-month view shows the past 9 months, the current month, and 14 months into the future. The 12-month and 6-month views each show 2 months into the future.",
  },
  {
    question: "Does Zensus replace QuickBooks?",
    answer:
      "No. QuickBooks stays your accounting system. Zensus reads from it, adds your bank balance and your HubSpot invoices and subscriptions, and builds the cash flow forecast on top.",
  },
  {
    question: "How often does Zensus sync with QuickBooks?",
    answer:
      "Once a day. Zensus also syncs when you open the app if the data is more than an hour old, and you can sync by hand at any time. Bank data from Plaid arrives by webhook as your bank reports it.",
  },
  {
    question: "Does Zensus work if QuickBooks Multicurrency is on?",
    answer:
      "Zensus connects, but it forecasts in your QuickBooks home currency and does not convert currencies. Invoices and bills in another currency are left out of the projection.",
  },
  {
    question: "What does Zensus cost for a QuickBooks business?",
    answer:
      "Zensus Pro is $199 a month, billed monthly, cancel anytime. It includes the QuickBooks, Plaid, HubSpot, and Slack integrations. There is a 14-day free trial; your card is collected at signup and is not charged until the trial ends.",
  },
];

const faqLd = faqPageSchema(FAQS);

const ROWS: { label: string; planner: React.ReactNode; zensus: string }[] = [
  {
    label: "Data it forecasts from",
    planner: (
      <>
        QuickBooks data "like future invoices, bills, and expenses", plus
        history from bank accounts connected to QuickBooks Online
      </>
    ),
    zensus:
      "QuickBooks invoices and bills, bank accounts connected directly through Plaid, and HubSpot invoices and subscriptions",
  },
  {
    label: "How far ahead",
    planner: "14 months, in the 24-month view",
    zensus: "Three years by default, with monthly, weekly, daily, and 13-week views",
  },
  {
    label: "Testing a what-if",
    planner: (
      <>
        Add planned items by hand as money in or money out. They "don't affect
        your books"
      </>
    ),
    zensus: "Ask in plain English. One scenario can combine several changes, drawn against your baseline",
  },
  {
    label: "More than one currency",
    planner: "Not available if Multicurrency is on",
    zensus:
      "Connects, forecasts in your home currency, and leaves out items in other currencies. No conversion",
  },
];

// Example projection with round numbers. Opening balance $84,000; biweekly
// payroll of $31,000 lands in weeks 1 and 3; one annual HubSpot renewal in
// week 3; one invoice due in week 2 is still open, so it is placed 14 days
// after its due date, in week 4. Closing = opening + cash in - cash out.
const PROJECTION = [
  {
    week: "Week 1",
    cashIn: "$22,000: two invoices due",
    cashOut: "$40,500: bills $9,500, payroll $31,000",
    closing: "$65,500",
  },
  {
    week: "Week 2",
    cashIn: "$8,000: one invoice due",
    cashOut: "$6,200: bills",
    closing: "$67,300",
  },
  {
    week: "Week 3",
    cashIn: "$41,000: one invoice $5,000, annual HubSpot renewal $36,000",
    cashOut: "$43,400: bills $12,400 including quarterly rent, payroll $31,000",
    closing: "$64,900",
  },
  {
    week: "Week 4",
    cashIn: "$14,000: an invoice due in week 2, still open, moved forward",
    cashOut: "$7,800: bills",
    closing: "$71,100",
  },
];

const Section = ({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="mb-12 scroll-mt-28">
    <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-foreground">{title}</h2>
    <div className="text-muted-foreground leading-relaxed space-y-3">{children}</div>
  </section>
);

const QuickBooksForecasting = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>{PAGE_TITLE}</title>
      <meta name="description" content={PAGE_DESCRIPTION} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={PAGE_URL} />
      <meta property="og:site_name" content="Zensus" />
      <meta property="og:title" content={PAGE_TITLE} />
      <meta property="og:description" content={PAGE_DESCRIPTION} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta
        property="og:image:alt"
        content="QuickBooks cash flow forecasting software social preview card"
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={PAGE_TITLE} />
      <meta name="twitter:description" content={PAGE_DESCRIPTION} />
      <meta name="twitter:image" content={OG_IMAGE} />
      <link rel="canonical" href={PAGE_URL} />
      <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>
      <script type="application/ld+json">{JSON.stringify(webPageLd)}</script>
      <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
    </Helmet>
    <Navbar />
    <main className="pt-24 pb-16">
      <div className="section-container max-w-3xl">
        <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-4">
          For QuickBooks Online
        </p>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
          QuickBooks Online cash flow forecasting, beyond Cash Flow Planner
        </h1>
        <p className="text-lg text-muted-foreground mb-4">
          Zensus is QuickBooks Online cash flow forecasting software. It
          connects to QuickBooks Online, reads your open invoices and bills,
          adds your live bank balance and your HubSpot subscriptions, and shows
          when your cash is projected to run out.
        </p>
        <p className="text-lg text-muted-foreground mb-10">
          QuickBooks stays your accounting system. Zensus is the cash flow
          projection on top of it, week by week, with scenarios you can test
          without touching your books.
        </p>

        <div className="mb-14 flex flex-wrap items-center gap-4">
          <TalkToUsButton size="lg" />
          <Link to="/pricing" className={linkCls}>
            See pricing
          </Link>
        </div>

        <Section id="what-quickbooks-does" title="What QuickBooks already does">
          <p>
            QuickBooks Online has a cash flow planner, and for many businesses
            it is enough. Intuit's help pages describe it this way:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              It projects from your books.{" "}
              <a href={INTUIT.planner} className={linkCls}>
                Intuit says
              </a>
              : "The Planner bases this projection on your QuickBooks data -
              like future invoices, bills, and expenses."
            </li>
            <li>
              It uses your bank history. The chart "uses historical data from
              your bank accounts connected to QuickBooks Online to forecast
              future recurring income and expenses", according to the{" "}
              <a href={INTUIT.plannerFaq} className={linkCls}>
                Cash Flow Planner FAQ
              </a>
              .
            </li>
            <li>
              It can estimate when an invoice will be paid. The same FAQ says
              the planner can "predict when a customer will pay your invoice,
              based on certain due dates."
            </li>
            <li>
              You can add planned items. They are "just for planning purposes
              and don't affect your books, so feel free to try out lots of
              scenarios."
            </li>
          </ul>
          <p>
            The planner is a QuickBooks Online feature. On QuickBooks Desktop,
            Intuit says the{" "}
            <a href={INTUIT.desktopProjector} className={linkCls}>
              Cash Flow Projector
            </a>{" "}
            "was discontinued in QuickBooks Desktop 2022", and the{" "}
            <a href={INTUIT.desktopHub} className={linkCls}>
              Cash Flow Hub
            </a>{" "}
            reports past cash: its chart "uses the reconciled transactions
            recorded in QuickBooks and not online balances".
          </p>
          <p>
            If your cash moves evenly, you bill in one currency, and you plan
            a few months ahead, start there. Our guide,{" "}
            <Link to="/blog/can-quickbooks-forecast-cash-flow" className={linkCls}>
              Can QuickBooks forecast cash flow?
            </Link>
            , walks through its forecasting features and how to set them up.
          </p>
        </Section>

        <Section id="where-it-stops" title="Where QuickBooks users outgrow it">
          <p>
            The limits below come from Intuit's own pages, read in{" "}
            {INTUIT_REVIEWED}.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">The horizon.</strong> In the
              24-month view, "you'll see cash flow for the past 9 months, the
              current month, and 14 months into the future." The 12-month and
              6-month views show 2 months into the future (
              <a href={INTUIT.plannerFaq} className={linkCls}>
                Cash Flow Planner FAQ
              </a>
              ).
            </li>
            <li>
              <strong className="text-foreground">Multicurrency.</strong>{" "}
              <a href={INTUIT.plannerUse} className={linkCls}>
                Intuit states
              </a>
              : "The cash flow planner isn't available in Intuit Accountant
              Suite and in all other versions if Multicurrency is on."
            </li>
            <li>
              <strong className="text-foreground">What the chart leaves out.</strong>{" "}
              Intuit's{" "}
              <a href={INTUIT.cashFlowChart} className={linkCls}>
                explanation of how QuickBooks calculates cash flow
              </a>{" "}
              lists three kinds of transaction the cash flow chart does not
              include: credit card transactions, transactions you entered
              manually into QuickBooks, and multicurrency transactions.
            </li>
            <li>
              <strong className="text-foreground">Where the data comes from.</strong>{" "}
              The planner works from QuickBooks and from the bank accounts
              connected to QuickBooks. A contract that lives only in your CRM
              is not in the projection until it is in your books.
            </li>
          </ul>
        </Section>

        <Section id="intuit-forecasts" title="Forecasting in QuickBooks Online beyond the planner">
          <p>
            Intuit describes three further forecasting features. Each is quoted
            here from Intuit's own help pages, read in {INTUIT_REVIEWED}, so
            you can judge whether they cover what you need before paying for
            anything else.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">The cash flow forecast grid.</strong>{" "}
              <a href={INTUIT.forecastGrid} className={linkCls}>
                Intuit says
              </a>{" "}
              it "is available in QuickBooks Online Simple Start, QuickBooks
              Online Essentials, QuickBooks Online Plus, and QuickBooks Online
              Advanced" and "shows your cash flow by account group over 13
              weeks." Future weeks draw on "Open invoices, recurring bills, and
              manual projections", and "You can also update expected dates or
              exclude individual transactions from your forecast." It is a
              weekly cash view built from what is already in your books.
            </li>
            <li>
              <strong className="text-foreground">Forecasts in QuickBooks Online Advanced.</strong>{" "}
              <a href={INTUIT.advancedForecasts} className={linkCls}>
                Intuit says
              </a>
              : "In QuickBooks Online Advanced, you can create forecasts to
              help you project your growth, spot trends, and create budgets."
              The forecast is built "based on your profit and loss statement",
              covers "your income, cost of sales, and expenses", runs "for the
              rest of the fiscal year, up to the end of next year, or up to
              three years", and "Currently, we only support Accrual based
              accounting." It is a profit and loss forecast, not a bank
              balance.
            </li>
            <li>
              <strong className="text-foreground">Intuit Intelligence forecasting.</strong>{" "}
              Intuit's{" "}
              <a href={INTUIT.intelligence} className={linkCls}>
                help page
              </a>{" "}
              says it "reviews your past business activity to project your
              performance and cash flow for the next 12 months", that you "can
              then chat with it to test business scenarios, like hiring a new
              employee", and that it needs "At least 2 years of transaction
              history in your books."
            </li>
          </ul>
          <p>
            If thirteen weeks of what is already in your books is enough, the
            grid may be all you need. If your books are on the accrual basis
            and you have two years of history, the other two add a monthly view
            twelve months or more out. Zensus is built for the cases they leave
            out: a weekly view past thirteen weeks, contracts billed from a CRM
            that are not yet in the books, and what-if changes tested without
            two years of history.
          </p>
        </Section>

        <Section id="what-zensus-adds" title="What Zensus adds for a business on QuickBooks">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">Your books, every day.</strong>{" "}
              Zensus reads invoices, bills, payments, and purchases from{" "}
              <Link to="/integrations/quickbooks" className={linkCls}>
                QuickBooks Online
              </Link>
              . Open invoices become cash you expect to receive and open
              bills become cash you expect to pay, each on its due date. One
              that is already overdue is moved forward to today or later.
            </li>
            <li>
              <strong className="text-foreground">The bank, directly.</strong>{" "}
              Balances and transactions come straight from your bank through{" "}
              <Link to="/integrations/plaid" className={linkCls}>
                Plaid
              </Link>
              , so the forecast starts from the cash you actually have.
            </li>
            <li>
              <strong className="text-foreground">Contracts on their real dates.</strong>{" "}
              Subscriptions from{" "}
              <Link to="/integrations/hubspot" className={linkCls}>
                HubSpot
              </Link>{" "}
              are placed on their next payment dates, at their own billing
              frequency. An annual contract is one payment on one date, not
              twelve equal months.
            </li>
            <li>
              <strong className="text-foreground">A weekly view.</strong> Move
              between monthly, weekly, and daily cash flow, or open the{" "}
              <Link to="/blog/what-is-a-13-week-cash-flow-forecast" className={linkCls}>
                13-week view
              </Link>{" "}
              that finance teams use for short-term planning.
            </li>
            <li>
              <strong className="text-foreground">Questions in plain English.</strong>{" "}
              Ask what happens if you hire two engineers and lose your
              largest customer. The scenario is drawn against your baseline,
              and you can clear it with one click.
            </li>
            <li>
              <strong className="text-foreground">A warning before it happens.</strong>{" "}
              Set a cash floor. A{" "}
              <Link to="/integrations/slack" className={linkCls}>
                Slack alert
              </Link>{" "}
              fires when your 30-day projection drops below it.
            </li>
          </ul>
        </Section>

        <Section id="weekly-projection" title="What a weekly cash flow projection from QuickBooks Online looks like">
          <p>
            An example with round numbers. The business has $84,000 in the
            bank, runs payroll every two weeks, and bills one customer annually
            through HubSpot.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <caption className="caption-bottom pt-4 text-left text-xs leading-relaxed text-muted-foreground">
                Example figures, not a customer's data. Closing balance is the
                opening balance plus cash in, minus cash out. Week 1 opens at
                $84,000.
              </caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="w-[14%] py-3 pr-4 text-left font-semibold text-foreground">
                    Week
                  </th>
                  <th scope="col" className="w-[34%] py-3 pr-4 text-left font-semibold text-foreground">
                    Cash in
                  </th>
                  <th scope="col" className="w-[34%] py-3 pr-4 text-left font-semibold text-foreground">
                    Cash out
                  </th>
                  <th scope="col" className="py-3 text-left font-semibold text-foreground">
                    Closing balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {PROJECTION.map((row) => (
                  <tr key={row.week} className="border-b border-border align-top">
                    <th scope="row" className="py-3 pr-4 text-left font-medium text-foreground">
                      {row.week}
                    </th>
                    <td className="py-3 pr-4 text-muted-foreground">{row.cashIn}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{row.cashOut}</td>
                    <td className="py-3 tabular-nums text-foreground">{row.closing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="font-medium text-foreground">Where each number comes from:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              The $84,000 opening balance is the bank balance read through
              Plaid, not the cash account in the ledger.
            </li>
            <li>
              Each cash-in amount is an open QuickBooks Online invoice placed on
              its due date. The $14,000 in week 4 was due in week 2 and is
              still open, so Zensus places it 14 days after its due date
              instead of counting it in the week it was supposed to arrive.
            </li>
            <li>
              The $36,000 in week 3 is one annual HubSpot subscription placed
              on its next payment date, not spread across twelve months.
            </li>
            <li>
              Each cash-out amount is the open QuickBooks bills due that week
              plus the biweekly payroll, which Zensus detects from recurring
              debits in the bank history.
            </li>
            <li>
              Week 3 is the low point at $64,900, after payroll and the
              quarter's rent. A Slack alert fires if the 30-day projection
              drops below the floor you set.
            </li>
          </ul>
        </Section>

        <Section id="side-by-side" title="QuickBooks cash flow planner and Zensus, side by side">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <caption className="caption-bottom pt-4 text-left text-xs leading-relaxed text-muted-foreground">
                QuickBooks column: from Intuit's help pages linked above, read
                in {INTUIT_REVIEWED}. QuickBooks and Intuit are trademarks of
                Intuit Inc.; Zensus is not affiliated with or endorsed by
                Intuit.
              </caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="w-[24%] py-3 pr-4 text-left font-medium text-muted-foreground">
                    <span className="sr-only">Topic</span>
                  </th>
                  <th scope="col" className="w-[38%] py-3 pr-4 text-left font-semibold text-foreground">
                    QuickBooks cash flow planner
                  </th>
                  <th scope="col" className="w-[38%] py-3 text-left font-semibold text-foreground">
                    Zensus
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-border align-top">
                    <th scope="row" className="py-3 pr-4 text-left font-medium text-foreground">
                      {row.label}
                    </th>
                    <td className="py-3 pr-4 text-muted-foreground">{row.planner}</td>
                    <td className="py-3 text-muted-foreground">{row.zensus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="how-it-works" title="How it works with QuickBooks">
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              Connect QuickBooks. You sign in on Intuit's page and choose the
              company. Zensus never sees your Intuit password.
            </li>
            <li>Connect your bank through Plaid. The connection is read-only.</li>
            <li>Connect HubSpot if your contracts are billed from there.</li>
            <li>
              Open your forecast. QuickBooks syncs once a day, and again when
              you open the app if the data is more than an hour old.
            </li>
          </ol>
          <p>
            What Zensus reads, how tokens are stored, and what happens when
            you disconnect are set out on the{" "}
            <Link to="/integrations/quickbooks" className={linkCls}>
              QuickBooks integration page
            </Link>{" "}
            and the{" "}
            <Link to="/security" className={linkCls}>
              security page
            </Link>
            .
          </p>
        </Section>

        <Section id="limits" title="What Zensus does not do">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              It does not convert currencies. Zensus forecasts in your
              QuickBooks home currency and leaves out invoices and bills in
              other currencies.
            </li>
            <li>
              It is not an accounting system. Your books, your tax records,
              and your invoices stay in QuickBooks.
            </li>
            <li>
              It does not take spreadsheet uploads. Every number comes from a
              connected account.
            </li>
          </ul>
        </Section>

        <Section id="pricing" title="Pricing">
          <p>
            Zensus Pro is $199 a month, billed monthly, cancel anytime. It
            includes the QuickBooks, Plaid, HubSpot, and Slack integrations
            and unlimited scenarios. There is a 14-day free trial: your card
            is collected at signup and is not charged until the trial ends.
            Details are on the{" "}
            <Link to="/pricing" className={linkCls}>
              pricing page
            </Link>
            .
          </p>
        </Section>

        <section id="faq" className="mb-12 border-t border-border pt-10">
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

        <section className="mb-4 border-t border-border pt-10">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Related</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li>
              <Link to="/blog/can-quickbooks-forecast-cash-flow" className={linkCls}>
                Can QuickBooks forecast cash flow?
              </Link>
              <span className="block">
                QuickBooks Online's own forecasting, step by step, with its
                limits.
              </span>
            </li>
            <li>
              <Link to="/compare/zensus-vs-float" className={linkCls}>
                Zensus vs Float
              </Link>
              <span className="block">
                Two forecasting tools that both read from QuickBooks.
              </span>
            </li>
            <li>
              <Link to="/tools/runway-calculator" className={linkCls}>
                Startup runway calculator
              </Link>
              <span className="block">
                A free first estimate of the date your cash runs out.
              </span>
            </li>
            <li>
              <Link to="/use-cases" className={linkCls}>
                Who uses Zensus
              </Link>
              <span className="block">
                Annual contracts, seasonal income, late-paying clients, and
                payroll on the line.
              </span>
            </li>
          </ul>
        </section>
      </div>
      <FinalCTABand />
    </main>
    <Footer />
  </div>
);

export default QuickBooksForecasting;
