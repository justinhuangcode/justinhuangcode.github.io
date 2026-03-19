import {
  nonDefaultLocales,
  type Locale,
} from '@/i18n';
import { createLlmsResponse } from '@/lib/site-content';

export function getStaticPaths() {
  return nonDefaultLocales.map((locale) => ({
    params: { locale },
    props: { locale },
  }));
}

export async function GET({ props }: { props: { locale: Locale } }) {
  return createLlmsResponse(props.locale, 'full');
}
