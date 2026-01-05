'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

type RentalRow = {
  id: string;
  min_duration_months: number;
  max_duration_months: number;
  monthly_price_idr: number;
  upfront_months: number;
  legal_checked: boolean;
  available_from: string | null;
  properties: {
    id: string;
    title: string;
    location: string;
    bedrooms: number | null;
    bathrooms: number | null;
    pool: boolean;
    garden: boolean;
    owners: {
      name: string;
      verified: boolean;
    } | null;
  } | null;
};

export default function AdminRentalsPage() {
  const [rentals, setRentals] = useState<RentalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRentals = async () => {
      const { data, error } = await supabase
        .from('long_term_rentals')
        .select(`
          id,
          min_duration_months,
          max_duration_months,
          monthly_price_idr,
          upfront_months,
          legal_checked,
          available_from,
          properties (
            id,
            title,
            location,
            bedrooms,
            bathrooms,
            pool,
            garden,
            owners (
              name,
              verified
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
        setError('Failed to load rentals');
      } else {
        setRentals(data as unknown as RentalRow[]);
      }

      setLoading(false);
    };

    fetchRentals();
  }, []);

  if (loading) {
    return <p style={{ padding: 24 }}>Loading rentals…</p>;
  }

  if (error) {
    return <p style={{ padding: 24, color: 'red' }}>{error}</p>;
  }

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Long-term rentals</h1>

      {rentals.length === 0 ? (
        <p>No rentals yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th align="left">Property</th>
              <th align="left">Location</th>
              <th align="left">Price / month</th>
              <th align="left">Duration</th>
              <th align="left">Upfront</th>
              <th align="left">Owner</th>
              <th align="left">Legal</th>
            </tr>
          </thead>
          <tbody>
            {rentals.map((rental) => (
              <tr key={rental.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td>{rental.properties?.title ?? '—'}</td>
                <td>{rental.properties?.location ?? '—'}</td>
                <td>
                  {rental.monthly_price_idr.toLocaleString()} IDR
                </td>
                <td>
                  {rental.min_duration_months}–{rental.max_duration_months} months
                </td>
                <td>
                  {rental.upfront_months > 0
                    ? `${rental.upfront_months} months`
                    : 'No'}
                </td>
                <td>
                  {rental.properties?.owners
                    ? `${rental.properties.owners.name} ${
                        rental.properties.owners.verified ? '✓' : ''
                      }`
                    : '—'}
                </td>
                <td>
                  {rental.legal_checked ? '✓ Verified' : 'Pending'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
