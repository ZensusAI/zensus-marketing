import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import FinalCTABand from "@/components/landing/FinalCTABand";
import { TalkToUsButton } from "@/components/landing/TalkToUsButton";
import {
  breadcrumbSchema,
  faqPageSchema,
  HOME_CRUMB,
} from "@/lib/structured-data";
import {
  COMPARE_METHODOLOGY,
  type ComparePageConfig,
} from "@/lib/compare-pages";

const linkCls = "font-medium text-primary underline-offset-4 hover:underline";

interface ComparePageLayoutProps {
  config: ComparePageConfig;
}

export function ComparePageLayout({ config }: ComparePageLayoutProps) {
  const pageUrl = `https://zensus.app/compare/${config.slug}`;
  const ogImage = `https://zensus.app/og/compare-${config.slug}.png`;

  const breadcrumbs = breadcrumbSchema([
    HOME_CRUMB,
    { name: config.pageTitle, url: pageUrl },
  ]);

  const faqLd = faqPageSchema(config.faqs);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{config.metaTitle}</title>
        <meta name="description" content={config.metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="Zensus" />
        <meta property="og:title" content={config.metaTitle} />
        <meta property="og:description" content={config.metaDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content={`${config.pageTitle} comparison social preview`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={config.metaTitle} />
        <meta name="twitter:description" content={config.metaDescription} />
        <meta name="twitter:image" content={ogImage} />
        <link rel="canonical" href={pageUrl} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>

      <Navbar />
      <main className="pt-24 pb-16">
        <div className="section-container max-w-3xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-wide text-primary">
            Comparison
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {config.pageTitle}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {config.lead}
          </p>

          <section className="mt-12" aria-labelledby="who-for-heading">
            <h2 id="who-for-heading" className="text-2xl font-semibold tracking-tight">
              Who is each tool for?
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-lg font-semibold">{config.competitorName}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {config.competitorBestFor}
                </p>
                <p className="mt-4 text-sm">
                  <a
                    href={config.competitorSite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkCls}
                  >
                    {config.competitorSite.replace(/^https:\/\//, "")}
                  </a>
                </p>
              </div>
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
                <h3 className="text-lg font-semibold">Zensus</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {config.zensusBestFor}
                </p>
                <p className="mt-4 text-sm">
                  <Link to="/pricing" className={linkCls}>
                    Zensus pricing
                  </Link>
                </p>
              </div>
            </div>
          </section>

          <section className="mt-12" aria-labelledby="pricing-heading">
            <h2 id="pricing-heading" className="text-2xl font-semibold tracking-tight">
              Pricing in plain text
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                <strong className="text-foreground">{config.competitorName}:</strong>{" "}
                {config.pricingSummary.competitor}{" "}
                <a
                  href={config.competitorPricingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkCls}
                >
                  Source
                </a>
              </p>
              <p>
                <strong className="text-foreground">Zensus:</strong>{" "}
                {config.pricingSummary.zensus}{" "}
                <Link to="/pricing" className={linkCls}>
                  zensus.app/pricing
                </Link>
              </p>
            </div>
          </section>

          <section className="mt-12" aria-labelledby="comparison-table-heading">
            <h2
              id="comparison-table-heading"
              className="text-2xl font-semibold tracking-tight"
            >
              Feature comparison
            </h2>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-sm">
                <caption className="caption-bottom pt-4 text-left text-xs leading-relaxed text-muted-foreground">
                  {COMPARE_METHODOLOGY}{" "}
                  {config.competitorName} is a trademark of its respective owner;
                  Zensus is not affiliated with or endorsed by{" "}
                  {config.competitorName}.
                </caption>
                <thead>
                  <tr className="border-b border-border">
                    <th
                      scope="col"
                      className="pb-3 pr-4 text-left font-semibold text-foreground"
                    >
                      Capability
                    </th>
                    <th
                      scope="col"
                      className="px-3 pb-3 text-left font-semibold text-foreground"
                    >
                      {config.competitorName}
                    </th>
                    <th
                      scope="col"
                      className="rounded-t-lg bg-[hsl(var(--forest))] px-3 pb-3 text-left font-semibold text-[hsl(var(--forest-foreground))]"
                    >
                      Zensus
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {config.tableRows.map((row, index) => (
                    <tr key={row.label} className="border-b border-border">
                      <th
                        scope="row"
                        className="py-3.5 pr-4 text-left font-medium text-muted-foreground"
                      >
                        {row.label}
                      </th>
                      <td className="px-3 py-3.5 align-top text-muted-foreground">
                        {row.competitor}
                      </td>
                      <td
                        className={`bg-primary/5 px-3 py-3.5 align-top text-foreground ${
                          index === config.tableRows.length - 1
                            ? "rounded-b-lg"
                            : ""
                        }`}
                      >
                        {row.zensus}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-12" aria-labelledby="strengths-heading">
            <h2 id="strengths-heading" className="text-2xl font-semibold tracking-tight">
              Where each tool wins
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="font-semibold">{config.competitorName} strengths</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  {config.competitorStrengths.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Zensus strengths</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  {config.zensusStrengths.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="mt-12" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight">
              Frequently asked questions
            </h2>
            <dl className="mt-6 space-y-6">
              {config.faqs.map((faq) => (
                <div key={faq.question}>
                  <dt className="font-semibold text-foreground">{faq.question}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <TalkToUsButton size="lg" />
            <Link to="/integrations" className={`text-sm ${linkCls}`}>
              See Zensus integrations
            </Link>
          </div>
        </div>
      </main>
      <FinalCTABand />
      <Footer />
    </div>
  );
}
