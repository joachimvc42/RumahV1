'use client';

import { useState, useEffect, useRef } from 'react';
import { getDict, type Locale } from '../../lib/i18n';

const WA = '6287873487940';

/* Intersection observer-based reveal on scroll */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, shown };
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.9s cubic-bezier(0.2,0.8,0.2,1) ${delay}ms, transform 0.9s cubic-bezier(0.2,0.8,0.2,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function AboutClient({ locale = 'en' }: { locale?: Locale }) {
  const t = getDict(locale);
  const WA_URL = `https://wa.me/${WA}?text=${encodeURIComponent(t.about.waMsg)}`;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, type, message }),
      });
      if (!res.ok) throw new Error();
      setStatus('sent');
      setFullName(''); setEmail(''); setType(''); setMessage('');
    } catch { setStatus('error'); }
  };

  return (
    <main>
      {/* ── Hero ── */}
      <section className="about-hero">
        <div className="container">
          <Reveal>
            <p className="eyebrow" style={{ marginBottom: 20 }}>{t.about.heroEyebrow}</p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="about-hero-headline">
              {t.about.heroHeadlineA}<br />
              {t.about.heroHeadlineB} <em>{t.about.heroHeadlineAnd}</em> {t.about.heroHeadlineC}
            </h1>
          </Reveal>
          <Reveal delay={220}>
            <p className="about-hero-lead">{t.about.heroLead}</p>
          </Reveal>
        </div>
      </section>

      {/* ── Two paths ── */}
      <section className="about-section">
        <div className="container">
          <div className="about-paths">
            <Reveal>
              <article className="about-path">
                <p className="eyebrow">{t.about.pathLiveEyebrow}</p>
                <h2 className="about-path-title">{t.about.pathLiveTitle}</h2>
                <p className="about-path-text">{t.about.pathLiveText}</p>
                <ul className="about-list">
                  {t.about.pathLiveList.map((li) => <li key={li}>{li}</li>)}
                </ul>
              </article>
            </Reveal>
            <Reveal delay={160}>
              <article className="about-path">
                <p className="eyebrow">{t.about.pathInvestEyebrow}</p>
                <h2 className="about-path-title">{t.about.pathInvestTitle}</h2>
                <p className="about-path-text">{t.about.pathInvestText}</p>
                <ul className="about-list">
                  {t.about.pathInvestList.map((li) => <li key={li}>{li}</li>)}
                </ul>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Why RumahYa ── */}
      <section className="about-section about-section-soft">
        <div className="container">
          <Reveal>
            <p className="eyebrow" style={{ marginBottom: 16 }}>{t.about.whyEyebrow}</p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="about-why-title">{t.about.whyTitle}</h2>
          </Reveal>
          <div className="about-why-grid">
            {t.about.whyItems.map(([title, body], i) => (
              <Reveal key={title} delay={i * 70}>
                <div className="about-why-item">
                  <h3 className="about-why-item-title">{title}</h3>
                  <p className="about-why-item-text">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact (below About, per spec) ── */}
      <section id="contact" className="about-section contact-section">
        <div className="container">
          <div className="contact-layout">
            <div className="contact-intro">
              <Reveal>
                <p className="eyebrow" style={{ marginBottom: 16 }}>{t.about.contactEyebrow}</p>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="contact-title">{t.about.contactTitleA}<br />{t.about.contactTitleB}</h2>
              </Reveal>
              <Reveal delay={160}>
                <p className="contact-lead">{t.about.contactLead}</p>
              </Reveal>
              <Reveal delay={240}>
                <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="wa-button">
                  <span className="wa-icon" aria-hidden>✉</span>
                  <div className="wa-text">
                    <span className="wa-label">{t.about.waLabel}</span>
                    <span className="wa-number">+62 878 7348 7940</span>
                  </div>
                </a>
              </Reveal>
            </div>

            <div className="contact-form-wrap">
              <Reveal delay={120}>
                {status === 'sent' ? (
                  <div className="contact-success">
                    <div className="contact-success-icon">✓</div>
                    <h3>{t.about.formSuccessTitle}</h3>
                    <p>{t.about.formSuccessText}</p>
                    <button onClick={() => setStatus('idle')} className="btn-secondary">{t.about.formAnother}</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="contact-form">
                    {status === 'error' && (
                      <div className="contact-error">
                        {t.about.formErrorPrefix} info@rumahya.com
                      </div>
                    )}
                    <div className="contact-row">
                      <div className="form-group">
                        <label className="form-label">{t.about.formName}</label>
                        <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                          placeholder={t.about.formNamePh} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">{t.about.formEmail}</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                          placeholder={t.about.formEmailPh} required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t.about.formTopic}</label>
                      <select value={type} onChange={e => setType(e.target.value)} required>
                        <option value="">{t.about.formTopicSelect}</option>
                        <option value="rentals">{t.about.formTopicRentals}</option>
                        <option value="investment">{t.about.formTopicInvestment}</option>
                        <option value="other">{t.about.formTopicOther}</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t.about.formMessage}</label>
                      <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5}
                        placeholder={t.about.formMessagePh} required />
                    </div>
                    <button type="submit" disabled={status === 'sending'} className="btn-primary contact-submit">
                      {status === 'sending' ? t.about.formSending : t.about.formSend}
                    </button>
                  </form>
                )}
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
