'use client';

import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';

type RentalRow = {
  id: string; min_duration_months: number; max_duration_months: number;
  monthly_price_idr: number; upfront_months: number; legal_checked: boolean;
  available_from: string | null;
  properties: {
    id: string; title: string; location: string | null; bedrooms: number | null;
    bathrooms: number | null; pool: boolean; garden: boolean; furnished: boolean;
    aircon: boolean; wifi: boolean; parking: boolean; private_space?: boolean;
    images: string[] | null; status?: string;
  } | null;
};

type Filters = {
  location: string; minBeds: string; maxPrice: string;
  pool: boolean; garden: boolean; aircon: boolean; furnished: boolean;
  wifi: boolean; parking: boolean; privateSpace: boolean;
};

function fmtIDR(v: number) { return new Intl.NumberFormat('id-ID').format(v); }

function RentalCard({ rental }: { rental: RentalRow }) {
  const images = rental.properties?.images || [];
  const [imgIdx, setImgIdx] = useState(0);

  const prev = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setImgIdx(i => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setImgIdx(i => (i + 1) % images.length);
  }, [images.length]);

  return (
    <Link href={`/rentals/${rental.properties?.id}`} style={s.card}>
      <div style={s.imageWrap}>
        {images.length > 0
          ? <img src={images[imgIdx]} alt={rental.properties?.title || ''} style={s.img} />
          : <div style={s.noImg}>🏠</div>
        }
        {images.length > 1 && (
          <>
            <button onClick={prev} style={{ ...s.arrow, left: 8 }}>‹</button>
            <button onClick={next} style={{ ...s.arrow, right: 8 }}>›</button>
            <div style={s.dots}>
              {images.map((_, i) => <div key={i} style={{ ...s.dot, background: i === imgIdx ? '#fff' : 'rgba(255,255,255,0.45)' }} />)}
            </div>
          </>
        )}
        {rental.legal_checked && <div style={s.badge}>✓ Verified</div>}
        {images.length > 1 && <div style={s.imgCount}>📷 {images.length}</div>}
      </div>
      <div style={s.cardBody}>
        <h3 style={s.cardTitle}>{rental.properties?.title || 'Property'}</h3>
        <p style={s.cardLoc}>📍 {rental.properties?.location || 'Lombok'}</p>
        <div style={s.features}>
          {rental.properties?.bedrooms && <span style={s.feat}>{rental.properties.bedrooms} bed{rental.properties.bedrooms !== 1 ? 's' : ''}</span>}
          {rental.properties?.bathrooms && <span style={s.feat}>{rental.properties.bathrooms} bath{rental.properties.bathrooms !== 1 ? 's' : ''}</span>}
          {rental.properties?.pool && <span style={s.feat}>Pool</span>}
          {rental.properties?.garden && <span style={s.feat}>Garden</span>}
          {rental.properties?.wifi && <span style={s.feat}>WiFi</span>}
          {rental.properties?.aircon && <span style={s.feat}>AC</span>}
        </div>
        <div style={s.priceRow}>
          <span style={s.price}>{fmtIDR(rental.monthly_price_idr)}</span>
          <span style={s.per}>IDR / month</span>
        </div>
        <p style={s.duration}>{rental.min_duration_months}–{rental.max_duration_months} months{rental.upfront_months > 0 ? ` • ${rental.upfront_months} months upfront` : ''}</p>
      </div>
    </Link>
  );
}

export default function RentalsPage() {
  const [rentals, setRentals] = useState<RentalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    location: '', minBeds: '', maxPrice: '',
    pool: false, garden: false, aircon: false, furnished: false,
    wifi: false, parking: false, privateSpace: false,
  });

  useEffect(() => {
    supabase.from('long_term_rentals')
      .select(`id, min_duration_months, max_duration_months, monthly_price_idr, upfront_months, legal_checked, available_from,
        properties (id, title, location, bedrooms, bathrooms, pool, garden, furnished, aircon, wifi, parking, images, status)`)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setRentals((data as unknown as RentalRow[]) || []);
        setLoading(false);
      });
  }, []);

  const published = rentals.filter(r => r.properties?.status === 'published');
  const locations = [...new Set(published.map(r => r.properties?.location).filter(Boolean))];

  const filtered = published.filter(r => {
    const p = r.properties!;
    if (filters.location && !p.location?.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.minBeds && (p.bedrooms || 0) < Number(filters.minBeds)) return false;
    if (filters.maxPrice && r.monthly_price_idr > Number(filters.maxPrice)) return false;
    if (filters.pool && !p.pool) return false;
    if (filters.garden && !p.garden) return false;
    if (filters.aircon && !p.aircon) return false;
    if (filters.furnished && !p.furnished) return false;
    if (filters.wifi && !p.wifi) return false;
    if (filters.parking && !p.parking) return false;
    return true;
  });

  const resetFilters = () => setFilters({ location: '', minBeds: '', maxPrice: '', pool: false, garden: false, aircon: false, furnished: false, wifi: false, parking: false, privateSpace: false });

  if (loading) return <main style={s.page}><div style={s.loading}><div style={s.spinner} /><p>Loading properties…</p></div></main>;

  return (
    <main style={s.page}>
      <section style={s.hero}>
        <h1 style={s.heroTitle}>Long-term rentals in Lombok</h1>
        <p style={s.heroSub}>Villas and houses curated for expatriates and long-stay residents</p>
      </section>

      <div style={s.layout}>
        {/* Sidebar */}
        <aside style={s.sidebar}>
          <p style={s.sidebarHeading}>AMENITIES</p>
          {([
            ['pool', 'pool', '🏊 Pool'],
            ['garden', 'garden', '🌳 Garden'],
            ['aircon', 'aircon', '❄️ Air conditioning'],
            ['furnished', 'furnished', '🛋️ Furnished'],
            ['wifi', 'wifi', '📶 WiFi'],
            ['parking', 'parking', '🚗 Parking'],
            ['privateSpace', 'privateSpace', '🔒 Private space'],
          ] as [string, keyof Filters, string][]).map(([, key, label]) => (
            <label key={key} style={s.checkRow}>
              <input type="checkbox" checked={filters[key] as boolean} onChange={e => setFilters({ ...filters, [key]: e.target.checked })} style={{ accentColor: '#2563eb', width: 18, height: 18 }} />
              <span style={s.checkLabel}>{label}</span>
            </label>
          ))}
        </aside>

        <div style={s.main}>
          {/* Search bar */}
          <div style={s.searchBar}>
            <div style={s.searchSegment}>
              <span style={s.searchLabel}>LOCATION</span>
              <select style={s.searchSelect} value={filters.location} onChange={e => setFilters({ ...filters, location: e.target.value })}>
                <option value="">All areas</option>
                {locations.map(loc => <option key={loc} value={loc!}>{loc}</option>)}
              </select>
            </div>
            <div style={s.searchDivider} />
            <div style={s.searchSegment}>
              <span style={s.searchLabel}>BEDROOMS</span>
              <select style={s.searchSelect} value={filters.minBeds} onChange={e => setFilters({ ...filters, minBeds: e.target.value })}>
                <option value="">Any</option>
                <option value="1">1+</option><option value="2">2+</option>
                <option value="3">3+</option><option value="4">4+</option>
              </select>
            </div>
            <div style={s.searchDivider} />
            <div style={s.searchSegment}>
              <span style={s.searchLabel}>MAX BUDGET (IDR/mo)</span>
              <select style={s.searchSelect} value={filters.maxPrice} onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}>
                <option value="">All budgets</option>
                <option value="15000000">15 Mio</option><option value="25000000">25 Mio</option>
                <option value="35000000">35 Mio</option><option value="50000000">50 Mio</option>
                <option value="75000000">75 Mio</option>
              </select>
            </div>
          </div>

          <div style={s.resultRow}>
            <p style={s.resultCount}>{filtered.length} propert{filtered.length !== 1 ? 'ies' : 'y'} available</p>
            {(Object.values(filters).some(v => v !== '' && v !== false)) && (
              <button onClick={resetFilters} style={s.resetBtn}>Reset filters</button>
            )}
          </div>

          {filtered.length === 0
            ? <div style={s.empty}><p>No properties match your criteria.</p><button onClick={resetFilters} style={s.emptyBtn}>Reset filters</button></div>
            : <div style={s.grid}>{filtered.map(r => <RentalCard key={r.id} rental={r} />)}</div>
          }
        </div>
      </div>
    </main>
  );
}

const s: { [k: string]: React.CSSProperties } = {
  page: { maxWidth: 1400, margin: '0 auto', padding: '0 24px 80px' },
  loading: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16, color: '#6b7280' },
  spinner: { width: 44, height: 44, border: '4px solid #e5e7eb', borderTopColor: '#2563eb', borderRadius: '50%' },
  hero: { textAlign: 'center', padding: '72px 0 48px' },
  heroTitle: { fontSize: 48, fontWeight: 800, color: '#111827', marginBottom: 14 },
  heroSub: { fontSize: 19, color: '#6b7280', maxWidth: 520, margin: '0 auto' },
  layout: { display: 'flex', gap: 28, alignItems: 'flex-start' },
  sidebar: { width: 240, flexShrink: 0, background: '#fff', borderRadius: 18, border: '1px solid #e5e7eb', padding: '24px 20px', position: 'sticky', top: 24, boxShadow: '0 4px 20px rgba(15,23,42,0.06)' },
  sidebarHeading: { fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', color: '#2563eb', margin: '0 0 16px', textTransform: 'uppercase' },
  checkRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: '1px solid #f3f4f6', cursor: 'pointer' },
  checkLabel: { fontSize: 15, fontWeight: 500, color: '#374151' },
  main: { flex: 1, minWidth: 0 },
  searchBar: { display: 'flex', background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: 24, boxShadow: '0 4px 20px rgba(15,23,42,0.06)' },
  searchSegment: { flex: 1, padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 6 },
  searchLabel: { fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', color: '#9ca3af' },
  searchSelect: { border: 'none', outline: 'none', fontSize: 15, fontWeight: 600, color: '#111827', background: 'transparent', cursor: 'pointer', padding: 0 },
  searchDivider: { width: 1, background: '#f3f4f6', margin: '12px 0' },
  resultRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  resultCount: { fontSize: 15, color: '#6b7280', margin: 0 },
  resetBtn: { fontSize: 14, fontWeight: 600, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', padding: 0 },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 60, background: '#f9fafb', borderRadius: 16 },
  emptyBtn: { padding: '12px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 },
  // Card
  card: { background: '#fff', borderRadius: 18, overflow: 'hidden', boxShadow: '0 4px 20px rgba(15,23,42,0.07)', border: '1px solid #e5e7eb', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, box-shadow 0.2s' },
  imageWrap: { position: 'relative', aspectRatio: '16/10', background: '#f3f4f6', flexShrink: 0 },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  noImg: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, color: '#d1d5db' },
  arrow: { position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.93)', border: 'none', fontSize: 22, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.18)', zIndex: 2, color: '#111' },
  dots: { position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5 },
  dot: { width: 6, height: 6, borderRadius: '50%' },
  badge: { position: 'absolute', top: 10, left: 10, padding: '5px 11px', background: '#059669', color: '#fff', borderRadius: 20, fontSize: 12, fontWeight: 700 },
  imgCount: { position: 'absolute', top: 10, right: 10, padding: '5px 10px', background: 'rgba(0,0,0,0.58)', color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 600 },
  cardBody: { padding: '18px 20px 20px' },
  cardTitle: { fontSize: 17, fontWeight: 700, color: '#111827', margin: '0 0 4px' },
  cardLoc: { fontSize: 14, color: '#6b7280', margin: '0 0 12px' },
  features: { display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 14 },
  feat: { fontSize: 13, color: '#374151', background: '#f3f4f6', padding: '4px 10px', borderRadius: 7, fontWeight: 500 },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 },
  price: { fontSize: 22, fontWeight: 800, color: '#059669' },
  per: { fontSize: 14, color: '#6b7280' },
  duration: { fontSize: 13, color: '#6b7280', margin: 0 },
};