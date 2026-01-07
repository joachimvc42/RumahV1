'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function AdminLoginPage() {
  const router = useRouter();

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
      setError('Invalid credentials');
      setLoading(false);
      return;
    }

    const { data: userRow } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (!userRow || userRow.role !== 'admin') {
      await supabase.auth.signOut();
      setError('Not authorized');
      setLoading(false);
      return;
    }

    router.push('/admin');
  };

  return (
    <main style={container}>
      <h1 style={{ marginBottom: 20 }}>Admin login</h1>

      {error && <p style={{ color: 'red', marginBottom: 10 }}>{error}</p>}

      <form onSubmit={submit} style={form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={input}
        />

        <button type="submit" disabled={loading} style={button}>
          {loading ? 'Signing in…' : 'Login'}
        </button>
      </form>
    </main>
  );
}

const container = {
  minHeight: '80vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

const form = {
  width: 320,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const input = {
  padding: 12,
  borderRadius: 6,
  border: '1px solid #bbb',
};

const button = {
  padding: 12,
  borderRadius: 6,
  border: 'none',
  background: '#2563eb',
  color: 'white',
  fontWeight: 800,
  cursor: 'pointer',
};
