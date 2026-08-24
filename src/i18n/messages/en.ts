import type { Messages } from './types';

export const en: Messages = {
  langName: 'English',

  nav: {
    products: 'Products',
    features: 'Features',
    howItWorks: 'How it works',
    bridges: 'Bridges',
    skills: 'Skills',
    changelog: 'Changelog',
    blog: 'Blog',
    ai: 'AI-native',
    studio: 'Studio',
    docs: 'Docs',
    star: 'Star',
    install: 'Install'
  },

  hero: {
    badge: 'Open source · Domain compiler',
    titleStart: 'Describe your domain once in YAML and',
    titleHighlight: 'compile your entire product',
    titleEnd: ' — API, web, mobile.',
    subtitle:
      'DomainCraft compiles a single domain.yaml into a production API, a typed web client and an admin panel. Types, validation, queries and permissions stay consistent across every layer — by construction.', 
    primaryCta: 'Start generating',
    secondaryCta: 'Open the Studio',
    installLabel: 'Install in 60 seconds',
    downloadCta: 'Download binary',
    platforms: 'Windows · macOS · Linux · ARM64',
    copied: 'Copied to clipboard',
    terminalTitle: 'domaincraft generate',
    domainTab: 'domain.yaml',
    codeTab: 'ProductService.cs',
    treeTab: 'generated/',
    running: 'Generating C# ASP.NET Core solution…',
    ready: '✓ Solution generated · compiles clean'
  },

  trust: {
    title: 'The stack it ships with',
    items: ['Go core', 'ASP.NET Core', 'EF Core', 'PostgreSQL', 'TypeScript', 'Dapr', 'Docker']
  },

  problem: {
    eyebrow: 'The problem',
    titleStart: 'Every project starts with the same',
    titleHighlight: 'boring boilerplate',
    titleEnd: '.',
    subtitle:
      'CRUD endpoints, repositories, DTOs, migrations, auth wiring, validation, permissions — days of repetitive work that is error-prone and tedious.',
    headerTraditional: 'Traditional approach',
    headerDomaincraft: 'With DomainCraft',
    rows: [
      { traditional: 'Write 50+ files per entity by hand', domaincraft: 'Define 1 entity in ~10 lines of YAML' },
      { traditional: 'Repeat CRUD logic on every project', domaincraft: 'Generate it consistently every time' },
      { traditional: 'Fix the same boilerplate bugs everywhere', domaincraft: 'Fix bugs in templates, fixed everywhere' },
      { traditional: 'Switch language? Rewrite everything', domaincraft: 'Switch bridges, keep the same domain' },
      {
        traditional: 'API changed — the frontend silently broke',
        domaincraft: 'Regenerate: every layer updates from one model'
      },
      {
        traditional: 'Permissions scattered across the codebase',
        domaincraft: 'Declared beside entities, wired end-to-end'
      }
    ]
  },

  howItWorks: {
    eyebrow: 'How it works',
    titleStart: 'One model,',
    titleHighlight: 'whole pipeline',
    titleEnd: '.',
    subtitle: 'Your domain.yaml flows through a deterministic compiler — not a black box.',
    steps: [
      {
        title: 'Describe the domain',
        description:
          'Entities, fields, relations, permissions, features and seed data live in one readable, diffable domain.yaml.'
      },
      {
        title: 'DomainCraft validates & builds IR',
        description:
          'A strict parser, lexer and validator catch logic errors before anything is generated; an intermediate representation links every relation.'
      },
      {
        title: 'Bridges render production code',
        description:
          'Pluggable bridge templates translate the IR into idiomatic code for your target stack — with a file manifest and migration snapshot.'
      }
    ]
  },

  features: {
    eyebrow: 'Features',
    titleStart: 'Everything your product needs,',
    titleHighlight: 'declared not written',
    titleEnd: '.',
    subtitle:
      'Each feature is a few declarative words in domain.yaml. The template does the rest — consistently, every single time.',
    cards: [
      {
        title: 'One model, whole contract',
        description:
          'Types, validation, queries, permissions and errors are compiled from the same IR into every layer — backend, web client, admin. They cannot drift apart.'
      },
      {
        title: 'Day-2 safety · Generation Gap',
        description:
          'Custom code survives regeneration. Generated partials stay refreshed, your hooks stay yours — no wipe on regen.'
      },
      {
        title: 'RBAC + ABAC permissions',
        description: 'read: ["*"], update: ["@Owner", Admin] — public, role and ownership rules compiled to auth policies.'
      },
      {
        title: 'Schema migration engine',
        description: 'Snapshots, old_name renames, orphan cleanup and --prune — domain refactors land safely.'
      },
      {
        title: 'Pluggable bridges',
        description: 'Bridges are plain templates and a manifest — no Go code required. Add a language in an afternoon.'
      },
      {
        title: 'Admin panel from one flag',
        description: 'domaincraft generate --admin ships a CRUD admin panel for your API with zero extra config.'
      },
      {
        title: 'Infrastructure addons',
        description: 'Declare queue, cache, secrets and storage — wire Dapr, event_sourced and enterprise plumbing declaratively.'
      }
    ]
  },

  ai: {
    eyebrow: 'AI-native',
    label: 'Built for AI development',
    titleStart: 'The whole AI loop,',
    titleHighlight: 'one session',
    titleEnd: '.',
    subtitle:
      'The agent describes the domain, DomainCraft compiles the API and its typed TypeScript client from one model, the agent drops business logic into hooks — then docker compose up runs it. Zero forgotten wiring, nothing hand-built.',
    cards: [
      {
        title: 'Describe the domain',
        description:
          'One file is the whole spec — entities, relations, permissions, features. Everything else the compiler derives from it.'
      },
      {
        title: 'Compile the stack',
        description:
          'domaincraft generate emits a production ASP.NET Core API plus its typed TypeScript client and an admin panel — deterministic on every run.'
      },
      {
        title: 'Drop in business logic',
        description:
          'The agent implements hooks in Services/<Entity>Service.cs (overwrite: false) — the exact files the generator never touches.'
      },
      {
        title: 'Run and iterate',
        description:
          'docker compose up boots API + Postgres. Change the model and regenerate — tables are renamed for you, your data survives.'
      }
    ],
    sessionTitle: 'One session, end to end',
    copyPrompt: 'Copy prompt',
    copied: 'Copied',
    stepYouAgent: 'You → agent',
    stepYaml: 'Agent → domain.yaml',
    stepGenerate: '$ domaincraft generate',
    stepHooks: 'Agent → business hooks',
    stepDeploy: '$ docker compose up',
    stepDeployResult: 'API :8080 · Postgres · health ready'
  },

  studio: {
    eyebrow: 'DomainCraft Studio',
    titleStart: 'Design your domain',
    titleHighlight: 'visually',
    titleEnd: '.',
    subtitle:
      'Drag-and-drop entity diagrams, a permission matrix and a real-time YAML editor with WASM validation — everything you draw is a valid domain.yaml.',
    primaryCta: 'Open Studio',
    secondaryCta: 'Run it locally',
    bullets: ['Graph + code, two-way sync', 'Instant WASM validation', 'Shared role registry & permission matrix']
  },

  audience: {
    eyebrow: 'Who it is for',
    titleStart: 'One model,',
    titleHighlight: 'three jobs',
    titleEnd: '.',
    subtitle:
      'DomainCraft serves everyone who touches the product — the API, the web client and the screens in between.',
    cards: [
      {
        title: 'Backend developers',
        description:
          'A production ASP.NET Core + PostgreSQL API out of the box — JWT auth, migrations, permission checks. Business logic goes into Generation Gap hooks, never into generated files.',
        bullets: [
          'REST API with auth, roles and @Owner isolation',
          'EF Core + PostgreSQL with database migrations',
          'Hooks for business logic without touching generated code'
        ]
      },
      {
        title: 'Frontend developers',
        description:
          'A typed client compiled from the same model — types, queries and permissions that cannot drift from the API, because they are compiled from the same IR.',
        bullets: [
          'Types + Zod validation from one intermediate representation',
          'Typed path:op:value query grammar',
          'Framework-agnostic ts-core, React via react-rest'
        ]
      },
      {
        title: 'AI agents',
        description:
          'Screens are built against a certified client — permissions and query schema are already part of the types, so the agent writes UI instead of guessing about the API.',
        bullets: [
          'Per-bridge agent skills with UI recipes',
          'Compile-time permission matrix',
          'No guessing about the API contract'
        ]
      }
    ]
  },

  bridges: {
    eyebrow: 'Bridges',
    titleStart: 'One domain,',
    titleHighlight: 'any stack',
    titleEnd: '.',
    subtitle:
      'Each bridge is a pluggable template pack. The core never knows a language — it ships the IR and constrains nothing. Composition gives you 1 core + N thin adapters, not N×M bridges. Screens are built by AI agents against the typed client.',
    buildYourOwn: 'Build your own bridge',
    buildYourOwnDesc:
      'Bridges are plain templates and a manifest. No Go code required — add a language in an afternoon.',
    cards: [
      {
        name: 'csharp-rest',
        status: 'ready',
        description: 'ASP.NET Core + EF Core + PostgreSQL + JWT (core → domain → efcore → rest).'
      },
      {
        name: 'ts-core',
        status: 'ready',
        description: 'Thin TypeScript core — typed query DSL, wire-value enums, permission matrix.'
      },
      {
        name: 'ts-client + react-rest',
        status: 'ready',
        description: 'Zod, JWT client, CRUD, TanStack Query hooks (extends ts-core).'
      },
      {
        name: 'admin-alpine',
        status: 'ready',
        description: 'Admin panel for any REST backend — one --admin flag.'
      }
    ]
  },

  cta: {
    titleStart: 'Stop writing',
    titleHighlight: 'boilerplate',
    titleEnd: '. Start shipping your domain.',
    subtitle:
      'No Go required — download a binary and compile your first project today.',
    primaryCta: 'Download binary',
    secondaryCta: 'Read the docs',
    code: 'go install github.com/DomainCraft/DomainCraft/cmd/domaincraft@latest',
    goNote: 'or install with Go',
    copied: 'Copied'
  },

  footer: {
    tagline: 'One domain model. Your entire stack.',
    product: 'Product',
    productLinks: {
      bridges: 'Bridges',
      skills: 'Skills',
      studio: 'Studio',
      changelog: 'Changelog',
      blog: 'Blog'
    },
    resources: 'Resources',
    resourcesLinks: {
      docs: 'Documentation',
      generate: 'Quick start',
      github: 'GitHub'
    },
    rights: '© {year} DomainCraft. MIT Licensed.',
    languageLabel: 'Language'
  },

  blog: {
    toc: 'On this page',
    readingTime: 'min read',
    backToPosts: '← All posts',
    topics: 'Topics',
    read: 'Read'
  },

  announcementBar: {
    community: 'The more the community invests in a bridge, the more powerful the tool becomes',
    brand: '“DomainCraft” is a working title'
  }
};