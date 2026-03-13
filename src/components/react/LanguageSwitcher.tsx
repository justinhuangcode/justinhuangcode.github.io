import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconLanguage } from '@/components/icons';
import { locales, localeLabels, getLocalizedPath, type Locale } from '@/i18n';

interface LanguageSwitcherProps {
  currentLocale: Locale;
  currentPath: string;
}

export default function LanguageSwitcher({
  currentLocale,
  currentPath,
}: LanguageSwitcherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center justify-center h-[34px] px-2 rounded cursor-pointer text-sm text-[var(--color-nav-text)] hover:text-[var(--color-nav-text-hover)]"
        aria-label="Switch language"
      >
        <IconLanguage className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => {
              localStorage.setItem('preferred-locale', locale);
              window.location.href = getLocalizedPath(currentPath, locale);
            }}
          >
            <span
              className={
                locale === currentLocale ? 'font-semibold text-primary' : ''
              }
            >
              {localeLabels[locale]}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
