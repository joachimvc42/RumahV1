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
  const m = pathname.match(/^\/(fr|es|id)(\/.*)?$/);
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
    // Noir & Or: dark is the default presentation; light only if explicitly chosen.
    const isDark = stored ? stored === 'dark' : true;
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
  const investmentsHref = prefixFor(locale, '/opportunities');
  const mapHref = prefixFor(locale, '/map');
  const aboutHref = prefixFor(locale, '/about');
  const faqHref = prefixFor(locale, '/faq');
  // 'id' only has translated Opportunities/Map pages so far — Home/About/FAQ/
  // Rentals stay EN/FR/ES-only rather than 404 or silently fall back to English.
  const showFullNav = locale !== 'id';
  const isActive = (href: string) => {
    if (href === homeHref) return rest === '/' || rest === '';
    const checkRest = href.replace(/^\/(fr|es|id)/, '') || '/';
    return rest === checkRest || rest.startsWith(checkRest + '/');
  };

  const closeMenu = () => setMenuOpen(false);

  // Language switcher: swap prefix, keep rest of path. 'id' only has
  // Opportunities + Map pages — switching to it from an untranslated page
  // (home, About, FAQ, legal) would 404, so land on the Opportunities gallery
  // instead of the equivalent untranslated path.
  const switchTo = (target: Locale): string => {
    if (target === 'id' && !/^\/(opportunities|map)(\/|$)/.test(rest)) {
      return '/id/opportunities';
    }
    return prefixFor(target, rest);
  };

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container header-inner">
        <Link href={showFullNav ? homeHref : investmentsHref} className="brand" onClick={closeMenu}>
          <span className="brand-diamond" aria-hidden="true" />
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
              {/* ── Centred main links ── */}
              <div className="nav-main-links">
                {showFullNav && (
                  <Link
                    href={aboutHref}
                    className={(isActive(homeHref) || isActive(aboutHref)) ? 'nav-link is-active' : 'nav-link'}
                    onClick={closeMenu}
                  >
                    {t.nav.about}
                  </Link>
                )}
                <Link
                  href={investmentsHref}
                  className={isActive(investmentsHref) ? 'nav-link is-active' : 'nav-link'}
                  onClick={closeMenu}
                >
                  {t.ui.opportunities}
                </Link>
                <Link
                  href={mapHref}
                  className={isActive(mapHref) ? 'nav-link is-active' : 'nav-link'}
                  onClick={closeMenu}
                >
                  {t.nav.map}
                </Link>
                {showFullNav && (
                  <Link
                    href={faqHref}
                    className={rest.startsWith('/faq') ? 'nav-link is-active' : 'nav-link'}
                    onClick={closeMenu}
                  >
                    FAQ
                  </Link>
                )}
                {/* Guide (blog) content is EN-only for now — no FR/ES translation yet */}
                {locale === 'en' && (
                  <Link
                    href="/blog"
                    className={rest.startsWith('/blog') ? 'nav-link is-active' : 'nav-link'}
                    onClick={closeMenu}
                  >
                    Guide
                  </Link>
                )}
              </div>

              {/* ── Right-side controls ── */}
              <div className="nav-side-controls">
                {showFullNav && (
                  <a
                    href="https://rentals.rumahya.com"
                    className="nav-link nav-link-rentals"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="RumahYa Rentals"
                    onClick={closeMenu}
                  >
                    {t.nav.rentals} →
                  </a>
                )}

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
              </div>{/* end nav-side-controls */}
            </>
          )}
          {isAdmin && (
            <Link
              href="/admin/investments"
              className={pathname?.startsWith('/admin/investments') ? 'nav-link is-active' : 'nav-link'}
              onClick={closeMenu}
            >
              Listings
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
