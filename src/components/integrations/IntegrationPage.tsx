import { Helmet } from "react-helmet-async";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { TalkToUsButton } from "@/components/landing/TalkToUsButton";
import { breadcrumbSchema, HOME_CRUMB } from "@/lib/structured-data";

export interface IntegrationSection {
  heading: string;
  body: React.ReactNode;
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
}: IntegrationPageProps) => {
  const breadcrumbs = breadcrumbSchema([
    HOME_CRUMB,
    { name: "Integrations", url: "https://zensus.app/integrations" },
    {
      name: BREADCRUMB_NAMES[slug] ?? slug,
      url: `https://zensus.app/integrations/${slug}`,
    },
  ]);

  return (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta
        property="og:image"
        content={`https://zensus.app/og/integrations-${slug}.png`}
      />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta
        name="twitter:image"
        content={`https://zensus.app/og/integrations-${slug}.png`}
      />
      <link rel="canonical" href={`https://zensus.app/integrations/${slug}`} />
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

        <div className="mt-12 text-center">
          <TalkToUsButton size="lg" />
        </div>
      </div>
    </main>
    <Footer />
  </div>
  );
};
