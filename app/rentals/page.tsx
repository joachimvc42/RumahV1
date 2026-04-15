'use client';

import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';

type RentalRow = {
  id: string; min_duration_months: number; max_duration_months: number;
  monthly_price_idr: number; upfront_months: number; legal_checked: boolean;
  available_from: string | null;
  properties: {
    id: string; title: string; location: string | null;
    bedrooms: number | null; bathrooms: number | null;
    pool: boolean; garden: boolean; furnished: boolean;
    aircon: boolean; wifi: boolean; parking: boolean;
    private_space?: boolean; kitchen?: boolean;
    images: string[] | null; status?: string;
  } | null;
};

type Filters = {
  location: string; minBeds: string; maxPrice: string;
  pool: boolean; garden: boolean; aircon: boolean;
  furnished: boolean; wifi: boolean; parking: boolean;
  privateSpace: boolean; kitchen: boolean;
};

function fmtIDR(v: number) { return new Intl.NumberFormat('id-ID').format(v); }

function RentalCard({ rental }: { rental: RentalRow }) {
  const images = rental.properties?.images ?? [];
  const [idx, setIdx] = useState(0);

  const prev = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setIdx(i => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setIdx(i => (i + 1) % images.length);
  }, [images.length]);

  const p = rental.properties;

  return (
    <div style={C.card}>
      {/* Image */}
      <div style={C.imgWrap}>
        {images.length > 0 ? images.map((src, i) => (
          <img key={src} src={src} alt={p?.title ?? ''} loading={i === 0 ? 'eager' : 'lazy'}
            style={{ ...C.img, opacity: i === idx ? 1 : 0 }} />
        )) : (
          <div style={C.noImg}>🏠</div>
        )}
        <div style={C.gradient} />
        {rental.legal_checked && <div style={C.badgeVerified}>Verified</div>}
        {images.length > 1 && <div style={C.imgCount}>{images.length} photos</div>}
        {images.length > 1 && (
          <>
            <button onClick={prev} style={{ ...C.arrow, left: 12 }} aria-label="Previous">‹</button>
            <button onClick={next} style={{ ...C.arrow, right: 12 }} aria-label="Next">›</button>
            <div style={C.dots}>
              {images.map((_, i) => (
                <button key={i} aria-label={`Photo ${i + 1}`}
                  onClick={e => { e.preventDefault(); e.stopPropagation(); setIdx(i); }}
                  style={{ ...C.dot, background: i === idx ? '#fff' : 'rgba(255,255,255,0.4)' }} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <Link href={`/rentals/${p?.id}`} style={C.link}>
        <div style={C.body}>
          <div>
            <h3 style={C.title}>{p?.title ?? 'Property'}</h3>
            <p style={C.loc}>{p?.location ?? 'Lombok'}</p>
            <div style={C.chips}>
              {p?.bedrooms && <span style={C.chip}>{p.bedrooms} bed{p.bedrooms !== 1 ? 's' : ''}</span>}
              {p?.bathrooms && <span style={C.chip}>{p.bathrooms} bath{p.bathrooms !== 1 ? 's' : ''}</span>}
              {p?.pool && <span style={C.chip}>Pool</span>}
              {p?.garden && <span style={C.chip}>Garden</span>}
              {p?.aircon && <span style={C.chip}>AC</span>}
              {p?.wifi && <span style={C.chip}>WiFi</span>}
              {p?.furnished && <span style={C.chip}>Furnished</span>}
              {p?.kitchen && <span style={C.chip}>Kitchen</span>}
            </div>
          </div>
          <div style={C.priceBlock}>
            <div style={C.priceRow}>
              <span style={C.price}>{fmtIDR(rental.monthly_price_idr)}</span>
              <span style={C.per}>IDR / month</span>
            </div>
            <p style={C.dur}>{rental.min_duration_months}–{rental.max_duration_months} months{rental.upfront_months > 0 ? ` · ${rental.upfront_months} months upfront` : ''}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function RentalsPage() {
  const [rentals, setRentals] = useState<RentalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    location: '', minBeds: '', maxPrice: '',
    pool: false, garden: false, aircon: false,
    furnished: false, wifi: false, parking: false,
    privateSpace: false, kitchen: false,
  });

  useEffect(() => {
    supabase.from('long_term_rentals')
      .select(`id, min_duration_months, max_duration_months, monthly_price_idr, upfront_months, legal_checked, available_from,
        properties (id, title, location, bedrooms, bathrooms, pool, garden, furnished, aircon, wifi, parking, private_space, kitchen, images, status)`)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setRentals((data as unknown as RentalRow[]) || []); setLoading(false); });
  }, []);

  const published = rentals.filter(r => r.properties?.status === 'published');
  const locations = [...new Set(published.map(r => r.properties?.location).filter(Boolean))] as string[];

  const filtered = published.filter(r => {
    const p = r.properties!;
    if (filters.location && p.location !== filters.location) return false;
    if (filters.minBeds && (p.bedrooms ?? 0) < Number(filters.minBeds)) return false;
    if (filters.maxPrice && r.monthly_price_idr > Number(filters.maxPrice)) return false;
    if (filters.pool && !p.pool) return false;
    if (filters.garden && !p.garden) return false;
    if (filters.aircon && !p.aircon) return false;
    if (filters.furnished && !p.furnished) return false;
    if (filters.wifi && !p.wifi) return false;
    if (filters.parking && !p.parking) return false;
    if (filters.privateSpace && !p.private_space) return false;
    if (filters.kitchen && !p.kitchen) return false;
    return true;
  });

  const reset = () => setFilters({
    location: '', minBeds: '', maxPrice: '',
    pool: false, garden: false, aircon: false,
    furnished: false, wifi: false, parking: false,
    privateSpace: false, kitchen: false,
  });

  if (loading) return (
    <main style={P.page}><div style={P.loading}><div style={P.spinner} /><span style={{ fontSize: 16, color: '#6b7280' }}>Loading properties…</span></div></main>
  );

  return (
    <main style={P.page}>
      <section style={P.hero}>
        <h1 style={P.h1}>Long-term rentals in Lombok</h1>
        <p style={P.sub}>Villas and houses curated for expatriates and long-stay residents</p>
      </section>

      <div style={P.layout}>
        <aside style={P.sidebar}>
          <p style={P.sHead}>AMENITIES</p>
          {([
            ['pool', '🏊 Pool'],
            ['garden', '🌳 Garden'],
            ['aircon', '❄️ Air conditioning'],
            ['furnished', '🛋️ Furnished'],
            ['kitchen', '🍳 Kitchen'],
            ['wifi', '📶 WiFi'],
            ['parking', '🚗 Parking'],
            ['privateSpace', '🔒 Private space'],
          ] as [keyof Filters, string][]).map(([key, label]) => (
            <label key={key} style={P.checkRow}>
              <input type="checkbox" checked={filters[key] as boolean}
                onChange={e => setFilters(f => ({ ...f, [key]: e.target.checked }))}
                style={{ accentColor: '#2563eb', width: 16, height: 16, cursor: 'pointer' }} />
              <span style={P.checkLabel}>{label}</span>
            </label>
          ))}
        </aside>

        <div style={P.main}>
          <div style={P.searchBar}>
            <div style={P.seg}>
              <span style={P.segLabel}>LOCATION</span>
              <select style={P.segSel} value={filters.location} onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}>
                <option value="">All areas</option>
                {locations.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div style={P.div} />
            <div style={P.seg}>
              <span style={P.segLabel}>BEDROOMS</span>
              <select style={P.segSel} value={filters.minBeds} onChange={e => setFilters(f => ({ ...f, minBeds: e.target.value }))}>
                <option value="">Any</option>
                <option value="1">1+</option><option value="2">2+</option>
                <option value="3">3+</option><option value="4">4+</option>
              </select>
            </div>
            <div style={P.div} />
            <div style={P.seg}>
              <span style={P.segLabel}>MAX BUDGET (IDR/mo)</span>
              <select style={P.segSel} value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}>
                <option value="">All budgets</option>
                <option value="15000000">15 Mio</option><option value="25000000">25 Mio</option>
                <option value="35000000">35 Mio</option><option value="50000000">50 Mio</option>
                <option value="75000000">75 Mio</option>
              </select>
            </div>
          </div>

          <div style={P.resultRow}>
            <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>
              {filtered.length} propert{filtered.length !== 1 ? 'ies' : 'y'} available
            </p>
            {Object.values(filters).some(v => v !== '' && v !== false) && (
              <button onClick={reset} style={{ fontSize: 13, fontWeight: 600, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}>
                Reset filters
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 60, background: '#f9fafb', borderRadius: 14 }}>
              <p style={{ color: '#6b7280', fontSize: 15 }}>No properties match your criteria.</p>
              <button onClick={reset} style={{ padding: '11px 22px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                Reset filters
              </button>
            </div>
          ) : (
            <div style={P.grid}>{filtered.map(r => <RentalCard key={r.id} rental={r} />)}</div>
          )}
        </div>
      </div>
    </main>
  );
}

const C: { [k: string]: React.CSSProperties } = {
  card: { background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 16px rgba(15,23,42,0.08)', border: '1px solid #e8e8e8', display: 'flex', flexDirection: 'column' },
  imgWrap: { position: 'relative', width: '100%', height: 220, flexShrink: 0, background: '#e5e7eb', overflow: 'hidden' },
  img: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.35s ease', pointerEvents: 'none', userSelect: 'none' },
  noImg: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, color: '#d1d5db' },
  gradient: { position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 60%,rgba(0,0,0,0.32) 100%)', pointerEvents: 'none' },
  badgeVerified: { position: 'absolute', top: 12, left: 12, background: '#166534', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 5, letterSpacing: '0.04em', textTransform: 'uppercase' },
  imgCount: { position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '4px 9px', borderRadius: 5 },
  arrow: { position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', border: 'none', fontSize: 20, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.18)', zIndex: 3, color: '#111', padding: 0, lineHeight: 1 },
  dots: { position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5, zIndex: 3 },
  dot: { width: 6, height: 6, borderRadius: '50%', border: 'none', padding: 0, cursor: 'pointer', transition: 'background 0.2s' },
  link: { textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flex: 1 },
  body: { padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 },
  title: { fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 3px', lineHeight: 1.35 },
  loc: { fontSize: 13, color: '#9ca3af', margin: '0 0 10px' },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 5 },
  chip: { fontSize: 12, color: '#374151', background: '#f3f4f6', padding: '3px 9px', borderRadius: 5, fontWeight: 600, border: '1px solid #e5e7eb' },
  priceBlock: { marginTop: 16, paddingTop: 14, borderTop: '1px solid #f3f4f6' },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 3 },
  price: { fontSize: 20, fontWeight: 800, color: '#111827' },
  per: { fontSize: 13, color: '#6b7280' },
  dur: { fontSize: 12, color: '#9ca3af', margin: 0 },
};

const P: { [k: string]: React.CSSProperties } = {
  page: { maxWidth: 1400, margin: '0 auto', padding: '0 24px 80px' },
  loading: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 },
  spinner: { width: 44, height: 44, border: '4px solid #e5e7eb', borderTopColor: '#2563eb', borderRadius: '50%' },
  hero: { textAlign: 'center', padding: '64px 0 48px' },
  h1: { fontSize: 42, fontWeight: 800, color: '#111827', marginBottom: 12, lineHeight: 1.15 },
  sub: { fontSize: 17, color: '#6b7280', maxWidth: 480, margin: '0 auto' },
  layout: { display: 'flex', gap: 28, alignItems: 'flex-start' },
  sidebar: { width: 220, flexShrink: 0, background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', padding: '20px 16px', position: 'sticky', top: 24, boxShadow: '0 2px 12px rgba(15,23,42,0.05)' },
  sHead: { fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', color: '#6b7280', margin: '0 0 12px', textTransform: 'uppercase' },
  checkRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid #f3f4f6', cursor: 'pointer' },
  checkLabel: { fontSize: 14, fontWeight: 500, color: '#374151' },
  main: { flex: 1, minWidth: 0 },
  searchBar: { display: 'flex', background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: 22, boxShadow: '0 2px 10px rgba(15,23,42,0.05)' },
  seg: { flex: 1, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 5 },
  segLabel: { fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', color: '#9ca3af' },
  segSel: { border: 'none', outline: 'none', fontSize: 14, fontWeight: 600, color: '#111827', background: 'transparent', cursor: 'pointer', padding: 0 },
  div: { width: 1, background: '#f3f4f6', margin: '10px 0' },
  resultRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 20 },
};
