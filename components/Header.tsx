'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { LOCALES, getDict, type Locale } from '../lib/i18n';

/**
 * Detect locale from URL: /fr/* → 'fr', /es/* → 'es', everything else → 'en'.
 * Returns the locale and the path *without* the locale prefix (always starting with '/').
 */
function parseLocale(pathname: string | null): { locale: Locale; rest: string } {
  if (!pathname) return { locale: 'en', rest: '/' };
  const m = pathname.match(/^\/(fr|es)(\/.*)?$/);
  if (m) {
    const locale = m[1] as Locale;
    const rest = m[2] || '/';
    return { locale, rest };
  }
  return { locale: 'en', rest: pathname };
}

function prefixFor(locale: Locale, path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'en') return p;
  return p === '/' ? `/${locale}` : `/${locale}${p}`;
}

export default function Header() {
  const pathname = usePathname();
  const { locale, rest } = useMemo(() => parseLocale(pathname), [pathname]);
  const t = getDict(locale);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // isAdmin must default to false so SSR and first client render match;
  // useEffect then promotes it client-side, avoiding hydration mismatch.
  const [isAdmin, setIsAdmin] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const langCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onLangEnter = useCallback(() => {
    if (langCloseTimer.current) clearTimeout(langCloseTimer.current);
    setLangOpen(true);
  }, []);

  const onLangLeave = useCallback(() => {
    langCloseTimer.current = setTimeout(() => setLangOpen(false), 160);
  }, []);

  // Initialise from localStorage on mount
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored ? stored === 'dark' : prefersDark;
    setDark(isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = useCallback(() => {
    setDark(prev => {
      const next = !prev;
      document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  useEffect(() => {
    setIsAdmin(pathname?.startsWith('/admin') ?? false);
  }, [pathname]);

  // Sync <html lang> with the current locale (SEO + accessibility)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  // Subtle header state on scroll — denser shadow + tighter padding
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const homeHref = prefixFor(locale, '/');
  const investmentsHref = prefixFor(locale, '/investments');
  const mapHref = prefixFor(locale, '/map');
  const aboutHref = prefixFor(locale, '/about');

  const isActive = (href: string) => {
    if (href === homeHref) return rest === '/' || rest === '';
    const checkRest = href.replace(/^\/(fr|es)/, '') || '/';
    return rest === checkRest || rest.startsWith(checkRest + '/');
  };

  const closeMenu = () => setMenuOpen(false);

  // Language switcher: swap prefix, keep rest of path
  const switchTo = (target: Locale): string => prefixFor(target, rest);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container header-inner">
        <Link href={homeHref} className="brand" onClick={closeMenu}>
          <span className="brand-name">Rumah<span>Ya</span></span>
        </Link>

        <button
          className={`nav-toggle ${menuOpen ? 'is-open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>

        <nav className={`primary-nav ${menuOpen ? 'is-open' : ''}`}>
          {!isAdmin && (
            <>
              <Link
                href={homeHref}
                className={isActive(homeHref) ? 'nav-link is-active' : 'nav-link'}
                onClick={closeMenu}
              >
                {t.nav.rentals}
              </Link>
              <Link
                href={investmentsHref}
                className={isActive(investmentsHref) ? 'nav-link is-active' : 'nav-link'}
                onClick={closeMenu}
              >
                {t.nav.investments}
              </Link>
              <Link
                href={mapHref}
                className={isActive(mapHref) ? 'nav-link is-active' : 'nav-link'}
                onClick={closeMenu}
              >
                {t.nav.map}
              </Link>
              <Link
                href={aboutHref}
                className={isActive(aboutHref) ? 'nav-link is-active' : 'nav-link'}
                onClick={closeMenu}
              >
                {t.nav.about}
              </Link>

              {/* Dark mode toggle */}
              <button
                type="button"
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                title={dark ? 'Light mode' : 'Dark mode'}
              >
                {dark ? '☀️' : '🌙'}
              </button>

              {/* Language switcher */}
              <div
                className="lang-switcher"
                onMouseEnter={onLangEnter}
                onMouseLeave={onLangLeave}
              >
                <button
                  type="button"
                  className="lang-trigger"
                  onClick={() => setLangOpen(v => !v)}
                  aria-haspopup="listbox"
                  aria-expanded={langOpen}
                  aria-label="Language"
                >
                  {locale.toUpperCase()}
                  <span className="lang-caret" aria-hidden>▾</span>
                </button>
                {langOpen && (
                  <ul className="lang-menu" role="listbox">
                    {LOCALES.map(l => (
                      <li key={l}>
                        <Link
                          href={switchTo(l)}
                          className={`lang-option ${l === locale ? 'is-active' : ''}`}
                          onClick={() => { setLangOpen(false); closeMenu(); }}
                          hrefLang={l}
                        >
                          {l.toUpperCase()}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
          {isAdmin && (
            <>
              <Link
                href="/admin"
                className={pathname === '/admin' ? 'nav-link is-active' : 'nav-link'}
                onClick={closeMenu}
              >
                Rentals
              </Link>
              <Link
                href="/admin/investments"
                className={pathname?.startsWith('/admin/investments') ? 'nav-link is-active' : 'nav-link'}
                onClick={closeMenu}
              >
                Investments
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
