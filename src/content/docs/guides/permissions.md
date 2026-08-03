---
title: Permissions (RBAC + ABAC)
description: Row-level security via permissions blocks — global roles, public access, owner and tenant tokens.
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
- **ABAC tenant** — `read: ["@Tenant"]`. Data isolation for SaaS: a user sees only rows of their organization. `@Tenant` is part of the spec; the GUI currently does not expose it in the permission matrix quick-add roles.

## Rules

- Roles (other than the reserved `*` and `@` tokens) must be declared in `auth.roles`.
- Unknown permission keys are a parse error — custom conditions such as `condition(...)` are **not** implemented and must not be used.
- The bridge emits `PermissionPolicies.cs`, `IPermissionService` / `PermissionService` and the `OwnerResolver` when `when: hasPermissions` / `hasOwnerTokens` match.