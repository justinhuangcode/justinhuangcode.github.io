import { createAgentHomeResponse } from '@/lib/agent-protocol';

export async function GET() {
  return createAgentHomeResponse('en');
}
