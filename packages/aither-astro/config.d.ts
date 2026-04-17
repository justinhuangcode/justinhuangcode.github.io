import type { AstroUserConfig } from 'astro';
import type { AITHER_DEFAULT_LOCALE, AITHER_LOCALES } from './constants';

export interface AitherConfigOptions {
  defaultLocale?: typeof AITHER_DEFAULT_LOCALE;
  locales?: typeof AITHER_LOCALES;
  prefixDefaultLocale?: boolean;
}

export declare function aitherConfig(options?: AitherConfigOptions): AstroUserConfig;
