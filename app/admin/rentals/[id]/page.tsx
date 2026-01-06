'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import ImageUploader from '@/components/admin/ImageUploader';

export default function EditRentalPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    supabase
      .from('long_term_rentals')
      .select(`
        *,
        properties (
          id,
          title,
          images
        )
      `)
      .eq('id', id)
      .single()
      .then(({ data }) => setForm(data));
  }, [id]);

  if (!form) return <p>Loading…</p>;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();

    await supabase
      .from('long_term_rentals')
      .update({
        monthly_price_idr: form.monthly_price_idr,
        min_duration_months: form.min_duration_months,
        max_duration_months: form.max_duration_months,
        legal_checked: form.legal_checked,
      })
      .eq('id', id);

    await supabase
      .from('properties')
      .update({ images: form.properties.images })
      .eq('id', form.properties.id);

    router.push('/admin/rentals');
  };

  return (
    <main style={{ padding: 24, maxWidth: 560 }}>
      <h1>Edit rental</h1>

      <form onSubmit={save}>
        <label>Monthly price</label>
        <input
          value={form.monthly_price_idr}
          onChange={e => setForm({ ...form, monthly_price_idr: e.target.value })}
        />

        <label>
          <input
            type="checkbox"
            checked={form.legal_checked}
            onChange={e => setForm({ ...form, legal_checked: e.target.checked })}
          />
          Legal checked
        </label>

        <h3 style={{ marginTop: 24 }}>Images</h3>

        <ImageUploader
          bucket="rentals"
          entityId={form.properties.id}
          onUpload={(url: string) =>
            setForm({
              ...form,
              properties: {
                ...form.properties,
                images: [...(form.properties.images || []), url],
              },
            })
          }
        />

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          {(form.properties.images || []).map((img: string) => (
            <img key={img} src={img} width={80} />
          ))}
        </div>

        <button className="btn btn-primary" style={{ marginTop: 24 }}>
          Save
        </button>
      </form>
    </main>
  );
}
