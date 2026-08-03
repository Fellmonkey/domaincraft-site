---
title: domain.yaml reference
description: Complete reference of the domain.yaml language — project scope, data types, fields, relations, features, permissions, indexes and seed data.
section: reference
order: 1
updated: "2026-08-03"
---

`domain.yaml` is the single source of truth for the domain model. This is the exhaustive specification of the language.

## Project scope

Global settings in the YAML root:

- `project.name` — project name.
- `project.database` — SQL/NoSQL mode: `postgresql`, `mysql`, `mssql`, `mongodb`. Determines which types are available (e.g. `jsonb` exists in PostgreSQL).
- `project.api_style` — how controllers are generated: `rest` (others are planned).
- `project.infrastructure` — declarative infrastructure (see the Infrastructure guide).
- `auth` — authorization mode: `jwt` or `none` (see the Authentication guide).
- `project.multi_tenancy` — SaaS mode, e.g. `mode: column`; adds `tenantId` to non-global entities and filters queries by `WHERE tenant_id = @currentTenant`.

## Data types

Abstract types that the bridge translates into the target language and database:

- **Primitives:** `string`, `int`, `bigint`, `float`, `decimal`, `boolean`, `date`, `datetime`, `uuid`.
- **Complex:**
  - `text` — long strings (`TEXT` / `VARCHAR(MAX)`).
  - `json` / `jsonb` — unstructured data.
  - `enum(Name)` — references a block in `enums`.
  - `array(Type)` — e.g. `array(int)` → PostgreSQL array, C# `List<int>`.

## Fields

A field is written as `name: type [trait1, trait2:value]`.

Base traits:

- `primary` — primary key.
- `optional` — NULL in the database.
- `unique` — unique index.
- `hidden` — not returned in API JSON responses (ideal for passwords).
- `required` — the inverse of `optional`.

String validations: `min:X`, `max:X`, `email`, `url`, `ipv4`, `regex:"^[A-Z]+$"`.

Numeric validations: `gte:0`, `lt:100`, and similar comparisons.

Defaults: `default:false`, `default:"Unknown"`, `default:now()` (database-level).

## Relations

- **Many-to-One / One-to-Many** — written on the child: `userId: relation(User)`. Creates an `Orders[]` list on `User`.
- **One-to-One** — a `[unique]` relation: `profileId: relation(Profile) [unique]`.
- **Many-to-Many** — `tags: relation(Tag) [many]`. The core creates the hidden join table (`ArticleTags`), composite keys and add/remove tag API methods.
- **`on_delete`** — `cascade`, `set_null` (only on optional fields), `restrict`, `no_action`.

## Features

Entity-level macros: `audit`, `audit_log`, `soft_delete`, `optimistic_lock`, `event_sourced`, `cacheable`. See the Features guide.

## Permissions

```yaml
permissions:
  read: [Admin, "@Owner"]
  create: [User, Admin]
  update: ["@Owner"]
  delete: [Admin]
```

Directives: role names (RBAC), `*` (public), `@Owner` and `@Tenant` (ABAC). Custom conditions are not implemented; unknown permission keys are a parse error.

## Indexes

Composite indexes and unique groups:

```yaml
indexes:
  - fields: [status, createdAt]
    type: btree
    sort: [asc, desc]
```

## Seed data

```yaml
seed:
  - { id: 1, name: "Admin" }
  - { id: 2, name: "Customer" }
```

The bridge generates seeder scripts/classes executed on first run.

## Full example

```yaml
Document:
  features: [audit_log, soft_delete, optimistic_lock]
  fields:
    id: uuid [primary]
    title: string [required, min:5, max:120]
    content: text [optional]
    status: enum(DocStatus) [default:Draft]
    folderId: relation(Folder) [optional, on_delete:set_null]
    authorId: relation(User) [required, on_delete:restrict]
    isPublished: boolean [default:false]
    internalNotes: string [hidden, optional]
  indexes:
    - fields: [folderId, status]
  permissions:
    read: [Admin, "@Owner"]
    create: [User, Admin]
    update: ["@Owner"]
    delete: [Admin]
```

## Planned

- `@Tenant` token — ABAC data isolation; the GUI does not yet expose it in the permission matrix.
- Custom permission conditions (`condition(...)`) — described in the spec, **not** implemented.