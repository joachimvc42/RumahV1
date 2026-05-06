'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { LOCALES, getDict, type Locale } from '../lib/i18n';

function parseLocale(pathname: string | null): { locale: Locale; rest: string } {
  if (!pathname) return { locale: 'en', rest: '/' };
  const m = pathname.match(/^\/(fr|es)(\/.*)?$/);
  if (m) return { locale: m[1] as Locale, rest: m[2] || '/' };
  return { locale: 'en', rest: pathname };
}

function prefixFor(locale: Locale, path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'en') return p;
  return p === '/' ? `/${locale}` : `/${locale}${p}`;
}

interface FooterProps {
  site?: 'invest' | 'rentals';
}

export default function Footer({ site = 'invest' }: FooterProps) {
  const pathname = usePathname();
  const { locale, rest } = useMemo(() => parseLocale(pathname), [pathname]);
  const t = getDict(locale);
  const currentYear = new Date().getFullYear();

  const isRentals = site === 'rentals';

  const switchTo = (target: Locale) => prefixFor(target, rest);
  const privacyHref = prefixFor(locale, '/privacy');
  const termsHref = prefixFor(locale, '/terms');

  return (
    <footer className="site-footer">
      <div className="container">
        {/* Cross-site link */}
        {isRentals ? (
          <div className="footer-crosslink">
            Looking to invest in Lombok?{' '}
            <a href="https://rumahya.com" className="footer-crosslink-a">
              Visit RumahYa Investments →
            </a>
          </div>
        ) : (
          <div className="footer-crosslink">
            Looking for long-term rentals?{' '}
            <a href="https://rentals.rumahya.com" className="footer-crosslink-a">
              Visit RumahYa Rentals →
            </a>
          </div>
        )}

        <div className="footer-bottom">
          <span className="footer-brand-inline">
            <span className="brand-name">Rumah<span>Ya</span></span>
            {isRentals && <span className="brand-badge">Rentals</span>}
          </span>
          <span>© {currentYear} · {t.footer.rights}</span>
          <span className="footer-legal">
            <Link href={privacyHref}>{t.footer.privacy}</Link>
            <span className="footer-lang-sep">·</span>
            <Link href={termsHref}>{t.footer.terms}</Link>
          </span>
          {!isRentals && (
            <span className="footer-langs">
              {LOCALES.map((l, i) => (
                <span key={l} className="footer-lang-wrap">
                  {i > 0 && <span className="footer-lang-sep">·</span>}
                  <Link
                    href={switchTo(l)}
                    className={`footer-lang ${l === locale ? 'is-active' : ''}`}
                    hrefLang={l}
                  >
                    {l.toUpperCase()}
                  </Link>
                </span>
              ))}
            </span>
          )}
          <span>{t.footer.based}</span>
        </div>
      </div>
    </footer>
  );
}
