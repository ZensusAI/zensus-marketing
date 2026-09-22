import { SITE_URL } from "@/lib/constants";
import {
  IntegrationPage,
  IntegrationRelatedLink,
  IntegrationSection,
} from "@/components/integrations/IntegrationPage";
import hubspotLogo from "@/assets/integrations/hubspot.svg";

const sections: IntegrationSection[] = [
  {
    heading: "What Zensus reads",
    body: (
      <p>
        Deals and subscriptions from your HubSpot pipeline. Zensus maps each
        deal to a projected billing record so your cash flow forecast reflects
        when revenue actually lands, including annual and quarterly contract
        terms.
      </p>
    ),
  },
  {
    heading: "What Zensus never reads",
    body: (
      <p>
        Contact or company data outside the deals you authorize. Emails,
        chat logs, and marketing data stay in HubSpot.
      </p>
    ),
  },
  {
    heading: "How it works",
    body: (
      <p>
        You authorize HubSpot through OAuth 2.0. Zensus pulls deal data on
        connection and stays current via HubSpot webhooks. Multi-currency
        deals are stored with their native currency; no conversion is
        applied, so your cash flow forecast respects the currency you signed
        the deal in.
      </p>
    ),
  },
  {
    heading: "How to disconnect",
    body: (
      <p>
        Inside the Zensus app go to Settings, Integrations, and disconnect
        HubSpot. Zensus revokes the OAuth token and removes synced deal data
        within 24 hours. You can also revoke from your HubSpot developer
        account.
      </p>
    ),
  },
  {
    heading: "Security specifics",
    body: (
      <p>
        OAuth tokens are encrypted at rest with AES-256-GCM. HubSpot
        credentials stay with HubSpot; Zensus never sees them.
      </p>
    ),
  },
];

const related: IntegrationRelatedLink[] = [
  {
    to: "/blog/hubspot-pipeline-to-cash-forecast",
    label: "How to forecast cash from your sales pipeline",
    description:
      "Turning HubSpot deals into a cash forecast using deal probability, billing terms, and contract timing.",
  },
  {
    to: "/blog/arr-vs-cash-for-founders",
    label: "ARR vs cash",
    description:
      "Why an annual contract is one cash inflow on one date, not twelve equal months.",
  },
  {
    to: "/use-cases",
    label: "Who uses Zensus",
    description:
      "Annual contracts, seasonal income, usage-based pricing, and late-paying clients.",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Zensus + HubSpot integration",
  serviceType: "CRM and subscription data integration for cash flow projection",
  description:
    "Connect HubSpot to Zensus via OAuth so deals and subscriptions feed cash flow projections that respect annual, quarterly, and multi-currency contract terms.",
  provider: { "@id": `${SITE_URL}/#organization` },
  areaServed: "US",
  url: `${SITE_URL}/integrations/hubspot`,
  isRelatedTo: {
    "@type": "Organization",
    name: "HubSpot",
    url: "https://www.hubspot.com",
  },
  audience: {
    "@type": "Audience",
    audienceType: "Businesses of any size",
  },
};

const HubSpotIntegration = () => (
  <IntegrationPage
    slug="hubspot"
    displayName="HubSpot"
    tagline="Deals and subscriptions feed your cash flow forecast. Annual and quarterly contracts hit on their real dates, not smeared into MRR."
    logoSrc={hubspotLogo}
    metaTitle="HubSpot Integration · Deals & Subscriptions in Zensus"
    metaDescription="Connect HubSpot to Zensus via OAuth. Deals and subscriptions feed real-time cash flow projections that respect contract terms and currency."
    sections={sections}
    serviceSchema={serviceSchema}
    related={related}
  />
);

export default HubSpotIntegration;
