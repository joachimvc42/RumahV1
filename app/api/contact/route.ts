'use client';

import { useState } from 'react';

const WA_NUMBER = '6287873487940';

export default function ContactPage() {
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
      if (!res.ok) throw new Error('Failed');
      setStatus('sent');
      setFullName(''); setEmail(''); setType(''); setMessage('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <main style={s.page}>
      <section style={s.hero}>
        <div style={s.heroInner}>
          <p style={s.kicker}>Get in touch</p>
          <h1 style={s.heroTitle}>Start with a conversation</h1>
          <p style={s.heroLead}>
            Whether you plan to live in Lombok or invest long-term, we begin by understanding your situation — no commitment, no pressure.
          </p>
        </div>
      </section>

      <section style={s.section}>
        <div style={s.grid}>
          <div style={s.leftCol}>
            <h2 style={s.h2}>How can we help?</h2>
            <p style={s.body}>
              This first contact is informal. The goal is simply to understand what you are looking for and see whether RumahYa can be relevant for you.
            </p>
            <div style={s.topics}>
              {[
                ['🏠', 'Long-term rental in Lombok'],
                ['🌍', 'Relocation planning'],
                ['💰', 'Land or villa investment'],
                ['🏢', 'Property management'],
              ].map(([icon, label]) => (
                <div key={label} style={s.topicItem}>
                  <span style={s.topicIcon}>{icon}</span>
                  <span style={s.topicLabel}>{label}</span>
                </div>
              ))}
            </div>
            <div style={s.waBox}>
              <p style={s.waTitle}>Prefer instant messaging?</p>
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hello RumahYa, I would like to get more information.')}`}
                target="_blank" rel="noopener noreferrer" style={s.waBtn}
              >
                💬 WhatsApp us directly
              </a>
              <p style={s.waNumber}>+62 878 7348 7940</p>
            </div>
          </div>

          <div style={s.formCard}>
            {status === 'sent' ? (
              <div style={s.successBox}>
                <div style={s.successIcon}>✓</div>
                <h3 style={s.successTitle}>Message sent!</h3>
                <p style={s.successBody}>We have received your message and will get back to you shortly.</p>
                <button onClick={() => setStatus('idle')} style={s.resetBtn}>Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={s.form}>
                <h3 style={s.formTitle}>Send us a message</h3>
                {status === 'error' && (
                  <div style={s.errorBox}>Something went wrong. Try WhatsApp or email info@rumahya.com</div>
                )}
                <div style={s.field}>
                  <label style={s.label}>Full name *</label>
                  <input style={s.input} type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your name" required />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Email address *</label>
                  <input style={s.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Topic *</label>
                  <select style={s.select} value={type} onChange={e => setType(e.target.value)} required>
                    <option value="">Select a topic</option>
                    <option value="rentals">Living in Lombok (rentals)</option>
                    <option value="investment">Investing in Lombok</option>
                    <option value="other">Other / not sure yet</option>
                  </select>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Message *</label>
                  <textarea style={s.textarea} rows={5}
                    placeholder="Briefly describe your situation, timeline, and expectations."
                    value={message} onChange={e => setMessage(e.target.value)} required />
                </div>
                <button type="submit" disabled={status === 'sending'} style={s.submitBtn}>
                  {status === 'sending' ? 'Sending…' : 'Send message →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section style={s.reassurance}>
        <p style={s.reassuranceText}>
          RumahYa is based in Lombok and works with local partners. We do not act as agents pushing transactions. Our role is to provide clarity, context and local coordination.
        </p>
      </section>
    </main>
  );
}

const s: { [k: string]: React.CSSProperties } = {
  page: { maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' },
  hero: { padding: '72px 0 56px', textAlign: 'center' },
  heroInner: { maxWidth: 640, margin: '0 auto' },
  kicker: { fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2563eb', marginBottom: 14 },
  heroTitle: { fontSize: 46, fontWeight: 800, color: '#111827', lineHeight: 1.15, marginBottom: 18 },
  heroLead: { fontSize: 18, color: '#6b7280', lineHeight: 1.7, margin: 0 },
  section: { marginBottom: 56 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 56, alignItems: 'start' },
  leftCol: {},
  h2: { fontSize: 26, fontWeight: 800, color: '#111827', marginBottom: 14 },
  body: { fontSize: 16, color: '#6b7280', lineHeight: 1.75, marginBottom: 28 },
  topics: { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 },
  topicItem: { display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: '#f9fafb', borderRadius: 12, border: '1px solid #e5e7eb' },
  topicIcon: { fontSize: 20 },
  topicLabel: { fontSize: 15, fontWeight: 600, color: '#374151' },
  waBox: { background: '#f0fdf4', border: '2px solid #bbf7d0', borderRadius: 16, padding: '24px 28px' },
  waTitle: { fontSize: 15, fontWeight: 700, color: '#065f46', margin: '0 0 14px' },
  waBtn: { display: 'inline-flex', alignItems: 'center', gap: 10, padding: '13px 22px', background: '#25d366', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 15 },
  waNumber: { margin: '12px 0 0', fontSize: 13, color: '#6b7280' },
  formCard: { background: '#fff', borderRadius: 20, padding: '40px', boxShadow: '0 8px 32px rgba(15,23,42,0.08)', border: '1px solid #e5e7eb' },
  form: { display: 'flex', flexDirection: 'column', gap: 20 },
  formTitle: { fontSize: 22, fontWeight: 800, color: '#111827', margin: '0 0 8px' },
  errorBox: { padding: '14px 16px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, color: '#b91c1c', fontSize: 14 },
  field: { display: 'flex', flexDirection: 'column', gap: 7 },
  label: { fontSize: 14, fontWeight: 700, color: '#374151' },
  input: { padding: '13px 16px', borderRadius: 10, border: '2px solid #e5e7eb', fontSize: 15, outline: 'none', fontFamily: 'inherit' },
  select: { padding: '13px 16px', borderRadius: 10, border: '2px solid #e5e7eb', fontSize: 15, outline: 'none', background: '#fff', fontFamily: 'inherit' },
  textarea: { padding: '13px 16px', borderRadius: 10, border: '2px solid #e5e7eb', fontSize: 15, resize: 'vertical' as const, outline: 'none', fontFamily: 'inherit', lineHeight: 1.6 },
  submitBtn: { padding: '15px 24px', background: 'linear-gradient(135deg, #2563eb, #22c55e)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(37,99,235,0.3)', marginTop: 4 },
  successBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '48px 24px', textAlign: 'center' },
  successIcon: { width: 64, height: 64, background: 'linear-gradient(135deg,#2563eb,#22c55e)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800 },
  successTitle: { fontSize: 24, fontWeight: 800, color: '#111827', margin: 0 },
  successBody: { fontSize: 16, color: '#6b7280', margin: 0 },
  resetBtn: { padding: '12px 24px', background: '#f3f4f6', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#374151' },
  reassurance: { padding: '32px', background: '#f9fafb', borderRadius: 16, border: '1px solid #e5e7eb', textAlign: 'center' },
  reassuranceText: { fontSize: 15, color: '#6b7280', lineHeight: 1.7, margin: '0 auto', maxWidth: 660 },
};