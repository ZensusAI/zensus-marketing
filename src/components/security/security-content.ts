import type { FaqItem } from "@/lib/structured-data";

/**
 * Every line of /security (handoff 17-security). Each fact was checked against
 * the app code, AWS and live headers on 2 November 2026, so a change here is a
 * change to a public security claim: confirm it in production first.
 */

export const LAST_REVIEWED = "November 2026";

export const FACTS: { label: string; value: string; note: string }[] = [
  { label: "Token encryption", value: "AES-256-GCM", note: "AES-256-GCM before storage" },
  { label: "Encryption at rest", value: "All data", note: "All stored data and backups" },
  { label: "Daily backups", value: "7 days", note: "Kept 7 days, with point-in-time recovery" },
  { label: "US data residency", value: "us-east-1", note: "AWS us-east-1" },
];

export const STORE_GROUPS: { title: string; summary: string; items: string[] }[] = [
  {
    title: "From your connections",
    summary: "What Zensus syncs to forecast your cash.",
    items: [
      "OAuth tokens for each connected provider, encrypted with AES-256-GCM.",
      "Transactions and balances. We fetch up to 12 months of history and keep transactions while the connection is active.",
      "Invoices, bills, and subscriptions from QuickBooks and HubSpot, if you connect them.",
    ],
  },
  {
    title: "What you add",
    summary: "Entered by you, kept in your account.",
    items: [
      "Expenses and adjustments you enter yourself.",
      "Scenario chat history for your account only.",
    ],
  },
  {
    title: "For your account",
    summary: "What runs your forecast and keeps sign-in secure.",
    items: [
      "Derived runway projections and alert state.",
      "Your email address, plus the IP address and browser used for sign-in events, kept for security.",
      "Feedback you send us and your profile image.",
      "Two-factor settings, if you turn them on. Your authenticator secret is encrypted with AES-256-GCM, and recovery codes are stored as hashes.",
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
  "To delete your account or export your data, contact support.",
];

export const COMPLIANCE: { area: string; detail: string; status: "Active" | "Not yet" }[] = [
  { area: "Encryption", detail: "AES-256-GCM for tokens, AWS encryption at rest, TLS in transit", status: "Active" },
  { area: "Hosting", detail: "AWS, us-east-1", status: "Active" },
  { area: "Backups", detail: "Daily, encrypted, 7-day point-in-time recovery", status: "Active" },
  { area: "Data isolation", detail: "Per-user, enforced by the application", status: "Active" },
  { area: "AI training", detail: "None on your data", status: "Active" },
  { area: "HTTP headers", detail: "HSTS preload, CSP, X-Frame-Options DENY", status: "Active" },
  { area: "Two-factor authentication", detail: "Optional, with an authenticator app", status: "Active" },
  { area: "SOC 2", detail: "Not certified", status: "Not yet" },
];

export const FAQS: FaqItem[] = [
  {
    question: "Is my financial data safe with Zensus?",
    answer:
      "Stored data is encrypted at rest on AWS in the United States, integration tokens are also encrypted with AES-256-GCM, and data moves over TLS. Every request is tied to your signed-in user, and your data is filtered by that user.",
  },
  {
    question: "Does Zensus support two-factor authentication?",
    answer:
      "Yes. You can turn on two-factor authentication with an authenticator app, and you get 10 single-use recovery codes. It is optional, and we email you when these settings change.",
  },
  {
    question: "Does Zensus store my bank password?",
    answer:
      "No. You connect through OAuth or Plaid, and Plaid and Intuit hold those credentials. Zensus only ever receives scoped tokens, never your bank or QuickBooks password.",
  },
  {
    question: "Can Zensus move my money?",
    answer: "No. Zensus reads your financial data. It never writes to your bank, QuickBooks, or HubSpot.",
  },
  {
    question: "Does Zensus use my data to train AI?",
    answer:
      "No. Your data never trains any model. Scenarios run on Claude models hosted on AWS Bedrock in our AWS account, and Anthropic does not access the data we send to Bedrock.",
  },
  {
    question: "Where is my financial data stored?",
    answer: "On AWS in the us-east-1 region, in the United States.",
  },
  {
    question: "What happens when I disconnect a bank?",
    answer: "Zensus revokes its access and deletes that bank's transactions.",
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
      ["Encryption at rest", "All stored data and backups"],
      ["Encryption in transit", "TLS, required by the database"],
      ["Connections", "OAuth and Plaid Link. Providers hold your credentials"],
      ["Sign-in", "Google or an emailed link"],
      ["Two-factor authentication", "Optional, with an authenticator app"],
      ["Recovery codes", "10 single-use codes, stored as hashes"],
      ["Account isolation", "Every request tied to your signed-in user"],
      ["No AI training", "Your data never trains a model"],
      ["US data residency", "AWS us-east-1"],
      ["Daily backups", "Kept 7 days, with point-in-time recovery"],
      ["Security headers", "HSTS, CSP, clickjacking protection"],
    ],
  },
  {
    title: "How your data flows",
    intro:
      "You connect through OAuth or Plaid. Credentials stay with the provider. Zensus only ever holds scoped tokens, and stores what it needs to compute your runway.",
    rows: [
      ["1. Your banks, QuickBooks, HubSpot", "You authorize access through OAuth or Plaid."],
      ["2. Scoped tokens", "Each provider holds the credentials."],
      ["3. Zensus reads what it needs", "Enough to project your runway."],
      ["4. Encrypted at rest on AWS", "us-east-1, United States."],
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
        "You can turn on two-factor authentication with an authenticator app. Repeated wrong codes lock the attempt, and we email you when these settings change. Turning it on or off also signs out your other sessions.",
      ],
      [
        "Backups and recovery",
        "Your data is backed up daily and kept for 7 days, with point-in-time recovery. Backups are encrypted, and the database runs across multiple availability zones in AWS us-east-1.",
      ],
      ["Database access", "The database is not publicly accessible and accepts encrypted connections only."],
      ["Data residency", "Zensus runs on AWS in the United States. Your stored data lives in the us-east-1 region."],
      [
        "AI and your data",
        "Your data never trains a model. Scenarios run on Claude models hosted on AWS Bedrock in our AWS account, and Anthropic does not access the data we send to Bedrock. We keep your chat history in your account so Claude can follow the conversation. No data crosses between accounts.",
      ],
      [
        "Connections and webhooks",
        "Incoming webhooks from Plaid, QuickBooks, HubSpot, Slack, and Stripe are signature-checked. OAuth connections are tied to the browser that started them.",
      ],
      [
        "Application safeguards",
        "The product uses a strict cross-origin allowlist, an enforced Content Security Policy, global rate limiting, and validation on every API input.",
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
      ["November 2026", "Two-factor authentication added, with an authenticator app and recovery codes."],
      ["November 2026", "Session replay blocked in the product app."],
      ["November 2026", "Every claim on this page rechecked against the product and its production settings."],
    ],
  },
];
