---
title: Architecture
description: The compiler pipeline — parser, lexer, validator, IR builder, renderer — and what each stage owns.
section: concepts
order: 2
updated: "2026-08-03"
---

```
domain.yaml --> Parser (calls Lexer per field) --> Validator --> IR Builder --> Renderer --> Generated Code
```

| Stage | Package | Responsibility |
|-------|---------|---------------|
| **Parser** | `internal/parser` | Reads YAML into `RawSchema` (strict decoding — unknown keys are errors), converts to `ParsedSchema`. Calls the lexer per field. Validates syntax: field types, modifiers, `on_delete` values. Auto-adds fields from features (audit, soft_delete, ...). Generates plural names and snake_case DB columns. |
| **Lexer** | `internal/lexer` | Parses field definition strings like `"string [required, max:255]"` into structured `FieldDefinition` objects. Validates modifier syntax, type constraints and relation-specific rules. |
| **Validator** | `internal/validator` | Logical consistency: missing/duplicate PKs, broken relations, `on_delete:set_null` on required fields, unused enums, auth entity validation, index integrity, permission cross-checks, seed compatibility, column collisions. |
| **IR Builder** | `internal/ir` | Converts `ParsedSchema` to a fully linked `IRProject` graph with bidirectional relations and resolved navigation names — the contract templates consume. |
| **Renderer** | `internal/renderer` | Reads `bridge.yaml`, loads `text/template` files with stdlib-backed template functions (`internal/templatefuncs`) + bridge type mappings, renders IR to disk. Honors `overwrite: false`, returns a manifest, and composes `extends:` base bridges (base templates/helpers/type_mappings render first; the adapter wins). |

Two companion paths:

- **Snapshot/migration** (`internal/snapshot`) — persists the IR + file manifest to `<output>/.domaincraft/snapshot.json`, diffs the next `domain.yaml` against it, and provides delete/rename helpers.
- **WASM validator** (`cmd/wasm-validator`) — exposes the same parser + validator to the GUI browser, so validation is never duplicated in type land.

## Language-agnostic core

The Go core never contains language-specific constructs — no C# namespaces, no Python imports. All language-specific formatting lives in bridge templates and `type_mappings.yaml`. If a bridge needs a new language-specific helper, it goes in the bridge's `type_mappings.yaml` or as a template function — never hard-coded in Go.