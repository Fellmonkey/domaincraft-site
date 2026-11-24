---
title: Bridges registry
description: Known bridges, axes and layers, and how composition and replacement work.
section: reference
order: 3
updated: "2026-08-23"
---

A bridge is a set of templates that turns your `domain.yaml` into code for one language or framework. The registry is hard-coded. Official bridges are served from the monorepo `bridges/` tree or the copy embedded in the binary; community bridges are cloned on demand into `~/.domaincraft/bridges/`.

## Registered bridges

| ID | Layer | Language | Description | Composition |
|----|-------|----------|-------------|-------------|
| `csharp-core` | `core` | C# | Thin language core — enum wire, entity types, query schema | base |
| `csharp-domain` | `domain` | C# | Domain + Application (services, Generation Gap, ports) | `extends: csharp-core` |
| `csharp-efcore` | `persistence` | C# | EF Core + PostgreSQL + Hangfire | `extends: csharp-domain` |
| `csharp-rest` | `transport` | C# | ASP.NET Core REST + JWT + k8s/tests | `extends: csharp-efcore` |
| `csharp-restful` | — | C# | *Archived* monolith (71 templates) — use `csharp-rest` (`core→domain→efcore→rest`) | — |
| `ts-core` | `core` | TypeScript | Thin language core — enum wire, types, query schema, permissions | base |
| `ts-client` | `client` | TypeScript | Zod validation, JWT client, CRUD API | `extends: ts-core` |
| `react-rest` | `framework` | TypeScript | React — TanStack Query + `useCan` | `extends: ts-client` |
| `appwrite` | — | JSON | Appwrite TablesDB + teams + settings (`appwrite.config.json`) | single layer |
| `admin-alpine` | — | HTML | Alpine.js admin panel (`--admin`) | single layer |

`csharp-rest` renders the chain `core→domain→efcore→rest`. The decomposition was checked against the archived `csharp-restful` on `examples/domain.yaml` (142 files) and `compliance-suite/kitchen-sink.yaml` (187 files); that check is manual, not a committed golden test. `TestBundledBridgesLoad` in `internal/renderer` only certifies that every bundled bridge loads and passes the contract gate.

## Axes and layers

A layered bridge is one layer in one axis — see **[Axes and layers](../../concepts/three-axes)** for the full model.

## Generate with a bridge

```bash
domaincraft generate --domain domain.yaml --bridge csharp-rest
domaincraft generate --domain domain.yaml --bridge csharp-rest --replace persistence=../my-dapper
domaincraft generate --domain domain.yaml --bridge csharp-rest
domaincraft generate --domain domain.yaml --bridge ts-core
domaincraft generate --domain domain.yaml --bridge ts-client
domaincraft generate --domain domain.yaml --bridge react-rest

# with admin panel
domaincraft generate --domain domain.yaml --bridge csharp-rest --admin
```

## Composition details

Base templates/helpers/`type_mappings.yaml` render first, adapter wins on conflict. `registry_packages` are merged base-first with the adapter winning on key conflicts; the first enabled `migrations:` top-down wins. `output_dir`/`name`/`delimiters` come from the top adapter. `when:` (`hasAuth`, `hasSeed`, `hasAddon:dapr`, …) is evaluated per template regardless of owner. Resolution reuses the same path/ID/`owner/repo` logic as `--bridge`, with a monorepo `bridges/<path>` lookup for registered IDs (`resolveBaseChain`).

## Adding a bridge

For an official bridge, put the files in `bridges/<family>/<layer>/`, append to `DefaultRegistry` in `internal/bridge/registry.go` (with `Path` and `Layer` set), and add `layer` + optional `extends` in `bridge.yaml`:

```go
{
  ID:       "csharp-dapper",
  Name:     "C# Dapper",
  Language: "C#",
  Path:     "csharp/persistence/dapper",
  Layer:    "persistence",
},
```

```yaml
name: csharp-dapper
layer: persistence
extends: csharp-domain   # thin core → domain → this persistence
```

Community bridges need only the `bridge.yaml` in their own repository; users pass the `owner/repo` ref.
