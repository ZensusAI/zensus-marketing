import type { FaqItem } from "@/lib/structured-data";

/**
 * Every line of /security (handoff 17-security). Each fact was checked against
 * the app code, AWS and live headers on 11 November 2026, so a change here is a
 * change to a public security claim: confirm it in production first.
 */

export const LAST_REVIEWED = "11 November 2026";

export const FACTS: { label: string; value: string; note: string }[] = [
  { label: "Token encryption", value: "AES-256-GCM", note: "AES-256-GCM before storage" },
  { label: "Encryption at rest", value: "On AWS", note: "Your database, its backups and our file storage" },
  { label: "Daily backups", value: "7 days", note: "Kept 7 days, with point-in-time recovery" },
  { label: "US data residency", value: "US only", note: "AWS us-east-1, sign-in identities on us-east-2" },
];

export const STORE_GROUPS: { title: string; summary: string; items: string[] }[] = [
  {
    title: "From your connections",
    summary: "What Zensus syncs to forecast your cash.",
    items: [
      "Access tokens for each connected provider, and the Bill.com sync token you create, encrypted with AES-256-GCM.",
      "Transactions and balances. We fetch up to 12 months of history and keep transactions while the connection is active.",
      "Invoices, bills, and subscriptions from QuickBooks and HubSpot, if you connect them.",
      "Bills, invoices, and payments from Bill.com, if you connect it.",
    ],
  },
  {
    title: "What you add",
    summary: "Entered by you, kept in your account.",
    items: [
      "Expenses and adjustments you enter yourself.",
      "Scenario chat history for your account only.",
      "Up to 30 short facts about your business that the assistant remembers, stored for your account only.",
    ],
  },
  {
    title: "For your account",
    summary: "What runs your forecast and keeps sign-in secure.",
    items: [
      "Derived runway projections and alert state.",
      "Your email address, plus the IP address and browser for two-factor and other security events, kept for up to a year.",
      "Feedback you send us and your profile image.",
      "Two-factor settings. Your authenticator secret is encrypted with AES-256-GCM, and recovery codes are stored as hashes.",
      "If you add a passkey, only its public key and ID. The private key never leaves your device or password manager, and we store no biometric data.",
    ],
  },
];

export const NEVER_STORES: { item: string; holder: string }[] = [
  { item: "Bank or QuickBooks passwords.", holder: "Plaid and Intuit hold those." },
  { item: "Payment card details.", holder: "Stripe holds those." },
];

export const KEEP_OR_REMOVE = [
  "Disconnecting a bank revokes access and deletes its transactions.",
  "Disconnecting QuickBooks or HubSpot stops syncing and clears the access tokens. The data already synced stays in your account until you ask us to delete it.",
  "Disconnecting Bill.com deletes its credentials and the bills and invoices it synced. Delete the sync token in BILL too, because BILL offers no way for us to revoke it.",
  "To delete your account or export your data, contact support.",
];

export type ComplianceStatus = "Active" | "Completed" | "Not yet";

export const COMPLIANCE: { area: string; detail: string; status: ComplianceStatus }[] = [
  {
    area: "Encryption",
    detail: "AES-256-GCM for tokens, AWS encryption at rest for the database, backups and file storage, TLS in transit",
    status: "Active",
  },
  { area: "Hosting", detail: "AWS us-east-1, sign-in identities on us-east-2, all in the United States", status: "Active" },
  { area: "Backups", detail: "Daily, encrypted, 7-day point-in-time recovery", status: "Active" },
  { area: "Data isolation", detail: "Per-user, enforced by the application", status: "Active" },
  { area: "AI training", detail: "None on your data", status: "Active" },
  { area: "HTTP headers", detail: "HSTS on every domain, enforced CSP, X-Frame-Options and frame-ancestors", status: "Active" },
  {
    area: "Two-factor authentication",
    detail: "Required with a bank connected, with an authenticator app or a passkey",
    status: "Active",
  },
  { area: "Internal access", detail: "MFA on every internal system, access reviewed every quarter", status: "Active" },
  { area: "Audit logging", detail: "AWS CloudTrail in every region, logs kept one year", status: "Active" },
  {
    area: "Bank data partner security review",
    detail: "Plaid data security attestations completed, November 2026",
    status: "Completed",
  },
  { area: "SOC 2", detail: "Not certified", status: "Not yet" },
];

export const FAQS: FaqItem[] = [
  {
    question: "Is my financial data safe with Zensus?",
    answer:
      "Your database, its backups and our file storage are encrypted at rest on AWS in the United States. Integration tokens are also encrypted with AES-256-GCM, and data moves over TLS. Every request is tied to your signed-in user, and your data is filtered by that user.",
  },
  {
    question: "Does Zensus support two-factor authentication?",
    answer:
      "Yes. You can use an authenticator app or a passkey, and you get 10 single-use recovery codes. Two-factor authentication is required to connect or reconnect a bank and while a bank is connected, and it cannot be turned off until you disconnect the bank. Without a bank connected it is optional. We email you when these settings change.",
  },
  {
    question: "Does Zensus store my bank password?",
    answer:
      "No. You connect through OAuth or Plaid, and Plaid and Intuit hold those credentials. Zensus only ever receives scoped tokens, never your bank or QuickBooks password. For Bill.com, you create a sync token in BILL, and Zensus stores it encrypted with AES-256-GCM.",
  },
  {
    question: "Can Zensus move my money?",
    answer: "No. Zensus reads your financial data. It never writes to your bank, QuickBooks, HubSpot, or Bill.com.",
  },
  {
    question: "Does Zensus use my data to train AI?",
    answer:
      "No. Your data never trains any model. Scenarios run on Claude models hosted on AWS Bedrock in our AWS account, and Anthropic does not access the data we send to Bedrock.",
  },
  {
    question: "Where is my financial data stored?",
    answer:
      "In the United States. Your application data, database and backups are on AWS in the us-east-1 region. Sign-in identities are held by Supabase on AWS in us-east-2.",
  },
  {
    question: "What happens when I disconnect a bank?",
    answer: "Zensus revokes its access and deletes that bank's transactions.",
  },
  {
    question: "Can Zensus staff see my data?",
    answer:
      "One named Zensus admin can open your account for support. Each session needs that admin's second factor and a written reason, ends within an hour, and is logged. The admin cannot connect a bank to your account.",
  },
  {
    question: "Is Zensus SOC 2 certified?",
    answer: "Not yet. We would rather tell you exactly where we stand than imply a certification we do not hold.",
  },
];

export type ReviewerGroup = {
  title: string;
  intro?: string;
  /** Exact values, set in Geist Mono. */
  mono?: boolean;
  rows: [string, string][];
};

export const REVIEWER_GROUPS: ReviewerGroup[] = [
  {
    title: "Controls at a glance",
    mono: true,
    rows: [
      ["Token encryption", "AES-256-GCM before storage"],
      ["Encryption at rest", "Database, backups and file storage, on AWS"],
      ["Encryption in transit", "TLS, required by the database"],
      ["Connections", "OAuth, Plaid Link, and a Bill.com sync token you create. Providers hold your logins"],
      ["Sign-in", "Google or an emailed link, then your second factor if it is on"],
      ["Email sign-in", "Protected by a CAPTCHA (Cloudflare Turnstile)"],
      ["Two-factor authentication", "Required with a bank connected. Authenticator app or passkey"],
      ["Recovery codes", "10 single-use codes, stored as hashes"],
      ["Account isolation", "Every request tied to your signed-in user"],
      ["Staff access", "One named admin, second factor and written reason, under an hour, logged"],
      ["Internal MFA", "Required on every internal system we use"],
      ["Audit logging", "AWS CloudTrail in every region, kept one year"],
      ["No AI training", "Your data never trains a model"],
      ["US data residency", "AWS us-east-1, sign-in identities on us-east-2"],
      ["Daily backups", "Kept 7 days, with point-in-time recovery"],
      ["Security headers", "HSTS on every domain, enforced CSP, clickjacking protection"],
    ],
  },
  {
    title: "How your data flows",
    intro:
      "You connect through OAuth or Plaid, or with a sync token you create in BILL. Your logins stay with the provider. Zensus holds only scoped tokens, and stores what it needs to compute your runway.",
    rows: [
      [
        "1. Your banks, QuickBooks, HubSpot, Bill.com",
        "You authorize access through OAuth or Plaid. For Bill.com, you create a sync token in BILL.",
      ],
      ["2. Scoped tokens", "Each provider holds the credentials. Zensus encrypts every token with AES-256-GCM."],
      ["3. Zensus reads what it needs", "Enough to project your runway. Zensus never writes back."],
      ["4. Encrypted at rest on AWS", "Your database, its backups and our file storage, in us-east-1, United States."],
      [
        "Slack",
        "If you connect Slack, Zensus posts your cash alerts to the channel you choose. Slack is used only for alerts and their buttons.",
      ],
    ],
  },
  {
    title: "How your data is protected",
    rows: [
      [
        "Two-factor authentication",
        "Two-factor authentication is required to connect or reconnect a bank and while a bank is connected. Otherwise it is optional. You can use an authenticator app or a passkey, and you get 10 single-use recovery codes, stored as hashes. Since 11 November 2026, an account with a bank connected and no two-factor can only set it up, disconnect the bank, or manage billing. Two-factor cannot be turned off while a bank is connected. Repeated wrong codes lock the attempt, and we email you when these settings change. Turning it on or off also signs out your other sessions.",
      ],
      [
        "Passkeys",
        "If you add a passkey, Zensus stores only its public key and ID. The private key never leaves your device or password manager. Zensus stores no biometric data.",
      ],
      [
        "Sign-in",
        "You sign in with Google or an emailed link, then your second factor if it is on. Email sign-in is protected by a CAPTCHA (Cloudflare Turnstile).",
      ],
      [
        "Encryption at rest",
        "Your database, its backups and our file storage are encrypted at rest on AWS. Integration tokens are also encrypted with AES-256-GCM before storage.",
      ],
      [
        "Backups and recovery",
        "Your data is backed up daily and kept for 7 days, with point-in-time recovery. Backups are encrypted, and the database runs across multiple availability zones in AWS us-east-1.",
      ],
      ["Database access", "The database is not publicly accessible and accepts encrypted connections only."],
      [
        "Data residency",
        "All Zensus data is stored in the United States. Application data, the database and backups are in AWS us-east-1. Sign-in identities are held by Supabase on AWS us-east-2.",
      ],
      [
        "AI and your data",
        "Your data never trains a model. Scenarios run on Claude models hosted on AWS Bedrock in our AWS account, and Anthropic does not access the data we send to Bedrock. We keep your chat history in your account so Claude can follow the conversation. The assistant can remember up to 30 short facts about your business, stored for your account only. No data crosses between accounts.",
      ],
      [
        "Staff access",
        "One named Zensus admin can open your account for support. Each session needs that admin's second factor and a written reason, ends within an hour, and is logged. The admin cannot connect a bank to your account, and the admin account itself must have two-factor on.",
      ],
      [
        "Our own access controls",
        "Multi-factor authentication is required on every internal system we use. It is enforced organization-wide on Google Workspace (staff accounts), GitHub and Cloudflare. Production server access is closed by default and opened only for a single task. We review who has access every quarter under a written access control policy.",
      ],
      [
        "Monitoring",
        "AWS CloudTrail records account activity in every region, with tamper-evident log files kept for one year. GuardDuty threat detection runs on our production region. IAM Access Analyzer runs in every region and flags anything shared outside our account. Only web ports are open to the internet.",
      ],
      [
        "Connections and webhooks",
        "Incoming webhooks from Plaid, QuickBooks, HubSpot, Slack, and Stripe are signature-checked. OAuth connections are tied to the browser that started them.",
      ],
      [
        "Application safeguards",
        "The product uses a strict cross-origin allowlist, an enforced Content Security Policy, global rate limiting, and validation on every API input. Every domain sends HSTS, and X-Frame-Options and a CSP frame-ancestors rule block clickjacking.",
      ],
      [
        "Analytics",
        "Product analytics stay off until you consent. Session replay is blocked in the product app.",
      ],
      [
        "Pipeline security",
        "Every code pull request is scanned for secrets and cannot merge with a finding. We run Semgrep static analysis across the codebase every month. Dependencies are tracked with automated vulnerability alerts and audited twice a month, and dependency changes are checked for known vulnerabilities.",
      ],
    ],
  },
  {
    title: "What changed",
    intro: "Security updates to the product and this page, newest first.",
    rows: [
      ["November 2026", "Passkeys added as a second factor."],
      ["November 2026", "Two-factor authentication required for every account with a bank connected."],
      ["November 2026", "Bill.com added as a read-only connection."],
      ["November 2026", "Staff access reviewed and multi-factor authentication enforced on every internal system."],
      ["November 2026", "Account activity logging added across every AWS region."],
      ["November 2026", "Session replay turned off in the product app in code."],
      ["November 2026", "Two-factor authentication added, with an authenticator app and recovery codes."],
      ["November 2026", "Session replay blocked in the product app."],
      ["November 2026", "Every claim on this page rechecked against the product and its production settings."],
    ],
  },
];
