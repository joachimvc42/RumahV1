'use client';

import Link from 'next/link';
import { useState } from 'react';

const WA = '6287873487940';
const WA_URL = `https://wa.me/${WA}?text=${encodeURIComponent('Hello RumahYa, I would like more information.')}`;

export default function AboutPage() {
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
    <main className="page">

      {/* ── Hero ── */}
      <section className="section hero">
        <div className="container">
          <h1 className="h1 hero-headline">
            A local point of contact for long-term living and investment in Lombok
          </h1>
        </div>
      </section>

      {/* ── Lead ── */}
      <section className="section">
        <div className="container">
          <p className="lead">
            RumahYa supports expatriates and investors by providing local context,
            verified information, and long-term coordination for property projects in Lombok.
          </p>
        </div>
      </section>

      {/* ── Paths ── */}
      <section className="section">
        <div className="container grid grid-2">
          <div className="card path-card">
            <div className="card-body">
              <h2 className="h2">Live in Lombok</h2>
              <p className="text">Long-term rentals for people who want to live in Lombok without committing blindly or sending large upfront payments without local support.</p>
              <ul className="bullets">
                <li>Rental terms from 1 month to 10 years</li>
                <li>Identified owners</li>
                <li>Local intermediary coordination</li>
              </ul>
            </div>
          </div>
          <div className="card path-card">
            <div className="card-body">
              <h2 className="h2">Invest in Lombok</h2>
              <p className="text">Land and villa opportunities for long-term investors looking for clarity, structure and local execution.</p>
              <ul className="bullets">
                <li>Land and villa investment opportunities</li>
                <li>Legal verification available</li>
                <li>Optional property management</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why RumahYa ── */}
      <section className="section section-soft">
        <div className="container">
          <h2 className="h2">Why RumahYa</h2>
          <div className="grid grid-2">
            <ul className="bullets">
              <li>Based in Lombok</li>
              <li>On-the-ground presence</li>
              <li>Clear and direct communication</li>
            </ul>
            <ul className="bullets">
              <li>Verified documents</li>
              <li>Long-term relationship focus</li>
              <li>Human-scale approach</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="section">
        <div className="container">

          {/* Title row + WhatsApp */}
          <div style={c.titleRow}>
            <div style={c.titleBlock}>
              <h2 className="h2" style={{ marginBottom: 8 }}>Let's talk about your project</h2>
              <p className="text" style={{ margin: 0 }}>No commitment, no pressure. We begin by understanding your situation and objectives.</p>
            </div>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" style={c.waBtn}>
              <span style={{ fontSize: 20, lineHeight: 1 }}>💬</span>
              <div style={c.waBtnText}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>WhatsApp</span>
                <span style={c.waNumber}>+62 878 7348 7940</span>
              </div>
            </a>
          </div>

          {/* Form */}
          <div style={c.formWrap}>
            {status === 'sent' ? (
              <div style={c.successBox}>
                <div style={c.successIcon}>✓</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 }}>Message sent</h3>
                <p style={{ fontSize: 15, color: '#6b7280', margin: 0 }}>We'll get back to you shortly.</p>
                <button onClick={() => setStatus('idle')} style={c.resetBtn}>Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={c.form}>
                {status === 'error' && (
                  <div style={c.errorBox}>Something went wrong. Try WhatsApp or email info@rumahya.com</div>
                )}
                <div style={c.fieldRow}>
                  <div style={c.field}>
                    <label style={c.label}>Full name *</label>
                    <input style={c.input} type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                      placeholder="Your name" required />
                  </div>
                  <div style={c.field}>
                    <label style={c.label}>Email address *</label>
                    <input style={c.input} type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com" required />
                  </div>
                </div>
                <div style={c.field}>
                  <label style={c.label}>Topic *</label>
                  <select style={c.input} value={type} onChange={e => setType(e.target.value)} required>
                    <option value="">Select a topic</option>
                    <option value="rentals">Living in Lombok (rentals)</option>
                    <option value="investment">Investing in Lombok</option>
                    <option value="other">Other / not sure yet</option>
                  </select>
                </div>
                <div style={c.field}>
                  <label style={c.label}>Message *</label>
                  <textarea style={c.textarea} value={message} onChange={e => setMessage(e.target.value)}
                    rows={4} placeholder="Briefly describe your situation, timeline, and expectations." required />
                </div>
                <button type="submit" disabled={status === 'sending'} style={c.submitBtn}>
                  {status === 'sending' ? 'Sending…' : 'Send message →'}
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

    </main>
  );
}

const c: { [k: string]: React.CSSProperties } = {
  titleRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 32,
    marginBottom: 32,
    flexWrap: 'wrap',
  },
  titleBlock: {
    flex: 1,
    minWidth: 260,
  },
  waBtn: {
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: '10px 20px',
    background: '#25a244',
    color: '#fff',
    borderRadius: 10,
    textDecoration: 'none',
    flexShrink: 0,
    whiteSpace: 'nowrap' as const,
  },
  waBtnText: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 1,
    lineHeight: 1.3,
  },
  waNumber: {
    fontSize: 12,
    fontWeight: 400,
    opacity: 0.85,
  },
  formWrap: {
    background: '#fff',
    borderRadius: 16,
    padding: 36,
    border: '1px solid #e5e7eb',
    boxShadow: '0 4px 24px rgba(15,23,42,0.06)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  fieldRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
  },
  input: {
    padding: '11px 14px',
    borderRadius: 8,
    border: '1.5px solid #e5e7eb',
    fontSize: 15,
    outline: 'none',
    background: '#fff',
    fontFamily: 'inherit',
    color: '#111827',
  },
  textarea: {
    padding: '11px 14px',
    borderRadius: 8,
    border: '1.5px solid #e5e7eb',
    fontSize: 15,
    resize: 'vertical',
    outline: 'none',
    fontFamily: 'inherit',
    lineHeight: 1.6,
    color: '#111827',
  },
  submitBtn: {
    alignSelf: 'flex-start',
    padding: '13px 28px',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
  },
  errorBox: {
    padding: '12px 16px',
    background: '#fef2f2',
    border: '1px solid #fca5a5',
    borderRadius: 8,
    color: '#b91c1c',
    fontSize: 14,
  },
  successBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    padding: '48px 20px',
    textAlign: 'center',
  },
  successIcon: {
    width: 52,
    height: 52,
    background: '#2563eb',
    color: '#fff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    fontWeight: 700,
  },
  resetBtn: {
    marginTop: 4,
    padding: '10px 20px',
    background: '#f3f4f6',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    color: '#374151',
  },
};
