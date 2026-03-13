import { siteConfig } from '@/config/site';

export function GET() {
  const site = siteConfig.url;

  const lines = [
    'User-agent: *',
    'Allow: /',
    '',
    '# AI Crawlers — Welcome',
    'User-agent: GPTBot',
    'Allow: /',
    '',
    'User-agent: ClaudeBot',
    'Allow: /',
    '',
    'User-agent: Google-Extended',
    'Allow: /',
    '',
    'User-agent: PerplexityBot',
    'Allow: /',
    '',
    'User-agent: Bytespider',
    'Allow: /',
    '',
    `Sitemap: ${site}/sitemap-index.xml`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
