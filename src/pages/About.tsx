import { Helmet } from "react-helmet-async";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { TalkToUsButton } from "@/components/landing/TalkToUsButton";
import { breadcrumbSchema, HOME_CRUMB } from "@/lib/structured-data";

const PAGE_URL = "https://zensus.app/about";
const PERSONAL_SITE = "https://ajinsunny.com";
const PERSONAL_LINKEDIN = "https://www.linkedin.com/in/ajinsunny/";

const breadcrumbs = breadcrumbSchema([
  HOME_CRUMB,
  { name: "About", url: PAGE_URL },
]);

// Ashwin's Person node lives here because his BlogPosting author @id points
// at /about#ashwin-menon. Ajin's node ships in the sitewide @graph in
// index.html, so only Ashwin needs a page-level block.
const aboutPageLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": "https://zensus.app/about#aboutpage",
  url: PAGE_URL,
  name: "About Zensus",
  about: { "@id": "https://zensus.app/#organization" },
  mainEntity: { "@id": "https://zensus.app/#organization" },
};

const ashwinPersonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://zensus.app/about#ashwin-menon",
  name: "Ashwin Menon",
  jobTitle: "Software Developer",
  worksFor: { "@id": "https://zensus.app/#organization" },
  url: PAGE_URL,
  sameAs: ["https://www.linkedin.com/in/ashwinmenon502/"],
};

const personalLinks = [
  { label: "LinkedIn", href: PERSONAL_LINKEDIN, external: true },
  { label: "ajinsunny.com", href: PERSONAL_SITE, external: true },
];

const principles = [
  {
    title: "Real numbers, not averages.",
    body: "Annual contracts hit on real billing dates, not smeared into monthly MRR. Same-day transfers don't look like burn.",
  },
  {
    title: "Your data stays yours.",
    body: "Bank and accounting credentials live with Plaid and Intuit, never with us. Your data never trains an AI model. Every query is isolated by account.",
  },
  {
    title: 'No contracts, no "contact sales."',
    body: "One plan at a public price. Sign up, connect your data, cancel the same day if it is not a fit.",
  },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>About Zensus · Cash Flow Forecasting</title>
      <meta
        name="description"
        content="Zensus is cash flow forecasting for businesses of any size. Built because too many businesses fail from missed cash flow, not missed missions."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={PAGE_URL} />
      <meta property="og:site_name" content="Zensus" />
      <meta property="og:title" content="About Zensus · Cash Flow Forecasting" />
      <meta
        property="og:description"
        content="Zensus is cash flow forecasting for businesses of any size. Built because too many businesses fail from missed cash flow, not missed missions."
      />
      <meta property="og:image" content="https://zensus.app/og/about.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="About Zensus social preview card" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="About Zensus · Cash Flow Forecasting" />
      <meta
        name="twitter:description"
        content="Zensus is cash flow forecasting for businesses of any size. Built because too many businesses fail from missed cash flow, not missed missions."
      />
      <meta name="twitter:image" content="https://zensus.app/og/about.png" />
      <link rel="canonical" href={PAGE_URL} />
      <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>
      <script type="application/ld+json">{JSON.stringify(ashwinPersonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(aboutPageLd)}</script>
    </Helmet>
    <Navbar />
    <main className="pt-24 pb-16">
      <section className="section-padding">
        <div className="section-container max-w-2xl">
          {/* Hero */}
          <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-4">
            About
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            About Zensus
          </h1>
          <p className="text-lg text-muted-foreground mb-12">
            Cash flow forecasting built for businesses of any size.
          </p>

          {/* What we do */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              What we do
            </h2>
            <div className="space-y-4 text-base text-foreground leading-relaxed">
              <p>
                Zensus connects your bank (via Plaid), QuickBooks, HubSpot,
                and Slack, then gives you a real-time cash flow forecast that
                respects how your business actually earns and spends money.
                Annual contracts hit on their real billing dates. Subscription
                revenue flows in with contract cadence. Same-day internal
                transfers don't show up as fake burn spikes.
              </p>
              <p>
                You ask questions in plain English and watch projections
                update live. Set a cash floor and Slack pings you the moment
                your 30-day projection crosses it.
              </p>
            </div>
          </section>

          {/* Why we built this */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Why we built this
            </h2>
            <div className="space-y-4 text-base text-foreground leading-relaxed">
              <p>
                Most business owners check their bank balance every Monday and still
                aren't sure they can make payroll in six weeks. That isn't a
                financial strategy. It's anxiety with a spreadsheet.
              </p>
              <p>
                Zensus exists because too many startups fail from the same
                root cause: founders so focused on their mission that cash
                flow becomes an afterthought until it is already too late.
                Visibility closes that gap. Early warning turns a crisis into
                a decision.
              </p>
            </div>
          </section>

          {/* How we think about it */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              How we think about it
            </h2>
            <ul className="space-y-6">
              {principles.map((p) => (
                <li key={p.title}>
                  <p className="font-semibold text-foreground mb-1">
                    {p.title}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {p.body}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* Meet the founder */}
          <section id="ajin-sunny" className="border-t border-border pt-10 mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Meet the founder
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Ajin Sunny, Founder &amp; CEO
            </p>
            <div className="space-y-4 text-base text-foreground leading-relaxed">
              <p>
                Ajin Sunny is the founder of Zensus. Before Zensus, he spent
                five years as a full-stack engineer building and scaling web
                applications.
              </p>
              <p>
                He started Zensus after realizing that many startups fail by
                not having clear observability on the cash flow, because
                founders are so focused on their mission that they forget
                fluctuations in their cash flow.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 mt-6">
              {personalLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  {link.label}
                  {link.external && <ExternalLink size={14} />}
                </a>
              ))}
            </div>
          </section>

          {/* Team */}
          <section id="ashwin-menon" className="border-t border-border pt-10 mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Team
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Ashwin Menon, Software Developer
            </p>
            <div className="space-y-4 text-base text-foreground leading-relaxed">
              <p>
                Ashwin Menon is a software developer at Zensus. He works
                across the product and writes on the Zensus blog about the
                engineering behind AI products and founder finance.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 mt-6">
              <a
                href="https://www.linkedin.com/in/ashwinmenon502/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                LinkedIn
                <ExternalLink size={14} />
              </a>
            </div>
          </section>

          {/* CTA */}
          <section className="border-t border-border pt-10 text-center">
            <div className="flex justify-center mb-6">
              <TalkToUsButton size="lg" />
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-primary hover:underline"
              >
                See the product
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-1.5 text-primary hover:underline"
              >
                Pricing
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/security"
                className="inline-flex items-center gap-1.5 text-primary hover:underline"
              >
                Security
                <ArrowRight size={14} />
              </Link>
            </div>
          </section>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default About;
