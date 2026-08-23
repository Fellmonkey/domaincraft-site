---
title: Entity features
description: Audit, soft delete and optimistic locking — declarative behaviour macros that inject fields and generated logic.
section: guides
order: 3
updated: "2026-08-03"
---

Instead of hand-writing the same fields and logic for every entity, declare a feature and the core injects it:

```yaml
entities:
  Document:
    features: [audit, audit_log, soft_delete, optimistic_lock]
    fields:
      id: uuid [primary]
      ...
```

Feature fields are auto-injected by the core — templates must filter them with `.IsFeatureField` to avoid duplicates.

## `audit`

Adds `createdAt` and `updatedAt` (`datetime`). The API updates them on every save — so you get a timestamped history without writing it yourself.

## `audit_log`

Extends `audit` with `createdBy` and `updatedBy` (`uuid`). Filled automatically from the current user in the JWT. Requires auth.

## `soft_delete`

Adds `deletedAt` (`datetime [optional]`). `DELETE` no longer removes the row — it marks it. `GET` automatically adds `WHERE deletedAt IS NULL` — so you can restore or audit deleted rows.

## `optimistic_lock`

Adds `version: int`. It increments on every update; a stale write gets `409 Conflict` — so concurrent edits don't silently overwrite each other.

## `event_sourced`

The entity publishes domain events (`OrderCreated`, `OrderUpdated`, `OrderDeleted`) through the `IEventPublisher` interface. Without an addon the persistence layer generates `InMemoryEventPublisher`; with the Dapr addon (`--addons dapr`) events go to a broker via `DaprEventPublisher`. This is a business feature — it knows nothing about concrete infrastructure.

## `cacheable`

Marks the entity for distributed caching, used together with the `project.infrastructure.cache` declaration.
