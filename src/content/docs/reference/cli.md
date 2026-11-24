---
title: CLI reference
description: Every domaincraft command and flag — init, generate, validate, bridges, and their options.
section: reference
order: 2
updated: "2026-11-24"
---

## Commands

| Command | Description |
|---------|-------------|
| `domaincraft init` | Write a starter `domain.yaml` from a scenario and generate code. |
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

## `init`

Zero-entry path: choose a scenario, get a valid model, generate immediately.

```bash
# interactive scenario menu, then an offer to generate
domaincraft init

# non-interactive: model + generation in one run
domaincraft init --scenario shop --name "Acme Shop" --bridge csharp-rest
```

| Flag | Description |
|------|-------------|
| `--scenario` | Starter model: `shop`, `saas`, `crm` or `blog`. Required in non-interactive mode; otherwise a menu is shown. |
| `--name` | `project.name`. Defaults to the current directory name; single quotes are escaped for YAML. |
| `--force` | Overwrite an existing `domain.yaml`. Without it, `init` refuses to touch an existing file. |
| `--bridge` | Generate right after writing the model. Without it in non-interactive mode, `init` prints the `validate`/`generate` commands to run next. |

Every starter model passes `domaincraft validate` out of the box. It is a starting point, not the final product: edit the model, then validate and regenerate.

## `generate` flags

| Flag | Description |
|------|-------------|
| `--admin` | Generate an admin panel; optional bridge ID, default `admin-alpine`. |
| `--replace` | Replace one layer without forking: `layer=bridgeRef` or `bridgeId=bridgeRef` (repeatable). E.g. `--replace persistence=../my-dapper` builds `core+dapper+rest` instead of `core+efcore+rest`. If the replacement itself extends a base, that base is included automatically. |
| `--prune` | Remove/rename orphaned files, rewrite identifiers in custom files, and run the bridge's migrations (best-effort) when the schema changed — without prompting (CI-friendly). |
| `--migrate` | Run the bridge's `migrations:` commands (`dotnet ef ...`) against a real database after generation. |

`--replace` keeps every combination shippable: each `persistence` or `transport` layer is a bridge in the same repository, and a combination is a flag — not a new repo.

## `bridges` flags

| Flag | Description |
|------|-------------|
| `--check-updates` | Contact each cached bridge's remote and report whether a newer version is available. |

## Bridge resolution order

1. Local path (`./x`, `../x`, absolute) → use directly. A missing path is a hard error, never a clone.
2. Monorepo `bridges/<path>` for a registered ID → use the local tree.
3. Embedded copy in the binary → materialize into `~/.domaincraft/bridges/`. No network needed.
4. Registry ID (e.g. `csharp-rest`) → use the cache, clone if needed.
5. `owner/repo` GitHub shorthand → clone.
6. Empty + interactive terminal → show the selection menu.

Official bridges ship in the binary and in the monorepo; community bridges are cloned on demand. `--replace` resolves `right` the same way as `--bridge`.
