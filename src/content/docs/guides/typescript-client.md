---
title: The TypeScript client
description: Generate a certified typed data layer and React glue — ts-core and react-rest, query DSL, TanStack Query hooks, JWT auth.
section: guides
order: 5
updated: "2026-08-23"
---

DomainCraft does not stop at the backend. `ts-core` compiles the same `domain.yaml` into the shared TypeScript language contract — types, a typed query DSL and the permission matrix. On top of it `ts-client` adds Zod schemas, a JWT fetch client and per-entity CRUD, and the `react-rest` adapter (`extends: ts-client`) adds TanStack Query hooks, auth hooks and a project scaffold. Since every layer is compiled from the same IR as the API, the client cannot drift from the server: rename a field in the model and both sides change in one run.

## Generate

```bash
# React app (composes ts-core → ts-client automatically)
domaincraft generate --domain domain.yaml --bridge react-rest --output frontend

# Data layer without React (ts-core types/query/permissions + ts-client Zod/fetch/CRUD)
domaincraft generate --domain domain.yaml --bridge ts-client --output frontend

# Language core only (types, query DSL, permission matrix)
domaincraft generate --domain domain.yaml --bridge ts-core --output frontend
```

```
frontend/
├─ src/generated/          # regenerated on every run — never edit
│  ├─ types.ts             # read DTOs, wire-value enums, ListResult        (ts-core)
│  ├─ query.ts             # typed filter/sort/search/include DSL           (ts-core)
│  ├─ permissions.ts       # ROLES matrix + can()                           (ts-core)
│  ├─ schemas.ts           # Zod create/update/patch schemas                (ts-client)
│  ├─ client.ts            # fetch wrapper: JWT, 429 retry/backoff, ApiError (ts-client)
│  ├─ api.ts               # per-entity CRUD functions + route constants   (ts-client)
│  ├─ hooks.ts             # TanStack Query hooks                          (react-rest)
│  └─ auth.ts              # login/register/setup/me + useLogout/useCan    (react-rest)
├─ src/index.ts            # barrel — your app imports everything from here
└─ package.json, tsconfig.json
```

Your code lives next to it (`src/App.tsx`, `src/pages/…`) and imports exclusively from `./index`. The scaffold files regenerate on every run — edits and added dependencies are overwritten.

## Read projections

Each entity gets three shapes derived from one field surface:

| Type | `[many]` relations | Use |
|------|--------------------|-----|
| `OrderListItem` | optional (`undefined` unless included) | list rows |
| `OrderWith<"items">` | named ones required | narrowing a list row |
| `OrderDetail` (= `Order`) | all required | get-by-id |

`hidden` and password fields do not exist on read types at compile time. To-one relations expose only their FK id.

## Typed queries — invalid filters fail at build time

```ts
const orders = await listOrders({
  filter: {
    totalAmount: { gte: 100, lt: 500 },
    status: { in: ["pending", "shipped"] },   // wire enum values only
    "user.firstName": { contains: "Ana" },     // one-hop relation path
    json:  { "shippingAddress.city": { eq: "Berlin" } }, // plain json column: text ops only
    jsonb: { "metadata.score": { gte: 10 } },             // jsonb column: numeric ops allowed
  },
  search: "widget",                 // free text over orderSearchableKeys
  sort: ["-totalAmount"],
  include: ["items"],               // restricts which [many] collections load
  page: 1, pageSize: 20,
});
```

Every key and operator is type-checked against the model: `contains` on a number or an unknown field is a compile error, not a runtime 400. The full wire grammar (`path`/`op`/`value`, `json` vs `jsonb` operator sets, `search`) is in the [Query language](../../reference/query/) reference. Keyset pagination (`cursor`) is available for entities whose primary key is `int`/`bigint`. `PAGINATION.defaultPageSize/maxPageSize` expose the model's list limits for UI controls.

## Mutations with optimistic updates

```tsx
const update = useUpdateOrder(orderId);        // optimistic by default, rolls back on error
update.mutateAsync({ totalAmount: 42, version: currentVersion });
const del = useDeleteOrder();                  // row vanishes optimistically, returns on failure
const create = useCreateOrder();               // NOT optimistic (server assigns the id)
```

Mutations invalidate their own caches **and** any cached parent lists that embed the entity via `include` — mutate an `OrderItem` and `"orders"` lists refresh automatically.

## One error shape for forms

Client-side Zod and server-side validation flatten to the same map, so one helper renders both:

```ts
import { zodFieldErrors } from "./index";      // client: ZodError -> Record<field, message>
import { applyFieldErrors } from "./index";    // React setter wiring
// server: err.isValidationError() && err.fieldErrors()
```

Other branches on `ApiError`: `isConflict()` (any 409), `isConcurrencyConflict()` (optimistic-lock specifically), `isRateLimited()` (429 already retried with backoff honoring `Retry-After`; `retryAfterSeconds` survives on the final error).

## Auth flow

```tsx
setup(input);        // one-shot first-admin bootstrap; 409 afterwards
useLogin();          // stores the JWT for you
useMe();             // profile; a stale token self-clears on 401
useLogout();         // drops the token AND the whole query cache
const can = useCan();
can("Order", "delete"); // permission matrix hint — the server remains authoritative
```

Endpoints follow `auth.endpoints` in the model — disable `register` and the generated client has no `register()` function, because routes come from the same endpoint contract as the API.

## Certification

The shared contract is enforced by a dedicated TypeScript TCK — static `@ts-expect-error` assertions plus runtime tests. See **Bridge Certification** in this section for how it works and how to run it.
