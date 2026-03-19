import { createAboutMarkdownResponse } from '@/lib/site-content';

export function GET() {
  return createAboutMarkdownResponse('en');
}
