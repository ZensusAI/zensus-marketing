import { SITE_URL } from "@/lib/constants";
import {
  IntegrationPage,
  IntegrationRelatedLink,
  IntegrationSection,
} from "@/components/integrations/IntegrationPage";
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

const related: IntegrationRelatedLink[] = [
  {
    to: "/blog/can-quickbooks-forecast-cash-flow",
    label: "Can QuickBooks forecast cash flow?",
    description:
      "What the built-in Cash Flow Planner does, where it stops, and when a business needs dedicated forecasting on top of QuickBooks.",
  },
  {
    to: "/compare/zensus-vs-float",
    label: "Zensus vs Float",
    description:
      "A side-by-side look at two forecasting tools that both read from QuickBooks.",
  },
  {
    to: "/compare/zensus-vs-pulse",
    label: "Zensus vs Pulse",
    description:
      "How Zensus compares with a lower-cost, hands-on cash flow tool that also syncs with QuickBooks Online.",
  },
  {
    to: "/blog/cash-conversion-cycle",
    label: "Cash conversion cycle",
    description:
      "How the timing of receivables and payables (DSO and DPO) decides when cash actually arrives.",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Zensus + QuickBooks integration",
  serviceType: "Accounting data integration for cash flow forecasting",
  description:
    "Connect QuickBooks Online to Zensus via Intuit OAuth for live expenses, invoices, and AR/AP feeding a subscription-aware cash flow forecast.",
  provider: { "@id": `${SITE_URL}/#organization` },
  areaServed: "US",
  url: `${SITE_URL}/integrations/quickbooks`,
  isRelatedTo: {
    "@type": "Organization",
    name: "QuickBooks",
    url: "https://quickbooks.intuit.com",
  },
  audience: {
    "@type": "Audience",
    audienceType: "Businesses of any size",
  },
};

const QuickBooksIntegration = () => (
  <IntegrationPage
    slug="quickbooks"
    displayName="QuickBooks"
    tagline="Live expenses, invoices, and AR/AP from your books. Real-time through Intuit OAuth."
    logoSrc={quickbooksLogo}
    metaTitle="QuickBooks Integration · Sync Accounting to Zensus"
    metaDescription="Connect QuickBooks to Zensus via Intuit OAuth. Live expense and AR/AP sync, AES-256-GCM encrypted tokens, credentials never stored."
    sections={sections}
    serviceSchema={serviceSchema}
    related={related}
  />
);

export default QuickBooksIntegration;
