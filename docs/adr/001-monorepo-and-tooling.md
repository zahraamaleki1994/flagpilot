# ADR 001: Monorepo with pnpm workspaces and Turborepo

- Status: Accepted
- Date: 2026-11-02

## Context

FlagPilot has several parts: a Next.js dashboard, a NestJS API, an Express
evaluation service, a shared rules engine, and a JavaScript SDK. The rules
engine is used by both the API and the evaluation service, so it must stay
identical in both.

## Decision

Keep all parts in one repository:

- **pnpm workspaces** link the packages locally, so `apps/api` can import
  `@flagpilot/shared` without publishing it.
- **Turborepo** runs tasks (build, lint, typecheck, test) across all
  packages in the right order, in parallel, and caches the results.
- Shared tooling at the root: one TypeScript base config, one ESLint base
  config, one Prettier config, Husky and commitlint.

## Consequences

Good:

- A change to shared code and to the apps that use it fits in one pull request.
- Every package uses the same tools and rules.
- Turborepo's cache skips unchanged packages, locally and in CI.

Bad:

- The repository grows large over time.
- Generators like `create-next-app` and `nest new` assume a single project and
  need manual cleanup (extra lockfiles, workspace files).
- More tooling to learn and keep in sync.
