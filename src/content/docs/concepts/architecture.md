---
title: Architecture
description: The compiler pipeline and how axes, layers and replacement render deterministically from one IR.
section: concepts
order: 2
updated: "2026-08-23"
---

```
domain.yaml → Parser (Lexer per field) → Validator → IR Builder → Renderer → Generated Code
                                              ↑
                                Snapshot/migration (.domaincraft/snapshot.json)
```

| Stage | Package | What it does |
|-------|---------|--------------|
| **Parser** | `internal/parser` | YAML → `RawSchema` (strict, unknown keys are errors) → `ParsedSchema`. Calls the Lexer per field. Validates syntax, auto-adds feature fields and generates plurals and `snake_case` columns. |
| **Lexer** | `internal/lexer` | `string [required, max:255]` → `FieldDefinition`. Checks modifier syntax and relation rules. |
| **Validator** | `internal/validator` | Logical consistency: PKs, relations, `on_delete:set_null` on required fields, enums, auth, indexes, permissions, seed and column collisions. |
| **IR Builder** | `internal/ir` | `ParsedSchema` → `IRProject` — a fully linked graph with resolved navigation names. This is the contract templates read. |
| **Renderer** | `internal/renderer` | Merges the `extends` chain base-first. Loads `text/template` plus `type_mappings.yaml`, renders to disk, honors `overwrite: false` and returns a manifest. Map iteration that affects output is sorted (`slices`/`maps`/`cmp`) — two runs produce identical bytes. |
| **Snapshot** | `internal/snapshot` | Saves the IR and file manifest to `.domaincraft/snapshot.json`. Diffs the next `domain.yaml` to find deleted or renamed entities and type changes. |

Parallel paths: **WASM validator** (`cmd/wasm-validator`) — the same parser and validator compiled to the browser for Studio; **Bridge resolver** (`internal/bridge`) — `extends`/`layer`/`--replace` resolution with a monorepo-tree lookup, embedded copies as the offline fallback, and `~/.domaincraft` cache for community bridges.

## How composition works

Bridges compose via `extends` + `layer` + `--replace` — see **[Axes and layers](../three-axes)** for the full model. In short: `extends` builds a linear chain, `layer` marks the position in the axis, and `--replace` swaps one edge. `templates`/`helpers`/`type_mappings.yaml` and `registry_packages` merge base-first, adapter wins; the first enabled `migrations:` top-down wins. `output_dir`/`name` come from the top adapter. Output is deterministic, and monorepo `bridges/<path>` is resolved before the cache.

## Language-agnostic core

The Go core never contains C# namespaces, TypeScript imports or other language-specific code. All formatting lives in bridge templates and `type_mappings.yaml`. Need a new helper? Add it to the bridge — never hard-code it in Go.
