---
title: Bridge Certification (TCK)
description: The compliance suite — a hand-written, language-agnostic test set that certifies a bridge implements the DomainCraft contract. kitchen-sink.yaml, suite.js and the certification.yml CI template.
section: guides
order: 10
updated: "2026-08-22"
---

DomainCraft ships a **three-level TCK pyramid**: one `k6` suite, one `per-language` TCK per thin `core`, and a compile-smoke for every adapter. The core repository at `DomainCraft/compliance-suite/` holds the top level.

```
                 k6 suite.js              ← HTTP oracle: one for all languages (certifies a server chain)
                /
per-language TCK                         ← language contract: certifies the thin core
  (thin core)  /           \
compile-smoke  interop.test              ← certifies layers above core (framework/client)
```

Every bridge — any language, any layer — is certified through this pyramid.

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
  --bridge csharp-rest \
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

## Per-language TCK — where to write it

The `k6` suite cannot certify a `core` — its value is **compile-time types** and **wire serialization**, not HTTP. Each language has one thin `core` (`csharp-core`, `ts-core`) and its own TCK in that bridge's `tck/` (the layers above the core certify themselves in the next bridge's `tck/`):

* **C# (`csharp-core` thin):** `bridges/csharp/core/tck/` — a hand-written xunit project that **compiles the generated sources** (the build itself is a contract check: a template emitting invalid C# fails `dotnet build`) and runs the wire + query contract (`dotnet test`): enum wire values and the JSON converter, entity type surface (`Guid`/`int`/`long`/`double`/`decimal`, `T?` vs required, collections), the `path:op:value` grammar, sort/LINQ translation, `ListQuery` + `PagedResult`. No database needed.
* **TypeScript (`ts-core` thin):** `bridges/typescript/core/tck/` — `type-contract.ts` (static `tsc --noEmit` with `Equal`/`@ts-expect-error`) + `runtime.test.ts` (vitest). It imports only `types`/`query`/`permissions` (what `ts-core` alone generates). The layer above the core is certified in `bridges/typescript/client/tck/` — `type-contract-client.ts` + `runtime.client.test.ts` (vitest, mocked fetch) and `interop.test.ts`, which proves the wire is *accepted* by a live `k6`-certified backend.
* **Dart / Kotlin (future):** copy `ts-core/tck/`, translate assertions, keep test vectors identical.

A `core` is certified **once per language**. Everything above it reuses that proof:

| What you ship | How you certify it |
|---|---|
| New `persistence` (e.g. `csharp-dapper`) | `--replace persistence=my-bridge` + `k6 suite.js` |
| New `transport` / `framework` (e.g. `csharp-grpc`, `vue-rest`) | `compile-smoke` (`tsc --noEmit` / `dart analyze` / `dotnet build`) + `interop` against a `k6`-certified backend |

Framework adapters (`react-rest` → `ts-client` → `ts-core`) add only a smoke: typechecking proves they are *self-consistent*, the `per-language TCK` on the thin `core` proves they honor the *contract*.
