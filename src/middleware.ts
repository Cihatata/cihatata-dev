import { defineMiddleware } from 'astro:middleware';
import { DEFAULT_LOCALE, LOCALES, isLocale, localeFromPath, type Locale } from './i18n/utils';

const LOCALE_COOKIE = 'lang';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const VARY = 'Accept-Language, Cookie';

/** Picks the best supported locale from an `Accept-Language` header. */
function localeFromHeader(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE;

  const ranked = header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const q = params.find((p) => p.trim().startsWith('q='));
      return {
        tag: (tag ?? '').trim().toLowerCase(),
        q: q ? Number.parseFloat(q.split('=')[1] ?? '1') : 1,
      };
    })
    .filter((entry) => entry.tag && !Number.isNaN(entry.q))
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split('-')[0];
    if (isLocale(base)) return base;
  }

  return DEFAULT_LOCALE;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Only the bare root negotiates a language, so every other URL stays stable
  // for crawlers and for anyone sharing a link.
  if (pathname === '/') {
    const cookie = context.cookies.get(LOCALE_COOKIE)?.value;
    const preferred = isLocale(cookie)
      ? cookie
      : localeFromHeader(context.request.headers.get('accept-language'));

    if (preferred !== DEFAULT_LOCALE) {
      const redirect = context.redirect(`/${preferred}`, 302);
      redirect.headers.set('Vary', VARY);
      return redirect;
    }
  }

  const response = await next();
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('text/html')) {
    response.headers.append('Vary', VARY);

    // Remember the language the visitor is actually reading so the next visit
    // to `/` lands on it without re-negotiating.
    const current = localeFromPath(pathname);
    if (context.cookies.get(LOCALE_COOKIE)?.value !== current) {
      context.cookies.set(LOCALE_COOKIE, current, {
        path: '/',
        maxAge: COOKIE_MAX_AGE,
        sameSite: 'lax',
        httpOnly: false,
        secure: import.meta.env.PROD,
      });
    }
  }

  return response;
});

export { LOCALE_COOKIE, LOCALES };
