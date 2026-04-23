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

export default function Footer() {
  const pathname = usePathname();
  const { locale, rest } = useMemo(() => parseLocale(pathname), [pathname]);
  const t = getDict(locale);
  const currentYear = new Date().getFullYear();

  const switchTo = (target: Locale) => prefixFor(target, rest);

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-bottom">
          <span className="footer-brand-inline">
            <span className="brand-name">Rumah<span>Ya</span></span>
          </span>
          <span>© {currentYear} · {t.footer.rights}</span>
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
          <span>{t.footer.based}</span>
        </div>
      </div>
    </footer>
  );
}
