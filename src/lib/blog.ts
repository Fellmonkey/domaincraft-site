import GithubSlugger from 'github-slugger';

/** Localized display names for blog topic tags (title case per language). */
export const TAG_LABELS: Record<string, { en: string; ru: string }> = {
  product: { en: 'Product', ru: 'Продукт' },
  compiler: { en: 'Compiler', ru: 'Компилятор' },
  bridges: { en: 'Bridges', ru: 'Мосты' },
  architecture: { en: 'Architecture', ru: 'Архитектура' },
  core: { en: 'Core', ru: 'Ядро' },
  engineering: { en: 'Engineering', ru: 'Инженерия' }
};

export function tagLabel(tag: string, lang: 'en' | 'ru'): string {
  return TAG_LABELS[tag]?.[lang] ?? tag;
}

export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

/** Strip inline markdown so the text matches what Astro renders as plain text. */
function cleanHeadingText(raw: string): string {
  return raw
    .replace(/`([^`]*)`/g, '$1') // inline code
    .replace(/\*\*([^*]+)\*\*/g, '$1') // bold
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links -> label
    .trim();
}

/**
 * Extract `h2`/`h3` headings from raw markdown with slugs generated the same
 * way Astro does (github-slugger over the plain heading text), so the ids
 * match the rendered DOM and can be used as anchor targets.
 */
export function extractTocHeadings(markdown: string): TocHeading[] {
  const slugger = new GithubSlugger();
  const headings: TocHeading[] = [];

  for (const line of markdown.split('\n')) {
    const match = line.match(/^(#{2,3})\s+(.+?)\s*#*\s*$/);
    if (!match) continue;

    const level = match[1].length === 2 ? 2 : 3;
    const text = cleanHeadingText(match[2]);
    if (!text) continue;

    headings.push({ id: slugger.slug(text), text, level });
  }

  return headings;
}
