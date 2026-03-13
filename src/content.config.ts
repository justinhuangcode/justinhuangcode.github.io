import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      date: z.coerce.date(),
      category: z.string().default('General'),
      image: image().optional(),
      tags: z.array(z.string()).optional(),
      pinned: z.boolean().default(false),
    }),
});

export const collections = { posts };
