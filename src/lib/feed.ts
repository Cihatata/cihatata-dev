import rss from '@astrojs/rss';

import { getPosts } from './blog';
import { AUTHOR } from '~/config/site';
import { ui } from '~/i18n/ui';
import { absoluteUrl, localizePath, type Locale } from '~/i18n/utils';

/** Shared RSS renderer so both language feeds stay identical in shape. */
export async function renderFeed(locale: Locale, site: URL | undefined) {
  const origin = site ?? new URL('https://cihatata.dev');
  const posts = (await getPosts(locale)).filter((post) => post.data.translated);

  return rss({
    title: `${AUTHOR.name} — ${ui[locale]['blog.title']}`,
    description: ui[locale]['blog.description'],
    site: origin,
    trailingSlash: false,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: [
      `<language>${locale}</language>`,
      `<atom:link href="${absoluteUrl(localizePath('/rss.xml', locale), origin)}" rel="self" type="application/rss+xml"/>`,
    ].join(''),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedAt,
      link: localizePath(`/contents/blog/${post.slug}`, locale),
      categories: [...post.data.tags],
      author: AUTHOR.name,
    })),
  });
}
