import { collectTags, getPosts } from './blog';
import { slugify } from './slug';
import { LOCALES, type Locale } from '~/i18n/utils';

export type SitemapRoute = {
  /** Locale-independent path, e.g. `/contents/blog/css-cascade-nedir`. */
  path: string;
  /** Locales the page exists in. */
  locales: Locale[];
  lastModified?: Date;
  changeFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority?: number;
};

const STATIC_ROUTES: SitemapRoute[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/contents', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/contents/videos', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/contents/photos', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/dailies', changeFrequency: 'monthly', priority: 0.4 },
  { path: '/tools', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/about', changeFrequency: 'yearly', priority: 0.8 },
].map((route) => ({ ...route, locales: [...LOCALES] }));

/**
 * Every indexable URL on the site. Built by walking the content collections so
 * SSR-only routes still make it into the sitemap.
 */
export async function collectRoutes(): Promise<SitemapRoute[]> {
  const postsByLocale = await Promise.all(
    LOCALES.map(async (locale) => [locale, await getPosts(locale)] as const),
  );

  const postLocales = new Map<string, { locales: Locale[]; lastModified: Date }>();
  const tagLocales = new Map<string, Locale[]>();

  for (const [locale, posts] of postsByLocale) {
    for (const post of posts) {
      // Untranslated stubs are noindex, so they stay out of the sitemap.
      if (!post.data.translated) continue;

      const entry = postLocales.get(post.slug);
      const lastModified = post.data.updatedAt ?? post.data.publishedAt;

      if (entry) {
        entry.locales.push(locale);
        if (lastModified > entry.lastModified) entry.lastModified = lastModified;
      } else {
        postLocales.set(post.slug, { locales: [locale], lastModified });
      }
    }

    for (const tag of collectTags(posts.filter((post) => post.data.translated))) {
      const slug = slugify(tag.slug);
      tagLocales.set(slug, [...(tagLocales.get(slug) ?? []), locale]);
    }
  }

  return [
    ...STATIC_ROUTES,
    ...[...postLocales].map(([slug, entry]) => ({
      path: `/contents/blog/${slug}`,
      locales: entry.locales,
      lastModified: entry.lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.8,
    })),
    ...[...tagLocales].map(([slug, locales]) => ({
      path: `/contents/tag/${slug}`,
      locales,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    })),
  ];
}
