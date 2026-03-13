import { siteConfig } from '@/config/site';
import { getPostsByLocale, getSlug } from '@/lib/posts';

export async function GET() {
  const posts = await getPostsByLocale('de');
  const site = siteConfig.url;

  const sections = [
    `# ${siteConfig.name}`,
    '',
    `> ${siteConfig.description}`,
    '',
  ];

  for (const post of posts) {
    const slug = getSlug(post.id);
    sections.push(`---`);
    sections.push('');
    sections.push(`## ${post.data.title}`);
    sections.push('');
    sections.push(`URL: ${site}/de/posts/${slug}/`);
    sections.push(`Date: ${post.data.date.toISOString().split('T')[0]}`);
    if (post.data.category) sections.push(`Category: ${post.data.category}`);
    if (post.data.tags?.length) sections.push(`Tags: ${post.data.tags.join(', ')}`);
    if (post.data.description) sections.push(`Description: ${post.data.description}`);
    sections.push('');
    if (post.body) {
      sections.push(post.body);
      sections.push('');
    }
  }

  return new Response(sections.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
