import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import path from 'node:path';

const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
const expectedLocales = [
  'en',
  'zh-hans',
  'zh-hant',
  'ko',
  'fr',
  'de',
  'it',
  'es',
  'ru',
  'id',
  'pt-br',
];
const referenceLocale = 'en';
const validExtensions = new Set(['.md', '.mdx']);

async function readLocaleSlugs(locale) {
  const localeDir = path.join(postsDir, locale);
  const entries = await readdir(localeDir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && validExtensions.has(path.extname(entry.name)))
    .map((entry) => entry.name.replace(path.extname(entry.name), ''))
    .sort();
}

function diff(source, target) {
  const targetSet = new Set(target);
  return source.filter((item) => !targetSet.has(item));
}

const referenceSlugs = await readLocaleSlugs(referenceLocale);
assert.ok(referenceSlugs.length > 0, 'Reference locale must contain at least one post.');

const failures = [];

for (const locale of expectedLocales) {
  const slugs = await readLocaleSlugs(locale);
  const missing = diff(referenceSlugs, slugs);
  const extras = diff(slugs, referenceSlugs);

  if (missing.length || extras.length) {
    failures.push({
      locale,
      missing,
      extras,
    });
  }
}

if (failures.length) {
  const details = failures
    .map(({ locale, missing, extras }) => {
      const lines = [`- ${locale}`];
      if (missing.length) lines.push(`  missing: ${missing.join(', ')}`);
      if (extras.length) lines.push(`  extra: ${extras.join(', ')}`);
      return lines.join('\n');
    })
    .join('\n');

  throw new Error(`Post coverage mismatch detected:\n${details}`);
}

console.log(
  `Post coverage check passed: ${expectedLocales.length} locales x ${referenceSlugs.length} slugs.`,
);
