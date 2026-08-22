---
title: Bridge Certification (TCK)
description: The compliance suite — a hand-written, language-agnostic test set that certifies a bridge implements the DomainCraft contract. kitchen-sink.yaml, suite.js and the certification.yml CI template.
section: guides
order: 8
updated: "2026-08-22"
---

DomainCraft ships a **compliance suite** (a Technology Compatibility Kit, or TCK) in the core repository at `DomainCraft/compliance-suite/`. It certifies that a bridge — any bridge, in any language — implements the DomainCraft contract correctly.

## Why an independent suite

The suite is **hand-written against the contract**, not generated from the same IR that drives bridge templates. If the tests were generated from the same code as the product, a bug in the generator or bridge would reproduce itself in the test, and everything would pass while the contract is violated.

The core is trusted — it is unit-tested and deterministic. Bridges are not. The suite exists to catch the gap between the two.

## The three files

| File | Purpose |
|------|---------|
| `kitchen-sink.yaml` | A deliberately maximal domain model exercising every core feature: all field types, enums, relations (incl. 1:1 and many-to-many), entity features, permissions with `@Owner`, indexes, seed data, auth (incl. the `/setup` bootstrap), jsonb, versioning, rate limiting |
| `suite.js` | A [k6](https://k6.io) script that runs against the *generated* app over HTTP and asserts the HTTP contract: status codes (200/201/204/400/401/403/404/409/429), role-based access, `@Owner` isolation, hidden/readonly fields, optimistic-lock concurrency, seed data, versioning headers, validation errors |
| `certification.yml` | A ready-to-copy **GitHub Actions workflow for bridge repositories** — downloads the core, generates code from `kitchen-sink.yaml` with the bridge under test, starts the app via Docker Compose, and runs `suite.js` |

The suite is re-run tolerant (unique skus/order numbers per run, `201-or-409` tolerances), so a second run against a non-reset database stays green.

## Certify a bridge

1. Copy `compliance-suite/certification.yml` from the core repo into your bridge's `.github/workflows/certification.yml`.
2. Adjust `bridge_path` in the *Generate Code* step if your templates aren't at the repo root.
3. Make sure your generated `docker-compose.yml` uses the service name `api` and that `API_PORT` (default `9000`) matches `project.deploy.port` in `kitchen-sink.yaml`.

The suite is maintained in the core, so every new check is automatically inherited by all certified bridges — updating the core version the workflow checks out brings new checks.

## Run it locally

```bash
# from DomainCraft/ (after `go build -o bin/domaincraft ./cmd/domaincraft`)
./bin/domaincraft generate \
  --domain compliance-suite/kitchen-sink.yaml \
  --bridge ../domaincraft-bridge-csharp \
  --output /tmp/tck-app \
  --non-interactive
cd /tmp/tck-app && docker compose up -d --build
k6 run -e API_URL=http://localhost:9000 ../DomainCraft/compliance-suite/suite.js
```

## What the suite covers

- **Bootstrap & auth** — `/setup` bootstraps the first user with the `Admin` role (`201`, or `409` on re-run), register/login/me flow, role claims.
- **CRUD contract** — status codes per operation, pagination shape (`PagedResult`), hidden fields excluded from responses, readonly fields ignored on write.
- **Permissions** — role-based 403s, `@Owner` isolation (a user cannot touch another user's rows), public (`*`) endpoints.
- **Entity features** — soft delete, audit timestamps, optimistic-lock `409` on stale writes, `event_sourced` publishing, `cacheable` behavior.
- **Data contract** — seed data round-trip (ids/skus), jsonb deep equality, versioning headers, `email`/`url` validator rejections, `429` rate limiting.

## TypeScript bridges

The HTTP/k6 suite cannot certify TypeScript bridges: their value lives in
**compile-time types** and **wire serialization**, not HTTP behavior. So the
TypeScript family ships its own TCK in `domaincraft-bridge-ts/tck/`, certifying
the shared `ts-core` contract once (same independence rule) — in three halves:

| Half | Tool | Certifies |
|------|------|-----------|
| `type-contract.ts` | static (`tsc --noEmit`) | `Equal<A,B>` positives plus `@ts-expect-error` negatives: hidden/readonly/password exclusions, wire enum values, `T \| null` vs `T \| undefined`, per-type filter operators — including that ordered operators on a plain `json` column fail at compile time while `jsonb` accepts them |
| `runtime.test.ts` | vitest, mocked fetch | exact `path:op:value` serialization (`json` and `jsonb` accessors), query params, model-derived constants (`PAGINATION`, searchable keys), the `can()` matrix, JWT header, the full `ApiError` taxonomy (409 unique vs concurrency, 429 retry/backoff), field-error mapping |
| `interop.test.ts` | vitest against a live certified backend | round-trips: setup → login → CRUD, filter/sort/include restrict semantics, enum wire values, error mapping — proving the wire format is *accepted*, not just self-consistent |

Framework adapters (`react-rest`) are certified by this shared suite once plus a
`tsc --noEmit` glue smoke: typechecking proves an adapter is *self-consistent*,
the TCK proves it honors the *contract*.
