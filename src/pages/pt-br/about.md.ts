import { siteConfig } from '@/config/site';
import { getMessages } from '@/i18n';

export function GET() {
  const m = getMessages('pt-br');
  const content = [
    '---',
    `title: ${m.about.title}`,
    `url: ${siteConfig.url}/pt-br/about/`,
    '---',
    '',
    m.about.description.replace(/<[^>]*>/g, ''),
    '',
  ].join('\n');

  return new Response(content, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
