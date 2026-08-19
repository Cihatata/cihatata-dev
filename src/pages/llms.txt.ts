import type { APIRoute } from 'astro';

import { markdownResponse, renderLlmsTxt } from '~/lib/llms';

export const prerender = true;

export const GET: APIRoute = async ({ site }) => markdownResponse(await renderLlmsTxt('en', site));
