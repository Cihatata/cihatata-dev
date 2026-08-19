import type { APIRoute } from 'astro';

import { markdownResponse, renderAboutMarkdown } from '~/lib/llms';
import { SITE_URL } from '~/config/site';
import { absoluteUrl } from '~/i18n/utils';

export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
  const origin = site ?? new URL(SITE_URL);
  const body = await renderAboutMarkdown('en', origin);
  if (!body) return new Response(null, { status: 404 });

  return markdownResponse(body, absoluteUrl('/llms.txt', origin));
};
