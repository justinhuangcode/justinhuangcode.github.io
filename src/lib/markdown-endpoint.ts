import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getPostsByLocale, getSlug } from '@/lib/posts';
import type { Locale } from '@/i18n';

const CONTENT_DIR = resolve(process.cwd(), 'src/content/posts');

export function createMarkdownStaticPaths(locale: Locale) {
  return async () => {
    const posts = await getPostsByLocale(locale);
    return posts.map((post) => ({
      params: { slug: getSlug(post.id) },
      props: { postId: post.id },
    }));
  };
}

export function createMarkdownResponse(postId: string) {
  const filePath = resolve(CONTENT_DIR, `${postId}.md`);
  const raw = readFileSync(filePath, 'utf-8');

  return new Response(raw, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
