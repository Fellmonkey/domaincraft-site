/**
 * Applies the persisted theme before first paint to avoid a flash.
 * Reads localStorage or falls back to system preference.
 */
(function initTheme() {
  const storageKey = 'domaincraft-theme';
  const stored = (() => {
    try {
      return localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  })();
  const prefersDark =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored === 'dark' || stored === 'light' ? stored : prefersDark ? 'dark' : 'light';
  document.documentElement.classList.toggle('dark', theme === 'dark');
})();
