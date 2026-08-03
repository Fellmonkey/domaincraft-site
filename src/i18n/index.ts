import type { Messages } from './messages/types';
import { en } from './messages/en';
import { ru } from './messages/ru';

export const locales = ['en', 'ru'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский'
};

export const messages: Record<Locale, Messages> = { en, ru };

export function isLocale(value: string | undefined | null): value is Locale {
  return value != null && (locales as readonly string[]).includes(value);
}

/**
 * Resolves the active locale from Astro's i18n routing.
 * With `prefixDefaultLocale: false`, the default locale lives at the root
 * and non-default locales under their prefix (e.g. `/ru/`).
 */
export function getLocale(url: URL): Locale {
  const segments = url.pathname.split('/').filter(Boolean);
  const first = segments[0]?.toLowerCase();
  return isLocale(first) ? first : defaultLocale;
}

export function getMessages(lang: Locale): Messages {
  return messages[lang];
}

export function getLocalePath(lang: Locale, path = '/'): string {
  if (lang === defaultLocale) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `/${lang}${clean === '/' ? '' : clean}`;
}
