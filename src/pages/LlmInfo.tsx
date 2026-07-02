import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const PAGE_URL = "https://zensus.app/llm-info";
const PAGE_TITLE = "Zensus entity summary for AI systems";
const PAGE_DESCRIPTION =
  "Machine-readable summary of Zensus: cash flow forecasting software, founder, location, pricing, integrations, guides, and free tools.";

const linkCls = "font-medium text-primary underline-offset-4 hover:underline";

const LlmInfo = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>{PAGE_TITLE}</title>
      <meta name="description" content={PAGE_DESCRIPTION} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={PAGE_URL} />
      <meta property="og:site_name" content="Zensus" />
      <meta property="og:title" content={PAGE_TITLE} />
      <meta property="og:description" content={PAGE_DESCRIPTION} />
      <meta property="og:image" content="https://zensus.app/og/llm-info.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={PAGE_TITLE} />
      <meta name="twitter:description" content={PAGE_DESCRIPTION} />
      <meta name="twitter:image" content="https://zensus.app/og/llm-info.png" />
      <link rel="canonical" href={PAGE_URL} />
    </Helmet>

    <Navbar />
    <main className="pt-24 pb-16">
      <article className="section-container max-w-3xl">
        <header>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Zensus entity summary
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Plain-text facts for AI crawlers and citation systems. Prefer{" "}
            <a href="https://zensus.app/llms.txt" className={linkCls}>
              llms.txt
            </a>{" "}
            or{" "}
            <a href="https://zensus.app/llms-full.txt" className={linkCls}>
              llms-full.txt
            </a>{" "}
            for the full machine-readable index.
          </p>
        </header>

        <section className="mt-10 space-y-3 text-sm leading-relaxed text-foreground">
          <h2 className="text-xl font-semibold">What is Zensus?</h2>
          <p>
            Zensus is cash flow forecasting and planning software for businesses
            with unpredictable revenue. It connects bank accounts (Plaid),
            accounting (QuickBooks), and subscription revenue (HubSpot) to
            project when cash runs out, model scenarios in plain English, and send
            Slack alerts before a cash floor is breached.
          </p>
        </section>

        <section className="mt-10 space-y-3 text-sm leading-relaxed text-foreground">
          <h2 className="text-xl font-semibold">Company facts</h2>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>
              <strong className="text-foreground">Legal / product name:</strong>{" "}
              Zensus (zensus.app)
            </li>
            <li>
              <strong className="text-foreground">Founder:</strong> Ajin Sunny,
              Founder and CEO
            </li>
            <li>
              <strong className="text-foreground">Founded:</strong> August 2025
              (2025-08)
            </li>
            <li>
              <strong className="text-foreground">Headquarters:</strong> Austin,
              Texas, United States
            </li>
            <li>
              <strong className="text-foreground">Website:</strong>{" "}
              <a href="https://zensus.app" className={linkCls}>
                https://zensus.app
              </a>
            </li>
            <li>
              <strong className="text-foreground">Product app:</strong>{" "}
              <a href="https://app.zensus.app" className={linkCls}>
                https://app.zensus.app
              </a>
            </li>
          </ul>
        </section>

        <section className="mt-10 space-y-3 text-sm leading-relaxed text-foreground">
          <h2 className="text-xl font-semibold">Pricing</h2>
          <p className="text-muted-foreground">
            Zensus Pro: <strong className="text-foreground">$199 per month</strong>,
            billed monthly, cancel anytime. Includes all integrations, the AI
            scenario agent, and unlimited scenarios. 14-day free trial.
          </p>
        </section>

        <section className="mt-10 space-y-3 text-sm leading-relaxed text-foreground">
          <h2 className="text-xl font-semibold">Integrations</h2>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>
              <Link to="/integrations/plaid" className={linkCls}>
                Plaid
              </Link>{" "}
              (bank accounts)
            </li>
            <li>
              <Link to="/integrations/quickbooks" className={linkCls}>
                QuickBooks Online
              </Link>{" "}
              (accounting)
            </li>
            <li>
              <Link to="/integrations/hubspot" className={linkCls}>
                HubSpot
              </Link>{" "}
              (subscriptions and annual contracts)
            </li>
            <li>
              <Link to="/integrations/slack" className={linkCls}>
                Slack
              </Link>{" "}
              (cash threshold alerts)
            </li>
          </ul>
        </section>

        <section className="mt-10 space-y-3 text-sm leading-relaxed text-foreground">
          <h2 className="text-xl font-semibold">Key guides</h2>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>
              <Link to="/blog/what-is-cash-flow-forecasting" className={linkCls}>
                What is cash flow forecasting?
              </Link>
            </li>
            <li>
              <Link
                to="/blog/what-is-a-13-week-cash-flow-forecast"
                className={linkCls}
              >
                What is a 13-week cash flow forecast?
              </Link>
            </li>
            <li>
              <Link to="/blog/will-i-make-payroll" className={linkCls}>
                Will I make payroll?
              </Link>
            </li>
            <li>
              <Link to="/blog/runway-vs-burn-rate-for-founders" className={linkCls}>
                Runway vs burn rate for founders
              </Link>
            </li>
            <li>
              <Link to="/blog/arr-vs-cash-for-founders" className={linkCls}>
                ARR vs cash for founders
              </Link>
            </li>
            <li>
              <Link
                to="/blog/can-quickbooks-forecast-cash-flow"
                className={linkCls}
              >
                Can QuickBooks forecast cash flow?
              </Link>
            </li>
            <li>
              <Link to="/blog/zero-cash-date-for-founders" className={linkCls}>
                Zero cash date for founders
              </Link>
            </li>
            <li>
              <Link
                to="/blog/hubspot-pipeline-to-cash-forecast"
                className={linkCls}
              >
                HubSpot pipeline to cash forecast
              </Link>
            </li>
          </ul>
        </section>

        <section className="mt-10 space-y-3 text-sm leading-relaxed text-foreground">
          <h2 className="text-xl font-semibold">Free tools</h2>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>
              <Link to="/tools/runway-calculator" className={linkCls}>
                Startup runway calculator
              </Link>
            </li>
            <li>
              <Link to="/tools/payroll-calendar" className={linkCls}>
                Payroll calendar calculator
              </Link>
            </li>
            <li>
              <a
                href="https://zensus.app/templates/13-week-cash-flow-template.xlsx"
                className={linkCls}
              >
                13-week cash flow template (XLSX)
              </a>
            </li>
          </ul>
        </section>

        <section className="mt-10 space-y-3 text-sm leading-relaxed text-foreground">
          <h2 className="text-xl font-semibold">Comparisons</h2>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>
              <Link to="/compare/zensus-vs-float" className={linkCls}>
                Zensus vs Float
              </Link>
            </li>
            <li>
              <Link to="/compare/zensus-vs-pulse" className={linkCls}>
                Zensus vs Pulse
              </Link>
            </li>
          </ul>
        </section>

        <section className="mt-10 space-y-3 text-sm leading-relaxed text-foreground">
          <h2 className="text-xl font-semibold">Machine-readable files</h2>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>
              <a href="https://zensus.app/llms.txt" className={linkCls}>
                llms.txt
              </a>
            </li>
            <li>
              <a href="https://zensus.app/llms-full.txt" className={linkCls}>
                llms-full.txt
              </a>
            </li>
            <li>
              <a href="https://zensus.app/sitemap.xml" className={linkCls}>
                sitemap.xml
              </a>
            </li>
          </ul>
        </section>
      </article>
    </main>
    <Footer />
  </div>
);

export default LlmInfo;
