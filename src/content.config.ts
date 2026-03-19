import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const isoDateTimeWithSeconds = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/,
    'Use ISO 8601 with seconds and timezone, e.g. 2026-03-19T16:27:43+08:00'
  )
  .pipe(z.coerce.date());

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      date: isoDateTimeWithSeconds,
      category: z.string().default('General'),
      image: image().optional(),
      tags: z.array(z.string()).optional(),
      pinned: z.boolean().default(false),
    }),
});

export const collections = { posts };
