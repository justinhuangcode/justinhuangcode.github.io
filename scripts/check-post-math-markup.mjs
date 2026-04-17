import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
const validExtensions = new Set(['.md', '.mdx']);

const suspiciousBlockquotePatterns = [
  /[=^\\]/,
  /[∏Σ√≈∝≳≤≥αβγδθλμπ]/u,
  /\b(?:Attention|MultiHead|PE|softmax|tanh|exp|RMSNorm|sin|cos)\(/,
];

const suspiciousInlineCodePatterns = [
  /\\[A-Za-z]+/,
  /[{}]/,
  /^O\([^)]+\)$/,
  /[αβγδθλμπ].*[_^({]/u,
];

const allowedInlineCodePatterns = [
  /^[./\w-]+(?:\/[./\w-]+)+\.[A-Za-z0-9]+$/,
];

async function* walkFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      yield* walkFiles(fullPath);
      continue;
    }

    if (entry.isFile() && validExtensions.has(path.extname(entry.name))) {
      yield fullPath;
    }
  }
}

function isSuspiciousBlockquote(line) {
  return suspiciousBlockquotePatterns.some((pattern) => pattern.test(line));
}

function isSuspiciousInlineCode(value) {
  if (allowedInlineCodePatterns.some((pattern) => pattern.test(value))) {
    return false;
  }

  return suspiciousInlineCodePatterns.some((pattern) => pattern.test(value));
}

const failures = [];

for await (const file of walkFiles(postsDir)) {
  const relativePath = path.relative(process.cwd(), file);
  const content = await readFile(file, 'utf8');
  const lines = content.split('\n');

  for (let index = 0; index < lines.length; index += 1) {
    const lineNumber = index + 1;
    const line = lines[index];
    const trimmed = line.trim();

    if (trimmed.startsWith('> ') && isSuspiciousBlockquote(trimmed.slice(2))) {
      failures.push(
        `${relativePath}:${lineNumber} suspicious formula-like blockquote; use $$...$$ instead`,
      );
    }

    for (const match of line.matchAll(/`([^`]+)`/g)) {
      const value = match[1];

      if (isSuspiciousInlineCode(value)) {
        failures.push(
          `${relativePath}:${lineNumber} suspicious math-like inline code \`${value}\`; use $...$ instead`,
        );
      }
    }
  }
}

if (failures.length) {
  throw new Error(
    `Math markup issues detected in post content:\n${failures.map((item) => `- ${item}`).join('\n')}`,
  );
}

console.log('Math markup check passed: no suspicious formula blockquotes or inline code found.');
