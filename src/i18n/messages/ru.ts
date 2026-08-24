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
    badge: 'Open source · доменный компилятор',
    titleStart: 'Опишите домен один раз в YAML и',
    titleHighlight: 'скомпилируйте весь продукт',
    titleEnd: ' — API, веб, мобильное приложение.',
    subtitle:
      'DomainCraft компилирует один domain.yaml в продакшн-API, типизированный веб-клиент и админку. Типы, валидация, запросы и права остаются согласованными во всех слоях — по построению.',
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
    items: ['Ядро Go', 'ASP.NET Core', 'EF Core', 'PostgreSQL', 'TypeScript', 'Dapr', 'Docker']
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
        traditional: 'Изменился API — фронтенд молча сломался',
        domaincraft: 'Регенерация: все слои обновляются из одной модели'
      },
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
    titleStart: 'Всё, что нужно вашему продукту,',
    titleHighlight: 'декларативно, не вручную',
    titleEnd: '.',
    subtitle:
      'Каждая фича — пара декларативных слов в domain.yaml. Шаблон делает остальное — одинаково, каждый раз.',
    cards: [
      {
        title: 'Одна модель — весь контракт',
        description:
          'Типы, валидация, запросы, права и ошибки собираются из одного IR для каждого слоя — бэкенд, веб-клиент, админка. Им невозможно разойтись.'
      },
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
      'Агент описывает домен, DomainCraft компилирует API и его типизированный TypeScript-клиент из одной модели, агент вписывает бизнес-логику в хуки — и docker compose up всё запускает. Ничего не забыто, ничего не вручную.',
    cards: [
      {
        title: 'Опишите домен',
        description:
          'Один файл — вся спецификация: сущности, связи, права, фичи. Всё остальное компилятор выводит из него.'
      },
      {
        title: 'Компиляция стека',
        description:
          'domaincraft generate выдаёт продакшн-API на ASP.NET Core плюс типизированный TypeScript-клиент и админку — детерминированно при каждом запуске.'
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

  audience: {
    eyebrow: 'Для кого это',
    titleStart: 'Одна модель,',
    titleHighlight: 'три задачи',
    titleEnd: '.',
    subtitle:
      'DomainCraft служит каждому, кто касается продукта — API, веб-клиента и экранов между ними.',
    cards: [
      {
        title: 'Бэкенд-разработчикам',
        description:
          'Продакшен-API на ASP.NET Core + PostgreSQL сразу из коробки — JWT-авторизация, миграции, проверки прав. Бизнес-логика живёт в хуках Generation Gap, а не в сгенерированных файлах.',
        bullets: [
          'REST API с авторизацией, ролями и изоляцией @Owner',
          'EF Core + PostgreSQL с миграциями базы',
          'Хуки для бизнес-логики без правки сгенерированного кода'
        ]
      },
      {
        title: 'Фронтенд-разработчикам',
        description:
          'Типизированный клиент, скомпилированный из той же модели — типы, запросы и права не могут разойтись с API, потому что собраны из одного IR.',
        bullets: [
          'Типы + Zod-валидация из одного промежуточного представления',
          'Типизированная грамматика запросов path:op:value',
          'Фреймворк-агностичное ts-core, React через react-rest'
        ]
      },
      {
        title: 'ИИ-агентам',
        description:
          'Экраны строятся поверх сертифицированного клиента: права и схема запросов уже часть типов, поэтому агент пишет интерфейс, а не угадывает API.',
        bullets: [
          'Скиллы агента для каждого моста с рецептами UI',
          'Матрица прав на уровне типов',
          'Никакого угадывания контракта API'
        ]
      }
    ]
  },

  bridges: {
    eyebrow: 'Мосты',
    titleStart: 'Один домен,',
    titleHighlight: 'любой стек',
    titleEnd: '.',
    subtitle:
      'Каждый мост — это подключаемый пакет шаблонов. Ядро не знает языков — оно поставляет IR и ничего не навязывает. Композиция даёт 1 ядро + N тонких адаптеров вместо N×M мостов. Экраны строят ИИ-агенты поверх типизированного клиента.',
    buildYourOwn: 'Создайте свой мост',
    buildYourOwnDesc:
      'Мосты — это обычные шаблоны и манифест. Без Go-кода — добавьте язык за один вечер.',
    cards: [
      {
        name: 'csharp-rest',
        status: 'ready',
        description: 'ASP.NET Core + EF Core + PostgreSQL + JWT (core → domain → efcore → rest).'
      },
      {
        name: 'ts-core',
        status: 'ready',
        description: 'Тонкое TypeScript-ядро — типизированный DSL запросов, wire-значения enum, матрица прав.'
      },
      {
        name: 'ts-client + react-rest',
        status: 'ready',
        description: 'Zod, fetch-клиент, CRUD, хуки TanStack Query (extends ts-core).'
      },
      {
        name: 'admin-alpine',
        status: 'ready',
        description: 'Админ-панель для любого REST-бэкенда — один флаг --admin.'
      }
    ]
  },

  cta: {
    titleStart: 'Хватит писать',
    titleHighlight: 'бойлерплейт',
    titleEnd: '. Начинайте выводить свой домен.',
    subtitle:
      'Go не нужен — скачайте бинарник и скомпилируйте первый проект уже сегодня.',
    primaryCta: 'Скачать бинарник',
    secondaryCta: 'Читать документацию',
    code: 'go install github.com/DomainCraft/DomainCraft/cmd/domaincraft@latest',
    goNote: 'или установить через Go',
    copied: 'Скопировано'
  },

  footer: {
    tagline: 'Одна модель домена. Весь ваш стек.',
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
    topics: 'Темы',
    read: 'Читать'
  },

  announcementBar: {
    community: 'Чем больше сообщество вложится в мост, тем мощнее инструмент',
    brand: '«DomainCraft» — рабочее название'
  }
};