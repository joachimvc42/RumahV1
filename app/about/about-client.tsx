'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getDict, prefixFor, type Locale } from '../../lib/i18n';

const WA = '6287873487940';

/* ── Reveal on scroll, hardened: reduced-motion + safety timeout so
   content never stays stuck at opacity:0 (SSR / frozen preview). ── */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = ref.current;
    if (reduce || !el) { setShown(true); return; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    const safety = setTimeout(() => setShown(true), 1500);
    return () => { io.disconnect(); clearTimeout(safety); };
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

/* ── Count-up, hardened: guarantees final value via timeout fallback,
   starts immediately if already on-screen, respects reduced-motion. ── */
function CountUp({ end, suffix = '' }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    let raf = 0;
    let safety: ReturnType<typeof setTimeout> | undefined;
    let started = false;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !el) { setVal(end); return; }
    const run = () => {
      if (started) return;
      started = true;
      const dur = 1600;
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / dur);
        setVal(Math.round(end * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      safety = setTimeout(() => setVal(end), dur + 500);
    };
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) run(); },
      { threshold: 0.4 }
    );
    io.observe(el);
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) run();
    return () => { cancelAnimationFrame(raf); io.disconnect(); if (safety) clearTimeout(safety); };
  }, [end]);
  return <span ref={ref}>{val}{suffix}</span>;
}

export default function AboutClient({ locale = 'en' }: { locale?: Locale }) {
  const t = getDict(locale);
  const WA_URL = `https://wa.me/${WA}?text=${encodeURIComponent(t.about.waMsg)}`;
  const oppHref = prefixFor(locale, '/opportunities');
  const mapHref = prefixFor(locale, '/map');

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

  const marqueeItems = [...t.land.marquee, ...t.land.marquee];

  return (
    <main className="nr">
      {/* ── Hero ── */}
      <section className="nr-hero">
        <div className="nr-hero-bg" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/noir/villa-10.jpg" alt="" />
        </div>
        <div className="container nr-hero-content">
          <Reveal>
            <p className="nr-eyebrow">{t.inv.heroEyebrow}</p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="nr-h1">
              {t.about.heroHeadlineA}<br />
              <em>{t.about.heroHeadlineC}</em>
            </h1>
          </Reveal>
          <Reveal delay={220}>
            <p className="nr-hero-lead">{t.about.heroLead}</p>
          </Reveal>
          <Reveal delay={340}>
            <div className="nr-hero-cta">
              <Link href={oppHref} className="nr-btn-gold">{t.land.heroCtaExplore}</Link>
              <a href="#contact" className="nr-btn-line">{t.land.heroCtaTalk}</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Marquee ── */}
      <div className="nr-marquee" aria-hidden="true">
        <div className="nr-marquee-track">
          {marqueeItems.map((m, i) => <span key={i}>{m}</span>)}
        </div>
      </div>

      {/* ── What we offer (asset classes) ── */}
      <section className="nr-section" id="assets">
        <div className="container">
          <Reveal>
            <div className="nr-sechead">
              <div>
                <p className="nr-eyebrow">{t.land.offerEyebrow}</p>
                <h2 className="nr-h2" style={{ marginTop: 18 }}>
                  {t.land.offerTitleLead}<em>{t.land.offerTitleEmA}</em>{t.land.offerTitleMid}<em>{t.land.offerTitleEmB}</em>
                </h2>
              </div>
              <span className="nr-secnum">{t.land.offerSecNum}</span>
            </div>
          </Reveal>
          <div className="nr-paths">
            <Reveal>
              <Link href={`${oppHref}?type=land`} className="nr-path">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/noir/land-1.jpg" alt={t.land.landTitle} />
                <span className="nr-path-ix">{t.land.landIx}</span>
                <h3 className="nr-path-title">{t.land.landTitle}</h3>
                <p>{t.land.landText}</p>
                <div className="nr-pills">
                  {t.land.landPills.map(p => <span key={p} className="nr-pill">{p}</span>)}
                </div>
                <span className="nr-go">{t.land.landCta}</span>
              </Link>
            </Reveal>
            <Reveal delay={120}>
              <Link href={`${oppHref}?type=villa`} className="nr-path">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/noir/villa-1.jpg" alt={t.land.villaTitle} />
                <span className="nr-path-ix">{t.land.villaIx}</span>
                <h3 className="nr-path-title">{t.land.villaTitle}</h3>
                <p>{t.land.villaText}</p>
                <div className="nr-pills">
                  {t.land.villaPills.map(p => <span key={p} className="nr-pill">{p}</span>)}
                </div>
                <span className="nr-go">{t.land.villaCta}</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Why RumahYa ── */}
      <section className="nr-section nr-section--soft" id="why">
        <div className="container">
          <Reveal>
            <div className="nr-sechead">
              <div>
                <p className="nr-eyebrow">{t.about.whyEyebrow}</p>
                <h2 className="nr-h2" style={{ marginTop: 18 }}>{t.about.whyTitle}</h2>
              </div>
              <span className="nr-secnum">{t.land.whySecNum}</span>
            </div>
          </Reveal>
          <div className="nr-whygrid">
            {t.about.whyItems.map(([title, body], i) => (
              <Reveal key={title} delay={(i % 3) * 60}>
                <div className="nr-whyitem">
                  <div className="nr-whynum">{String(i + 1).padStart(2, '0')}</div>
                  <h4>{title}</h4>
                  <p>{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="nr-counters">
            <Reveal>
              <div className="nr-counter">
                <div className="nr-counter-big"><CountUp end={100} suffix="%" /></div>
                <div className="nr-counter-lbl">{t.land.statTitles}</div>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="nr-counter">
                <div className="nr-counter-big"><CountUp end={2} /></div>
                <div className="nr-counter-lbl">{t.land.statAssets}</div>
              </div>
            </Reveal>
            <Reveal delay={160}>
              <div className="nr-counter">
                <div className="nr-counter-big"><CountUp end={3} /></div>
                <div className="nr-counter-lbl">{t.land.statLang}</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section className="nr-section nr-testi">
        <div className="container">
          <Reveal>
            <span className="nr-testi-q" aria-hidden="true">&ldquo;</span>
          </Reveal>
          <Reveal delay={80}>
            <blockquote>
              Buying land with RumahYa was <em>really easy</em>. The process was smooth and their advice made sense without being honeyed.
            </blockquote>
          </Reveal>
          <Reveal delay={180}>
            <p className="nr-testi-src">European buyer · South Lombok · 2025</p>
          </Reveal>
        </div>
      </section>

      {/* ── Map band ── */}
      <section className="nr-section" id="map">
        <div className="container">
          <Reveal>
            <div className="nr-mapband">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/noir/land-1.jpg" alt="" aria-hidden="true" />
              <div>
                <p className="nr-eyebrow">{t.land.mapEyebrow}</p>
                <h3>{t.land.mapTitle}</h3>
                <p>{t.land.mapText}</p>
                <Link href={mapHref} className="nr-btn-gold">{t.land.mapCta}</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Contact (form + Supabase submit unchanged) ── */}
      <section id="contact" className="about-section contact-section">
        <div className="container">
          <div className="contact-layout">
            <div className="contact-intro">
              <Reveal>
                <p className="nr-eyebrow" style={{ marginBottom: 16 }}>{t.about.contactEyebrow}</p>
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
