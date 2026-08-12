#!/usr/bin/env node
/**
 * Imports the Medium archive into local markdown.
 *
 * The RSS feed carries the full article HTML, so the conversion is lossless
 * apart from Medium's tracking pixel. Images are downloaded next to the repo so
 * the site never hot-links Medium's CDN, and every post gets a Turkish file
 * with the full text plus an English scaffold to translate into.
 *
 * Usage: node scripts/migrate-medium.mjs [--feed <path-or-url>]
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import TurndownService from 'turndown';

import { buildFrontmatter, decodeEntities, slugify, stripTags, truncate } from './lib/text.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FEED_URL = 'https://cihatata.medium.com/feed';
const IMAGE_DIR = path.join(ROOT, 'src/assets/blog');
const CONTENT_DIR = path.join(ROOT, 'src/content/blog');
/** Depth from `src/content/blog/<locale>/<slug>.md` back up to `src/`. */
const ASSET_PREFIX = '../../../assets/blog';

const argFeed = process.argv.indexOf('--feed');
const feedSource = argFeed !== -1 ? process.argv[argFeed + 1] : FEED_URL;

// --------------------------------------------------------------------------
// Feed parsing
// --------------------------------------------------------------------------

async function loadFeed(source) {
  if (existsSync(source)) return readFile(source, 'utf8');

  const response = await fetch(source, { headers: { 'user-agent': 'cihatata.dev-importer' } });
  if (!response.ok) throw new Error(`Feed request failed: ${response.status}`);
  return response.text();
}

function parseItems(xml) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => {
    const pick = (tag) => {
      const match = item.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`));
      return match ? match[1].trim() : '';
    };

    return {
      title: decodeEntities(pick('title')),
      link: pick('link').split('?')[0],
      pubDate: pick('pubDate'),
      categories: [...item.matchAll(/<category><!\[CDATA\[([\s\S]*?)\]\]><\/category>/g)].map(
        ([, value]) => value,
      ),
      html: pick('content:encoded'),
    };
  });
}

/** The trailing hex segment of a Medium story URL is its stable id. */
function mediumId(link) {
  const last = link.split('/').pop() ?? '';
  const match = last.match(/-([0-9a-f]{8,})$/);
  return match ? match[1] : last;
}

// --------------------------------------------------------------------------
// HTML clean-up
// --------------------------------------------------------------------------

function stripTrackingPixel(html) {
  return html.replace(/<img[^>]*medium\.com\/_\/stat[^>]*>/g, '');
}

/**
 * Medium wraps embeds in an empty iframe whose inner link points at its
 * /media/<id>/href redirector. That endpoint answers 403 to anything that is
 * not a browser, so resolved embeds are pinned in medium-posts.json and the
 * pinned code is inlined instead of leaving a dead link in the article.
 */
function resolveEmbeds(html, embeds) {
  const iframes = [...html.matchAll(/<iframe[^>]*>([\s\S]*?)<\/iframe>/g)];
  let output = html;

  for (const [full, inner] of iframes) {
    const target = inner.match(/href="([^"]+)"/)?.[1] ?? '';
    const mediaId = target.match(/medium\.com\/media\/([0-9a-f]+)/)?.[1];
    const pinned = mediaId ? embeds[mediaId] : undefined;

    if (pinned) {
      const language = pinned.language ?? '';
      const escaped = pinned.code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      const attribution = pinned.source
        ? `<p><a href="${pinned.source}">${pinned.source}</a></p>`
        : '';
      output = output.replace(full, `<pre data-language="${language}">${escaped}</pre>${attribution}`);
      continue;
    }

    if (target && !target.includes('medium.com/media/')) {
      output = output.replace(full, `<p><a href="${target}">${target}</a></p>`);
      continue;
    }

    console.warn(`! Unresolved embed ${mediaId ?? target}; add it to medium-posts.json.`);
    output = output.replace(full, '');
  }

  return output;
}

/** Pulls the opening figure out of the body so it can become the hero image. */
function extractHero(html) {
  const match = html.match(/^\s*<figure>([\s\S]*?)<\/figure>/);
  if (!match) return { html, hero: null };

  const src = match[1].match(/<img[^>]*src="([^"]+)"/)?.[1];
  if (!src) return { html, hero: null };

  const caption = match[1].match(/<figcaption>([\s\S]*?)<\/figcaption>/)?.[1] ?? '';

  return {
    html: html.slice(match[0].length),
    hero: { src, caption: caption ? stripTags(caption) : '' },
  };
}

// --------------------------------------------------------------------------
// Images
// --------------------------------------------------------------------------

const EXTENSION_BY_TYPE = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
};

/** Medium serves resized derivatives; ask for a size worth optimising locally. */
function upscale(url) {
  return url.replace(/\/max\/\d+\//, '/max/2000/');
}

async function downloadImage(url, slug, index) {
  const targetDir = path.join(IMAGE_DIR, slug);
  await mkdir(targetDir, { recursive: true });

  const response = await fetch(upscale(url), {
    headers: { 'user-agent': 'cihatata.dev-importer' },
  });
  if (!response.ok) throw new Error(`Image request failed (${response.status}): ${url}`);

  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType = (response.headers.get('content-type') ?? '').split(';')[0];
  const fromUrl = path.extname(new URL(url).pathname).toLowerCase();
  const extension = EXTENSION_BY_TYPE[contentType] ?? (fromUrl || '.jpg');

  const name = `${String(index + 1).padStart(2, '0')}${extension}`;
  await writeFile(path.join(targetDir, name), buffer);

  return name;
}

// --------------------------------------------------------------------------
// Markdown conversion
// --------------------------------------------------------------------------

/** Medium strips the language from code blocks, so infer it from the source. */
function guessLanguage(code) {
  const sample = code.trim();
  if (/^<\/?[a-z]/i.test(sample)) return 'html';
  if (/^[.#@:a-z*\[][^\n{]*\{[\s\S]*:[\s\S]*\}/m.test(sample)) return 'css';
  if (/\b(const|let|function|=>|import |export )\b/.test(sample)) return 'js';
  if (/^\s*[$>] /m.test(sample)) return 'bash';
  return '';
}

function createTurndown() {
  const service = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    emDelimiter: '_',
    strongDelimiter: '**',
    linkStyle: 'inlined',
  });

  // The post title is rendered as the page h1, so section headings shift down.
  // Medium authors often bold the whole heading, which is noise once it is one.
  service.addRule('demoteHeadings', {
    filter: ['h1', 'h2', 'h3', 'h4', 'h5'],
    replacement: (content, node) => {
      const original = Number(node.nodeName.charAt(1));
      const level = Math.min(Math.max(original - 1, 2), 6);
      const text = content.trim().replace(/^\*\*([\s\S]+)\*\*$/, '$1').trim();
      return `\n\n${'#'.repeat(level)} ${text}\n\n`;
    },
  });

  // Medium encodes code blocks as a single <pre> with <br> line breaks.
  service.addRule('preBlocks', {
    filter: 'pre',
    replacement: (_content, node) => {
      const code = decodeEntities(
        node.innerHTML.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ''),
      ).replace(/\n+$/, '');
      const language = node.getAttribute('data-language') || guessLanguage(code);
      return `\n\n\`\`\`${language}\n${code}\n\`\`\`\n\n`;
    },
  });

  // Images keep their caption as an italic paragraph the prose styles pick up.
  service.addRule('figures', {
    filter: 'figure',
    replacement: (_content, node) => {
      const img = node.querySelector('img');
      if (!img) return '';

      const src = img.getAttribute('src') ?? '';
      const captionNode = node.querySelector('figcaption');
      const caption = captionNode ? service.turndown(captionNode.innerHTML).trim() : '';
      // Medium leaves alt empty; the caption is the best description we have,
      // but it has to be plain text so it cannot break the image syntax.
      const alt = (img.getAttribute('alt') || stripTags(captionNode?.innerHTML ?? '')).replace(
        /[[\]]/g,
        '',
      );

      return `\n\n![${alt}](${src})\n\n${caption ? `_${caption}_\n\n` : ''}`;
    },
  });

  service.addRule('dropEmptyParagraphs', {
    filter: (node) => node.nodeName === 'P' && node.textContent.trim() === '' && !node.querySelector('img'),
    replacement: () => '',
  });

  return service;
}

function tidyMarkdown(markdown) {
  return `${markdown
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()}\n`;
}

// --------------------------------------------------------------------------
// Main
// --------------------------------------------------------------------------

async function main() {
  const overrides = JSON.parse(await readFile(path.join(ROOT, 'scripts/medium-posts.json'), 'utf8'));
  const feed = await loadFeed(feedSource);
  const items = parseItems(feed);
  const turndown = createTurndown();

  await mkdir(path.join(CONTENT_DIR, 'tr'), { recursive: true });
  await mkdir(path.join(CONTENT_DIR, 'en'), { recursive: true });

  const summary = [];

  for (const item of items) {
    const id = mediumId(item.link);
    const meta = overrides.posts[id];

    if (!meta) {
      console.warn(`! No curated metadata for "${item.title}" (${id}); skipping.`);
      continue;
    }

    const slug = meta.slug ?? slugify(item.title);

    let html = stripTrackingPixel(item.html);
    html = resolveEmbeds(html, overrides.embeds ?? {});

    const { html: body, hero } = extractHero(html);

    // Collect every remaining image, download it, and swap in the local path.
    const remoteImages = [...body.matchAll(/<img[^>]*src="([^"]+)"/g)].map(([, src]) => src);
    const sources = [...new Set([...(hero ? [hero.src] : []), ...remoteImages])];

    const localBySource = new Map();
    for (const [index, source] of sources.entries()) {
      const name = await downloadImage(source, slug, index);
      localBySource.set(source, `${ASSET_PREFIX}/${slug}/${name}`);
    }

    let markdown = tidyMarkdown(turndown.turndown(body));
    for (const [source, local] of localBySource) {
      markdown = markdown.split(source).join(local);
    }

    const plain = stripTags(body);
    const publishedAt = new Date(item.pubDate).toISOString();
    const heroPath = hero ? localBySource.get(hero.src) : undefined;

    for (const locale of ['tr', 'en']) {
      const localeMeta = meta[locale];
      const isSource = locale === 'tr';

      const frontmatter = buildFrontmatter({
        title: localeMeta.title,
        description: localeMeta.description ?? truncate(plain),
        publishedAt,
        tags: localeMeta.tags,
        heroImage: heroPath,
        heroImageAlt: localeMeta.title,
        heroImageCredit: hero?.caption || undefined,
        mediumUrl: item.link,
        // English versions start as a copy of the Turkish text so the structure,
        // images and links survive translation; flip this once translated.
        translated: isSource ? undefined : false,
      });

      const target = path.join(CONTENT_DIR, locale, `${slug}.md`);

      if (!isSource && existsSync(target)) {
        const current = await readFile(target, 'utf8');
        if (!/^translated:\s*false\s*$/m.test(current)) {
          console.log(`= Keeping translated English post: ${slug}`);
          continue;
        }
      }

      await writeFile(target, `${frontmatter}\n${markdown}`);
    }

    summary.push({ slug, images: sources.length, words: plain.split(/\s+/).length });
    console.log(`✓ ${slug} (${sources.length} images)`);
  }

  console.log(`\nImported ${summary.length} posts into src/content/blog.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
