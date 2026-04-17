import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { defaultLocale, locales } from '../config/locale-meta.mjs';

const distDir = path.join(process.cwd(), 'dist');

async function readText(relativePath) {
  const filePath = path.join(distDir, relativePath);
  return readFile(filePath, 'utf8');
}

async function readJson(relativePath) {
  return JSON.parse(await readText(relativePath));
}

function expectIncludes(text, fragment, fileLabel) {
  assert.ok(
    text.includes(fragment),
    `${fileLabel} is missing expected content: ${fragment}`,
  );
}

const protocol = await readJson('protocol.json');
const protocolSchema = await readJson(path.join('schemas', 'agent-protocol.schema.json'));
const agentHomeSchema = await readJson(path.join('schemas', 'agent-home.schema.json'));

assert.equal(protocol.$schema, protocolSchema.$id);
assert.equal(protocol.protocol, 'aither-agent-v2');
assert.equal(protocol.capabilities.public_read_only, true);
assert.equal(protocol.capabilities.write_capabilities_available, false);
assert.equal(protocol.schemas.protocol, protocolSchema.$id);
assert.equal(protocol.schemas.agentHome, agentHomeSchema.$id);
assert.equal(protocol.canonical_documents.protocolSchema, protocolSchema.$id);
assert.equal(protocol.canonical_documents.agentHomeSchema, agentHomeSchema.$id);
assert.deepEqual(protocol.recommended_discovery_order.slice(0, 5), [
  'protocol.json',
  'skill.md',
  'agent/home.json',
  'policy.md',
  'reading.md',
]);
for (const locale of locales) {
  assert.ok(
    protocol.localized_documents[locale],
    `protocol.json should expose localized documents for ${locale}`,
  );
  assert.equal(
    protocol.localized_documents[locale].protocolSchema,
    protocolSchema.$id,
    `${locale} docs should expose protocol schema`,
  );
  assert.equal(
    protocol.localized_documents[locale].agentHomeSchema,
    agentHomeSchema.$id,
    `${locale} docs should expose agent home schema`,
  );
}

const defaultAgentHome = await readJson(path.join('agent', 'home.json'));

assert.equal(defaultAgentHome.$schema, agentHomeSchema.$id);
assert.equal(defaultAgentHome.protocol_version, protocol.version);
assert.equal(defaultAgentHome.capabilities.structured_protocol_manifest, true);
assert.equal(defaultAgentHome.access_policy.mode, 'read_only');
assert.equal(defaultAgentHome.documents.protocol, protocol.canonical_documents.protocol);
assert.equal(defaultAgentHome.documents.protocolSchema, protocolSchema.$id);
assert.equal(defaultAgentHome.documents.agentHomeSchema, agentHomeSchema.$id);
assert.ok(
  defaultAgentHome.collections.posts.total >= 1,
  'agent/home.json should expose at least one post',
);
assert.ok(
  defaultAgentHome.collections.posts.latest.length >= 1,
  'agent/home.json should expose latest posts',
);

for (const locale of locales) {
  const relativePath =
    locale === defaultLocale
      ? path.join('agent', 'home.json')
      : path.join(locale, 'agent', 'home.json');
  const agentHome = await readJson(relativePath);

  assert.equal(agentHome.site.locale, locale);
  assert.equal(
    agentHome.documents.policy,
    protocol.localized_documents[locale].policy,
  );
  assert.equal(agentHome.documents.protocol, protocol.canonical_documents.protocol);
  assert.equal(
    agentHome.documents.agentHomeSchema,
    agentHomeSchema.$id,
  );
}

const skill = await readText('skill.md');

for (const fragment of [
  'protocol.json',
  'agent-protocol.schema.json',
  'skill.md',
  'agent/home.json',
  'agent-home.schema.json',
  'reading.md',
  'policy.md',
  'subscribe.md',
  'auth.md',
  'Public read-only access',
]) {
  expectIncludes(skill, fragment, 'skill.md');
}

const policy = await readText('policy.md');
expectIncludes(policy, 'mode: read-only', 'policy.md');
expectIncludes(policy, '## Discovery Order', 'policy.md');
expectIncludes(policy, protocol.canonical_documents.protocol, 'policy.md');
expectIncludes(policy, protocolSchema.$id, 'policy.md');

const reading = await readText('reading.md');
expectIncludes(reading, protocol.canonical_documents.protocol, 'reading.md');
expectIncludes(reading, protocol.canonical_documents.agentHome, 'reading.md');
expectIncludes(reading, agentHomeSchema.$id, 'reading.md');

const subscribe = await readText('subscribe.md');
expectIncludes(subscribe, '## Preferred Sources for Updates', 'subscribe.md');
expectIncludes(subscribe, protocol.canonical_documents.protocol, 'subscribe.md');
expectIncludes(subscribe, protocolSchema.$id, 'subscribe.md');

const auth = await readText('auth.md');
expectIncludes(auth, 'write_supported: false', 'auth.md');
expectIncludes(auth, protocol.canonical_documents.protocol, 'auth.md');
expectIncludes(auth, agentHomeSchema.$id, 'auth.md');

assert.equal(protocolSchema.$schema, 'https://json-schema.org/draft/2020-12/schema');
assert.equal(agentHomeSchema.$schema, 'https://json-schema.org/draft/2020-12/schema');
assert.equal(protocolSchema.properties.protocol.const, 'aither-agent-v2');
assert.equal(agentHomeSchema.properties.access_policy.properties.mode.const, 'read_only');

console.log('Agent protocol smoke tests passed.');
