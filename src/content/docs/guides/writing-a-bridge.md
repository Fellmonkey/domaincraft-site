---
title: Writing a bridge
description: Bridge anatomy — bridge.yaml, layer, extends, replacement, type_mappings, templates and helpers.
section: guides
order: 9
updated: "2026-08-22"
---

A bridge is a directory of `text/template` files plus a `bridge.yaml` manifest. You don't need to write Go to add a language — bridges are fully decoupled from the core. Each bridge covers exactly **one layer in one axis**.

## bridge.yaml

```yaml
name: csharp-efcore
description: EF Core persistence (extends csharp-domain)
version: "1.0.0"
layer: persistence          # open ^[a-z][a-z0-9_]*$ — convention: core|domain|persistence|transport for C#, core|client|framework|offline for web/mobile
extends: csharp-domain      # optional base — path, registry ID or owner/repo (linear chain)

output_dir: generated
helpers: templates/_helpers.cs.tmpl

registry_url: "https://api.nuget.org/v3-flatcontainer/{id}/index.json"
registry_packages:
  ef_core: Microsoft.EntityFrameworkCore

migrations:
  enabled: true
  commands:
    - "dotnet ef migrations add InitialCreate --project src/Infrastructure ..."
```

* `layer` — your position in the axis; if the same `layer` appears twice in one chain the build fails, so a miswired stack is caught early. A `layer` mismatch on `--replace` is a warning, not an error.
* `extends` — a linear chain (local path, registry ID or `owner/repo`). A sibling checkout next to the adapter is checked first, so monorepo development works before publishing.
* `registry_url` / `registry_packages` — merged base-first, adapter wins on key conflicts. The adapter's `registry_url` wins; any source with one is a fallback.
* `migrations:` — the first `enabled` config top-down wins (so `rest` without migrations still runs `efcore`'s `dotnet ef` commands).

## Replacement

New persistence or transport ships as **one repo** — see **[Axes and layers](../../concepts/three-axes)** for the full model:

```bash
domaincraft generate --bridge csharp-rest --replace persistence=../my-dapper
```

`--replace left=right` (`generate` only, repeatable): `left` is a `layer` or a `bridgeId`, `right` is any bridge ref.

## Composition

Base `templates`/`helpers`/`type_mappings.yaml` render first, adapter wins — full details in **[Axes and layers](../../concepts/three-axes)**. Example:

```yaml
name: react-rest
layer: framework
extends: ts-client
```

## Templates

```yaml
templates:
  - for: entity            # entity = once per entity; project = once per project
    source: templates/entity.cs.tmpl
    target: "src/Domain/Entities/{{ .Entity.Name }}.g.cs"
    when: hasAuth          # optional
    overwrite: false       # scaffold once, developer owns the file
    delimiters: ["<<", ">>"]  # for JSX/TSX
```

`when`: `hasSeed`, `hasEnums`, `hasOwnerTokens`, `hasAuth`, `hasMigration`, `hasMockData`, `hasAddon:dapr` / `notHasAddon:dapr`.

`overwrite: false` — renderer skips existing files (`Custom: true` in the manifest, protected by the snapshot engine). Rule: **Core (regenerated) vs Custom (`overwrite: false`)** — put logic behind interfaces and scaffold once using the idiom of your target language (partial classes in C#, base classes in Python, etc.).

Context: `RenderContext{ .Project, .Entity, .Bridge, .Packages }` — use `{{ .Entity.Name }}`, `{{ fkName .Name | pascalcase }}`, `.IsFeatureField`, `.HasValidation`.

## type_mappings.yaml

Language-specific mapping, loaded at runtime — the core stays language-agnostic:

```yaml
types:
  uuid: "Guid"
  string: "string"
value_types: ["int", "Guid"]
behaviors:
  cascade: "Cascade"
array_format: "List<%s>"
nullable_format: "?"
literals:
  uuid: { parse: "Guid.Parse(%s)", default: "Guid.NewGuid()" }
array:
  open: "new %s { "
  close: " }"
```

Powers `languageType`, `isValueType`, `deleteBehaviorName`, `literalValue`, `literalDefault`, `literalMember`.

## Constraints

* `{{-` / `-}}` whitespace trimming.
* Iterate maps via `slices.Sorted(maps.Keys(...))` or `slices.Sort` — deterministic output is a hard rule.
* Filter feature fields with `.IsFeatureField`.
* For JSX/TSX, `delimiters: ["<<", ">>"]` and no inline `style={{ }}`.
