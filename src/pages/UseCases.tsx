import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import FinalCTABand from "@/components/landing/FinalCTABand";
import { breadcrumbSchema, HOME_CRUMB } from "@/lib/structured-data";

const breadcrumbs = breadcrumbSchema([
  HOME_CRUMB,
  { name: "Use Cases", url: "https://zensus.app/use-cases" },
]);

const linkCls =
  "font-medium text-primary underline-offset-4 hover:underline";

const UseCase = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="mb-12">
    <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-foreground">
      {title}
    </h2>
    <div className="text-muted-foreground leading-relaxed space-y-3">
      {children}
    </div>
  </section>
);

const UseCases = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Zensus Use Cases · Who It's For and What It Solves</title>
      <meta
        name="description"
        content="Zensus is cash flow forecasting for founders with variable revenue: annual contracts, seasonal income, usage-based pricing, late-paying clients, and payroll on the line."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://zensus.app/use-cases" />
      <meta property="og:site_name" content="Zensus" />
      <meta property="og:title" content="Zensus Use Cases · Who It's For and What It Solves" />
      <meta
        property="og:description"
        content="Founders with annual contracts, seasonal revenue, usage-based pricing, and payroll on the line."
      />
      <meta property="og:image" content="https://zensus.app/og/use-cases.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Zensus use cases social preview card" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Zensus Use Cases · Who It's For and What It Solves" />
      <meta
        name="twitter:description"
        content="Founders with annual contracts, seasonal revenue, usage-based pricing, and payroll on the line."
      />
      <meta name="twitter:image" content="https://zensus.app/og/use-cases.png" />
      <link rel="canonical" href="https://zensus.app/use-cases" />
      <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>
    </Helmet>
    <Navbar />
    <main className="pt-24 pb-16">
      <div className="section-container max-w-3xl">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
          Who uses Zensus
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          Zensus is built for founders and finance teams whose cash does not
          arrive in smooth monthly slices: annual and quarterly contracts,
          seasonal swings, usage-based pricing, late-paying clients, and a
          payroll that has to clear no matter what.
        </p>

        <UseCase title="SaaS founders with annual and quarterly contracts">
          <p>
            Annual contracts make revenue look healthy while the bank account
            runs dry between renewals. Zensus syncs your{" "}
            <Link to="/integrations/quickbooks" className={linkCls}>
              QuickBooks
            </Link>{" "}
            invoices and places each contract payment on the date it actually
            lands, so your cash flow forecast reflects the March 14 renewal,
            not a smooth twelfth of it every month. For the weekly discipline behind this,
            see our guide to the{" "}
            <Link to="/blog/what-is-a-13-week-cash-flow-forecast" className={linkCls}>
              13-week cash flow forecast
            </Link>
            .
          </p>
        </UseCase>

        <UseCase title="Making payroll with confidence">
          <p>
            The question is never "what is my balance", it is "will the balance
            clear payroll on the 15th". Zensus projects your cash to every
            upcoming payroll date and fires a{" "}
            <Link to="/integrations/slack" className={linkCls}>
              Slack alert
            </Link>{" "}
            the moment your projection is on track to cross the cash floor you
            set. Our step-by-step guide,{" "}
            <Link to="/blog/will-i-make-payroll" className={linkCls}>
              Will I Make Payroll?
            </Link>
            , walks through the method Zensus automates.
          </p>
        </UseCase>

        <UseCase title="Agencies and client services with late payers">
          <p>
            When a client always pays net-45 on net-30 terms, a forecast built
            on due dates lies to you. Zensus reads actual payment behavior from
            your{" "}
            <Link to="/integrations/plaid" className={linkCls}>
              bank feed via Plaid
            </Link>{" "}
            and dates inflows by when customers really pay. New to the
            practice? Start with{" "}
            <Link to="/blog/what-is-cash-flow-forecasting" className={linkCls}>
              what cash flow forecasting is
            </Link>
            .
          </p>
        </UseCase>

        <UseCase title="Seasonal and usage-based revenue">
          <p>
            The lumpier your inflows, the bigger the buffer you need and the
            earlier you need warning. Zensus tracks your projected low point
            against your minimum cash buffer through the slow months, so you
            size spending decisions on the trough, not the peak. One plan
            covers every integration; see{" "}
            <Link to="/pricing" className={linkCls}>
              pricing
            </Link>
            .
          </p>
        </UseCase>

        <UseCase title="Hiring and cash flow scenario planning">
          <p>
            Before you sign an offer letter, ask Zensus what the hire does to
            your zero-cash date. The scenario agent answers in plain language,
            using your live financial data, and the{" "}
            <a href="/#features" className={linkCls}>
              cash flow view
            </a>{" "}
            updates as real transactions clear. Your data stays yours: how we
            handle it is documented on the{" "}
            <Link to="/security" className={linkCls}>
              security page
            </Link>
            .
          </p>
        </UseCase>
      </div>
      <FinalCTABand />
    </main>
    <Footer />
  </div>
);

export default UseCases;
