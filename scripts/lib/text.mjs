const TURKISH_MAP = {
  ç: 'c',
  Ç: 'c',
  ğ: 'g',
  Ğ: 'g',
  ı: 'i',
  İ: 'i',
  ö: 'o',
  Ö: 'o',
  ş: 's',
  Ş: 's',
  ü: 'u',
  Ü: 'u',
};

/** ASCII slug that keeps Turkish words readable instead of dropping characters. */
export function slugify(input) {
  return input
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, (char) => TURKISH_MAP[char] ?? char)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function decodeEntities(input) {
  const named = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': "'",
    '&nbsp;': ' ',
    '&hellip;': '…',
    '&mdash;': '—',
    '&ndash;': '–',
    '&rsquo;': '’',
    '&lsquo;': '‘',
    '&ldquo;': '“',
    '&rdquo;': '”',
  };

  return input
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&[a-z]+;/gi, (entity) => named[entity] ?? entity);
}

export function stripTags(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

/** Trims to a whole word near `limit` so meta descriptions never cut mid-word. */
export function truncate(text, limit = 158) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= limit) return clean;
  const slice = clean.slice(0, limit);
  const cut = slice.lastIndexOf(' ');
  return `${slice.slice(0, cut > limit * 0.6 ? cut : limit).replace(/[.,;:—–-]$/, '')}…`;
}

/** Serialises a value into YAML that is safe for Astro frontmatter. */
export function toYamlValue(value) {
  if (Array.isArray(value)) {
    return `[${value.map((entry) => toYamlValue(entry)).join(', ')}]`;
  }
  if (typeof value === 'boolean' || typeof value === 'number') {
    return String(value);
  }
  return `'${String(value).replace(/'/g, "''")}'`;
}

export function buildFrontmatter(fields) {
  const lines = Object.entries(fields)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${key}: ${toYamlValue(value)}`);

  return `---\n${lines.join('\n')}\n---\n`;
}
