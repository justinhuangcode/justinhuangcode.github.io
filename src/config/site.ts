import type { ImageMetadata } from 'astro';
import type { CollectionKey } from 'astro:content';

export interface SocialLink {
  title: string;
  href: string;
  icon: 'github' | 'x' | 'discord' | 'mail' | 'rss';
}

export interface FooterLink {
  title: string;
  href: string;
  external?: boolean;
  /** Optional i18n key — looks up m.footer[labelKey], falls back to title */
  labelKey?: string;
}

export interface FooterSection {
  title: string;
  items: FooterLink[];
}

/**
 * Custom content section (beyond the default blog posts).
 * Each section gets its own list page + detail pages, auto-routed.
 *
 * To add a section:
 * 1. Add entry here
 * 2. Register collection in src/content.config.ts
 * 3. Create content in src/content/{id}/{locale}/
 * 4. Add nav.{labelKey} to i18n messages
 */
export interface ContentSection {
  /** Collection ID — must match content.config.ts collection name and src/content/{id}/ directory */
  id: CollectionKey;
  /** i18n key used in nav and page title — maps to m.nav[labelKey] */
  labelKey: string;
}

export const siteConfig = {
  name: 'Justin Huang',
  title: 'Justin Huang blog',
  description: 'Justin Huang blog',
  author: {
    name: 'Justin Huang',
    avatar: '' as ImageMetadata | string, // Import from src/assets/ for optimization, or use URL string
  },
  url: import.meta.env.SITE || 'https://justinhuangai.github.io',
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
    defaultStyle: 'default' as const,
    enableModeSwitch: true,
    showMoreThemesMenu: true,
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
  // Custom content sections — each one auto-generates list + detail pages
  // Example: { id: 'translations', labelKey: 'translations' }
  sections: [] as ContentSection[],
  nav: [
    { labelKey: 'blog' as const, href: '/' },
    // Section nav items are auto-appended from sections config above
    { labelKey: 'about' as const, href: '/about' },
  ],
  footer: {
    copyrightYear: 'auto' as 'auto' | number,
    sections: [
      {
        title: 'Navigate',
        items: [
          { title: 'About', href: '/about', labelKey: 'about' },
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
