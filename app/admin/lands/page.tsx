'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminLands() {
  const [lands, setLands] = useState<any[]>([]);

  useEffect(() => {
    const fetchLands = async () => {
      const { data } = await supabase.from('lands').select('*');
      if (data) setLands(data);
    };

    fetchLands();
  }, []);

  return (
    <>
      <h1>Land listings</h1>

      <ul style={{ marginTop: 20 }}>
        {lands.map((l) => (
          <li key={l.id}>
            {l.title} – {l.area_are} are – {l.price_per_are_idr} IDR/are
          </li>
        ))}
      </ul>
    </>
  );
}
