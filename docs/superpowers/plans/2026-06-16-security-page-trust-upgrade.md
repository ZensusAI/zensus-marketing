# Security Page Trust Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the existing `/security` page in place into a scannable, trust-center-style layout (controls grid, store/never-store comparison, honest compliance status, three new sections) and add an RFC 9116 `security.txt`, without adding any new route.

**Architecture:** Single-file restructure of `src/pages/Security.tsx` reusing the existing page chrome (Navbar, Footer, Helmet, breadcrumb JSON-LD, TalkToUsButton) and a local `CONTROLS` data array rendered as bordered cards. One new static file at `public/.well-known/security.txt`. No `App.tsx`, sitemap, or prerender changes (route is unchanged).

**Tech Stack:** React 18 + TypeScript + Vite + Tailwind + shadcn/ui, `lucide-react` icons, `react-helmet-async`.

**Spec:** `docs/superpowers/specs/2026-06-16-security-page-trust-upgrade-design.md`

**Note on testing:** This is a presentational marketing page. The repo uses vitest (`npm test`) for utility/backend-style code, but there is no page-render test harness and a unit test is not warranted for static copy. Verification is `npm run lint`, `npm test` (no regressions), `npm run build`, a `dist/` check, and a visual/`curl` pass. This is a deliberate, spec-approved deviation from unit-test-first.

---

### Task 1: Add the RFC 9116 security.txt

**Files:**
- Create: `public/.well-known/security.txt`

- [ ] **Step 1: Create the file**

Create `public/.well-known/security.txt` with exactly this content (note the leading comment marking the contact as temporary, and no trailing fields beyond these):

```
# Temporary security contact: support@zensus.app (swap to security@ later)
Contact: mailto:support@zensus.app
Expires: 2027-06-15T23:59:59.000Z
Preferred-Languages: en
Canonical: https://zensus.app/.well-known/security.txt
Policy: https://zensus.app/security#responsible-disclosure
```

- [ ] **Step 2: Verify the build copies the dotfile into dist**

Run: `npm run build`
Then run: `ls -la dist/.well-known/security.txt && cat dist/.well-known/security.txt`
Expected: the file exists under `dist/.well-known/` with the content above. (Vite copies `publicDir` to the output root as-is; `build.copyPublicDir` defaults to `true`. `vercel.json` has no rewrites and only a `/features` redirect, and `cleanUrls` affects only `.html`, so nothing swallows the `.txt`.)

If the file is NOT present in `dist/`, stop and report: the fallback is to serve it via a `vercel.json` route, which changes the approach.

- [ ] **Step 3: Commit**

```bash
git add public/.well-known/security.txt
git commit -m "feat(security): add RFC 9116 security.txt"
```

---

### Task 2: Rewrite the /security page into the trust-center layout

**Files:**
- Modify (full rewrite): `src/pages/Security.tsx`

- [ ] **Step 1: Replace the entire file with this implementation**

Write `src/pages/Security.tsx` with exactly this content:

```tsx
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
  type LucideIcon,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { TalkToUsButton } from "@/components/landing/TalkToUsButton";
import { breadcrumbSchema, HOME_CRUMB } from "@/lib/structured-data";

const breadcrumbs = breadcrumbSchema([
  HOME_CRUMB,
  { name: "Security", url: "https://zensus.app/security" },
]);

const Section = ({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="mb-10 scroll-mt-24">
    <h2 className="text-xl font-semibold mb-3 text-foreground">{title}</h2>
    <div className="text-muted-foreground leading-relaxed space-y-3">{children}</div>
  </section>
);

// Controls shown in the "at a glance" grid. Every entry is a real, currently
// true control (see the security spec). Do not add a control that is not true.
const CONTROLS: { icon: LucideIcon; title: string; detail: string }[] = [
  { icon: Lock, title: "Encryption at rest", detail: "AES-256-GCM" },
  { icon: Cable, title: "Encryption in transit", detail: "TLS on every request" },
  { icon: KeyRound, title: "Bank-level OAuth", detail: "Plaid and Intuit hold credentials" },
  { icon: Users, title: "Account-level isolation", detail: "Every query scoped to your user" },
  { icon: EyeOff, title: "No AI training", detail: "Your data never trains a model" },
  { icon: MapPin, title: "US data residency", detail: "Stored data in an AWS US region" },
  { icon: DatabaseBackup, title: "Encrypted backups", detail: "Tested recovery, not a first-time restore" },
  { icon: ScanLine, title: "Static analysis in CI", detail: "Semgrep and Gitleaks on every commit" },
  { icon: ShieldCheck, title: "Security headers", detail: "HSTS, CSP, clickjacking protection" },
];

const Control = ({ icon: Icon, title, detail }: { icon: LucideIcon; title: string; detail: string }) => (
  <div className="rounded-md border border-border bg-card p-4">
    <Icon className="h-5 w-5 text-primary mb-2" aria-hidden="true" />
    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
    <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
  </div>
);

const COMPLIANCE_ROWS: [string, string][] = [
  ["SOC 2", "In progress, working toward it"],
  ["Encryption", "AES-256-GCM at rest, TLS in transit"],
  ["Hosting", "AWS, United States region"],
  ["Backups", "Encrypted, recovery tested"],
  ["AI training", "None on your data"],
  ["Transport", "HSTS preload, strict CSP, clickjacking protection"],
];

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
    <main className="pt-24 pb-16">
      <div className="section-container max-w-3xl">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
          How Zensus handles your financial data
        </h1>
        <p className="text-lg text-muted-foreground mb-10">
          Zensus is built for founders who need real-time cash forecasting
          across multiple financial tools. That access is serious. Here is
          exactly what we hold, what we do not, and how it is protected.
        </p>

        <section className="mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Controls at a glance
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CONTROLS.map((c) => (
              <Control key={c.title} icon={c.icon} title={c.title} detail={c.detail} />
            ))}
          </div>
        </section>

        <Section title="Data flow at a glance">
          <p>
            You connect Plaid, QuickBooks, or HubSpot through OAuth. Those
            providers hold the credentials. Zensus receives scoped OAuth tokens,
            pulls the data we are authorized to read, and stores only what we
            need to compute your runway. Data moves over TLS. At rest, it
            lives on encrypted AWS infrastructure.
          </p>
        </Section>

        <Section title="What Zensus stores and never stores">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-md border border-border bg-card p-5">
              <h3 className="text-base font-semibold text-foreground mb-3">Stores</h3>
              <ul className="space-y-2 text-sm">
                <li>OAuth tokens for each connected provider, encrypted at rest with AES-256-GCM.</li>
                <li>Transactions and balances within the sync window required to project your runway.</li>
                <li>Scenario chat history for your account only.</li>
                <li>Derived runway projections and alert state.</li>
              </ul>
            </div>
            <div className="rounded-md border border-border bg-card p-5">
              <h3 className="text-base font-semibold text-foreground mb-3">Never stores</h3>
              <ul className="space-y-2 text-sm">
                <li>Bank or QuickBooks passwords. Plaid and Intuit hold those.</li>
                <li>Payment card details.</li>
                <li>Raw transactions outside the sync window needed for projections.</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section title="Account-level isolation">
          <p>
            Every database query is filtered by user ID. Zensus staff cannot
            access your data without an explicit authorization path that is
            audited. Cross-account access is not possible by design, not just
            by policy.
          </p>
        </Section>

        <Section title="Backups and recovery">
          <p>
            Your data is backed up on a regular schedule. Backups are encrypted
            at rest on the same AWS infrastructure, and we test our recovery
            process, so a restore is a known procedure rather than something we
            attempt for the first time during an incident.
          </p>
        </Section>

        <Section title="Data residency">
          <p>
            Zensus runs on AWS in a United States region. Your stored data,
            including OAuth tokens, the transactions inside the sync window, and
            your scenario history, lives in that US infrastructure. When you run
            a scenario, the request is processed by Claude as described below
            and the result returns to you. If your procurement process needs the
            specific region or a data-flow diagram, ask and we will share it.
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

        <Section title="Compliance status">
          <dl className="divide-y divide-border rounded-md border border-border">
            {COMPLIANCE_ROWS.map(([label, value]) => (
              <div
                key={label}
                className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:justify-between"
              >
                <dt className="text-sm font-medium text-foreground">{label}</dt>
                <dd className="text-sm text-muted-foreground sm:text-right">{value}</dd>
              </div>
            ))}
          </dl>
          <p>
            Zensus is not yet SOC 2 certified, and we are working toward it. In
            the meantime, our data protection and access control practices are
            documented and reviewable on request. If your procurement process
            needs specific evidence, talk to us and we will share what we have.
          </p>
        </Section>

        {/* Temporary security contact: support@zensus.app (swap to security@ later) */}
        <Section title="Responsible disclosure" id="responsible-disclosure">
          <p>
            Found a security issue? Email{" "}
            <a href="mailto:support@zensus.app" className="text-primary hover:underline">
              support@zensus.app
            </a>{" "}
            and we will work with you on it. We support good-faith security
            research. If you report a vulnerability responsibly, test only
            against your own account, give us reasonable time to fix the issue
            before disclosing it, and do not access, modify, or delete data that
            is not your own, we will not pursue legal action against you for
            your research.
          </p>
          <p>
            Our machine-readable policy lives at{" "}
            <a href="/.well-known/security.txt" className="text-primary hover:underline">
              /.well-known/security.txt
            </a>
            .
          </p>
        </Section>

        <Section title="Need documentation for procurement?">
          <p>
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
```

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: passes with no new errors for `src/pages/Security.tsx`.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: build succeeds (Vite + OG + prerender + sitemap steps all complete).

- [ ] **Step 4: Visual check**

Run: `npm run preview` and open the served `/security`.
Expected, top to bottom: H1 + lead, a "Controls at a glance" mono eyebrow over a grid of nine bordered cards (no rounded-full pill chips), the kept "Data flow" prose, a two-column "stores / never stores" comparison, account isolation, the new "Backups and recovery" and "Data residency" sections, CI security, AI and your data, a "Compliance status" definition list (six rows, SOC 2 = in progress), a "Responsible disclosure" section, and the procurement section linking `/subprocessors`. No em-dashes anywhere. Clicking nothing should 404.

- [ ] **Step 5: Anchor check**

In the browser, navigate to `/security#responsible-disclosure`.
Expected: the page scrolls to the Responsible disclosure section, clear of the fixed navbar (the `scroll-mt-24` handles the offset).

- [ ] **Step 6: Commit**

```bash
git add src/pages/Security.tsx
git commit -m "feat(security): restructure /security into a trust-center layout"
```

---

### Task 3: Full verification and PR

**Files:** none (verification + ship)

- [ ] **Step 1: Lint, test, build**

Run: `npm run lint && npm test && npm run build`
Expected: lint passes, existing vitest suites pass (no regressions), build succeeds.

- [ ] **Step 2: Confirm security.txt is served**

Run: `cat dist/.well-known/security.txt`
Expected: the RFC 9116 content from Task 1.

Optional live check after `npm run preview`:
Run: `curl -sS http://localhost:8080/.well-known/security.txt` (use the port the preview server reports if different)
Expected: the RFC 9116 content is returned with a 200.

- [ ] **Step 3: Push the branch and open the PR**

```bash
git push -u origin HEAD
gh pr create --base main --title "feat(security): upgrade /security into a trust-center layout" --body "$(cat <<'EOF'
Upgrades the existing /security page in place into a scannable trust-center layout and adds an RFC 9116 security.txt. No new route.

## What changed
- Controls-at-a-glance grid (nine bordered cards, no pill chips): encryption at rest/in transit, bank-level OAuth, account isolation, no AI training, US data residency, encrypted backups, static-analysis CI, and HTTP security headers.
- Store / never-store as a two-column comparison.
- Honest "compliance status" definition list (SOC 2 = in progress); no fabricated certifications.
- New sections: backups and recovery, data residency (scoped to stored data; per-request Claude path acknowledged), and responsible disclosure with a tightly-scoped safe harbor.
- New public/.well-known/security.txt pointing at support@zensus.app (temporary security contact, to swap to security@ later).

## Notes
- All claims are real and verifiable; reviewed by Codex (US-residency scope tightened, safe-harbor wording scoped, security.txt Policy anchored, /subprocessors linked).
- No App.tsx / sitemap / prerender changes (route unchanged).

Spec: docs/superpowers/specs/2026-06-16-security-page-trust-upgrade-design.md

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Expected: PR opens against `main`. Do not merge directly; the user squash-merges via the GitHub UI (`main` is branch-protected and auto-deploys to Vercel).

---

## Self-Review

**Spec coverage:**
- Controls grid (9 cards incl. security headers): Task 2 `CONTROLS`. ✓
- Two-column store/never-store: Task 2. ✓
- Compliance status rows incl. Transport: Task 2 `COMPLIANCE_ROWS`. ✓
- Backups and recovery, Data residency (scoped), Responsible disclosure (scoped safe harbor, `id="responsible-disclosure"`): Task 2. ✓
- `/subprocessors` link in procurement CTA: Task 2. ✓
- Meta description extended with "US data residency": Task 2 Helmet. ✓
- `security.txt` (RFC 9116, temporary contact comment, Policy anchored): Task 1. ✓
- Section gains optional `id`: Task 2 `Section`. ✓
- No new route / sitemap / prerender: confirmed (Non-goals). ✓
- Verification via lint/test/build/dist/visual: Task 3. ✓

**Placeholder scan:** No TBD/TODO; all code and copy are complete. ✓

**Type consistency:** `Control` consumes `{ icon: LucideIcon; title; detail }` matching `CONTROLS` entries; `Section` signature `{ title; id?; children }` matches all call sites (only the Responsible disclosure call passes `id`); `COMPLIANCE_ROWS` typed `[string, string][]` matches the `.map(([label, value]))` destructure. ✓

**Em-dash / pill-chip / honesty constraints:** copy uses no em-dashes; cards are `rounded-md border`, not `rounded-full`; no fabricated certifications; SOC 2 stays "in progress." ✓
