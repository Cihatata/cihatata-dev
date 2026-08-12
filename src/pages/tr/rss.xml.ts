import type { APIRoute } from 'astro';

import { renderFeed } from '~/lib/feed';

export const prerender = true;

export const GET: APIRoute = ({ site }) => renderFeed('tr', site);
