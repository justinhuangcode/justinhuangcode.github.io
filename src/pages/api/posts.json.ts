import { locales } from '@/i18n';
import { getPostsByLocale, getSlug } from '@/lib/posts';
import {
  getPostMarkdownPath,
  getPostPath,
  toAbsoluteSiteUrl,
} from '@/lib/site-content';

export async function GET() {
  const data: Record<string, unknown[]> = {};

  for (const locale of locales) {
    const posts = await getPostsByLocale(locale);
    data[locale] = posts.map((post) => {
      const slug = getSlug(post.id);
      return {
        slug,
        title: post.data.title,
        date: post.data.date.toISOString().split('T')[0],
        published_at: post.data.date.toISOString(),
        category: post.data.category,
        description: post.data.description || null,
        tags: post.data.tags || [],
        pinned: post.data.pinned,
        url: toAbsoluteSiteUrl(getPostPath(locale, slug)),
        markdown: toAbsoluteSiteUrl(getPostMarkdownPath(locale, slug)),
      };
    });
  }

  return new Response(JSON.stringify(data, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
