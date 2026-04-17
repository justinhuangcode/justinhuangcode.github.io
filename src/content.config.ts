import { defineCollection, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { createAitherContentSchema } from '@aither/astro/content';

/**
 * Base schema shared by all content sections (posts, translations, notes, etc.)
 * To add a new section:
 * 1. Copy the `posts` definition below, change the name and base path
 * 2. Add matching config in src/config/site.ts → sections
 * 3. Create content in src/content/{section-id}/{locale}/
 */
const contentSchema = ({ image }: SchemaContext) =>
  createAitherContentSchema({ image });

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: contentSchema,
});

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/gallery' }),
  schema: ({ image }) =>
    createAitherContentSchema({ image }).extend({
      cover: z.string().optional(),
      images: z.array(z.string()).min(1),
      device: z.string().optional(),
      location: z.string().optional(),
    }),
});

const translations = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/translations' }),
  schema: ({ image }) =>
    createAitherContentSchema({ image }).extend({
      sourceLanguage: z.string().optional(),
      sourceTitle: z.string().optional(),
      sourceUrl: z
        .string()
        .refine(
          (value) =>
            value.startsWith('/') || z.url().safeParse(value).success,
          'sourceUrl must be an absolute URL or a site-relative path',
        )
        .optional(),
      translator: z.string().optional(),
    }),
});

export const collections = { posts, gallery, translations };
