import type { APIRoute } from 'astro';

import { collectRoutes } from '~/lib/routes';
import { DEFAULT_LOCALE, absoluteUrl, localizePath } from '~/i18n/utils';

export const prerender = true;

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = async ({ site }) => {
  const origin = site ?? new URL('https://cihatata.dev');
  const routes = await collectRoutes();

  // One <url> per locale, each listing every alternate so Google can pair them.
  const entries = routes.flatMap((route) =>
    route.locales.map((locale) => {
      const alternates = route.locales
        .map(
          (alternate) =>
            `<xhtml:link rel="alternate" hreflang="${alternate}" href="${escape(
              absoluteUrl(localizePath(route.path, alternate), origin),
            )}"/>`,
        )
        .join('');

      const xDefault = route.locales.includes(DEFAULT_LOCALE)
        ? `<xhtml:link rel="alternate" hreflang="x-default" href="${escape(
            absoluteUrl(localizePath(route.path, DEFAULT_LOCALE), origin),
          )}"/>`
        : '';

      return [
        '<url>',
        `<loc>${escape(absoluteUrl(localizePath(route.path, locale), origin))}</loc>`,
        route.lastModified ? `<lastmod>${route.lastModified.toISOString()}</lastmod>` : '',
        route.changeFrequency ? `<changefreq>${route.changeFrequency}</changefreq>` : '',
        route.priority !== undefined ? `<priority>${route.priority.toFixed(1)}</priority>` : '',
        alternates,
        xDefault,
        '</url>',
      ].join('');
    }),
  );

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries,
    '</urlset>',
  ].join('');

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
