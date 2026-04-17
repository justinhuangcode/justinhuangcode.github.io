export interface AitherEntryData {
  title: string;
  description?: string;
  date: Date;
  category: string;
  tags?: string[];
  pinned: boolean;
}

export interface AitherContentEntry {
  id: string;
  data: AitherEntryData;
  body?: string;
}

export interface AitherMessagesShape {
  about: {
    title: string;
    description: string;
  };
}

export interface AitherPaginatedPosts<TEntry extends AitherContentEntry> {
  allPosts: TEntry[];
  posts: TEntry[];
  totalPages: number;
  currentPage: number;
}

export interface AitherPostStaticPath<TEntry extends AitherContentEntry> {
  params: {
    slug: string;
  };
  props: {
    post: TEntry;
    prevPost: TEntry | null;
    nextPost: TEntry | null;
  };
}

export interface AitherRssItem {
  title: string;
  pubDate: Date;
  description?: string;
  link: string;
  content?: string;
  categories: string[];
}

export interface AitherRssOptions {
  title: string;
  description: string;
  site: string;
  items: AitherRssItem[];
}

export interface AitherSiteContentRuntimeOptions<
  TLocale extends string,
  TEntry extends AitherContentEntry,
> {
  defaultLocale: TLocale;
  getLocaleBasePath: (locale: TLocale) => string;
  getLocalizedPath: (path: string, locale: TLocale) => string;
  getMessages: (locale: TLocale) => AitherMessagesShape;
  getPostSlug: (entryId: string) => string;
  getPostsByLocale: (locale: TLocale) => Promise<TEntry[]>;
  htmlLangs: Record<TLocale, string>;
  localeLabels: Record<TLocale, string>;
  pageSize: number;
  siteDescription: string;
  siteName: string;
  siteUrl: string;
}

export interface AitherSiteContentRuntime<
  TLocale extends string,
  TEntry extends AitherContentEntry,
> {
  stripHtmlTags: typeof stripHtmlTags;
  toAbsoluteSiteUrl: (path: string) => string;
  getLocaleHomePath: (locale: TLocale) => string;
  getPostPath: (locale: TLocale, slug: string) => string;
  getPostMarkdownPath: (locale: TLocale, slug: string) => string;
  getPostOgImagePath: (locale: TLocale, slug: string) => string;
  getAboutMarkdownPath: (locale: TLocale) => string;
  getRssPath: (locale: TLocale) => string;
  buildWebsiteJsonLd: (locale: TLocale) => Record<string, unknown>;
  getPaginatedPosts: (
    locale: TLocale,
    currentPage: number,
  ) => Promise<AitherPaginatedPosts<TEntry>>;
  getPaginationStaticPaths: (
    locale: TLocale,
  ) => Promise<Array<{ params: { num: string } }>>;
  getPostStaticPaths: (
    locale: TLocale,
  ) => Promise<Array<AitherPostStaticPath<TEntry>>>;
  createAboutMarkdownResponse: (locale: TLocale) => Response;
  createLlmsResponse: (
    locale: TLocale,
    format: 'summary' | 'full',
  ) => Promise<Response>;
  createRssOptions: (locale: TLocale) => Promise<AitherRssOptions>;
  createPostsApiResponse: (locales: readonly TLocale[]) => Promise<Response>;
}

export declare function stripHtmlTags(value: string): string;
export declare function toAbsoluteSiteUrl(path: string, siteUrl: string): string;

export declare function createAitherSiteContentRuntime<
  TLocale extends string,
  TEntry extends AitherContentEntry,
>(
  options: AitherSiteContentRuntimeOptions<TLocale, TEntry>,
): AitherSiteContentRuntime<TLocale, TEntry>;
