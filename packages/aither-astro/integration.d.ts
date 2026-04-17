import type { AstroIntegration } from 'astro';
import type { AITHER_DEFAULT_LOCALE, AITHER_LOCALES } from './constants';

export interface AitherIntegrationOptions {
  defaultLocale?: typeof AITHER_DEFAULT_LOCALE;
  locales?: typeof AITHER_LOCALES;
  prefixDefaultLocale?: boolean;
}

export declare function aither(options?: AitherIntegrationOptions): AstroIntegration;

export default aither;
