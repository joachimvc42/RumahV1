'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';

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
    <main className="admin-page">
      <div className="admin-header">
        <h1>Owners</h1>

        <Link href="/admin/owners/new" className="btn btn-primary">
          Add owner
        </Link>
      </div>

      {loading ? (
        <p className="muted">Loading…</p>
      ) : owners.length === 0 ? (
        <p className="muted">No owners yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Verified</th>
              <th>Created</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {owners.map((o) => (
              <tr key={o.id}>
                <td>{o.name}</td>
                <td className="muted">{o.contact_info ?? '—'}</td>
                <td>{o.verified ? 'Yes' : 'No'}</td>
                <td>{new Date(o.created_at).toLocaleDateString()}</td>
                <td>
                  <Link
                    href={`/admin/owners/${o.id}`}
                    className="btn btn-ghost"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
