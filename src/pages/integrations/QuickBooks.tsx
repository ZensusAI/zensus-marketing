import { IntegrationPage, IntegrationSection } from "@/components/integrations/IntegrationPage";
import quickbooksLogo from "@/assets/integrations/quickbooks.svg";

const sections: IntegrationSection[] = [
  {
    heading: "What Zensus reads",
    body: (
      <p>
        Expenses, invoices, company info, and your accounts payable and
        receivable. We pull the same data your bookkeeper sees inside
        QuickBooks.
      </p>
    ),
  },
  {
    heading: "What Zensus never reads",
    body: (
      <p>
        Your QuickBooks password, your credit card details, or any user data
        outside the QuickBooks Online scopes you authorize during OAuth.
      </p>
    ),
  },
  {
    heading: "How it works",
    body: (
      <p>
        You authorize QuickBooks through Intuit OAuth 2.0. Access tokens are
        short-lived (one hour). Refresh tokens live 100 days. Zensus encrypts
        both at rest with AES-256-GCM and refreshes transparently.
      </p>
    ),
  },
  {
    heading: "How to disconnect",
    body: (
      <p>
        Inside the Zensus app go to Settings, Integrations, and disconnect
        QuickBooks. Zensus revokes the refresh token with Intuit immediately
        and removes synced data within 24 hours. You can also revoke directly
        from your Intuit account.
      </p>
    ),
  },
  {
    heading: "Security specifics",
    body: (
      <p>
        OAuth tokens are encrypted at rest. Your QuickBooks credentials
        remain with Intuit; Zensus never sees them. Token rotation happens
        automatically without interrupting sync.
      </p>
    ),
  },
];

const QuickBooksIntegration = () => (
  <IntegrationPage
    slug="quickbooks"
    displayName="QuickBooks"
    tagline="Live expenses, invoices, and AR/AP from your books. Real-time through Intuit OAuth."
    logoSrc={quickbooksLogo}
    metaTitle="QuickBooks integration · Zensus"
    metaDescription="Connect QuickBooks to Zensus via Intuit OAuth. Live expense and AR/AP sync, AES-256-GCM encrypted tokens, credentials never stored."
    sections={sections}
  />
);

export default QuickBooksIntegration;
