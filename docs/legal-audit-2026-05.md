# Legal audit — Terms of Service + Privacy Policy refresh

**Linear:** [ZEN-243](https://linear.app/zensus/issue/ZEN-243)
**Audit date:** 2026-05-18
**Audit baseline:** "Last Updated: February 18, 2026" on the live `/privacy` and `/terms` pages
**Codebase audited:** [ZensusAI/zensus](https://github.com/ZensusAI/zensus) `main` (HEAD `52c915bc`, 2026-05-14), plus this marketing repo
**Method:** five parallel research agents, each owning one slice (integrations, AI/ML, auth + admin, data + retention, subprocessors + tracking). All findings are read-only and cite `path:line` against the monorepo.

This document is the **Phase 1 deliverable** of ZEN-243. It enumerates material product changes since 2026-02-18, the legal-text implications of each, and the founder/counsel decisions needed before Phase 2 (drafting updates to `Terms.tsx` and `Privacy.tsx`).

Per the ticket: do **not** start drafting legal text until the founder has signed off on this list of changes.

---

## Executive summary — founder/counsel decisions needed

These are the items that cannot be resolved by an engineer and must be settled before Phase 2.

1. **Admin impersonation has zero user notification.** Authorized staff (`hello@zensus.app`) can sign in as any user. The audit log is Postgres-only (no S3/WORM), the impersonated user receives no email or in-app banner, and the audit row outlives the user (no FK to `user.id`). SOC 2 / GDPR transparency expectations favor at-minimum post-session notification. **Decision needed:** ship notification flow before publishing the new Privacy Policy, or disclose the current posture explicitly. (Refs: `apps/backend/src/admin-impersonation/`, ZEN-205, ZEN-207, ZEN-209.)

2. **No machine-readable data export endpoint.** Published `docs/compliance/data-protection-policy.md:217-225` promises portability within 30 days. No matching code path exists in `apps/backend/src`. GDPR Art. 20 / CCPA right-to-know cannot be served at scale today. **Decision:** build `/api/user/export` before refreshing Privacy, or rewrite Privacy to describe a documented manual workflow with stated SLA.

3. **Retention claim ↔ code mismatch.** Compliance policy says "+90 days" account retention post-deletion; `UserService.deleteAccount` (`apps/backend/src/user/user.service.ts:317-404`) does an immediate hard `repository.remove(user)` with Postgres cascades. **Decision:** tighten Privacy copy to match code (immediate hard delete with named survivors), or implement the 90-day grace window. Cannot publish ambiguous text.

4. **Consent banner is absent on both surfaces.** GA4 fires on `zensus.app` (`index.html:23-30`) and PostHog fires on `app.zensus.app` (`apps/landing/components/PostHogProvider.tsx:14`) before any consent. Non-essential cookies are set pre-consent. **Decision:** deploy a banner with Google Consent Mode v2 default-denied + PostHog opt-in gate, **or** drop the analytics SDKs entirely (IndexNow + Search Console already cover SEO-side observability). EU/UK traffic creates real ePrivacy / GDPR Art. 7 exposure today.

5. **Anthropic was removed but Bedrock added as primary AI host.** All Claude inference now runs through AWS Bedrock (Sonnet 4.5 + Haiku 4.5); the `@anthropic-ai/sdk` import was removed in ZEN-258. Privacy must replace any "Anthropic as subprocessor" language with "AWS (Bedrock, region us-east-1)" and disclose model lineup. (Refs: `apps/backend/src/ai/providers/bedrock.provider.ts`.)

6. **OpenAI Whisper is the only data class that leaves the AWS boundary.** Voice audio uploads under default OpenAI API retention; ZDR is not negotiated at the org level. **Decision:** keep Whisper and disclose default retention, or negotiate ZDR with OpenAI before publishing.

7. **No content-license clause for user-generated AI inputs.** Scenario chat text, user-typed vendor names, and override reasons are forwarded to AWS Bedrock; today nothing in Terms grants Zensus the right to process this content. **Decision:** counsel-reviewed license clause in Phase 2.

8. **`impersonation_audit` retention is effectively permanent.** Table has no DELETE method and `down()` refuses to drop the migration. Holds `targetEmail`, `startedFromIp`, `userAgent` past account deletion. GDPR Art. 17(3)(e) supports retention for legal-defense, but a stated ceiling is required for Art. 30 records of processing. **Decision:** stated retention window (e.g., 24 months, then redaction of PII) before Privacy publishes the practice.

9. **DPA inventory.** Confirm signed DPAs / BAAs exist for: AWS (Bedrock + SES + RDS), Supabase, Plaid, Stripe, HubSpot, Slack, Intuit (QuickBooks Online), OpenAI, PostHog, Google (GA4), Hugging Face, ipapi.co.

---

## 1. Subprocessors

### What changed in the product

**New since 2026-02-18:**

- **HubSpot, Inc.** — CRM sync (contacts, companies, line items, invoices, subscriptions, raw_properties jsonb); added 2026-03-26 (`50b6d132`, PR #280); expanded with subscription/MRR tracking 2026-03-31 (`f5bb44e2`, PR #335). `apps/backend/src/hubspot/hubspot.service.ts:82-90`.
- **Slack Technologies, LLC** — workspace OAuth, alert delivery, interactivity payloads, `im:history` read scope (currently unused). Added 2026-04-15 across ~25 commits. `apps/backend/src/slack/slack.constants.ts:6-16`.
- **ipapi.co** — IP geolocation / VPN-proxy detection on integration connect; end-user IP forwarded to `https://ipapi.co/{ip}/json/`. Added 2026-04-24 (`2ebc11d6`, ZEN-87). `apps/backend/src/ip-intelligence/ip-intelligence.service.ts:67`.
- **AWS Bedrock** — primary LLM runtime (Sonnet 4.5 + Haiku 4.5), default region `us-east-1`. Sonnet 4 → 4.5 model bump 2026-05-13 (`4c147408`). Classifier migrated onto Bedrock 2026-05-12 (`d297b15b`). `apps/backend/src/ai/providers/bedrock.provider.ts:14,31,59`.

**Removed since 2026-02-18:**

- **Anthropic, Inc. (direct API)** — `@anthropic-ai/sdk` and `ANTHROPIC_API_KEY` dropped in ZEN-258 (`b8608f19`, `17285d2e`). All Claude traffic now routes through AWS Bedrock; Anthropic is no longer a direct subprocessor.

**Current full subprocessor list** (sort: new first, then alphabetical):

| Subprocessor | Purpose | Data shared | Country | New since 2026-02-18? |
|---|---|---|---|---|
| HubSpot | CRM sync, webhooks | OAuth tokens, contacts, companies, invoices, subscriptions, raw_properties | US | **Yes** |
| Slack | Cash alerts, interactivity | Workspace OAuth, channel IDs, alert message contents | US | **Yes** |
| ipapi.co | IP intelligence | End-user IP | US | **Yes** |
| AWS (Bedrock, SES, RDS, Amplify, CloudWatch, KMS-style creds) | AI inference, email, primary DB, hosting, logs | All customer data classes | US (`us-east-1` default) | Bedrock model lineup new; rest preexisting |
| Apple (Sign in with Apple) | OAuth identity | Email/relay, Apple sub | US | No |
| Google Identity (OAuth) | OAuth identity | Email, name, Google sub | US | No |
| Google Fonts | Geist + Open Sans webfonts | End-user IP | US | No |
| Google Analytics 4 (`G-T8W39D59R9`) | Marketing analytics | IP, UA, referrer, page paths, `_ga*` cookies | US | No |
| Hugging Face Inference | Emotion detection for TTS | Audio-derived text snippets | US | No |
| OpenAI | Whisper STT | Voice audio buffers (PII risk) | US | No |
| Plaid | Bank linking, transactions, balances | OAuth tokens, transactions, account metadata | US | No |
| PostHog (US Cloud) | Product analytics | Distinct ID, pageviews, exception traces | US | No |
| QuickBooks (Intuit) | Accounting sync | OAuth tokens, customer/invoice/payment data | US | No |
| Stripe | Subscription billing | Customer ID, email, subscription/price IDs (card data stays at Stripe) | US | No (added 2026-02-04, just pre-cutoff) |
| Supabase | Identity, sessions, admin impersonation mint | Email, hashed password, session/refresh JWTs | US | No |
| Vercel | Marketing-site hosting | HTTPS traffic, build logs | US | No |

**Not present in either repo** (verified via grep + package.json across `apps/` and marketing repo): Sentry, Datadog, BetterStack, SendGrid, Postmark, Resend, Loops, Auth0, GrowthBook, LaunchDarkly, Statsig, Meta/X/LinkedIn/Reddit pixels, Apollo, Plausible, Vercel Analytics, Vercel Speed Insights.

### What this requires in legal text

- **Privacy:** dedicated `/subprocessors` page (recommend a new marketing route mirroring the `Integrations` IA already in `src/App.tsx:23-28`) with the full table above and a "last updated" stamp. Link it from Privacy. Today neither `Privacy.tsx` (marketing) nor `apps/landing/app/privacy/page.tsx` (product) names AWS, Bedrock, OpenAI, Hugging Face, ipapi.co, Supabase, PostHog, GA4, Stripe, Slack, HubSpot, QuickBooks, or Plaid as processors.
- **Privacy:** international-data-transfer language (DPF / SCCs). All subprocessors operate in the US; EU/UK visitors hitting the marketing site fire GA4 immediately.
- **Privacy:** remove "Anthropic" if it appears in current copy; add "AWS Bedrock (region `us-east-1`)" with model lineup (Claude Sonnet 4.5, Claude Haiku 4.5).
- **ToS / Privacy:** subprocessor change-notification cadence (industry norm: 30-day notice before adding new subprocessors).

---

## 2. Integrations & webhooks

### What changed in the product

**Plaid:** scope unchanged (`Products.Transactions` only; no Identity / Income / Liabilities). Real-time balance endpoint added (`apps/backend/src/plaid/plaid-data.service.ts:188-237`, ZEN-248, 2026-05-11). Pending vs. posted split (ZEN-249). Webhook JWT verification hardened (ES256 + JWKS cache + 5-min token age cap, `apps/backend/src/plaid/plaid-webhook.controller.ts:58-163`). Concurrent-webhook idempotency lock (ZEN-247). SDK bumped 26 → 42.1.0. Access tokens AES-256-GCM at rest (`apps/backend/src/plaid/plaid.service.ts:43-46`). **Raw Plaid payloads not retained**; only normalized projection persists.

**QuickBooks:** scope unchanged (`com.intuit.quickbooks.accounting` only). Read-only sync of `Purchase / Bill / Payment / Invoice` + P&L + BalanceSheet reports. Reactive 401-refresh handler added (`a1b1bd0e`, ZEN-94). **No QuickBooks webhook handler exists** (verified by grep).

**HubSpot (NEW INTEGRATION):**
- Required scopes: `oauth`, `crm.objects.contacts.read`, `crm.objects.companies.read`, `crm.objects.line_items.read`, `settings.currencies.read`, `crm.objects.invoices.read`, `crm.schemas.invoices.read` (`apps/backend/src/hubspot/hubspot.service.ts:82-90`).
- Optional scopes: `crm.objects.subscriptions.read`, `crm.schemas.subscriptions.read` (`:95-98`).
- Persists: connected user's email (`hubspot-connection.entity.ts:131-135`), subscription details with `raw_properties` jsonb (`hubspot-subscription.entity.ts:57-99`).
- Webhook at `POST /api/hubspot/webhook` with HubSpot v3 HMAC-SHA256 signature verification (`hubspot-webhook.controller.ts:78-221`). Filters to `invoice.*` and `subscription.*` only. Async via Bull queue with idempotency key.

**Stripe:** no new scope surface. Subscription / invoice / charge / dispute / payment_intent / checkout events all handled (`apps/backend/src/stripe/stripe-webhook.service.ts:266-349`). 7 new billing-lifecycle email templates (`e1de1709`, 2026-02-20). Impersonation block on Stripe + integration endpoints (`d8ac91d4`, 2026-05-06). No PAN/CVV stored.

**Slack (NEW INTEGRATION):**
- Bot scopes: `chat:write`, `chat:write.public`, `channels:read`, `groups:read`, `commands`, `links:read`, `links:write`, `app_mentions:read`, `im:history` (`apps/backend/src/slack/slack.constants.ts:6-16`).
- Event subscriptions: `app_uninstalled`, `tokens_revoked`, `app_mention`, `link_shared`.
- Endpoints: `GET /api/slack/install`, `GET /api/slack/oauth/callback`, `POST /api/slack/events`, `POST /api/slack/interactive` (HMAC-SHA256 v0 signature verification).
- Installation persists encrypted bot tokens, scopes array, app_id, team_id, enterprise_id, and full Bolt installation payload encrypted in `raw_install_payload` jsonb.
- Outbound: `chat.postMessage` only, carrying aggregate cash-flow alert text + Block Kit blocks. No raw transaction lines.
- Gated by `FF_SLACK_ALERTS` feature flag.

**Other auth providers:** Apple Sign-in pre-existing; Google Sign-In verification migrated to local JWKS (`a6026cc7`, 2026-03-08); no new data sharing. No Auth0 wired up despite the ticket mentioning it.

### Webhook inventory

| Path | Verb | Source | Data in | Signature verified? | Added since 2026-02-18? |
|---|---|---|---|---|---|
| `/api/plaid/webhook` | POST | Plaid | webhook_type, item_id, sync notifications | Yes — JWT ES256 via JWKS, 5-min token age cap | No (preexisting; verification hardened) |
| `/api/hubspot/webhook` | POST | HubSpot | invoice.*, subscription.* events, portalId, objectId | Yes — HMAC-SHA256 V3 + timestamp | **Yes** (2026-03-26) |
| `/api/stripe/webhook` | POST | Stripe | subscription, invoice, charge, dispute, payment_intent, checkout | Yes — `stripe.constructEvent` | No (preexisting; new event types added) |
| `/api/slack/events` | POST | Slack | url_verification, app_uninstalled, tokens_revoked, app_mention, link_shared | Yes — SlackSignatureGuard | **Yes** (2026-04-15) |
| `/api/slack/interactive` | POST | Slack | Block Kit action payloads | Yes | **Yes** (2026-04-15) |
| `/api/slack/install` | GET | User browser | OAuth init | N/A | **Yes** (2026-04-15) |
| `/api/slack/oauth/callback` | GET | Slack | OAuth code + signed state JWT | State JWT verified | **Yes** (2026-04-15) |

QuickBooks: **no webhook handler exists**.

### What this requires in legal text

- **ToS:** explicit disclosure of HubSpot integration (CRM sync, OAuth scopes named), Slack integration (alert posting, bot scopes including `im:history`).
- **Privacy:** named data categories per integration; HubSpot adds connected-admin email + `raw_properties` jsonb. Slack adds workspace metadata + interactivity payloads. ipapi.co adds end-user IP forwarding (this is a new external recipient of an existing data class).
- **Privacy:** Plaid section can stay narrow because raw payloads aren't retained; clarify the AES-256-GCM at-rest encryption of OAuth tokens.
- **Privacy:** disconnect/revocation behavior per integration. Plaid + QB + HubSpot + Slack each have disconnect flows that revoke and delete connection rows; document the disconnect path and what is/isn't purged.

---

## 3. AI / ML processing

### What changed in the product

All Claude inference routes through AWS Bedrock (`apps/backend/src/ai/providers/bedrock.provider.ts:109,211`). No direct Anthropic API in either app. Only direct non-AWS LLM provider is OpenAI (Whisper only).

Live AI surfaces:

| # | Surface | Provider | Model | Data sent | Retention | Auto-decision? |
|---|---|---|---|---|---|---|
| 1 | Runway scenario chat | Bedrock | `claude-sonnet-4-5-20250929` | User chat message + up to 40 prior turns + financial context (cash, MRR, expenses by category, subscription billing timeline) | Bedrock default (no logging by default); no prompt caching configured | Advisory only — user accepts/rejects scenarios |
| 2 | Catherine general chatbot | Bedrock | `claude-sonnet-4-5-20250929` | User message + UserContext (income, goals, topics) + recent conversation memory | Bedrock default; Redis cache 5-60 min for voice mode | No |
| 3 | Public demo chatbot (`/public/chat`) | Bedrock | `claude-sonnet-4-5-20250929` | Unauthenticated visitor input (max 500 chars/DTO), persona prompt | Bedrock default | No |
| 4 | Haiku transaction classifier | Bedrock | `claude-haiku-4-5` (`us.anthropic.claude-haiku-4-5-20251001-v1:0`) | Sanitized bank descriptor, amount, direction, Plaid PFC code | Bedrock default; Redis cache 90 days (`HaikuCacheService`) | **Yes — display grouping; user override available** |
| 5 | Forecast revenue-stream categorizer | Bedrock | `claude-sonnet-4-5-20250929` | Top-50 inflow vendors with monthly average dollars | Bedrock default | Display only |
| 6 | Conversation summarizer | Bedrock | `claude-sonnet-4-5-20250929` | Full Catherine transcript | Bedrock default | No |
| 7 | Whisper STT | **OpenAI** | `whisper-1` | **Raw user audio (up to 25MB)** | **OpenAI default API retention; ZDR not negotiated in code** | No |

**Embeddings / vector DBs:** none. No pgvector, Pinecone, Chroma, Weaviate. (Cartesia voice-profile vectors at `apps/backend/src/ws/tts.proxy.ts` are out of scope.)

**Internal storage:** all chat content (user + assistant), tool-call inputs/results, and token counts persist in `runway_chat_*` and `conversation`/`message` Postgres tables. Voice-mode responses cached in Redis with 5-60 min TTL.

**Prompt caching:** not enabled (`bedrock.provider.ts:91-99,180-188` emits no `cache_control` blocks). Cannot claim caching reduces data exposure.

### What this requires in legal text

- **Privacy:** AI subprocessor disclosure — AWS Bedrock (region `us-east-1` default) + OpenAI Whisper. Name the model lineup (Sonnet 4.5, Haiku 4.5, Whisper-1). State that **Anthropic does not see customer data** because inference is hosted by AWS.
- **Privacy:** AI input data categories: financial position (cash, MRR, expenses), subscription/billing-timeline detail, conversation transcripts, bank-transaction descriptors and amounts, user-stated goals, voice audio.
- **Privacy:** internal AI-output storage: chat transcripts and AI-derived transaction categories persisted indefinitely in our DB; voice responses cached up to 60 min in Redis.
- **Privacy:** voice audio is the **only data class that leaves the AWS boundary** (OpenAI Whisper). Disclose default OpenAI retention unless ZDR is negotiated before publishing.
- **ToS:** AI-generated outputs are informational; **not professional financial, tax, legal, or accounting advice**.
- **ToS:** acceptable-use clause covering the unauthenticated `/public/chat` demo (today only rate-limited 30/min, not contractually constrained).
- **ToS:** no-warranty on AI features (accuracy, availability, model-behavior changes — including the recent Sonnet 4 → 4.5 swap).
- **GDPR Art. 22:** no feature meets the "solely automated decision-making with legal or similarly significant effect" threshold. The Haiku classifier auto-categorizes transactions for display only, and `UserCategoryOverride` provides the Art. 22(3) human-intervention right. Recommend disclosing the classifier and the override path in Privacy as Art. 22(3) hygiene anyway.

---

## 4. Authentication

### What changed in the product

**MFA / TOTP:** **not implemented for end users**. Admin-only TOTP gates impersonation (`apps/backend/src/admin-impersonation/services/totp-verification.service.ts:1-187`). Replay protection (90s window keyed by `sha256(secret:token)`) + per-account brute-force lockout (5 fails / 5 min → 15 min lock). Secret AES-256-GCM in `user.impersonationTotpSecretEncrypted` (TEXT, `select: false`, `@Exclude()`). No recovery codes; only `hello@zensus.app` is enrolled. Enrollment is operator-only via CLI (`apps/backend/src/admin-impersonation/scripts/enroll-totp.ts`).

**OAuth providers (current):**

| Provider | Live? | Scopes | New since 2026-02-18? |
|---|---|---|---|
| Google | Yes | ID-token-only (FE-set scopes); BE only verifies via JWKS | No (verification mechanism changed to local JWKS on 2026-03-08) |
| Apple | Yes | `name email`, CSRF state in Redis 10 min | No |
| Auth0 | Yes | Token-bearer; FE/Auth0 holds scopes | No |
| Supabase native | Yes (impersonation only) | n/a | **Yes** (impersonation flow) |
| Email + password | Yes | bcrypt; per-email lockout 10/15 | No |
| Email OTP (6-digit) | Yes | 3 sends/min, 5 verify/10 min, MX validation | No (hardened) |
| Guest session | Yes | 5/hour per IP | No |

**Sessions:** access token TTL 900s (15 min); refresh 7 days default, 30 days with `rememberMe=true`. Global revocation via `user.tokenInvalidatedBefore`. Per-token Redis blacklist on logout. `POST /auth/logout-all` invalidates all devices. No per-device session listing/revocation surface. No server-side idle timeout beyond 15 min access expiry.

**Account recovery:** **no `forgot-password` / `reset-password` HTTP routes exist**. Dormant `User.resetToken` infrastructure exists in `apps/backend/src/user/user.service.ts:88-178` but is not exposed. Live recovery path is email OTP only. No security questions, no SMS, no backup codes.

### What this requires in legal text

- **Privacy:** "How we recover accounts" — describe email OTP only. Do **not** mention password reset (dormant code).
- **Privacy / ToS Account Security clause:** state end-user MFA is **not currently offered** so we do not over-claim. (The admin-only TOTP is internal and disclosed under §5 Admin impersonation.)
- **Privacy:** session lifetime + multi-device revocation surface. Note that `logout-all` is per-user, not per-device.
- **Recommendation to founder:** decide "ship or remove" on the dormant `resetToken` columns. Privacy text should describe what actually exists, not a future plan.

---

## 5. Admin impersonation (CRITICAL — dedicated section required)

### What changed in the product

This is the largest legal-exposure delta in this audit. Module is entirely new since 2026-02-18 (`apps/backend/src/admin-impersonation/`, ZEN-49 / ZEN-198 / ZEN-199 / ZEN-201 / ZEN-205 / ZEN-207 / ZEN-209 / ZEN-214).

**Who can impersonate:** a single hardcoded identity, `hello@zensus.app`, in source (not env) at `apps/backend/src/admin-impersonation/hardcoded-admin.ts:10`. Enforced by `HardcodedAdminGuard`. Source-code constant is intentional: infra access alone cannot grant impersonation; PR + deploy required.

**Conditions / gating** (`admin-impersonation.service.ts:85-266`, in order):
1. `AdminImpersonationFeatureFlagGuard` kill-switch (`FF_ADMIN_IMPERSONATION`); returns 404 when off.
2. `SupabaseAuthGuard` — admin holds valid Supabase session.
3. `HardcodedAdminGuard` — session email matches the constant.
4. Throttle: 10 / 15 min per IP.
5. TOTP `verifyAndConsume` (replay-proof, per-account lockout). Failures persisted to `impersonation_audit` as `endReason='totp_failed'`.
6. Self-impersonation block.
7. Single-active-session lock (partial unique index `UQ_impersonation_audit_one_active_per_admin`).
8. Target lookup; Supabase session minted with refresh token **stripped** so admin cannot extend.

**Session lifetime:** ~1 h Supabase TTL. `ExpirySweeperCron` flips lingering rows to `expired` ~1 min after the boundary.

**In-session safeguards:** `BlockDuringImpersonationGuard` blocks integration connect/disconnect (Plaid, QuickBooks, HubSpot, Slack), account deletion, profile/income changes, and Stripe endpoints while impersonating (ZEN-201).

**Audit log:** `impersonation_audit` Postgres table (`apps/backend/src/migrations/1781000000001-CreateImpersonationAuditTable.ts`).
- Columns: `id` uuid PK, `adminEmail` text, `targetUserId` int (nullable for `totp_failed`), `targetEmail` text, `reason` text, `startedFromIp` inet, `userAgent` text, `startedAt`, `endedAt`, `endReason` text (`active | exited | expired | enrolled | re_enrolled | totp_failed | forced`).
- Indexes: `(adminEmail, startedAt DESC)`, `(targetUserId, startedAt DESC)`, `(endReason, startedAt DESC)`, plus partial unique on active sessions per admin.
- **Storage:** Postgres only. No S3 streaming. No Object Lock. No WORM bucket.
- **Retention:** effectively permanent. Append-only at app layer; `down()` throws to refuse rollback (cites SOC 2 intent).
- **FK to `user.id`:** none, intentionally. Rows outlive the user.

**Per-request audit during a session:** emitted by `ImpersonationAuditInterceptor` (`interceptors/impersonation-audit.interceptor.ts:56-58`) as a structured logger line. Goes to **PM2 stdout / CloudWatch only**, not to the Postgres audit table. Durability of "what did the admin do during the session" depends on CloudWatch retention.

**User notification:** **None. Ever.** No email at start, during, or after. Confirmed by grep of `apps/backend/src/admin-impersonation/` for `notif|sendMail|sendEmail|mailer` — zero results outside ZEN-252 placeholder comments.

### What this requires in legal text

- **Privacy:** dedicated subsection — "Administrative access to your account" — disclosing:
  - Authorized Zensus personnel can sign in as a user under conditional gating (TOTP, rate limit, kill-switch, audit log).
  - Named purposes: support requests, debugging, security incident response.
  - Per-session lifetime (~1 h Supabase TTL).
  - What an admin cannot do while impersonating (integration connect/disconnect, deletion, profile changes, Stripe).
  - Audit log retention window (see decision #8 in executive summary).
- **Privacy:** if the founder declines to ship a notification flow, the Privacy page must be explicit that no contemporaneous notice is provided — vagueness creates real exposure.
- **ToS:** statement that impersonation is for support / debugging / incident response only, and that activity is logged.
- **Founder decisions before publish** (also listed in executive summary):
  - **HIGH:** ship at-minimum post-session email to the impersonated user, queued from `service.end()` / `service.forceEnd()`. Recommended even if Privacy is rewritten — SOC 2 CC6.1/CC7.2 and GDPR Art. 5(1)(a) transparency expectations favor it.
  - **MED:** per-action audit currently lives in CloudWatch only; if subpoenaed, durability depends on log-group retention configured outside this repo. Either copy structured per-request logs into a durable table, or state CloudWatch retention in Privacy.
  - **MED:** state a retention ceiling for `impersonation_audit` PII (e.g., 24 months, then redact target email + IP while keeping the security-event signal).

---

## 6. Data collection & new schema

### What changed in the product

29 new TypeORM migrations since cutoff (`apps/backend/src/migrations/*`). Material additions:

| Table.column / new table | Category | Sensitivity | Migration |
|---|---|---|---|
| `stripe_subscription.gracePeriodWarned` | Behavioral | Low | `1740067200000` |
| `runway_snapshot.expense_data_basis` jsonb | Derived | Low | `1741100000000` |
| `user.tokenInvalidatedBefore` | Security | Low | `1741400000000` |
| **NEW** `forecast_snapshot` (cash, MRR, expenses jsonb, AR/AP, historical P&L jsonb, revenue streams jsonb) | Financial + derived | **High** | `1741800000000` |
| `user.resetTokenIdentifier` | Security | Low | `1742900000000` (dormant) |
| **NEW** `hubspot_connection` (encrypted access + refresh tokens, portalInfo jsonb) | Personal identifier + behavioral | **High** | `1742900000002` |
| `user.version`, `goal.version` | Operational | Low | `1742950000000` |
| **NEW** `hubspot_subscription` (incl. `raw_properties` jsonb) | Financial (B2B customer billing pulled from CRM) | **High** | `1743300000000` |
| **NEW** `projected_billing` | Financial + derived | Medium | `1743300000001` |
| `forecast_snapshot.subscription_mrr`, `projected_billing_timeline` jsonb | Derived | Medium | `1743300000002` |
| **NEW** `slack_installation` (encrypted bot tokens, `raw_install_payload` jsonb) | Personal identifier | **High** | `1744675200000` |
| **NEW** `alert_rule` + `alert_state` | Derived + behavioral | Low / Med | `1744675200001` |
| `financial_transaction.merchant_fingerprint`, `classification_v2` jsonb, `needs_llm_review` | Derived (LLM output) | Medium | `1745000000000` |
| **NEW** `user_category_override` | **User-generated** + derived | Medium | `1745000000000` |
| **NEW** `classification_review_queue` | Derived (LLM intermediate state) | Medium | `1745000000000` |
| **NEW** `user_financial_override` (cash, revenue, AR/AP, per-category overrides — 27 keys via CHECK) | **User-generated** + financial | **High** | `1776816000000` |
| **NEW** `forecast_category` (seeded reference) | Reference | Low | `1777000000000` |
| **NEW** `user_pattern_override` | **User-generated** + derived | Medium | `1779600000000` |
| **NEW** `transaction_user_flag` (per-instance exclude/relabel) | **User-generated** | Medium | `1779600100000` |
| **NEW** `user_recurring_expense` (vendor_name varchar 255 — freeform) | **User-generated** + financial | Medium | `1779600200000` |
| `hubspot_connection.connected_user_email` | Personal identifier (third-party admin) | Medium | `1779800000000` |
| `user.impersonationTotpSecretEncrypted`, `user.impersonationTotpEnrolledAt` (admin only) | Security | High | `1781000000000` |
| **NEW** `impersonation_audit` | Behavioral + personal identifier | **High** | `1781000000001` |
| `financial_transaction.pending` boolean | Financial | Low | `1781200000000` |

**User-generated content surfaces** (freeform input persisted server-side):
- Scenario chat — `runway_chat_message.content` + `metadata` jsonb (tool calls + modifications). Forwarded to AWS Bedrock per §3.
- Financial overrides — `user_financial_override` (27 keys via CHECK constraint).
- Recurring-expense additions — `user_recurring_expense.vendor_name` (freeform, varchar 255).
- Per-vendor pattern overrides — `user_pattern_override`.
- Per-transaction exclude / relabel — `transaction_user_flag`.
- Per-merchant reclassification — `user_category_override`.
- Profile fields + uploaded profile picture (`uploads/profile-pictures/`).

### What this requires in legal text

- **Privacy:** expand the "Categories of personal information we collect" list to include HubSpot CRM subscription data, Slack OAuth tokens + workspace metadata, AI-derived classification outputs (`classification_v2`, `classification_review_queue.haiku_*`), the new override tables, and the `impersonation_audit` log.
- **Privacy:** explicitly list **user-generated content** as a data category — scenario chat prose, custom recurring-expense vendor names, override reasons. Important because this content is forwarded to AWS Bedrock.
- **ToS:** **content license clause** — user grants Zensus a worldwide, royalty-free, sublicensable license to host, store, process, and forward to subprocessors (named in §1) any content the user enters into Zensus (scenario chat, vendor names, override reasons). Today nothing in the ToS grants this right; counsel review required because LLM-input handling is a recently-litigated area.
- **Privacy:** name the `impersonation_audit` retention separately (see §5).

---

## 7. Retention periods

### What changed in the product

| Data class | Retention before | Retention now | Source |
|---|---|---|---|
| OTP-only temporary users | hourly cleanup (preexisting) | unchanged | `apps/backend/src/auth/auth.service.ts:46` |
| Orphaned guest users >30 days | daily 03:00 UTC (preexisting) | unchanged | `auth.service.ts:67` |
| `impersonation_audit` "active" rows | n/a (new) | swept to `expired` after ~1h 1min via cron; **row itself permanent** | `apps/backend/src/admin-impersonation/services/expiry-sweeper.cron.ts:36`; migration refuses `down()` |
| Stripe grace-period state | n/a | daily midnight + hourly | `apps/backend/src/stripe/stripe-grace.cron.ts:43,175` |
| QuickBooks OAuth state | n/a | per-minute cleanup | `apps/backend/src/quickbooks/quickbooks.service.ts:1048` |
| Plaid transactions | "duration of connection" | unchanged; deleted on disconnect | `docs/compliance/data-protection-policy.md:113`; `user.service.ts:322` |
| HubSpot data | n/a | deleted on disconnect | `user.service.ts:347` |
| Forecast / runway snapshots | n/a | **no purge job;** account lifetime | `1741800000000` |
| Chat messages | "duration of account" | unchanged (no purge cron in `runway-chat/`) | — |
| `classification_review_queue` | n/a | **no purge cron;** rows accumulate | `1745000000000` |
| Account record post-deletion | policy says **+90 days** | **code does immediate hard `repository.remove(user)`** | `user.service.ts:404` vs. `docs/compliance/data-protection-policy.md:112` — **MISMATCH** |

**Backup posture:** zero IaC / config in repo. Sole mention is `docs/compliance/incident-response-plan.md:3`. Backup location, retention, encryption, and restore RBAC are not codified. Presumed AWS RDS automated backups.

### What this requires in legal text

- **Privacy:** retention schedule must match code. Resolve the "+90 days" vs. hard-delete discrepancy first (founder decision #3).
- **Privacy:** add explicit retention for new categories: `forecast_snapshot` (account lifetime), `impersonation_audit` (stated ceiling required), `classification_review_queue` (currently unbounded).
- **Privacy:** survivor data disclosure at deletion — user should be told that Stripe billing records (7-year regulatory retention per policy), `impersonation_audit` rows, application logs, and RDS automated backups persist past account deletion.
- **Privacy:** backup-retention statement (window + encryption-at-rest). Cannot remain undocumented under GDPR Art. 30.

---

## 8. Data subject rights (export, deletion, access)

### What changed in the product

- **Export endpoint:** **does not exist.** No `@Get('export'|'data'|'me/export'|'dsar')` route in `apps/backend/src`. The policy at `docs/compliance/data-protection-policy.md:217,225` ("Users can request an export of their data" / "within 30 days") is **un-backed by code**.
- **Deletion flow** (`apps/backend/src/user/user.controller.ts:260` → `user.service.ts:317`):
  1. Password confirmation if password-based account.
  2. Best-effort revoke at Plaid, QuickBooks, HubSpot.
  3. Profile-image deletion from disk.
  4. `userRepository.remove(user)` — Postgres cascades take all `ON DELETE CASCADE` children.
- **What survives a user delete:**
  - `impersonation_audit` rows (intentionally no FK to `user.id`).
  - Stripe records (7-year regulatory retention per policy).
  - PostHog analytics (24 months, anonymized).
  - Application / CloudWatch logs.
  - RDS automated backups.
  - Haiku classifier Redis cache (hashed inputs).

### What this requires in legal text

- **Privacy:** if no export endpoint is built, rewrite the DSAR section to describe the **actual** workflow: email to `privacy@zensus.app` (or wherever), stated SLA (≤ 30 days), what is included/excluded. This is exposure today.
- **Privacy:** deletion section must enumerate survivors (impersonation audit, Stripe regulatory, backups, logs).
- **Privacy:** CCPA-required "Do Not Sell or Share" link must exist on `zensus.app` if any CA traffic. None present today.
- **Recommended (counsel decision):** add a `/dsar` request form on the marketing site or product app to make the workflow concrete.

---

## 9. Client-side tracking & consent

### What changed in the product

**Marketing site (`zensus.app`):**
- GA4 (`G-T8W39D59R9`) fires inline on every page load — `index.html:23-30`, `src/lib/analytics.tsx:7,33-36`.
- Sets `_ga` + `_ga_*` cookies (2-year persistent identifiers).
- Google Fonts CSS (leaks IP to `fonts.gstatic.com`).
- No banner. No `gtag('consent', 'default', { ... })` defaulting to denied.

**Product app (`app.zensus.app`):**
- PostHog JS fires from `apps/landing/components/PostHogProvider.tsx:14` (`posthog.init()` inside a top-level `useEffect`, unconditional).
- Sets PostHog 1st-party cookie under `app.zensus.app` for session/distinct ID. Events proxied via `/ingest/*` rewrite (`apps/landing/next.config.js:178-190`).
- Supabase Auth cookies (`sb-*`, `sb-session`) — httpOnly, AES-256-GCM, `Domain=.zensus.app`. Essential.
- `trackVpnWarningBypassed` PostHog telemetry on integration connect.
- No banner.

**Verified absent on both sites:** GTM, Meta Pixel, LinkedIn Insight, Hotjar, FullStory, Datadog RUM, Sentry browser SDK, Vercel Analytics, Vercel Speed Insights, Apollo, Plausible.

### What this requires in legal text

- **Privacy:** cookie disclosure with category table (essential / analytics / functional). Today both Privacy pages describe cookies in prose without enumerating `_ga`, `_ga_*`, the PostHog `ph_*_posthog` cookie, or the Supabase `sb-*` family.
- **Privacy:** cookie operator + retention per cookie.
- **Decision (executive summary #4):** deploy a banner OR drop the analytics SDKs. Privacy cannot truthfully claim consent-respecting analytics behavior today.
- **CCPA "Do Not Sell or Share":** add link before publish.

---

## 10. Cross-references — Linear tickets and prior commits

Tickets that drove material code changes in this audit:

- **ZEN-21** Plaid SDK bump
- **ZEN-87** ipapi.co IP intelligence
- **ZEN-94** QuickBooks reactive 401 refresh
- **ZEN-198 / 199** TOTP replay protection + lockout
- **ZEN-200 / 201 / 202 / 203** admin impersonation guards and in-session restrictions
- **ZEN-205 / 207 / 209 / 252** admin-impersonation alerting, audit-log durability, user-notification (still open)
- **ZEN-214 / 215** force-end + sweeper
- **ZEN-247 / 248 / 249** Plaid webhook concurrency + real-time balance + pending split
- **ZEN-258** drop `@anthropic-ai/sdk`; route all Claude via Bedrock
- **ZEN-272** Stripe trial-period work in progress (likely no privacy change but verify before merging legal text)
- **ZEN-243** this audit

Notable commit hashes referenced inline: `b8608f19`, `17285d2e`, `4c147408`, `d297b15b`, `564ae4df`, `50b6d132`, `f5bb44e2`, `e1de1709`, `2ebc11d6`, `a6026cc7`, `51018df7`, `54a75306`, `91584662`, `dca68edc`, `1855121`, `9f4b084`.

---

## 11. Phase 2 — pre-conditions before drafting legal text

The ticket explicitly forbids unilateral legal-text authorship by the engineer. Before Phase 2 starts:

1. **Founder sign-off on this audit.** Confirm the list of changes is complete and the listed risk items reflect the founder's view.
2. **Decisions on the 9 items in the executive summary.** Several (admin-impersonation notification, DSAR endpoint, retention claim ↔ code) imply code work in the **monorepo**, not the marketing repo. Those must either ship before Privacy publishes, or Privacy must accurately describe the current state.
3. **Counsel review of the high-risk drafting areas:**
   - Content license clause (§6).
   - Admin impersonation disclosure (§5).
   - Arbitration / liability caps / data-subject rights (out of scope for this audit; flagged so the engineer does not rewrite without explicit guidance).
4. **Decision on subprocessor-list publication shape:** dedicated `/subprocessors` route on the marketing site vs. inline table in Privacy.

Once the above are settled, Phase 2 produces a single PR that:
- Updates `src/pages/Terms.tsx` and `src/pages/Privacy.tsx`.
- Bumps "Last updated" on both.
- Adds a brief in-page change summary at the top of each (or a separate `/legal/changelog` route).
- Links the new `/subprocessors` page if that route is approved.

---

*End of Phase 1 deliverable. Awaiting founder review per ZEN-243 process.*
