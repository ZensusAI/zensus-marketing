import { SITE_URL } from "@/lib/constants";
import { Link } from "react-router-dom";
import {
  IntegrationPage,
  IntegrationRelatedLink,
  IntegrationSection,
} from "@/components/integrations/IntegrationPage";
import quickbooksLogo from "@/assets/integrations/quickbooks.svg";

const linkCls = "font-medium text-primary underline-offset-4 hover:underline";

const sections: IntegrationSection[] = [
  {
    heading: "What Zensus reads",
    body: (
      <p>
        Invoices, bills, payments, and purchases; your chart of accounts; the
        Profit and Loss and Balance Sheet reports; and basic company
        information, including your home currency. It is the same data your
        bookkeeper sees inside QuickBooks Online.
      </p>
    ),
  },
  {
    heading: "What Zensus never reads",
    body: (
      <p>
        Your Intuit password, your credit card details, or anything outside
        the QuickBooks Online accounting access you approve when you sign in.
      </p>
    ),
  },
  {
    heading: "What it does in your forecast",
    body: (
      <p>
        Open invoices, the ones with a balance still owed, become cash you
        expect to receive. Open bills become cash you expect to pay. That puts
        commitments in your forecast before they reach the bank, alongside the
        history from your books.
      </p>
    ),
  },
  {
    heading: "How to connect",
    body: (
      <ol className="list-decimal space-y-2 pl-5">
        <li>In Zensus, open Settings, then Integrations, and connect QuickBooks.</li>
        <li>Sign in to Intuit and choose the company to connect.</li>
        <li>Approve access. Zensus receives its tokens from Intuit and runs the first sync.</li>
      </ol>
    ),
  },
  {
    heading: "How often it syncs",
    body: (
      <p>
        QuickBooks syncs once a day. Zensus also syncs when you open the app
        if the data is more than an hour old, and whenever you press Sync.
      </p>
    ),
  },
  {
    heading: "Currencies",
    body: (
      <p>
        Zensus forecasts in your QuickBooks home currency and does not convert
        currencies. Invoices and bills in another currency are left out of the
        projection.
      </p>
    ),
  },
  {
    heading: "How to disconnect",
    body: (
      <p>
        Open Settings, then Integrations, and disconnect QuickBooks. Zensus
        revokes its access with Intuit immediately, deletes the stored tokens,
        and stops syncing. You can also remove Zensus from your Intuit
        account. Accounting data that was already synced is kept while your
        Zensus account is active, as the{" "}
        <Link to="/privacy" className={linkCls}>
          Privacy Policy
        </Link>{" "}
        describes, and you can ask for it to be deleted at any time. If you
        later connect a different QuickBooks company, the first company's
        synced data is removed, so two companies are never mixed in one
        forecast.
      </p>
    ),
  },
  {
    heading: "Security specifics",
    body: (
      <p>
        Intuit issues a short-lived access token and a longer-lived refresh
        token. Zensus encrypts both at rest with AES-256-GCM and renews them
        automatically before they expire. Your QuickBooks credentials stay
        with Intuit; Zensus never sees them.
      </p>
    ),
  },
];

const faqs = [
  {
    question: "Do I need QuickBooks to use Zensus?",
    answer:
      "No. You can connect a bank through Plaid on its own. QuickBooks adds your open invoices and bills, so the forecast includes money that is owed but has not moved yet.",
  },
  {
    question: "How often does QuickBooks data update in Zensus?",
    answer:
      "Once a day. Zensus also syncs when you open the app if the data is more than an hour old, and you can sync by hand at any time.",
  },
  {
    question: "Does Zensus handle more than one currency in QuickBooks?",
    answer:
      "Zensus forecasts in your QuickBooks home currency and does not convert currencies. Invoices and bills in another currency are left out of the projection.",
  },
  {
    question: "What happens to my data if I disconnect QuickBooks?",
    answer:
      "Zensus revokes its access with Intuit immediately, deletes the stored tokens, and stops syncing. Accounting data that was already synced is kept while your Zensus account is active, and you can ask for it to be deleted at any time. If you later connect a different QuickBooks company, the first company's synced data is removed.",
  },
  {
    question: "Does Zensus see my Intuit password?",
    answer:
      "No. You sign in on Intuit's own page. Zensus receives tokens from Intuit, stores them encrypted with AES-256-GCM, and never sees your password.",
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
  {
    to: "/quickbooks-cash-flow-forecasting",
    label: "Cash flow forecasting for QuickBooks users",
    description:
      "What the built-in planner covers, where it stops, and what Zensus adds on top of your books.",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Zensus + QuickBooks integration",
  serviceType: "Accounting data integration for cash flow forecasting",
  description:
    "Connect QuickBooks Online to Zensus via Intuit OAuth so invoices, bills, and payables and receivables feed a cash flow forecast, synced daily.",
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
    tagline="Invoices, bills, and what you owe and are owed, straight from your books. Synced daily through Intuit OAuth."
    logoSrc={quickbooksLogo}
    metaTitle="QuickBooks Integration · Sync Accounting to Zensus"
    metaDescription="Connect QuickBooks Online to Zensus through Intuit OAuth. Invoices, bills, and reports sync daily. Tokens are encrypted and credentials are never stored."
    sections={sections}
    serviceSchema={serviceSchema}
    related={related}
    faqs={faqs}
  />
);

export default QuickBooksIntegration;
