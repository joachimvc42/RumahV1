'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

type Block = {
  id: string;
  start_date: string;
  end_date: string;
  note: string | null;
};

function fmt(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export default function RentalAvailabilityCalendar({ rentalId }: { rentalId: string }) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase
      .from('rental_availability_blocks')
      .select('id, start_date, end_date, note')
      .eq('rental_id', rentalId)
      .order('start_date', { ascending: true });
    setBlocks(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [rentalId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return;
    if (endDate < startDate) { setError('End date must be after or equal to start date.'); return; }
    setSaving(true);
    setError(null);
    const { error: err } = await supabase.from('rental_availability_blocks').insert({
      rental_id: rentalId,
      start_date: startDate,
      end_date: endDate,
      note: note.trim() || null,
    });
    if (err) { setError(err.message); setSaving(false); return; }
    setStartDate(''); setEndDate(''); setNote('');
    setSaving(false);
    load();
  };

  const handleDelete = async (blockId: string) => {
    await supabase.from('rental_availability_blocks').delete().eq('id', blockId);
    setBlocks(prev => prev.filter(b => b.id !== blockId));
  };

  if (loading) return <p style={{ color: '#6b7280', fontSize: 14 }}>Loading…</p>;

  return (
    <div>
      <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
        Mark periods when this property is <strong>unavailable</strong> (occupied, reserved, under maintenance…).
        Clients searching with overlapping dates will not see this listing.
      </p>

      {/* Existing blocks */}
      {blocks.length === 0 ? (
        <p style={{ color: '#059669', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
          ✓ No blocked periods — property appears available for all dates.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {blocks.map(b => (
            <div
              key={b.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: '#fef2f2', border: '1px solid #fca5a5',
                borderRadius: 10, padding: '10px 14px',
              }}
            >
              <span style={{ fontSize: 16 }}>🚫</span>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600, fontSize: 14, color: '#b91c1c' }}>
                  {fmt(b.start_date)} → {fmt(b.end_date)}
                </span>
                {b.note && (
                  <span style={{ fontSize: 12, color: '#6b7280', marginLeft: 10 }}>
                    {b.note}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleDelete(b.id)}
                style={{
                  padding: '4px 12px', background: '#fee2e2',
                  border: '1px solid #fca5a5', borderRadius: 6,
                  color: '#b91c1c', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add new block */}
      {error && (
        <p style={{ color: '#b91c1c', fontSize: 13, marginBottom: 10 }}>{error}</p>
      )}
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={fs.field}>
          <label style={fs.label}>Unavailable from</label>
          <input
            type="date"
            value={startDate}
            onChange={e => { setStartDate(e.target.value); setError(null); }}
            required
            style={fs.input}
          />
        </div>
        <div style={fs.field}>
          <label style={fs.label}>Unavailable until</label>
          <input
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={e => { setEndDate(e.target.value); setError(null); }}
            required
            style={fs.input}
          />
        </div>
        <div style={{ ...fs.field, flex: 1, minWidth: 160 }}>
          <label style={fs.label}>Note (optional)</label>
          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="e.g. Occupied, Reserved, Renovation…"
            style={fs.input}
          />
        </div>
        <button
          type="submit"
          disabled={saving || !startDate || !endDate}
          style={{
            padding: '10px 18px', background: saving ? '#9ca3af' : '#1d4ed8',
            color: '#fff', border: 'none', borderRadius: 8,
            fontWeight: 700, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer',
            height: 42, whiteSpace: 'nowrap' as const,
          }}
        >
          {saving ? 'Saving…' : '+ Add blocked period'}
        </button>
      </form>
    </div>
  );
}

const fs: { [k: string]: React.CSSProperties } = {
  field: { display: 'flex', flexDirection: 'column', gap: 4 },
  label: { fontSize: 12, fontWeight: 600, color: '#6b7280' },
  input: { padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: 8, fontSize: 14, outline: 'none' },
};
