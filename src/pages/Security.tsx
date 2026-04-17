import { Helmet } from "react-helmet-async";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { TalkToUsButton } from "@/components/landing/TalkToUsButton";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2 className="text-xl font-semibold mb-3 text-foreground">{title}</h2>
    <div className="text-muted-foreground leading-relaxed space-y-3">{children}</div>
  </section>
);

const Security = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Security at Zensus</title>
      <meta
        name="description"
        content="How Zensus protects your financial data. AES-256-GCM at rest, bank-level OAuth via Plaid and Intuit, account-level isolation, and zero AI training on your data."
      />
      <meta property="og:title" content="Security at Zensus" />
      <meta
        property="og:description"
        content="How Zensus protects your financial data. Bank-level OAuth, encryption at rest, account-level isolation."
      />
    </Helmet>
    <Navbar />
    <main className="pt-24 pb-16">
      <div className="section-container max-w-3xl">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
          How Zensus handles your financial data
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          Zensus is built for founders who need real-time cash forecasting
          across multiple financial tools. That access is serious. Here is
          exactly what we hold, what we do not, and how it is protected.
        </p>

        <Section title="Data flow at a glance">
          <p>
            You connect Plaid, QuickBooks, or HubSpot through OAuth. Those
            providers hold the credentials. Zensus receives scoped OAuth tokens,
            pulls the data we are authorized to read, and stores only what we
            need to compute your runway. Data moves over TLS. At rest, it
            lives on encrypted AWS infrastructure.
          </p>
        </Section>

        <Section title="What Zensus stores">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              OAuth tokens for each connected provider, encrypted at rest with
              AES-256-GCM.
            </li>
            <li>
              Transactions and balances within the sync window required to
              project your runway.
            </li>
            <li>Scenario chat history for your account only.</li>
            <li>Derived runway projections and alert state.</li>
          </ul>
        </Section>

        <Section title="What Zensus never stores">
          <ul className="list-disc pl-5 space-y-2">
            <li>Bank or QuickBooks passwords. Plaid and Intuit hold those.</li>
            <li>Payment card details.</li>
            <li>
              Raw transactions outside the sync window needed for projections.
            </li>
          </ul>
        </Section>

        <Section title="Account-level isolation">
          <p>
            Every database query is filtered by user ID. Zensus staff cannot
            access your data without an explicit authorization path that is
            audited. Cross-account access is not possible by design, not just
            by policy.
          </p>
        </Section>

        <Section title="CI security">
          <p>
            Our backend repository runs Semgrep static analysis on every
            commit. Gitleaks scans for accidentally committed credentials and
            blocks PRs that introduce them. Dependencies are kept current
            through automated vulnerability alerts.
          </p>
        </Section>

        <Section title="AI and your data">
          <p>
            Your data never trains any AI model. When you run a scenario, your
            data is sent per request to Claude, analyzed, and the conversation
            returns to you. No fine-tuning, no memory, no training, no data
            crossing into other customer accounts.
          </p>
        </Section>

        <Section title="Compliance posture">
          <p>
            Zensus is not yet SOC 2 certified. We are working toward it. In
            the meantime, our data protection and access control practices are
            documented and reviewable on request. If your procurement process
            needs specific evidence, talk to us and we will share what we
            have.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Security questions, disclosures, or procurement inquiries go to{" "}
            <a
              href="mailto:security@zensus.app"
              className="text-primary hover:underline"
            >
              security@zensus.app
            </a>
            . Response time is typically within one business day.
          </p>
        </Section>

        <div className="mt-12 text-center">
          <TalkToUsButton size="lg" />
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Security;
