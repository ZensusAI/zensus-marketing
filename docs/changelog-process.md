# Changelog editorial process

The public changelog lives in this repo at `src/pages/Changelog.tsx` (`entries[]`). Product changes ship from the **Zensus monorepo**: [github.com/ZensusAI/zensus](https://github.com/ZensusAI/zensus) (`main`).

## Cadence

**Default:** weekly batch every **Friday**, covering all **customer-visible** PRs merged to `main` that week.

**Alternative:** one batch per **major release** or deploy train, if editorial capacity is lower. Document which mode the team is using in the PR that touches the changelog.

## Source

1. List merged PRs to `main` since the **date of the newest entry** already on [zensus.app/changelog](https://zensus.app/changelog) (or use `git log` / GitHub compare).
2. Optional: automate a **candidate list** (e.g. GitHub Action comment or weekly export). **Selection and copy remain manual.**

## What gets an entry

| Include | Exclude |
|--------|---------|
| New features, meaningful UI changes | Pure refactors, internal-only refactors |
| Bugs users would have noticed | Test-only, docs-only, dependency-only |
| Security or reliability users should know about | CI/infra/Nx-only, back-merge commits |
| Behavior that changes runway, Activity, or financials meaningfully | Commit-message noise without a customer story |

## Format

Each item in `entries[]`:

```ts
{
  date: "YYYY-MM-DD",        // Prefer PR merge date to main
  category: "New" | "Improved" | "Fixed" | "Security",
  title: "…",                // ≤ 60 characters, customer-facing
  body: "…",                 // 2–3 sentences, founder voice — not conventional commits
}
```

New entries are **prepended** (newest first). JSON-LD `@graph` is generated from `entries[]`; no schema code changes needed for normal updates.

## Approval

**Founder** (or delegated product/marketing lead) approves changelog copy before merge to `main`, especially for the first batch after a long gap.

## Related

- Backfill selection notes for 2026-04-18 → 2026-05-10: [changelog-backfill-plan.md](./changelog-backfill-plan.md)
