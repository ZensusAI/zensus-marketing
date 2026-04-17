import { IntegrationPage, IntegrationSection } from "@/components/integrations/IntegrationPage";
import hubspotLogo from "@/assets/integrations/hubspot.svg";

const sections: IntegrationSection[] = [
  {
    heading: "What Zensus reads",
    body: (
      <p>
        Deals and subscriptions from your HubSpot pipeline. Zensus maps each
        deal to a projected billing record so your runway reflects when
        revenue actually lands, including annual and quarterly contract
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
        applied, so your runway respects the currency you signed the deal
        in.
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

const HubSpotIntegration = () => (
  <IntegrationPage
    slug="hubspot"
    displayName="HubSpot"
    tagline="Deals and subscriptions feed your runway. Annual and quarterly contracts hit on their real dates, not smeared into MRR."
    logoSrc={hubspotLogo}
    metaTitle="HubSpot integration · Zensus"
    metaDescription="Connect HubSpot to Zensus via OAuth. Deals and subscriptions feed real-time runway projections that respect contract terms and currency."
    sections={sections}
  />
);

export default HubSpotIntegration;
