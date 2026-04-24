import { Helmet } from "react-helmet-async";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { breadcrumbSchema, HOME_CRUMB } from "@/lib/structured-data";

const PERSON_URL = "https://zensus.app/about";
const PERSONAL_SITE = "https://ajinsunny.com";
const PERSONAL_LINKEDIN = "https://www.linkedin.com/in/ajinsunny/";

const breadcrumbs = breadcrumbSchema([
  HOME_CRUMB,
  { name: "About", url: PERSON_URL },
]);

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ajin Sunny",
  jobTitle: "Founder & CEO",
  url: PERSON_URL,
  worksFor: { "@id": "https://zensus.app/#organization" },
  sameAs: [PERSONAL_SITE, PERSONAL_LINKEDIN],
};

const links = [
  {
    label: "LinkedIn",
    href: PERSONAL_LINKEDIN,
    external: true,
  },
  {
    label: "ajinsunny.com",
    href: PERSONAL_SITE,
    external: true,
  },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>About · Zensus</title>
      <meta
        name="description"
        content="Ajin Sunny, founder and CEO of Zensus. Full-stack engineer turned founder, building cash flow forecasting for startups with variable revenue."
      />
      <meta property="og:title" content="About · Zensus" />
      <meta
        property="og:description"
        content="Ajin Sunny, founder and CEO of Zensus. Full-stack engineer turned founder, building cash flow forecasting for startups with variable revenue."
      />
      <meta property="og:image" content="https://zensus.app/og/about.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:image" content="https://zensus.app/og/about.png" />
      <link rel="canonical" href={PERSON_URL} />
      <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>
      <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
    </Helmet>
    <Navbar />
    <main className="pt-24 pb-16">
      <section className="section-padding">
        <div className="section-container max-w-2xl">
          <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-4">
            About
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2">
            Ajin Sunny
          </h1>
          <p className="text-lg text-muted-foreground mb-10">
            Founder &amp; CEO, Zensus
          </p>

          <div className="space-y-6 text-lg text-foreground leading-relaxed">
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

          <div className="flex flex-wrap gap-4 mt-10">
            {links.map((link) => (
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

          <div className="mt-16 border-t border-border pt-10">
            <h2 className="text-xl font-semibold text-foreground mb-3">
              About Zensus
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Zensus is cash flow forecasting for founders with variable
              revenue. Connect Plaid, QuickBooks, HubSpot, and Slack. See
              your runway in real time. Ask a runway agent in plain English
              and watch projections update live.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
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
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default About;
