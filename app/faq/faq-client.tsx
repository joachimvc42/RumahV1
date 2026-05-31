'use client';

import { useState } from 'react';
import { faqs } from '@/lib/faq';

export default function FaqClient() {
  const [open, setOpen] = useState<number | null>(null);

  const toggle = (i: number) => setOpen(prev => (prev === i ? null : i));

  return (
    <main>
      {/* Hero */}
      <section className="faq-hero">
        <div className="container">
          <p className="eyebrow" style={{ marginBottom: 16 }}>Investor FAQ</p>
          <h1 className="faq-hero-title">
            Buying Property in Lombok:<br />
            <em>Your Questions Answered</em>
          </h1>
          <p className="faq-hero-lead">
            Leasehold, freehold, PT PMA, taxes — a clear, honest guide to how foreign property
            purchase actually works in Lombok, Indonesia.
          </p>
        </div>
      </section>

      {/* Accordion */}
      <section className="faq-section">
        <div className="container faq-container">
          <div className="faq-list" role="list">
            {faqs.map((item, i) => (
              <div
                key={i}
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
            <p className="faq-cta-text">
              Still have questions about your specific situation?
            </p>
            <a
              href="https://wa.me/6287873487940?text=I%20have%20a%20question%20about%20buying%20property%20in%20Lombok"
              className="btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ask us directly — no obligation
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
