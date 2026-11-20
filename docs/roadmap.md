# Roadmap

The full roadmap with explanations lives in a separate document. This file is the checklist: a box is ticked only when the item is fully done as described in the roadmap. Partly done items stay unticked and say what is missing.

## Phase 0 · Foundation

- [x] Monorepo with pnpm workspaces and Turborepo: `apps/web`, `apps/api`, `apps/eval`, `packages/shared`, `packages/sdk-js`
- [x] Docker Compose with MongoDB and Redis
- [x] ESLint, Prettier, strict TypeScript, Husky, commitlint
- [x] GitHub Actions: install, lint, typecheck, test on every PR
- [x] GitHub Projects board, issue and PR templates, first ADR

## Phase 1 · Authentication and teams

- [ ] NestJS API with GraphQL (code-first), Mongoose, config and validation
  - Partly done: Mongoose and config exist. The API is REST, and input is not validated.
- [ ] Sign up, log in, log out; JWT access token + rotating refresh token in httpOnly cookies
  - Partly done: sign up and log in with a JWT access token. No refresh token, no cookies, no log out.
- [ ] Organizations, invitations by email link, roles with guards (`@Roles('admin')`)
- [ ] Next.js login, sign-up and team pages; GraphQL client with generated types
- [ ] Unit tests for services, integration tests for the auth flow

## Phase 2 · Projects and flags

- [ ] Projects with three environments created automatically
- [ ] Flag create, edit, archive; on/off per environment
  - Partly done: create, edit, delete and on/off through REST. No archive, no environments.
- [ ] Dashboard: project list, flag list with search and filters, flag detail page
- [ ] Audit log written on every change, shown in the UI
- [ ] Accessible forms and tables (WCAG 2.1 AA), keyboard navigation

## Phase 3 · Evaluation path and SDK

- [ ] On every flag change the API builds a snapshot and writes it to Redis, then publishes `flags-changed`
  - Partly done: one snapshot of all flags in `flags:all`. No snapshot per environment, no publish.
- [ ] Express evaluation service: `GET /sdk/flags` with SDK key, reads only from Redis
  - Partly done: `GET /eval/:key` reads from Redis, without an SDK key.
- [ ] Shared rules engine in `packages/shared`, used by API and evaluation service
- [ ] `packages/sdk-js`: `client.isEnabled('new-checkout', user)` with in-memory cache
  - Partly done: `isEnabled(key)` without a user and without a cache.
- [x] Demo shop page that changes when a flag is switched
- [ ] README with architecture diagram, setup in one command, short screen recording

## Phase 4 · Targeting, rollouts, live updates

- [ ] Targeting rules (attribute equals / in list / contains) and reusable segments
- [ ] Percentage rollout with deterministic hashing (same user, same result)
- [ ] Server-Sent Events from the evaluation service: SDK receives changes in under a second
- [ ] Rate limiting per SDK key in Redis
- [ ] Rules editor UI with live preview ("what would user X get?")

## Phase 5 · Quality and polish

- [ ] Playwright end-to-end tests for the main flows, with automatic accessibility checks
- [ ] Coverage reports in CI; Vitest for web and SDK, Jest for NestJS
- [ ] Performance: Lighthouse in CI, bundle analysis, server components where useful
- [ ] Error handling, loading and empty states everywhere
- [ ] Documentation site or `docs/` folder with API and SDK guides

## Phase 6 · Kubernetes locally

- [ ] Production Dockerfiles (multi-stage, small images, non-root user)
- [ ] kind cluster on the laptop; Deployments, Services, Ingress, ConfigMaps, Secrets
- [ ] Readiness and liveness probes; two or more API replicas
- [ ] Package everything as a Helm chart

## Phase 7 · AWS with Terraform

- [ ] Terraform for VPC, EKS cluster, ECR registries, ElastiCache Redis, Secrets Manager
- [ ] MongoDB on Atlas hosted in an AWS region, connected privately
- [ ] Ingress with a load balancer, domain and HTTPS certificate
- [ ] GitHub Actions deploys to EKS after merge to `main`, using OIDC (no stored AWS keys)
- [ ] `terraform destroy` and rebuild tested, so the cluster can be off when not in use

## Phase 8 · Observability and scale

- [ ] OpenTelemetry traces across web, API and evaluation service
- [ ] Prometheus and Grafana dashboards: request rate, latency, error rate
- [ ] Horizontal Pod Autoscaler on the evaluation service
- [ ] Load test with k6 and a published result in the README
