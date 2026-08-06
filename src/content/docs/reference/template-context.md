---
title: Template context (IR)
description: What bridge templates receive — RenderContext, entity and field methods, and the available template functions.
section: reference
order: 4
updated: "2026-08-03"
---

Bridge templates receive a `RenderContext`:

- `.Project` (`IRProject`) — name, description, database, auth, apiStyle, platform, enums, entities, cache, cors, deploy. Methods: `.HasAuth()`, `.Addons` / `.HasAddon("dapr")`, `.Infrastructure` / `.HasInfraQueue()` / `.HasInfraCache()` / `.HasInfraStorage()`.
- `.Entity` (`IREntity`) — name, namePlural, fields, relationsOut, relationsIn, indexes, seed, permissions, features. Methods: `.HasFeature("audit")`, `.HasAudit()`, `.HasAuditLog()`, `.HasSoftDelete()`, `.HasOptimisticLock()`, `.NonRelationFields()`, `.RelationFields()`, `.HasEventSourced()`, `.HasCacheable()`, `.OldName`.
- `.Bridge` (`BridgeConfig`) — bridge configuration (name, description, outputDir, helpers, delimiters, ...).
- `.Packages` (`map[string]string`) — resolved package versions from the registry.

## `RenderContext` convenience methods

`Name()`, `NamePlural()`, `HasAudit()`, `HasAuditLog()`, `HasSoftDelete()`, `HasOptimisticLock()`, `Permissions()`, `Seed()`, `PrimaryKey()`, `HasFeature(name)`.

## `IRField` methods

`.IsArray()`, `.ArrayElementType()`, `.HasValidation(name)`, `.ValidationValue(name)`.

Key `IRField` fields: name, databaseType, navigationName, isPrimary, isNullable, isUnique, isHidden, isRelation, isMany, relationTarget, defaultValue, defaultIsFunc, validations.

`IRRelation` fields: fieldName, targetEntity, navigationName, inverseNavName, onDeleteBehavior, isNullable, isMany, relationType, pairFieldName, pairNavigationName.

`IRAuthConfig`: type, entity, roles, endpoints (`.HasLogin()`, `.HasRegister()`, `.HasMe()`).

## Core template functions

- String transforms: `pluralize`, `singularize`, `pascalcase`, `camelcase`, `lowercase`, `uppercase`, `humanize`.
- `jsonValue`, `rawSeedValue`, `lookupField`, `isFeatureField`, `fkName`, `isEnumType`, `enumTypeName`.
- `hasOwnershipToken`, `isPublicPermission`.
- All sprig functions.

## Bridge functions (from type_mappings.yaml)

- `languageType` — IR database type → language type (`uuid` → `Guid`).
- `isValueType` — is the mapped type a value type (needs `?` when nullable).
- `deleteBehaviorName` — delete behavior → language enum (`set_null` → `SetNull`).
- `inputType` — IR database type → UI input component (admin bridges).