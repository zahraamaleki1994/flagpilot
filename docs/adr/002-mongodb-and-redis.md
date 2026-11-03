# ADR 002: MongoDB as source of truth, Redis for fast reads

- Status: Accepted
- Date: 2026-11-03

## Context

FlagPilot has two very different kinds of traffic:

- **Dashboard (write path):** a few team members create projects, define
  rules, manage members and change flags. Traffic is low, but every change
  must be stored safely. Viewers also use this path; they only read.
- **Customer apps (read path):** apps with the SDK ask for flag values on
  every page load. Traffic is very high, it is read-only, and it must be fast.

Flag rules are nested and flexible (targeting rules, rollouts, variations
per environment).

## Decision

- **MongoDB** is the source of truth for all data: users, organizations,
  projects, flags and the audit log. Its document model fits nested flag rules.
- **Redis** holds fast, in-memory data:
  - a compiled snapshot of each environment's flags, copied from MongoDB
    on every flag change
  - pub/sub messages that tell the evaluation service a flag changed
  - rate-limit counters per SDK key
  - revoked token IDs until they expire
- The evaluation service reads only from Redis and never touches MongoDB.

## Consequences

Good:

- The read path is fast, because Redis keeps everything in memory.
- High read traffic does not put load on MongoDB.
- Customer apps keep working even if MongoDB or the dashboard has a problem.
- If Redis loses its data, the snapshots can be rebuilt from MongoDB.

Bad:

- Two databases to run, monitor and pay for.
- The Redis snapshot can be out of date for a short moment after a change.
- Every flag change must update both MongoDB and Redis, so the write path
  is more complex.
