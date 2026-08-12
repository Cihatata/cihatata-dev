#!/usr/bin/env node
/**
 * Renders the PNG/ICO icon set and the default Open Graph card from the same
 * monogram used by public/favicon.svg.
 *
 * Usage: node scripts/generate-icons.mjs
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public');

const INK = '#14161d';
const PAPER = '#fbfbfd';

/** The favicon SVG without the media query, so raster output is deterministic. */
function monogram({ plate, mark, radius = 14 }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="${radius}" fill="${plate}"/>
  <path d="M42.93 18.98A17 17 0 1 0 42.93 45.02" fill="none" stroke="${mark}" stroke-width="7.5" stroke-linecap="round"/>
</svg>`;
}

const DARK_PLATE = Buffer.from(monogram({ plate: INK, mark: PAPER }));
// iOS masks the icon itself, so the apple-touch variant needs square corners.
const APPLE_PLATE = Buffer.from(monogram({ plate: INK, mark: PAPER, radius: 0 }));

async function png(source, size, filename) {
  await sharp(source, { density: 512 })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(PUBLIC, filename));
  console.log(`✓ ${filename}`);
}

/** Minimal ICO container around a single 32x32 PNG frame. */
async function ico(source, filename) {
  const frame = await sharp(source, { density: 512 }).resize(32, 32).png().toBuffer();

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);

  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0);
  entry.writeUInt8(32, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(frame.length, 8);
  entry.writeUInt32LE(header.length + entry.length, 12);

  await writeFile(path.join(PUBLIC, filename), Buffer.concat([header, entry, frame]));
  console.log(`✓ ${filename}`);
}

/** 1200x630 social card: monogram, name and role on the site's light paper. */
async function openGraph() {
  const card = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="wash" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#eef2fb"/>
      <stop offset="55%" stop-color="${PAPER}"/>
      <stop offset="100%" stop-color="#f7eef6"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#wash)"/>
  <circle cx="120" cy="80" r="260" fill="#8fb3ff" opacity="0.16"/>
  <circle cx="1120" cy="560" r="240" fill="#f0a8d8" opacity="0.14"/>

  <g transform="translate(96 232)">
    <rect width="120" height="120" rx="26" fill="${INK}"/>
    <g transform="translate(60 60) scale(1.875) translate(-32 -32)">
      <path d="M42.93 18.98A17 17 0 1 0 42.93 45.02" fill="none" stroke="${PAPER}" stroke-width="7.5" stroke-linecap="round"/>
    </g>
  </g>

  <text x="252" y="292" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="76" font-weight="600" letter-spacing="-2" fill="${INK}">Cihat ATA</text>
  <text x="252" y="348" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="34" font-weight="400" fill="#5b6070">Software Engineer · Ankara</text>
  <text x="96" y="556" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="28" font-weight="500" letter-spacing="1" fill="#7a8090">cihatata.dev</text>
</svg>`;

  await sharp(Buffer.from(card)).png().toFile(path.join(PUBLIC, 'og-default.png'));
  console.log('✓ og-default.png');
}

async function main() {
  await mkdir(PUBLIC, { recursive: true });

  await png(DARK_PLATE, 32, 'favicon-32x32.png');
  await png(DARK_PLATE, 192, 'icon-192.png');
  await png(DARK_PLATE, 512, 'icon-512.png');
  await png(APPLE_PLATE, 180, 'apple-touch-icon.png');
  await ico(DARK_PLATE, 'favicon.ico');
  await openGraph();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
