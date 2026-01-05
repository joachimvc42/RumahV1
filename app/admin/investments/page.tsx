'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

type InvestmentRow = {
  id: string;
  asset_type: 'property' | 'land';
  expected_yield: number | null;
  management_available: boolean;
  legal_checked: boolean;
  created_at: string;
};

export default function AdminInvestmentsPage() {
  const [investments, setInvestments] = useState<InvestmentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestments = async () => {
      const { data } = await supabase
        .from('investments')
        .select(`
          id,
          asset_type,
          expected_yield,
          management_available,
          legal_checked,
          created_at
        `)
        .order('created_at', { ascending: false });

      setInvestments((data as InvestmentRow[]) || []);
      setLoading(false);
    };

    fetchInvestments();
  }, []);

  if (loading) {
    return <p style={{ padding: 24 }}>Loading investments…</p>;
  }

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Investments</h1>

      {investments.length === 0 ? (
        <p>No investments yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th align="left">Type</th>
              <th align="left">Yield</th>
              <th align="left">Management</th>
              <th align="left">Legal</th>
              <th align="left">Created</th>
            </tr>
          </thead>
          <tbody>
            {investments.map((inv) => (
              <tr key={inv.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td>{inv.asset_type}</td>
                <td>{inv.expected_yield ?? '—'}</td>
                <td>{inv.management_available ? 'Yes' : 'No'}</td>
                <td>{inv.legal_checked ? '✓' : 'Pending'}</td>
                <td>{new Date(inv.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
