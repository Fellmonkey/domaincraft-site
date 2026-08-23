---
title: Axes and layers
description: One domain, many targets — how axes, layers and one-flag replacement keep DomainCraft from exploding into thousands of repositories.
section: concepts
order: 4
updated: "2026-08-23"
---

DomainCraft compiles **one** `domain.yaml` into every layer of your product. Without a rule for composition that would mean `N×M` repositories for `N` databases × `M` transports. The rule is **axes and layers**.

## Axes — independent dimensions

```
axis A  backend   (language/runtime) — C# (core → domain → persistence → transport), Appwrite (single layer), future go/java/python
axis B  framework (web)               — ts-core (core) → ts-client (client) → react-rest / vue-rest (framework)
axis M  mobile                       — dart-core (core) → flutter-rest (framework) → flutter-offline (offline)
```

Presentation (UI) is **not an axis**. Components are commoditized (shadcn and friends), and an AI agent builds screens faster and better from a typed client than from templates. Screens are built by agents or humans against the certified client in `domaincraft-skills/` — with any component library. The only generated UI is the vanilla `admin-alpine` panel (`--admin`).

## Layers — a stack inside one axis

A layered bridge is **one layer in one axis** (leaf bridges like `appwrite` and `admin-alpine` are single-layer with no `layer` field). You declare its position in `bridge.yaml`:

```yaml
# backend — C# (thin core → domain)
# csharp-core
layer: core              # thin language core
# csharp-domain
layer: domain
extends: csharp-core
# csharp-efcore
layer: persistence
extends: csharp-domain
# csharp-rest
layer: transport
extends: csharp-efcore

# web — TypeScript (thin core → client)
# ts-core
layer: core              # thin language core
# ts-client
layer: client
extends: ts-core
# react-rest
layer: framework
extends: ts-client
```

`layer` is an open string (`^[a-z][a-z0-9_]*$`). The core checks only the pattern — the dictionary is a convention per family (`core|domain|persistence|transport` for C#, `core|client|framework|offline` for web/mobile), so a new family never requires a core change.

`extends` is a linear chain. The core renders `base → adapter` into one output directory — `templates`, `helpers` and `type_mappings.yaml` are merged base-first, the adapter wins on conflict.

> **Why the thin `core` matters most.** The `core` (thin, language core) holds the only code every stack in that language needs — enum wire values (`snake_case`), entity shapes, `QuerySchema`, permission matrix, `TableName`/`ColumnName`. It is **certified once per language** by the `per-language TCK` (`type-contract` + `runtime`, see [Certification](../../guides/certification/)). Every `persistence`/`transport`/`framework` on top reuses it. Fix a wire bug once in `core`, and every `N×M` combination inherits the fix — without re-certifying each adapter. That is why `core` is thin and `domain`/`client` are the first role layers.

## Replacement — one flag, no fork

```bash
# default chain: core → domain → efcore → rest
domaincraft generate --bridge csharp-rest

# replace one layer — by layer name or by bridge ID:
domaincraft generate --bridge csharp-rest --replace persistence=csharp-dapper
domaincraft generate --bridge csharp-rest --replace csharp-efcore=../my-dapper

# combine layers:
# core + domain + dapper + rest
domaincraft generate --bridge csharp-rest --replace persistence=csharp-dapper
# core + domain + efcore + grpc
domaincraft generate --bridge csharp-rest --replace transport=csharp-grpc
# core + domain + dapper + grpc
domaincraft generate --bridge csharp-rest --replace persistence=csharp-dapper --replace transport=csharp-grpc
```

`--replace` rewrites one edge of the chain. If the replacement itself has an `extends` (e.g. `dapper extends csharp-core`), that tail is spliced in automatically. A duplicate `layer` or a cycle is an error; a `layer` mismatch is a warning. The order of flags is the order of application, and the render stays deterministic.

## Why this scales to thousands

The backend is where `N×M` actually hurts:

```
N persistence × M transport = N+M repositories, not N×M

1 core (thin) + 1 domain + 10 persistence (EF Core, Dapper, Marten, Mongo, …)
              + 10 transport  (REST, gRPC, Minimal API, GraphQL, …)
              = 22 repos for 100 combinations

1 core + 1 domain + 30 × 30 = 900 combinations → 62 repos, not 900
```

* **One layer = one repo.** `csharp-dapper` or `csharp-grpc` ships alone — not as a fork of 71 templates. You add a stack in days, not weeks.
* **A combination is a flag.** Users compose layers at generate time instead of waiting for you to publish every combinatorial repo.
* **One contract, many targets.** Types, validation, `path:op:value` queries, enum wire values, errors and permissions are compiled from the same IR into every target — so layers cannot drift.

The frontend uses the same primitive (`core → framework`) with only a handful of adapters — the backend makes the scaling concrete.

## What each bridge owns

**Backend — C# (core → domain → persistence → transport)**

| Bridge | Layer | Generates | Composition |
|---|---|---|---|
| `csharp-core` | `core` | `Entities`, `Enums`, `PagedResult`, `Query` (thin language core) | base |
| `csharp-domain` | `domain` | `Services` (Generation Gap), `IRepository` ports, `Security`, `Domain/Application.csproj` | `extends: csharp-core` |
| `csharp-efcore` | `persistence` | `Infrastructure/Persistence/**`, `Repositories` impl, `Infrastructure.csproj`, `migrations:` | `extends: csharp-domain` |
| `csharp-rest` | `transport` | `WebApi/**`, `Program.cs`, `appsettings.*`, `Dockerfile`, `k8s/**`, tests | `extends: csharp-efcore` |

**Frontend — web (core → client → framework)**

| Bridge | Layer | Generates | Composition |
|---|---|---|---|
| `ts-core` | `core` | `types` / `query` / `permissions` (thin language core) | base |
| `ts-client` | `client` | `schemas` / `client` / `api` (Zod, fetch, CRUD) | `extends: ts-core` |
| `react-rest` | `framework` | `hooks` / `auth` / scaffold | `extends: ts-client` |

The monolith `csharp-restful` (71 templates) is archived and kept for compatibility. New projects should use `csharp-rest` — on `examples/domain.yaml` and `kitchen-sink.yaml` the output is byte-identical (142 and 187 files, verified).

## Business logic stays in the backend

The frontend holds the *form* of the contract; the backend owns the *semantics*. Real domain logic lives behind the Generation Gap (`*.g.cs` + `overwrite: false` partials). One `domain.yaml` feeds both sides; ownership stays where the data lives.

## Roadmap along the axes

Planned work along the axes — `vue-rest`, the Dart mobile axis, presentation recipes — is tracked on the **[Roadmap](../../concepts/roadmap/)** page.
