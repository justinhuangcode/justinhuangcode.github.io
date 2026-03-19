import { siteConfig } from '@/config/site';

export function formatDate(date: Date): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: siteConfig.blog.timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  return `${year}-${month}-${day}`;
}

/**
 * Strip markdown syntax to get plain text for accurate counting.
 */
function stripMarkdown(md: string): string {
  return md
    .replace(/^---[\s\S]*?---/m, '')    // frontmatter
    .replace(/```[\s\S]*?```/g, '')      // code blocks
    .replace(/`[^`]*`/g, '')             // inline code
    .replace(/!\[.*?\]\(.*?\)/g, '')     // images
    .replace(/\[([^\]]*)\]\(.*?\)/g, '$1') // links → keep text
    .replace(/^#{1,6}\s+/gm, '')         // headings markers
    .replace(/[*_~]{1,3}/g, '')          // bold/italic/strikethrough
    .replace(/^>\s+/gm, '')              // blockquotes
    .replace(/^[-*+]\s+/gm, '')          // unordered lists
    .replace(/^\d+\.\s+/gm, '')          // ordered lists
    .replace(/\|/g, '')                  // table pipes
    .replace(/^-{3,}/gm, '')            // horizontal rules
    .replace(/<[^>]*>/g, '')             // HTML tags
    .trim();
}

/**
 * Count words. CJK characters count as 1 each, Latin words count as 1 each.
 */
export function wordCount(text: string): number {
  const clean = stripMarkdown(text);
  const cjk = clean.match(/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g)?.length ?? 0;
  const latin = clean.replace(/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return cjk + latin;
}

/**
 * Estimate reading time in minutes.
 * Uses ~200 wpm for CJK (characters ≈ words) and ~250 wpm for Latin text.
 * Returns at least 1 minute.
 */
export function readingTime(text: string): number {
  const clean = stripMarkdown(text);
  const cjk = clean.match(/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g)?.length ?? 0;
  const latin = clean.replace(/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = cjk / 200 + latin / 250;
  return Math.max(1, Math.round(minutes));
}
