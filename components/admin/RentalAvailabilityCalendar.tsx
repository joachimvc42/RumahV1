'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';

type Block = {
  id: string;
  start_date: string;
  end_date: string;
  note: string | null;
};

function isoDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function fmt(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

const MONTHS = ['January','February','March','April','May','June',
  'July','August','September','October','November','December'];
const DAY_LABELS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default function RentalAvailabilityCalendar({ rentalId }: { rentalId: string }) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Top-bar form
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [note, setNote] = useState('');

  // Calendar
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [pendingStart, setPendingStart] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('rental_availability_blocks')
      .select('id, start_date, end_date, note')
      .eq('rental_id', rentalId)
      .order('start_date', { ascending: true });
    setBlocks(data || []);
    setLoading(false);
  }, [rentalId]);

  useEffect(() => { load(); }, [load]);

  const blockForDate = useCallback((dateStr: string): Block | null =>
    blocks.find(b => b.start_date <= dateStr && b.end_date >= dateStr) ?? null,
  [blocks]);

  const isInRange = (dateStr: string, a: string | null, b: string | null) => {
    if (!a || !b) return false;
    const [lo, hi] = a <= b ? [a, b] : [b, a];
    return dateStr >= lo && dateStr <= hi;
  };

  const doInsert = async (s: string, e: string, n?: string) => {
    setSaving(true);
    setError(null);
    const { error: err } = await supabase.from('rental_availability_blocks').insert({
      rental_id: rentalId,
      start_date: s,
      end_date: e,
      note: (n ?? '').trim() || null,
    });
    setSaving(false);
    if (err) { setError(err.message); return false; }
    load();
    return true;
  };

  const handleDelete = async (blockId: string) => {
    await supabase.from('rental_availability_blocks').delete().eq('id', blockId);
    setBlocks(prev => prev.filter(b => b.id !== blockId));
  };

  // Top bar submit
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return;
    if (endDate < startDate) { setError('End date must be after start date.'); return; }
    const ok = await doInsert(startDate, endDate, note);
    if (ok) { setStartDate(''); setEndDate(''); setNote(''); }
  };

  // Calendar click
  const handleDayClick = async (dateStr: string) => {
    if (saving) return;
    if (dateStr < todayStr) return; // past dates immutable
    const existing = blockForDate(dateStr);
    if (existing) {
      await handleDelete(existing.id);
      return;
    }
    if (!pendingStart) {
      setPendingStart(dateStr);
    } else {
      const [lo, hi] = pendingStart <= dateStr ? [pendingStart, dateStr] : [dateStr, pendingStart];
      setPendingStart(null);
      setHovered(null);
      await doInsert(lo, hi);
    }
  };

  // Calendar grid helpers
  const firstDay = new Date(viewYear, viewMonth, 1);
  let startPad = firstDay.getDay() - 1; // Monday-first
  if (startPad < 0) startPad = 6;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const todayStr = isoDate(today.getFullYear(), today.getMonth(), today.getDate());

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  if (loading) return <p style={{ color: '#6b7280', fontSize: 14 }}>Loading…</p>;

  return (
    <div>
      <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
        Mark periods when this property is <strong>unavailable</strong> (occupied, reserved, under maintenance…).
        Clients searching with overlapping dates will not see this listing.
      </p>

      {/* ── Top bar ── */}
      {error && <p style={{ color: '#b91c1c', fontSize: 13, marginBottom: 8 }}>{error}</p>}
      <form
        onSubmit={handleAdd}
        style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 28 }}
      >
        <div style={fs.field}>
          <label style={fs.label}>Unavailable from</label>
          <input
            type="date"
            value={startDate}
            min={todayStr}
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
            min={startDate || todayStr}
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
          style={{ ...fs.btn, opacity: saving || !startDate || !endDate ? 0.5 : 1 }}
        >
          {saving ? 'Saving…' : '+ Block dates'}
        </button>
      </form>

      {/* ── Calendar ── */}
      <div style={{
        background: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: 14,
        padding: 20,
        maxWidth: 480,
      }}>
        {/* Month nav */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <button type="button" onClick={prevMonth} style={fs.navBtn}>‹</button>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <button type="button" onClick={nextMonth} style={fs.navBtn}>›</button>
        </div>

        {/* Day-of-week headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
          {DAY_LABELS.map(d => (
            <div key={d} style={{
              textAlign: 'center', fontSize: 11, fontWeight: 700,
              color: '#9ca3af', padding: '2px 0', letterSpacing: '0.04em',
            }}>
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {Array.from({ length: startPad }).map((_, i) => <div key={`p${i}`} />)}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = isoDate(viewYear, viewMonth, day);
            const block = blockForDate(dateStr);
            const blocked = !!block;
            const isPast = dateStr < todayStr;
            const isStart = pendingStart === dateStr;
            const inPending = !blocked && !isPast && pendingStart && hovered
              ? isInRange(dateStr, pendingStart, hovered)
              : false;
            const isToday = dateStr === todayStr;

            let bg = '#fff';
            let color = '#374151';
            let textDeco = 'none';
            let border = '1px solid #e5e7eb';
            let fontWeight: number | string = 400;

            if (isPast) {
              bg = '#f3f4f6'; color = '#d1d5db';
              border = '1px solid #f3f4f6';
            } else if (blocked) {
              bg = '#fee2e2'; color = '#b91c1c';
              textDeco = 'line-through'; border = '1px solid #fca5a5'; fontWeight = 600;
            } else if (isStart) {
              bg = '#1d4ed8'; color = '#fff'; border = '1px solid #1d4ed8'; fontWeight = 700;
            } else if (inPending) {
              bg = '#dbeafe'; color = '#1d4ed8'; border = '1px solid #93c5fd';
            } else if (isToday) {
              border = '2px solid #6b7280'; fontWeight = 700;
            }

            return (
              <div
                key={day}
                onClick={() => handleDayClick(dateStr)}
                onMouseEnter={() => setHovered(dateStr)}
                onMouseLeave={() => setHovered(null)}
                title={
                  blocked
                    ? `Blocked${block.note ? ': ' + block.note : ''} — click to unblock`
                    : pendingStart
                      ? 'Click to set end of blocked range'
                      : 'Click to start blocking range'
                }
                style={{
                  position: 'relative',
                  textAlign: 'center',
                  padding: '7px 2px',
                  borderRadius: 8,
                  background: bg,
                  color,
                  textDecoration: textDeco,
                  border,
                  cursor: saving || isPast ? 'default' : 'pointer',
                  fontSize: 13,
                  fontWeight,
                  userSelect: 'none' as const,
                  transition: 'background 0.1s, color 0.1s',
                  lineHeight: 1.2,
                }}
              >
                {day}
                {blocked && (
                  <span style={{
                    position: 'absolute', top: 1, right: 2,
                    fontSize: 7, color: '#ef4444', lineHeight: 1,
                  }}>✕</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend + pending hint */}
        <div style={{ marginTop: 14, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', fontSize: 12, color: '#6b7280' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={fs.legendBox('#fee2e2', '#fca5a5')} />
            Blocked (click to unblock)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={fs.legendBox('#fff', '#e5e7eb')} />
            Available
          </span>
          {pendingStart && (
            <span style={{ color: '#1d4ed8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              Start: {fmt(pendingStart)} — click end date
              <button
                type="button"
                onClick={() => { setPendingStart(null); setHovered(null); }}
                style={{ fontSize: 11, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
              >
                cancel
              </button>
            </span>
          )}
        </div>
      </div>

      {/* ── Blocked periods list ── */}
      {blocks.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            All blocked periods
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {blocks.map(b => (
              <div key={b.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: '#fef2f2', border: '1px solid #fca5a5',
                borderRadius: 8, padding: '8px 12px',
              }}>
                <span style={{ fontSize: 13 }}>🚫</span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 600, fontSize: 13, color: '#b91c1c' }}>
                    {fmt(b.start_date)} → {fmt(b.end_date)}
                  </span>
                  {b.note && (
                    <span style={{ fontSize: 11, color: '#6b7280', marginLeft: 8 }}>{b.note}</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(b.id)}
                  style={fs.removeBtn}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {blocks.length === 0 && (
        <p style={{ color: '#059669', fontSize: 14, fontWeight: 600, marginTop: 16 }}>
          ✓ No blocked periods — property available for all dates.
        </p>
      )}
    </div>
  );
}

const fs: Record<string, any> = {
  field:     { display: 'flex', flexDirection: 'column', gap: 4 },
  label:     { fontSize: 12, fontWeight: 600, color: '#6b7280' },
  input:     { padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'inherit' },
  btn:       { padding: '10px 18px', background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', height: 42, whiteSpace: 'nowrap' },
  navBtn:    { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '5px 14px', fontSize: 18, cursor: 'pointer', lineHeight: 1.2, color: '#374151' },
  removeBtn: { padding: '4px 10px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 6, color: '#b91c1c', fontSize: 11, fontWeight: 700, cursor: 'pointer' },
  legendBox: (bg: string, border: string): React.CSSProperties => ({
    width: 12, height: 12, background: bg, border: `1px solid ${border}`,
    borderRadius: 3, display: 'inline-block', flexShrink: 0,
  }),
};
