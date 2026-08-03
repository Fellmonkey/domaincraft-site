---
title: Schema changes & migrations
description: Snapshot-based migration — old_name hints, --prune, --migrate and developer-owned custom files.
section: guides
order: 4
updated: "2026-08-03"
---

DomainCraft tracks the **history of the domain model**, not the generated code. After every successful `domaincraft generate`, the IR and a file manifest are persisted to `<output>/.domaincraft/snapshot.json`. On the next run the new `domain.yaml` is diffed against that snapshot.

## Deleted entities

Entity-scoped files that are no longer generated become orphaned:

- Generated files are cleaned up automatically.
- Custom files (`overwrite: false`) are shown in an interactive multi-select prompt — or printed as a warning in non-interactive mode.

## Renamed entities

Declare the previous name with `old_name`:

```yaml
entities:
  Item:
    old_name: Product   # rename hint
    fields: ...
```

The CLI offers to rename the entity's custom files (`ProductService.cs` → `ItemService.cs`), replacing both singular and plural forms in the path. Renames made in the GUI set `old_name` automatically.

## Field type changes

After generation the CLI prints a smart "manual refactoring" report listing changed fields (`Product.id: uuid -> int`) and the custom files that may need manual fixes.

## `--prune`

Applies all cleanup automatically without prompting (CI-friendly). Without it, non-interactive runs only print warnings and keep the previous snapshot on disk, so a later `--prune` run can still find and clean the orphans. Once cleanup is applied (or the diff is empty), the snapshot is updated.

## `--migrate`

After generation, runs the bridge's declared database-migration commands (`migrations:` in `bridge.yaml`) against a real database — e.g. `dotnet ef migrations add` and `dotnet ef database update`. This is how schema changes reach the database without writing SQL by hand. It is explicit and opt-in.