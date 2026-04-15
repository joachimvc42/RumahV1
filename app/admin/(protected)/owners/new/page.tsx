'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function NewOwnerPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [verified, setVerified] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.from('owners').insert({
        name,
        contact_info: contactInfo || null,
        verified,
      });

      if (error) throw error;

      router.push('/admin/owners');
    } catch (err: any) {
      setError(err.message ?? 'Failed to create owner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={s.container}>
      <h1 style={s.title}>Add owner</h1>

      {error && <div style={s.error}>{error}</div>}

      <form onSubmit={handleSubmit} style={s.form}>
        <section style={s.section}>
          <div style={s.field}>
            <label style={s.label}>Name *</label>
            <input
              style={s.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Owner's full name"
              required
            />
          </div>

          <div style={s.field}>
            <label style={s.label}>Contact info (internal)</label>
            <textarea
              style={s.textarea}
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="Phone, WhatsApp, email, notes…"
              rows={3}
            />
          </div>

          <label style={s.checkbox}>
            <input
              type="checkbox"
              checked={verified}
              onChange={(e) => setVerified(e.target.checked)}
            />
            <span>✅ Verified owner</span>
          </label>
        </section>

        <div style={s.actions}>
          <button type="button" onClick={() => router.back()} style={s.btnSecondary}>Cancel</button>
          <button type="submit" disabled={loading} style={s.btnPrimary}>
            {loading ? 'Saving…' : '✓ Create owner'}
          </button>
        </div>
      </form>
    </main>
  );
}

const s: { [key: string]: React.CSSProperties } = {
  container: { padding: 24, maxWidth: 640, margin: '0 auto' },
  title: { fontSize: 28, fontWeight: 800, marginBottom: 24, color: '#111827' },
  error: { background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '12px 16px', borderRadius: 8, marginBottom: 20 },
  form: { display: 'flex', flexDirection: 'column', gap: 24 },
  section: { background: '#ffffff', borderRadius: 16, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: '#4b5563' },
  input: { padding: '12px 14px', borderRadius: 10, border: '2px solid #e5e7eb', fontSize: 15, outline: 'none' },
  textarea: { padding: '12px 14px', borderRadius: 10, border: '2px solid #e5e7eb', fontSize: 15, resize: 'vertical', fontFamily: 'inherit' },
  checkbox: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#f9fafb', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 500 },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: 12 },
  btnPrimary: { padding: '14px 28px', background: 'linear-gradient(135deg,#2563eb,#059669)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' },
  btnSecondary: { padding: '14px 28px', background: '#f3f4f6', color: '#374151', border: '2px solid #e5e7eb', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
};
