'use client';

import { useState, useEffect, useRef } from 'react';

const WA = '6287873487940';
const WA_URL = `https://wa.me/${WA}?text=${encodeURIComponent('Hello RumahYa, I would like more information.')}`;

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

export default function AboutClient() {
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
            <p className="eyebrow" style={{ marginBottom: 20 }}>About RumahYa</p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="about-hero-headline">
              A local point of contact for<br />
              long-term living <em>&amp;</em> investment in Lombok
            </h1>
          </Reveal>
          <Reveal delay={220}>
            <p className="about-hero-lead">
              We support expatriates and investors with local context, verified information, and
              long-term coordination for every property project — from a six-month rental to a
              freehold land acquisition.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Two paths ── */}
      <section className="about-section">
        <div className="container">
          <div className="about-paths">
            <Reveal>
              <article className="about-path">
                <p className="eyebrow">01 — Live</p>
                <h2 className="about-path-title">Live in Lombok</h2>
                <p className="about-path-text">
                  Long-term rentals for people who want to settle without committing blindly or
                  sending large upfront payments without local support.
                </p>
                <ul className="about-list">
                  <li>Rental terms from 1 month to 10 years</li>
                  <li>Identified, verified owners</li>
                  <li>Local intermediary coordination</li>
                </ul>
              </article>
            </Reveal>
            <Reveal delay={160}>
              <article className="about-path">
                <p className="eyebrow">02 — Invest</p>
                <h2 className="about-path-title">Invest in Lombok</h2>
                <p className="about-path-text">
                  Land and villa opportunities for long-term investors looking for clarity and
                  structure, not pressure.
                </p>
                <ul className="about-list">
                  <li>Land &amp; villa investment opportunities</li>
                  <li>Legal verification available</li>
                  <li>Optional property management</li>
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
            <p className="eyebrow" style={{ marginBottom: 16 }}>Why RumahYa</p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="about-why-title">A human-scale approach, grounded in Lombok.</h2>
          </Reveal>
          <div className="about-why-grid">
            {[
              ['Based in Lombok', 'We live here. Decisions on-site, in person, with owners you can meet.'],
              ['Verified documents', 'Every listing is backed by identified titles and ownership checks.'],
              ['Clear communication', 'Direct, honest, multilingual (EN · FR · ID). No pressure, no upsell.'],
              ['On-the-ground presence', 'Physical visits, photos, and coordination with local contractors.'],
              ['Long-term relationships', 'We prefer slow, solid projects. Repeat clients over fast turnover.'],
              ['Optional management', 'Rental operations, staff coordination, bill handling — if you want it.'],
            ].map(([title, body], i) => (
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
                <p className="eyebrow" style={{ marginBottom: 16 }}>Contact</p>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="contact-title">Let&apos;s talk about<br />your project.</h2>
              </Reveal>
              <Reveal delay={160}>
                <p className="contact-lead">
                  No commitment, no pressure. We begin by understanding your situation and objectives.
                </p>
              </Reveal>
              <Reveal delay={240}>
                <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="wa-button">
                  <span className="wa-icon" aria-hidden>✉</span>
                  <div className="wa-text">
                    <span className="wa-label">WhatsApp</span>
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
                    <h3>Message sent.</h3>
                    <p>We&apos;ll get back to you shortly.</p>
                    <button onClick={() => setStatus('idle')} className="btn-secondary">Send another message</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="contact-form">
                    {status === 'error' && (
                      <div className="contact-error">
                        Something went wrong. Try WhatsApp or email info@rumahya.com
                      </div>
                    )}
                    <div className="contact-row">
                      <div className="form-group">
                        <label className="form-label">Full name</label>
                        <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                          placeholder="Your name" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                          placeholder="your@email.com" required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Topic</label>
                      <select value={type} onChange={e => setType(e.target.value)} required>
                        <option value="">Select a topic</option>
                        <option value="rentals">Living in Lombok (rentals)</option>
                        <option value="investment">Investing in Lombok</option>
                        <option value="other">Other / not sure yet</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Message</label>
                      <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5}
                        placeholder="Briefly describe your situation, timeline, and expectations." required />
                    </div>
                    <button type="submit" disabled={status === 'sending'} className="btn-primary contact-submit">
                      {status === 'sending' ? 'Sending…' : 'Send message'}
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
