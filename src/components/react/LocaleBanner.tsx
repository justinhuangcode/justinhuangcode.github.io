import { useCallback, useEffect, useRef, useState } from 'react';
import { localeLabels, getLocalizedPath, type Locale } from '@/i18n';

const DISMISSED_KEY = 'locale-banner-dismissed';
const PREFERRED_KEY = 'preferred-locale';

/** Map browser language to supported locale */
function detectLocale(): Locale | null {
  if (typeof window === 'undefined') return null;
  const lang = (navigator.language || '').toLowerCase();
  const code = lang.split('-')[0];

  if (code === 'zh') {
    if (lang.includes('tw') || lang.includes('hk') || lang.includes('hant')) {
      return 'zh-hant';
    }
    return 'zh-hans';
  }
  if (code === 'ko') return 'ko';
  if (code === 'fr') return 'fr';
  if (code === 'de') return 'de';
  if (code === 'it') return 'it';
  if (code === 'es') return 'es';
  if (code === 'ru') return 'ru';
  if (code === 'id' || code === 'ms') return 'id';
  if (code === 'pt') return 'pt-br';
  if (code === 'en') return 'en';
  return null;
}

interface Props {
  currentLocale: Locale;
  currentPath: string;
  allMessages: Record<string, { message: string; switch: string }>;
}

export default function LocaleBanner({ currentLocale, currentPath, allMessages }: Props) {
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState<Locale | null>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Already has a preference → auto-redirect handled by inline script
    if (localStorage.getItem(PREFERRED_KEY)) return;

    // Dismissed within this session
    if (sessionStorage.getItem(DISMISSED_KEY)) return;

    const detected = detectLocale();
    if (detected && detected !== currentLocale) {
      setTarget(detected);
      setShow(true);
    }
  }, [currentLocale]);

  // Push navbar down when banner is visible
  useEffect(() => {
    const header = document.querySelector('header');
    const spacer = document.querySelector('[data-navbar-spacer]') as HTMLElement;
    if (show && bannerRef.current) {
      const h = bannerRef.current.offsetHeight;
      if (header) (header as HTMLElement).style.top = `${h}px`;
      if (spacer) spacer.style.height = `${50 + h}px`;
    }
    return () => {
      if (header) (header as HTMLElement).style.top = '0px';
      if (spacer) spacer.style.height = '50px';
    };
  }, [show]);

  const handleSwitch = useCallback(() => {
    if (!target) return;
    localStorage.setItem(PREFERRED_KEY, target);
    sessionStorage.setItem(DISMISSED_KEY, '1');
    window.location.href = getLocalizedPath(currentPath, target);
  }, [target, currentPath]);

  const handleDismiss = useCallback(() => {
    sessionStorage.setItem(DISMISSED_KEY, '1');
    setShow(false);
  }, []);

  if (!show || !target) return null;

  const msgs = allMessages[target] || allMessages[currentLocale];
  const langName = localeLabels[target] || target;
  const text = msgs.message.replace('{lang}', langName);

  return (
    <div
      ref={bannerRef}
      className="fixed top-0 right-0 left-0 z-[51] bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg"
    >
      <div className="mx-auto px-[15px] min-[768px]:max-w-[750px] min-[992px]:max-w-[970px] min-[1200px]:max-w-[1170px] py-2.5">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[16px] font-semibold">{text}</span>
          <div className="flex flex-shrink-0 items-center gap-2">
            <button
              onClick={handleSwitch}
              className="rounded-md bg-white px-4 py-1.5 text-sm font-semibold text-primary hover:bg-white/90 transition-colors shadow-sm"
            >
              {msgs.switch}
            </button>
            <button
              onClick={handleDismiss}
              className="rounded p-1 hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4" shapeRendering="geometricPrecision">
                <path d="M12.5 3.5L3.5 12.5M3.5 3.5l9 9" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
