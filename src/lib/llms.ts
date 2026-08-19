import { getEntry } from 'astro:content';

import { AUTHOR, EXTRA_PROFILES, SITE_URL, SOCIALS } from '~/config/site';
import { EXPERIENCE } from '~/data/experience';
import { getVideos } from '~/data/videos';
import { absoluteUrl, localizePath, otherLocale, type Locale } from '~/i18n/utils';

import { getPosts, type Post } from './blog';

const copy = {
  en: {
    summary:
      'Personal site of Cihat ATA, a Software Engineer in Ankara, Türkiye. Writing on frontend, software teams, career, and life. English lives at the site root; Turkish lives under /tr/.',
    details: [
      'Cihat is a Senior Frontend Engineer at GA Telesis (React, TypeScript, Vite). Earlier: Trendyol Group storefront, Resmo (acquired by JumpCloud), Getir, and Gais Cyber Security.',
      'Use the linked `.md` files — they are the clean markdown versions of pages. `/llms-full.txt` concatenates About, experience, and every post listed below. HTML pages exist at the same paths without `.md`.',
    ].join('\n\n'),
    pages: 'Pages',
    blog: 'Blog',
    otherBlog: 'Blog (Turkish originals, English not published yet)',
    videos: 'Videos',
    feeds: 'Feeds',
    optional: 'Optional',
    homeTitle: 'Home',
    aboutTitle: 'About',
    contentsTitle: 'Contents',
    toolsTitle: 'Tools',
    videosTitle: 'Videos',
    photosTitle: 'Photos',
    dailiesTitle: 'Dailies',
    home: 'Overview and latest posts.',
    about: 'Bio, work history, and how to reach Cihat.',
    contents: 'Hub for blog posts, videos, and photography.',
    toolsNote: 'Hardware on the desk, plus a short wishlist.',
    videosPage: 'Recorded talks and trainings.',
    photos: 'Photographs published on Unsplash.',
    dailies: 'Short daily notes. Not published yet.',
    rss: 'New posts in this language.',
    rssOther: 'New posts in Turkish.',
    sitemap: 'Every indexable HTML URL.',
    full: 'About, experience, and every post below in one file.',
    otherIndex: 'Turkish llms.txt, covering /tr/.',
    otherLangNote: 'Turkish original — English translation is not published yet.',
    alsoIn: 'Turkish',
    present: 'present',
    experience: 'Experience',
    fullSummary: 'Full markdown: about, experience, and every available post.',
    extraHeading: 'Posts available only in Turkish',
  },
  tr: {
    summary:
      'Cihat ATA’nın kişisel sitesi. Ankara’da yaşayan bir Software Engineer. Frontend, yazılım takımları, kariyer ve hayat üzerine yazıyor. Türkçe `/tr/` altında; İngilizce kök dizinde.',
    details: [
      'Cihat, GA Telesis’te Senior Frontend Engineer (React, TypeScript, Vite). Öncesi: Trendyol Group storefront, Resmo (JumpCloud tarafından satın alındı), Getir ve Gais Cyber Security.',
      'Aşağıdaki `.md` bağlantıları sayfaların sade markdown sürümleridir. `/tr/llms-full.txt` Hakkımda, deneyim ve listedeki tüm yazıları tek dosyada birleştirir. Aynı yolların `.md`’siz hali HTML’dir.',
    ].join('\n\n'),
    pages: 'Sayfalar',
    blog: 'Blog',
    otherBlog: 'Blog (yalnızca İngilizce)',
    videos: 'Videolar',
    feeds: 'Beslemeler',
    optional: 'Optional',
    homeTitle: 'Ana Sayfa',
    aboutTitle: 'Hakkımda',
    contentsTitle: 'İçerikler',
    toolsTitle: 'Araçlar',
    videosTitle: 'Videolar',
    photosTitle: 'Fotoğraflar',
    dailiesTitle: 'Günlükler',
    home: 'Özet ve son yazılar.',
    about: 'Biyografi, iş geçmişi ve iletişim.',
    contents: 'Blog, video ve fotoğrafların toplandığı yer.',
    toolsNote: 'Masadaki donanımlar ve kısa bir istek listesi.',
    videosPage: 'Kayıtlı konuşmalar ve eğitimler.',
    photos: 'Unsplash’te yayımlanan fotoğraflar.',
    dailies: 'Kısa günlük notlar. Henüz yayımlanmadı.',
    rss: 'Bu dildeki yeni yazılar.',
    rssOther: 'İngilizce yeni yazılar.',
    sitemap: 'Dizine giren tüm HTML adresler.',
    full: 'Hakkımda, deneyim ve aşağıdaki tüm yazılar tek dosyada.',
    otherIndex: 'İngilizce llms.txt, kök dizini kapsar.',
    otherLangNote: 'İngilizce orijinal — Türkçe çeviri yayımlanmadı.',
    alsoIn: 'English',
    present: 'günümüz',
    experience: 'Deneyim',
    fullSummary: 'Tam metin: hakkımda, deneyim ve mevcut tüm yazılar.',
    extraHeading: 'Yalnızca İngilizce yayımlanan yazılar',
  },
} as const;

function originFrom(site: URL | string | undefined): URL {
  return site instanceof URL ? site : new URL(typeof site === 'string' ? site : SITE_URL);
}

function pageUrl(path: string, locale: Locale, site: URL): string {
  return absoluteUrl(localizePath(path, locale), site);
}

function markdownUrl(path: string, locale: Locale, site: URL): string {
  return `${pageUrl(path, locale, site)}.md`;
}

function isoDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function yamlString(value: string): string {
  return JSON.stringify(value);
}

function link(name: string, url: string, note?: string): string {
  return note ? `- [${name}](${url}): ${note}` : `- [${name}](${url})`;
}

function publishedPosts(posts: Post[]): Post[] {
  return posts.filter((post) => post.data.translated);
}

function blogNote(post: Post, locale: Locale, alternateUrl?: string): string {
  const text = copy[locale];
  const date = isoDay(post.data.publishedAt);
  const also = alternateUrl ? ` ([${text.alsoIn}](${alternateUrl}))` : '';
  return `${date}. ${post.data.description}${also}`;
}

function profileLabel(href: string): string {
  const host = new URL(href).hostname.replace(/^www\./, '');
  if (host.includes('unsplash')) return 'Unsplash';
  if (host.includes('medium')) return 'Medium';
  return host;
}

function formatExperience(locale: Locale): string {
  const present = copy[locale].present;

  return EXPERIENCE.map((entry) => {
    const end = entry.end ?? present;
    const roles = entry.roles
      .map((role) => `- ${role.title} (${role.start} – ${role.end ?? present})`)
      .join('\n');

    return `### ${entry.company} (${entry.start} – ${end})\n\n${roles}\n\n${entry[locale].summary}`;
  }).join('\n\n');
}

export function markdownResponse(body: string, describedBy?: string): Response {
  const headers = new Headers({
    'Content-Type': 'text/markdown; charset=utf-8',
  });
  if (describedBy) {
    headers.append('Link', `<${describedBy}>; rel="describedby"`);
  }
  return new Response(body, { headers });
}

export function renderPostMarkdown(post: Post, site: URL): string {
  const path = `/contents/blog/${post.slug}`;
  const tags = post.data.tags.map(yamlString).join(', ');

  const frontmatter = [
    '---',
    `title: ${yamlString(post.data.title)}`,
    `description: ${yamlString(post.data.description)}`,
    `publishedAt: ${post.data.publishedAt.toISOString()}`,
    post.data.updatedAt ? `updatedAt: ${post.data.updatedAt.toISOString()}` : '',
    `tags: [${tags}]`,
    `locale: ${post.locale}`,
    `canonical: ${pageUrl(path, post.locale, site)}`,
    post.data.mediumUrl ? `mediumUrl: ${yamlString(post.data.mediumUrl)}` : '',
    '---',
  ].filter(Boolean);

  return `${frontmatter.join('\n')}\n\n# ${post.data.title}\n\n${post.body?.trim() ?? ''}\n`;
}

export async function renderAboutMarkdown(locale: Locale, site: URL): Promise<string | null> {
  const entry = await getEntry('about', locale);
  if (!entry) return null;

  const text = copy[locale];

  return [
    '---',
    `title: ${yamlString(entry.data.title)}`,
    `description: ${yamlString(entry.data.description)}`,
    `locale: ${locale}`,
    `canonical: ${pageUrl('/about', locale, site)}`,
    '---',
    '',
    `# ${entry.data.heading}`,
    '',
    `${AUTHOR.jobTitle} · ${AUTHOR.location}`,
    '',
    entry.body?.trim() ?? '',
    '',
    `## ${text.experience}`,
    '',
    formatExperience(locale),
    '',
  ].join('\n');
}

export async function renderLlmsTxt(locale: Locale, site?: URL | string): Promise<string> {
  const origin = originFrom(site);
  const text = copy[locale];
  const other = otherLocale(locale);

  const [localPosts, foreignPosts] = await Promise.all([
    getPosts(locale).then(publishedPosts),
    getPosts(other).then(publishedPosts),
  ]);

  const localSlugs = new Set(localPosts.map((post) => post.slug));
  const foreignOnly = foreignPosts.filter((post) => !localSlugs.has(post.slug));
  const foreignBySlug = new Map(foreignPosts.map((post) => [post.slug, post]));

  const blogLinks = localPosts.map((post) => {
    const path = `/contents/blog/${post.slug}`;
    const alt = foreignBySlug.get(post.slug);
    return link(
      post.data.title,
      markdownUrl(path, locale, origin),
      blogNote(post, locale, alt ? markdownUrl(path, other, origin) : undefined),
    );
  });

  const otherBlogLinks = foreignOnly.map((post) => {
    const path = `/contents/blog/${post.slug}`;
    return link(post.data.title, markdownUrl(path, other, origin), `${isoDay(post.data.publishedAt)}. ${text.otherLangNote} ${post.data.description}`);
  });

  const videoLinks = getVideos().map((video) =>
    link(video[locale].title, video.url, `${video.publishedAt}. ${video[locale].description}`),
  );

  const lines = [
    `# ${AUTHOR.name}`,
    `> ${text.summary}`,
    '',
    text.details,
    '',
    `## ${text.pages}`,
    link(text.homeTitle, pageUrl('/', locale, origin), text.home),
    link(text.aboutTitle, markdownUrl('/about', locale, origin), text.about),
    link(text.contentsTitle, pageUrl('/contents', locale, origin), text.contents),
    link(text.toolsTitle, pageUrl('/tools', locale, origin), text.toolsNote),
    link(text.videosTitle, pageUrl('/contents/videos', locale, origin), text.videosPage),
    link(text.photosTitle, pageUrl('/contents/photos', locale, origin), text.photos),
    link(text.dailiesTitle, pageUrl('/dailies', locale, origin), text.dailies),
    '',
    `## ${text.blog}`,
    ...blogLinks,
    ...(otherBlogLinks.length ? ['', `## ${text.otherBlog}`, ...otherBlogLinks] : []),
    '',
    `## ${text.videos}`,
    ...videoLinks,
    '',
    `## ${text.feeds}`,
    link('RSS', pageUrl('/rss.xml', locale, origin), text.rss),
    link(`RSS (${other})`, pageUrl('/rss.xml', other, origin), text.rssOther),
    link('Sitemap', pageUrl('/sitemap.xml', 'en', origin), text.sitemap),
    link('llms-full.txt', pageUrl('/llms-full.txt', locale, origin), text.full),
    '',
    `## ${text.optional}`,
    link(`llms.txt (${other})`, pageUrl('/llms.txt', other, origin), text.otherIndex),
    ...SOCIALS.map((social) => link(social.label, social.href)),
    ...EXTRA_PROFILES.map((href) => link(profileLabel(href), href)),
    '',
  ];

  return lines.join('\n');
}

export async function renderLlmsFullTxt(locale: Locale, site?: URL | string): Promise<string> {
  const origin = originFrom(site);
  const text = copy[locale];
  const other = otherLocale(locale);

  const [about, localPosts, foreignPosts] = await Promise.all([
    renderAboutMarkdown(locale, origin),
    getPosts(locale).then(publishedPosts),
    getPosts(other).then(publishedPosts),
  ]);

  const localSlugs = new Set(localPosts.map((post) => post.slug));
  const extra = foreignPosts.filter((post) => !localSlugs.has(post.slug));

  const parts = [
    `# ${AUTHOR.name}\n\n> ${text.fullSummary}`,
    about,
    ...localPosts.map((post) => renderPostMarkdown(post, origin)),
  ];

  if (extra.length) {
    parts.push(`## ${text.extraHeading}`, ...extra.map((post) => renderPostMarkdown(post, origin)));
  }

  return `${parts.filter(Boolean).join('\n\n')}\n`;
}
