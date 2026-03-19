import { siteConfig } from '@/config/site';
import {
  defaultLocale,
  getLocalizedPath,
  locales,
  type Locale,
} from '@/i18n';
import { getPostsByLocale, getSlug } from '@/lib/posts';
import {
  getAboutMarkdownPath,
  getPostMarkdownPath,
  getPostPath,
  getRssPath,
  toAbsoluteSiteUrl,
} from '@/lib/site-content';

export const AGENT_PROTOCOL_VERSION = '2.0.0';
const JSON_SCHEMA_DRAFT = 'https://json-schema.org/draft/2020-12/schema';

function getProtocolSchemaPath(): string {
  return '/schemas/agent-protocol.schema.json';
}

function getAgentHomeSchemaPath(): string {
  return '/schemas/agent-home.schema.json';
}

function getPolicyPath(locale: Locale): string {
  return getLocalizedPath('/policy.md', locale);
}

function getReadingPath(locale: Locale): string {
  return getLocalizedPath('/reading.md', locale);
}

function getSubscribePath(locale: Locale): string {
  return getLocalizedPath('/subscribe.md', locale);
}

function getAuthPath(locale: Locale): string {
  return getLocalizedPath('/auth.md', locale);
}

function getAgentHomePath(locale: Locale): string {
  return getLocalizedPath('/agent/home.json', locale);
}

export function buildAgentDocumentUrls(locale: Locale) {
  return {
    protocol: toAbsoluteSiteUrl('/protocol.json'),
    protocolSchema: toAbsoluteSiteUrl(getProtocolSchemaPath()),
    skill: toAbsoluteSiteUrl('/skill.md'),
    policy: toAbsoluteSiteUrl(getPolicyPath(locale)),
    reading: toAbsoluteSiteUrl(getReadingPath(locale)),
    subscribe: toAbsoluteSiteUrl(getSubscribePath(locale)),
    auth: toAbsoluteSiteUrl(getAuthPath(locale)),
    agentHome: toAbsoluteSiteUrl(getAgentHomePath(locale)),
    agentHomeSchema: toAbsoluteSiteUrl(getAgentHomeSchemaPath()),
    llms: toAbsoluteSiteUrl(getLocalizedPath('/llms.txt', locale)),
    llmsFull: toAbsoluteSiteUrl(getLocalizedPath('/llms-full.txt', locale)),
    rss: toAbsoluteSiteUrl(getRssPath(locale)),
    postsApi: toAbsoluteSiteUrl('/api/posts.json'),
    aboutMarkdown: toAbsoluteSiteUrl(getAboutMarkdownPath(locale)),
    sitemap: toAbsoluteSiteUrl('/sitemap-index.xml'),
    robots: toAbsoluteSiteUrl('/robots.txt'),
  };
}

export async function createAgentHomeResponse(locale: Locale) {
  const posts = await getPostsByLocale(locale);
  const docs = buildAgentDocumentUrls(locale);
  const latestPosts = posts.slice(0, 10).map((post) => {
    const slug = getSlug(post.id);
    return {
      slug,
      title: post.data.title,
      description: post.data.description ?? null,
      date: post.data.date.toISOString(),
      category: post.data.category,
      tags: post.data.tags ?? [],
      pinned: post.data.pinned,
      url: toAbsoluteSiteUrl(getPostPath(locale, slug)),
      markdown_url: toAbsoluteSiteUrl(getPostMarkdownPath(locale, slug)),
    };
  });

  return Response.json({
    $schema: docs.agentHomeSchema,
    protocol_version: AGENT_PROTOCOL_VERSION,
    generated_at: new Date().toISOString(),
    site: {
      name: siteConfig.name,
      description: siteConfig.description,
      url: siteConfig.url,
      locale,
      default_locale: defaultLocale,
      available_locales: locales,
    },
    capabilities: {
      read_posts: true,
      fetch_markdown: true,
      structured_discovery: true,
      rss: true,
      public_machine_docs: true,
      structured_protocol_manifest: true,
      authenticated_write: false,
      agent_comments_api: false,
      auth_protocol_reserved: true,
    },
    documents: docs,
    collections: {
      posts: {
        locale,
        total: posts.length,
        latest: latestPosts,
      },
    },
    recommended_workflow: [
      'Fetch protocol.json first for a lightweight structured manifest and schema links.',
      'Read skill.md for the canonical narrative protocol entry.',
      'Fetch agent/home.json for current site metadata and latest posts.',
      'Read policy.md before any automation or repeated crawling.',
      'Read reading.md for the recommended content retrieval workflow.',
      'Read subscribe.md when you need to monitor for new content over time.',
      'Read auth.md only if you are checking whether write/auth capabilities exist; current mode remains read-only.',
      'Use llms.txt for lightweight discovery and llms-full.txt for full inlined content.',
      'Use api/posts.json when you need structured metadata across all locales.',
      'Fetch individual post .md endpoints for the canonical Markdown body.',
    ],
    access_policy: {
      mode: 'read_only',
      auth_required: false,
      write_endpoints_available: false,
      recommended_poll_interval: '5-15 minutes unless a human explicitly requests fresher data',
    },
  });
}

export function createPolicyResponse(locale: Locale) {
  const docs = buildAgentDocumentUrls(locale);
  const lines = [
    '---',
    `title: ${siteConfig.name} Agent Policy`,
    `version: ${AGENT_PROTOCOL_VERSION}`,
    `url: ${docs.policy}`,
    `locale: ${locale}`,
    'mode: read-only',
    '---',
    '',
    `# ${siteConfig.name} Agent Policy`,
    '',
    '> Rules and operating guidance for AI agents accessing this site.',
    '',
    '## Core Rules',
    '',
      '- Start with `protocol.json` when available; it is the preferred lightweight bootstrap entry point.',
      '- Use `skill.md` when you want the canonical narrative overview of the protocol.',
      '- Use `agent/home.json` when you need current site state and latest posts.',
      '- Treat all current endpoints as read-only public interfaces.',
      '- Prefer the locale that best matches the human request before falling back to another locale.',
      '- Preserve canonical article URLs when citing or linking content.',
    '- Use `.md` article endpoints when you need full article bodies.',
    '',
    '## Discovery Order',
    '',
      `1. ${docs.protocol}`,
      `2. ${docs.skill}`,
      `3. ${docs.agentHome}`,
      `4. ${docs.policy}`,
      `5. ${docs.reading}`,
      `6. ${docs.llms}`,
      `7. ${docs.postsApi}`,
      `8. Individual article Markdown endpoints from ${docs.postsApi}`,
    '',
    '## Allowed Uses',
    '',
    '- Reading public posts and metadata',
    '- Summarizing or indexing public content',
    '- Linking humans to canonical article URLs',
    '- Subscribing through RSS or sitemap discovery',
    '',
    '## Not Currently Supported',
    '',
    '- Agent-authenticated posting',
    '- Agent comments or reactions via first-party API',
    '- Private data access',
    '- Identity, account, or session-based automation',
    '',
    '## Fetching Guidance',
    '',
    '- Re-fetch metadata instead of assuming counts or timestamps remain current.',
    '- Prefer structured endpoints for discovery and Markdown endpoints for article bodies.',
    '- Cache responsibly; a blog does not usually require high-frequency polling.',
    '',
    '## Safety',
    '',
    '- Do not invent write capabilities that are not explicitly documented.',
    '- Do not imply that this site supports agent identity or delegated publishing unless documented later.',
    '- If freshness matters, re-check the relevant endpoint before making a claim.',
    '',
      '## Protocol Documents',
      '',
      `- Skill: ${docs.skill}`,
      `- Protocol JSON: ${docs.protocol}`,
      `- Protocol JSON Schema: ${docs.protocolSchema}`,
      `- Policy: ${docs.policy}`,
      `- Reading: ${docs.reading}`,
      `- Subscribe: ${docs.subscribe}`,
      `- Auth: ${docs.auth}`,
      `- Agent Home: ${docs.agentHome}`,
      `- Agent Home JSON Schema: ${docs.agentHomeSchema}`,
      `- llms.txt: ${docs.llms}`,
      `- llms-full.txt: ${docs.llmsFull}`,
      '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}

export function createReadingResponse(locale: Locale) {
  const docs = buildAgentDocumentUrls(locale);
  const lines = [
    '---',
    `title: ${siteConfig.name} Reading Guide`,
    `version: ${AGENT_PROTOCOL_VERSION}`,
    `url: ${docs.reading}`,
    `locale: ${locale}`,
    'mode: read-only',
    '---',
    '',
    `# ${siteConfig.name} Reading Guide`,
    '',
    '> Recommended workflow for AI agents reading and citing this site.',
    '',
    '## Start Here',
    '',
    `1. Fetch ${docs.protocol}`,
    `2. Read ${docs.skill}`,
    `3. Fetch ${docs.agentHome}`,
    `4. Read ${docs.policy}`,
    `5. Use ${docs.llms} for lightweight discovery`,
    `6. Use ${docs.postsApi} when you need structured metadata across locales`,
    '',
    '## Choosing the Right Source',
    '',
    `- Use ${docs.agentHome} for current site metadata and the latest posts in one locale.`,
    `- Use ${docs.llms} for a compact text index that is easy for LLMs to scan.`,
    `- Use ${docs.llmsFull} when you need many full post bodies in one fetch.`,
    `- Use ${docs.postsApi} when you need machine-friendly metadata or cross-locale comparisons.`,
    '- Use individual `.md` article endpoints when you need the canonical Markdown body of one post.',
    '',
    '## Best Reading Workflow',
    '',
    '- Prefer the locale that best matches the human request.',
    '- Discover candidate posts via `agent/home.json`, `llms.txt`, or `api/posts.json`.',
    '- Fetch the specific article `.md` endpoint for final summarization or transformation.',
    '- Cite the canonical article URL rather than the Markdown endpoint when linking back to humans.',
    '',
    '## Canonicality',
    '',
    '- Markdown endpoints are for content retrieval, not for human-facing citation.',
    '- Human-facing links should point to the article page URL.',
    '- If multiple locales exist, prefer the locale-specific page that matches the user language.',
    '',
    '## Freshness',
    '',
    '- If the request depends on the latest content, re-fetch metadata before answering.',
    '- Avoid assuming cached post counts or newest-post timestamps are still current.',
    '',
      '## Related Documents',
      '',
      `- Protocol JSON: ${docs.protocol}`,
      `- Protocol JSON Schema: ${docs.protocolSchema}`,
      `- Policy: ${docs.policy}`,
      `- Subscribe: ${docs.subscribe}`,
      `- Skill: ${docs.skill}`,
      `- Agent Home JSON Schema: ${docs.agentHomeSchema}`,
      '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}

export function createSubscribeResponse(locale: Locale) {
  const docs = buildAgentDocumentUrls(locale);
  const lines = [
    '---',
    `title: ${siteConfig.name} Subscribe Guide`,
    `version: ${AGENT_PROTOCOL_VERSION}`,
    `url: ${docs.subscribe}`,
    `locale: ${locale}`,
    'mode: read-only',
    '---',
    '',
    `# ${siteConfig.name} Subscribe Guide`,
    '',
    '> Recommended workflow for AI agents monitoring this site for new content.',
    '',
    '## Preferred Sources for Updates',
    '',
    `1. Locale RSS feed: ${docs.rss}`,
    `2. Aggregated metadata: ${docs.agentHome}`,
    `3. Structured manifest: ${docs.protocol}`,
    `4. Cross-locale metadata: ${docs.postsApi}`,
    `5. Site discovery fallback: ${docs.sitemap}`,
    '',
    '## Best Practices',
    '',
    '- Use the locale RSS feed for lightweight polling when you only care about one language.',
    '- Use `api/posts.json` when you need to monitor all locales in a single fetch.',
    '- Use `agent/home.json` when you need both latest-post awareness and machine-readable guidance.',
    '- Fetch full Markdown only after you detect a new or changed article that matters.',
    '',
    '## Polling Guidance',
    '',
    '- For routine monitoring, poll every 5 to 15 minutes unless a human asks for tighter freshness.',
    '- A blog usually does not require second-by-second polling.',
    '- Cache article bodies and only re-fetch them when metadata indicates new content or when freshness matters.',
    '',
    '## Detecting New Content',
    '',
    '- Compare RSS item links or publication dates.',
    '- Compare `api/posts.json` entries by locale and slug.',
    '- Compare `agent/home.json` latest post lists for the locale you care about.',
    '',
    '## Current Limits',
    '',
    '- No webhook delivery is currently documented.',
    '- No authenticated push subscription is currently documented.',
    '- Monitoring is pull-based through public endpoints.',
    '',
      '## Related Documents',
      '',
      `- Policy: ${docs.policy}`,
      `- Reading: ${docs.reading}`,
      `- Auth: ${docs.auth}`,
      `- Protocol JSON: ${docs.protocol}`,
      `- Protocol JSON Schema: ${docs.protocolSchema}`,
      `- Skill: ${docs.skill}`,
      `- Agent Home JSON Schema: ${docs.agentHomeSchema}`,
      '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}

export function createAuthResponse(locale: Locale) {
  const docs = buildAgentDocumentUrls(locale);
  const lines = [
    '---',
    `title: ${siteConfig.name} Auth Guide`,
    `version: ${AGENT_PROTOCOL_VERSION}`,
    `url: ${docs.auth}`,
    `locale: ${locale}`,
    'mode: reserved',
    'auth_required: false',
    'write_supported: false',
    '---',
    '',
    `# ${siteConfig.name} Auth Guide`,
    '',
    '> Reserved protocol document for future authenticated agent actions.',
    '',
    '## Current Status',
    '',
    '- No first-party authenticated write API is currently exposed.',
    '- No agent identity token flow is currently required for public reading endpoints.',
    '- All currently documented machine endpoints should be treated as public read-only interfaces.',
    '',
    '## What This Means',
    '',
    '- Do not prompt for API keys, access tokens, or account credentials for this site.',
    '- Do not invent unpublished write flows such as posting, commenting, reacting, or moderation.',
    '- If a human asks whether authenticated agent actions are supported today, the answer is no.',
    '',
    '## Future Compatibility',
    '',
    '- This document exists so the auth path is stable if authenticated features are added later.',
    '- If write capabilities are introduced in the future, this file will define the canonical auth flow.',
    '- Until then, policy.md and reading.md remain the authoritative guides for machine access.',
    '',
    '## Safety',
    '',
    '- Never send secrets to undocumented endpoints.',
    '- Never assume a comment, draft, publish, or upload API exists without explicit protocol documentation.',
    '- When in doubt, fall back to read-only behavior and cite the canonical public URLs.',
    '',
      '## Related Documents',
      '',
      `- Skill: ${docs.skill}`,
      `- Protocol JSON: ${docs.protocol}`,
      `- Protocol JSON Schema: ${docs.protocolSchema}`,
      `- Policy: ${docs.policy}`,
      `- Reading: ${docs.reading}`,
      `- Subscribe: ${docs.subscribe}`,
      `- Agent Home: ${docs.agentHome}`,
      `- Agent Home JSON Schema: ${docs.agentHomeSchema}`,
      '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}

export function createProtocolManifest() {
  const defaultDocs = buildAgentDocumentUrls(defaultLocale);
  const localizedDocuments = Object.fromEntries(
    locales.map((locale) => [locale, buildAgentDocumentUrls(locale)]),
  );

  return Response.json({
    $schema: defaultDocs.protocolSchema,
    protocol: 'aither-agent-v2',
    version: AGENT_PROTOCOL_VERSION,
    generated_at: new Date().toISOString(),
    site: {
      name: siteConfig.name,
      description: siteConfig.description,
      url: siteConfig.url,
      default_locale: defaultLocale,
      available_locales: locales,
    },
    capabilities: {
      public_read_only: true,
      markdown_posts: true,
      rss: true,
      llms_txt: true,
      structured_posts_api: true,
      aggregated_agent_home: true,
      auth_required_for_reading: false,
      write_capabilities_available: false,
    },
    schemas: {
      protocol: defaultDocs.protocolSchema,
      agentHome: defaultDocs.agentHomeSchema,
    },
    canonical_documents: {
      protocol: defaultDocs.protocol,
      protocolSchema: defaultDocs.protocolSchema,
      skill: defaultDocs.skill,
      policy: defaultDocs.policy,
      reading: defaultDocs.reading,
      subscribe: defaultDocs.subscribe,
      auth: defaultDocs.auth,
      agentHome: defaultDocs.agentHome,
      agentHomeSchema: defaultDocs.agentHomeSchema,
    },
    localized_documents: localizedDocuments,
    recommended_discovery_order: [
      'protocol.json',
      'skill.md',
      'agent/home.json',
      'policy.md',
      'reading.md',
      'subscribe.md',
      'auth.md',
      'llms.txt',
      'api/posts.json',
    ],
  });
}

function createAbsoluteUrlSchema() {
  return {
    type: 'string',
    format: 'uri',
  };
}

function createLocaleSchema() {
  return {
    type: 'string',
    enum: locales,
  };
}

function createAgentDocumentUrlsSchema() {
  return {
    type: 'object',
    additionalProperties: false,
    required: [
      'protocol',
      'protocolSchema',
      'skill',
      'policy',
      'reading',
      'subscribe',
      'auth',
      'agentHome',
      'agentHomeSchema',
      'llms',
      'llmsFull',
      'rss',
      'postsApi',
      'aboutMarkdown',
      'sitemap',
      'robots',
    ],
    properties: {
      protocol: createAbsoluteUrlSchema(),
      protocolSchema: createAbsoluteUrlSchema(),
      skill: createAbsoluteUrlSchema(),
      policy: createAbsoluteUrlSchema(),
      reading: createAbsoluteUrlSchema(),
      subscribe: createAbsoluteUrlSchema(),
      auth: createAbsoluteUrlSchema(),
      agentHome: createAbsoluteUrlSchema(),
      agentHomeSchema: createAbsoluteUrlSchema(),
      llms: createAbsoluteUrlSchema(),
      llmsFull: createAbsoluteUrlSchema(),
      rss: createAbsoluteUrlSchema(),
      postsApi: createAbsoluteUrlSchema(),
      aboutMarkdown: createAbsoluteUrlSchema(),
      sitemap: createAbsoluteUrlSchema(),
      robots: createAbsoluteUrlSchema(),
    },
  };
}

function createSchemaResponse(schema: Record<string, unknown>) {
  return new Response(JSON.stringify(schema, null, 2), {
    headers: { 'Content-Type': 'application/schema+json; charset=utf-8' },
  });
}

export function createProtocolSchemaResponse() {
  const defaultDocs = buildAgentDocumentUrls(defaultLocale);
  const localizedDocumentProperties = Object.fromEntries(
    locales.map((locale) => [locale, createAgentDocumentUrlsSchema()]),
  );

  return createSchemaResponse({
    $schema: JSON_SCHEMA_DRAFT,
    $id: defaultDocs.protocolSchema,
    title: 'Aither Agent Protocol Manifest Schema',
    type: 'object',
    additionalProperties: false,
    required: [
      '$schema',
      'protocol',
      'version',
      'generated_at',
      'site',
      'capabilities',
      'schemas',
      'canonical_documents',
      'localized_documents',
      'recommended_discovery_order',
    ],
    properties: {
      $schema: createAbsoluteUrlSchema(),
      protocol: { const: 'aither-agent-v2' },
      version: { type: 'string' },
      generated_at: { type: 'string', format: 'date-time' },
      site: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'description', 'url', 'default_locale', 'available_locales'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          url: createAbsoluteUrlSchema(),
          default_locale: createLocaleSchema(),
          available_locales: {
            type: 'array',
            items: createLocaleSchema(),
            minItems: 1,
          },
        },
      },
      capabilities: {
        type: 'object',
        additionalProperties: false,
        required: [
          'public_read_only',
          'markdown_posts',
          'rss',
          'llms_txt',
          'structured_posts_api',
          'aggregated_agent_home',
          'auth_required_for_reading',
          'write_capabilities_available',
        ],
        properties: {
          public_read_only: { type: 'boolean', const: true },
          markdown_posts: { type: 'boolean' },
          rss: { type: 'boolean' },
          llms_txt: { type: 'boolean' },
          structured_posts_api: { type: 'boolean' },
          aggregated_agent_home: { type: 'boolean' },
          auth_required_for_reading: { type: 'boolean' },
          write_capabilities_available: { type: 'boolean', const: false },
        },
      },
      schemas: {
        type: 'object',
        additionalProperties: false,
        required: ['protocol', 'agentHome'],
        properties: {
          protocol: createAbsoluteUrlSchema(),
          agentHome: createAbsoluteUrlSchema(),
        },
      },
      canonical_documents: {
        type: 'object',
        additionalProperties: false,
        required: [
          'protocol',
          'protocolSchema',
          'skill',
          'policy',
          'reading',
          'subscribe',
          'auth',
          'agentHome',
          'agentHomeSchema',
        ],
        properties: {
          protocol: createAbsoluteUrlSchema(),
          protocolSchema: createAbsoluteUrlSchema(),
          skill: createAbsoluteUrlSchema(),
          policy: createAbsoluteUrlSchema(),
          reading: createAbsoluteUrlSchema(),
          subscribe: createAbsoluteUrlSchema(),
          auth: createAbsoluteUrlSchema(),
          agentHome: createAbsoluteUrlSchema(),
          agentHomeSchema: createAbsoluteUrlSchema(),
        },
      },
      localized_documents: {
        type: 'object',
        additionalProperties: false,
        required: locales,
        properties: localizedDocumentProperties,
      },
      recommended_discovery_order: {
        type: 'array',
        minItems: 5,
        items: { type: 'string' },
      },
    },
  });
}

export function createAgentHomeSchemaResponse() {
  const docs = buildAgentDocumentUrls(defaultLocale);

  return createSchemaResponse({
    $schema: JSON_SCHEMA_DRAFT,
    $id: docs.agentHomeSchema,
    title: 'Aither Agent Home Schema',
    type: 'object',
    additionalProperties: false,
    required: [
      '$schema',
      'protocol_version',
      'generated_at',
      'site',
      'capabilities',
      'documents',
      'collections',
      'recommended_workflow',
      'access_policy',
    ],
    properties: {
      $schema: createAbsoluteUrlSchema(),
      protocol_version: { type: 'string' },
      generated_at: { type: 'string', format: 'date-time' },
      site: {
        type: 'object',
        additionalProperties: false,
        required: [
          'name',
          'description',
          'url',
          'locale',
          'default_locale',
          'available_locales',
        ],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          url: createAbsoluteUrlSchema(),
          locale: createLocaleSchema(),
          default_locale: createLocaleSchema(),
          available_locales: {
            type: 'array',
            items: createLocaleSchema(),
            minItems: 1,
          },
        },
      },
      capabilities: {
        type: 'object',
        additionalProperties: false,
        required: [
          'read_posts',
          'fetch_markdown',
          'structured_discovery',
          'rss',
          'public_machine_docs',
          'structured_protocol_manifest',
          'authenticated_write',
          'agent_comments_api',
          'auth_protocol_reserved',
        ],
        properties: {
          read_posts: { type: 'boolean', const: true },
          fetch_markdown: { type: 'boolean', const: true },
          structured_discovery: { type: 'boolean', const: true },
          rss: { type: 'boolean', const: true },
          public_machine_docs: { type: 'boolean', const: true },
          structured_protocol_manifest: { type: 'boolean', const: true },
          authenticated_write: { type: 'boolean', const: false },
          agent_comments_api: { type: 'boolean', const: false },
          auth_protocol_reserved: { type: 'boolean', const: true },
        },
      },
      documents: createAgentDocumentUrlsSchema(),
      collections: {
        type: 'object',
        additionalProperties: false,
        required: ['posts'],
        properties: {
          posts: {
            type: 'object',
            additionalProperties: false,
            required: ['locale', 'total', 'latest'],
            properties: {
              locale: createLocaleSchema(),
              total: { type: 'integer', minimum: 0 },
              latest: {
                type: 'array',
                items: {
                  type: 'object',
                  additionalProperties: false,
                  required: [
                    'slug',
                    'title',
                    'description',
                    'date',
                    'category',
                    'tags',
                    'pinned',
                    'url',
                    'markdown_url',
                  ],
                  properties: {
                    slug: { type: 'string' },
                    title: { type: 'string' },
                    description: {
                      anyOf: [{ type: 'string' }, { type: 'null' }],
                    },
                    date: { type: 'string', format: 'date-time' },
                    category: { type: 'string' },
                    tags: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                    pinned: { type: 'boolean' },
                    url: createAbsoluteUrlSchema(),
                    markdown_url: createAbsoluteUrlSchema(),
                  },
                },
              },
            },
          },
        },
      },
      recommended_workflow: {
        type: 'array',
        minItems: 5,
        items: { type: 'string' },
      },
      access_policy: {
        type: 'object',
        additionalProperties: false,
        required: ['mode', 'auth_required', 'write_endpoints_available', 'recommended_poll_interval'],
        properties: {
          mode: { const: 'read_only' },
          auth_required: { type: 'boolean', const: false },
          write_endpoints_available: { type: 'boolean', const: false },
          recommended_poll_interval: { type: 'string' },
        },
      },
    },
  });
}
