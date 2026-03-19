import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

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
assert.ok(protocol.localized_documents.en, 'protocol.json should expose English documents');
assert.ok(
  protocol.localized_documents['zh-hans'],
  'protocol.json should expose Simplified Chinese documents',
);
assert.equal(
  protocol.localized_documents.en.protocolSchema,
  protocolSchema.$id,
  'localized English docs should expose protocol schema',
);
assert.equal(
  protocol.localized_documents.en.agentHomeSchema,
  agentHomeSchema.$id,
  'localized English docs should expose agent home schema',
);

const agentHome = await readJson(path.join('agent', 'home.json'));

assert.equal(agentHome.$schema, agentHomeSchema.$id);
assert.equal(agentHome.protocol_version, protocol.version);
assert.equal(agentHome.capabilities.structured_protocol_manifest, true);
assert.equal(agentHome.access_policy.mode, 'read_only');
assert.equal(agentHome.documents.protocol, protocol.canonical_documents.protocol);
assert.equal(agentHome.documents.protocolSchema, protocolSchema.$id);
assert.equal(agentHome.documents.agentHomeSchema, agentHomeSchema.$id);
assert.ok(
  agentHome.collections.posts.total >= 1,
  'agent/home.json should expose at least one post',
);
assert.ok(
  agentHome.collections.posts.latest.length >= 1,
  'agent/home.json should expose latest posts',
);

const zhHansAgentHome = await readJson(path.join('zh-hans', 'agent', 'home.json'));

assert.equal(zhHansAgentHome.site.locale, 'zh-hans');
assert.equal(
  zhHansAgentHome.documents.policy,
  protocol.localized_documents['zh-hans'].policy,
);
assert.equal(zhHansAgentHome.documents.protocol, protocol.canonical_documents.protocol);
assert.equal(
  zhHansAgentHome.documents.agentHomeSchema,
  agentHomeSchema.$id,
);

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
