import type { APIRoute } from 'astro';

import { getPost } from '~/lib/blog';
import { markdownResponse, renderPostMarkdown } from '~/lib/llms';
import { SITE_URL } from '~/config/site';
import { absoluteUrl } from '~/i18n/utils';

export const GET: APIRoute = async ({ params, site }) => {
  const slug = params.slug;
  if (!slug) return new Response(null, { status: 404 });

  const post = await getPost('en', slug);
  if (!post || !post.data.translated) return new Response(null, { status: 404 });

  const origin = site ?? new URL(SITE_URL);
  return markdownResponse(renderPostMarkdown(post, origin), absoluteUrl('/llms.txt', origin));
};
