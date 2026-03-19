import { defineCollection, type SchemaContext } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const isoDateTimeWithSeconds = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/,
    'Use ISO 8601 with seconds and timezone, e.g. 2026-03-19T16:27:43+08:00'
  );

const isoDateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD or full ISO 8601 with timezone');

const contentDate = z.union([isoDateTimeWithSeconds, isoDateOnly]).pipe(z.coerce.date());

const contentSchema = ({ image }: SchemaContext) =>
  z.object({
    title: z.string(),
    description: z.string().optional(),
    // Prefer a full ISO 8601 timestamp with timezone.
    // Keep date-only support for backward compatibility with existing content.
    date: contentDate,
    category: z.string().default('General'),
    image: image().optional(),
    tags: z.array(z.string()).optional(),
    pinned: z.boolean().default(false),
  });

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: contentSchema,
});

export const collections = { posts };
