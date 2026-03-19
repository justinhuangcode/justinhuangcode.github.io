import { themeGroups, type CustomThemeKey } from '@/config/themes';

export type ColorMode = 'light' | 'dark' | 'system';
export type ThemeStyle = 'default' | CustomThemeKey;

export interface ThemePreferences {
  mode: ColorMode;
  style: ThemeStyle;
}

export const COLOR_MODE_STORAGE_KEY = 'color-mode';
export const THEME_STYLE_STORAGE_KEY = 'theme-style';
export const LEGACY_THEME_STORAGE_KEY = 'theme';
export const THEME_CHANGE_EVENT = 'aither:themechange';

export const CUSTOM_THEME_KEYS = themeGroups.flatMap((group) =>
  group.themes.map((theme) => theme.key),
) as CustomThemeKey[];

export const ALL_THEME_CLASSES: string[] = ['light', 'dark', ...CUSTOM_THEME_KEYS];

export function isColorMode(value: string): value is ColorMode {
  return value === 'light' || value === 'dark' || value === 'system';
}

export function isCustomThemeKey(value: string): value is CustomThemeKey {
  return CUSTOM_THEME_KEYS.includes(value as CustomThemeKey);
}

export function isThemeStyle(value: string): value is ThemeStyle {
  return value === 'default' || isCustomThemeKey(value);
}

export function resolveColorMode(mode: ColorMode): 'light' | 'dark' {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  return mode;
}

export function getStoredThemePreferences(
  defaultMode: ColorMode = 'system',
  defaultStyle: ThemeStyle = 'default',
): ThemePreferences {
  if (typeof window === 'undefined') {
    return { mode: defaultMode, style: defaultStyle };
  }

  let mode = defaultMode;
  let style = defaultStyle;

  const storedMode = localStorage.getItem(COLOR_MODE_STORAGE_KEY);
  if (storedMode && isColorMode(storedMode)) {
    mode = storedMode;
  }

  const storedStyle = localStorage.getItem(THEME_STYLE_STORAGE_KEY);
  if (storedStyle && isThemeStyle(storedStyle)) {
    style = storedStyle;
  }

  if (!storedMode && !storedStyle) {
    const legacyTheme = localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
    if (legacyTheme) {
      if (isColorMode(legacyTheme)) {
        mode = legacyTheme;
      } else if (isCustomThemeKey(legacyTheme)) {
        style = legacyTheme;
      }
    }
  }

  return { mode, style };
}

export function applyThemePreferences({ mode, style }: ThemePreferences): ThemePreferences {
  const root = document.documentElement;
  const resolvedMode = resolveColorMode(mode);

  ALL_THEME_CLASSES.forEach((themeClass) => root.classList.remove(themeClass));
  root.classList.add(style === 'default' ? resolvedMode : style);
  root.dataset.mode = resolvedMode;
  root.dataset.theme = style;

  return { mode, style };
}

export function persistThemePreferences({ mode, style }: ThemePreferences) {
  localStorage.setItem(COLOR_MODE_STORAGE_KEY, mode);
  localStorage.setItem(THEME_STYLE_STORAGE_KEY, style);
  localStorage.removeItem(LEGACY_THEME_STORAGE_KEY);
}

export function setThemePreferences(preferences: ThemePreferences) {
  persistThemePreferences(preferences);
  const applied = applyThemePreferences(preferences);

  window.dispatchEvent(
    new CustomEvent(THEME_CHANGE_EVENT, {
      detail: {
        ...applied,
        resolvedMode: resolveColorMode(applied.mode),
      },
    }),
  );

  return applied;
}
