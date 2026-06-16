import { Helmet } from "react-helmet-async";
import {
  Lock,
  Cable,
  KeyRound,
  Users,
  EyeOff,
  MapPin,
  DatabaseBackup,
  ScanLine,
  ShieldCheck,
  Check,
  Minus,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { TalkToUsButton } from "@/components/landing/TalkToUsButton";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DataFlow from "@/components/security/DataFlow";
import SecurityFaq from "@/components/security/SecurityFaq";
import { breadcrumbSchema, HOME_CRUMB } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

const breadcrumbs = breadcrumbSchema([
  HOME_CRUMB,
  { name: "Security", url: "https://zensus.app/security" },
]);

// Spec-sheet stats shown directly under the hero, hairline-separated.
const STATS: [string, string][] = [
  ["Last reviewed", "June 2026"],
  ["Encryption", "AES-256-GCM"],
  ["Hosting", "AWS, US region"],
  ["AI training", "None"],
];

// Every control is a real, currently true control. Detail strings render in
// Geist Mono: the technical exactness is part of how the page conveys trust.
const CONTROLS: { icon: LucideIcon; title: string; detail: string }[] = [
  { icon: Lock, title: "Encryption at rest", detail: "AES-256-GCM" },
  { icon: Cable, title: "Encryption in transit", detail: "TLS on every request" },
  { icon: KeyRound, title: "Bank-level OAuth", detail: "Plaid and Intuit hold credentials" },
  { icon: Users, title: "Account isolation", detail: "Every query scoped to your user" },
  { icon: EyeOff, title: "No AI training", detail: "Your data never trains a model" },
  { icon: MapPin, title: "US data residency", detail: "Stored data in an AWS US region" },
  { icon: DatabaseBackup, title: "Encrypted backups", detail: "Tested recovery, not a first restore" },
  { icon: ScanLine, title: "Static analysis in CI", detail: "Semgrep and Gitleaks on commit" },
  { icon: ShieldCheck, title: "Security headers", detail: "HSTS, CSP, clickjacking protection" },
];

const STORES = [
  "OAuth tokens for each connected provider, encrypted at rest with AES-256-GCM.",
  "Transactions and balances within the sync window needed to project your runway.",
  "Scenario chat history for your account only.",
  "Derived runway projections and alert state.",
];

const NEVER_STORES = [
  "Bank or QuickBooks passwords. Plaid and Intuit hold those.",
  "Payment card details.",
  "Raw transactions outside the sync window needed for projections.",
];

const PROTECTIONS: { title: string; body: string }[] = [
  {
    title: "Account isolation",
    body: "Every database query is filtered by user ID. Zensus staff cannot reach your data without an explicit, audited authorization path. Cross-account access is impossible by design, not just by policy.",
  },
  {
    title: "Backups and recovery",
    body: "Your data is backed up on a regular schedule, encrypted at rest on the same AWS infrastructure. We test the recovery process, so a restore is a known procedure, not a first-time experiment during an incident.",
  },
  {
    title: "Data residency",
    body: "Zensus runs on AWS in a United States region. Your stored data, OAuth tokens, in-window transactions, and scenario history, lives in that US infrastructure. When you run a scenario, the request is processed by Claude per request and returns to you.",
  },
  {
    title: "Pipeline security",
    body: "The backend runs Semgrep static analysis on every commit. Gitleaks blocks any pull request that introduces a secret. Dependencies are tracked with automated vulnerability alerts.",
  },
  {
    title: "AI and your data",
    body: "Your data never trains a model. Scenarios are sent to Claude per request, analyzed, and returned to you. No fine-tuning, no memory, and no data crossing between accounts.",
  },
];

const COMPLIANCE: { area: string; detail: string; active: boolean; status: string }[] = [
  { area: "Encryption", detail: "AES-256-GCM at rest, TLS in transit", active: true, status: "Active" },
  { area: "Hosting", detail: "AWS, United States region", active: true, status: "Active" },
  { area: "Backups", detail: "Encrypted, recovery tested", active: true, status: "Active" },
  { area: "Data isolation", detail: "Per-user, enforced at query level", active: true, status: "Active" },
  { area: "AI training", detail: "None on your data", active: true, status: "Active" },
  { area: "HTTP headers", detail: "HSTS preload, CSP, X-Frame-Options DENY", active: true, status: "Active" },
];

const Control = ({ icon: Icon, title, detail }: { icon: LucideIcon; title: string; detail: string }) => (
  <Card className="rounded-md border-border bg-card shadow-none transition-colors hover:border-primary/40">
    <CardContent className="p-5">
      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
      <h3 className="mt-3 text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1 font-mono text-xs leading-relaxed text-muted-foreground">{detail}</p>
    </CardContent>
  </Card>
);

const Block = ({
  n,
  title,
  id,
  children,
}: {
  n: string;
  title: string;
  id?: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="scroll-mt-24 border-t border-border pt-14">
    <div className="mb-6 flex items-baseline gap-4">
      <span className="font-mono text-xs tracking-widest text-primary">{n}</span>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h2>
    </div>
    {children}
  </section>
);

const Security = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Security at Zensus · How We Protect Your Financial Data</title>
      <meta
        name="description"
        content="How Zensus protects your financial data. AES-256-GCM at rest, bank-level OAuth via Plaid and Intuit, account-level isolation, US data residency, and zero AI training on your data."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://zensus.app/security" />
      <meta property="og:site_name" content="Zensus" />
      <meta property="og:title" content="Security at Zensus · How We Protect Your Financial Data" />
      <meta
        property="og:description"
        content="How Zensus protects your financial data. Bank-level OAuth, encryption at rest, account-level isolation."
      />
      <meta property="og:image" content="https://zensus.app/og/security.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Security at Zensus social preview card" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Security at Zensus · How We Protect Your Financial Data" />
      <meta
        name="twitter:description"
        content="How Zensus protects your financial data. Bank-level OAuth, encryption at rest, account-level isolation."
      />
      <meta name="twitter:image" content="https://zensus.app/og/security.png" />
      <link rel="canonical" href="https://zensus.app/security" />
      <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>
    </Helmet>
    <Navbar />
    <main className="pt-24 pb-20">
      <div className="section-container max-w-4xl">
        {/* Hero */}
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Security</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
          How Zensus handles your financial data
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Bank-level access, handled with bank-level care. Zensus reads from your
          banks, books, and CRM to forecast cash. Here is exactly what we hold,
          what we never touch, and how it is protected.
        </p>

        <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4">
          {STATS.map(([label, value]) => (
            <div key={label} className="bg-background p-4">
              <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {label}
              </dt>
              <dd className="mt-1 font-mono text-sm text-foreground">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-16 space-y-14">
          <Block n="01" title="Controls at a glance">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {CONTROLS.map((c) => (
                <Control key={c.title} icon={c.icon} title={c.title} detail={c.detail} />
              ))}
            </div>
          </Block>

          <Block n="02" title="How your data flows">
            <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              You connect through OAuth. Credentials stay with the provider.
              Zensus only ever holds scoped tokens, and stores only what it needs
              to compute your runway.
            </p>
            <DataFlow />
          </Block>

          <Block n="03" title="What we store, and never store">
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="rounded-md border-border bg-card shadow-none">
                <CardContent className="p-6">
                  <p className="mb-4 font-mono text-xs uppercase tracking-widest text-primary">
                    Stores
                  </p>
                  <ul className="space-y-3">
                    {STORES.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="rounded-md border-border bg-card shadow-none">
                <CardContent className="p-6">
                  <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Never stores
                  </p>
                  <ul className="space-y-3">
                    {NEVER_STORES.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                        <Minus className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </Block>

          <Block n="04" title="How your data is protected">
            <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {PROTECTIONS.map((p) => (
                <div key={p.title}>
                  <h3 className="mb-1.5 text-base font-semibold text-foreground">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </div>
              ))}
            </div>
          </Block>

          <Block n="05" title="Compliance status">
            <div className="overflow-hidden rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-mono text-xs uppercase tracking-wider">Area</TableHead>
                    <TableHead className="font-mono text-xs uppercase tracking-wider">Detail</TableHead>
                    <TableHead className="text-right font-mono text-xs uppercase tracking-wider">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {COMPLIANCE.map((row) => (
                    <TableRow key={row.area}>
                      <TableCell className="font-medium text-foreground">{row.area}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {row.detail}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground">
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              row.active ? "bg-primary" : "border border-muted-foreground",
                            )}
                            aria-hidden="true"
                          />
                          {row.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-5 space-y-2">
              <a
                href="https://securityheaders.com/?q=https%3A%2F%2Fzensus.app&followRedirects=on"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-primary hover:underline"
              >
                Verify our HTTP security headers
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Zensus is not yet SOC 2 certified. Our data protection and
                access control practices are documented and reviewable on
                request. If your procurement process needs specific evidence,
                talk to us and we will share what we have.
              </p>
            </div>
          </Block>

          {/* Temporary security contact: support@zensus.app (swap to security@ later) */}
          <Block n="06" title="Responsible disclosure" id="responsible-disclosure">
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                Found a security issue? Email{" "}
                <a href="mailto:support@zensus.app" className="text-primary hover:underline">
                  support@zensus.app
                </a>{" "}
                and we will work with you on it. We support good-faith security
                research. If you report a vulnerability responsibly, test only
                against your own account, give us reasonable time to fix the issue
                before disclosing it, and do not access, modify, or delete data
                that is not your own, we will not pursue legal action against you
                for your research.
              </p>
              <p>
                Our machine-readable policy lives at{" "}
                <a
                  href="/.well-known/security.txt"
                  className="font-mono text-primary hover:underline"
                >
                  /.well-known/security.txt
                </a>
                .
              </p>
            </div>
          </Block>

          <Block n="07" title="Common security questions">
            <SecurityFaq />
          </Block>

          <Block n="08" title="Documentation for procurement">
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Request our security overview and data-handling details, and review
              the{" "}
              <a href="/subprocessors" className="text-primary hover:underline">
                subprocessors
              </a>{" "}
              we rely on. Security questions, disclosures, and procurement
              inquiries go to{" "}
              <a href="mailto:support@zensus.app" className="text-primary hover:underline">
                support@zensus.app
              </a>
              .
            </p>
            <div className="mt-8">
              <TalkToUsButton size="lg" />
            </div>
          </Block>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Security;
