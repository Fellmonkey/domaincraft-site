---
title: Template context (IR)
description: What bridge templates receive — RenderContext, entity and field methods, and the available template functions.
section: reference
order: 4
updated: "2026-08-03"
---

Bridge templates receive a `RenderContext`:

- `.Project` (`IRProject`) — name, description, database, auth, apiStyle, platform, enums, entities, cache, cors, deploy. Methods: `.HasAuth()`, `.Addons` / `.HasAddon("dapr")`, `.Infrastructure` (`.Queue`/`.Cache`/`.Secrets`/`.Storage`), `.AllFilterOperators()`.
- `.Entity` (`IREntity`) — name, namePlural, fields, relationsOut, relationsIn, indexes, seed, permissions, features. Methods: `.HasFeature("audit")`, `.HasAudit()`, `.HasAuditLog()`, `.HasSoftDelete()`, `.HasOptimisticLock()`, `.NonRelationFields()`, `.RelationFields()`, `.HasEventSourced()`, `.HasCacheable()`, `.OldName`.
- `.Bridge` (`BridgeConfig`) — bridge configuration (name, description, outputDir, helpers, delimiters, extends, ...).
- `.Packages` (`map[string]string`) — resolved package versions from the registry.

## `RenderContext` convenience methods

`Name()`, `NamePlural()`, `HasAudit()`, `HasAuditLog()`, `HasSoftDelete()`, `HasOptimisticLock()`, `Permissions()`, `Seed()`, `PrimaryKey()`, `HasFeature(name)`, `SearchableFields()`, `SortableFields()`, `FilterableFields()`.

## Queryability & filtering

- `IREntity.QuerySchema()` — the single entry point bundling the whole list-query surface into one `{ Searchable, Sortable, Filterable }` object; search, sort and filter are peers of the same query (not a filter-first API).
- `IREntity.SearchableFields()` — scalar text columns eligible for free-text `search`.
- `IREntity.SortableFields()` — scalar columns a list endpoint may order by (`field` / `-field`).
- `IREntity.FilterableFields()` — scalar columns filterable by value; each field exposes `IRField.FilterOperators()` (the operators its type supports).
- `IREntity.FilterablePaths()` — the full filter path schema for a bridge's runtime validator: scalar fields, one-hop to-one relation paths (`category.name`) and JSON roots (`meta`, open-ended keys), each with its allowed operators. The core emits the *schema*; the bridge parses and validates the `path:op:value` strings at runtime (see `spec/query.md` for the grammar).
- `IRProject.AllFilterOperators()` — the fixed filter-operator vocabulary (`eq | ne | gt | gte | lt | lte | in | contains | startsWith | endsWith`) in deterministic order; iterate it to generate a bridge's runtime operator enum (member names via `pascalcase`) instead of hand-writing a parallel list.
- `IREntity.EagerLoadRelations()` — the relations to eager-load on a full-graph fetch; each relation exposes `IRRelation.EagerLoadNavigation()` for the property to Include (collection for `[many]`, navigation for single FKs; casing is applied by the bridge). List endpoints accept `?include=` (comma-separated relation field names) to restrict which `[many]` collections are loaded.
- `IREntity.CursorField()` — the keyset-pagination cursor: the primary key when it is a monotonic integer (`int`/`bigint`), nil otherwise. A bridge renders `?cursor=` keyset paging only for entities where this is non-nil (others fall back to offset).

## `IRField` methods

`.IsArray()`, `.ArrayElementType()`, `.IsEnum()`, `.EnumTypeName()`, `.IsFeatureField()`, `.IsSensitive()`, `.IsPatchable()`, `.IsUuid()`, `.IsText()`, `.IsString()`, `.IsInteger()`, `.IsBigInt()`, `.IsFloat()`, `.IsDecimal()`, `.IsNumeric()`, `.IsBoolean()`, `.IsDate()`, `.IsDateTime()`, `.IsJson()`, `.IsJsonB()`, `.HasValidation(name)`, `.ValidationValue(name)`, `.ValidationRules()`.

Key `IRField` fields: name, databaseType, navigationName, isPrimary, isNullable, isUnique, isHidden, isRelation, isMany, relationTarget, defaultValue, defaultIsFunc, validations.

`IRRelation` fields: fieldName, targetEntity, navigationName, inverseNavName, onDeleteBehavior, isNullable, isMany, relationType, pairFieldName, pairNavigationName.

`IRAuthConfig`: type, entity, roles, endpoints (`.HasLogin()`, `.HasRegister()`, `.HasMe()`).

## Validation rules & errors

`IRField.ValidationRules()` returns normalized, ordered `IRValidationRule`s (see `spec/errors.md` for the full contract):

- `.Kind` — semantic kind (`required`, `email`, `url`, `ipv4`, `regex`, `min_length`, `max_length`, `min_value`, `max_value`).
- `.Code` — stable wire code (`REQUIRED`, `EMAIL`, `URL`, `IPV4`, `REGEX`, `MIN_LENGTH`, `MAX_LENGTH`, `MIN_VALUE`, `MAX_VALUE`).
- `.Value` — the rule parameter (`""` for flag rules).
- `.Exclusive` — true when a numeric bound is strict (`gt`/`lt`).
- `.Message` — stable default message, value already interpolated (e.g. `must be greater than or equal to 0.01`).

Bridges map each rule to their framework's validator: DataAnnotations uses `.Message` for `ErrorMessage`; FluentValidation/class-validator use `.Code` (`.WithErrorCode`) + `.Message`.

Non-validation operation errors use a stable `{code, message}` envelope (`INVALID_FILTER`, `INVALID_PATCH`, `CONCURRENCY_CONFLICT`); validation failures use the framework's native validation response (see `spec/errors.md`).

## Core template functions

- String transforms: `pluralize`, `pascalcase`, `camelcase`, `lowercase`, `uppercase`, `humanize`.
- `jsonValue`, `fkName`, `seedKind`.
- IR helpers: `IREntity.PrimaryKey()`, `IREntity.FieldByName(name)`, `IREntity.AllIndexes()`, `IREntity.Endpoints()`, `IREntity.PermissionPlan(op)`, `IREntity.TableName()`, `IREntity.SearchableFields()`, `IREntity.SortableFields()`, `IREntity.FilterableFields()`, `IREntity.QuerySchema()`, `IREntity.FilterablePaths()`, `IREntity.EagerLoadRelations()`, `IRRelation.EagerLoadNavigation()`, `IRRelation.ForeignKeyColumnName()`, `IRField.ColumnName()`, `IRField.FilterOperators()`, `IRField.IsUuid()`, `IRField.IsText()`, `IRField.IsString()`, `IRField.IsTextOnly()`, `IRField.IsInteger()`, `IRField.IsBigInt()`, `IRField.IsFloat()`, `IRField.IsDecimal()`, `IRField.IsBoolean()`, `IRField.IsDate()`, `IRField.IsDateTime()`, `IRField.IsJson()`, `IRField.IsJsonB()`, `IRProject.AuthEntity()`, `IRProject.AuthEndpoints()`, `IRProject.EnumValues(name)` (→ `[]IREnumValue{ Name, WireValue, Ordinal }`), `IRProject.AllFilterOperators()` (→ the canonical operator vocabulary), `IRIndex.DatabaseName()`, `IREndpoint.AuthPolicy()`, `IRPermissions.HasOwnerToken()`, `IRPermissions.IsPublic(op)`, `SeedValue.Kind()`, `SeedValue.ElementType()`.
- The `templatefuncs` set (`internal/templatefuncs`, stdlib-backed): `add`, `any`, `append`, `atoi`, `base`, `contains`, `default`, `dict`, `hasPrefix`, `join`, `kindIs`, `kindOf`, `list`, `lower`, `now`, `set`, `splitList`, `title`, `toString`, `upper`, plus the textutil-backed `pluralize`, `pascalcase`, `camelcase`, `lowercase`, `uppercase`, `humanize`, `fkName`, `snakecase`, `kebabcase`.

> **Column/table/enum-wire/index names are core-owned.** Print `IREntity.TableName()`, `IRField.DatabaseColumnName` / `IRField.ColumnName()`, `IRRelation.ForeignKeyColumnName()`, `IREnumValue.WireValue` and `IRIndex.DatabaseName()` — never re-derive them with the template `snakecase`, which diverges from `textutil.ToDatabaseColumnName` on acronyms (e.g. `IPv4Address`).

## Bridge functions (from type_mappings.yaml)

- `languageType` — IR database type → language type (`uuid` → `Guid`).
- `isValueType` — is the mapped type a value type (needs `?` when nullable).
- `deleteBehaviorName` — delete behavior → language enum (`set_null` → `SetNull`).
- `inputType` — IR database type → UI input component (admin bridges).
- `literalValue` — scalar value/default → literal or parse expression (`Guid.Parse(...)`, `99.99m`).
- `literalDefault` — value-less default (`Guid.NewGuid()`, `0L`, `new List<T>()`).
- `literalMember` — enum default → compile-time member (`OrderStatus.Draft`).
- `arrayLiteralOpen` / `arrayLiteralClose` — array literal delimiters.
- `columnSize` — declared default column size per IR type (`column_sizes:` in `type_mappings.yaml`, e.g. appwrite `string → 255`, `uuid → 36`).