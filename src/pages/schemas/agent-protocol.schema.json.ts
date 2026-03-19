import { createProtocolSchemaResponse } from '@/lib/agent-protocol';

export function GET() {
  return createProtocolSchemaResponse();
}
