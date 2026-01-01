'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminRentals() {
  const [rentals, setRentals] = useState<any[]>([]);

  useEffect(() => {
    const fetchRentals = async () => {
      const { data } = await supabase
        .from('long_term_rentals')
        .select(`
          id,
          min_duration_months,
          max_duration_months,
          monthly_price_idr,
          legal_checked,
          properties ( title, location )
        `);

      if (data) setRentals(data);
    };

    fetchRentals();
  }, []);

  return (
    <>
      <h1>Long-term rentals</h1>

      <table style={{ marginTop: 20, width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">Property</th>
            <th>Price (IDR)</th>
            <th>Duration</th>
            <th>Legal</th>
          </tr>
        </thead>
        <tbody>
          {rentals.map((r) => (
            <tr key={r.id}>
              <td>{r.properties?.title}</td>
              <td>{r.monthly_price_idr}</td>
              <td>
                {r.min_duration_months}–{r.max_duration_months} months
              </td>
              <td>{r.legal_checked ? '✔' : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
