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
    <main className="admin-page">
      <h1>Create owner</h1>

      <form onSubmit={handleSubmit} className="admin-form">
        {error && <p className="error">{error}</p>}

        <div className="form-group">
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Contact info (internal)</label>
          <textarea
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            placeholder="Phone, WhatsApp, email, notes…"
          />
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              checked={verified}
              onChange={(e) => setVerified(e.target.checked)}
            />
            Verified owner
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving…' : 'Create owner'}
          </button>
        </div>
      </form>
    </main>
  );
}
