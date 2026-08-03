import type { Messages } from './types';

export const ru: Messages = {
  langName: 'Русский',

  nav: {
    features: 'Возможности',
    howItWorks: 'Как работает',
    bridges: 'Мосты',
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
      'DomainCraft превращает один domain.yaml в полностью рабочий код — CRUD, авторизация, права, миграции, админка. Детерминированно, под вашим контролем, безопасно перегенерируемо.',
    primaryCta: 'Начать генерацию',
    secondaryCta: 'Открыть Studio',
    installLabel: 'Установка за 60 секунд',
    copied: 'Скопировано в буфер',
    terminalTitle: 'domaincraft generate',
    domainTab: 'domain.yaml',
    codeTab: 'ProductService.cs',
    treeTab: 'generated/',
    running: 'Генерация C# ASP.NET Core решения…',
    ready: '✓ 42 файла сгенерировано · компилируется чисто'
  },

  trust: {
    title: 'Open source · лицензия MIT · без привязки к вендорам',
    items: ['Ядро Go', 'ASP.NET Core', 'EF Core', 'PostgreSQL', 'Dapr', 'MIT']
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
        description: 'Язык-агностичное ядро. Мост C# готов; Java и TypeScript в планах.'
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
    titleStart: 'Идеальный',
    titleHighlight: 'формат вывода для ИИ',
    titleEnd: '.',
    subtitle:
      'Пусть ИИ пишет намерение, а не бойлерплейт. DomainCraft превращает небольшой проверяемый domain.yaml в 100% детерминированный код, готовый к компиляции — быстрее, дешевле и без галлюцинаций.',
    cards: [
      {
        title: 'Экономия токенов',
        description:
          'Агент пишет 40 строк YAML вместо 5 000 строк CRUD, контроллеров и миграций. Токены уходят на намерение, а не на каркас.'
      },
      {
        title: '100% детерминированная точность',
        description:
          'Генератор не «забудет» регистрацию в DI и не потеряет миграцию. Тот же вход, тот же выход — каждый раз.'
      },
      {
        title: 'Итерации без страха',
        description:
          'Изменили domain.yaml, перегенерировали — обновится только генерируемый слой, а ваши хуки и кастомный код сохранятся.'
      },
      {
        title: 'Готов для агентов',
        description:
          'Поставляется со скиллами, так что Cursor, Claude Code и Copilot моделируют, валидируют и расширяют ваш домен из коробки.'
      }
    ],
    promptLabel: 'промпт агента →',
    copyPrompt: 'Скопировать промпт',
    copied: 'Скопировано',
    resultLabel: '← сгенерировано из вашего домена'
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
    eyebrow: 'Open source',
    titleStart: 'Открыто,',
    titleHighlight: 'в вашей собственности',
    titleEnd: '.',
    subtitle:
      'DomainCraft распространяется по лицензии MIT и бесплатен. Читайте исходники, запускайте, форкайте — без аккаунта и без привязки.',
    license: 'Лицензия MIT',
    contribute: 'Внести вклад',
    contributeDesc: 'Понятные гайды и строгое протестированное ядро.',
    roadmap: 'Публичный роадмап',
    roadmapDesc: 'Мосты Java и TypeScript, больше БД, больше стилей API.',
    star: 'Звезда на GitHub',
    starDesc: 'Звёзды — сигнал реальной востребованности. Помогите другим разработчикам найти DomainCraft.'
  },

  cta: {
    titleStart: 'Хватит писать',
    titleHighlight: 'бойлерплейт',
    titleEnd: '. Начинайте выводить свой домен.',
    subtitle: 'Бесплатно и под MIT. Установите одной командой и сгенерируйте первый бэкенд уже сегодня.',
    primaryCta: 'Начать генерацию',
    secondaryCta: 'Читать документацию',
    code: 'go install github.com/DomainCraft/DomainCraft/cmd/domaincraft@latest',
    copied: 'Скопировано'
  },

  footer: {
    tagline: 'Домен-ориентированная генерация кода для любого языка.',
    product: 'Продукт',
    productLinks: {
      features: 'Возможности',
      bridges: 'Мосты',
      studio: 'Studio',
      ai: 'AI-native',
      roadmap: 'Роадмап'
    },
    resources: 'Ресурсы',
    resourcesLinks: {
      docs: 'Документация',
      generate: 'Быстрый старт',
      github: 'GitHub',
      contribute: 'Вклад'
    },
    community: 'Сообщество',
    communityLinks: {
      discord: 'Discord',
      twitter: 'Twitter / X',
      blog: 'Блог'
    },
    rights: '© {year} DomainCraft. Лицензия MIT.',
    languageLabel: 'Язык'
  }
};