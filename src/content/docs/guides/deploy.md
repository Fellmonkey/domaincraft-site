---
title: Deploying the generated API
description: Docker Compose, schema modes, health checks and Kubernetes — how the generated C# API is deployed and what each piece does.
section: guides
order: 8
updated: "2026-08-23"
---

The `csharp-rest` bridge ships everything needed to run the API beyond `dotnet run`: a `docker-compose.yml` (PostgreSQL + API), a multi-stage `Dockerfile`, Kubernetes manifests under `k8s/`, health-check endpoints and environment-driven database initialization. Everything below is generated from your `domain.yaml` — the port and host come from `project.deploy`:

```yaml
project:
  deploy:
    domain: localhost
    port: 9000
```

## Local dev run

```bash
cd generated
dotnet run --project src/WebApi
```

Swagger is available at `/swagger` in the Development environment; the API listens on the port from `ASPNETCORE_URLS`.

## Docker Compose

```bash
docker compose up -d --build
```

The generated `docker-compose.yml` starts two services:

| Service | Image | Notes |
|---|---|---|
| `postgres` | `postgres:16-alpine` | Named volume `postgres_data`; healthcheck via `pg_isready` |
| `api` | built from the generated `Dockerfile` | `.NET 10` multi-stage build → `aspnet:10.0-alpine` runtime; `EXPOSE` and `ASPNETCORE_URLS` use `project.deploy.port` |

`api` starts only after Postgres reports healthy and restarts unless stopped. The compose file ships **dev-only credentials and a dev JWT secret**; override both before exposing the stack anywhere non-local (item 1 in the checklist below).

```bash
POSTGRES_PASSWORD=... Jwt__Secret=... docker compose up -d --build
```

## Schema mode (`Database:SchemaMode`)

`appsettings.json` generates with one explicit schema strategy; the API applies it at startup (`InitializeWebApiDatabaseAsync`):

- **`ensureCreated`** (default) — creates the schema directly. Fast for dev, but it does **not** create the `__EFMigrationsHistory` table, so it is incompatible with the `--migrate` workflow.
- **`migrate`** — applies pending EF Core migrations (`MigrateAsync`), creating the migrations history. Choose this once you manage schema via migrations.

Never mix the two against the same database. If schema initialization fails, the API logs and continues — a database that is down does not brick the container; health checks surface the problem instead. Seed data runs at startup whenever the domain declares `seed` (idempotent, skips existing rows).

In the `Testing` environment schema initialization is skipped entirely — the compliance suite manages its own database.

## Migrations

Schema changes reach the database one of two ways:

- `domaincraft generate --prune` — after cleaning up orphans, runs the bridge's migration commands automatically when the diff detected schema changes (best-effort, non-fatal; the API then applies them at startup via `SchemaMode=migrate`).
- `domaincraft generate --migrate` — runs `dotnet ef migrations add` + `database update` against the real database.

`old_name` renames ship as exact `RenameTable`/`RenameColumn` statements so your rows survive — see the [Migrations guide](../migrations/).

## Health checks

| Endpoint | What it reports |
|---|---|
| `/health` | All registered checks (JSON detail via a custom response writer: status, per-check status/duration/description) |
| `/health/ready` | Only `ready`-tagged checks — readiness probe |
| `/health/live` | No checks — liveness probe (process is up) |

The Dockerfile's `HEALTHCHECK` probes `/health`; the k8s manifests use live/ready separately.

## Kubernetes

`k8s/` contains a `Deployment` (3 replicas), a `Service` and an `Ingress`, all mapped to `project.deploy.port`. Credentials come from a Secret — create it before applying:

```bash
kubectl create secret generic <project>-secrets \
  --from-literal=postgres-connection="Host=...;Database=...;Username=...;Password=..."
# plus --from-literal=jwt-secret=... when auth is enabled
kubectl apply -f k8s/
```

Liveness probes `/health/live`, readiness probes `/health/ready`, with resource requests/limits.

## Production checklist

1. Replace dev credentials and the JWT secret — `Jwt__Secret` must be at least 32 characters, enforced at startup.
2. Set `ASPNETCORE_ENVIRONMENT=Production` (the Dockerfile does; HSTS and strict security headers switch on in Production).
3. Declare `project.cors.origins` if the API is called from a browser — the generated `Cors` section in `appsettings.json` only exists when origins are configured.
4. Pick `Database:SchemaMode=migrate` once you manage the schema via migrations.
5. With the `observability` addon, Compose also starts **Seq** (log sink, UI `:5341`) and **Jaeger** (traces, UI `:16686`) — see the [infrastructure addons](/docs/guides/infrastructure-addons/) guide.
6. With the `dapr` addon, a Dapr sidecar container joins the stack and the API runs a Hangfire dashboard with a daily seed/health job.

The `admin-alpine` panel adds a third Compose service (`admin` on port 3000) via `docker-compose.override.yml` — see the [Admin panel](/docs/guides/admin-panel/) guide.