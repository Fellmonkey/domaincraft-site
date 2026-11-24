---
title: Roadmap
description: Where DomainCraft is going — axes and layers expansion, spec-planned language features, distribution and certification.
section: concepts
order: 5
updated: "2026-08-23"
---

A consolidated status map: every item is tagged **shipped**, **in progress**, or **spec'd** (described in the domain.yaml spec but not implemented yet).

## Status today

- Axes and layers: `csharp-core → domain → efcore → rest`, `ts-core → ts-client → react-rest`, with `--replace` composing layers without forking (see [Axes and layers](../three-axes/)).
- The thin cores (`csharp-core`, `ts-core`) are certified by per-language TCKs; the backend HTTP contract by the k6 suite (see [Certification](../../guides/certification/)).
- The `admin-alpine` panel is the only generated UI ([Admin panel](../../guides/admin-panel/)); presentation stays with agent skills and a typed client.

## Backend axis

A new persistence or transport layer is **one repository**, not a fork of 71 templates:

- **Persistence:** `csharp-dapper`, `csharp-marten`, `csharp-mongo` — `domaincraft generate --bridge csharp-rest --replace persistence=csharp-dapper`.
- **Transport:** `csharp-grpc` (the spec validates `api_style: grpc`; ready bridges generate REST only), `csharp-minimal-api`, `csharp-graphql`.
- **Languages:** `go`, `java`, `python` — each starts with a thin core (per-language TCK) plus whatever roles the community builds.

## Web axis

The TS family is fully layered. An Nth framework adapter is 2–3 glue templates plus a `tsc --noEmit` smoke:

- `vue-rest` (composables), `svelte-rest` (stores), `solid-rest` (resources), `angular-rest` (services).
- Adapters inherit the certified `ts-core`/`ts-client` contract unchanged.

## Mobile axis

- `dart-core` — framework-agnostic Dart client, a thin core mirroring `ts-core` (models, enums with wire values, the same `path:op:value` query, `can()` matrix).
- `flutter-rest` — thin adapter (Riverpod providers, auth).
- `flutter-offline` — offline as its own bridge over `flutter-rest`: Drift tables, a sync engine and reactive streams.

## Language (spec'd, not implemented)

Fully described in the language spec and validated by the core, but no bridge implements them yet:

- **`auth.type: cookie`** — HTTP-only cookie auth instead of bearer tokens.
- **`auth.type: oauth2`** — OAuth2 providers (Google, GitHub, …).
- **`@Tenant` token** — ABAC data isolation per tenant. The core validates any `@…` token, but ready bridges do not interpret `@Tenant` yet.
- **Custom permission conditions** — `condition(...)`, described in the spec; unknown permission keys remain a parse error.
- **`multi_tenancy`** — `mode: column` is validated by the core; bridges decide whether to implement tenant isolation.

## Distribution & DX

Shipped:

- **`domaincraft init`** — scenario picker (shop / saas / crm / blog) that writes a starter `domain.yaml` and runs `generate`. See the [CLI reference](../../reference/cli/).
- **Agent plugins** — Claude Code marketplace and `npx skills add` package, plus `/llms.txt` and `/docs/context7.json` on the site.

Planned:

- **Reference application** — a complete, deployment-ready SaaS starter built on DomainCraft.
- **Showcase & newsletter** — promotion through social proof and community.

## Certification

- **Dart TCK** — thin `dart-core` gets a type-contract + runtime TCK from day one (the TS pattern).
- How to certify a layer or a `--replace` composition — see the [Certification guide](../../guides/certification/).

## How to steer it

The fastest path for a new target is a new layer on an existing axis: 2–3 templates, `extends: <base>`, and the TCK either proves the contract or fails the bridge — see [Writing a bridge](/docs/guides/writing-a-bridge/).