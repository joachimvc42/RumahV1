'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

type LandRow = {
  id: string;
  title: string;
  location: string | null;
  area: number;
  price_per_are: number;
  tenure: 'freehold' | 'leasehold';
  has_water: boolean;
  has_electricity: boolean;
  has_road: boolean;
  is_virgin: boolean;
  owners: {
    name: string;
    verified: boolean;
  } | null;
};

export default function AdminLandsPage() {
  const [lands, setLands] = useState<LandRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLands = async () => {
      const { data } = await supabase
        .from('lands')
        .select(`
          id,
          title,
          location,
          area,
          price_per_are,
          tenure,
          has_water,
          has_electricity,
          has_road,
          is_virgin,
          owners (
            name,
            verified
          )
        `)
        .order('created_at', { ascending: false });

      setLands((data as unknown as LandRow[]) || []);
      setLoading(false);
    };

    fetchLands();
  }, []);

  if (loading) {
    return <p style={{ padding: 24 }}>Loading lands…</p>;
  }

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Land listings</h1>

      {lands.length === 0 ? (
        <p>No land yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th align="left">Title</th>
              <th align="left">Location</th>
              <th align="left">Area</th>
              <th align="left">Price / are (M IDR)</th>
              <th align="left">Tenure</th>
              <th align="left">Owner</th>
            </tr>
          </thead>
          <tbody>
            {lands.map((land) => (
              <tr key={land.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td>{land.title}</td>
                <td>{land.location ?? '—'}</td>
                <td>{land.area} are</td>
                <td>{land.price_per_are}</td>
                <td>{land.tenure}</td>
                <td>
                  {land.owners
                    ? `${land.owners.name} ${land.owners.verified ? '✓' : ''}`
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
