import { createRssResponse } from '@/lib/site-content';

export async function GET() {
  return createRssResponse('en');
}
