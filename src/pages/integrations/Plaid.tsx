import { SITE_URL } from "@/lib/constants";
import {
  IntegrationPage,
  IntegrationRelatedLink,
  IntegrationSection,
} from "@/components/integrations/IntegrationPage";
import plaidLogo from "@/assets/integrations/plaid.svg";

const sections: IntegrationSection[] = [
  {
    heading: "What Zensus reads",
    body: (
      <p>
        Bank transactions, account balances, and account names with the last
        four digits of each account number, for every institution you connect
        through Plaid. Zensus also reads the institution's name, so you can
        tell your accounts apart.
      </p>
    ),
  },
  {
    heading: "What Zensus never reads",
    body: (
      <p>
        Your bank password, your full account number, or your routing number.
        Zensus asks Plaid for one product, Transactions. It does not ask for
        Plaid's Auth or Identity products, which are the ones that return
        account numbers and account-holder details. You enter your bank login
        in Plaid's window, and it never reaches Zensus.
      </p>
    ),
  },
  {
    heading: "What it does in your forecast",
    body: (
      <p>
        Your balances are the cash your forecast starts from, and your
        transactions show the money that has actually moved. Both come
        straight from the bank, not from a spreadsheet export, so the date
        your cash is projected to run out rests on what has cleared.
      </p>
    ),
  },
  {
    heading: "How to connect",
    body: (
      <ol className="list-decimal space-y-2 pl-5">
        <li>In Zensus, open Settings, then Integrations, and choose to connect a bank.</li>
        <li>Plaid opens in its own window. Pick your bank and sign in there.</li>
        <li>
          Plaid hands Zensus an access token. Zensus stores it encrypted with
          AES-256-GCM and runs the first sync.
        </li>
      </ol>
    ),
  },
  {
    heading: "How often it syncs",
    body: (
      <p>
        Plaid notifies Zensus by webhook when new transactions are ready, and
        Zensus syncs then. A daily sync runs as a fallback. Zensus also
        refreshes when you open the app if the data is more than an hour old,
        and you can press Sync at any time. How soon a transaction appears
        depends on when your bank reports it to Plaid.
      </p>
    ),
  },
  {
    heading: "How to disconnect",
    body: (
      <p>
        Open Settings, then Integrations, and disconnect the bank. Zensus asks
        Plaid to remove the connection, which ends its access. It deletes the
        stored access token and the synced bank transactions right away.
      </p>
    ),
  },
  {
    heading: "Security specifics",
    body: (
      <p>
        The Plaid access token is encrypted at rest with AES-256-GCM. Zensus
        never stores bank credentials. The connection is read-only: Zensus
        reads transactions and balances and cannot move money.
      </p>
    ),
  },
];

const faqs = [
  {
    question: "Does Zensus see my bank password?",
    answer:
      "No. You sign in to your bank inside Plaid's window. Zensus receives an access token from Plaid, never your login.",
  },
  {
    question: "Does Zensus get my account number or routing number?",
    answer:
      "No. Zensus requests only Plaid's Transactions product, so it receives account names and the last four digits of each account number. It does not receive full account numbers or routing numbers.",
  },
  {
    question: "Can Zensus move money out of my account?",
    answer:
      "No. The connection is read-only. Zensus reads transactions and balances and has no way to start a payment or a transfer.",
  },
  {
    question: "How current is my bank data in Zensus?",
    answer:
      "Plaid tells Zensus by webhook when new transactions are ready, and a daily sync runs as a fallback. Zensus also refreshes when you open the app if the data is more than an hour old, and you can sync by hand at any time.",
  },
  {
    question: "What happens to my bank data if I disconnect?",
    answer:
      "Zensus asks Plaid to remove the connection, then deletes the stored access token and the synced bank transactions right away.",
  },
];

const related: IntegrationRelatedLink[] = [
  {
    to: "/security",
    label: "How Zensus handles your financial data",
    description:
      "Encryption, OAuth, account-level isolation, and US data residency.",
  },
  {
    to: "/subprocessors",
    label: "Subprocessors",
    description:
      "Every third-party service that touches customer data, including Plaid.",
  },
  {
    to: "/blog/zero-cash-date-for-founders",
    label: "Zero cash date",
    description:
      "How a live bank balance turns into the date your cash runs out, calculated weekly.",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Zensus + Plaid bank integration",
  serviceType: "Bank account data integration for cash flow forecasting",
  description:
    "Connect your bank account to Zensus via Plaid for read-only, automatic transaction sync and cash flow projections based on actual cleared transactions.",
  provider: { "@id": `${SITE_URL}/#organization` },
  areaServed: "US",
  url: `${SITE_URL}/integrations/plaid`,
  isRelatedTo: {
    "@type": "Organization",
    name: "Plaid",
    url: "https://plaid.com",
  },
  audience: {
    "@type": "Audience",
    audienceType: "Businesses of any size",
  },
};

const PlaidIntegration = () => (
  <IntegrationPage
    slug="plaid"
    displayName="bank via Plaid"
    tagline="Bank transactions and account balances, read-only and synced automatically. No CSV uploads, no brittle scrapers."
    logoSrc={plaidLogo}
    metaTitle="Plaid Integration · Connect Your Bank to Zensus"
    metaDescription="Connect your bank to Zensus through Plaid. Read-only transactions and balances, synced by webhook, with no bank credentials stored."
    sections={sections}
    serviceSchema={serviceSchema}
    related={related}
    faqs={faqs}
  />
);

export default PlaidIntegration;
