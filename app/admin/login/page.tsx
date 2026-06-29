'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAdminLang } from '@/lib/adminI18n';

export default function AdminLoginPage() {
  const router = useRouter();
  const { lang, setLang, t } = useAdminLang();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      setError(t.invalidCreds);
      setLoading(false);
      return;
    }

    const { data: userRow } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (!userRow || (userRow.role !== 'admin' && userRow.role !== 'superadmin')) {
      await supabase.auth.signOut();
      setError(t.notAuthorized);
      setLoading(false);
      return;
    }

    router.push('/admin/investments');
  };

  return (
    <main style={container}>
      <div style={langRow}>
        <button type="button" onClick={() => setLang('en')} style={langBtn(lang === 'en')}>EN</button>
        <button type="button" onClick={() => setLang('id')} style={langBtn(lang === 'id')}>ID</button>
      </div>
      <h1 style={{ marginBottom: 20 }}>{t.loginTitle}</h1>

      {error && <p style={{ color: 'red', marginBottom: 10 }}>{error}</p>}

      <form onSubmit={submit} style={form}>
        <input
          type="email"
          placeholder={t.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={input}
        />

        <input
          type="password"
          placeholder={t.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={input}
        />

        <button type="submit" disabled={loading} style={button}>
          {loading ? t.signingIn : t.login}
        </button>
      </form>
    </main>
  );
}

const langRow: React.CSSProperties = {
  display: 'flex', gap: 4, marginBottom: 16,
};
const langBtn = (active: boolean): React.CSSProperties => ({
  padding: '5px 12px', borderRadius: 999, border: '1px solid #e5e7eb', cursor: 'pointer',
  fontSize: 12, fontWeight: 800, background: active ? '#2563eb' : '#fff', color: active ? '#fff' : '#6b7280',
});

const container: React.CSSProperties = {
  minHeight: '80vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

const form: React.CSSProperties = {
  width: 320,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const input: React.CSSProperties = {
  padding: 12,
  borderRadius: 6,
  border: '1px solid #bbb',
};

const button: React.CSSProperties = {
  padding: 12,
  borderRadius: 6,
  border: 'none',
  background: '#2563eb',
  color: 'white',
  fontWeight: 800,
  cursor: 'pointer',
};
