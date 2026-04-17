import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { defaultLocale, locales } from '../config/locale-meta.mjs';

const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
const validExtensions = new Set(['.md', '.mdx']);

async function readLocaleSlugs(locale) {
  const localeDir = path.join(postsDir, locale);
  try {
    const entries = await readdir(localeDir, { withFileTypes: true });

    return {
      exists: true,
      slugs: entries
        .filter((entry) => entry.isFile() && validExtensions.has(path.extname(entry.name)))
        .map((entry) => entry.name.replace(path.extname(entry.name), ''))
        .sort(),
    };
  } catch (error) {
    if (error && typeof error === 'object' && error.code === 'ENOENT') {
      return { exists: false, slugs: [] };
    }

    throw error;
  }
}

function diff(source, target) {
  const targetSet = new Set(target);
  return source.filter((item) => !targetSet.has(item));
}

const referenceResult = await readLocaleSlugs(defaultLocale);
const referenceSlugs = referenceResult.slugs;
assert.ok(referenceSlugs.length > 0, 'Reference locale must contain at least one post.');

const failures = [];

for (const locale of locales) {
  const { exists, slugs } = await readLocaleSlugs(locale);
  const missing = diff(referenceSlugs, slugs);
  const extras = diff(slugs, referenceSlugs);

  if (!exists || missing.length || extras.length) {
    failures.push({
      locale,
      exists,
      missing,
      extras,
    });
  }
}

if (failures.length) {
  const details = failures
    .map(({ locale, exists, missing, extras }) => {
      const lines = [`- ${locale}`];
      if (!exists) lines.push('  missing directory: src/content/posts/' + locale);
      if (missing.length) lines.push(`  missing: ${missing.join(', ')}`);
      if (extras.length) lines.push(`  extra: ${extras.join(', ')}`);
      return lines.join('\n');
    })
    .join('\n');

  throw new Error(`Post coverage mismatch detected:\n${details}`);
}

console.log(
  `Post coverage check passed: ${locales.length} locales x ${referenceSlugs.length} slugs.`,
);
