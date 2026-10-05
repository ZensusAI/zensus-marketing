import { SITE_URL } from "@/lib/constants";
import { Link } from "react-router-dom";
import {
  IntegrationPage,
  IntegrationRelatedLink,
  IntegrationSection,
} from "@/components/integrations/IntegrationPage";
import hubspotLogo from "@/assets/integrations/hubspot.svg";

const linkCls = "font-medium text-primary underline-offset-4 hover:underline";

const sections: IntegrationSection[] = [
  {
    heading: "What Zensus reads",
    body: (
      <>
        <p>
          Invoices and subscriptions. For each invoice: its number, status,
          amount billed, balance due, due date, and currency. For each
          subscription: its name, status, billing frequency, next payment
          amount and date, last payment amount, and currency.
        </p>
        <p>
          Subscriptions are part of HubSpot's Commerce Hub, so they sync only
          if your HubSpot account has them.
        </p>
      </>
    ),
  },
  {
    heading: "What Zensus does not read",
    body: (
      <>
        <p>
          Deals, deal stages, and deal probability. Zensus does not sync your
          open pipeline. Emails, chat logs, and marketing data stay in
          HubSpot.
        </p>
        <p>
          HubSpot's permission screen also lists read access to contacts,
          companies, and line items. Zensus does not sync or store those
          records.
        </p>
      </>
    ),
  },
  {
    heading: "What it does in your forecast",
    body: (
      <p>
        Unpaid invoices count toward the money you are owed. Each subscription
        is projected at its own billing frequency, so an annual or quarterly
        contract lands as one payment on its date, not as twelve equal months.
      </p>
    ),
  },
  {
    heading: "How to connect",
    body: (
      <ol className="list-decimal space-y-2 pl-5">
        <li>In Zensus, open Settings, then Integrations, and connect HubSpot.</li>
        <li>Sign in to HubSpot, choose the account, and approve access.</li>
        <li>Zensus receives its tokens through OAuth 2.0 and runs the first sync.</li>
      </ol>
    ),
  },
  {
    heading: "How often it syncs",
    body: (
      <p>
        HubSpot notifies Zensus by webhook when an invoice or a subscription
        changes. A daily sync runs as well. Zensus also refreshes when you
        open the app if the data is more than an hour old, and you can press
        Sync at any time.
      </p>
    ),
  },
  {
    heading: "Currencies",
    body: (
      <p>
        Zensus does not convert currencies. If your HubSpot invoices are in
        more than one currency, the total you are owed uses the currency most
        of them are in and leaves the others out. Each subscription keeps its
        own currency.
      </p>
    ),
  },
  {
    heading: "How to disconnect",
    body: (
      <p>
        Open Settings, then Integrations, and disconnect HubSpot. Zensus
        revokes its refresh token with HubSpot, deletes the stored tokens, and
        stops syncing. You can also uninstall Zensus from the connected apps
        in your HubSpot account. Data that was already synced is kept while
        your Zensus account is active, as the{" "}
        <Link to="/privacy" className={linkCls}>
          Privacy Policy
        </Link>{" "}
        describes, and you can ask for it to be deleted at any time.
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

const faqs = [
  {
    question: "Does Zensus read my HubSpot deals or pipeline?",
    answer:
      "No. Zensus reads HubSpot invoices and subscriptions. It does not sync deals, deal stages, or deal probability. To see what an open deal would do to your cash, describe it to the cash flow agent as a scenario.",
  },
  {
    question: "How does Zensus treat annual and quarterly contracts?",
    answer:
      "Each HubSpot subscription is projected at its own billing frequency. An annual contract shows as one payment on its billing date, not as twelve equal monthly amounts.",
  },
  {
    question: "How often does HubSpot data update in Zensus?",
    answer:
      "HubSpot notifies Zensus by webhook when an invoice or a subscription changes, and a daily sync runs as well. Zensus also refreshes when you open the app if the data is more than an hour old.",
  },
  {
    question: "Does Zensus convert currencies from HubSpot?",
    answer:
      "No. If your invoices are in more than one currency, the total you are owed uses the currency most of them are in and leaves the others out. Each subscription keeps its own currency.",
  },
  {
    question: "What happens to my data if I disconnect HubSpot?",
    answer:
      "Zensus revokes its refresh token with HubSpot, deletes the stored tokens, and stops syncing. Data that was already synced is kept while your Zensus account is active, and you can ask for it to be deleted at any time.",
  },
];

const related: IntegrationRelatedLink[] = [
  {
    to: "/blog/hubspot-pipeline-to-cash-forecast",
    label: "How to forecast cash from your sales pipeline",
    description:
      "A method for turning an open pipeline into expected cash, using probability, billing terms, and contract timing.",
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
    "Connect HubSpot to Zensus via OAuth so invoices and subscriptions feed cash flow projections that respect annual and quarterly contract terms.",
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
    tagline="Invoices and subscriptions feed your cash flow forecast. Annual and quarterly contracts hit on their real dates, not smeared into MRR."
    logoSrc={hubspotLogo}
    metaTitle="HubSpot Integration · Invoices & Subscriptions in Zensus"
    metaDescription="Connect HubSpot to Zensus through OAuth. Invoices and subscriptions feed a cash flow forecast that puts annual and quarterly contracts on their real dates."
    sections={sections}
    serviceSchema={serviceSchema}
    related={related}
    faqs={faqs}
  />
);

export default HubSpotIntegration;
