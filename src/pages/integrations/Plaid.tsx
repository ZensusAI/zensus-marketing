import { IntegrationPage, IntegrationSection } from "@/components/integrations/IntegrationPage";
import plaidLogo from "@/assets/integrations/plaid.svg";

const sections: IntegrationSection[] = [
  {
    heading: "What Zensus reads",
    body: <p>Bank transactions, account balances, and account names across every institution you connect through Plaid.</p>,
  },
  {
    heading: "What Zensus never reads",
    body: <p>Personal identifying information, routing numbers, or your bank password. Plaid holds those; Zensus only sees the data you authorize.</p>,
  },
  {
    heading: "How it works",
    body: <p>Open Plaid Link from your Zensus settings. Authenticate with your bank. Plaid returns an OAuth token that Zensus stores encrypted with AES-256-GCM. Webhooks keep transactions fresh in real time.</p>,
  },
  {
    heading: "How to disconnect",
    body: <p>Visit Settings -&gt; Integrations inside the Zensus app and click Disconnect Plaid. This revokes the OAuth token on Plaid's side and removes all synced data from Zensus within 24 hours.</p>,
  },
  {
    heading: "Security specifics",
    body: <p>Plaid OAuth tokens are encrypted at rest. Zensus never stores your bank credentials. Disconnecting is one click and honored immediately.</p>,
  },
];

const PlaidIntegration = () => (
  <IntegrationPage
    slug="plaid"
    displayName="bank via Plaid"
    tagline="Live bank transactions, account balances, and real-time sync. No CSV uploads, no brittle scrapers."
    logoSrc={plaidLogo}
    metaTitle="Plaid integration · Zensus"
    metaDescription="Connect your bank to Zensus via Plaid. Real-time transaction sync, bank-level OAuth, no credentials stored."
    sections={sections}
  />
);

export default PlaidIntegration;
