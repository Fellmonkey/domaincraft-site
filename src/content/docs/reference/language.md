---
title: domain.yaml reference
description: Complete reference of the domain.yaml language — project scope, data types, fields, relations, features, permissions, indexes and seed data.
section: reference
order: 1
updated: "2026-08-23"
---

`domain.yaml` is the single source of truth for the domain model. This is the exhaustive specification of the language.

## Project scope

Global settings in the YAML root:

- `project.name` — project name.
- `database` — target database: `postgresql`, `mysql`, `sqlite`, `mssql`, `mongodb`, `appwrite`. The core validates all of them. The ready bridges target: `csharp-rest` (via `csharp-efcore` + Npgsql) → PostgreSQL, `appwrite` → Appwrite TablesDB.
- `api_style` — how the transport layer generates controllers: `rest`. The core also validates `graphql` and `grpc`, but the ready `csharp-rest` bridge generates REST only — a `csharp-grpc` bridge would add gRPC as one more `transport` layer.
- `project.infrastructure` — declarative infrastructure (see the Infrastructure guide).
- `auth` — authorization mode: `jwt` or `none` (see the Authentication guide).
- `project.multi_tenancy` — SaaS mode, e.g. `mode: column`. The core validates the mode; **bridges decide whether to implement it** — the ready C# bridges currently do not generate tenant isolation, so declare `tenantId` explicitly if you need it (the compliance suite does).
- `project.deploy` — host + port for local/Docker runs, e.g. `domain: localhost`, `port: 9000`. The generated `docker-compose.yml` and k8s manifests map this port.
- `project.pagination` — list-endpoint defaults, e.g. `default_page_size: 20`, `max_page_size: 200`. Compiled into the client as `PAGINATION` so a UI can clamp/prefill instead of hard-coding.
- `project.versioning` — API versioning, e.g. `enabled: true`, `default_version: 1.0`.
- `project.rate_limit` — API rate limiting, e.g. `enabled: true`, `policy: fixed`, `permit_limit`, `window_seconds` (the compliance suite exercises the generated `429`).
- `project.cache` — cache configuration; used together with the `cacheable` entity feature.

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
- `old_name` — rename hint (entity or field): the migration engine emits `RenameTable`/`RenameColumn` and `--prune` rewrites identifiers in custom files (see the Migrations guide).

String validations: `min:X`, `max:X`, `email`, `url`, `ipv4`, `regex:"^[A-Z]+$"`.

Numeric validations: `gte:0`, `lt:100`, and similar comparisons.

Defaults: `default:false`, `default:"Unknown"`, `default:now()` (database-level).

## Relations

- **Many-to-One / One-to-Many** — written on the child: `userId: relation(User)`. Creates an `Orders[]` list on `User`.
- **One-to-One** — a `[unique]` relation: `profileId: relation(Profile) [unique]`.
- **Many-to-Many** — `tags: relation(Tag) [many]`. The core reconciles the two declarations into one `[many]` relation; the persistence bridge creates the hidden join table (EF Core via `HasMany`/`WithMany` and `Include`) and exposes it as a collection.
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

The bridge generates a seeder (e.g. `DomainSeeder` in C#) that inserts rows idempotently at application startup — it checks with `AnyAsync()` and skips if data already exists. The exact trigger is bridge-specific.

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

Spec'd but not implemented: `@Tenant`, custom permission conditions (`condition(...)`), `auth.type: cookie`/`oauth2` — see [Roadmap](../../concepts/roadmap/). Unknown permission keys remain a parse error.