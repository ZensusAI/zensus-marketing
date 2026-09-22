import { SITE_URL } from "@/lib/constants";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { TalkToUsButton } from "@/components/landing/TalkToUsButton";
import { breadcrumbSchema, HOME_CRUMB } from "@/lib/structured-data";

export interface IntegrationSection {
  heading: string;
  body: React.ReactNode;
}

export interface IntegrationRelatedLink {
  to: string;
  label: string;
  description: string;
}

interface IntegrationPageProps {
  slug: string;
  displayName: string;
  tagline: string;
  logoSrc: string;
  metaTitle: string;
  metaDescription: string;
  sections: IntegrationSection[];
  serviceSchema?: Record<string, unknown>;
  /** Guides and pages that go deeper on what this integration is used for.
   *  These pages had no in-content links out, so they passed nothing on to
   *  the guides written about the same tool. */
  related?: IntegrationRelatedLink[];
}

const BREADCRUMB_NAMES: Record<string, string> = {
  plaid: "Plaid",
  quickbooks: "QuickBooks",
  hubspot: "HubSpot",
  slack: "Slack",
};

export const IntegrationPage = ({
  slug,
  displayName,
  tagline,
  logoSrc,
  metaTitle,
  metaDescription,
  sections,
  serviceSchema,
  related,
}: IntegrationPageProps) => {
  const pageUrl = `${SITE_URL}/integrations/${slug}`;
  const imageUrl = `${SITE_URL}/og/integrations-${slug}.png`;
  const imageAlt = `${metaTitle} social preview image`;
  const breadcrumbs = breadcrumbSchema([
    HOME_CRUMB,
    { name: "Integrations", url: `${SITE_URL}/integrations` },
    {
      name: BREADCRUMB_NAMES[slug] ?? slug,
      url: `${SITE_URL}/integrations/${slug}`,
    },
  ]);

  return (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:site_name" content="Zensus" />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={imageAlt} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <link rel="canonical" href={pageUrl} />
      <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>
      {serviceSchema && (
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
      )}
    </Helmet>
    <Navbar />
    <main className="pt-24 pb-16">
      <div className="section-container max-w-3xl">
        <div className="flex items-center gap-4 mb-6">
          <img src={logoSrc} alt={displayName} className="h-12 w-auto" />
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Connect your {displayName} with Zensus
          </h1>
        </div>
        <p className="text-lg text-muted-foreground mb-12">{tagline}</p>

        {sections.map((section) => (
          <section key={section.heading} className="mb-10">
            <h2 className="text-xl font-semibold mb-3">{section.heading}</h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              {section.body}
            </div>
          </section>
        ))}

        {related && related.length > 0 && (
          <section className="mb-10 border-t border-border pt-10">
            <h2 className="text-xl font-semibold mb-4">Related guides</h2>
            <ul className="space-y-4">
              {related.map((item) => (
                <li key={item.to} className="text-muted-foreground leading-relaxed">
                  <Link
                    to={item.to}
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {item.label}
                  </Link>
                  <span className="block">{item.description}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-12 text-center">
          <TalkToUsButton size="lg" />
        </div>
      </div>
    </main>
    <Footer />
  </div>
  );
};
