import type { ImageMetadata } from 'astro';

export interface SocialLink {
  title: string;
  href: string;
  icon: string; // icon identifier, e.g. 'github', 'x'
}

export interface FooterLink {
  title: string;
  href: string;
  external?: boolean;
}

export interface FooterSection {
  title: string;
  items: FooterLink[];
}

export const siteConfig = {
  name: 'Justin Huang',
  title: 'Justin Huang blog',
  description: 'Justin Huang blog',
  author: {
    name: 'Justin Huang',
    avatar: '' as ImageMetadata | string, // Import from src/assets/ for optimization, or use URL string
  },
  url: 'https://justinhuangcode.github.io',
  ogImage: '/og/index.png',
  images: {
    logoLight: '/logo.svg',
    logoDark: '/logo-dark.svg',
  },
  social: [
    {
      title: 'GitHub',
      href: 'https://github.com/justinhuangcode',
      icon: 'github',
    },
    {
      title: 'RSS',
      href: '/rss.xml',
      icon: 'rss',
    },
  ] satisfies SocialLink[],
  blog: {
    paginationSize: 20,
    timeZone: 'Asia/Shanghai',
  },
  analytics: {
    googleAnalyticsId: import.meta.env.PUBLIC_GA_ID || '',
  },
  crisp: {
    websiteId: import.meta.env.PUBLIC_CRISP_WEBSITE_ID || '',
  },
  ui: {
    defaultMode: 'system' as const,
    enableModeSwitch: true,
  },
  giscus: {
    repo: import.meta.env.PUBLIC_GISCUS_REPO || '',
    repoId: import.meta.env.PUBLIC_GISCUS_REPO_ID || '',
    category: import.meta.env.PUBLIC_GISCUS_CATEGORY || 'Announcements',
    categoryId: import.meta.env.PUBLIC_GISCUS_CATEGORY_ID || '',
    mapping: 'pathname' as const,
    reactionsEnabled: true,
    emitMetadata: false,
    inputPosition: 'top' as const,
  },
  nav: [
    { labelKey: 'blog' as const, href: '/' },
    { labelKey: 'about' as const, href: '/about' },
  ],
  footer: {
    copyrightYear: 'auto' as 'auto' | number,
    sections: [
      {
        title: 'Navigate',
        items: [
          { title: 'About', href: '/about' },
        ],
      },
      {
        title: 'Subscribe',
        items: [
          { title: 'RSS Feed', href: '/rss.xml' },
        ],
      },
      {
        title: 'Source',
        items: [
          {
            title: 'GitHub',
            href: 'https://github.com/justinhuangcode',
            external: true,
          },
        ],
      },
    ] satisfies FooterSection[],
  },
};
