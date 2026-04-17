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

// --- Add new sections below (copy & rename) ---
// const translations = defineCollection({
//   loader: glob({ pattern: '**/*.mdx', base: './src/content/translations' }),
//   schema: contentSchema,
// });

export const collections = { posts, gallery };
