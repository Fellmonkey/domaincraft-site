---
title: Infrastructure & addons
description: Declare infrastructure in domain.yaml and toggle the Dapr addon — events, caching, email and storage ports.
section: guides
order: 7
updated: "2026-08-03"
---

DomainCraft keeps business logic clean of infrastructure. Two mechanisms handle the plumbing: the declarative `project.infrastructure` block and the `--addons` CLI flag.

## Declaring infrastructure

```yaml
project:
  infrastructure:
    queue: redis       # message broker: pubsub, rabbitmq, kafka, redis, nats, in-memory
    cache: redis       # distributed cache: redis, memcached, in-memory
    secrets: local     # secret store: local, kubernetes, azure-keyvault, aws-secrets
    storage: s3        # object storage: local, s3, azure-blob, gcs
```

This section generates nothing by itself — it tells the bridge which services are available, so the business description of the domain stays pure. Templates read it via `.Project.Infrastructure.Queue` / `.Cache` / `.Secrets` / `.Storage`.

## The Dapr addon

Addons are infrastructure accelerators connected through the CLI, not through `domain.yaml`:

```bash
# Lightweight — in-memory events, no sidecars
domaincraft generate --bridge csharp-rest

# Enterprise — Dapr sidecar with ready-to-use dapr/components
domaincraft generate --bridge csharp-rest --addons dapr
```

With the addon enabled, the bridge renders the extra templates guarded by `when: hasAddon:dapr` — including `dapr/components/{pubsub,statestore,email,storage}.yaml`.

## Ports and implementations

The C# bridges always generate the port interfaces; the concrete implementation is selected at DI time by the addon:

| Port                  | Interface              | No addon (in-process)            | `--addons dapr`                  |
|-----------------------|------------------------|----------------------------------|----------------------------------|
| Events                | `IEventPublisher`      | `InMemoryEventPublisher`         | `DaprEventPublisher`             |
| Caching               | `ICacheService`        | `InMemoryCacheService`           | `DaprCacheService`               |
| Email                 | `IEmailService`        | `InMemoryEmailService`           | `DaprEmailService`               |
| Storage               | `IStorageService`      | `LocalFileStorageService`        | `DaprStorageService`             |

Redis is intentionally **not** referenced for caching — with Dapr it is provided by the state store (`statestore.yaml`). This is how providers swap without changing application code.