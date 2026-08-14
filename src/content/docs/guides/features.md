---
title: Entity features
description: Audit, soft delete and optimistic locking — declarative behaviour macros that inject fields and generated logic.
section: guides
order: 2
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

Adds `createdAt: datetime` and `updatedAt: datetime`. The API bridge generates code that updates these timestamps on every save.

## `audit_log`

Extended audit. Adds `createdBy: uuid` and `updatedBy: uuid`, automatically filled with the ID of the current authenticated user from the token. Requires auth to be enabled.

## `soft_delete`

Adds `deletedAt: datetime [optional]`. A DELETE request no longer removes the row physically — it marks it as deleted. GET queries automatically filter with `WHERE deletedAt IS NULL`.

## `optimistic_lock`

Adds `version: int`. The version increments on every update; concurrent stale writes are rejected with `409 Conflict`.

## `event_sourced`

The entity publishes domain events (`OrderCreated`, `OrderUpdated`, `OrderDeleted`) through the `IEventPublisher` interface. In the base monolith these are logged by `InMemoryEventPublisher`; with the Dapr addon (`--addons dapr`) they are published to a broker by `DaprEventPublisher`. This is a business feature — it knows nothing about concrete infrastructure.

## `cacheable`

Marks the entity for distributed caching, used together with the `project.infrastructure.cache` declaration.
