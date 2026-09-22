import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import FinalCTABand from "@/components/landing/FinalCTABand";
import { TalkToUsButton } from "@/components/landing/TalkToUsButton";
import { SITE_URL } from "@/lib/constants";
import {
  breadcrumbSchema,
  faqPageSchema,
  HOME_CRUMB,
} from "@/lib/structured-data";
import {
  COMPARE_LINKS,
  COMPARE_METHODOLOGY,
  FLOAT_ALTERNATIVES as page,
} from "@/lib/compare-pages";

const linkCls = "font-medium text-primary underline-offset-4 hover:underline";

const pageUrl = `${SITE_URL}/compare/${page.slug}`;
const ogImage = `${SITE_URL}/og/compare-${page.slug}.png`;

const breadcrumbs = breadcrumbSchema([
  HOME_CRUMB,
  { name: page.pageTitle, url: pageUrl },
]);

const faqLd = faqPageSchema(page.faqs);

// The tools reviewed, in the order the page lists them. Float itself is the
// subject, not an entry, so it is left out of the list.
const itemListLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: page.pageTitle,
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  numberOfItems: page.entries.length,
  itemListElement: page.entries.map((entry, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: entry.name,
    url: entry.isZensus ? `${SITE_URL}/` : entry.site,
  })),
};

const ownerNames = [page.float.name, ...page.entries.filter((e) => !e.isZensus).map((e) => e.name)];
const ownerList = `${ownerNames.slice(0, -1).join(", ")}, and ${ownerNames[ownerNames.length - 1]}`;

const FloatAlternatives = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>{page.metaTitle}</title>
      <meta name="description" content={page.metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:site_name" content="Zensus" />
      <meta property="og:title" content={page.metaTitle} />
      <meta property="og:description" content={page.metaDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${page.pageTitle} social preview`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={page.metaTitle} />
      <meta name="twitter:description" content={page.metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      <link rel="canonical" href={pageUrl} />
      <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>
      <script type="application/ld+json">{JSON.stringify(itemListLd)}</script>
      <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
    </Helmet>

    <Navbar />
    <main className="pt-24 pb-16">
      <div className="section-container max-w-3xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-wide text-primary">
          Comparison
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {page.pageTitle}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          {page.lead}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {page.disclosure}
        </p>

        <section className="mt-12" aria-labelledby="why-heading">
          <h2 id="why-heading" className="text-2xl font-semibold tracking-tight">
            Why teams look for a Float alternative
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {page.whyIntro}
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            {page.whyLeave.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-12" aria-labelledby="stay-heading">
          <h2 id="stay-heading" className="text-2xl font-semibold tracking-tight">
            When Float is still the better choice
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {page.stayIntro}
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            {page.whenStay.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm">
            <Link to="/compare/zensus-vs-float" className={linkCls}>
              Read the full Zensus vs Float comparison
            </Link>
          </p>
        </section>

        <section className="mt-12" aria-labelledby="glance-heading">
          <h2 id="glance-heading" className="text-2xl font-semibold tracking-tight">
            Float alternatives at a glance
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {page.tableIntro}
          </p>
          {/* Six columns do not fit the 3xl text column, so on large screens
              the table borrows width from the margins. */}
          <div className="mt-6 overflow-x-auto lg:-mx-24">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <caption className="sr-only">
                Float and five alternatives compared on price, trial,
                accounting, bank feed, and CRM
              </caption>
              <thead>
                <tr className="border-b border-border">
                  {["Tool", "Starting price", "Free trial", "Accounting", "Direct bank feed", "CRM"].map(
                    (heading) => (
                      <th
                        key={heading}
                        scope="col"
                        className="pb-3 pr-4 text-left font-semibold text-foreground"
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {[page.float, ...page.entries].map((entry) => (
                  <tr
                    key={entry.name}
                    className={`border-b border-border align-top ${
                      entry.isReference ? "bg-muted/40" : ""
                    }`}
                  >
                    <th
                      scope="row"
                      className="py-3.5 pr-4 text-left font-medium text-foreground sm:whitespace-nowrap"
                    >
                      {entry.name}
                      {entry.isReference ? (
                        <span className="block text-xs font-normal text-muted-foreground">
                          for reference
                        </span>
                      ) : null}
                    </th>
                    <td className="py-3.5 pr-4 text-muted-foreground">{entry.price}</td>
                    <td className="py-3.5 pr-4 text-muted-foreground">{entry.trial}</td>
                    <td className="py-3.5 pr-4 text-muted-foreground">{entry.accounting}</td>
                    <td className="py-3.5 pr-4 text-muted-foreground">{entry.bankFeed}</td>
                    <td className="py-3.5 pr-4 text-muted-foreground">{entry.crm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Outside the scroll container so it is never cut off on phones. */}
          <p className="pt-4 text-xs leading-relaxed text-muted-foreground">
            {COMPARE_METHODOLOGY} {ownerList} are trademarks of their
            respective owners; Zensus is not affiliated with or endorsed by any
            of them.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="tools-heading">
          <h2 id="tools-heading" className="text-2xl font-semibold tracking-tight">
            The alternatives, one by one
          </h2>
          <div className="mt-6 divide-y divide-border border-y border-border">
            {page.entries.map((entry) => (
              <article key={entry.name} className="py-8" aria-labelledby={`tool-${entry.id}`}>
                <h3 id={`tool-${entry.id}`} className="text-xl font-semibold tracking-tight">
                  {entry.name}
                  {entry.isZensus ? (
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      (our product)
                    </span>
                  ) : null}
                </h3>
                <p className="mt-2 text-sm font-medium text-foreground">
                  Best for: {entry.bestFor}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {entry.summary}
                </p>
                <div className="mt-5 grid gap-6 sm:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      Where it differs from Float
                    </h4>
                    <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
                      {entry.differs.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Trade-offs</h4>
                    <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
                      {entry.tradeoffs.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="mt-5 text-sm">
                  {entry.isZensus ? (
                    <Link to="/pricing" className={linkCls}>
                      Zensus pricing
                    </Link>
                  ) : (
                    <a
                      href={entry.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkCls}
                    >
                      Source: {entry.name} pricing page
                    </a>
                  )}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="choose-heading">
          <h2 id="choose-heading" className="text-2xl font-semibold tracking-tight">
            How to choose
          </h2>
          <p className="mb-2 mt-4 text-sm font-medium text-foreground">
            Start from the reason you are leaving Float:
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            {page.howToChoose.map((row) => (
              <li key={row.situation}>
                <strong className="font-medium text-foreground">{row.situation}:</strong>{" "}
                {row.pick}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight">
            Frequently asked questions
          </h2>
          <dl className="mt-6 space-y-6">
            {page.faqs.map((faq) => (
              <div key={faq.question}>
                <dt className="font-semibold text-foreground">{faq.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-12" aria-labelledby="more-heading">
          <h2 id="more-heading" className="text-xl font-semibold tracking-tight">
            More comparisons
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {COMPARE_LINKS.filter((l) => l.to !== `/compare/${page.slug}`).map((l) => (
              <li key={l.to}>
                <Link to={l.to} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/blog/can-quickbooks-forecast-cash-flow" className={linkCls}>
                Can QuickBooks forecast cash flow?
              </Link>
            </li>
          </ul>
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

export default FloatAlternatives;
