'use client';

import { useEffect, useState } from 'react';
import { getFaqs } from '@/lib/faq';
import { getDict, type Locale } from '@/lib/i18n';

const WA_NUMBER = '6287873487940';

// Stable anchor ids for FAQ items linked to from elsewhere on the site (index
// is consistent across en/fr/es — the leasehold-vs-freehold question is #2
// in every locale). Add more here if other items get deep-linked later.
const ANCHOR_IDS: Record<number, string> = {
  1: 'leasehold-vs-freehold',
};

export default function FaqClient({ locale = 'en' }: { locale?: Locale }) {
  const [open, setOpen] = useState<number | null>(null);
  const t = getDict(locale);
  const faqs = getFaqs(locale);

  const toggle = (i: number) => setOpen(prev => (prev === i ? null : i));

  const waHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(t.faq.waMsg)}`;

  // Deep link support: /faq#leasehold-vs-freehold opens that item and scrolls to it.
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;
    const idx = Object.entries(ANCHOR_IDS).find(([, id]) => id === hash)?.[0];
    if (idx == null) return;
    setOpen(Number(idx));
    requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  return (
    <main>
      {/* Hero */}
      <section className="faq-hero">
        <div className="container">
          <p className="eyebrow" style={{ marginBottom: 16 }}>{t.faq.eyebrow}</p>
          <h1 className="faq-hero-title">
            {t.faq.titleA}<br />
            <em>{t.faq.titleEm}</em>
          </h1>
          <p className="faq-hero-lead">{t.faq.lead}</p>
        </div>
      </section>

      {/* Accordion */}
      <section className="faq-section">
        <div className="container faq-container">
          <div className="faq-list" role="list">
            {faqs.map((item, i) => (
              <div
                key={i}
                id={ANCHOR_IDS[i]}
                className={`faq-item ${open === i ? 'is-open' : ''}`}
                role="listitem"
              >
                <button
                  className="faq-question"
                  aria-expanded={open === i}
                  aria-controls={`faq-answer-${i}`}
                  onClick={() => toggle(i)}
                >
                  <span className="faq-question-text">{item.question}</span>
                  <span className="faq-chevron" aria-hidden="true">
                    {open === i ? '−' : '+'}
                  </span>
                </button>
                <div
                  id={`faq-answer-${i}`}
                  className="faq-answer"
                  hidden={open !== i}
                >
                  <div
                    className="faq-answer-inner"
                    dangerouslySetInnerHTML={{ __html: item.answer }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="faq-cta">
            <p className="faq-cta-text">{t.faq.ctaText}</p>
            <a
              href={waHref}
              className="btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.faq.ctaButton}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
