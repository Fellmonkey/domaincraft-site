---
title: Authentication
description: Configure JWT authentication — the auth block, the auth entity, roles and the login/register/me/setup endpoints.
section: guides
order: 1
updated: "2026-08-22"
---

Authentication is configured as a nested `auth:` block in `domain.yaml`:

```yaml
auth:
  type: jwt                    # required: jwt, none
  entity: User                 # optional: auto-detects entity with email+password fields
  roles: [Admin, Editor, User] # optional: validated against permission roles
  endpoints:                   # optional: all default to true
    login: true
    register: true
    me: true
    setup: true
```

## Endpoints

| Endpoint | Auth | Purpose |
|----------|------|---------|
| `POST /api/<auth>/login` | Anonymous | Email + password → JWT |
| `POST /api/<auth>/register` | Anonymous | Create a user with the **default role** — never Admin |
| `GET /api/<auth>/me` | Bearer token | Current user profile (password hash scrubbed) |
| `POST /api/<auth>/setup` | Anonymous | Bootstrap the **first user** with the `Admin` role (or the first declared role) — succeeds only while no user exists yet, then permanently `409 Setup already complete` |

### The `/setup` endpoint

`setup` is the safe production bootstrap path. Because `register` is anonymous, it must never silently escalate a caller to Admin — new users always get the schema default role. To create your first administrator, call `/setup` while the database is empty:

```bash
curl -X POST http://localhost:9000/api/user/setup \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"YourPass123!"}'
# 201 Created
```

The generated user is assigned the `Admin` role — or the first role declared in `auth.roles` if `Admin` isn't listed. The port above is the Docker `project.deploy.port`; under local `dotnet run` use the `ASPNETCORE_URLS` port instead.

The endpoint is `[AllowAnonymous]` but only works until the first account exists; afterwards it returns `409` and is effectively disabled, so it is safe to ship enabled. It is also what the DomainCraft compliance suite uses to seed its test admin.

## Validation rules

- `auth.type` must be `jwt` or `none`.
- `auth.entity` must reference an existing entity.
- The auth entity must have `email` and `password` fields.
- `auth.roles` values must be valid identifiers.
- Permission roles (except the reserved `*` and `@` tokens) must be declared in `auth.roles`.
- `when: hasAuth` in a bridge manifest enables templates only when auth is enabled.

## What gets generated

With `type: jwt` the C# bridge generates:

- JWT middleware and an auth controller (login / register / me / setup).
- A password hasher (bcrypt) and its interface.
- Role claims wired into the permission policies.
- `IPasswordHasher` / `I<AuthEntity>Service` and their implementations registered in DI.

If `auth.type: none`, none of this is generated.

## Roles and permissions

Roles declared in `auth.roles` are the only roles you can reference in entity `permissions` blocks:

```yaml
auth:
  roles: [Admin, Editor, User]

entities:
  Post:
    permissions:
      create: [Editor, Admin]
      update: ["@Owner", Admin]
```

Role names are validated against the permission cross-checks during `validate`.

## Planned

- `auth.type: cookie` — HTTP-only cookie auth instead of bearer tokens.
- `auth.type: oauth2` — OAuth2 providers (Google, GitHub, ...).

Both are described in the spec but not yet implemented.