---
title: Query language
description: The path:op:value filter grammar, sorting, pagination and relation expansion — one query protocol that every bridge compiles into its own query layer.
section: reference
order: 5
updated: "2026-08-23"
---

The core defines **one** list-query grammar — search, sort, filter and pagination — that every bridge serializes into its own query layer (LINQ, Prisma `where`, Mongo `$match`, Appwrite `Query.*`, SQL `WHERE`). The core compiles the *schema* the bridge validates against (`FilterablePaths()`, `SortableFields()`, `SearchableFields()` in the IR, plus the pagination policy); the bridge parses and validates the query strings at runtime. This page is the contract both sides implement.

## Filter

A filter expression selects a subset of rows:

```
filter := or
or     := and ( "|" and )*            # "|" = OR (lowest precedence)
and    := term ( "," term )*          # "," = AND
term   := path ":" op ":" value
path   := segment ( "." segment )*    # relation hops / JSON key path
op     := "eq" | "ne" | "gt" | "gte" | "lt" | "lte"
        | "contains" | "startsWith" | "endsWith" | "in"
value  := bare | "(" bare ( "," bare )* ")"   # list form is only for `in`
```

- **`path`** is a dotted, case-insensitive field reference (camelCase, like the JSON wire contract). It can be
  - a scalar field: `price`,
  - one to-one relation hop plus a scalar field on the target: `category.name`,
  - a JSON field plus one or more object keys: `meta.price`, `meta.a.b`.
- **`value`** is a bare literal and must not contain `:`, `,`, `|`, `(` or `)`. Free text containing those characters belongs in the `search` parameter instead (see below).
- **`in`** takes a parenthesized, comma-separated list: `status:in:(Active,Pending)`.

### Operators per type

| Field type | Operators |
|---|---|
| string, text | `eq`, `ne`, `contains`, `startsWith`, `endsWith`, `in` |
| boolean | `eq`, `ne` |
| int, bigint, float, decimal, date, datetime | `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in` |
| uuid, enum | `eq`, `ne`, `in` |
| JSON path on `jsonb` | `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `contains`, `startsWith`, `endsWith` |
| JSON path on `json` | `eq`, `ne`, `in`, `contains`, `startsWith`, `endsWith` |

A relation path (`category.name`) inherits the operator set of the leaf field on the target entity. Hidden fields are never searchable, sortable or filterable.

> **`json` vs `jsonb`.** Ordered operators (`gt`/`gte`/`lt`/`lte`) on a JSON leaf carry **numeric** semantics — the bridge casts the extracted value (`(meta->>'price')::numeric`). They are only valid on `jsonb` columns; `json` is an opaque, untyped document, so it accepts text-semantics operators only. Use `jsonb` when you need ordered filtering on a JSON path.

### Relation paths

A dotted path may cross **one** to-one relation and end on a filterable scalar of the target:

```
filter=category.name:eq:Books            # Product → Category.name
filter=supplier.firstName:contains:Ana  # Product → User.firstName
```

- The relation segment matches either the FK field (`categoryId`) or the navigation name (`category`).
- Only **to-one** relations are filterable. Collection (`many`) relations are rejected — the any-vs-all semantics are ambiguous.
- Nesting is limited to one hop; deep chains (`a.b.c`) and self-referential cycles are rejected.

### JSON paths

```
filter=meta.price:gte:100     # (meta->>'price')::numeric >= 100
filter=meta.name:eq:Widget     # meta->>'name' = 'Widget'
filter=meta.a.b:contains:xy    # meta#>>'{a,b}'  LIKE '%xy%'
```

A JSON leaf's value type is dynamic, so the core cannot coerce it statically — values keep their string form, and the operator set from the table above applies to the extracted text: equality/string operators compare as text, ordered operators cast to number (jsonb only).

### Examples

```
filter=price:gte:100                        # price >= 100
filter=status:eq:Active                     # exact match (enums by wire value)
filter=name:contains:widget                 # substring
filter=sku:in:(SKU-1,SKU-2)                 # set membership
filter=price:gte:100,price:lt:500           # AND (comma)
filter=status:eq:Active|status:eq:Archived  # OR (pipe)
filter=category.name:eq:Books               # relation hop
filter=meta.price:gte:100                   # JSON key path
```

## Search

`search` is not a filter: it is a case-insensitive substring match across the entity's `SearchableFields()` (string/text columns). It is expressed in the same AST as `Or(Contains(f1, q), Contains(f2, q), …)` and AND-ed with any `filter`, so bridges have a single serialization path for both:

```
?search=widget&filter=price:gte:100
```

## Sort

```
sort=price            # ascending
sort=-price,name      # price descending, then name ascending
```

- A key is `[ "-" | "+" ] field` — `+`/bare ascending, `-` descending; fields come from `SortableFields()`, matched case-insensitively.
- The primary key, relations, enums, arrays, JSON blobs, hidden and feature fields are **not** sortable (the PK is the implicit default order).
- An unknown or unsortable key must be rejected with the bridge's client-error convention (HTTP 400 for HTTP bridges) — never silently ignored.

## Pagination

List endpoints accept two paging modes plus sizing controls:

**Offset (default):** `page` + `pageSize` (`limit` is an alias; when both are given, `limit` wins). The effective page size is clamped to `1 .. MaxPageSize` (`project.pagination.max_page_size`), `page` to `>= 1`. Supports `sort`.

**Keyset (cursor):** `cursor` + `pageSize`, available only when the primary key is a monotonic integer (`int`/`bigint`) — the IR's `CursorField()` returns the PK then. `cursor` is the PK of the last row seen; the bridge returns rows `WHERE pk > cursor ORDER BY pk` and sets `nextCursor` to the last row's PK (`null` at the end). `sort` is ignored in cursor mode (order is by PK). A uuid/text PK ignores `cursor` and falls back to offset.

The response carries `items`, `totalCount`, `page`, `pageSize` and — in cursor mode — `nextCursor`. `hasNextPage`/`hasPreviousPage`/`totalPages` are offset-mode only; cursor clients read `nextCursor` (null = end).

## Relation expansion (`include`)

The bridge eager-loads the entity's relations by default. `include` restricts which `[many]` collections are loaded:

- omitted → all relations,
- `include=` (explicitly empty) → none,
- `include=items,tags` → only those collections.

To-one relations always render their FK id (no nested object), so `include` does not apply to them.

## Serialization contract

A bridge MUST:

- `eq`/`ne` → equality/inequality;
- `gt`/`gte`/`lt`/`lte` → ordered comparison (numeric/date/datetime);
- `in` → set membership (SQL `IN`, LINQ `Contains`);
- `contains`/`startsWith`/`endsWith` → string predicates; case sensitivity follows the target database collation;
- preserve sort-key order (`-price,name` ≠ `name,-price`);
- reject unknown sort/filter fields with the bridge's client-error convention, never a 500;
- AND `search` and `filter` (they are orthogonal);
- clamp pagination against the compiled `Pagination` limits.

The TypeScript family exercises this contract end-to-end: the generated `query.ts` serializes exactly these strings and validates them against the compiled `QuerySchema` per entity — see the [TypeScript client](../../guides/typescript-client/) guide.