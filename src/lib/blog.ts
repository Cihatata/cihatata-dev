import { getCollection, type CollectionEntry } from 'astro:content';

import { slugify } from './slug';
import { LOCALES, type Locale } from '~/i18n/utils';

export type BlogEntry = CollectionEntry<'blog'>;

export type Post = BlogEntry & {
  locale: Locale;
  slug: string;
  readingMinutes: number;
};

const WORDS_PER_MINUTE = 200;

function readingMinutes(body: string | undefined): number {
  if (!body) return 1;
  const words = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/[#>*_`~\-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function decorate(entry: BlogEntry): Post | null {
  const [locale, ...rest] = entry.id.split('/');
  if (!LOCALES.includes(locale as Locale) || rest.length === 0) return null;

  return Object.assign(entry, {
    locale: locale as Locale,
    slug: rest.join('/'),
    readingMinutes: readingMinutes(entry.body),
  });
}

/** All published posts for a locale, newest first. */
export async function getPosts(locale: Locale): Promise<Post[]> {
  const entries = await getCollection('blog', ({ data }) => !data.draft || import.meta.env.DEV);

  return entries
    .map(decorate)
    .filter((post): post is Post => post !== null && post.locale === locale)
    .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}

export async function getAllPosts(): Promise<Post[]> {
  const entries = await getCollection('blog', ({ data }) => !data.draft || import.meta.env.DEV);

  return entries
    .map(decorate)
    .filter((post): post is Post => post !== null)
    .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}

export async function getPost(locale: Locale, slug: string): Promise<Post | undefined> {
  const posts = await getPosts(locale);
  return posts.find((post) => post.slug === slug);
}

/** Locales a given post slug exists in, used to emit accurate hreflang tags. */
export async function getPostLocales(slug: string): Promise<Locale[]> {
  const posts = await getAllPosts();
  return LOCALES.filter((locale) =>
    posts.some((post) => post.locale === locale && post.slug === slug),
  );
}

export type TagSummary = {
  label: string;
  slug: string;
  count: number;
};

export function collectTags(posts: Post[]): TagSummary[] {
  const bySlug = new Map<string, TagSummary>();

  for (const post of posts) {
    for (const label of post.data.tags) {
      const slug = slugify(label);
      const existing = bySlug.get(slug);
      if (existing) {
        existing.count += 1;
      } else {
        bySlug.set(slug, { label, slug, count: 1 });
      }
    }
  }

  return [...bySlug.values()].sort(
    (a, b) => b.count - a.count || a.label.localeCompare(b.label),
  );
}

export function filterByTag(posts: Post[], tagSlug: string): Post[] {
  return posts.filter((post) => post.data.tags.some((tag) => slugify(tag) === tagSlug));
}
