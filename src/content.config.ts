import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Posts live at `src/content/blog/<locale>/<slug>.md`, so the generated entry
 * id doubles as the locale + slug pair.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      heroImage: image().optional(),
      heroImageAlt: z.string().optional(),
      heroImageCredit: z.string().optional(),
      mediumUrl: z.url().optional(),
      /** English imports start untranslated and are hidden from search engines. */
      translated: z.boolean().default(true),
      draft: z.boolean().default(false),
    }),
});

/** One markdown file per locale, named after the locale code. */
const about = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/about' }),
  schema: z.object({
    title: z.string(),
    heading: z.string(),
    description: z.string(),
  }),
});

export const collections = { blog, about };
