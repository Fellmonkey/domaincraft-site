# DomainCraft site

Marketing and documentation site for DomainCraft.
The build produced 80 pages: landing, bridges, skills, changelog, blog, docs and Studio frames.

## What is where

| Path | Content |
|------|---------|
| `src/pages/` | Routes. `index.astro` is the landing; `docs/[...slug].astro` and `ru/docs/[...slug].astro` render the docs collection. |
| `src/content/docs/` | Documentation in four Diátaxis sections: getting-started, guides, reference, concepts. |
| `src/content/blog/` | Posts in `en` and `ru`, with generated OG images. |
| `src/components/site/` | Landing sections as `.astro` components. |
| `src/components/` | React islands: terminal demo, theme toggle, locale switcher, copy button. |
| `src/i18n/messages/` | All interface copy. `types.ts` is the contract; `en.ts` and `ru.ts` implement it. |
| `src/layouts/` | `Layout.astro` (SEO, header, footer), `DocsLayout.astro` (sidebar, prev/next), `StudioLayout.astro` (iframe only). |
| `public/` | Static assets, `llms.txt`, `docs/context7.json`, robots, OG images. |

## Commands

Node 22.12+ required. Run from this directory.

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies. |
| `npm run dev` | Dev server on `127.0.0.1:4444` (configured in `astro.config.mjs`). |
| `npm run check` | `astro check`. Type-checks `.astro` and `.tsx`. This is the primary static check. |
| `npm run build` | Produce `dist/`. Fails on compile errors. |
| `npm run preview` | Preview the built `dist/`. |
| `npm run og` | Regenerate OG images from `scripts/og-image.html`. |

CI runs `check` and `build` on push and PR to `main`.

## Documentation source

Docs describe the shipped contract, not a wish list. The source of truth is the monorepo: `spec yaml.md`, `spec/domain.schema.json` and the bridges in `DomainCraft/bridges/`. Each page carries `title`, `description`, `section`, `order` and quoted `updated` in frontmatter. Adding a `.md` file to a section builds both language routes, the sidebar and prev/next links.

## Agent files

`/llms.txt` is the short map of the site. Every HTML page links to it with `rel="describedby"`.

`/docs/context7.json` sits under the docs base URL so it can verify ownership.

## Limits

- No local search. Navigation is a static sidebar.
- Studio is an iframe of the separate `domaincraft-studio` app. The two builds do not share code.
- RU docs are EN text with a banner, not full translations.
- No CMS. Content changes go through a PR and a rebuild.
- `dist/` is generated output. Do not edit it.
