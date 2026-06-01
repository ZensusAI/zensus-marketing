import { Helmet } from "react-helmet-async";
import { breadcrumbSchema, HOME_CRUMB } from "@/lib/structured-data";

const PAGE_URL = "https://zensus.app/terms";
const PAGE_DESCRIPTION =
  "Terms of Service for the Zensus platform. Subscription terms, acceptable use, intellectual property, and account responsibilities.";

const breadcrumbs = breadcrumbSchema([
  HOME_CRUMB,
  { name: "Terms of Service", url: PAGE_URL },
]);

export default function TermsPage() {
  return (
    <>
      <Helmet>
        <title>Terms of Service · Zensus Cash Flow Platform</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:site_name" content="Zensus" />
        <meta property="og:title" content="Terms of Service · Zensus Cash Flow Platform" />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:image" content="https://zensus.app/og/terms.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Terms of Service social preview card" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Terms of Service · Zensus Cash Flow Platform" />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
        <meta name="twitter:image" content="https://zensus.app/og/terms.png" />
        <link rel="canonical" href={PAGE_URL} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>
      </Helmet>
      <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground">
            Last Updated: May 18, 2026
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {/* Thank You Section */}
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-6 mb-8 not-prose">
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Thank you for using Zensus!
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              We're grateful you've chosen Zensus to help manage your business finances. Zensus is a B2B SaaS platform designed to help businesses understand their cash flow, calculate runway, and make data-driven financial decisions through AI-powered forecasting and scenario analysis.
            </p>
          </div>

          {/* Section 1 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Who We Are</h2>
            <p className="text-foreground/80 mb-4">
              Zensus Inc. ("Zensus," "we," "us," or "our") is a Delaware C-Corporation operating the Zensus platform at{' '}
              <a href="https://zensus.app" className="text-primary hover:underline">https://zensus.app</a>{' '}
              (the "Services"). We provide B2B SaaS tools for financial forecasting, runway calculation, and cash flow analysis.
            </p>

            <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-5 my-6 not-prose">
              <p className="font-semibold text-foreground mb-2">Important Notice:</p>
              <p className="text-foreground/80 text-sm leading-relaxed">
                Zensus provides financial analysis tools and AI-powered scenario generation for business planning purposes. The forecasts, projections, and recommendations provided through our Services are for informational purposes only and should not be considered professional financial, investment, tax, or legal advice. We are not a registered investment advisor, broker-dealer, or financial planner. Always consult with qualified financial professionals before making significant business or financial decisions.
              </p>
            </div>

            <p className="text-foreground/80">
              <strong className="text-foreground">Contact Information:</strong><br />
              Email: <a href="mailto:hello@zensus.app" className="text-primary hover:underline">hello@zensus.app</a><br />
              Website: <a href="https://zensus.app" className="text-primary hover:underline">https://zensus.app</a>
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Registration and Access</h2>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">2.1 Account Creation</h3>
            <p className="text-foreground/80 mb-3">To access our Services, you must create an account using one of the following methods:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80 mb-4">
              <li>Email sign-in with magic link (passwordless authentication)</li>
              <li>Google OAuth (single sign-on)</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">2.2 Account Responsibility</h3>
            <p className="text-foreground/80 mb-3">You are solely responsible for:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>Maintaining the security of your email account (used for authentication)</li>
              <li>All activities that occur under your account</li>
              <li>Ensuring the accuracy of your account information</li>
              <li>Notifying us immediately at <a href="mailto:hello@zensus.app" className="text-primary hover:underline">hello@zensus.app</a> of any unauthorized access</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">2.3 Account Eligibility</h3>
            <p className="text-foreground/80">
              You must be at least 18 years old and have the authority to bind your organization (if applicable) to these Terms. By creating an account, you represent and warrant that you meet these requirements.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">2.4 Account Security</h3>
            <p className="text-foreground/80 mb-3">You agree to:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>Keep your email account secure (it's used for magic link authentication)</li>
              <li>Not share access to your Zensus account with unauthorized individuals</li>
              <li>Log out from shared or public devices</li>
            </ul>
            <p className="text-foreground/80 mt-3">We are not liable for any loss or damage arising from your failure to maintain account security.</p>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Using Our Services</h2>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">3.1 Permitted Use</h3>
            <p className="text-foreground/80 mb-3">You may use our Services for lawful business purposes, including:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>Uploading financial data (Excel/CSV files) for analysis</li>
              <li>Using the runway calculator to project cash runway</li>
              <li>Generating financial forecasts and projections</li>
              <li>Running AI-powered scenario analysis</li>
              <li>Connecting QuickBooks for automated data sync (optional)</li>
              <li>Exporting reports and financial projections</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">3.2 Prohibited Conduct</h3>
            <p className="text-foreground/80 mb-3">You agree NOT to:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>Violate any applicable laws, regulations, or these Terms</li>
              <li>Use the Services for any fraudulent, harmful, or illegal activities</li>
              <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
              <li>Use automated systems (bots, scrapers) without our express written permission</li>
              <li>Reverse engineer or attempt to extract source code from our software</li>
              <li>Upload malicious code, viruses, or harmful technology</li>
              <li>Impersonate any person or entity</li>
              <li>Interfere with the integrity or performance of the Services</li>
              <li>Upload financial data you do not have rights to use</li>
              <li>Resell or redistribute our Services without authorization</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">3.3 Service Modifications</h3>
            <p className="text-foreground/80">
              We reserve the right to modify, suspend, or discontinue any aspect of the Services at any time, with or without notice. We are not liable for any modification, suspension, or discontinuation.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">3.4 Beta Features</h3>
            <p className="text-foreground/80">
              We may offer beta or experimental features. Beta Features are provided "as-is" without warranties and may be modified or discontinued at any time. Use of Beta Features is at your own risk.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Your Content and Data</h2>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">4.1 Financial Data You Upload</h3>
            <p className="text-foreground/80 mb-3">
              When you upload financial data (Excel files, CSV files) or enter data into the runway calculator, you retain all ownership rights to your data. You grant us a limited license to:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>Process your data to provide the Services (forecasts, runway calculations)</li>
              <li>Store your data securely for retrieval and historical tracking</li>
              <li>Send your data to AI services (AWS Bedrock/Claude) for scenario analysis</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">4.2 Data Accuracy</h3>
            <p className="text-foreground/80 mb-3">You represent and warrant that:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>You have the right to upload and use the financial data you provide</li>
              <li>Your data does not infringe on the rights of third parties</li>
              <li>You understand that forecasts are based on the data you provide—garbage in, garbage out</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">4.3 QuickBooks Integration</h3>
            <p className="text-foreground/80 mb-3">If you connect QuickBooks to your Zensus account:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>You authorize us to access and sync financial data from your QuickBooks account</li>
              <li>Data syncs occur periodically to keep your runway calculations current</li>
              <li>You can disconnect QuickBooks at any time through your account settings</li>
              <li>Disconnecting QuickBooks does not delete historical data already synced</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">4.4 Bank Account Integration via Plaid</h3>
            <p className="text-foreground/80 mb-3">If you connect your bank account to your Zensus account:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>You authorize us to access your bank account data through Plaid Technologies, Inc.</li>
              <li>We access read-only data including account balances and transaction history</li>
              <li>Your bank login credentials are handled directly by Plaid and are never stored by Zensus</li>
              <li>Transaction data syncs periodically to keep your runway calculations current</li>
              <li>You can disconnect your bank account at any time through your account settings</li>
              <li>Disconnecting your bank account does not delete historical transaction data already synced</li>
              <li>Your use of the Plaid integration is also subject to{' '}
                <a href="https://plaid.com/legal/#end-user-privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Plaid's End User Privacy Policy</a>
              </li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">4.5 Data Privacy</h3>
            <p className="text-foreground/80">
              We take the security of your financial data seriously. Our collection, use, and protection of your data is governed by our Privacy Policy at{' '}
              <a href="https://zensus.app/privacy" className="text-primary hover:underline">https://zensus.app/privacy</a>.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Our Intellectual Property</h2>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">5.1 Zensus Intellectual Property</h3>
            <p className="text-foreground/80">
              The Services and all original content, features, functionality, software, code, designs, graphics, logos, and trademarks are owned by Zensus Inc. and protected by intellectual property laws.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">5.2 Proprietary Technology</h3>
            <p className="text-foreground/80">
              Our forecasting algorithms, runway calculation methods, data extraction pipelines, and AI integrations represent proprietary technology developed by Zensus. These are protected as trade secrets.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">5.3 Limited License</h3>
            <p className="text-foreground/80">
              Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Services for your business purposes.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">5.4 Restrictions</h3>
            <p className="text-foreground/80 mb-3">You may not:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>Copy, modify, distribute, sell, or lease any part of our Services</li>
              <li>Reverse engineer or extract source code from our software</li>
              <li>Create derivative works based on the Services</li>
              <li>Remove or alter any proprietary notices</li>
              <li>Use our trademarks without prior written permission</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">5.5 Feedback</h3>
            <p className="text-foreground/80">
              If you provide feedback or suggestions about the Services, you grant us an unrestricted, perpetual, royalty-free right to use and commercialize such feedback without compensation.
            </p>
          </section>

          {/* Section 6 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Paid Subscriptions</h2>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">6.1 Subscription Plans</h3>
            <p className="text-foreground/80 mb-4">Zensus offers a subscription-based service:</p>

            <div className="rounded-lg border border-border bg-muted/30 p-5 my-4 not-prose">
              <p className="font-semibold text-foreground mb-3">Zensus Pro ($199/month):</p>
              <ul className="list-disc pl-6 space-y-1 text-foreground/80 text-sm mb-4">
                <li>AI-powered financial forecasting</li>
                <li>Runway calculator with scenario analysis</li>
                <li>QuickBooks integration</li>
                <li>Runway snapshots and historical tracking</li>
                <li>Priority support</li>
              </ul>

              <p className="font-semibold text-foreground mb-2">Premium Features (Subscription Required):</p>
              <ul className="list-disc pl-6 space-y-1 text-foreground/80 text-sm mb-4">
                <li><strong className="text-foreground">Forecast:</strong> AI-powered financial projections from uploaded data</li>
                <li><strong className="text-foreground">Runway:</strong> Cash runway calculator with what-if scenarios</li>
              </ul>

              <p className="font-semibold text-foreground mb-2">Enterprise Plans:</p>
              <p className="text-foreground/80 text-sm">
                Custom plans available for larger organizations. Contact{' '}
                <a href="mailto:hello@zensus.app" className="text-primary hover:underline">hello@zensus.app</a>{' '}
                for enterprise pricing.
              </p>
            </div>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">6.2 Billing and Payment</h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>Subscription fees are billed monthly in advance</li>
              <li>Payments are processed through Stripe</li>
              <li>You authorize us to charge your payment method for all subscription fees</li>
              <li>All fees are in U.S. Dollars</li>
              <li>Fees are non-refundable except as stated in these Terms</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">6.3 Automatic Renewal</h3>
            <p className="text-foreground/80">
              Subscriptions automatically renew at the end of each billing period unless you cancel before the renewal date. You will be charged the then-current rate, which we may change with 30 days' notice.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">6.4 Promotional Offers</h3>
            <p className="text-foreground/80 mb-3">
              We may offer promotional pricing or discount codes from time to time. Promotional offers are subject to additional terms, may be limited in availability, and may be revoked or modified at any time at our sole discretion.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">6.5 Cancellation and Refunds</h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80 mb-4">
              <li>You may cancel your subscription at any time via account settings or by contacting us</li>
              <li>Cancellation takes effect at the end of your current billing period</li>
              <li>You retain access to premium features until the end of your paid period</li>
              <li><strong className="text-foreground">No Refunds:</strong> We do not provide refunds for partial months or unused subscription time</li>
              <li>Refunds may be provided at our sole discretion for exceptional circumstances</li>
            </ul>

            <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-5 my-4 not-prose">
              <p className="font-semibold text-foreground mb-2">Refund Policy Summary:</p>
              <p className="text-foreground/80 text-sm">
                All subscription payments are final and non-refundable. We encourage you to evaluate the service carefully before subscribing.
              </p>
            </div>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">6.6 Price Changes</h3>
            <p className="text-foreground/80">
              We may modify subscription pricing with at least 30 days' advance notice. Price changes take effect at the start of your next billing cycle.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">6.7 Payment Failures</h3>
            <p className="text-foreground/80 mb-3">If your payment fails:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li><strong className="text-foreground">Grace Period:</strong> You have 7 days to update your payment method</li>
              <li>During the grace period, you retain full access</li>
              <li>We will notify you via email of payment failures</li>
              <li>If payment is not received within 7 days, access to premium features will be suspended</li>
              <li>Access is restored immediately once payment is processed</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">6.8 Subscription Pause</h3>
            <p className="text-foreground/80 mb-3">You may pause your subscription instead of canceling:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>Pause for up to 3 months (90 days) at a time</li>
              <li>While paused, you will not be charged and will not have access to premium features</li>
              <li>Your data and history will be preserved</li>
              <li>You can resume at any time; billing resumes immediately</li>
              <li>You may only pause once per 12-month period</li>
              <li>Pausing is not available during a promotional period</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">6.9 Taxes</h3>
            <p className="text-foreground/80">
              All fees are exclusive of applicable taxes. You are responsible for all applicable taxes except those based on our net income.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Termination</h2>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">7.1 Termination by You</h3>
            <p className="text-foreground/80 mb-3">You may terminate your account at any time by:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>Using the "Delete Account" option in your account settings</li>
              <li>Emailing us at <a href="mailto:hello@zensus.app" className="text-primary hover:underline">hello@zensus.app</a></li>
            </ul>
            <p className="text-foreground/80 mt-3">Upon termination, you will lose access to your account and data, except as required by law.</p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">7.2 Termination by Us</h3>
            <p className="text-foreground/80 mb-3">We may suspend or terminate your account if:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>You violate these Terms</li>
              <li>You engage in fraudulent or illegal activities</li>
              <li>Required by law or government authority</li>
              <li>Your account has been inactive for 12+ months</li>
              <li>We discontinue the Services</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">7.3 Effect of Termination</h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>Your access to the Services immediately ceases</li>
              <li>We may delete your data after a reasonable period (typically 90 days)</li>
              <li>You remain liable for any fees incurred before termination</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">7.4 Data Export</h3>
            <p className="text-foreground/80">
              Authenticated Zensus users can self-serve a JSON export of the personal data we hold from the product app at{' '}
              <a href="https://app.zensus.app" className="text-primary hover:underline">app.zensus.app</a>.
              You may also request an export by email at{' '}
              <a href="mailto:hello@zensus.app" className="text-primary hover:underline">hello@zensus.app</a>;
              we will respond within 30 days.
            </p>
          </section>

          {/* Section 8 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Discontinuation of Services</h2>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">8.1 Right to Discontinue</h3>
            <p className="text-foreground/80 mb-3">As a startup company, we reserve the right to discontinue the Services at any time due to:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>Business decisions or strategy changes</li>
              <li>Technical or infrastructure issues</li>
              <li>Financial constraints</li>
              <li>Regulatory requirements</li>
              <li>Security concerns</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">8.2 Notice</h3>
            <p className="text-foreground/80 mb-3">We will make reasonable efforts to provide:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>30 days' notice for discontinuation of paid features</li>
              <li>14 days' notice for discontinuation of free features</li>
              <li>Immediate discontinuation may occur for security or legal reasons</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">8.3 Refunds Upon Discontinuation</h3>
            <p className="text-foreground/80">
              If we discontinue paid Services before the end of your subscription period, we will provide a pro-rated refund for the unused portion.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">8.4 Data Preservation</h3>
            <p className="text-foreground/80 mb-3">If we discontinue Services:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>We will provide opportunity to export your data</li>
              <li>Data will be maintained for 30-90 days after discontinuation</li>
              <li>Data will be permanently deleted after this period</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Disclaimer of Warranties</h2>

            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-5 my-4 not-prose">
              <h3 className="text-lg font-medium text-foreground mb-3">9.1 "AS IS" and "AS AVAILABLE"</h3>
              <p className="text-foreground/80 text-sm uppercase">
                THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
            </div>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">9.2 No Warranty of Accuracy</h3>
            <p className="text-foreground/80 mb-3 uppercase text-sm">WE DO NOT WARRANT THAT:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>The Services will be uninterrupted, secure, or error-free</li>
              <li>Any defects will be corrected</li>
              <li>Forecasts or projections will be accurate or reliable</li>
              <li>The Services will meet your business requirements</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">9.3 Financial Analysis Disclaimer</h3>
            <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-5 my-4 not-prose">
              <p className="font-semibold text-foreground mb-2">CRITICAL DISCLAIMER:</p>
              <p className="text-foreground/80 text-sm mb-3">
                THE FORECASTS, RUNWAY CALCULATIONS, AND SCENARIO ANALYSES PROVIDED THROUGH OUR SERVICES ARE FOR INFORMATIONAL PURPOSES ONLY. WE DO NOT PROVIDE PROFESSIONAL FINANCIAL, INVESTMENT, TAX, OR LEGAL ADVICE.
              </p>
              <ul className="list-disc pl-6 space-y-1 text-foreground/80 text-sm mb-3">
                <li>AI-generated scenarios may contain errors or "hallucinations"</li>
                <li>Forecasts are based on data you provide and historical patterns—they do not predict the future</li>
                <li>Runway calculations are estimates and actual results may vary significantly</li>
                <li>We are not liable for business decisions made using our Services</li>
              </ul>
              <p className="font-semibold text-foreground mb-2">YOU ACKNOWLEDGE THAT:</p>
              <ul className="list-disc pl-6 space-y-1 text-foreground/80 text-sm">
                <li>Business decisions carry inherent risks</li>
                <li>You should independently verify all projections</li>
                <li>You should consult qualified professionals before making major financial decisions</li>
                <li>We do not have a fiduciary duty to you</li>
              </ul>
            </div>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">9.4 Third-Party Services</h3>
            <p className="text-foreground/80">
              We integrate with third-party services (QuickBooks, Stripe, AWS). We do not warrant or assume responsibility for any third-party services. Your use of third-party services is governed by their terms.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">9.5 Startup Disclosure</h3>
            <p className="text-foreground/80 mb-3">As an early-stage startup, our Services may experience:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>Technical issues, bugs, or outages</li>
              <li>Feature changes or removals</li>
              <li>Performance variability</li>
              <li>Limited support resources</li>
            </ul>
            <p className="text-foreground/80 mt-3 uppercase text-sm">YOU ACKNOWLEDGE AND ACCEPT THESE RISKS.</p>
          </section>

          {/* Section 10 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Limitation of Liability</h2>

            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-5 my-4 not-prose">
              <h3 className="text-lg font-medium text-foreground mb-3">10.1 Maximum Liability</h3>
              <p className="text-foreground/80 text-sm mb-3">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, ZENSUS INC. AND ITS OFFICERS, EMPLOYEES, AND CONTRACTORS SHALL NOT BE LIABLE FOR:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-foreground/80 text-sm mb-3">
                <li>INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES</li>
                <li>LOSS OF PROFITS, REVENUE, DATA, OR BUSINESS OPPORTUNITIES</li>
                <li>DAMAGES FROM YOUR USE OR INABILITY TO USE THE SERVICES</li>
                <li>DAMAGES FROM RELIANCE ON FORECASTS OR RECOMMENDATIONS</li>
              </ul>
            </div>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">10.2 Aggregate Liability</h3>
            <p className="text-foreground/80 mb-3 uppercase text-sm">OUR TOTAL LIABILITY SHALL NOT EXCEED:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>The amount you paid us in the 12 months preceding the claim, OR</li>
              <li>$100 (ONE HUNDRED U.S. DOLLARS)</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">10.3 Business Losses</h3>
            <p className="text-foreground/80 mb-3 uppercase text-sm">WE ARE NOT LIABLE FOR:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>Losses from business decisions based on our forecasts</li>
              <li>Inaccurate runway projections</li>
              <li>Missed funding deadlines or opportunities</li>
              <li>Cash flow problems</li>
              <li>Business failures</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">10.4 Third-Party Services</h3>
            <p className="text-foreground/80 mb-3">We are not liable for issues from:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>Stripe payment processing</li>
              <li>QuickBooks data sync</li>
              <li>AWS/cloud infrastructure</li>
              <li>Internet connectivity</li>
            </ul>
          </section>

          {/* Section 11 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Indemnification</h2>

            <p className="text-foreground/80 mb-3">
              You agree to indemnify and hold harmless Zensus Inc. and its officers, employees, and contractors from claims, damages, and expenses (including attorneys' fees) arising from:
            </p>
            <ol className="list-decimal pl-6 space-y-1 text-foreground/80">
              <li>Your use or misuse of the Services</li>
              <li>Your violation of these Terms or applicable laws</li>
              <li>Data you upload that infringes third-party rights</li>
              <li>Business decisions you make based on our Services</li>
              <li>Your account activity</li>
            </ol>
          </section>

          {/* Section 12 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-foreground mb-4">12. Dispute Resolution</h2>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">12.1 Informal Resolution</h3>
            <p className="text-foreground/80 mb-3">
              Before filing any formal claim, contact us at{' '}
              <a href="mailto:hello@zensus.app" className="text-primary hover:underline">hello@zensus.app</a>{' '}
              to attempt informal resolution. We will attempt to resolve disputes within 30 days.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">12.2 Binding Arbitration</h3>
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-5 my-4 not-prose">
              <p className="font-semibold text-foreground mb-2">PLEASE READ CAREFULLY:</p>
              <p className="text-foreground/80 text-sm mb-2">
                Disputes will be resolved through final and binding arbitration rather than court, except:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-foreground/80 text-sm">
                <li>Small claims court if your claims qualify</li>
                <li>Injunctive relief for intellectual property matters</li>
              </ul>
            </div>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">12.3 Arbitration Rules</h3>
            <p className="text-foreground/80">
              Arbitration will be administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules. The arbitration will be conducted by a single arbitrator.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">12.4 Class Action Waiver</h3>
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-5 my-4 not-prose">
              <p className="text-foreground/80 text-sm">
                <strong className="text-foreground">YOU AND ZENSUS AGREE THAT DISPUTES WILL BE RESOLVED ONLY ON AN INDIVIDUAL BASIS AND NOT AS A CLASS ACTION.</strong> Both parties waive the right to trial by jury.
              </p>
            </div>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">12.5 Opt-Out</h3>
            <p className="text-foreground/80">
              You may opt out of arbitration within 30 days of accepting these Terms by emailing{' '}
              <a href="mailto:hello@zensus.app" className="text-primary hover:underline">hello@zensus.app</a>{' '}
              with subject line "Arbitration Opt-Out."
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">12.6 Governing Law</h3>
            <p className="text-foreground/80">
              These Terms are governed by the laws of the State of Delaware. If arbitration does not apply, disputes will be resolved in the state or federal courts of Delaware.
            </p>
          </section>

          {/* Section 13 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-foreground mb-4">13. General Terms</h2>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">13.1 Entire Agreement</h3>
            <p className="text-foreground/80">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and Zensus regarding the Services.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">13.2 Modifications</h3>
            <p className="text-foreground/80 mb-3">We may modify these Terms with:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>30 days' notice for material changes</li>
              <li>Notification via email or prominent notice</li>
              <li>Updated "Last Updated" date</li>
            </ul>
            <p className="text-foreground/80 mt-3">
              Continued use after changes constitutes acceptance. If you disagree, stop using the Services.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">13.3 Severability</h3>
            <p className="text-foreground/80">
              If any provision is found invalid, the remaining provisions remain in effect.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">13.4 Assignment</h3>
            <p className="text-foreground/80">
              You may not assign these Terms without our consent. We may assign these Terms to any successor entity.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">13.5 Contact</h3>
            <p className="text-foreground/80 mb-3">Questions about these Terms? Contact us:</p>

            <div className="rounded-lg border border-border bg-muted/30 p-5 my-4 not-prose">
              <p className="font-semibold text-foreground">Zensus Inc.</p>
              <p className="text-foreground/80 text-sm">
                Email: <a href="mailto:hello@zensus.app" className="text-primary hover:underline">hello@zensus.app</a><br />
                Website: <a href="https://zensus.app" className="text-primary hover:underline">https://zensus.app</a>
              </p>
            </div>
          </section>

          {/* Final Acknowledgment */}
          <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-6 mt-12 not-prose text-center">
            <p className="font-semibold text-foreground mb-2">
              By using Zensus, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Zensus Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}
