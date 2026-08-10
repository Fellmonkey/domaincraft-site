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

The CLI offers to rename the entity's custom files (`ProductService.cs` → `ItemService.cs`), replacing both singular and plural forms in the path. Because the DB table name is derived from the entity plural name (`products` → `items`), the C# bridge also ships the exact `migrationBuilder.RenameTable(...)` statement so the renamed entity keeps its rows instead of EF dropping the old table. Renames made in the GUI set `old_name` automatically.

## Field type changes

After generation the CLI prints a smart "manual refactoring" report listing changed fields (`Product.id: uuid -> int`) and the custom files that may need manual fixes.

## Field renames

Fields can carry an `old_name` hint (same syntax as entities): `name: string [required, max:200, old_name:title]`. The migration engine detects it, prints a data-preservation report, and the C# bridge ships the exact `migrationBuilder.RenameColumn(...)` statements for every renamed column in `src/Infrastructure/Persistence/Migrations/SchemaRenames.cs`. Call `SchemaRenames.Apply(migrationBuilder)` at the top of the `Up()` method of the migration you write — the file also lists any `RenameTable` for renamed entities. EF Core cannot infer a rename from the model snapshot and would otherwise **drop** the old table/column and **add** a new one, destroying the data. The file regenerates on every run while a rename is pending, so new renames added later are picked up automatically.

## `--prune`

Applies all cleanup automatically without prompting (CI-friendly): it deletes/renames orphaned files **and rewrites renamed identifiers inside developer-owned files** (entity, field and project-namespace references across Pascal/camel/UPPER/plural forms), so `ProductService.cs` becomes `ItemService.cs` and its content stops referencing `Product`. When the diff detected schema changes (renamed/deleted entities, field renames or type changes), `--prune` **also runs the bridge's migration commands** — best-effort: if they fail (no dotnet SDK or unreachable database) it warns and continues, because in a docker workflow the API container applies pending migrations at startup (`Database:SchemaMode=migrate` → `MigrateAsync`). Without `--prune`, non-interactive runs only print warnings and keep the previous snapshot on disk, so a later `--prune` run can still find and clean the orphans. Once cleanup is applied (or the diff is empty), the snapshot is updated.

## `--migrate`

After generation, runs the bridge's declared database-migration commands (`migrations:` in `bridge.yaml`) against a real database — e.g. `dotnet ef migrations add` and `dotnet ef database update`. This is how schema changes reach the database without writing SQL by hand. It is explicit and opt-in.