import { createAboutMarkdownResponse } from '@/lib/site-content';
import { nonDefaultLocales, type Locale } from '@/i18n';

export function getStaticPaths() {
  return nonDefaultLocales.map((locale) => ({
    params: { locale },
    props: { locale },
  }));
}

export function GET({ props }: { props: { locale: Locale } }) {
  return createAboutMarkdownResponse(props.locale);
}
