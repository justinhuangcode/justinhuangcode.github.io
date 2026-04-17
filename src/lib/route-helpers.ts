import type { CollectionKey } from 'astro:content';
import { siteConfig, type ContentSection } from '@/config/site';
import { defaultLocale, nonDefaultLocales, type Locale } from '@/i18n';
import { getContentByLocale, getSlug, type LocalizedEntry } from '@/lib/posts';

type StaticPath<
  TParams extends Record<string, string>,
  TProps extends Record<string, unknown> = Record<never, never>,
> = {
  params: TParams;
  props?: TProps;
};

type LocalizedStaticPath<
  TParams extends Record<string, string>,
  TProps extends Record<string, unknown> = Record<never, never>,
> = {
  params: { locale: Locale } & TParams;
  props: { locale: Locale } & TProps;
};

export const rootLocale = defaultLocale;

export function createRootStaticPaths<
  TParams extends Record<string, string>,
  TProps extends Record<string, unknown> = Record<never, never>,
>(
  getPathsForRoot: (
    locale: Locale,
  ) => Promise<StaticPath<TParams, TProps>[]> | StaticPath<TParams, TProps>[],
) {
  return () => getPathsForRoot(rootLocale);
}

export function createLocaleOnlyStaticPaths(): Array<
  LocalizedStaticPath<Record<never, never>, Record<never, never>>
> {
  return nonDefaultLocales.map((locale) => ({
    params: { locale },
    props: { locale },
  }));
}

export function createPropsRouteHandler<TProps extends Record<string, unknown>, TResult>(
  handler: (props: TProps) => TResult | Promise<TResult>,
) {
  return ({ props }: { props: TProps }) => handler(props);
}

export function createLocaleRouteHandler<TResult>(
  handler: (locale: Locale) => TResult | Promise<TResult>,
) {
  return createPropsRouteHandler<{ locale: Locale }, TResult>(({ locale }) => handler(locale));
}

export function createRootRouteHandler<TResult>(
  handler: (locale: Locale) => TResult | Promise<TResult>,
) {
  return () => handler(rootLocale);
}

export async function createLocalizedStaticPaths<
  TParams extends Record<string, string>,
  TProps extends Record<string, unknown> = Record<never, never>,
>(
  getPathsForLocale: (
    locale: Locale,
  ) => Promise<StaticPath<TParams, TProps>[]> | StaticPath<TParams, TProps>[],
): Promise<Array<LocalizedStaticPath<TParams, TProps>>> {
  const paths: Array<LocalizedStaticPath<TParams, TProps>> = [];

  for (const locale of nonDefaultLocales) {
    const localePaths = await getPathsForLocale(locale);

    localePaths.forEach((path) => {
      const props = (path.props ?? {}) as TProps;

      paths.push({
        params: { locale, ...path.params },
        props: { locale, ...props },
      });
    });
  }

  return paths;
}

export function createSectionIndexStaticPaths(_locale: Locale) {
  return siteConfig.sections.map((section) => ({
    params: { section: section.id },
    props: { section },
  }));
}

export async function createSectionEntryStaticPaths(locale: Locale) {
  const paths: Array<
    StaticPath<
      { section: string; slug: string },
      {
        section: ContentSection;
        entry: LocalizedEntry<CollectionKey>;
        prevEntry: LocalizedEntry<CollectionKey> | null;
        nextEntry: LocalizedEntry<CollectionKey> | null;
      }
    >
  > = [];

  for (const section of siteConfig.sections) {
    const entries = await getContentByLocale(section.id, locale);

    entries.forEach((entry, index) => {
      paths.push({
        params: { section: section.id, slug: getSlug(entry.id) },
        props: {
          section,
          entry,
          prevEntry: index < entries.length - 1 ? entries[index + 1] : null,
          nextEntry: index > 0 ? entries[index - 1] : null,
        },
      });
    });
  }

  return paths;
}
