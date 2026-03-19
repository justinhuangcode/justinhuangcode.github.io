import { createPolicyResponse } from '@/lib/agent-protocol';

export function GET() {
  return createPolicyResponse('en');
}
