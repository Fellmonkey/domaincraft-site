---
title: The domain model
description: Why DomainCraft is built around a declarative domain.yaml and what that buys you.
section: concepts
order: 1
updated: "2026-08-03"
---

DomainCraft is a **domain-driven code generator**. Developers describe their domain model once, in `domain.yaml`, and the tool generates fully working source code for a target language/framework through pluggable bridges.

`domain.yaml` is more than a table definition — it is a complete description of the system's behaviour:

- **Relations** — foreign keys and join tables are hidden behind `relation(...)`.
- **Validation** — declared inline with field traits (`min`, `max`, `email`, `gte`, ...).
- **Behaviour macros** — features such as `audit`, `soft_delete` and `optimistic_lock` inject fields and generated logic.
- **Access control** — RBAC and ABAC permissions are declared, not coded.
- **Database tuning** — indexes and unique groups via `indexes`.

Two governing principles:

1. **The model is the single source of truth.** You write the domain only once; the bridge derives all code from it. DRY is enforced at the language level — the IR contract, not duplicated boilerplate, is what bridges consume.
2. **Output is deterministic.** Go maps have randomized iteration order, so the core sorts every map that affects generated output. Two runs over the same `domain.yaml` must produce byte-identical output.

The bridge is a pure function of the IR: it can't invent business rules that aren't in the model, and it can't emit code that contradicts it.