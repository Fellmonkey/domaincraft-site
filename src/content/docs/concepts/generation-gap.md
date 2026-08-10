---
title: The Generation Gap pattern
description: How bridges protect developer-written code across regenerations with overwrite:false and partial classes.
section: concepts
order: 3
updated: "2026-08-03"
---

Code generators have a classic problem: what happens to hand-written business logic when you regenerate? DomainCraft answers it with the **Generation Gap** pattern — split generated code (always overwritten) from developer code (scaffolded once and owned).

## The two halves

Bridges mark a template `overwrite: false` to scaffold a file once; the renderer skips it afterwards and records it in the file manifest as `Custom: true`, `Written: false`. The migration engine uses this manifest to protect developer-owned files when an entity is deleted, renamed or its types change.

The reference C# bridge implements the pattern with C# partial classes. Per entity it generates:

- `src/Application/Generated/<Entity>Service.g.cs` — **always overwritten** `partial class` with CRUD and the full hook surface: async before/after hooks (`OnBeforeCreateAsync`, `OnAfterUpdateAsync`, ...) and full-flow override hooks (`On*OverrideAsync`). All of them return `HookResult` — `Success()` to continue, `Handled()` to take over persistence (e.g. route to a queue instead of the DB), or `Fail("reason")` to abort cleanly (mapped to HTTP 400).
- `src/Application/Services/<Entity>Service.cs` — `overwrite: false` partial where the developer overrides the async hooks.
- `I<Entity>Service` interface and DI registration `I<Entity>Service → <Entity>Service` (the merged partial class).

```text
Generated/<Entity>Service.g.cs   (rewritten every generate)
        │  partial class <Entity>Service : I<Entity>Service
        ▼
Services/<Entity>Service.cs      (created once, developer-owned partial)
        │  override Task<HookResult> OnBeforeCreateAsync(...) { /* your logic */ }
        ▼
DI:  I<Entity>Service → <Entity>Service    (merged partial)
```

## Why it works

Adding a field and regenerating rewrites only the `.g.cs` part; custom hook code survives. The migration engine renames or deletes the custom partial alongside the entity. The rule for bridge authors: **split Core (always regenerated) and Custom (`overwrite: false`) code** — put generated logic behind interfaces and scaffold the developer-owned implementation only once, using language-appropriate mechanisms (partial classes in C#, base classes elsewhere).