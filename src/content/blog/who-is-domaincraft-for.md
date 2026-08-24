---
title: "Who Is DomainCraft For"
description: "An honest breakdown of what DomainCraft is, how it differs from Firebase, PocketBase, JHipster and Retool — and who actually needs it, who doesn't."
date: 2026-08-10
lang: en
tags: [product]
---

*An honest breakdown of what DomainCraft is, how it differs from Firebase, PocketBase, JHipster and Retool — and who actually needs it, who doesn't.*

If you're hearing about DomainCraft for the first time, one of three thoughts has probably crossed your mind: "Is it a site builder?", "Is it a cloud backend like Firebase?", "Is it yet another stub generator?"

All three are wrong — and that's no coincidence. To understand who DomainCraft is for, you first need to understand what it does and, more importantly, what it doesn't do.

## What DomainCraft is, in plain words

DomainCraft is a **code generator**. Not a builder, not a platform, not a cloud service. It's a tool that turns a description of your application into its source code.

Here's how it works. You describe your model in a single text file, `domain.yaml`:

```yaml
project:
  name: MyShop

auth:
  type: jwt
  roles: [Admin, User]

entities:
  Product:
    features: [audit, soft_delete]
    fields:
      id: uuid [primary]
      title: string [required, min:3, max:200]
      price: decimal [required, gte:0]
      categoryId: relation(Category) [optional, on_delete:set_null]
    permissions:
      read: ["*"]
      create: [Admin]
      update: ["@Owner", Admin]
      delete: [Admin]
```

Then you run a single command:

```bash
domaincraft generate
```

And you get a **complete source-code project**: the data model and database migrations, a REST API, JWT authentication, permission checks, Docker configuration, tests. Today that's a C#/ASP.NET Core backend with PostgreSQL plus a typed TypeScript client (React hooks included). The core isn't tied to any language: other languages plug in as "bridges" — template packages written without touching the core.

The key word here is **source code**. You can read it, compile it, run it on your own infrastructure, hand it to a client, and keep developing it by hand even if DomainCraft disappears tomorrow. The generator doesn't own your project — it creates it and steps away.

## To have something to compare with: a map of alternatives

Before answering "who is it for", it's worth laying out the neighbors. Every tool DomainCraft gets compared to falls into one of four categories.

### 1. BaaS — a ready-made backend as a service (Firebase, Supabase, PocketBase)

These are backends "out of the box": database, API, and authentication already work, and all you do is connect a frontend.

- **Firebase** — Google's cloud service. Fast to start, ready-made SDKs for mobile apps. But it's proprietary NoSQL with full vendor lock-in — you can't move the backend to another host without rewriting it. Costs grow with the number of read/write operations.
- **Supabase** — an open-source BaaS on PostgreSQL. It fixes Firebase's main gripes: real SQL, a true relational engine, and self-hosting is available. But self-hosting means manually maintaining a stack of a dozen Docker containers, and some cloud features are proprietary.
- **PocketBase** — a single binary that bundles SQLite, a REST API, authentication, and an admin UI. Run it — and the API is ready in a minute. Limitations: SQLite only, vertical scaling only, and custom logic goes through Go/JS hooks.

What all three have in common: **you don't own the backend code**. It lives in the cloud or inside a binary. For complex business logic, you have to build on top of someone else's ecosystem.

### 2. Low-code platforms (Retool, Appsmith, Budibase)

Tools for quickly assembling internal admin panels and dashboards on top of existing databases. You drag and drop widgets, connect tables, write a bit of JavaScript.

These aren't backend generators: they produce an **interface**, not server code. The logic runs inside the platform's runtime. Retool is proprietary and expensive SaaS; Appsmith and Budibase have open-source versions. They're good when you need an admin panel in an evening and don't need your own backend.

### 3. Other code generators (JHipster, Amplication)

These are the closest relatives: they also produce source code.

- **JHipster** — a full-stack generator for Java/Spring Boot (frontend on Angular/React/Vue). Its strength is an enterprise-grade scaffold with tests. Its weakness: it generates a lot of code and libraries that are hard to audit and painful to upgrade after heavy customization.
- **Amplication** — a backend generator for Node.js (NestJS + Prisma) and .NET. Actively developed, with an open-source version. The code follows the platform's strict patterns, which are hard to deviate from — the plugin ecosystem dictates the architecture.

### 4. Scaffolding templates and contract generators (`dotnet new webapi`, OpenAPI Generator)

- Scaffolding templates (`dotnet new`, `create-react-app`) create an **empty project structure**: an entry point, build configuration — that's it. Business logic, tables, and endpoints are written from scratch.
- OpenAPI Generator takes a finished API spec and produces client SDKs or server stubs. That's a contract-first approach: you design the API first, then get the code. If the spec changes, regeneration can overwrite manual edits.

## Where DomainCraft fits in this picture

DomainCraft differs from all four categories in three ways.

**First — the starting point is the domain, not the API.** You describe business entities, not endpoints: their fields, relations, rules, and permissions. The API, migrations, and authentication are derived from that model automatically. BaaS has no source code at all; contract generators have no domain — only an interface spec.

**Second — model and language are separated.** The same `domain.yaml` can be handed to different bridges to produce C#, Java, or TypeScript code. BaaS locks you into its ecosystem, JHipster locks you into Java, Amplication into NestJS/.NET. Here, a bridge is just a package of templates, and the core knows no languages at all.

**Third — day-2 safety.** This is the pain point of any code generation: "what happens if I regenerate after writing my own logic?" In DomainCraft, generated files and your files never mix: yours are marked "scaffold-once" and are never overwritten, while generated ones update freely. The migration engine remembers the model's history: rename an entity or a field, and the database tables follow — data is preserved.

## Who DomainCraft is actually for

### Backend developers tired of writing the same thing

If you've built a CRUD application ten times in your career — repositories, DTOs, controllers, migrations, wiring up authentication — you are the target audience. This is not a tool for people who don't want to write code, but for people who want to stop writing *identical* code. Your effort goes into the model and business logic, not the scaffolding.

### Teams that care about code ownership and no lock-in

If your project needs to live for ten years and the stack decision might change, what matters is that the generated code belongs to you. There's no platform you depend on: there's a repository with source code you fully control. If DomainCraft vanished tomorrow, you'd simply keep writing C# by hand.

### Custom development and outsourcing

The client wants clean source code their team can maintain without you. A generated project is an ordinary ASP.NET Core app with an ordinary architecture: no "traces" of the generator in it. Handing that over is more honest than tying the client to a BaaS or a low-code platform.

### Teams that want a single source of truth for the model

Permissions, validation, relations, and seed data are described in one file, next to the entities. It reads well, diffs well in code review, and doesn't sprawl across the codebase. For projects where the model is the main asset — SaaS, marketplaces, internal systems — this makes a real difference.

### Developers working with AI agents

A separate scenario: an agent describes the domain in `domain.yaml`, the generator emits 40+ files of production code, the agent fills in business logic in hooks — and everything runs. For AI-assisted development this beats letting the agent write CRUD from scratch: a deterministic generator doesn't hallucinate the same boilerplate twice.

## Who DomainCraft is NOT for

An honest answer to "who is it for" is impossible without the flip side.

**You don't need DomainCraft if** you're building an MVP and want an API in one minute without compiling anything — PocketBase or Supabase are faster. If you're a frontend developer who doesn't want to know how the backend works at all — a BaaS removes that question. If you only need an admin panel on top of an existing database — Appsmith or Retool will solve it in an evening.

**You don't need DomainCraft yet if** you work outside C#/.NET and TypeScript: the shipped bridges are the C# backend (`csharp-rest`) and the TypeScript frontend family (`ts-core` → `ts-client` → `react-rest`); Go, Java and Python are planned. The ecosystem is growing, and that's worth factoring into your choice.

**You don't need DomainCraft if** you're not comfortable with YAML and compiling a generated project. It's a tool for developers: it removes the drudgery, but it doesn't remove the need to understand your stack.

## The bottom line

DomainCraft is a developer's helper tool, not an end product. It doesn't replace BaaS, low-code, or contract generators — it occupies its own niche: **generating owned source code from a domain model**.

If your goal is "spin up an API fast and forget about the backend", there are simpler tools. If you write backends for a living, you're tired of the same boilerplate, and you want the model to be the single source of truth — give it a try. One file, one command, and in ten minutes you have a compilable project that is entirely yours.
