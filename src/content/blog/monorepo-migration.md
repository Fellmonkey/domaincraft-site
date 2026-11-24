---
title: "Nine Bridges Move Into the Core Repository"
description: "Nine official bridges now ship with the core. Resolution runs through one registry mapping, contract_version is explicit, and a lock file pins what rendered your code. Generated output stayed byte-identical."
date: 2026-11-25
lang: en
tags: [bridges, architecture]
---

*The previous post ended on "one layer = one repository." That rule has changed: official layers now live as directories in one tree. The rest of the design stayed put.*

In August we described how the 71-template C# monolith became four independent repositories, and how N persistence layers × M transports add up to N+M repositories ([From Monolith to Axes and Layers](https://fellmonkey.github.io/domaincraft-site/blog/bridges-axes-layers/)). The math still holds. The packaging changed: nine official bridges now sit in the core repository under `bridges/`, and a binary built from that repository carries them inside.

## What moved

```
DomainCraft/
  cmd/  internal/  spec/          # the core
  bridges/
    csharp/
      core/
      domain/
      persistence/efcore/
      persistence/dapper-stub/    # experimental, not in the registry
      transport/rest/
    typescript/
      core/
      client/
      react/
    admin/
    appwrite/
```

Nine bridges are in the registry: four C# layers, three TypeScript layers, admin, Appwrite. The Dapper stub sits next to them as an experiment, outside the registry. The old `csharp-restful` ID remains in the registry for compatibility, but its directory is not part of the tree.

| | Before | After |
|---|---|---|
| Official bridges | 9 separate bridge repositories | 9 directories under `bridges/` |
| Resolving `extends:` | guessed from repo name and sibling folders | registry `Path` lookup |
| Top-level `--bridge` | cache / clone first | local tree → embedded → remote → cache |
| Contract version | absent | `contract_version` in `bridge.yaml` |
| Bridge combination used | not recorded | `domaincraft.lock.json` |

## The problem was resolution, not folders

Resolving `extends:` used to mean taking the base bridge's GitHub repo name and looking for a sibling or inner directory. That works while a name like `domaincraft-bridge-csharp-core` matches the directory layout. In `bridges/csharp/core/` it does not. A path heuristic cannot survive the move: the directory name and the registry ID stop being the same string.

There was a second issue. The top-level `--bridge` flag used a different loader order than `extends:`. Generate inside the monorepo with `--bridge csharp-rest`, and the CLI would still take a cached or remote copy instead of the local tree. The move would have changed folders without changing behavior. Both entry points now share one order: local `bridges/<path>` → embedded copy → remote → cache.

Local paths go through one normalization, `bridge.LocalBridgePaths`, used by both the resolver and the renderer. A path pointing at a missing directory or a directory without `bridge.yaml` is an error, not a reason to fall back to a remote copy.

## One rule: ID → path

`RegistryEntry` gained three fields — `Path`, `Layer`, `Deprecated`. `OfficialPath(id)` is the single source of truth; no resolver derives a path from a directory name. The declaration is data:

```go
{
    ID:    "csharp-efcore",
    Path:  "csharp/persistence/efcore",
    Layer: "persistence",
}
```

The `bridge.yaml` files kept `extends:` as IDs, so not one of them changed during the move. `Layer` had to match the `layer:` value each bridge declares; otherwise `--replace persistence=…` hit a different bridge than the one it documented. `Deprecated` keeps the old ID reachable without offering it in the interactive menu.

## The binary carries the bridges

`go:embed bridges` compiles the official tree into the binary at build time. A release needs no regeneration step: a build from the tag embeds that commit's templates. The loader reads the local tree first, then the embedded copy, then remote and cache. An install through `go install ...@latest` generates code offline on the first run.

The embedded copy is materialized into the bridge cache before any clone. `internal/bridge/embed.go` checks every path component for symlinks so a planted link cannot redirect writes outside the cache.

## The contract got a version

`bridge.yaml` now carries `contract_version`. The core declares the version it implements. A bridge asking for a newer one fails with an error naming both numbers. A bridge that omits the field is treated as v1 with a deprecation warning, so bridges written before the field keep working. The `version:` line is parsed now too; it used to be silently ignored.

The golden test in `internal/contract` renders a fixed `domain.yaml` and compares output byte for byte. It covers four leaf bridges: `csharp-core`, `ts-core`, `admin-alpine`, `appwrite`. The limit is stated in the test source: composed chains such as `csharp-rest → … → csharp-core` are not covered yet. The resolver they need lives in `cmd/domaincraft` and is not importable from the contract package.

The renderer also fails closed on an unknown `when:` condition instead of rendering the template anyway. A bridge cannot silently gain a new template by misspelling a condition.

## The lock file says who rendered it

`domaincraft.lock.json` is written next to `domain.yaml`. It lists the bridges actually used: `id`, monorepo `path` or GitHub `source`, `version`, `contract_version`. Entries are sorted by ID and carry no timestamps, so the file diffs cleanly.

The snapshot records what the model looked like. The lock records which bridges rendered it. When someone reports that regeneration produced different files, those two files separate a model change from a bridge change.

## What stayed the same

`domain.yaml` is unchanged. The generation command is unchanged. There is no new flag for the monorepo. Generated files are byte-identical before and after the move: the snapshot format, the template function set and the render output were not touched. Nine repositories became directories. The contract did not move.

## What it buys

A new layer is a directory plus a registry entry, not a repository to wire up. Combining layers still happens through `--replace`: the flag selects a node, and the registry resolves it.

The limits are the ones we had before the move. Nine bridges ship today. gRPC and Vue are plans. Go, Java and Python have no bridges. Putting everything in one tree does not write those bridges; it means that when they arrive, they land next to the others.

The command is the same as before:

```bash
domaincraft generate --domain domain.yaml --bridge csharp-rest
```
