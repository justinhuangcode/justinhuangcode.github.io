import { siteConfig } from '@/config/site';
import { getPostsByLocale, getSlug } from '@/lib/posts';

export async function GET() {
  const posts = await getPostsByLocale('de');
  const site = siteConfig.url;

  const lines = [
    `# ${siteConfig.name}`,
    '',
    `> ${siteConfig.description}`,
    '',
    `## About`,
    '',
    `${siteConfig.name} is an AI-native Astro blog theme that believes text itself is beautiful.`,
    '',
    `- Site: ${site}`,
    `- RSS: ${site}/rss.xml`,
    `- Full content: ${site}/de/llms-full.txt`,
    `- Individual posts: append .md to any post URL (e.g. /de/posts/hello-world.md)`,
    `- JSON API: ${site}/api/posts.json`,
    '',
    `## Blog Posts`,
    '',
    ...posts.map((post) => {
      const slug = getSlug(post.id);
      const desc = post.data.description ? `: ${post.data.description}` : '';
      return `- [${post.data.title}](${site}/de/posts/${slug}/)${desc}`;
    }),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
