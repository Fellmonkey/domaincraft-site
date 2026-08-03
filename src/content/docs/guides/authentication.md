---
title: Authentication
description: Configure JWT authentication — the auth block, the auth entity, roles and the login/register/me endpoints.
section: guides
order: 1
updated: "2026-08-03"
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
```

## Validation rules

- `auth.type` must be `jwt` or `none`.
- `auth.entity` must reference an existing entity.
- The auth entity must have `email` and `password` fields.
- `auth.roles` values must be valid identifiers.
- Permission roles (except the reserved `*` and `@` tokens) must be declared in `auth.roles`.
- `when: hasAuth` in a bridge manifest enables templates only when auth is enabled.

## What gets generated

With `type: jwt` the C# bridge generates:

- JWT middleware and an auth controller (login / register / me).
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