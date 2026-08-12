#!/usr/bin/env node
/**
 * Snapshots the Unsplash profile into src/data/unsplash.json at build time so
 * the running site never calls the API. Unsplash requires that the delivered
 * images stay hot-linked to their CDN, so only metadata is stored locally.
 *
 * Usage: UNSPLASH_ACCESS_KEY=... node scripts/fetch-unsplash.mjs
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT = path.join(ROOT, 'src/data/unsplash.json');
const USERNAME = 'cihatata';
const PER_PAGE = 30;
const API = 'https://api.unsplash.com';

/** Reads UNSPLASH_ACCESS_KEY from the environment, falling back to .env. */
async function accessKey() {
  if (process.env.UNSPLASH_ACCESS_KEY) return process.env.UNSPLASH_ACCESS_KEY;

  const envPath = path.join(ROOT, '.env');
  if (!existsSync(envPath)) return undefined;

  const match = (await readFile(envPath, 'utf8')).match(/^UNSPLASH_ACCESS_KEY=(.*)$/m);
  return match?.[1]?.trim().replace(/^["']|["']$/g, '') || undefined;
}

async function request(url, key) {
  const response = await fetch(url, {
    headers: { Authorization: `Client-ID ${key}`, 'Accept-Version': 'v1' },
  });

  if (!response.ok) {
    throw new Error(`Unsplash request failed (${response.status}): ${await response.text()}`);
  }

  return response.json();
}

function normalise(photo) {
  return {
    id: photo.id,
    slug: photo.slug ?? photo.id,
    createdAt: photo.created_at,
    width: photo.width,
    height: photo.height,
    color: photo.color,
    blurHash: photo.blur_hash,
    description: photo.description ?? photo.alt_description ?? null,
    altDescription: photo.alt_description ?? photo.description ?? null,
    likes: photo.likes,
    downloads: photo.downloads ?? null,
    urls: {
      raw: photo.urls.raw,
      full: photo.urls.full,
      regular: photo.urls.regular,
      small: photo.urls.small,
      thumb: photo.urls.thumb,
    },
    link: photo.links.html,
  };
}

async function main() {
  const key = await accessKey();
  if (!key) {
    console.error(
      'UNSPLASH_ACCESS_KEY is not set. Copy .env.example to .env or export the variable.',
    );
    process.exit(1);
  }

  const user = await request(`${API}/users/${USERNAME}`, key);

  const photos = [];
  for (let page = 1; ; page += 1) {
    const batch = await request(
      `${API}/users/${USERNAME}/photos?page=${page}&per_page=${PER_PAGE}&order_by=latest&stats=false`,
      key,
    );
    photos.push(...batch);
    if (batch.length < PER_PAGE) break;
  }

  const payload = {
    // Regenerate with `pnpm fetch:unsplash`.
    generatedAt: new Date().toISOString(),
    profile: {
      username: user.username,
      name: user.name,
      link: user.links.html,
      totalPhotos: user.total_photos,
      totalLikes: user.total_likes,
      bio: user.bio ?? null,
    },
    photos: photos.map(normalise),
  };

  await mkdir(path.dirname(OUTPUT), { recursive: true });
  await writeFile(OUTPUT, `${JSON.stringify(payload, null, 2)}\n`);

  console.log(`✓ Saved ${payload.photos.length} photos to src/data/unsplash.json`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
