---
title: Writing a bridge
description: Bridge anatomy — bridge.yaml, type_mappings.yaml, templates, when-conditions, overwrite rules and helpers.
section: guides
order: 5
updated: "2026-08-03"
---

A bridge is a directory of template files plus a `bridge.yaml` manifest. Bridges are fully decoupled from the Go core — no Go code is required to add a language.

## Resolution

The CLI resolves a bridge in this order:

1. Local path → used directly.
2. Registry ID (e.g. `csharp-restful`) → checked in `~/.domaincraft/bridges/`, cloned if needed.
3. `owner/repo` GitHub shorthand → cloned.
4. Empty + interactive terminal → selection menu.

## bridge.yaml

```yaml
name: csharp-restful
description: C# REST API bridge (EF Core + PostgreSQL + JWT)
version: "1.0.0"
output_dir: generated
helpers: templates/_helpers.cs.tmpl

registry_url: "https://api.nuget.org/v3-flatcontainer/{id}/index.json"

registry_packages:
  ef_core: Microsoft.EntityFrameworkCore
  jwt_bearer: Microsoft.AspNetCore.Authentication.JwtBearer

migrations:
  enabled: true
  commands:
    - "dotnet ef migrations add InitialCreate --project src/Infrastructure ..."
    - "dotnet ef database update --project src/Infrastructure ..."

supports:
  - api_style: rest
  - database: postgresql
  - auth: jwt
  - multi_tenancy: "none"
```

- `registry_url` / `registry_packages` — optional package registry used to auto-resolve latest stable versions (`{id}` is replaced with the lowercased package ID).
- `migrations` — commands the core runs when invoked with `domaincraft generate --migrate`.
- `supports` — documented configurations the bridge targets.

## Templates

Each template spec has:

```yaml
templates:
  - for: entity            # entity = once per entity; project = once per project
    source: templates/entity.cs.tmpl
    target: "src/Domain/Entities/{{ .Entity.Name }}.cs"
    when: hasEnums         # optional condition
    overwrite: false       # optional: scaffold once, developer owns the file
    delimiters: ["<<", ">>"]  # optional: for JSX/TSX bridges
```

### `when` conditions

- `hasSeed`, `hasEnums`, `hasOwnerTokens`, `hasAuth`, `hasMigration`, `hasMockData`
- `hasAddon:dapr` / `notHasAddon:dapr`
- `when: hasAuth` only renders when auth is enabled.
- `when: hasMigration` only renders when the core computed a non-empty schema-migration plan (e.g. `RenameTable`/`RenameColumn` for `old_name` hints).
- `when: hasMockData` only renders when the core generated deterministic mock data.

### `overwrite: false`

Creates a file **only once**; the developer owns it afterwards. The renderer skips existing files and records them in the manifest as `Custom: true`. The migration engine uses this to protect developer-owned files when an entity is deleted, renamed or its types change. Rule for bridge authors: **split Core (always regenerated) and Custom (`overwrite: false`) code** — put generated logic behind interfaces and scaffold the developer-owned implementation only once (e.g. `partial` classes in C#).

### Template context

Templates receive a `RenderContext` with `.Project`, `.Entity`, `.Bridge`, `.Packages`. Entity methods: `.HasFeature("audit")`, `.HasAudit()`, `.HasSoftDelete()`, `.NonRelationFields()`, `.RelationFields()`. Field methods: `.IsArray()`, `.IsEnum()`, `.EnumTypeName()`, `.IsFeatureField()`, `.IsPatchable()`, `.IsUuid()`, `.IsText()`, `.IsInteger()`, `.IsFloat()`, `.IsNumeric()`, `.IsBoolean()`, `.IsDate()`, `.IsDateTime()`, `.IsJson()`, `.HasValidation(name)`, `.ValidationValue(name)`. Use `{{ .Entity.Name }}`, `{{ pluralize .Entity.Name }}`, `{{ fkName .Name | pascalcase }}` directly.

## type_mappings.yaml

Language-specific type mapping, loaded at runtime — the Go core stays language-agnostic:

```yaml
types:
  uuid: "Guid"
  string: "string"
  decimal: "decimal"

value_types: ["int", "long", "bool", "DateTime", "Guid"]

behaviors:
  cascade: "Cascade"
  set_null: "SetNull"

array_format: "List<%s>"
nullable_format: "?"
enum_nullable: true

# Literal syntax — how to write a value/default of each IR type.
# Keys match IR database types; "enum" is reserved for user-declared enums.
literals:
  uuid:    { parse: "Guid.Parse(%s)", default: "Guid.NewGuid()" }
  decimal: { suffix: "m", default: "0m" }
  enum:    { parse: "Enum.Parse<%s>(%s)", member: "%s.%s", zero: "(%s)0" }

# Array literal delimiters — %s is the bridge's array type.
array:
  open: "new %s { "
  close: " }"
  empty: "new %s()"
```

These power the `languageType`, `isValueType`, `deleteBehaviorName`, `inputType` (admin),
`literalValue`, `literalDefault`, `literalMember` and `arrayLiteralOpen`/`arrayLiteralClose`
template functions.

## Constraints

- Templates must use `{{-` / `-}}` whitespace trimming for clean output.
- All map iteration that affects output must be sorted — Go maps are randomized; two runs on the same `domain.yaml` must produce identical output.
- Feature fields (`createdAt`, `updatedAt`, ...) are auto-injected — filter them with `.IsFeatureField`.
- For JSX/TSX bridges, remove inline `style={{ }}` and set `delimiters: ["<<", ">>"]` to avoid conflicts with Go template delimiters.