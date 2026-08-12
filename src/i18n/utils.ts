import { DEFAULT_LOCALE, LOCALES, ui, type Locale, type TranslationKey } from './ui';

export { DEFAULT_LOCALE, LOCALES };
export type { Locale, TranslationKey };

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

/** Derives the active locale from a pathname such as `/tr/about`. */
export function localeFromPath(pathname: string): Locale {
  const segment = pathname.split('/').filter(Boolean)[0];
  return isLocale(segment) ? segment : DEFAULT_LOCALE;
}

export function useTranslations(locale: Locale) {
  return function t(key: TranslationKey, vars?: Record<string, string | number>): string {
    const value: string = ui[locale][key] ?? ui[DEFAULT_LOCALE][key];
    if (!vars) return value;
    return value.replace(/\{(\w+)\}/g, (match, name: string) =>
      name in vars ? String(vars[name]) : match,
    );
  };
}

/** Prefixes an internal path with the locale segment (default locale stays unprefixed). */
export function localizePath(path: string, locale: Locale): string {
  const clean = path === '/' ? '' : path.replace(/\/+$/, '');
  if (locale === DEFAULT_LOCALE) return clean || '/';
  return `/${locale}${clean}`;
}

/** Strips the locale prefix so a path can be re-localized into another language. */
export function delocalizePath(pathname: string): string {
  const segments = pathname.replace(/\/+$/, '').split('/').filter(Boolean);
  if (isLocale(segments[0])) segments.shift();
  return segments.length ? `/${segments.join('/')}` : '/';
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'tr' : 'en';
}

export function absoluteUrl(path: string, site: URL | string): string {
  return new URL(path, site).href.replace(/\/$/, '') || String(site);
}

/**
 * Builds the hreflang map for a page. Pass `available` to limit alternates to the
 * locales a page actually exists in.
 */
export function buildAlternates(
  path: string,
  site: URL | string,
  available: readonly Locale[] = LOCALES,
): { locale: Locale; href: string }[] {
  return available.map((locale) => ({
    locale,
    href: absoluteUrl(localizePath(path, locale), site),
  }));
}

export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function formatDateShort(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
