/**
 * Prefix an internal absolute path with the deployment base (e.g. `/domaincraft-site/`).
 *
 * Astro only rewrites `base` for built assets — a handwritten `href="/docs"` stays as-is,
 * which breaks navigation when the site is served from a subpath on GitHub Pages.
 * Wrap every internal link in `withBase()`. External URLs and same-page anchors
 * (starting with `#`) pass through unchanged.
 *
 * Trailing slash: GitHub Pages serves directory URLs (which the sitemap and
 * canonical declare with a trailing `/`) via a 301 redirect from the slash-less
 * form. Normalizing here removes that extra hop from every internal link,
 * hreflang alternate and breadcrumb item.
 *
 * Asset URLs (with a file extension, e.g. `/og/foo.png`, `/favicon.svg`,
 * `/og-image.png`) keep their exact path — adding a trailing slash to them yields
 * a 404 on a static host (the OG crawler hits `/og/foo.png/` → 404).
 */
export function withBase(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  const [head, ...rest] = path.split('#');
  const hasExtension = /\.[A-Za-z0-9]+$/.test(head);
  const normalized =
    !hasExtension && head.length > 1 && !head.endsWith('/') ? `${head}/` : head;
  const base = import.meta.env.BASE_URL ?? '/';
  const trimmed = base === '/' ? '' : base.replace(/\/$/, '');
  return `${trimmed}${normalized}${rest.length ? `#${rest.join('#')}` : ''}`;
}
