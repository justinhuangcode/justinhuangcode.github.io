import { createAgentHomeSchemaResponse } from '@/lib/agent-protocol';

export function GET() {
  return createAgentHomeSchemaResponse();
}
