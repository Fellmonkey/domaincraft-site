---
title: "Lean Core: −34 Dependencies, −20% Binary"
description: "We measured every dependency in the core and replaced almost all with the standard library: 40 modules became 6, the binary lost 20%, and the generated code didn't change a single byte."
date: 2026-08-21
lang: en
---

*We asked ourselves a simple question: how much does each dependency weigh in the DomainCraft binary? The answer was so telling that we removed almost all of them.*

This article is not about theory — it's about measurements. Five commits of the core, five builds, a size table, a stopwatch. Everything is reproducible, everything is honest — including the places where there was no win.

## Where the task came from

The DomainCraft core is a Go CLI code generator. At the start, it had **5 direct dependencies** and **40 modules** in `go.mod`. The question wasn't "how to write less code" but "which libraries can be replaced by the standard library, once you measure each one's real value".

The plan:

1. Bump Go from 1.25 to 1.27 (new runtime: Green Tea GC, faster malloc) — a one-line change.
2. Remove `sprig` — the template library with 211 functions, of which the bridges actually called 22.
3. Remove `huh` — the TUI prompt library with a tree of 28 modules — and write the prompts ourselves.

Each step was measured: binary size, module count, speed. And each was verified with a byte-for-byte diff: after removing a library, the generated code had to stay exactly the same as before.

## Methodology

Commits the measurements were taken on:

| Commit | What it is | Go | sprig | huh |
|---|---|---|---|---|
| `7fea4e9` | baseline | 1.25 | yes | yes |
| `d2eb243` | toolchain upgrade | 1.27 | yes | yes |
| `a384657` | sprig replaced with internal functions | 1.27 | no | yes |
| `995bfae` | all libraries updated (cobra 1.10.2 and others) | 1.27 | no | yes |
| `7b9878f` | huh removed, own ANSI TUI prompts | 1.27 | no | no |

Built like the release workflow: `go build -ldflags "-s -w"`. Size from `ls`. Speed — the minimum of 3–5 `time` runs, to cut out OS noise.

## Binary size

| Build | Size | Modules in go.mod |
|---|---|---|
| `7fea4e9` (Go 1.25 + sprig + huh) | 11.81 MB | 40 |
| `d2eb243` (Go 1.27 + sprig + huh) | **12.70 MB** | 40 |
| `a384657` (no sprig) | 11.83 MB | 32 |
| `995bfae` (updated libraries) | 11.67 MB | 34 |
| **`7b9878f` (no huh)** | **10.14 MB** | **6** |

From the heaviest build to the final one — **−2.56 MB (−20%)**.

### Each step's contribution

**Go 1.25 → 1.27: +0.89 MB.** The new runtime — Green Tea GC, size-specialized allocations, profiling. This is the price of the upgrade, and it's the same for any Go project. In exchange — a noticeable speedup (below).

**sprig → 22 own functions: −0.87 MB.** Sprig shipped 211 template functions. We ran all five bridges' templates through an analyzer and found out: **22** are actually called (about 10%). The other 189 are dead weight: decimal arithmetic, certificate generation, encodings, semver, uuid, regexps — and all of it dragged in 9 transitive modules. We replaced them with 22 functions on the plain standard library (`strings`, `strconv`, `path`, `reflect`, `time`). The output is identical, byte for byte.

**Library update: −0.16 MB.** A bonus: fresh bubbletea/bubbles/lipgloss turned out to be more efficient than the old ones, and the build slimmed down on its own (11.83 → 11.67 MB), even though the module count grew (32 → 34).

**huh → own prompts: −1.53 MB.** The TUI prompts cost **1.53 MB** and **28 modules** — bubbletea, bubbles, lipgloss, muesli, catppuccin and a couple of dozen more. For what? For five dialogs: bridge selection, two yes/no confirmations, and two multi-select file pickers.

Go compiles an imported package in its entirety — there is no "lite version" of huh, just as there is no lite bubbletea. We checked the alternatives too: `promptkit` sits on the same charmbracelet stack, `survey` is lighter but still a third-party dependency.

So the prompts were written by hand: three primitives on `bufio` + `golang.org/x/term` — which was already needed for terminal detection. Instead of 28 modules — a single file of about 500 lines with unit tests and zero new dependencies. The look mirrors huh: dark boxes, the active row and the `[Yes]/[No]` buttons fill with green as you switch, arrow keys and Space work in raw mode.

## Dependencies: 40 → 6

The full route:

```
40 modules (Go 1.25, sprig, huh)
  → 32: sprig removed + mergo, goutils, semver, google/uuid,
        shopspring/decimal, spf13/cast, copystructure, reflectwalk, x/crypto
  → 34: remaining libraries updated
  → 6:  huh removed + 27 modules of the charmbracelet ecosystem
```

Three direct dependencies remain: `cobra` (CLI framework), `x/term` (terminal detection) and `yaml.v3` (YAML parser).

A separate story — `xstrings` (case converters). At first we kept it as a "leaf without transitive dependencies", but then we ported its `snake_case`/`kebab-case` algorithm into our own `pkg/textutil` (~180 lines, keeping the MIT license in LICENSE) and removed it too.

## Speed

Measurements (minimum of runs, Windows):

| Build | Startup (`--version`) | Generation kitchen-sink (C#) |
|---|---|---|
| `7fea4e9` (Go 1.25) | 0.081 s | 0.605 s |
| `d2eb243` (Go 1.27) | 0.080 s | **0.530 s** |
| `995bfae` (no sprig) | 0.081 s | 0.524 s |
| `7b9878f` (no huh) | 0.074 s | 0.521 s |

Conclusions:

- **Startup** — noise. All builds launch in ~0.08 s; the difference is smaller than the measurement error.
- **Generation** — the win came from Go 1.27 specifically: **−12%** (0.605 → 0.530 s). That's Green Tea GC and faster allocations, which are most visible on allocation-heavy workloads like parsing and building the IR.
- **Removing sprig/huh barely affects speed** — they're not on the hot path of generation. Their value is not speed but size and independence.

## What it means

- **Downloads.** The release binary is ~2.6 MB smaller. For a CLI tool installed via `go install` or from GitHub Releases, that's a real difference, especially on slow connections.
- **Audit.** Less code — a smaller surface for vulnerabilities and less third-party code inside your tool. The core is now almost entirely the standard library.
- **Maintenance.** Every dependency in `go.mod` is now justified: either it has no stdlib replacement (YAML, TUI, CLI), or it has been measured and found necessary.
- **Regression risk** — zero: after each removal we regenerated all five bridges and compared the output byte for byte. 187 files of C#, TypeScript, React, admin panel and Appwrite — not a single differing byte.

All of this shipped in release **v0.6.0**.

*P.S. Yes, there's just one of me, and I ran this analysis simply because it was interesting. Whoever you are — find me on any social network and write: «Я вас любил: любовь ещё, быть может…» ("I loved you: love still, perhaps…")*
