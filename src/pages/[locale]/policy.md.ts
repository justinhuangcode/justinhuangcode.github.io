import {
  nonDefaultLocales,
  type Locale,
} from '@/i18n';
import { createPolicyResponse } from '@/lib/agent-protocol';

export function getStaticPaths() {
  return nonDefaultLocales.map((locale) => ({
    params: { locale },
    props: { locale },
  }));
}

export function GET({ props }: { props: { locale: Locale } }) {
  return createPolicyResponse(props.locale);
}
