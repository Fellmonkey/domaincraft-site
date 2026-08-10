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
    badge: 'Open source · Domain-driven code generator',
    titleStart: 'Describe your domain once in YAML. Ship a',
    titleHighlight: 'production backend',
    titleEnd: 'in any language.',
    subtitle:
      'DomainCraft turns a single domain.yaml into fully working code — CRUD, auth, permissions, migrations, admin. Deterministic output, compiles clean, safe to regenerate.', 
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
    items: ['Go core', 'ASP.NET Core', 'EF Core', 'PostgreSQL', 'Dapr', 'Docker']
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
      'The agent describes the domain, DomainCraft generates 40+ production files, the agent drops business logic into hooks — then docker compose up runs it. Zero forgotten wiring, nothing hand-built.',
    cards: [
      {
        title: 'Describe the domain',
        description:
          'One file is the whole spec — entities, relations, permissions, features. Everything else the generator derives from it.'
      },
      {
        title: 'Generate the backend',
        description:
          'domaincraft generate emits a full ASP.NET Core solution — controllers, DTOs, repositories, migrations, tests, Docker — deterministic on every run.'
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
    eyebrow: 'Community',
    titleStart: 'Open source,',
    titleHighlight: 'MIT, free forever',
    titleEnd: '.',
    subtitle:
      'Read the source, run it yourself, fork it — no account, no gate, no lock-in, ever.',
    license: 'MIT Licensed',
    licenseDesc: 'Permissive license — keep your generated code, no strings attached.',
    contribute: 'Contribute',
    contributeDesc: 'Clear contributing guides and a strict, tested core.',
    roadmap: 'Public roadmap',
    roadmapDesc: 'More databases, more API styles, more addons — tracked publicly on the repo.',
    star: 'Star on GitHub',
    starDesc: 'Momentum signals real adoption. A star helps other developers find DomainCraft.'
  },

  cta: {
    titleStart: 'Stop writing',
    titleHighlight: 'boilerplate',
    titleEnd: '. Start shipping your domain.',
    subtitle:
      'No Go required — download a binary and generate your first backend today.',
    primaryCta: 'Download binary',
    secondaryCta: 'Read the docs',
    code: 'go install github.com/DomainCraft/DomainCraft/cmd/domaincraft@latest',
    goNote: 'or install with Go',
    copied: 'Copied'
  },

  footer: {
    tagline: 'Domain-driven code generation for any language.',
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
    communityTitle: 'Community shapes the bridges',
    communityBody:
      'Every bridge is a template package maintained by the community. The more effort goes into a bridge, the more powerful the tool becomes — so a good bridge is the best contribution you can make.',
    brandTitle: 'About the name',
    brandBody:
      '“DomainCraft” is a working title. The final brand is still undecided — the tool and the community matter more than the name.'
  }
};