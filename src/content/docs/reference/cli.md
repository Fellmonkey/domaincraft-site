---
title: CLI reference
description: Every domaincraft command and flag — generate, validate, bridges, and their options.
section: reference
order: 2
updated: "2026-08-22"
---

## Commands

| Command | Description |
|---------|-------------|
| `domaincraft generate` | Generate code. Interactive bridge selection if `--bridge` omitted. |
| `domaincraft validate` | Validate `domain.yaml`. |
| `domaincraft bridges` | List known bridges with cache status. |
| `domaincraft update` | Update the domaincraft core to the latest GitHub release (`--check` to only report). |
| `domaincraft --version` | Print the CLI version. |

## Global flags

| Flag | Description |
|------|-------------|
| `--domain` / `-d` | Path to `domain.yaml`. |
| `--bridge` / `-b` | Bridge ID, local path, or `owner/repo`. |
| `--output` / `-o` | Output directory. |
| `--non-interactive` | Force flag-only mode. |
| `--addons` | Comma-separated addons that toggle templates, e.g. `--addons "dapr"`. |
| `--update-bridges` | Check cached bridges for newer versions and download them before generating (CI-safe). |

## `generate` flags

| Flag | Description |
|------|-------------|
| `--admin` | Generate an admin panel; optional bridge ID, default `admin-alpine`. |
| `--replace` | Replace one layer without forking: `layer=bridgeRef` or `bridgeId=bridgeRef` (repeatable). E.g. `--replace persistence=csharp-dapper` builds `core+dapper+rest` instead of `core+efcore+rest`. If the replacement itself extends a base, that base is included automatically. |
| `--prune` | Remove/rename orphaned files, rewrite identifiers in custom files, and run the bridge's migrations (best-effort) when the schema changed — without prompting (CI-friendly). |
| `--migrate` | Run the bridge's `migrations:` commands (`dotnet ef ...`) against a real database after generation. |

`--replace` keeps thousands of bridges as thousands of repos, not `N×M` combinatorial repos. Each new `persistence` or `transport` is one repo, a combination is a flag.

## `bridges` flags

| Flag | Description |
|------|-------------|
| `--check-updates` | Contact each cached bridge's remote and report whether a newer version is available. |

## Bridge resolution order

1. Local path → use directly.
2. Registry ID (e.g. `csharp-rest`) → check `~/.domaincraft/bridges/`, clone if needed.
3. `owner/repo` GitHub shorthand → clone.
4. Empty + interactive terminal → show selection menu.

`--replace` resolves the same way as `--bridge` — including the sibling-checkout fallback, so monorepo development works before the replacement is published.
