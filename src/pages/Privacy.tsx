import { Helmet } from "react-helmet-async";
import { breadcrumbSchema, HOME_CRUMB } from "@/lib/structured-data";

const PAGE_URL = "https://zensus.app/privacy";
const PAGE_DESCRIPTION =
  "How Zensus collects, uses, and protects your information. Bank credentials stay with Plaid, your data never trains an AI model, and every query is isolated by account.";

const breadcrumbs = breadcrumbSchema([
  HOME_CRUMB,
  { name: "Privacy Policy", url: PAGE_URL },
]);

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy · How Zensus Handles Your Data</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:site_name" content="Zensus" />
        <meta property="og:title" content="Privacy Policy · How Zensus Handles Your Data" />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:image" content="https://zensus.app/og/privacy.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Privacy Policy social preview card" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy · How Zensus Handles Your Data" />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
        <meta name="twitter:image" content="https://zensus.app/og/privacy.png" />
        <link rel="canonical" href={PAGE_URL} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>
      </Helmet>
      <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Last Updated: May 18, 2026
          </p>
        </header>

        {/* Content */}
        <div className="space-y-10">
          {/* Introduction */}
          <section>
            <p className="text-foreground/80 mb-4">
              We at Zensus Inc. (together with our affiliates, "Zensus," "we," "our," or "us") respect your privacy and are strongly committed to keeping secure any information we obtain from you or about you. This Privacy Policy describes our practices with respect to Personal Data that we collect from or about you when you use our website at{' '}
              <a href="https://zensus.app" className="text-primary hover:underline">https://zensus.app</a>{' '}
              and related services (collectively, "Services").
            </p>
            <p className="text-foreground/80 mb-4">
              Zensus is a B2B SaaS platform that helps businesses manage their cash flow and runway through financial forecasting and scenario analysis tools. We are committed to transparency about how we collect, use, and protect your information.
            </p>

            <p className="text-foreground/80">
              <strong className="text-foreground">Contact Information:</strong><br />
              Zensus Inc.<br />
              Email: <a href="mailto:hello@zensus.app" className="text-primary hover:underline">hello@zensus.app</a><br />
              Website: <a href="https://zensus.app" className="text-primary hover:underline">https://zensus.app</a>
            </p>
          </section>

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Personal Data We Collect</h2>

            <p className="text-foreground/80 mb-4">
              We collect Personal Data about you when you use our Services. "Personal Data" means information that identifies, relates to, describes, or is reasonably capable of being associated with you. The categories of Personal Data we collect depend on how you interact with our Services.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">1.1 Account Information</h3>
            <p className="text-foreground/80 mb-3">When you create an account, we collect:</p>

            <div className="rounded-lg border border-border bg-muted/30 p-5 my-4 space-y-4">
              <div>
                <p className="font-semibold text-foreground mb-2">Via Email Sign-In (Magic Link):</p>
                <ul className="list-disc pl-6 space-y-1 text-foreground/80 text-sm">
                  <li>Email address</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-2">Via Google OAuth or Sign in with Apple:</p>
                <ul className="list-disc pl-6 space-y-1 text-foreground/80 text-sm">
                  <li>Email address (or Apple-relay address for Sign in with Apple)</li>
                  <li>Full name (if provided by the identity provider)</li>
                  <li>Profile picture URL (if provided by the identity provider)</li>
                  <li>Provider subject identifier</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-2">Account Data Stored:</p>
                <ul className="list-disc pl-6 space-y-1 text-foreground/80 text-sm">
                  <li>User ID (unique identifier)</li>
                  <li>Email address</li>
                  <li>Full name (optional)</li>
                  <li>Avatar URL (optional)</li>
                </ul>
              </div>
            </div>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">1.2 Financial Data You Provide</h3>
            <p className="text-foreground/80 mb-3">When you use our runway calculator or forecast features, we process:</p>

            <div className="rounded-lg border border-border bg-muted/30 p-5 my-4 space-y-4">
              <div>
                <p className="font-semibold text-foreground mb-2">Runway Calculator Inputs:</p>
                <ul className="list-disc pl-6 space-y-1 text-foreground/80 text-sm">
                  <li>Current cash balance</li>
                  <li>Monthly revenue</li>
                  <li>Expense categories (payroll, rent, software, marketing, etc.)</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-2">Forecast File Uploads:</p>
                <ul className="list-disc pl-6 space-y-1 text-foreground/80 text-sm">
                  <li>Excel/CSV files containing financial data</li>
                  <li>Extracted data: cash balances, revenue streams, expenses, period data</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-2">QuickBooks Integration (Optional):</p>
                <ul className="list-disc pl-6 space-y-1 text-foreground/80 text-sm">
                  <li>Financial data synced from your QuickBooks account (only with your explicit authorization)</li>
                  <li>You can disconnect QuickBooks at any time</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-2">Bank Account Integration via Plaid (Optional):</p>
                <ul className="list-disc pl-6 space-y-1 text-foreground/80 text-sm">
                  <li>If you connect your bank account, we use Plaid Technologies, Inc. to link your financial institution</li>
                  <li>Data synced includes: account names, account types, last 4 digits of account number, and transaction history (dates, amounts, merchant names, and categories)</li>
                  <li>Bank account credentials are never stored by Zensus; they are handled directly and securely by Plaid</li>
                  <li>Plaid's privacy policy applies to data collected during bank linking:{' '}
                    <a href="https://plaid.com/legal/#consumers" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://plaid.com/legal/#consumers</a>
                  </li>
                  <li>You can disconnect your bank account at any time from your account settings</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-2">HubSpot CRM Integration (Optional):</p>
                <ul className="list-disc pl-6 space-y-1 text-foreground/80 text-sm">
                  <li>If you connect HubSpot, we sync contacts, companies, line items, invoices, and subscriptions from your CRM</li>
                  <li>Used to project recurring billing into your runway forecast</li>
                  <li>You can disconnect HubSpot at any time from your account settings</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-2">Slack Workspace Integration (Optional):</p>
                <ul className="list-disc pl-6 space-y-1 text-foreground/80 text-sm">
                  <li>If you connect Slack, we store OAuth tokens (encrypted at rest), the channel IDs you select for alert delivery, and the contents of alert messages we send to your workspace</li>
                  <li>Alert message contents are aggregated cash-flow signals; we do not send transaction-level data to Slack</li>
                </ul>
              </div>
            </div>

            <div className="rounded-lg border border-primary/30 bg-primary/5 p-5 my-4">
              <p className="font-semibold text-foreground mb-2">Data Processing Note:</p>
              <p className="text-foreground/80 text-sm">
                Financial data you upload is processed to generate forecasts and runway calculations. We do not share your raw financial data with third parties except as described in Section 3 (Service Providers). Your uploaded files are processed and the extracted data is used only to provide the Services you request. Your data is never used to train an AI model.
              </p>
            </div>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">1.3 Information Collected Automatically</h3>
            <p className="text-foreground/80 mb-3">When you use our Services, we automatically collect:</p>

            <div className="rounded-lg border border-border bg-muted/30 p-5 my-4 space-y-4">
              <div>
                <p className="font-semibold text-foreground mb-2">Server-side Operational Telemetry:</p>
                <ul className="list-disc pl-6 space-y-1 text-foreground/80 text-sm">
                  <li>Request logs (path, status code, timing) retained for operational and security purposes</li>
                  <li>Application logs containing user IDs and request paths (via AWS CloudWatch)</li>
                  <li>Marketing-site request and performance metrics via Vercel hosting</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-2">Technical Information:</p>
                <ul className="list-disc pl-6 space-y-1 text-foreground/80 text-sm">
                  <li>Browser type and version</li>
                  <li>IP address (used for general geographic location and abuse prevention; on integration connect we run a server-side IP geolocation / VPN-proxy check via ipapi.co)</li>
                  <li>Time zone</li>
                  <li>Referral sources</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-2">Marketing-site Sales Intelligence:</p>
                <ul className="list-disc pl-6 space-y-1 text-foreground/80 text-sm">
                  <li>On the public marketing site at <a href="https://zensus.app" className="text-primary hover:underline">zensus.app</a>, we run Apollo.io's website tracker. Apollo performs reverse-IP lookups against its business database to identify the company an anonymous visitor's IP is associated with; it does not identify the individual visitor</li>
                  <li>This only runs on the marketing site, not inside the authenticated product app</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-2">Product &amp; Marketing Analytics:</p>
                <ul className="list-disc pl-6 space-y-1 text-foreground/80 text-sm">
                  <li>We use PostHog (PostHog, Inc.) for analytics across our marketing site (<a href="https://zensus.app" className="text-primary hover:underline">zensus.app</a>) and the product app (app.zensus.app). PostHog records page views, navigation, and funnel events, and sets a first-party analytics cookie scoped to the .zensus.app domain so a single visit is measured consistently across both sites. This data is stored in PostHog's US cloud.</li>
                  <li>PostHog also captures session recordings (replays of on-page interactions) to help us debug and improve the experience; form inputs are masked by default.</li>
                  <li>This activity is pseudonymous — tied to a random identifier, not your name — until you sign in. See{' '}
                    <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">PostHog's Privacy Policy</a>.</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-2">Support-form Bot Protection:</p>
                <ul className="list-disc pl-6 space-y-1 text-foreground/80 text-sm">
                  <li>When you submit the contact form on our support page (<a href="https://zensus.app/support" className="text-primary hover:underline">zensus.app/support</a>), we use Cloudflare Turnstile to confirm the submission is not automated. Turnstile runs invisibly and may collect your IP address, user-agent, and a verification token to make that determination. It protects the form from spam and abuse and does not track you across sites. See Cloudflare's{' '}
                    <a href="https://www.cloudflare.com/turnstile-privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Turnstile Privacy Addendum</a>.</li>
                </ul>
              </div>
            </div>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">1.4 Payment Information</h3>
            <p className="text-foreground/80 mb-3">When you subscribe to our paid services:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>Payment card information is processed by Stripe; full card numbers never reach Zensus</li>
              <li>Billing email address</li>
              <li>Stripe customer ID and subscription / price IDs</li>
              <li>Subscription status (active, paused, canceled)</li>
              <li>Transaction history</li>
            </ul>
            <p className="text-foreground/80 mt-3">
              See{' '}
              <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Stripe's Privacy Policy</a>{' '}
              for details on how they handle payment data.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">1.5 Cookies and Local Storage</h3>
            <p className="text-foreground/80 mb-3">We use cookies and browser storage for:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li><strong className="text-foreground">Essential Cookies:</strong> Authentication session management (httpOnly, secure)</li>
              <li><strong className="text-foreground">Analytics Cookies:</strong> PostHog sets a first-party analytics cookie on the .zensus.app domain (shared across our marketing site and app) to measure usage and funnels, as described in section 1.3</li>
              <li><strong className="text-foreground">Local Storage:</strong> Runway calculator state and analytics identifiers (persisted locally for convenience)</li>
            </ul>
            <p className="text-foreground/80 mt-3">
              Server-side operational telemetry is also collected via AWS CloudWatch. You can disable analytics cookies and session recording through your browser settings without affecting your ability to use the product; disabling essential cookies will prevent you from using authenticated features.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Personal Data</h2>

            <p className="text-foreground/80 mb-4">We use the Personal Data we collect for the following purposes:</p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">2.1 To Provide Our Services</h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>Create, maintain, and authenticate your account</li>
              <li>Process your financial data to generate runway calculations and forecasts</li>
              <li>Enable AI-powered scenario analysis using your financial data</li>
              <li>Store and retrieve your runway snapshots</li>
              <li>Sync data from QuickBooks, HubSpot, Plaid, or Slack (if you connect them)</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">2.2 To Improve Our Services</h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Identify and fix bugs and performance issues</li>
              <li>Develop new features based on user needs</li>
              <li>Generate aggregated, de-identified statistics</li>
            </ul>
            <p className="text-foreground/80 mt-3">
              Your data is never used to train an AI model. Our AI scenario analysis runs inference on Claude models hosted on AWS Bedrock under our AWS account; in that configuration Anthropic does not access the data we send to Bedrock for inference.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">2.3 To Communicate With You</h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>Send service-related notifications and updates</li>
              <li>Respond to your questions and support requests</li>
              <li>Notify you of changes to our Services, policies, or terms</li>
              <li>Send marketing communications (with your consent; you may opt out at any time)</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">2.4 To Process Payments</h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>Process subscription payments via Stripe</li>
              <li>Manage billing and invoicing</li>
              <li>Handle subscription changes and refund requests</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">2.5 For Security and Legal Compliance</h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>Detect and prevent fraud and security incidents</li>
              <li>Enforce our Terms of Service</li>
              <li>Comply with legal obligations</li>
              <li>Protect our rights, property, and safety</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">2.6 Legal Basis for Processing (for EEA/UK users)</h3>
            <p className="text-foreground/80 mb-3">If you are located in the European Economic Area or United Kingdom, we process your Personal Data based on:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li><strong className="text-foreground">Contractual Necessity:</strong> To provide the Services you've requested</li>
              <li><strong className="text-foreground">Legitimate Interests:</strong> To improve our Services and ensure security</li>
              <li><strong className="text-foreground">Consent:</strong> For marketing communications</li>
              <li><strong className="text-foreground">Legal Obligation:</strong> To comply with applicable laws</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Disclosure of Personal Data</h2>

            <p className="text-foreground/80 mb-4">
              We do not sell your Personal Data. We share your data with third parties only as described below:
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">3.1 Service Providers (Subprocessors)</h3>
            <p className="text-foreground/80 mb-3">
              The principal third-party services we use to operate Zensus are listed below. For the complete and current list, including data shared and country of processing for each, see our public subprocessor page at{' '}
              <a href="https://zensus.app/subprocessors" className="text-primary hover:underline">https://zensus.app/subprocessors</a>.
            </p>

            <div className="rounded-lg border border-border bg-muted/30 p-5 my-4 space-y-3">
              <div>
                <p className="font-semibold text-foreground">Amazon Web Services (AWS)</p>
                <p className="text-foreground/80 text-sm">Cloud infrastructure, database hosting (RDS Postgres), transactional email (SES), application logs (CloudWatch), and product app hosting (Amplify/CloudFront).</p>
              </div>

              <div>
                <p className="font-semibold text-foreground">AWS Bedrock (Claude models)</p>
                <p className="text-foreground/80 text-sm">AI-powered scenario analysis. Your financial context (cash, MRR, expenses, transaction descriptors and amounts) is sent to Claude models running on Bedrock inside our AWS account. In this configuration, Anthropic (the maker of the Claude models) does not access the data we send to Bedrock.</p>
              </div>

              <div>
                <p className="font-semibold text-foreground">Supabase</p>
                <p className="text-foreground/80 text-sm">User authentication and session management, including magic-link sign-in and administrative impersonation token minting.</p>
              </div>

              <div>
                <p className="font-semibold text-foreground">Plaid Inc. (Optional)</p>
                <p className="text-foreground/80 text-sm">If you connect your bank account, we use Plaid to link your financial institution and sync transaction data. We do not store your bank login credentials. See{' '}
                  <a href="https://plaid.com/legal/#consumers" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Plaid's Privacy Policy</a>.
                </p>
              </div>

              <div>
                <p className="font-semibold text-foreground">Intuit QuickBooks (Optional)</p>
                <p className="text-foreground/80 text-sm">If you connect QuickBooks, we sync financial data (purchases, bills, payments, invoices, P&amp;L, Balance Sheet) from your account. You can disconnect at any time.</p>
              </div>

              <div>
                <p className="font-semibold text-foreground">HubSpot Inc. (Optional)</p>
                <p className="text-foreground/80 text-sm">If you connect HubSpot, we sync contacts, companies, invoices, and subscriptions to project recurring billing into your runway forecast.</p>
              </div>

              <div>
                <p className="font-semibold text-foreground">Slack Technologies LLC (Optional)</p>
                <p className="text-foreground/80 text-sm">If you connect Slack, we deliver cash-flow alerts to the channels you select. We store an encrypted workspace OAuth token.</p>
              </div>

              <div>
                <p className="font-semibold text-foreground">Stripe Inc.</p>
                <p className="text-foreground/80 text-sm">Subscription billing, webhooks, and customer portal. Card data stays at Stripe and never reaches Zensus. See{' '}
                  <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Stripe's Privacy Policy</a>.
                </p>
              </div>

              <div>
                <p className="font-semibold text-foreground">Vercel Inc.</p>
                <p className="text-foreground/80 text-sm">Hosting for our marketing site at <a href="https://zensus.app" className="text-primary hover:underline">zensus.app</a>.</p>
              </div>

              <div>
                <p className="font-semibold text-foreground">Apollo.io</p>
                <p className="text-foreground/80 text-sm">Reverse-IP sales intelligence on the marketing site only (not the product app). Apollo identifies the company an anonymous visitor's IP is associated with for outbound sales.</p>
              </div>
            </div>

            <p className="text-foreground/80 mt-3">
              Additional subprocessors used in narrower contexts (federated identity providers, web fonts, voice transcription for the voice agent, IP geolocation, etc.) are enumerated on the{' '}
              <a href="https://zensus.app/subprocessors" className="text-primary hover:underline">subprocessors page</a>.
              All service providers are contractually obligated to protect your data and use it only for the purposes we specify.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">3.2 Business Transfers</h3>
            <p className="text-foreground/80">
              If we are involved in a merger, acquisition, or sale of assets, your Personal Data may be transferred. We will notify you of any such change.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">3.3 Legal Requirements</h3>
            <p className="text-foreground/80 mb-3">We may disclose Personal Data if required by law or to:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>Comply with legal obligations or court orders</li>
              <li>Enforce our Terms of Service</li>
              <li>Protect the rights and safety of Zensus and our users</li>
              <li>Detect and prevent fraud</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">3.4 With Your Consent</h3>
            <p className="text-foreground/80">
              We may share your Personal Data with third parties when you explicitly consent, such as when you connect QuickBooks, HubSpot, Plaid, or Slack.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">3.5 Aggregated Data</h3>
            <p className="text-foreground/80">
              We may share aggregated, de-identified data that cannot identify you for research, analytics, or business purposes.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Retention</h2>

            <p className="text-foreground/80 mb-4">
              We retain your Personal Data for as long as necessary to provide the Services, comply with legal obligations, and enforce our agreements.
            </p>

            <div className="rounded-lg border border-border bg-muted/30 p-5 my-4 space-y-4">
              <div>
                <p className="font-semibold text-foreground mb-2">Account Data:</p>
                <p className="text-foreground/80 text-sm">Retained while your account is active plus 90 days after closure (unless you request immediate deletion)</p>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-2">Financial Data (Uploads, Calculations, Synced Transactions):</p>
                <p className="text-foreground/80 text-sm">Retained while your account is active. You may request deletion at any time.</p>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-2">Integration Tokens (Plaid, QuickBooks, HubSpot, Slack):</p>
                <p className="text-foreground/80 text-sm">Stored encrypted at rest while the integration is connected. Deleted on disconnect or account closure.</p>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-2">Runway Snapshots:</p>
                <p className="text-foreground/80 text-sm">Retained while your account is active for historical tracking</p>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-2">Payment Records:</p>
                <p className="text-foreground/80 text-sm">Transaction records retained for 7 years for tax and accounting purposes</p>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-2">Administrative-Access Audit Records:</p>
                <p className="text-foreground/80 text-sm">Identifying fields (your email, IP, user agent, and any free-text reason) are automatically redacted 24 months after the access event. The non-identifying audit metadata (admin email, timestamps, session outcome) is retained as a permanent security record. See § 4.2 below.</p>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-2">Server Logs and Telemetry:</p>
                <p className="text-foreground/80 text-sm">Typically retained for 30–90 days for operational and security purposes.</p>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-2">Local Storage (Browser):</p>
                <p className="text-foreground/80 text-sm">Runway calculator state persists locally until you clear browser data or sign out</p>
              </div>
            </div>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">4.1 Data Deletion</h3>
            <p className="text-foreground/80 mb-3">When you request deletion or close your account:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>We securely delete or anonymize your data</li>
              <li>Service providers are instructed to delete your data</li>
              <li>Some data may be retained for legal or regulatory purposes (e.g., payment records for tax)</li>
              <li>Backup copies may persist for a limited period</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">4.2 Administrative Access to Your Account</h3>
            <div className="rounded-lg border border-border bg-muted/30 p-5 my-4">
              <p className="text-foreground/80 text-sm mb-3">
                A small number of authorized Zensus employees can access user accounts to provide support, investigate incidents, or comply with legal process. Every such access is recorded in an append-only audit log capturing the admin's identity, the time of access, the originating IP and user agent, and a stated reason. Administrative access requires a second authentication factor (TOTP) and is rate-limited.
              </p>
              <p className="text-foreground/80 text-sm">
                To balance our duty to maintain a durable security record with your right to data minimization, the user-identifying fields on each audit record (your email, the IP it was accessed from, the user agent, and the free-text reason) are automatically redacted by a scheduled job 24 months after the access event. The structural metadata (admin email, timestamps, session outcome) is retained as a permanent security record.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Your Rights</h2>

            <p className="text-foreground/80 mb-4">
              Depending on your location, you may have certain rights regarding your Personal Data. We honor these rights regardless of your location.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">5.1 Access and Portability</h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li><strong className="text-foreground">Right to Access:</strong> Request a copy of the Personal Data we hold about you</li>
              <li><strong className="text-foreground">Right to Data Portability:</strong> Request your data in a structured, machine-readable format</li>
            </ul>
            <p className="text-foreground/80 mt-3">
              Authenticated Zensus users can export their personal data in JSON form from the product app at <a href="https://app.zensus.app" className="text-primary hover:underline">app.zensus.app</a>. We may also fulfill access and portability requests by email (see § 5.5).
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">5.2 Correction and Deletion</h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li><strong className="text-foreground">Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong className="text-foreground">Right to Erasure:</strong> Request deletion of your Personal Data</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">5.3 Restriction and Objection</h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li><strong className="text-foreground">Right to Restrict Processing:</strong> Limit how we use your data</li>
              <li><strong className="text-foreground">Right to Object:</strong> Object to processing for marketing purposes</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">5.4 Marketing Opt-Out</h3>
            <p className="text-foreground/80">
              You can unsubscribe from marketing emails using the link in the email. We will still send essential service-related communications.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">5.5 How to Exercise Your Rights</h3>
            <p className="text-foreground/80 mb-3">To exercise any of these rights:</p>
            <ol className="list-decimal pl-6 space-y-1 text-foreground/80">
              <li>Email us at <a href="mailto:hello@zensus.app" className="text-primary hover:underline">hello@zensus.app</a></li>
              <li>Specify which right(s) you wish to exercise</li>
              <li>We will verify your identity and respond within 30 days</li>
            </ol>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">5.6 Complaints</h3>
            <p className="text-foreground/80 mb-3">If you believe we have not complied with privacy laws, you may lodge a complaint with:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>Us directly at <a href="mailto:hello@zensus.app" className="text-primary hover:underline">hello@zensus.app</a></li>
              <li>Your local data protection authority (for EEA/UK residents)</li>
              <li>The Federal Trade Commission (for U.S. residents)</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Children</h2>

            <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-5 my-4">
              <p className="font-semibold text-foreground mb-2">Age Requirement</p>
              <p className="text-foreground/80 text-sm">
                Our Services are designed for businesses and are not intended for individuals under 18. We do not knowingly collect Personal Data from anyone under 18. If you believe a child has provided data to us, contact us at{' '}
                <a href="mailto:hello@zensus.app" className="text-primary hover:underline">hello@zensus.app</a>{' '}
                and we will delete it promptly.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Security</h2>

            <p className="text-foreground/80 mb-4">
              We implement appropriate technical and organizational measures to protect your Personal Data.
            </p>

            <div className="rounded-lg border border-border bg-muted/30 p-5 my-4 space-y-4">
              <div>
                <p className="font-semibold text-foreground mb-2">Technical Safeguards:</p>
                <ul className="list-disc pl-6 space-y-1 text-foreground/80 text-sm">
                  <li><strong className="text-foreground">Encryption:</strong> TLS 1.3 in transit; AES-256-GCM at rest for OAuth tokens and TOTP secrets</li>
                  <li><strong className="text-foreground">Authentication:</strong> JWT tokens in httpOnly cookies, PKCE for OAuth</li>
                  <li><strong className="text-foreground">Infrastructure:</strong> AWS with enterprise-grade security</li>
                  <li><strong className="text-foreground">Access Controls:</strong> Role-based access; administrative access protected by TOTP and recorded in an append-only audit log</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-2">Payment Security:</p>
                <ul className="list-disc pl-6 space-y-1 text-foreground/80 text-sm">
                  <li>Payment processing through PCI DSS compliant Stripe</li>
                  <li>We do not store full payment card numbers</li>
                </ul>
              </div>
            </div>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">7.1 Your Responsibilities</h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>Keep your email account secure (used for magic link authentication)</li>
              <li>Log out from shared devices</li>
              <li>Report suspicious activity to us</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">7.2 Breach Notification</h3>
            <p className="text-foreground/80">
              In the event of a data breach affecting your Personal Data, we will notify affected users without undue delay, consistent with our obligations under applicable law. Notice will include the nature of the breach, the categories of data affected, the steps we are taking to address it, and the steps you can take to protect yourself.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. U.S. State Privacy Rights</h2>

            <p className="text-foreground/80 mb-4">
              If you are a resident of California, Virginia, Colorado, Connecticut, Utah, or other states with privacy laws, you have additional rights.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">8.1 California Residents (CCPA/CPRA)</h3>
            <div className="rounded-lg border border-border bg-muted/30 p-5 my-4 space-y-4">
              <div>
                <p className="font-semibold text-foreground mb-2">Categories of Personal Information Collected:</p>
                <ul className="list-disc pl-6 space-y-1 text-foreground/80 text-sm">
                  <li>Identifiers (email, name, federated identity provider subject)</li>
                  <li>Financial information (data you upload or sync for runway/forecast)</li>
                  <li>Internet activity (limited server-side telemetry; marketing-site reverse-IP intelligence via Apollo)</li>
                  <li>Geolocation (general location from IP address)</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-2">Your Rights:</p>
                <ul className="list-disc pl-6 space-y-1 text-foreground/80 text-sm">
                  <li>Right to Know what data we collect and share</li>
                  <li>Right to Delete your Personal Information</li>
                  <li>Right to Correct inaccurate information</li>
                  <li>Right to Opt-Out of sale (Note: We do not sell your data)</li>
                  <li>Right to Non-Discrimination for exercising your rights</li>
                </ul>
              </div>
            </div>

            <p className="text-foreground/80 mb-3">
              <strong className="text-foreground">We do not sell or share Personal Information</strong> for cross-context behavioral advertising.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">8.2 Other State Residents</h3>
            <p className="text-foreground/80">
              If you are a resident of Virginia, Colorado, Connecticut, Utah, or Nevada, you have similar rights to access, correct, delete, and port your data. Contact us at{' '}
              <a href="mailto:hello@zensus.app" className="text-primary hover:underline">hello@zensus.app</a>{' '}
              to exercise these rights.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Changes to This Privacy Policy</h2>

            <p className="text-foreground/80 mb-4">
              We may update this Privacy Policy from time to time. When we make changes:
            </p>

            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>We will update the "Last Updated" date at the top</li>
              <li>For material changes, we will notify you via email or prominent notice in the Services</li>
              <li>Your continued use after changes constitutes acceptance</li>
            </ul>

            <p className="text-foreground/80 mt-4">
              If you do not agree to changes, you must stop using the Services and may delete your account.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contact Us</h2>

            <p className="text-foreground/80 mb-4">
              If you have questions about this Privacy Policy or our privacy practices:
            </p>

            <div className="rounded-lg border border-border bg-muted/30 p-5 my-4">
              <p className="font-semibold text-foreground mb-2">Zensus Inc.</p>
              <p className="text-foreground/80 text-sm">
                <strong className="text-foreground">Email:</strong>{' '}
                <a href="mailto:hello@zensus.app" className="text-primary hover:underline">hello@zensus.app</a><br />
                <strong className="text-foreground">Website:</strong>{' '}
                <a href="https://zensus.app" className="text-primary hover:underline">https://zensus.app</a>
              </p>
              <p className="text-foreground/80 text-sm mt-2">
                <strong className="text-foreground">For Privacy Requests:</strong> Use subject line "Privacy Request" or "Data Rights Request"
              </p>
            </div>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">Response Times</h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>General questions: 5 business days</li>
              <li>Data access/deletion requests: 30 days</li>
              <li>Security concerns: 24-48 hours</li>
            </ul>
          </section>

          {/* Final Statement */}
          <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-6 mt-12 text-center">
            <p className="font-semibold text-foreground mb-2">
              Thank you for trusting Zensus with your data.
            </p>
            <p className="text-sm text-muted-foreground">
              We are committed to protecting your privacy and being transparent about our data practices.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              © {new Date().getFullYear()} Zensus Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}
