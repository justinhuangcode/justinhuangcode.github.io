import type { AitherContentEntry } from './site-content';

export interface AitherAgentDocumentUrls {
  protocol: string;
  protocolSchema: string;
  skill: string;
  policy: string;
  reading: string;
  subscribe: string;
  auth: string;
  agentHome: string;
  agentHomeSchema: string;
  llms: string;
  llmsFull: string;
  rss: string;
  postsApi: string;
  aboutMarkdown: string;
  sitemap: string;
  robots: string;
}

export interface AitherAgentProtocolRuntimeOptions<
  TLocale extends string,
  TEntry extends AitherContentEntry,
> {
  defaultLocale: TLocale;
  getAboutMarkdownPath: (locale: TLocale) => string;
  getLocalizedPath: (path: string, locale: TLocale) => string;
  getPostMarkdownPath: (locale: TLocale, slug: string) => string;
  getPostPath: (locale: TLocale, slug: string) => string;
  getPostSlug: (entryId: string) => string;
  getPostsByLocale: (locale: TLocale) => Promise<TEntry[]>;
  getRssPath: (locale: TLocale) => string;
  locales: readonly TLocale[];
  siteDescription: string;
  siteName: string;
  siteUrl: string;
  toAbsoluteSiteUrl: (path: string) => string;
}

export interface AitherAgentProtocolRuntime<TLocale extends string> {
  buildAgentDocumentUrls: (locale: TLocale) => AitherAgentDocumentUrls;
  createAgentHomeResponse: (locale: TLocale) => Promise<Response>;
  createPolicyResponse: (locale: TLocale) => Response;
  createReadingResponse: (locale: TLocale) => Response;
  createSubscribeResponse: (locale: TLocale) => Response;
  createAuthResponse: (locale: TLocale) => Response;
  createSkillResponse: () => Response;
  createProtocolManifest: () => Response;
  createProtocolSchemaResponse: () => Response;
  createAgentHomeSchemaResponse: () => Response;
}

export declare const AGENT_PROTOCOL_VERSION = '2.0.0';

export declare function createAitherAgentProtocolRuntime<
  TLocale extends string,
  TEntry extends AitherContentEntry,
>(
  options: AitherAgentProtocolRuntimeOptions<TLocale, TEntry>,
): AitherAgentProtocolRuntime<TLocale>;
