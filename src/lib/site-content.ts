import rss from '@astrojs/rss';
import {
  createAitherSiteContentRuntime,
  type AitherPaginatedPosts,
} from '@aither/astro/site-content';
import { siteConfig } from '@/config/site';
import {
  defaultLocale,
  getLocaleBasePath,
  getLocalizedPath,
  getMessages,
  htmlLangs,
  localeLabels,
  locales,
  type Locale,
} from '@/i18n';
import { getPostsByLocale, getSlug, type PostEntry } from '@/lib/posts';

const runtime = createAitherSiteContentRuntime<Locale, PostEntry>({
  defaultLocale,
  getLocaleBasePath,
  getLocalizedPath,
  getMessages,
  getPostSlug: getSlug,
  getPostsByLocale,
  htmlLangs,
  localeLabels,
  pageSize: siteConfig.blog.paginationSize,
  siteDescription: siteConfig.description,
  siteName: siteConfig.name,
  siteUrl: siteConfig.url,
});

export type PaginatedPosts = AitherPaginatedPosts<PostEntry>;

export const stripHtmlTags = runtime.stripHtmlTags;
export const toAbsoluteSiteUrl = runtime.toAbsoluteSiteUrl;
export const getLocaleHomePath = runtime.getLocaleHomePath;
export const getPostPath = runtime.getPostPath;
export const getPostMarkdownPath = runtime.getPostMarkdownPath;
export const getPostOgImagePath = runtime.getPostOgImagePath;
export const getAboutMarkdownPath = runtime.getAboutMarkdownPath;
export const getRssPath = runtime.getRssPath;
export const buildWebsiteJsonLd = runtime.buildWebsiteJsonLd;
export const getPaginatedPosts = runtime.getPaginatedPosts;
export const getPaginationStaticPaths = runtime.getPaginationStaticPaths;
export const getPostStaticPaths = runtime.getPostStaticPaths;
export const createAboutMarkdownResponse = runtime.createAboutMarkdownResponse;
export const createLlmsResponse = runtime.createLlmsResponse;

export async function createRssResponse(locale: Locale) {
  return rss(await runtime.createRssOptions(locale));
}

export async function createPostsApiResponse() {
  return runtime.createPostsApiResponse(locales);
}
