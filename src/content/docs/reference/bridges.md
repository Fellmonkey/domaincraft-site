---
title: Bridges registry
description: Known bridges, their capabilities, resolution order and how the admin panel generation works.
section: reference
order: 3
updated: "2026-08-03"
---

Bridges are how DomainCraft targets a language or framework. The registry is hardcoded in the core and clones bridges on demand into `~/.domaincraft/bridges/`.

## Registered bridges

| ID | Language | Description |
|----|----------|-------------|
| `csharp-restful` | C# | ASP.NET Core + EF Core + PostgreSQL + JWT + Clean Architecture |
| `admin-alpine` | HTML | Admin panel with Alpine.js + 0build UIkit |

## Bridge directories

- `DomainCraftCsharp` — the `csharp-restful` bridge (templates only, no Go code).
- `DomainCraftAdmin` — the `admin-alpine` admin panel bridge (Alpine.js + 0build UIkit) with list/form/login/register pages.

## Generate with a bridge

```bash
# By registry ID
domaincraft generate --domain domain.yaml --bridge csharp-restful

# By local path
domaincraft generate --domain domain.yaml --bridge ../DomainCraftCsharp

# By GitHub shorthand
domaincraft generate --domain domain.yaml --bridge DomainCraft/domaincraft-bridge-csharp

# With an admin panel (default admin-alpine)
domaincraft generate --domain domain.yaml --bridge csharp-restful --admin
```

`--admin` is only valid on `generate`; it accepts an optional bridge ID for the admin panel, defaulting to `admin-alpine`.

## Adding a bridge

Append an entry to `DefaultRegistry` in `internal/bridge/registry.go`:

```go
{
  ID:          "csharp-restful",
  Name:        "C# REST API",
  Description: "ASP.NET Core + EF Core + PostgreSQL + JWT + Clean Architecture",
  Language:    "C#",
  GitHub:      "DomainCraft/domaincraft-bridge-csharp",
},
```

See the *Writing a bridge* guide for the manifest format.