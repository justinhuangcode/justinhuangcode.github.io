import { useCallback, useEffect, useRef, useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconMonitor, IconMoon, IconSun } from '@/components/icons';

type Theme = 'light' | 'dark' | 'system';

function resolveTheme(theme: Theme): string {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return theme;
}

function useThemeLocal() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark';
    return (localStorage.getItem('theme') as Theme) || 'dark';
  });

  const setTheme = useCallback((newTheme: Theme) => {
    localStorage.setItem('theme', newTheme);
    setThemeState(newTheme);

    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolveTheme(newTheme));
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (theme === 'system') {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(mediaQuery.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  return { theme, setTheme };
}

export default function ModeSwitcher() {
  const { theme, setTheme } = useThemeLocal();
  const triggerRef = useRef<HTMLButtonElement>(null);

  const changeTheme = useCallback(
    (newTheme: Theme) => {
      const button = triggerRef.current;

      // Fallback for browsers without View Transitions API
      if (!document.startViewTransition || !button) {
        setTheme(newTheme);
        return;
      }

      // Calculate circle center from trigger button
      const rect = button.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      // Max radius — same calculation as shipany
      const right = window.innerWidth - rect.left;
      const bottom = window.innerHeight - rect.top;
      const maxRadius = Math.hypot(
        Math.max(rect.left, right),
        Math.max(rect.top, bottom)
      );

      const transition = document.startViewTransition(() => {
        setTheme(newTheme);
      });

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${maxRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 700,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      });
    },
    [setTheme]
  );

  const items: { key: Theme; label: string; icon: typeof IconSun }[] = [
    { key: 'light', label: 'Light', icon: IconSun },
    { key: 'dark', label: 'Dark', icon: IconMoon },
    { key: 'system', label: 'System', icon: IconMonitor },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        ref={triggerRef}
        className="inline-flex items-center justify-center size-[34px] rounded cursor-pointer text-[var(--color-nav-text)] hover:text-[var(--color-nav-text-hover)]"
        aria-label="Toggle theme"
      >
        <span className="relative inline-flex size-4 items-center justify-center">
          <IconSun className="size-4 rotate-0 scale-100 transition-transform duration-500 ease-in-out dark:-rotate-45 dark:scale-0" />
          <IconMoon className="absolute size-4 rotate-45 scale-0 transition-transform duration-500 ease-in-out dark:rotate-0 dark:scale-100" />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {items.map(({ key, label, icon: Icon }) => (
          <DropdownMenuItem key={key} onClick={() => changeTheme(key)}>
            <Icon className="mr-2 size-4" />
            <span className={theme === key ? 'font-semibold text-primary' : ''}>
              {label}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
