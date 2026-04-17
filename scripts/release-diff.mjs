import assert from 'node:assert/strict';
import { execFile as execFileCallback } from 'node:child_process';
import { promisify } from 'node:util';

const execFile = promisify(execFileCallback);

const SITE_OWNED_PREFIXES = [
  '.env',
  'src/content/',
  'src/config/site.ts',
];

const THEME_RUNTIME_PREFIXES = [
  '.github/workflows/',
  'astro.config.mjs',
  'public/',
  'scripts/',
  'src/components/',
  'src/config/themes.ts',
  'src/content.config.ts',
  'src/i18n/',
  'src/layouts/',
  'src/lib/',
  'src/pages/',
  'src/styles/',
  'tsconfig.json',
];

function parseArgs(argv) {
  const args = { from: '', to: '' };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--from') {
      args.from = argv[i + 1] ?? '';
      i += 1;
      continue;
    }
    if (arg === '--to') {
      args.to = argv[i + 1] ?? '';
      i += 1;
    }
  }

  return args;
}

function matchesPrefix(filePath, prefixes) {
  return prefixes.some((prefix) => filePath === prefix || filePath.startsWith(prefix));
}

function formatList(items) {
  if (!items.length) return ['- none'];
  return items.map((item) => `- ${item}`);
}

async function ensureRefExists(ref) {
  try {
    await execFile('git', ['rev-parse', '--verify', '--quiet', ref]);
  } catch {
    throw new Error(`Git ref not found: ${ref}`);
  }
}

const { from, to } = parseArgs(process.argv.slice(2));

assert.ok(
  from && to,
  'Usage: pnpm upgrade:diff -- --from v2026.03.20 --to v2026.04.08',
);

await ensureRefExists(from);
await ensureRefExists(to);

const { stdout: nameStatusOutput } = await execFile('git', [
  'diff',
  '--name-status',
  `${from}..${to}`,
]);

const rows = nameStatusOutput
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => {
    const [status, ...pathParts] = line.split('\t');
    const filePath = pathParts.at(-1) ?? '';
    return { status, filePath };
  });

if (!rows.length) {
  console.log(`No file changes between ${from} and ${to}.`);
  process.exit(0);
}

const siteOwned = [];
const themeRuntime = [];
const other = [];

for (const row of rows) {
  if (matchesPrefix(row.filePath, SITE_OWNED_PREFIXES)) {
    siteOwned.push(row);
    continue;
  }
  if (matchesPrefix(row.filePath, THEME_RUNTIME_PREFIXES)) {
    themeRuntime.push(row);
    continue;
  }
  other.push(row);
}

console.log(`Aither release diff: ${from} -> ${to}`);
console.log('');
console.log(`Total changed files: ${rows.length}`);
console.log(`Site-owned files: ${siteOwned.length}`);
console.log(`Theme/runtime files: ${themeRuntime.length}`);
console.log(`Other files: ${other.length}`);
console.log('');
console.log('Site-owned paths to review carefully:');
console.log(formatList(siteOwned.map((row) => `${row.status} ${row.filePath}`)).join('\n'));
console.log('');
console.log('Theme/runtime paths that likely contain upstream fixes:');
console.log(formatList(themeRuntime.map((row) => `${row.status} ${row.filePath}`)).join('\n'));
console.log('');
console.log('Other changed paths:');
console.log(formatList(other.map((row) => `${row.status} ${row.filePath}`)).join('\n'));
console.log('');
console.log('Recommended next step: review the site-owned list first, then port the theme/runtime files you actually need.');
