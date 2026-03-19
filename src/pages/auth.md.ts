import { createAuthResponse } from '@/lib/agent-protocol';

export function GET() {
  return createAuthResponse('en');
}
