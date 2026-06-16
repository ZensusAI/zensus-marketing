# Security page trust upgrade

Date: 2026-06-16
Status: Approved (pending spec review)
Route: `/security` (in place, no new route)

## Context

A platform that manages financial data has to show trust. Anthropic's
`trust.anthropic.com` is the reference: a SafeBase-style trust center built
around certifications they actually hold (SOC 2 Type II, ISO 27001), with a
trust-signal grid, a security-controls matrix, a subprocessor list, and a gated
"request documents" flow.

Zensus already has `src/pages/Security.tsx`. It is honest and well written, but
it is a single column of prose: data flow, what we store / never store, account
isolation, CI security, no AI training, and a "not yet SOC 2 certified, working
toward it" note. It reads correctly but it is not scannable, and the real
controls Zensus does have are buried in paragraphs.

Zensus is pre-SOC 2 by its own admission. A trust center is a powerful signal
only if it is true. Fabricated compliance badges would be worse than nothing
and would burn credibility with exactly the procurement and finance buyers who
check. So this upgrade showcases the real controls Zensus has and stays
straight about SOC 2 being in progress.

## Goals

- Make the existing `/security` page scannable: a "controls at a glance" grid
  up top, a two-column store / never-store comparison, an honest compliance
  status block.
- Surface three additional real signals the founder confirmed: US data
  residency, encrypted backups with disaster recovery, and a responsible
  disclosure policy.
- Add a machine-readable `security.txt` (RFC 9116).
- Keep every existing fact and the honest SOC 2 posture.

## Non-goals

- No new route. `/security` stays canonical. No `App.tsx`, sitemap, or
  prerender changes.
- No third-party trust-center vendor (SafeBase / Vanta / Drata).
- No gated document portal. The "request documentation" action stays a
  contact CTA, not an NDA-gated download library.
- No new compliance claims. No SOC 2 / ISO / HIPAA / GDPR badges.
- No MFA / SSO claim (not confirmed by the founder).

## Constraints

- **No decorative pill chips.** The controls grid uses bordered `rounded-md`
  cards and an unboxed mono eyebrow, not `rounded-full` badges. Rounded-full
  chips read as AI-generated and are a standing no.
- **No em-dashes.** Anywhere. Use commas, parentheses, semicolons, or split
  sentences.
- **No "AI product" positioning.** Security context is allowed to discuss not
  training AI on customer data; that is a trust statement, not marketing.
- **Honesty.** Only feature what is true. SOC 2 stays "in progress" and stays
  prominent, not buried.
- Real brand name "Zensus" in copy (also helps AI entity recognition).

## Confirmed real trust signals

Already published on the page (kept):
- Encryption at rest, AES-256-GCM.
- Encryption in transit, TLS.
- Bank-level OAuth via Plaid and Intuit (QuickBooks); providers hold the
  credentials.
- Account-level isolation (every query filtered by user ID).
- Static analysis in CI: Semgrep on every commit, Gitleaks blocking secret
  commits, automated dependency vulnerability alerts.
- No AI training on customer data.
- Hosted on AWS.

Newly confirmed by the founder (added):
- US data residency (AWS US region).
- Encrypted backups with a tested recovery process.
- Responsible disclosure policy with a security contact.

Explicitly not claimed: MFA / SSO (unconfirmed), and any compliance
certification.

## Design

In-place restructure of `src/pages/Security.tsx`. Reuses the existing `Section`
component pattern and the page chrome (Navbar, Footer, Helmet, breadcrumb
JSON-LD, TalkToUsButton). Adds one small local `CONTROLS` data array and a
small bordered-card `Control` component in the same file. If the file grows
unwieldy later, the grid can be extracted to `src/components/security/`; not
needed now.

### Page order

1. **Hero** (kept): H1 "How Zensus handles your financial data" + existing lead
   paragraph.
2. **Controls at a glance** (new): unboxed mono eyebrow `CONTROLS AT A GLANCE`,
   then a responsive grid (2 cols mobile, up to 4 on desktop) of bordered
   `rounded-md` cards. Each card: a lucide icon, a short title, a one-line
   descriptor. Eight cards:
   - Encryption at rest, "AES-256-GCM"
   - Encryption in transit, "TLS on every request"
   - Bank-level OAuth, "Plaid and Intuit hold credentials"
   - Account-level isolation, "Every query scoped to your user"
   - No AI training, "Your data never trains a model"
   - US data residency, "AWS, United States region"
   - Encrypted backups, "Tested recovery, not a first-time restore"
   - Static analysis in CI, "Semgrep and Gitleaks on every commit"
3. **Data flow at a glance** (kept prose).
4. **What Zensus stores / never stores** (restructured): two side-by-side
   bordered cards. Left "Stores" lists OAuth tokens (encrypted), transactions
   in the sync window, scenario history, derived runway and alert state. Right
   "Never stores" lists bank or QuickBooks passwords, payment card details, raw
   transactions outside the sync window. On mobile the columns stack.
5. **Account-level isolation** (kept prose).
6. **Backups and recovery** (new prose): regular encrypted backups on AWS, the
   recovery process is tested so a restore is a known procedure rather than a
   first-time experiment during an incident.
7. **Data residency** (new prose): Zensus runs on AWS in a US region; financial
   data, OAuth tokens, and scenario history stay in US infrastructure; specific
   region or a data-flow diagram available on request.
8. **CI security** (kept prose).
9. **AI and your data** (kept prose).
10. **Compliance status** (restructured from "Compliance posture"): honest
    labeled rows (a definition list), not badges:
    - SOC 2: In progress, working toward it
    - Encryption: AES-256-GCM at rest, TLS in transit
    - Hosting: AWS, United States region
    - Backups: Encrypted, recovery tested
    - AI training: None on your data
    Followed by the existing sentence that data-protection and access-control
    practices are documented and reviewable on request.
11. **Responsible disclosure** (new prose): report issues to
    `support@zensus.app` (temporary contact; see dependency below), good-faith
    research welcome, no legal action against researchers who report
    responsibly and avoid accessing data that is not their own, and a pointer
    to `/.well-known/security.txt`.
12. **Need documentation for procurement?** (restructured Contact + CTA):
    request the security overview, subprocessor list, and data-handling
    details; `mailto:support@zensus.app` plus the existing `TalkToUsButton`.

### Copy drafts for new sections

Backups and recovery:
> Your data is backed up on a regular schedule. Backups are encrypted at rest
> on the same AWS infrastructure, and we test our recovery process, so a
> restore is a known procedure rather than something we attempt for the first
> time during an incident.

Data residency:
> Zensus runs on AWS in a United States region. Your financial data, OAuth
> tokens, and scenario history stay in US infrastructure. If your procurement
> process needs the specific region or a data-flow diagram, ask and we will
> share it.

Responsible disclosure:
> Found a security issue? Email support@zensus.app and we will work with you on
> it. We welcome good-faith research and will not pursue legal action against
> researchers who report responsibly, give us reasonable time to fix the issue,
> and avoid accessing data that is not their own. Our machine-readable policy
> lives at /.well-known/security.txt.

### Helmet / SEO

Keep the existing title, canonical, og/twitter tags, and breadcrumb JSON-LD.
Lightly extend the meta description to include "US data residency" (a real
procurement keyword) without overstating anything.

## Files changed

1. `src/pages/Security.tsx` (rewrite): `CONTROLS` array + bordered-card
   `Control` component, two-column store / never-store, compliance-status
   definition rows, three new prose sections, extended meta description. Same
   route, same chrome.
2. `public/.well-known/security.txt` (new), RFC 9116:
   ```
   Contact: mailto:support@zensus.app
   Expires: 2027-06-15T23:59:59.000Z
   Preferred-Languages: en
   Canonical: https://zensus.app/.well-known/security.txt
   Policy: https://zensus.app/security
   ```

## Dependencies and assumptions

- **Security contact is temporary.** The page and `security.txt` use
  `support@zensus.app` for now, by founder request, to be swapped to
  `security@zensus.app` later. A code comment in `Security.tsx` and a note in
  `security.txt` mark it as the temporary contact so the future swap is a quick
  find-and-replace. The founder selected `support@zensus.app` as the contact
  for now. Note the `/support` *route* is edge-redirected in `vercel.json`, but
  that is a URL route and does not affect the email address of the same name.
- **security.txt must reach `dist/`.** Vite copies `public/` to the build
  output root. Verify the dotfile lands at `dist/.well-known/security.txt`
  after `npm run build`; if Vite strips the dotdir, fall back to a `vercel.json`
  route or rename strategy. Confirm `vercel.json` has no redirect or rewrite
  that swallows `/.well-known/*`.

## Verification

No test runner is configured. Verify by:
- `npm run lint` passes.
- `npm run build` succeeds and `dist/.well-known/security.txt` exists with the
  expected content.
- `npm run preview` (or serve `dist/`): `/security` renders the grid, the
  two-column comparison, the compliance rows, and the three new sections; no
  rounded-full pill chips; no em-dashes in the rendered copy.
- `curl` the served `/.well-known/security.txt` returns the RFC 9116 file.

## Ship

Branch off `origin/main`, push, open a PR, squash-merge via the GitHub UI
(`main` is branch-protected and auto-deploys to Vercel). No direct push.
