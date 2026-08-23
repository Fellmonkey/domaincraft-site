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
| **Renderer** | `internal/renderer` | Merges the `extends` chain base-first. Loads `text/template` plus `type_mappings.yaml`, renders to disk, honors `overwrite: false` and returns a manifest. Every map that affects output uses `sort.Strings` — two runs produce identical bytes. |
| **Snapshot** | `internal/snapshot` | Saves the IR and file manifest to `.domaincraft/snapshot.json`. Diffs the next `domain.yaml` to find deleted or renamed entities and type changes. |

Parallel paths: **WASM validator** (`cmd/wasm-validator`) — the same parser and validator compiled to the browser for Studio; **Bridge resolver** (`internal/bridge`) — `extends`/`layer`/`--replace` resolution with `~/.domaincraft` cache.

## How composition works

Bridges compose via `extends` + `layer` + `--replace` — see **[Axes and layers](../three-axes)** for the full model. In short: `extends` builds a linear chain, `layer` marks the position in the axis, and `--replace` swaps one edge. Merged base-first (`templates`/`helpers`/`type_mappings.yaml`, adapter wins), `output_dir`/`name` from the top adapter, `migrations:`/`registry_packages` — first `enabled` top-down. Deterministic and sibling-checkout aware for monorepo dev.

## Language-agnostic core

The Go core never contains C# namespaces, TypeScript imports or other language-specific code. All formatting lives in bridge templates and `type_mappings.yaml`. Need a new helper? Add it to the bridge — never hard-code it in Go.
