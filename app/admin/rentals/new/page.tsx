'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function NewRentalPage() {
  const router = useRouter();

  const [propertyId, setPropertyId] = useState('');
  const [minDuration, setMinDuration] = useState(1);
  const [maxDuration, setMaxDuration] = useState(12);
  const [price, setPrice] = useState('');
  const [upfront, setUpfront] = useState(0);
  const [availableFrom, setAvailableFrom] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await supabase.from('long_term_rentals').insert({
      property_id: propertyId,
      min_duration_months: minDuration,
      max_duration_months: maxDuration,
      monthly_price_idr: Number(price),
      upfront_months: upfront,
      available_from: availableFrom || null,
    });

    router.push('/admin/rentals');
  };

  return (
    <main style={{ padding: 24, maxWidth: 520 }}>
      <h1>Create long-term rental</h1>

      <form onSubmit={handleSubmit}>
        <label>Property ID</label>
        <input value={propertyId} onChange={e => setPropertyId(e.target.value)} required />

        <label>Min duration (months)</label>
        <input type="number" value={minDuration} onChange={e => setMinDuration(+e.target.value)} />

        <label>Max duration (months)</label>
        <input type="number" value={maxDuration} onChange={e => setMaxDuration(+e.target.value)} />

        <label>Monthly price (IDR)</label>
        <input value={price} onChange={e => setPrice(e.target.value)} required />

        <label>Upfront months</label>
        <input type="number" value={upfront} onChange={e => setUpfront(+e.target.value)} />

        <label>Available from</label>
        <input type="date" value={availableFrom} onChange={e => setAvailableFrom(e.target.value)} />

        <button type="submit" className="btn btn-primary" style={{ marginTop: 16 }}>
          Create rental
        </button>
      </form>
    </main>
  );
}
