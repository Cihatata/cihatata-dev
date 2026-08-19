import type { APIRoute } from 'astro';

import { markdownResponse, renderLlmsFullTxt } from '~/lib/llms';

export const prerender = true;

export const GET: APIRoute = async ({ site }) =>
  markdownResponse(await renderLlmsFullTxt('en', site));
