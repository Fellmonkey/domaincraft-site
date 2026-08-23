---
title: "From Monolith to Axes and Layers: Why One Bridge Became a Stack"
description: "How the 71-template monolith gave birth to the idea of axes and layers, why the C# bridge was split into four independent repositories, and what it means for DomainCraft's future."
date: 2026-08-23
lang: en
---

*The story of one modernization: a 71-template monolith, the "one layer, one repository" idea, byte-identical output, and the math that turns N×M into N+M.*

It all started with an uncomfortable question: "What happens when there are a thousand bridges?"

DomainCraft is a compiler for domain models. One `domain.yaml`, many bridges — each bridge renders code for its own language and product layer. But at the start, the project had exactly one bridge — and it was a monolith.

## How it began: the `csharp-restful` monolith

The first bridge appeared when we were just starting out: C# + ASP.NET Core + EF Core + PostgreSQL + JWT. It was the only one, but inside it held **71 templates** that together emitted the entire project: from `Domain` to `WebApi`, entities to controllers, Dockerfile to tests. It did everything — as one indivisible mass.

The problems started the moment we wanted **more target stacks**. In that model, every new bridge required a full set of templates — even if it differed from the existing one by just a couple of layers. And every addition in one dimension (a new way to store data, a new transport) multiplied across all the others.

Do the math: 10 storage backends × 10 API transports = 100 bridges, each with 71 templates. That's 7,100 templates to maintain in parallel. It simply didn't scale.

## The idea of axes and layers

We realized: language is a vertical, but inside it there are horizontal levels that barely change from one combination to the next. Every C# stack starts with the same thin core — entities, enums, query schema, permissions. Above it sit the role layers: domain (services, ports), persistence (EF Core or Dapper), transport (REST, gRPC).

That's how **axes and layers** were born — one axis per independent product direction, with a stack of layers inside each axis. The full model is in the docs: [Axes and layers](https://domaincraft.github.io/domaincraft-site/docs/concepts/three-axes/).

```
C# backend:     core → domain → persistence → transport
web frontend:   ts-core → ts-client → react-rest
mobile:         dart-core → flutter-rest → flutter-offline (planned)
```

A layer is a small unit living in one repository. Not 71 templates — 4 to 10. Each repo owns only its layer and knows nothing about the rest.

The rule is simple: **one layer = one repository** — how that's declared is shown under *The mechanism* below. And the math falls into place: N persistence backends × M transport styles equals **N+M repositories**, not N×M. Ten ways to store × ten ways to serve = 22 repositories (thin core + domain + 10 + 10), not 100. Thirty × thirty = 900 combinations, but 62 repositories.

## The mechanism: `extends` and `--replace`

A bridge references another one via `extends`, and the core assembles the chain: the base renders first, the adapter is layered on top, and conflicts resolve in favor of the adapter. `type_mappings`, templates, and helpers are inherited across the whole chain.

The connection between layers is two lines in `bridge.yaml`:

```yaml
name: csharp-efcore
layer: persistence
extends: csharp-domain
```

Swapping one layer is a flag on the `generate` command (see the [CLI reference](https://domaincraft.github.io/domaincraft-site/docs/reference/cli/)):

```bash
domaincraft generate --bridge csharp-rest --replace persistence=csharp-dapper
# core + domain + dapper + rest
```

No forks. A new persistence backend or transport is a small separate repository, not a copy of the world.

## The modernization, in numbers and facts

We didn't do it blind: we built the new four-layer stack and compared its output against the monolith on two reference models — `compliance-suite/kitchen-sink.yaml` and `examples/domain.yaml`. The result: **byte-identical** — 187 files in kitchen-sink, 142 in example, zero differences. The `csharp-restful` monolith stays in history as an archive; new projects render through the four layers.

The frontend got the same treatment. The thin `ts-core` (types, query, permissions) is certified once; `ts-client` adds validation and the fetch client (Zod + JWT); `react-rest` is literally three templates of glue on TanStack Query. Details on each layer in the [bridges list](https://domaincraft.github.io/domaincraft-site/docs/reference/bridges/).

## What this changes for the future

- **New languages get in faster.** A thin core is a cheap foundation: a whole language line of backends and frontends grows from one small core, not from 71 templates.
- **Certification holds the line.** Each thin core has its own hand-written contract that cannot repeat the bridge's mistakes: the per-language TCK. More in the [certification guide](https://domaincraft.github.io/domaincraft-site/docs/guides/certification/).
- **The community gets a path in.** Contributing a layer (persistence, transport, framework) is 2–3 templates and a test run — not writing a stack from scratch.

What started as a single 71-template monolith has become an architecture that prepares DomainCraft not for two languages but for ten — and for any N×M combination inside them.

Try it today — four layers in one output:

```bash
domaincraft generate --domain domain.yaml --bridge csharp-rest
```