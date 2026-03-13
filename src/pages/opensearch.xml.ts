import { siteConfig } from '@/config/site';

export function GET() {
  const site = siteConfig.url;

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">',
    `  <ShortName>${siteConfig.name}</ShortName>`,
    `  <Description>${siteConfig.description}</Description>`,
    '  <InputEncoding>UTF-8</InputEncoding>',
    `  <Url type="text/html" template="${site}/?q={searchTerms}" />`,
    `  <Image width="16" height="16" type="image/svg+xml">${site}/favicon.svg</Image>`,
    '</OpenSearchDescription>',
    '',
  ];

  return new Response(xml.join('\n'), {
    headers: { 'Content-Type': 'application/opensearchdescription+xml; charset=utf-8' },
  });
}
