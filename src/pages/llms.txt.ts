import { createLlmsResponse } from '@/lib/site-content';

export async function GET() {
  return createLlmsResponse('en', 'summary');
}
