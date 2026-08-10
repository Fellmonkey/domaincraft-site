/**
 * Prefix an internal absolute path with the deployment base (e.g. `/domaincraft-site/`).
 *
 * Astro only applies `base` to built assets — handwritten `href="/docs"` stays as-is,
 * which breaks navigation when the site is served from a subpath on GitHub Pages.
 * Wrap every internal link in `withBase()`. External URLs and same-page anchors
 * (starting with `#`) pass through unchanged.
 */
export function withBase(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  const base = import.meta.env.BASE_URL ?? '/';
  const trimmed = base === '/' ? '' : base.replace(/\/$/, '');
  return `${trimmed}${path}`;
}
