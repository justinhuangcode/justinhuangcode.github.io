import { createReadingResponse } from '@/lib/agent-protocol';

export function GET() {
  return createReadingResponse('en');
}
