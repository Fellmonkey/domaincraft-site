---
title: CLI reference
description: Every domaincraft command and flag — generate, validate, bridges, and their options.
section: reference
order: 2
updated: "2026-08-04"
---

## Commands

| Command | Description |
|---------|-------------|
| `domaincraft generate` | Generate code. Interactive bridge selection if `--bridge` omitted. |
| `domaincraft validate` | Validate `domain.yaml`. |
| `domaincraft bridges` | List known bridges with cache status. |
| `domaincraft --version` | Print the CLI version. |

## Global flags

| Flag | Description |
|------|-------------|
| `--domain` / `-d` | Path to `domain.yaml`. |
| `--bridge` / `-b` | Bridge ID, local path, or `owner/repo`. |
| `--output` / `-o` | Output directory. |
| `--non-interactive` | Force flag-only mode. |
| `--addons` | Comma-separated infrastructure accelerators that toggle addon templates, e.g. `--addons "dapr"`. |
| `--admin` | Generate an admin panel; optional bridge ID, default `admin-alpine`. |

## `generate` flags

| Flag | Description |
|------|-------------|
| `--prune` | Automatically delete/rename orphaned files detected by the migration engine, without prompting (CI-friendly). |
| `--migrate` | After generation, run the bridge's declared database-migration commands (`migrations:` in `bridge.yaml`) against a real database. |

## Bridge resolution order

1. Local path → use directly.
2. Registry ID (e.g. `csharp-restful`) → check `~/.domaincraft/bridges/`, clone if needed.
3. `owner/repo` GitHub shorthand → clone.
4. Empty + interactive terminal → show selection menu.