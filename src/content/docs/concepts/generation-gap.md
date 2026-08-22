---
title: The Generation Gap pattern
description: How bridges keep hand-written code safe across regenerations — generated core vs. developer-owned code.
section: concepts
order: 3
updated: "2026-08-22"
---

Code generators have a classic problem: what happens to hand-written business logic when you regenerate? DomainCraft answers it with the **Generation Gap** pattern — split generated code (always overwritten) from developer code (scaffolded once and owned).

## The two halves

Bridges mark a template `overwrite: false` to scaffold a file once; the renderer skips it afterwards and records it in the file manifest as `Custom: true`, `Written: false`. The migration engine uses this manifest to protect developer-owned files when an entity is deleted, renamed or its types change.

The C# bridges (`csharp-core` + `csharp-rest`) are the reference implementation. Per entity they generate:

- `src/Application/Generated/<Entity>Service.g.cs` — **always overwritten** with CRUD and the full hook surface. Before/after hooks (`OnBeforeCreateAsync`, `OnAfterUpdateAsync`, …) and full-flow overrides (`On*OverrideAsync`) all return `HookResult`: `Success()` continues, `Handled()` takes over persistence (e.g. route to a queue), `Fail("reason")` aborts to HTTP 400.
- `src/Application/Services/<Entity>Service.cs` — `overwrite: false`, created once and owned by you. You override the async hooks there.
- `I<Entity>Service` interface + DI registration `I<Entity>Service → <Entity>Service`.

The split uses a language-appropriate mechanism — **partial classes in C#**, base classes in other languages:

```text
Generated/<Entity>Service.g.cs   (rewritten every generate)
        │  class <Entity>Service : I<Entity>Service  (partial in C#)
        ▼
Services/<Entity>Service.cs      (created once, your partial/base)
        │  OnBeforeCreateAsync(...) { /* your logic */ }
        ▼
DI:  I<Entity>Service → <Entity>Service
```

## Why it works

Adding a field and regenerating rewrites only the `.g.cs` part; custom hook code survives. The migration engine renames or deletes the custom partial alongside the entity. The rule for bridge authors: **split Core (always regenerated) and Custom (`overwrite: false`) code** — put generated logic behind interfaces and scaffold the developer-owned implementation only once, using language-appropriate mechanisms (partial classes in C#, base classes elsewhere).