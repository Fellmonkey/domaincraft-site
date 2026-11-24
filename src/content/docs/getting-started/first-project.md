---
title: Your first project
description: Build a small store with entities, relations, a permission matrix and auth, then generate the full backend.
section: getting-started
order: 2
updated: "2026-08-23"
---

This guide builds a small store — `User`, `Product`, `Category` — to show relations, features, permissions and seed data in one model.

## Entities and fields

Each entity declares its fields. Field definitions are strings: a type, plus inline traits in square brackets:

```yaml
entities:
  User:
    fields:
      id: uuid [primary]
      email: string [required, unique, email]
      password: string [required, hidden, min:8]
```

Fields you never want exposed over the API (like `password`) use the `hidden` trait — the generator keeps them out of JSON responses.

## Relations

A relation is written on the owning (child) side with `relation(Target)`. The inverse collection on the parent is created automatically.

```yaml
  Category:
    fields:
      id: uuid [primary]
      name: string [required, unique]
      products: relation(Product) [many]   # one-to-many: reconciles with the FK below

  Product:
    fields:
      id: uuid [primary]
      title: string [required, min:3, max:200]
      price: decimal [required, gte:0]
      categoryId: relation(Category) [required]   # many-to-one (FK column)
```

- `relation(Category)` on `Product.categoryId` creates the FK column.
- `products: relation(Product) [many]` on `Category` declares the collection side. When the target has a matching FK, the core **reconciles** the two declarations into a single one-to-many relation — no join table, no duplicate foreign key.
- A true **many-to-many** needs `[many]` on *both* sides and no FK: e.g. `tags: relation(Tag) [many]` on `Product` plus `products: relation(Product) [many]` on `Tag` → an implicit join table is created.
- `relation(Profile) [unique]` on a child field makes the relation one-to-one.

## Foreign-key behaviour (`on_delete`)

Control what happens when a referenced row is deleted:

| Value       | Behaviour                                    |
|-------------|----------------------------------------------|
| `cascade`   | Deletes dependent rows                        |
| `set_null`  | Keeps the row, resets the FK to NULL          |
| `restrict`  | Blocks deleting the parent                    |
| `no_action` | Leaves it to the database                     |

`set_null` is only valid on optional relations.

## Features

Entity features auto-inject standard fields and behaviour:

```yaml
  Product:
    features: [audit, soft_delete]
    ...
```

- `audit` adds `createdAt` / `updatedAt`, updated on save.
- `audit_log` adds `createdBy` / `updatedBy` (IDs of the current user).
- `soft_delete` adds `deletedAt`; DELETE marks rows and GET filters them out.
- `optimistic_lock` adds `version` and returns `409 Conflict` on stale writes.

## Permissions

```yaml
  Product:
    permissions:
      read: ["*"]           # public endpoint
      create: [Admin]
      update: ["@Owner", Admin]
```

- `read: [*]` — public, no auth required.
- A role name (`Admin`) — RBAC check on the role claim.
- `@Owner` — ABAC: only the user whose ID matches the row's foreign key.

Roles referenced here must be declared under `auth.roles`.

## Seed data

Seed rows are inserted on first run:

```yaml
  Role:
    fields:
      id: int [primary]
      name: string [unique]
    seed:
      - { id: 1, name: "Admin" }
      - { id: 2, name: "Customer" }
```

## Generate

```bash
domaincraft generate --domain domain.yaml --bridge csharp-rest --admin
```

`csharp-rest` (`core → domain → efcore → rest`) is the current C# bridge — the monolith `csharp-restful` is archived and kept for compatibility. Passing `--admin` also scaffolds an admin panel. The generated project includes entity summaries under `docs/Entities/` and a `docs/ProjectSummary.md`.

> **Next:** the same model compiles into a typed TypeScript client and React hooks — see the [TypeScript client](../../guides/typescript-client/) guide.
