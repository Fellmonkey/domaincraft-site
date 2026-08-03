import type { CollectionEntry } from 'astro:content';
import { docSections, docSectionOrder, type DocSection } from './docs-nav';

export type DocEntry = CollectionEntry<'docs'>;

export function sortDocs(docs: DocEntry[]): DocEntry[] {
  return [...docs].sort((a, b) => {
    const sa = docSectionOrder.indexOf(a.data.section);
    const sb = docSectionOrder.indexOf(b.data.section);
    if (sa !== sb) return sa - sb;
    return a.data.order - b.data.order;
  });
}

export interface DocGroup {
  label: string;
  items: { slug: string; title: string }[];
}

export function buildGroups(docs: DocEntry[], lang: 'en' | 'ru'): DocGroup[] {
  const sorted = sortDocs(docs);
  return docSectionOrder
    .map((section) => ({
      label: docSections[section][lang],
      items: sorted
        .filter((d) => d.data.section === section)
        .map((d) => ({ slug: d.id, title: d.data.title }))
    }))
    .filter((g) => g.items.length > 0);
}

export function sectionLabel(section: DocSection, lang: 'en' | 'ru'): string {
  return docSections[section][lang];
}

export function getPrevNext(sorted: DocEntry[], currentSlug: string): {
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
} {
  const idx = sorted.findIndex((d) => d.id === currentSlug);
  return {
    prev:
      idx > 0
        ? { slug: sorted[idx - 1].id, title: sorted[idx - 1].data.title }
        : null,
    next:
      idx >= 0 && idx < sorted.length - 1
        ? { slug: sorted[idx + 1].id, title: sorted[idx + 1].data.title }
        : null
  };
}
