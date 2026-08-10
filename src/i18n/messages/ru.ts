import type { Messages } from './types';

export const ru: Messages = {
  langName: 'Русский',

  nav: {
    products: 'Продукты',
    features: 'Возможности',
    howItWorks: 'Как работает',
    bridges: 'Мосты',
    skills: 'Скиллы',
    changelog: 'Changelog',
    blog: 'Блог',
    ai: 'AI-native',
    studio: 'Studio',
    docs: 'Документация',
    star: 'Star',
    install: 'Установить'
  },

  hero: {
    badge: 'Open source · генератор кода на основе домена',
    titleStart: 'Опишите домен один раз в YAML. Получите',
    titleHighlight: 'готовый бэкенд',
    titleEnd: 'на любом языке.',
    subtitle:
      'DomainCraft превращает один domain.yaml в полностью рабочий код — CRUD, авторизация, права, миграции, админка. Детерминированный вывод, чистая компиляция, безопасная регенерация.',
    primaryCta: 'Начать генерацию',
    secondaryCta: 'Открыть Studio',
    installLabel: 'Установка за 60 секунд',
    downloadCta: 'Скачать бинарник',
    platforms: 'Windows · macOS · Linux · ARM64',
    copied: 'Скопировано в буфер',
    terminalTitle: 'domaincraft generate',
    domainTab: 'domain.yaml',
    codeTab: 'ProductService.cs',
    treeTab: 'generated/',
    running: 'Генерация C# ASP.NET Core решения…',
    ready: '✓ Решение сгенерировано · компилируется чисто'
  },

  trust: {
    title: 'Стек, который поставляется с коробки',
    items: ['Ядро Go', 'ASP.NET Core', 'EF Core', 'PostgreSQL', 'Dapr', 'Docker']
  },

  problem: {
    eyebrow: 'Проблема',
    titleStart: 'Каждый проект начинается с одного и того же',
    titleHighlight: 'скучного бойлерплейта',
    titleEnd: '.',
    subtitle:
      'CRUD-эндпоинты, репозитории, DTO, миграции, настройка авторизации, валидация, права доступа — дни однообразной работы, где легко ошибиться и скучно.',
    headerTraditional: 'Традиционный подход',
    headerDomaincraft: 'С DomainCraft',
    rows: [
      { traditional: 'Руками писать 50+ файлов на сущность', domaincraft: 'Определить 1 сущность в ~10 строках YAML' },
      { traditional: 'Повторять CRUD-логику в каждом проекте', domaincraft: 'Генерировать одинаково каждый раз' },
      { traditional: 'Чинить одни и те же баги бойлерплейта', domaincraft: 'Чинить баги в шаблонах — сразу везде' },
      { traditional: 'Сменить язык? Перепиши всё', domaincraft: 'Сменить мост, оставив тот же домен' },
      {
        traditional: 'Права доступа разбросаны по всему коду',
        domaincraft: 'Объявлены рядом с сущностью, связаны сквозно'
      }
    ]
  },

  howItWorks: {
    eyebrow: 'Как работает',
    titleStart: 'Одна модель,',
    titleHighlight: 'весь конвейер',
    titleEnd: '.',
    subtitle: 'Ваш domain.yaml проходит через детерминированный компилятор — а не через чёрный ящик.',
    steps: [
      {
        title: 'Опишите домен',
        description:
          'Сущности, поля, связи, права, фичи и сид-данные живут в одном читаемом и диффуемом domain.yaml.'
      },
      {
        title: 'DomainCraft валидирует и строит IR',
        description:
          'Строгие парсер, лексер и валидатор ловят логические ошибки до генерации; промежуточное представление связывает каждую связь.'
      },
      {
        title: 'Мосты рендерят продакшн-код',
        description:
          'Подключаемые шаблоны моста превращают IR в идиоматичный код для вашего стека — с манифестом файлов и снимком миграций.'
      }
    ]
  },

  features: {
    eyebrow: 'Возможности',
    titleStart: 'Всё, что нужно продакшн-бэкенду,',
    titleHighlight: 'декларативно, не вручную',
    titleEnd: '.',
    subtitle:
      'Каждая фича — пара декларативных слов в domain.yaml. Шаблон делает остальное — одинаково, каждый раз.',
    cards: [
      {
        title: 'Day-2 safety · Generation Gap',
        description:
          'Кастомный код переживает регенерацию. Сгенерированные части обновляются, ваши хуки остаются — без затирания.'
      },
      {
        title: 'Права RBAC + ABAC',
        description: 'read: ["*"], update: ["@Owner", Admin] — публичный, ролевой и ownership-доступ, собранный в политики.'
      },
      {
        title: 'Движок миграций схемы',
        description: 'Снимки, old_name-ренеймы, очистка сирот и --prune — безопасный рефакторинг домена.'
      },
      {
        title: 'Подключаемые мосты',
        description: 'Мост — это обычные шаблоны и манифест, без Go-кода. Новый язык — за один вечер.'
      },
      {
        title: 'Админка одним флагом',
        description: 'domaincraft generate --admin собирает CRUD-админпанель для вашего API без настройки.'
      },
      {
        title: 'Инфраструктурные аддоны',
        description: 'Опишите очередь, кэш, секреты и хранилища — подключите Dapr, event_sourced и enterprise-инфраструктуру декларативно.'
      }
    ]
  },

  ai: {
    eyebrow: 'AI-native',
    label: 'Создан для ИИ-разработки',
    titleStart: 'Весь ИИ-цикл,',
    titleHighlight: 'одной сессией',
    titleEnd: '.',
    subtitle:
      'Агент описывает домен, DomainCraft генерирует 40+ файлов продакшн-кода, агент вписывает бизнес-логику в хуки — и docker compose up всё запускает. Ничего не забыто, ничего не вручную.',
    cards: [
      {
        title: 'Опишите домен',
        description:
          'Один файл — весь спецификатор: сущности, связи, права, фичи. Всё остальное генератор выводит из него.'
      },
      {
        title: 'Генерация бэкенда',
        description:
          'domaincraft generate выдаёт полное ASP.NET Core решение — контроллеры, DTO, репозитории, миграции, тесты, Docker — детерминированно при каждом запуске.'
      },
      {
        title: 'Бизнес-логика в хуки',
        description:
          'Агент реализует хуки в Services/<Entity>Service.cs (overwrite: false) — ровно в тех файлах, которых генератор никогда не касается.'
      },
      {
        title: 'Запуск и итерации',
        description:
          'docker compose up поднимает API + Postgres. Изменили модель и перегенерировали — таблицы переименуются за вас, данные сохранятся.'
      }
    ],
    sessionTitle: 'Одна сессия, от начала до конца',
    copyPrompt: 'Скопировать промпт',
    copied: 'Скопировано',
    stepYouAgent: 'Вы → агент',
    stepYaml: 'Агент → domain.yaml',
    stepGenerate: '$ domaincraft generate',
    stepHooks: 'Агент → бизнес-хуки',
    stepDeploy: '$ docker compose up',
    stepDeployResult: 'API :8080 · Postgres · health ready'
  },

  studio: {
    eyebrow: 'DomainCraft Studio',
    titleStart: 'Спроектируйте домен',
    titleHighlight: 'визуально',
    titleEnd: '.',
    subtitle:
      'Перетаскивайте диаграммы сущностей, редактируйте матрицу прав и YAML в реальном времени с WASM-валидацией — всё, что вы рисуете, это валидный domain.yaml.',
    primaryCta: 'Открыть Studio',
    secondaryCta: 'Запустить локально',
    bullets: ['Граф и код с двусторонней синхронизацией', 'Мгновенная WASM-валидация', 'Общий реестр ролей и матрица прав']
  },

  bridges: {
    eyebrow: 'Мосты',
    titleStart: 'Один домен,',
    titleHighlight: 'любой стек',
    titleEnd: '.',
    subtitle:
      'Каждый мост — это подключаемый пакет шаблонов. Ядро не знает языков — оно поставляет IR и ничего не навязывает.',
    buildYourOwn: 'Создайте свой мост',
    buildYourOwnDesc:
      'Мосты — это обычные шаблоны и манифест. Без Go-кода — добавьте язык за один вечер.',
    cards: [
      {
        name: 'csharp-restful',
        status: 'ready',
        description: 'ASP.NET Core REST API · чистая архитектура · EF Core + PostgreSQL + JWT + аддоны Dapr.'
      },
      {
        name: 'java-spring',
        status: 'planned',
        description: 'Spring Boot REST API для JVM. В планах.'
      },
      {
        name: 'typescript',
        status: 'planned',
        description: 'Бэкенд TypeScript / Express / Prisma. В планах.'
      }
    ]
  },

  oss: {
    eyebrow: 'Сообщество',
    titleStart: 'Открытый код,',
    titleHighlight: 'MIT, бесплатно навсегда',
    titleEnd: '.',
    subtitle:
      'Читайте исходники, запускайте, форкайте — без аккаунта, без ограничений, без привязки.',
    license: 'Лицензия MIT',
    licenseDesc: 'Разрешительная лицензия — ваш сгенерированный код остаётся вашим, без условий.',
    contribute: 'Внести вклад',
    contributeDesc: 'Понятные гайды и строгое протестированное ядро.',
    roadmap: 'Публичный роадмап',
    roadmapDesc: 'Больше БД, больше стилей API, больше аддонов — открытый трекинг в репозитории.',
    star: 'Звезда на GitHub',
    starDesc: 'Звёзды — сигнал реальной востребованности. Помогите другим разработчикам найти DomainCraft.'
  },

  cta: {
    titleStart: 'Хватит писать',
    titleHighlight: 'бойлерплейт',
    titleEnd: '. Начинайте выводить свой домен.',
    subtitle:
      'Go не нужен — скачайте бинарник и сгенерируйте первый бэкенд уже сегодня.',
    primaryCta: 'Скачать бинарник',
    secondaryCta: 'Читать документацию',
    code: 'go install github.com/DomainCraft/DomainCraft/cmd/domaincraft@latest',
    goNote: 'или установить через Go',
    copied: 'Скопировано'
  },

  footer: {
    tagline: 'Домен-ориентированная генерация кода для любого языка.',
    product: 'Продукт',
    productLinks: {
      bridges: 'Мосты',
      skills: 'Скиллы',
      studio: 'Studio',
      changelog: 'Changelog',
      blog: 'Блог'
    },
    resources: 'Ресурсы',
    resourcesLinks: {
      docs: 'Документация',
      generate: 'Быстрый старт',
      github: 'GitHub'
    },
    rights: '© {year} DomainCraft. Лицензия MIT.',
    languageLabel: 'Язык'
  },

  blog: {
    toc: 'На этой странице',
    readingTime: 'мин чтения',
    backToPosts: '← Все посты',
    communityTitle: 'Сообщество определяет силу мостов',
    communityBody:
      'Каждый мост — это пакет шаблонов, который поддерживает сообщество. Чем больше усилий вложено в мост, тем мощнее получается инструмент — поэтому хороший мост это лучший вклад, который вы можете сделать.',
    brandTitle: 'О названии',
    brandBody:
      '«DomainCraft» — рабочее название. Финальный бренд пока не определён — инструмент и сообщество важнее имени.'
  }
};