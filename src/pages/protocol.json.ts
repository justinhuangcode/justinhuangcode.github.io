import { createProtocolManifest } from '@/lib/agent-protocol';

export function GET() {
  return createProtocolManifest();
}
