import GithubSlugger from 'github-slugger';

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
