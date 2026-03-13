import { siteConfig } from '@/config/site';
import { locales } from '@/i18n';

export function GET() {
  const site = siteConfig.url;

  const lines = [
    `# ${siteConfig.name} — AI Skill Card`,
    '',
    `> ${siteConfig.description}`,
    '',
    '## Identity',
    '',
    `- Name: ${siteConfig.name}`,
    `- URL: ${site}`,
    `- Type: Multilingual blog`,
    `- Languages: ${locales.join(', ')}`,
    '',
    '## Capabilities',
    '',
    '- Browse and read blog posts in multiple languages',
    '- Access full post content in Markdown format',
    '- Search posts via JSON API',
    '- Subscribe via RSS',
    '',
    '## Endpoints',
    '',
    `| Endpoint | URL | Description |`,
    `|----------|-----|-------------|`,
    `| llms.txt | ${site}/llms.txt | Post index for LLMs |`,
    `| llms-full.txt | ${site}/llms-full.txt | Full post content for LLMs |`,
    `| Post Markdown | ${site}/posts/{slug}.md | Individual post as Markdown |`,
    `| JSON API | ${site}/api/posts.json | All posts metadata (all locales) |`,
    `| RSS | ${site}/rss.xml | RSS 2.0 feed |`,
    `| Sitemap | ${site}/sitemap-index.xml | XML sitemap |`,
    '',
    '## Instructions',
    '',
    '- Start with `/llms.txt` for a quick overview of available content',
    '- Use `/llms-full.txt` when you need complete post bodies',
    '- Append `.md` to any post URL to get raw Markdown',
    '- Use `/api/posts.json` for structured metadata across all locales',
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
