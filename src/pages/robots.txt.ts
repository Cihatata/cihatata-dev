import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const origin = (site ?? new URL('https://cihatata.dev')).origin;

  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${origin}/sitemap.xml`,
    '',
    '# LLM-readable index — https://llmstxt.org',
    `# ${origin}/llms.txt`,
    `# ${origin}/llms-full.txt`,
    `# ${origin}/tr/llms.txt`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
