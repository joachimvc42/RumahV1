'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { readConsent, setConsent } from '../lib/consent';
import { getDict, type Locale } from '../lib/i18n';

function parseLocale(pathname: string | null): Locale {
  if (!pathname) return 'en';
  const m = pathname.match(/^\/(fr|es)(\/.*)?$/);
  return m ? (m[1] as Locale) : 'en';
}

function privacyHref(locale: Locale): string {
  return locale === 'en' ? '/privacy' : `/${locale}/privacy`;
}

export default function ConsentBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const locale = parseLocale(pathname);
  const t = getDict(locale).consent;

  useEffect(() => {
    /* Show banner only when no decision recorded yet. */
    const existing = readConsent();
    if (!existing) setVisible(true);
  }, []);

  if (!visible) return null;

  const handleAccept = () => {
    setConsent(true);
    setVisible(false);
  };

  const handleReject = () => {
    setConsent(false);
    setVisible(false);
  };

  return (
    <div
      className="consent-banner"
      role="dialog"
      aria-live="polite"
      aria-label={t.title}
    >
      <div className="consent-banner-inner">
        <div className="consent-banner-text">
          <p className="consent-banner-title">{t.title}</p>
          <p className="consent-banner-body">
            {t.body}{' '}
            <Link href={privacyHref(locale)} className="consent-banner-link">
              {t.learnMore}
            </Link>
          </p>

          {showDetails && (
            <ul className="consent-banner-details">
              <li>
                <strong>{t.necessaryLabel}</strong>: {t.necessaryDesc}
              </li>
              <li>
                <strong>{t.analyticsLabel}</strong>: {t.analyticsDesc}
              </li>
            </ul>
          )}

          <button
            type="button"
            className="consent-banner-toggle"
            onClick={() => setShowDetails((v) => !v)}
          >
            {showDetails ? t.hideDetails : t.showDetails}
          </button>
        </div>

        <div className="consent-banner-actions">
          <button
            type="button"
            className="consent-btn consent-btn-secondary"
            onClick={handleReject}
          >
            {t.reject}
          </button>
          <button
            type="button"
            className="consent-btn consent-btn-primary"
            onClick={handleAccept}
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
