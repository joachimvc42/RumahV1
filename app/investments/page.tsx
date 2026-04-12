'use client';

import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';

type InvestmentItem = {
  id: string; type: 'villa' | 'land'; title: string; location: string;
  price: number; currency: string; tenure: 'freehold' | 'leasehold'; leaseYears?: number;
  expectedYield: number | null; images: string[]; href: string;
  bedrooms?: number | null; bathrooms?: number | null;
  pool?: boolean; garden?: boolean; furnished?: boolean;
  condition?: string; landSize?: string | null;
};

type SearchState = {
  type: 'all' | 'villa' | 'land';
  tenure: 'all' | 'freehold' | 'leasehold';
  location: string;
  searched: boolean;
};

type SidebarFilters = {
  pool: boolean; garden: boolean; furnished: boolean;
  minBedrooms: string; minBathrooms: string;
  condition: string; // 'ready' | 'to_finish' | 'to_renovate' | ''
};

function fmtPrice(price: number, currency: string, isLand: boolean) {
  if (currency === 'USD') return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
  return new Intl.NumberFormat('id-ID').format(price) + (isLand ? ' IDR/are' : ' IDR');
}

function InvestmentCard({ item }: { item: InvestmentItem }) {
  const [imgIdx, setImgIdx] = useState(0);
  const prev = useCallback((e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setImgIdx(i => (i - 1 + item.images.length) % item.images.length); }, [item.images.length]);
  const next = useCallback((e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setImgIdx(i => (i + 1) % item.images.length); }, [item.images.length]);

  return (
    <Link href={item.href} style={s.card}>
      <div style={s.imageWrap}>
        {item.images.length > 0
          ? <img src={item.images[imgIdx]} alt={item.title} style={s.img} />
          : <div style={s.noImg}>{item.type === 'villa' ? '🏠' : '🌴'}</div>
        }
        {item.images.length > 1 && (
          <>
            <button onClick={prev} style={{ ...s.arrow, left: 8 }}>‹</button>
            <button onClick={next} style={{ ...s.arrow, right: 8 }}>›</button>
            <div style={s.dots}>{item.images.map((_, i) => <div key={i} style={{ ...s.dot, background: i === imgIdx ? '#fff' : 'rgba(255,255,255,0.45)' }} />)}</div>
          </>
        )}
        <div style={{ ...s.typeBadge, background: item.type === 'villa' ? '#8b5cf6' : '#059669' }}>{item.type === 'villa' ? '🏠 Villa' : '🌴 Land'}</div>
        <div style={{ ...s.tenureBadge, background: item.tenure === 'freehold' ? '#2563eb' : '#f59e0b' }}>
          {item.tenure === 'freehold' ? '🔑 Freehold' : `📋 Lease ${item.leaseYears}y`}
        </div>
        {item.images.length > 1 && <div style={s.imgCount}>📷 {item.images.length}</div>}
      </div>
      <div style={s.cardBody}>
        <h3 style={s.cardTitle}>{item.title}</h3>
        <p style={s.cardLoc}>📍 {item.location}</p>
        {item.type === 'villa' && (
          <div style={s.features}>
            {item.bedrooms && <span style={s.feat}>{item.bedrooms} bed{item.bedrooms !== 1 ? 's' : ''}</span>}
            {item.bathrooms && <span style={s.feat}>{item.bathrooms} bath{item.bathrooms !== 1 ? 's' : ''}</span>}
            {item.pool && <span style={s.feat}>Pool</span>}
            {item.garden && <span style={s.feat}>Garden</span>}
          </div>
        )}
        <div style={s.priceRow}>
          <span style={s.price}>{fmtPrice(item.price, item.currency, item.type === 'land')}</span>
        </div>
        {item.expectedYield && <div style={s.yieldBadge}>📈 {item.expectedYield}% est. yield</div>}
      </div>
    </Link>
  );
}

export default function InvestmentsPage() {
  const [items, setItems] = useState<InvestmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<SearchState>({ type: 'all', tenure: 'all', location: '', searched: false });
  const [sidebar, setSidebar] = useState<SidebarFilters>({ pool: false, garden: false, furnished: false, minBedrooms: '', minBathrooms: '', condition: '' });

  useEffect(() => {
    const load = async () => {
      const { data: investments } = await supabase.from('investments').select('*');
      if (!investments) { setLoading(false); return; }

      const propertyIds = investments.filter(i => i.asset_type === 'property').map(i => i.asset_id);
      const landIds = investments.filter(i => i.asset_type === 'land').map(i => i.asset_id);

      const [{ data: props }, { data: lands }] = await Promise.all([
        propertyIds.length ? supabase.from('properties').select('*').in('id', propertyIds) : Promise.resolve({ data: [] }),
        landIds.length ? supabase.from('lands').select('*').in('id', landIds) : Promise.resolve({ data: [] }),
      ]);

      const merged: InvestmentItem[] = [];
      for (const inv of investments) {
        if (inv.asset_type === 'property') {
          const prop = props?.find(p => p.id === inv.asset_id);
          if (prop && prop.status === 'published') {
            merged.push({ id: inv.id, type: 'villa', title: prop.title, location: prop.location || 'Lombok', price: prop.price || 0, currency: prop.currency || 'USD', tenure: prop.tenure || 'freehold', leaseYears: prop.lease_years, expectedYield: inv.expected_yield, images: prop.images || [], href: `/investments/${inv.id}`, bedrooms: prop.bedrooms, bathrooms: prop.bathrooms, pool: prop.pool, garden: prop.garden, furnished: prop.furnished, condition: prop.condition });
          }
        }
        if (inv.asset_type === 'land') {
          const land = lands?.find(l => l.id === inv.asset_id);
          if (land && land.status === 'published') {
            merged.push({ id: inv.id, type: 'land', title: land.title, location: land.location || 'Lombok', price: land.price_per_are_idr ?? land.price_per_are ?? 0, currency: land.currency || 'IDR', tenure: land.tenure || 'freehold', leaseYears: land.lease_years, expectedYield: inv.expected_yield, images: land.images || [], href: `/investments/${inv.id}`, landSize: land.land_size, condition: land.condition });
          }
        }
      }
      setItems(merged);
      setLoading(false);
    };
    load();
  }, []);

  const locations = [...new Set(items.map(i => i.location))].sort();

  // Apply search bar filters
  const afterSearch = items.filter(item => {
    if (search.type !== 'all' && item.type !== search.type) return false;
    if (search.tenure !== 'all' && item.tenure !== search.tenure) return false;
    if (search.location && item.location !== search.location) return false;
    return true;
  });

  // Apply sidebar filters (only if searched)
  const filtered = !search.searched ? afterSearch : afterSearch.filter(item => {
    if (sidebar.pool && !item.pool) return false;
    if (sidebar.garden && !item.garden) return false;
    if (sidebar.furnished && !item.furnished) return false;
    if (sidebar.minBedrooms && (item.bedrooms || 0) < Number(sidebar.minBedrooms)) return false;
    if (sidebar.minBathrooms && (item.bathrooms || 0) < Number(sidebar.minBathrooms)) return false;
    if (sidebar.condition && item.condition !== sidebar.condition) return false;
    return true;
  });

  const handleSearch = () => setSearch(s => ({ ...s, searched: true }));

  const isVilla = search.type === 'villa' || (search.type === 'all' && afterSearch.some(i => i.type === 'villa'));
  const isLand = search.type === 'land' || (search.type === 'all' && afterSearch.some(i => i.type === 'land'));

  if (loading) return <main style={s.page}><div style={s.loading}><div style={s.spinner} /><p>Loading opportunities…</p></div></main>;

  return (
    <main style={s.page}>
      <section style={s.hero}>
        <h1 style={s.heroTitle}>Invest in Lombok</h1>
        <p style={s.heroSub}>Selected villas and land — curated for serious investors</p>
      </section>

      {/* Search bar */}
      <div style={s.searchBar}>
        <div style={s.searchSegment}>
          <span style={s.searchLabel}>ASSET TYPE</span>
          <select style={s.searchSelect} value={search.type} onChange={e => setSearch(p => ({ ...p, type: e.target.value as any, searched: false }))}>
            <option value="all">All</option>
            <option value="villa">🏠 Villas</option>
            <option value="land">🌴 Land</option>
          </select>
        </div>
        <div style={s.searchDivider} />
        <div style={s.searchSegment}>
          <span style={s.searchLabel}>PROPERTY TYPE</span>
          <select style={s.searchSelect} value={search.tenure} onChange={e => setSearch(p => ({ ...p, tenure: e.target.value as any, searched: false }))}>
            <option value="all">All</option>
            <option value="freehold">🔑 Freehold</option>
            <option value="leasehold">📋 Leasehold</option>
          </select>
        </div>
        <div style={s.searchDivider} />
        <div style={s.searchSegment}>
          <span style={s.searchLabel}>LOCATION</span>
          <select style={s.searchSelect} value={search.location} onChange={e => setSearch(p => ({ ...p, location: e.target.value, searched: false }))}>
            <option value="">All areas</option>
            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
        </div>
        <div style={s.searchAction}>
          <button onClick={handleSearch} style={s.searchBtn}>Search</button>
        </div>
      </div>

      <div style={s.layout}>
        {/* Sidebar — only after search */}
        {search.searched && (
          <aside style={s.sidebar}>
            {(isVilla || search.type === 'all') && (
              <>
                <p style={s.sidebarHeading}>AMENITIES</p>
                {[['pool','pool','🏊 Pool'],['garden','garden','🌳 Garden'],['furnished','furnished','🛋️ Furnished']] .map(([,key,label]) => (
                  <label key={key} style={s.checkRow}>
                    <input type="checkbox" checked={sidebar[key as keyof SidebarFilters] as boolean} onChange={e => setSidebar(p => ({ ...p, [key]: e.target.checked }))} style={{ accentColor: '#2563eb', width: 18, height: 18 }} />
                    <span style={s.checkLabel}>{label}</span>
                  </label>
                ))}
                <p style={{ ...s.sidebarHeading, marginTop: 20 }}>BEDROOMS</p>
                {[['1','1+'],['2','2+'],['3','3+']].map(([val, label]) => (
                  <label key={val} style={s.checkRow}>
                    <input type="checkbox" checked={sidebar.minBedrooms === val} onChange={e => setSidebar(p => ({ ...p, minBedrooms: e.target.checked ? val : '' }))} style={{ accentColor: '#2563eb', width: 18, height: 18 }} />
                    <span style={s.checkLabel}>{label} bedrooms</span>
                  </label>
                ))}
              </>
            )}
            <p style={{ ...s.sidebarHeading, marginTop: 20 }}>CONDITION</p>
            {[['ready','✅ Ready to live'],['to_finish','🔨 To finish'],['to_renovate','🏚️ To renovate']].map(([val, label]) => (
              <label key={val} style={s.checkRow}>
                <input type="checkbox" checked={sidebar.condition === val} onChange={e => setSidebar(p => ({ ...p, condition: e.target.checked ? val : '' }))} style={{ accentColor: '#f59e0b', width: 18, height: 18 }} />
                <span style={s.checkLabel}>{label}</span>
              </label>
            ))}
          </aside>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={s.resultRow}>
            <p style={s.resultCount}>{filtered.length} opportunit{filtered.length !== 1 ? 'ies' : 'y'} available</p>
            {search.searched && <button onClick={() => { setSearch(p => ({ ...p, searched: false })); setSidebar({ pool: false, garden: false, furnished: false, minBedrooms: '', minBathrooms: '', condition: '' }); }} style={s.resetBtn}>Clear filters</button>}
          </div>
          {filtered.length === 0
            ? <div style={s.empty}><p>No opportunities match your criteria.</p></div>
            : <div style={s.grid}>{filtered.map(item => <InvestmentCard key={item.id} item={item} />)}</div>
          }
        </div>
      </div>
    </main>
  );
}

const s: { [k: string]: React.CSSProperties } = {
  page: { maxWidth: 1400, margin: '0 auto', padding: '0 24px 80px' },
  loading: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16, color: '#6b7280' },
  spinner: { width: 44, height: 44, border: '4px solid #e5e7eb', borderTopColor: '#f59e0b', borderRadius: '50%' },
  hero: { textAlign: 'center', padding: '72px 0 48px' },
  heroTitle: { fontSize: 48, fontWeight: 800, color: '#111827', marginBottom: 14 },
  heroSub: { fontSize: 19, color: '#6b7280', maxWidth: 520, margin: '0 auto' },
  searchBar: { display: 'flex', background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: 32, boxShadow: '0 4px 20px rgba(15,23,42,0.06)', alignItems: 'stretch' },
  searchSegment: { flex: 1, padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 6 },
  searchLabel: { fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', color: '#9ca3af' },
  searchSelect: { border: 'none', outline: 'none', fontSize: 15, fontWeight: 600, color: '#111827', background: 'transparent', cursor: 'pointer', padding: 0 },
  searchDivider: { width: 1, background: '#f3f4f6', margin: '12px 0' },
  searchAction: { display: 'flex', alignItems: 'center', padding: '0 20px' },
  searchBtn: { padding: '13px 24px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' },
  layout: { display: 'flex', gap: 28, alignItems: 'flex-start' },
  sidebar: { width: 240, flexShrink: 0, background: '#fff', borderRadius: 18, border: '1px solid #e5e7eb', padding: '24px 20px', position: 'sticky', top: 24, boxShadow: '0 4px 20px rgba(15,23,42,0.06)' },
  sidebarHeading: { fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', color: '#f59e0b', margin: '0 0 14px', textTransform: 'uppercase' },
  checkRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: '1px solid #f3f4f6', cursor: 'pointer' },
  checkLabel: { fontSize: 15, fontWeight: 500, color: '#374151' },
  resultRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  resultCount: { fontSize: 15, color: '#6b7280', margin: 0 },
  resetBtn: { fontSize: 14, fontWeight: 600, color: '#f59e0b', background: 'none', border: 'none', cursor: 'pointer', padding: 0 },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 60, background: '#f9fafb', borderRadius: 16 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 },
  card: { background: '#fff', borderRadius: 18, overflow: 'hidden', boxShadow: '0 4px 20px rgba(15,23,42,0.07)', border: '1px solid #e5e7eb', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' },
  imageWrap: { position: 'relative', aspectRatio: '16/10', background: '#f3f4f6', flexShrink: 0 },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  noImg: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, color: '#d1d5db' },
  arrow: { position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.93)', border: 'none', fontSize: 22, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.18)', zIndex: 2, color: '#111' },
  dots: { position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5 },
  dot: { width: 6, height: 6, borderRadius: '50%' },
  typeBadge: { position: 'absolute', top: 10, left: 10, padding: '5px 11px', borderRadius: 20, color: '#fff', fontSize: 12, fontWeight: 700 },
  tenureBadge: { position: 'absolute', top: 10, right: 10, padding: '5px 11px', borderRadius: 20, color: '#fff', fontSize: 11, fontWeight: 700 },
  imgCount: { position: 'absolute', bottom: 10, right: 10, padding: '5px 10px', background: 'rgba(0,0,0,0.58)', color: '#fff', borderRadius: 8, fontSize: 11, fontWeight: 600 },
  cardBody: { padding: '18px 20px 20px' },
  cardTitle: { fontSize: 17, fontWeight: 700, color: '#111827', margin: '0 0 4px' },
  cardLoc: { fontSize: 14, color: '#6b7280', margin: '0 0 12px' },
  features: { display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 12 },
  feat: { fontSize: 13, color: '#374151', background: '#f3f4f6', padding: '4px 10px', borderRadius: 7, fontWeight: 500 },
  priceRow: { marginBottom: 8 },
  price: { fontSize: 22, fontWeight: 800, color: '#f59e0b' },
  yieldBadge: { display: 'inline-block', padding: '5px 11px', background: '#ecfdf5', color: '#059669', borderRadius: 8, fontSize: 13, fontWeight: 600 },
};