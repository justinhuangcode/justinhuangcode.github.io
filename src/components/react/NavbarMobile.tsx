import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconMenu, IconX, IconSun, IconMoon, IconMonitor, IconLanguage } from '@/components/icons';
import { locales, localeLabels, getLocalizedPath, type Locale } from '@/i18n';

interface NavLink {
  title: string;
  href: string;
}

interface NavbarMobileProps {
  locale: Locale;
  currentPath: string;
  siteName: string;
  logoLight: string;
  logoDark: string;
  navLinks: NavLink[];
  languageLabel?: string;
}

export default function NavbarMobile({
  locale,
  currentPath,
  siteName,
  logoLight,
  logoDark,
  navLinks,
  languageLabel = 'Language',
}: NavbarMobileProps) {
  const [open, setOpen] = useState(false);

  const setTheme = (theme: string) => {
    localStorage.setItem('theme', theme);
    const root = document.documentElement;
    root.classList.add('theme-transition');
    root.classList.remove('light', 'dark');
    let resolved = theme;
    if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    root.classList.add(resolved);
    setTimeout(() => root.classList.remove('theme-transition'), 500);
  };

  return (
    <div className="lg:hidden">
      <div className="flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <img
            src={logoLight}
            alt={siteName}
            className="size-8 rounded-md dark:hidden"
          />
          <img
            src={logoDark}
            alt={siteName}
            className="size-8 rounded-md hidden dark:block"
          />
          <span className="text-xl font-semibold flex items-center gap-2"><span aria-hidden="true">✍️</span><span>{siteName}</span></span>
        </a>

        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-expanded={open}
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
            className="size-8 rounded-md border"
          >
            {open ? (
              <IconX className="size-4" />
            ) : (
              <IconMenu className="size-4" />
            )}
          </Button>
        </div>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="fixed inset-0 top-[57px] z-50 flex flex-col overflow-y-auto bg-background animate-in fade-in-0 duration-200"
        >
          <div className="flex flex-1 flex-col items-start gap-4 p-4">
            <ul className="w-full space-y-1">
              {navLinks.map((item) => {
                const isActive =
                  currentPath === item.href ||
                  (item.href !== '/' && currentPath.startsWith(item.href));
                return (
                  <li key={item.title} className="py-1">
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex w-full items-center rounded-md p-2 text-base text-muted-foreground transition-colors duration-150 hover:text-foreground ${
                        isActive ? 'font-semibold text-primary' : ''
                      }`}
                    >
                      {item.title}
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* Language switcher */}
            <div className="w-full border-t border-border/50 pt-4">
              <div className="flex items-center gap-2 px-2 pb-2 text-xs font-medium text-muted-foreground uppercase">
                <IconLanguage className="size-3.5" />
                {languageLabel}
              </div>
              <div className="flex flex-wrap gap-2 px-2">
                {locales.map((loc) => (
                  <a
                    key={loc}
                    href={getLocalizedPath(currentPath, loc)}
                    className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                      loc === locale
                        ? 'bg-muted font-semibold text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {localeLabels[loc]}
                  </a>
                ))}
              </div>
            </div>

            {/* Theme switcher */}
            <div className="mt-auto w-full border-t border-border/50 p-4 flex items-center justify-end">
              <div className="inline-flex items-center gap-1 rounded-full border border-border p-1">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className="rounded-full p-1.5 hover:bg-accent transition-colors"
                  aria-label="Light mode"
                >
                  <IconSun className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className="rounded-full p-1.5 hover:bg-accent transition-colors"
                  aria-label="Dark mode"
                >
                  <IconMoon className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('system')}
                  className="rounded-full p-1.5 hover:bg-accent transition-colors"
                  aria-label="System mode"
                >
                  <IconMonitor className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
