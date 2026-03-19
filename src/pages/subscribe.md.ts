import { createSubscribeResponse } from '@/lib/agent-protocol';

export function GET() {
  return createSubscribeResponse('en');
}
