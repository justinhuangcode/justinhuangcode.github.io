import {
  AGENT_PROTOCOL_VERSION,
  createAitherAgentProtocolRuntime,
} from '@aither/astro/agent-protocol';
import { siteConfig } from '@/config/site';
import {
  defaultLocale,
  getLocalizedPath,
  locales,
  type Locale,
} from '@/i18n';
import { getPostsByLocale, getSlug, type PostEntry } from '@/lib/posts';
import {
  getAboutMarkdownPath,
  getPostMarkdownPath,
  getPostPath,
  getRssPath,
  toAbsoluteSiteUrl,
} from '@/lib/site-content';

const runtime = createAitherAgentProtocolRuntime<Locale, PostEntry>({
  defaultLocale,
  getAboutMarkdownPath,
  getLocalizedPath,
  getPostMarkdownPath,
  getPostPath,
  getPostSlug: getSlug,
  getPostsByLocale,
  getRssPath,
  locales,
  siteDescription: siteConfig.description,
  siteName: siteConfig.name,
  siteUrl: siteConfig.url,
  toAbsoluteSiteUrl,
});

export { AGENT_PROTOCOL_VERSION };

export const buildAgentDocumentUrls = runtime.buildAgentDocumentUrls;
export const createAgentHomeResponse = runtime.createAgentHomeResponse;
export const createPolicyResponse = runtime.createPolicyResponse;
export const createReadingResponse = runtime.createReadingResponse;
export const createSubscribeResponse = runtime.createSubscribeResponse;
export const createAuthResponse = runtime.createAuthResponse;
export const createProtocolManifest = runtime.createProtocolManifest;
export const createSkillResponse = runtime.createSkillResponse;
export const createProtocolSchemaResponse = runtime.createProtocolSchemaResponse;
export const createAgentHomeSchemaResponse = runtime.createAgentHomeSchemaResponse;
