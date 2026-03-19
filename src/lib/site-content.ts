import rss from '@astrojs/rss';
import { siteConfig } from '@/config/site';
import {
  getLocaleBasePath,
  getLocalizedPath,
  getMessages,
  htmlLangs,
  localeLabels,
  type Locale,
} from '@/i18n';
import { getPostsByLocale, getSlug, type PostEntry } from '@/lib/posts';

export interface PaginatedPosts {
  allPosts: PostEntry[];
  posts: PostEntry[];
  totalPages: number;
  currentPage: number;
}

export function stripHtmlTags(value: string): string {
  return value.replace(/<[^>]*>/g, '').trim();
}

export function toAbsoluteSiteUrl(path: string): string {
  return new URL(path, siteConfig.url).href;
}

export function getLocaleHomePath(locale: Locale): string {
  const basePath = getLocaleBasePath(locale);
  return basePath || '/';
}

export function getPostPath(locale: Locale, slug: string): string {
  return getLocalizedPath(`/posts/${slug}/`, locale);
}

export function getPostMarkdownPath(locale: Locale, slug: string): string {
  return getLocalizedPath(`/posts/${slug}.md`, locale);
}

export function getPostOgImagePath(locale: Locale, slug: string): string {
  return locale === 'en' ? `/og/${slug}.png` : `/og/${locale}/${slug}.png`;
}

export function getAboutMarkdownPath(locale: Locale): string {
  return getLocalizedPath('/about.md', locale);
}

export function getRssPath(locale: Locale): string {
  return getLocalizedPath('/rss.xml', locale);
}

export function buildWebsiteJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    description: siteConfig.description,
    url: toAbsoluteSiteUrl(getLocaleHomePath(locale)),
    inLanguage: htmlLangs[locale],
  };
}

export async function getPaginatedPosts(
  locale: Locale,
  currentPage: number,
): Promise<PaginatedPosts> {
  const pageSize = siteConfig.blog.paginationSize;
  const allPosts = await getPostsByLocale(locale);
  const totalPages = Math.max(1, Math.ceil(allPosts.length / pageSize));
  const normalizedPage = Math.min(Math.max(currentPage, 1), totalPages);
  const posts = allPosts.slice(
    (normalizedPage - 1) * pageSize,
    normalizedPage * pageSize,
  );

  return {
    allPosts,
    posts,
    totalPages,
    currentPage: normalizedPage,
  };
}

export async function getPaginationStaticPaths(locale: Locale) {
  const { totalPages } = await getPaginatedPosts(locale, 1);
  return Array.from({ length: Math.max(totalPages - 1, 0) }, (_, i) => ({
    params: { num: String(i + 2) },
  }));
}

export async function getPostStaticPaths(locale: Locale) {
  const posts = await getPostsByLocale(locale);
  return posts.map((post, index) => ({
    params: { slug: getSlug(post.id) },
    props: {
      post,
      prevPost: index < posts.length - 1 ? posts[index + 1] : null,
      nextPost: index > 0 ? posts[index - 1] : null,
    },
  }));
}

export function createAboutMarkdownResponse(locale: Locale) {
  const m = getMessages(locale);
  const content = [
    '---',
    `title: ${m.about.title}`,
    `url: ${toAbsoluteSiteUrl(getLocalizedPath('/about/', locale))}`,
    '---',
    '',
    stripHtmlTags(m.about.description),
    '',
  ].join('\n');

  return new Response(content, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}

export async function createLlmsResponse(
  locale: Locale,
  format: 'summary' | 'full',
) {
  const posts = await getPostsByLocale(locale);
  const m = getMessages(locale);
  const aboutText = stripHtmlTags(m.about.description);

  if (format === 'summary') {
    const lines = [
      `# ${siteConfig.name}`,
      '',
      `> ${aboutText}`,
      '',
      `## About`,
      '',
      aboutText,
      '',
      `- Site: ${toAbsoluteSiteUrl(getLocaleHomePath(locale))}`,
      `- RSS: ${toAbsoluteSiteUrl(getRssPath(locale))}`,
      `- Full content: ${toAbsoluteSiteUrl(getLocalizedPath('/llms-full.txt', locale))}`,
      `- Individual posts: append .md to any post URL (e.g. ${getPostMarkdownPath(locale, 'hello-world')})`,
      `- JSON API: ${toAbsoluteSiteUrl('/api/posts.json')}`,
      '',
      `## Blog Posts`,
      '',
      ...posts.map((post) => {
        const slug = getSlug(post.id);
        const desc = post.data.description ? `: ${post.data.description}` : '';
        return `- [${post.data.title}](${toAbsoluteSiteUrl(getPostPath(locale, slug))})${desc}`;
      }),
      '',
    ];

    return new Response(lines.join('\n'), {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const sections = [
    `# ${siteConfig.name}`,
    '',
    `> ${aboutText}`,
    '',
    `## About`,
    '',
    aboutText,
    '',
  ];

  for (const post of posts) {
    const slug = getSlug(post.id);
    sections.push('---');
    sections.push('');
    sections.push(`## ${post.data.title}`);
    sections.push('');
    sections.push(`URL: ${toAbsoluteSiteUrl(getPostPath(locale, slug))}`);
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

export async function createRssResponse(locale: Locale) {
  const posts = await getPostsByLocale(locale);
  const m = getMessages(locale);
  const description = stripHtmlTags(m.about.description);

  return rss({
    title:
      locale === 'en'
        ? siteConfig.name
        : `${siteConfig.name} (${localeLabels[locale]})`,
    description,
    site: siteConfig.url,
    items: posts.map((post) => {
      const slug = getSlug(post.id);
      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description,
        link: getPostPath(locale, slug),
        content: post.body,
        categories: [post.data.category, ...(post.data.tags ?? [])],
      };
    }),
  });
}
