---
title: Quick start
description: Install DomainCraft, define your domain in domain.yaml and generate a production-ready backend in minutes.
section: getting-started
order: 1
updated: "2026-08-03"
---

DomainCraft turns a single `domain.yaml` file into fully working source code for a target language and framework. This quick start takes you from zero to a running C# REST API in four steps.

## 1. Install the CLI

No Go toolchain required. Download the prebuilt binary for your platform from GitHub Releases:

[Download from GitHub Releases](https://github.com/DomainCraft/DomainCraft/releases)

> Alternatively, if Go is already installed on your machine:
>
> ```bash
> go install github.com/DomainCraft/DomainCraft/cmd/domaincraft@latest
> ```

## 2. Create a project

The interactive wizard scaffolds a starter project and a `domain.yaml` for you:

```bash
domaincraft new
```

It asks for the project name, bridge, database, auth and API style. Use `--non-interactive` for CI and pass the answers as flags:

```bash
domaincraft new --non-interactive --name MyShop --bridge csharp-restful --database postgresql --auth jwt
```

## 3. Define your domain

Edit `domain.yaml`. This is all you write — the generator produces everything else:

```yaml
project:
  name: MyShop
  database: postgresql

auth:
  type: jwt
  entity: User

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

Validate it at any time:

```bash
domaincraft validate --domain domain.yaml
```

## 4. Generate & run

```bash
domaincraft generate --domain domain.yaml --bridge csharp-restful
cd generated
dotnet run --project src/WebApi
```

You now have a complete, compilable backend — entities, repositories, controllers, auth, migrations, Docker and Kubernetes manifests. The next guide walks through a fuller example with relations and features.
