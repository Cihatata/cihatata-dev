#!/usr/bin/env node
/**
 * Copies the product shots from the previous cihatata.dev build into this repo
 * so the tools page stops depending on the old deployment.
 *
 * Usage: node scripts/fetch-tools-assets.mjs
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = path.join(ROOT, 'src/assets/tools');
const ORIGIN = 'https://www.cihatata.dev';

/** Source path on the old site, mapped to the filename used here. */
const IMAGES = {
  '/mackbook-air-m1.png': 'macbook-air-m1.png',
  '/magic-keyboard-.png': 'magic-keyboard.png',
  '/magic-trackpad-.png': 'magic-trackpad.png',
  '/airpods-3-.png': 'airpods-3.png',
  '/ultrafine-monitor-.png': 'lg-ultrafine-ergo.png',
  '/pomodoro-.png': 'pomodoro-timer.png',
  // Next's optimizer re-encodes this one as JPEG despite the .webp source.
  '/mx-vertical-.webp': 'mx-vertical.jpg',
  '/ekran-yukseltici-.png': 'monitor-riser.png',
  '/masa.jpg': 'standing-desk.jpg',
  '/markus-.png': 'ikea-markus.png',
  '/xbox-series-x.png': 'xbox-series-x.png',
  '/hue-play-.png': 'philips-hue-play.png',
  '/nuphy-air-.png': 'nuphy-air-75.png',
  '/ipad-pro-m4.png': 'ipad-pro-m4.png',
};

/** Next.js only serves these through its optimizer at fixed widths. */
function sourceUrl(remotePath) {
  return `${ORIGIN}/_next/image?url=${encodeURIComponent(remotePath)}&w=750&q=90`;
}

async function main() {
  await mkdir(TARGET, { recursive: true });

  for (const [remotePath, filename] of Object.entries(IMAGES)) {
    const response = await fetch(sourceUrl(remotePath), {
      headers: { 'user-agent': 'cihatata.dev-importer', accept: 'image/*' },
    });

    if (!response.ok) {
      console.warn(`! ${remotePath} → ${response.status}`);
      continue;
    }

    await writeFile(path.join(TARGET, filename), Buffer.from(await response.arrayBuffer()));
    console.log(`✓ ${filename}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
