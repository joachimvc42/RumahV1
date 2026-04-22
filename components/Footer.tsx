'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { LOCALES, getDict, type Locale } from '../lib/i18n';

const WA = '6287873487940';
const EMAIL = 'info@rumahya.com';

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
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="brand-name">Rumah<span>Ya</span></span>
            <p className="footer-brand-tag">{t.footer.tagline}</p>
          </div>

          <div className="footer-col">
            <h3>{t.footer.explore}</h3>
            <ul>
              <li><Link href={prefixFor(locale, '/')}>{t.footer.rentalsLink}</Link></li>
              <li><Link href={prefixFor(locale, '/investments')}>{t.footer.investmentsLink}</Link></li>
              <li><Link href={prefixFor(locale, '/about')}>{t.footer.aboutLink}</Link></li>
              <li><Link href={`${prefixFor(locale, '/about')}#contact`}>{t.footer.contactLink}</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>{t.footer.contact}</h3>
            <ul>
              <li>
                <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer">
                  {t.footer.whatsapp}
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </li>
              <li>{t.footer.location}</li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>{t.footer.services}</h3>
            <ul>
              <li>{t.footer.svcRentals}</li>
              <li>{t.footer.svcLegal}</li>
              <li>{t.footer.svcMgmt}</li>
              <li>{t.footer.svcInvest}</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {currentYear} RumahYa. {t.footer.rights}</span>
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
