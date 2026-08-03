export const docSections = {
  'getting-started': { en: 'Getting started', ru: 'Начало работы' },
  guides: { en: 'Guides', ru: 'Руководства' },
  reference: { en: 'Reference', ru: 'Справочник' },
  concepts: { en: 'Concepts', ru: 'Концепции' }
} as const;

export type DocSection = keyof typeof docSections;

export const docSectionOrder: DocSection[] = [
  'getting-started',
  'guides',
  'reference',
  'concepts'
];