---
title: "A Compiler, Not a Generator: Why the Words Matter"
description: "DomainCraft isn't a template code generator — it's a domain-model compiler with a real pipeline: lexer, parser, validator, IR, and renderer. Here's how that differs from 'printing files' and what it gives you in practice."
date: 2026-08-24
lang: en
tags: [compiler, architecture]
---

*Anyone can have a template engine "generate code". Only a compiler can "compile a contract." Here's what that distinction means in DomainCraft — and why it shapes everything else.*

When we say DomainCraft is a compiler, the first question is fair: "What's the difference? It's just a code generator, right?" On the surface it looks the same: a YAML file in, a folder of code out. The difference is what happens inside — and which guarantees you get.

## How it started: a generator for the backend

DomainCraft began as a generator in both intent and design: one target — a C#/ASP.NET Core backend, one bridge, 71 templates. The model lives in YAML, the pipeline runs templates and prints files. It worked — while there was only one stack.

The moment we wanted a second language (TypeScript on the frontend), the real question surfaced: **who guarantees that two independently generated codebases in different languages are talking about the same thing?**

A template engine doesn't see the model as a structure: for it, these are text files and substitutions. The same enum can become `OrderStatus` in C# and the string `"pending"` in the JSON client — and nobody notices until a runtime mismatch surfaces.

## The realization: we had IR, but only thought about languages

IR appeared in DomainCraft not as an innovation but out of necessity: you can't render templates correctly without a structure to render from. For a long time we saw it narrowly: "we have an IR, so adding another backend language is easy." In our heads there was only one dimension — the language itself.

The real shift came when we realized: **variability isn't one-dimensional.** Transport (REST, gRPC, minimal API) and persistence (EF Core, Dapper, Marten) are two independent axes. The same IR can be rendered not just into another language, but into another layer on top of the same language — and the layers can be combined arbitrarily. That's what grew into the axes-and-layers design from the previous post, where N persistence backends × M transports = N+M repositories, not N×M: [From Monolith to Axes and Layers](https://domaincraft.github.io/domaincraft-site/blog/bridges-axes-layers/).

The IR is exactly what makes that economy possible: a new layer isn't "another copy of the whole world" — it's a small bridge that consumes the same ready contract.

## The compiler: how the pipeline works

In DomainCraft, generation isn't a template run — it's compilation. The pipeline is literally the classic compiler pipeline:

```
domain.yaml
   → Lexer    — tokenizes every field
   → Parser   — turns YAML into a structured model
   → Validator — checks semantics (relations, permissions, indexes, data)
   → IR builder — assembles a fully linked object graph
   → Renderer  — emits code through bridges
```

The key stage is the **intermediate representation (IR)**. It's not a mid-file format — it's resolved semantics: a linked graph of entities, fields, relations, permissions, and indexes. No YAML left — just the model.

A bridge is, in effect, a compiler backend for its own stack: it knows how to turn the IR into files of its world (C#, TypeScript, React hooks, admin panel). The IR itself is language-agnostic.

```
              ┌→ C# bridge   → ASP.NET Core API
domain.yaml → IR ─→ TS bridge → typed client + hooks
              └→ Admin bridge → admin panel
```

## What a compiler guarantees and a template engine doesn't

### Errors are caught before runtime

A compiler won't produce an executable with unresolved symbols — it simply fails to build. DomainCraft won't emit code where permissions reference a missing entity, an index points at a nonexistent field, or `on_delete` sits on a required relation. The validator checks hundreds of such rules before any generation: relation integrity, permission conflicts, seed data types, duplicate primary keys, contradictory modifiers.

In an ordinary generator these same errors surface later, in the application's runtime. Here they surface at "compile time" — before the first deploy.

### One contract in every layer

The model has a single source of truth — the IR. Everything compiles from it:

- entity and DTO types;
- enum wire values (`credit_card` — identical in C#, TypeScript, and JSON);
- the `path:op:value` filter grammar — for the API and for the typed client;
- the permission matrix — into endpoints, into buttons, into client-side guards;
- the error contract (`409 CONCURRENCY_CONFLICT`, field errors);
- database migrations and `old_name` renames.

The C# server and the TypeScript client **cannot drift apart** on the wire: both are compiled from the same IR, not written by two teams against different docs.

### An independent oracle checks the contract

Compiled code alone isn't enough — you also need proof that the output honors the contract. DomainCraft has two verification systems, both independent of the bridges:

- **k6 — an HTTP oracle, one for all languages.** It starts the generated app and hits it with real HTTP requests: statuses, permissions, `@Owner` isolation, optimistic locking, pagination, filter grammar. That's 136 checks that don't know what language the server is written in — only the contract.
- **Per-language TCK — a handwritten oracle per thin core.** This covers what HTTP can't check: compile-time types and wire serialization (hidden/readonly exclusions, enum wire values, typed filters). The tests are written by humans against the contract, not generated from the same IR that generates the bridges — otherwise a bridge bug would reproduce itself in the test and it would "pass".

A generator is "tested". A compiler is *certified* against an external oracle. That's a difference of confidence, not phrasing.

### The same output, every time

A compiler is deterministic: one input, identical bytes on every run. In DomainCraft every map iteration goes through a sorted list — two runs produce byte-for-byte identical files. That's the basis for auditing, clean diffs in code review, and the assurance that "regenerated a bit, everything shifted" doesn't happen.

### The same compiler runs in the editor

The clearest proof that this is a compiler is the GUI editor. The same lexer, parser, and validator are compiled to WASM and run right in the browser: structure is checked in the editor by the same code as in the CLI. One compiler, one behavior — terminal and editor. A template engine has nothing like it.

## Why this matters in the future

With two languages so far — C# and TypeScript — the win feels abstract. The future makes it much sharper:

- **A new bridge is a new backend.** Dapper instead of EF Core, gRPC instead of REST — that's a small layer with its own templates, and any combination is built with the `--replace` flag. No new "generator" needed.
- **New platforms inherit the same contract.** The Dart bridge (on the roadmap) gets out of the box what C# and TypeScript already have — enum wire values, filter grammar, permissions — for free, because it's semantics, not copy-paste.
- **AI agents build against the contract.** An agent gets a typed client where permissions, types, and the query schema are already derived from the same IR — and writes screens instead of guessing about the API.

## The takeaway

"Compiler" isn't a README badge — it's an answer to the question of what you trust with your model. A generator prints files and leaves. A compiler takes the model, validates it, emits one contract, and distributes it across every layer of the product. The independent oracles (k6 and per-language TCKs) confirm the contract actually holds — not just that it's declared.

One file, one compiler, one contract — and oracles that vouch for it.

```bash
domaincraft generate --domain domain.yaml --bridge csharp-rest --admin
```