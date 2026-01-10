'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import Link from 'next/link';

type PropertyRow = {
  id: string;
  title: string;
  location: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  price: number | null;
  tenure: string | null;
  status: string | null;
};

function fmtProp(p: PropertyRow) {
  const bits = [
    p.title,
    p.location ? `— ${p.location}` : '',
    p.bedrooms != null || p.bathrooms != null ? `— ${p.bedrooms ?? '—'}bd/${p.bathrooms ?? '—'}ba` : '',
  ].filter(Boolean);
  return bits.join(' ');
}

export default function NewRentalPage() {
  const router = useRouter();

  const [properties, setProperties] = useState<PropertyRow[]>([]);
  const [loadingProps, setLoadingProps] = useState(true);

  const [propertyId, setPropertyId] = useState('');
  const [minDuration, setMinDuration] = useState(1);
  const [maxDuration, setMaxDuration] = useState(12);
  const [price, setPrice] = useState('');
  const [upfront, setUpfront] = useState(0);
  const [availableFrom, setAvailableFrom] = useState('');
  const [legalChecked, setLegalChecked] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProps = async () => {
      setLoadingProps(true);
      const { data, error } = await supabase
        .from('properties')
        .select('id,title,location,bedrooms,bathrooms,price,tenure,status')
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
        setProperties([]);
      } else {
        setProperties((data as PropertyRow[]) || []);
      }

      setLoadingProps(false);
    };

    loadProps();
  }, []);

  const selectedProperty = useMemo(
    () => properties.find((p) => p.id === propertyId) || null,
    [properties, propertyId]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!propertyId) {
      setError('Select a property');
      return;
    }

    if (!price || Number.isNaN(Number(price))) {
      setError('Monthly price is required');
      return;
    }

    if (minDuration <= 0 || maxDuration <= 0 || maxDuration < minDuration) {
      setError('Duration is invalid');
      return;
    }

    setSaving(true);

    const { error } = await supabase.from('long_term_rentals').insert({
      property_id: propertyId,
      min_duration_months: minDuration,
      max_duration_months: maxDuration,
      monthly_price_idr: Number(price),
      upfront_months: upfront,
      available_from: availableFrom || null,
      legal_checked: legalChecked,
    });

    if (error) {
      console.error(error);
      setError(error.message || 'Failed to create rental');
      setSaving(false);
      return;
    }

    router.push('/admin/rentals');
  };

  return (
    <main style={{ padding: 24, maxWidth: 640 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <h1>Create long-term rental</h1>
        <Link href="/admin" className="btn btn-secondary" style={btnSecondary}>
          Back
        </Link>
      </div>

      {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
        <div style={group}>
          <label style={label}>Property</label>

          {loadingProps ? (
            <p style={{ margin: 0, color: '#6b7280' }}>Loading properties…</p>
          ) : (
            <>
              <select
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                required
                style={input}
              >
                <option value="">Select…</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {fmtProp(p)}
                  </option>
                ))}
              </select>

              {selectedProperty ? (
                <div style={hintBox}>
                  <div style={{ fontWeight: 700 }}>{selectedProperty.title}</div>
                  <div style={{ color: '#6b7280', fontSize: 13 }}>
                    {selectedProperty.location ?? '—'} • {selectedProperty.bedrooms ?? '—'} bd /{' '}
                    {selectedProperty.bathrooms ?? '—'} ba
                  </div>
                  <div style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>
                    Property ID: {selectedProperty.id}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>

        <div style={row2}>
          <div style={group}>
            <label style={label}>Min duration (months)</label>
            <input
              type="number"
              value={minDuration}
              onChange={(e) => setMinDuration(Number(e.target.value))}
              min={1}
              style={input}
            />
          </div>

          <div style={group}>
            <label style={label}>Max duration (months)</label>
            <input
              type="number"
              value={maxDuration}
              onChange={(e) => setMaxDuration(Number(e.target.value))}
              min={1}
              style={input}
            />
          </div>
        </div>

        <div style={row2}>
          <div style={group}>
            <label style={label}>Monthly price (IDR)</label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              inputMode="numeric"
              style={input}
              required
            />
          </div>

          <div style={group}>
            <label style={label}>Upfront months</label>
            <input
              type="number"
              value={upfront}
              onChange={(e) => setUpfront(Number(e.target.value))}
              min={0}
              style={input}
            />
          </div>
        </div>

        <div style={group}>
          <label style={label}>Available from</label>
          <input
            type="date"
            value={availableFrom}
            onChange={(e) => setAvailableFrom(e.target.value)}
            style={input}
          />
        </div>

        <div style={{ ...group, display: 'flex', alignItems: 'center', gap: 10 }}>
          <input
            type="checkbox"
            checked={legalChecked}
            onChange={(e) => setLegalChecked(e.target.checked)}
          />
          <span style={{ fontWeight: 600 }}>Legal checked</span>
        </div>

        <button type="submit" className="btn btn-primary" style={btnPrimary} disabled={saving}>
          {saving ? 'Creating…' : 'Create rental'}
        </button>
      </form>
    </main>
  );
}

const group: React.CSSProperties = { marginBottom: 14 };
const row2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 };
const label: React.CSSProperties = { display: 'block', fontWeight: 700, marginBottom: 6 };
const input: React.CSSProperties = {
  width: '100%',
  padding: 12,
  borderRadius: 6,
  border: '1px solid #bbb',
};

const hintBox: React.CSSProperties = {
  marginTop: 10,
  padding: 12,
  borderRadius: 8,
  border: '1px solid #e5e7eb',
  background: '#fff',
};

const btnPrimary: React.CSSProperties = {
  marginTop: 10,
  padding: '12px 18px',
  background: '#2563eb',
  border: 'none',
  borderRadius: 6,
  color: 'white',
  cursor: 'pointer',
  fontWeight: 800,
};

const btnSecondary: React.CSSProperties = {
  padding: '10px 14px',
  background: '#6b7280',
  border: 'none',
  borderRadius: 6,
  color: 'white',
  textDecoration: 'none',
  fontWeight: 800,
};
