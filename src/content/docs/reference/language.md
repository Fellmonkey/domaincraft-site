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
- `database` — target database: `postgresql`, `mysql`, `sqlite`, `mssql`, `mongodb`, `appwrite`. The core validates all of them; the ready `csharp-restful` bridge targets PostgreSQL (EF Core + Npgsql), and `appwrite` targets Appwrite TablesDB via the `appwrite` bridge.
- `api_style` — how controllers are generated: `rest`. The core validates `graphql` and `grpc` too, but the ready `csharp-restful` bridge generates REST only.
- `project.infrastructure` — declarative infrastructure (see the Infrastructure guide).
- `auth` — authorization mode: `jwt` or `none` (see the Authentication guide).
- `project.multi_tenancy` — SaaS mode, e.g. `mode: column`. The core validates the mode; **bridges decide how (or whether) to implement it** — the `csharp-restful` bridge currently does not generate tenant isolation, so a `tenantId` column must be declared explicitly if you need one (the compliance suite does exactly that).

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
- `hidden` — excluded from API responses.
- `readonly` — in responses, excluded from create/update/patch (server-owned).
- `required` — NOT NULL in the database.

String validations: `min:X`, `max:X`, `email`, `url`, `ipv4`, `regex:"^[A-Z]+$"`.

Numeric validations: `gte:0`, `lt:100`, and similar comparisons.

Defaults: `default:false`, `default:"Unknown"`, `default:now()` (database-level).

## Relations

- **Many-to-One / One-to-Many** — written on the child: `userId: relation(User)`. Creates an `Orders[]` list on `User`.
- **One-to-One** — a `[unique]` relation: `profileId: relation(Profile) [unique]`.
- **Many-to-Many** — `tags: relation(Tag) [many]`. The core reconciles the two declarations into one `[many]` relation; EF Core (the C# bridge) creates the hidden join table via `HasMany/WithMany` and exposes the collection as a navigation, eager-loaded via `Include`.
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

Directives: role names (RBAC), `*` (public), `@Owner` (ABAC). Custom conditions are not implemented; unknown permission keys are a parse error.

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

The bridge generates a seeder class that applies the rows idempotently at application startup (and on a daily recurring job) — the exact mechanism is bridge-specific.

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

- `@Tenant` token — ABAC data isolation. In the spec, but **not implemented**: neither the core nor the `csharp-restful` bridge interprets it (the core only validates any `@...` token as an ownership-style token).
- Custom permission conditions (`condition(...)`) — described in the spec, **not** implemented.