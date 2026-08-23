---
title: Admin panel
description: Generate a static, self-hostable admin UI for any REST API — vanilla HTML + Alpine.js, no Node tooling, no build step.
section: guides
order: 7
updated: "2026-08-23"
---

DomainCraft ships one generated UI: a static admin panel built with [Alpine.js](https://alpinejs.dev/) and [0build UIkit](https://0build.dev/). Drop in the same `domain.yaml`, and out come dashboard, per-entity list and form pages that talk to the generated REST API. No Node tooling, no build step — a browser and any static server is all it needs.

While real screens are built by agents or humans against the typed client (presentation is **not** a bridge axis), the admin panel covers the generic case: CRUD over every entity, with auth and relations handled for you.

## Generating

```bash
# backend + admin in one run (--admin defaults to the admin-alpine bridge)
domaincraft generate --domain domain.yaml --bridge csharp-rest --admin

# or point --admin at a specific bridge (id, path or owner/repo)
domaincraft generate --domain domain.yaml --bridge csharp-rest --admin ../domaincraft-bridge-admin
```

## What gets generated

The panel is written to `<output>/admin/`. One file set per entity, plus project pages:

| File | Purpose |
|---|---|
| `admin/index.html` | Dashboard — API health checks, entity quick-links, signed-in user |
| `admin/<entity>.html` | Per-entity list: table, CSV export, bulk & single delete, row view |
| `admin/<entity>-form.html` | Per-entity create/edit form |
| `admin/login.html` / `admin/register.html` | Auth pages — only when the project declares `auth` |
| `docker-compose.override.yml` | Serves `./admin` at port 3000 next to the API (stays at the output **root**, so Docker picks it up beside the backend's `docker-compose.yml`) |

Login and register pages are generated only when `auth` is enabled; the rest of the panel stores the JWT in `localStorage` and redirects to `login.html` on 401.

## Running it

Any static server works — serve the `admin/` directory:

```bash
cd output/admin && python -m http.server 3000
```

Or use the bundled Docker override next to the backend stack:

```bash
docker compose up admin   # http://localhost:3000
```

By default the panel calls the API at `http://<project.deploy.domain>:<project.deploy.port>/api`. To point it at any other served backend, set a global before it loads:

```html
<script>window.API_BASE_URL = 'https://api.example.com/api';</script>
```

## Capabilities

- **Full CRUD per entity** — list, create, view, edit, delete against the generated REST API.
- **Relation-aware forms** — many-to-one fields render as dropdowns populated from the related entity.
- **Type-aware inputs** — booleans → toggles, `array(...)` → comma textareas, `json`/`jsonb` → validated JSON textareas, `datetime` → date-time picker.
- **Validations reflected in the UI** — `required`, `email`, `url`, `min`/`max`, `gte`/`gt`/`lt`/`lte`, `regex` become HTML5 attributes and hints.
- **Enums** — enum fields render as native selects from the project's enum definitions.
- **CSV export** and **bulk delete** on every list page.
- **Dark mode** — persisted light/dark toggle.

## The contract it talks to

The panel is bridge-agnostic: it talks to the conventional REST shape any backend bridge produces:

```
GET    /api/{entity}        list
POST   /api/{entity}        create
GET    /api/{entity}/{id}   read
PUT    /api/{entity}/{id}   update
DELETE /api/{entity}/{id}   delete
POST   /api/{authEntity}/login
POST   /api/{authEntity}/register
```

Whatever backend the REST contract came from (C#, future Go/Java/Python, …) — the same `admin/` folder works.