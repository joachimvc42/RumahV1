'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type Owner = {
  id: string;
  name: string;
  contact_info: string | null;
  verified: boolean;
  created_at: string;
};

export default function AdminOwnersPage() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('owners')
        .select('id,name,contact_info,verified,created_at')
        .order('created_at', { ascending: false });

      setOwners(data ?? []);
      setLoading(false);
    };

    load();
  }, []);

  return (
    <main style={s.container}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Owners</h1>
          <p style={s.subtitle}>{owners.length} owner{owners.length !== 1 ? 's' : ''} registered</p>
        </div>
        <Link href="/admin/owners/new" style={s.btnAdd}>+ Add owner</Link>
      </div>

      {loading ? (
        <div style={s.loading}>Loading owners…</div>
      ) : owners.length === 0 ? (
        <div style={s.empty}>
          <span style={{ fontSize: 48 }}>👤</span>
          <p>No owners yet.</p>
          <Link href="/admin/owners/new" style={s.btnAdd}>Add first owner</Link>
        </div>
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Name</th>
                <th style={s.th}>Contact</th>
                <th style={s.th}>Verified</th>
                <th style={s.th}>Created</th>
                <th style={s.th} />
              </tr>
            </thead>
            <tbody>
              {owners.map((o) => (
                <tr key={o.id} style={s.tr}>
                  <td style={s.td}><span style={s.name}>{o.name}</span></td>
                  <td style={{ ...s.td, color: '#6b7280' }}>{o.contact_info ?? '—'}</td>
                  <td style={s.td}>
                    <span style={{ ...s.badge, background: o.verified ? '#ecfdf5', color: '#065f46' }}>
                      {o.verified ? '✓ Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td style={{ ...s.td, color: '#6b7280' }}>{new Date(o.created_at).toLocaleDateString()}</td>
                  <td style={s.td}>
                    <Link href={`/admin/owners/${o.id}`} style={s.btnEdit}>Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

const s: { [key: string]: React.CSSProperties } = {
  container: { padding: 24, maxWidth: 900, margin: '0 auto' },
  loading: { padding: 40, textAlign: 'center', color: '#6b7280' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 28, fontWeight: 800, color: '#111827', margin: 0 },
  subtitle: { color: '#6b7280', marginTop: 4, fontSize: 14 },
  btnAdd: { padding: '14px 24px', background: 'linear-gradient(135deg, #2563eb, #059669)', color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 15, boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 60, background: '#f9fafb', borderRadius: 16, color: '#6b7280' },
  tableWrap: { background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '14px 18px', fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' },
  tr: { borderBottom: '1px solid #f3f4f6' },
  td: { padding: '14px 18px', fontSize: 14, color: '#111827', verticalAlign: 'middle' },
  name: { fontWeight: 600 },
  badge: { padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  btnEdit: { padding: '7px 14px', background: '#f3f4f6', color: '#374151', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 13, border: '1px solid #e5e7eb' },
};
