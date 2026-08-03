import type { Messages } from './types';

export const en: Messages = {
  langName: 'English',

  nav: {
    features: 'Features',
    howItWorks: 'How it works',
    bridges: 'Bridges',
    ai: 'AI-native',
    studio: 'Studio',
    docs: 'Docs',
    star: 'Star',
    install: 'Install'
  },

  hero: {
    badge: 'Open source · Domain-driven code generator',
    titleStart: 'Describe your domain once in YAML. Ship a',
    titleHighlight: 'production backend',
    titleEnd: 'in any language.',
    subtitle:
      'DomainCraft turns a single domain.yaml into fully working code — CRUD, auth, permissions, migrations, admin. Deterministic, reviewed by you, regenerated safely.',
    primaryCta: 'Start generating',
    secondaryCta: 'Open the Studio',
    installLabel: 'Install in 60 seconds',
    copied: 'Copied to clipboard',
    terminalTitle: 'domaincraft generate',
    domainTab: 'domain.yaml',
    codeTab: 'ProductService.cs',
    treeTab: 'generated/',
    running: 'Generating C# ASP.NET Core solution…',
    ready: '✓ 42 files generated · compiles clean'
  },

  trust: {
    title: 'Open source · MIT licensed · zero vendor lock-in',
    items: ['Go core', 'ASP.NET Core', 'EF Core', 'PostgreSQL', 'Dapr', 'MIT']
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
    titleStart: 'Everything a production backend needs,',
    titleHighlight: 'declared not written',
    titleEnd: '.',
    subtitle:
      'Each feature is a few declarative words in domain.yaml. The template does the rest — consistently, every single time.',
    cards: [
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
        description: 'Language-agnostic core. The C# bridge is ready; Java and TypeScript are on the roadmap.'
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
    titleStart: 'The perfect',
    titleHighlight: 'output format for AI',
    titleEnd: '.',
    subtitle:
      'Let the AI write the intent, not the boilerplate. DomainCraft turns a small, reviewable domain.yaml into 100% deterministic, compile-ready code — faster, cheaper and hallucination-free.',
    cards: [
      {
        title: 'Save tokens',
        description:
          'An agent writes 40 lines of YAML instead of 5,000 of CRUD, controllers and migrations. Tokens go to intent, not plumbing.'
      },
      {
        title: '100% deterministic accuracy',
        description:
          'A generator can’t forget a DI registration or drop a migration. Identical model in, identical code out — every time.'
      },
      {
        title: 'Iterate without fear',
        description:
          'Change domain.yaml, regenerate, and only the generated layer updates — your custom code and business hooks survive.'
      },
      {
        title: 'Agent-ready',
        description:
          'Ships dedicated skills so Cursor, Claude Code and Copilot can model, validate and extend your domain out of the box.'
      }
    ],
    promptLabel: 'agent prompt →',
    copyPrompt: 'Copy prompt',
    copied: 'Copied',
    resultLabel: '← generated from your domain'
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

  bridges: {
    eyebrow: 'Bridges',
    titleStart: 'One domain,',
    titleHighlight: 'any stack',
    titleEnd: '.',
    subtitle:
      'Each bridge is a pluggable template pack. The core never knows a language — it ships the IR and constrains nothing.',
    buildYourOwn: 'Build your own bridge',
    buildYourOwnDesc:
      'Bridges are plain templates and a manifest. No Go code required — add a language in an afternoon.',
    cards: [
      {
        name: 'csharp-restful',
        status: 'ready',
        description: 'ASP.NET Core REST API · clean architecture · EF Core + PostgreSQL + JWT + Dapr addons.'
      },
      {
        name: 'java-spring',
        status: 'planned',
        description: 'Spring Boot REST API for the JVM. On the roadmap.'
      },
      {
        name: 'typescript',
        status: 'planned',
        description: 'TypeScript / Express / Prisma backend. On the roadmap.'
      }
    ]
  },

  oss: {
    eyebrow: 'Open source',
    titleStart: 'Built in the open,',
    titleHighlight: 'owned by you',
    titleEnd: '.',
    subtitle:
      'DomainCraft is MIT-licensed and free. Read the source, run it yourself, fork it — no account, no lock-in, ever.',
    license: 'MIT Licensed',
    contribute: 'Contribute',
    contributeDesc: 'Clear contributing guides and a strict, tested core.',
    roadmap: 'Public roadmap',
    roadmapDesc: 'Java & TypeScript bridges, more databases, more API styles.',
    star: 'Star on GitHub',
    starDesc: 'Momentum signals real adoption. A star helps other developers find DomainCraft.'
  },

  cta: {
    titleStart: 'Stop writing',
    titleHighlight: 'boilerplate',
    titleEnd: '. Start shipping your domain.',
    subtitle: 'Free and MIT-licensed. Install in one command and generate your first backend today.',
    primaryCta: 'Start generating',
    secondaryCta: 'Read the docs',
    code: 'go install github.com/DomainCraft/DomainCraft/cmd/domaincraft@latest',
    copied: 'Copied'
  },

  footer: {
    tagline: 'Domain-driven code generation for any language.',
    product: 'Product',
    productLinks: {
      features: 'Features',
      bridges: 'Bridges',
      studio: 'Studio',
      ai: 'AI-native',
      roadmap: 'Roadmap'
    },
    resources: 'Resources',
    resourcesLinks: {
      docs: 'Documentation',
      generate: 'Quick start',
      github: 'GitHub',
      contribute: 'Contribute'
    },
    community: 'Community',
    communityLinks: {
      discord: 'Discord',
      twitter: 'Twitter / X',
      blog: 'Blog'
    },
    rights: '© {year} DomainCraft. MIT Licensed.',
    languageLabel: 'Language'
  }
};