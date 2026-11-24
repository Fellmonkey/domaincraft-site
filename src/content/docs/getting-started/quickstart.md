---
title: Quick start
description: Install DomainCraft, define your domain in domain.yaml and generate production-ready code in minutes.
section: getting-started
order: 1
updated: "2026-08-23"
---

DomainCraft compiles one `domain.yaml` into every layer of your product. The same model produces the API, its typed clients and the admin panel. There's no boilerplate to keep in sync and no drift between layers.

## 1. Install the CLI

Prebuilt binary (no Go required):

[Download from GitHub Releases](https://github.com/DomainCraft/DomainCraft/releases)

```bash
go install github.com/DomainCraft/DomainCraft/cmd/domaincraft@latest
```

## 2. Create a project

By hand or in the visual editor ([Studio](https://fellmonkey.github.io/domaincraft-studio/)):

```yaml
project:
  name: MyShop
  version: 1.0.0
database: postgresql
auth:
  type: jwt
api_style: rest
entities:
  User:
    fields:
      id: uuid [primary]
      email: string [required, unique, email]
      name: string [required]
      password: string [required, hidden]
```

## 3. Define your domain

The compiler derives the rest:

```yaml
entities:
  Product:
    features: [audit, soft_delete]
    fields:
      id: uuid [primary]
      title: string [required, min:3, max:200]
      price: decimal [required, gte:0]
    permissions:
      read: ["*"]
      create: [Admin]
      update: ["@Owner", Admin]
```

```bash
domaincraft validate --domain domain.yaml
```

## 4. Generate your backend

```bash
# C# API — core → domain → efcore → rest
domaincraft generate --domain domain.yaml --bridge csharp-rest
cd generated && dotnet run --project src/WebApi
```

Want a different database without copying 71 templates? Swap one layer:

```bash
domaincraft generate --domain domain.yaml --bridge csharp-rest --replace persistence=../my-dapper
```

The same model also builds a typed frontend:

```bash
domaincraft generate --domain domain.yaml --bridge ts-core
domaincraft generate --domain domain.yaml --bridge react-rest   # ts-core + TanStack Query
```

Why this matters: types, validation, `path:op:value` queries, enum wire values, errors and permissions are all compiled from the same IR. Rename a field in `domain.yaml` and the API, the client and the admin panel update together — in one run.

Next: [First project](../first-project/) (relations + features), then the [TypeScript client](../../guides/typescript-client/).
