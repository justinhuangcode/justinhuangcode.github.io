import rss from '@astrojs/rss';
import { siteConfig } from '@/config/site';
import { getPostsByLocale, getSlug } from '@/lib/posts';

export async function GET() {
  const posts = await getPostsByLocale('en');

  return rss({
    title: siteConfig.name,
    description: siteConfig.description,
    site: siteConfig.url,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/posts/${getSlug(post.id)}/`,
      content: post.body,
      categories: post.data.tags,
    })),
  });
}
