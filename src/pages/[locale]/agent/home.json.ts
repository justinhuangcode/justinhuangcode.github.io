import {
  nonDefaultLocales,
  type Locale,
} from '@/i18n';
import { createAgentHomeResponse } from '@/lib/agent-protocol';

export function getStaticPaths() {
  return nonDefaultLocales.map((locale) => ({
    params: { locale },
    props: { locale },
  }));
}

export async function GET({ props }: { props: { locale: Locale } }) {
  return createAgentHomeResponse(props.locale);
}
