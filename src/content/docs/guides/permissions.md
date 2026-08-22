---
title: Permissions (RBAC + ABAC)
description: Row-level security via permissions blocks — global roles, public access and the @Owner token.
section: guides
order: 3
updated: "2026-08-03"
---

The `permissions` block declares fine-grained access for each entity. It is one of the biggest time-savers in the tool — the generator emits the policy checks for you.

```yaml
  Document:
    permissions:
      read: [Admin, "@Owner"]
      create: [User, Admin]
      update: ["@Owner"]
      delete: [Admin]
```

Each of `read`, `create`, `update`, `delete` is a list of directives:

- **Public access** — `read: [*]`. Marks the endpoint public; no auth required.
- **RBAC (global roles)** — a role name such as `Admin` or `Manager`. Generates a role-claim check in the token.
- **ABAC owner** — `update: ["@Owner"]`. The core looks up the relation between the entity and the users table (e.g. `userId`, `authorId`) and generates: "only the user whose ID matches the foreign key in this row may edit it."

> **`@Tenant`** (row isolation per organization) is **in the spec but not implemented** — the core validates any `@...` token as an ownership-style token, but no bridge interprets it yet. Do not rely on it for generated code.

## Rules

- Roles (other than the reserved `*` and `@` tokens) must be declared in `auth.roles`.
- Unknown permission keys are a parse error — custom conditions such as `condition(...)` are **not** implemented and must not be used.
- The C# bridges always generate `IPermissionService` / `PermissionService` and `IOwnerResolver` / `OwnerResolver`, and register one authorization policy per entity operation (`Policy = "<Entity><Op>"`).