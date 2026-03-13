import { siteConfig } from '@/config/site';
import { getPostsByLocale, getSlug } from '@/lib/posts';
import { locales } from '@/i18n';

export async function GET() {
  const data: Record<string, unknown[]> = {};

  for (const locale of locales) {
    const posts = await getPostsByLocale(locale);
    data[locale] = posts.map((post) => {
      const slug = getSlug(post.id);
      const prefix = locale === 'en' ? '' : `/${locale}`;
      return {
        slug,
        title: post.data.title,
        date: post.data.date.toISOString().split('T')[0],
        category: post.data.category,
        description: post.data.description || null,
        tags: post.data.tags || [],
        pinned: post.data.pinned,
        url: `${siteConfig.url}${prefix}/posts/${slug}/`,
        markdown: `${siteConfig.url}${prefix}/posts/${slug}.md`,
      };
    });
  }

  return new Response(JSON.stringify(data, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
