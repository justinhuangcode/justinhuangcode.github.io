import { siteConfig } from '@/config/site';
import { getMessages } from '@/i18n';

export function GET() {
  const m = getMessages('zh-hant');
  const content = [
    '---',
    `title: ${m.about.title}`,
    `url: ${siteConfig.url}/zh-hant/about/`,
    '---',
    '',
    m.about.description.replace(/<[^>]*>/g, ''),
    '',
  ].join('\n');

  return new Response(content, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
