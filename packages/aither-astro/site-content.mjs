export function stripHtmlTags(value) {
  return value.replace(/<[^>]*>/g, '').trim();
}

export function toAbsoluteSiteUrl(path, siteUrl) {
  return new URL(path, siteUrl).href;
}

function createTextResponse(content, contentType) {
  return new Response(content, {
    headers: { 'Content-Type': `${contentType}; charset=utf-8` },
  });
}

export function createAitherSiteContentRuntime(options) {
  const {
    defaultLocale,
    getLocaleBasePath,
    getLocalizedPath,
    getMessages,
    getPostSlug,
    getPostsByLocale,
    htmlLangs,
    localeLabels,
    pageSize,
    siteDescription,
    siteName,
    siteUrl,
  } = options;

  function absoluteUrl(path) {
    return toAbsoluteSiteUrl(path, siteUrl);
  }

  function getLocaleHomePath(locale) {
    const basePath = getLocaleBasePath(locale);
    return basePath || '/';
  }

  function getPostPath(locale, slug) {
    return getLocalizedPath(`/posts/${slug}/`, locale);
  }

  function getPostMarkdownPath(locale, slug) {
    return getLocalizedPath(`/posts/${slug}.md`, locale);
  }

  function getPostOgImagePath(locale, slug) {
    return locale === defaultLocale ? `/og/${slug}.png` : `/og/${locale}/${slug}.png`;
  }

  function getAboutMarkdownPath(locale) {
    return getLocalizedPath('/about.md', locale);
  }

  function getRssPath(locale) {
    return getLocalizedPath('/rss.xml', locale);
  }

  function buildWebsiteJsonLd(locale) {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteName,
      description: siteDescription,
      url: absoluteUrl(getLocaleHomePath(locale)),
      inLanguage: htmlLangs[locale],
    };
  }

  async function getPaginatedPosts(locale, currentPage) {
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

  async function getPaginationStaticPaths(locale) {
    const { totalPages } = await getPaginatedPosts(locale, 1);
    return Array.from({ length: Math.max(totalPages - 1, 0) }, (_, i) => ({
      params: { num: String(i + 2) },
    }));
  }

  async function getPostStaticPaths(locale) {
    const posts = await getPostsByLocale(locale);
    return posts.map((post, index) => ({
      params: { slug: getPostSlug(post.id) },
      props: {
        post,
        prevPost: index < posts.length - 1 ? posts[index + 1] : null,
        nextPost: index > 0 ? posts[index - 1] : null,
      },
    }));
  }

  function createAboutMarkdownResponse(locale) {
    const m = getMessages(locale);
    const content = [
      '---',
      `title: ${m.about.title}`,
      `url: ${absoluteUrl(getLocalizedPath('/about/', locale))}`,
      '---',
      '',
      stripHtmlTags(m.about.description),
      '',
    ].join('\n');

    return createTextResponse(content, 'text/markdown');
  }

  async function createLlmsResponse(locale, format) {
    const posts = await getPostsByLocale(locale);
    const m = getMessages(locale);
    const aboutText = stripHtmlTags(m.about.description);

    if (format === 'summary') {
      const lines = [
        `# ${siteName}`,
        '',
        `> ${aboutText}`,
        '',
        '## About',
        '',
        aboutText,
        '',
        `- Site: ${absoluteUrl(getLocaleHomePath(locale))}`,
        `- RSS: ${absoluteUrl(getRssPath(locale))}`,
        `- Full content: ${absoluteUrl(getLocalizedPath('/llms-full.txt', locale))}`,
        `- Individual posts: append .md to any post URL (e.g. ${getPostMarkdownPath(locale, 'hello-world')})`,
        `- JSON API: ${absoluteUrl('/api/posts.json')}`,
        '',
        '## Blog Posts',
        '',
        ...posts.map((post) => {
          const slug = getPostSlug(post.id);
          const desc = post.data.description ? `: ${post.data.description}` : '';
          return `- [${post.data.title}](${absoluteUrl(getPostPath(locale, slug))})${desc}`;
        }),
        '',
      ];

      return createTextResponse(lines.join('\n'), 'text/plain');
    }

    const sections = [
      `# ${siteName}`,
      '',
      `> ${aboutText}`,
      '',
      '## About',
      '',
      aboutText,
      '',
    ];

    for (const post of posts) {
      const slug = getPostSlug(post.id);
      sections.push('---');
      sections.push('');
      sections.push(`## ${post.data.title}`);
      sections.push('');
      sections.push(`URL: ${absoluteUrl(getPostPath(locale, slug))}`);
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

    return createTextResponse(sections.join('\n'), 'text/plain');
  }

  async function createRssOptions(locale) {
    const posts = await getPostsByLocale(locale);
    const m = getMessages(locale);
    const description = stripHtmlTags(m.about.description);

    return {
      title: locale === defaultLocale ? siteName : `${siteName} (${localeLabels[locale]})`,
      description,
      site: siteUrl,
      items: posts.map((post) => {
        const slug = getPostSlug(post.id);
        return {
          title: post.data.title,
          pubDate: post.data.date,
          description: post.data.description,
          link: getPostPath(locale, slug),
          content: post.body,
          categories: [post.data.category, ...(post.data.tags ?? [])],
        };
      }),
    };
  }

  async function createPostsApiResponse(locales) {
    const data = {};

    for (const locale of locales) {
      const posts = await getPostsByLocale(locale);
      data[locale] = posts.map((post) => {
        const slug = getPostSlug(post.id);
        return {
          slug,
          title: post.data.title,
          date: post.data.date.toISOString().split('T')[0],
          published_at: post.data.date.toISOString(),
          category: post.data.category,
          description: post.data.description || null,
          tags: post.data.tags || [],
          pinned: post.data.pinned,
          url: absoluteUrl(getPostPath(locale, slug)),
          markdown: absoluteUrl(getPostMarkdownPath(locale, slug)),
        };
      });
    }

    return createTextResponse(JSON.stringify(data, null, 2), 'application/json');
  }

  return {
    stripHtmlTags,
    toAbsoluteSiteUrl: absoluteUrl,
    getLocaleHomePath,
    getPostPath,
    getPostMarkdownPath,
    getPostOgImagePath,
    getAboutMarkdownPath,
    getRssPath,
    buildWebsiteJsonLd,
    getPaginatedPosts,
    getPaginationStaticPaths,
    getPostStaticPaths,
    createAboutMarkdownResponse,
    createLlmsResponse,
    createRssOptions,
    createPostsApiResponse,
  };
}
