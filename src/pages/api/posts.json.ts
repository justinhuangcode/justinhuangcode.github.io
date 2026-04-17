import { createPostsApiResponse } from '@/lib/site-content';

export function GET() {
  return createPostsApiResponse();
}
