---
title: Axes and layers
description: One domain, many targets — how axes, layers and one-flag replacement keep DomainCraft from exploding into thousands of repositories.
section: concepts
order: 4
updated: "2026-08-22"
---

DomainCraft compiles **one** `domain.yaml` into every layer of your product. Without a rule for composition that would mean `N×M` repositories for `N` databases × `M` transports. The rule is **axes and layers**.

## Axes — independent dimensions

```
axis A  backend   (language/runtime) — C# (domain → persistence → transport), Appwrite (single layer), future go/java/python
axis B  framework (web data layer)   — ts-core → react-rest / vue-rest / svelte-rest (core → framework)
axis M  mobile                       — dart-core → flutter-rest → flutter-offline (core → framework → offline)
```

Presentation (UI) is **not an axis**. Components are commoditized (shadcn and friends), and an AI agent builds screens faster and better from a typed client than from templates. Screens are built by agents or humans against the certified client in `domaincraft-skills/` — with any component library. The only generated UI is the vanilla `admin-alpine` panel (`--admin`).

## Layers — a stack inside one axis

A layered bridge is **one layer in one axis** (leaf bridges like `appwrite` and `admin-alpine` are single-layer with no `layer` field). You declare its position in `bridge.yaml`:

```yaml
# backend — C#
# csharp-core
layer: domain
# csharp-efcore
layer: persistence
extends: csharp-core
# csharp-rest
layer: transport
extends: csharp-efcore

# web — TypeScript
# ts-core
layer: core
# react-rest
layer: framework
extends: ts-core
```

`layer` is an open string (`^[a-z][a-z0-9_]*$`). The core checks only the pattern — the dictionary is a convention per family (`domain|persistence|transport` for C#, `core|framework|offline` for web/mobile), so a new family never requires a core change.

`extends` is a linear chain. The core renders `base → adapter` into one output directory — `templates`, `helpers` and `type_mappings.yaml` are merged base-first, the adapter wins on conflict.

## Replacement — one flag, no fork

```bash
# default chain: core → efcore → rest
domaincraft generate --bridge csharp-rest

# replace one layer — by layer name or by bridge ID:
domaincraft generate --bridge csharp-rest --replace persistence=csharp-dapper
domaincraft generate --bridge csharp-rest --replace csharp-efcore=../my-dapper

# combine layers:
# core + dapper + rest
domaincraft generate --bridge csharp-rest --replace persistence=csharp-dapper
# core + efcore + grpc
domaincraft generate --bridge csharp-rest --replace transport=csharp-grpc
# core + dapper + grpc
domaincraft generate --bridge csharp-rest --replace persistence=csharp-dapper --replace transport=csharp-grpc
```

`--replace` rewrites one edge of the chain. If the replacement itself has an `extends` (e.g. `dapper extends csharp-core`), that tail is spliced in automatically. A duplicate `layer` or a cycle is an error; a `layer` mismatch is a warning. The order of flags is the order of application, and the render stays deterministic.

## Why this scales to thousands

The backend is where `N×M` actually hurts:

```
N persistence × M transport = N+M repositories, not N×M

1 core + 10 persistence (EF Core, Dapper, Marten, Mongo, …)
       + 10 transport  (REST, gRPC, Minimal API, GraphQL, …)
       = 21 repos for 100 combinations

1 core + 30 × 30 = 900 combinations → 61 repos, not 900
```

* **One layer = one repo.** `csharp-dapper` or `csharp-grpc` ships alone — not as a fork of 71 templates. You add a stack in days, not weeks.
* **A combination is a flag.** Users compose layers at generate time instead of waiting for you to publish every combinatorial repo.
* **One contract, many targets.** Types, validation, `path:op:value` queries, enum wire values, errors and permissions are compiled from the same IR into every target — so layers cannot drift.

The frontend uses the same primitive (`core → framework`) with only a handful of adapters — the backend makes the scaling concrete.

## What each bridge owns

**Backend — C# (domain → persistence → transport)**

| Bridge | Layer | Generates | Composition |
|---|---|---|---|
| `csharp-core` | `domain` | `Domain/**`, `Application/**` (entities, ports, Generation Gap), `Domain/Application.csproj` | base |
| `csharp-efcore` | `persistence` | `Infrastructure/Persistence/**`, `Repositories` impl, `Infrastructure.csproj`, `migrations:` | `extends: csharp-core` |
| `csharp-rest` | `transport` | `WebApi/**`, `Program.cs`, `appsettings.*`, `Dockerfile`, `k8s/**`, tests | `extends: csharp-efcore` |

**Frontend — web (core → framework)**

| Bridge | Layer | Generates | Composition |
|---|---|---|---|
| `ts-core` | `core` | `types` / `schemas` / `query` / `client` / `permissions` | base |
| `react-rest` | `framework` | `hooks` / `auth` / scaffold | `extends: ts-core` |

The monolith `csharp-restful` (71 files) is archived and kept for compatibility. New projects should use `csharp-rest` — on `examples/domain.yaml` and `kitchen-sink.yaml` the output is byte-identical (142 and 187 files, verified).

## Business logic stays in the backend

The frontend holds the *form* of the contract; the backend owns the *semantics*. Real domain logic lives behind the Generation Gap (`*.g.cs` + `overwrite: false` partials). One `domain.yaml` feeds both sides; ownership stays where the data lives.

## Roadmap along the axes

* **Web:** `vue-rest` — proves an Nth adapter is 2–3 templates, not a new bridge.
* **Mobile:** `dart-core → flutter-rest → flutter-offline` (Drift, sync queue, reactive streams).
* **Presentation:** agent skills + reference app — Form from Zod, Table from `query`, permission-aware buttons as recipes, not templates.
