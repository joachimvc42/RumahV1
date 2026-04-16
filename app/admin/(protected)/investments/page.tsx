'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import { getStatusLabel, getStatusColor, normalizeStatus } from '../../../../lib/statusUtils';

const WA_NUMBER = '6287873487940';

type InvestmentRow = {
  id: string;
  asset_type: 'property' | 'land';
  asset_id: string;
  expected_yield: number | null;
  management_available: boolean;
  legal_checked: boolean;
  created_at: string;
  title?: string;
  location?: string;
  price?: number;
  currency?: string;
  tenure?: string;
  lease_years?: number;
  images?: string[];
  status?: string | null;
};

type Search = { type: 'all'|'property'|'land'; tenure: 'all'|'freehold'|'leasehold'; location: string };

function fmtPrice(price: number, currency: string) {
  if (currency === 'USD') return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
  const m = price / 1_000_000;
  return (m % 1 === 0 ? `${m} M` : `${m.toFixed(1)} M`) + ' IDR';
}

export default function AdminInvestmentsPage() {
  const [investments, setInvestments] = useState<InvestmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState<Search>({ type: 'all', tenure: 'all', location: '' });

  useEffect(() => {
    const load = async () => {
      const { data: invs, error: invErr } = await supabase
        .from('investments').select('*').order('created_at', { ascending: false });
      if (invErr || !invs) { setError('Failed to load investments'); setLoading(false); return; }

      const propertyIds = invs.filter(i => i.asset_type === 'property').map(i => i.asset_id);
      const landIds = invs.filter(i => i.asset_type === 'land').map(i => i.asset_id);

      const [{ data: properties }, { data: lands }] = await Promise.all([
        propertyIds.length ? supabase.from('properties').select('id,title,location,price,currency,tenure,lease_years,images,status').in('id', propertyIds) : Promise.resolve({ data: [] }),
        landIds.length ? supabase.from('lands').select('id,title,location,price_per_are_idr,price_per_are,currency,tenure,lease_years,images,status').in('id', landIds) : Promise.resolve({ data: [] }),
      ]);

      const enriched: InvestmentRow[] = invs.map(inv => {
        if (inv.asset_type === 'property') {
          const p = properties?.find(p => p.id === inv.asset_id);
          return { ...inv, title: p?.title, location: p?.location, price: p?.price, currency: p?.currency || 'USD', tenure: p?.tenure, lease_years: p?.lease_years, images: p?.images, status: p?.status };
        } else {
          const l = lands?.find(l => l.id === inv.asset_id);
          return { ...inv, title: l?.title, location: l?.location, price: l?.price_per_are_idr ?? l?.price_per_are, currency: l?.currency || 'IDR', tenure: l?.tenure, lease_years: l?.lease_years, images: l?.images, status: l?.status };
        }
      });

      setInvestments(enriched);
      setLoading(false);
    };
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this investment? This action is irreversible.')) return;
    setDeleting(id);
    setError(null);
    const { error } = await supabase.from('investments').delete().eq('id', id);
    if (error) { setError(`Failed to delete: ${error.message}`); setDeleting(null); }
    else { setInvestments(prev => prev.filter(i => i.id !== id)); setDeleting(null); }
  };

  const locations = [...new Set(investments.map(i => i.location).filter(Boolean))] as string[];

  const filtered = investments.filter(inv => {
    if (search.type !== 'all' && inv.asset_type !== search.type) return false;
    if (search.tenure !== 'all' && inv.tenure !== search.tenure) return false;
    if (search.location && inv.location !== search.location) return false;
    return true;
  });

  if (loading) return <div style={s.loading}>Loading investments...</div>;

  return (
    <main style={s.container}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Investment Portfolio</h1>
          <p style={s.subtitle}>{investments.length} investment{investments.length !== 1 ? 's' : ''} registered</p>
        </div>
        <Link href="/admin/investments/new" style={s.btnAdd}>+ Add investment</Link>
      </div>

      {error && <div style={s.error}>{error}</div>}

      {/* ── Search bar ── */}
      <div style={s.searchBar}>
        <div style={s.seg}>
          <span style={s.segLabel}>ASSET TYPE</span>
          <select style={s.segSel} value={search.type} onChange={e => setSearch(v => ({ ...v, type: e.target.value as any }))}>
            <option value="all">All</option>
            <option value="property">Villa</option>
            <option value="land">Land</option>
          </select>
        </div>
        <div style={s.divider} />
        <div style={s.seg}>
          <span style={s.segLabel}>PROPERTY TYPE</span>
          <select style={s.segSel} value={search.tenure} onChange={e => setSearch(v => ({ ...v, tenure: e.target.value as any }))}>
            <option value="all">All</option>
            <option value="freehold">Freehold</option>
            <option value="leasehold">Leasehold</option>
          </select>
        </div>
        <div style={s.divider} />
        <div style={s.seg}>
          <span style={s.segLabel}>LOCATION</span>
          <select style={s.segSel} value={search.location} onChange={e => setSearch(v => ({ ...v, location: e.target.value }))}>
            <option value="">All areas</option>
            {locations.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        {(search.type !== 'all' || search.tenure !== 'all' || search.location) && (
          <button onClick={() => setSearch({ type: 'all', tenure: 'all', location: '' })} style={s.clearBtn}>✕ Clear</button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div style={s.empty}>
          <span style={{ fontSize: 48 }}>💰</span>
          <p>{investments.length === 0 ? 'No investments yet' : 'No results for these filters'}</p>
          {investments.length === 0 && <Link href="/admin/investments/new" style={s.btnAdd}>Create my first investment</Link>}
        </div>
      ) : (
        <div style={s.grid}>
          {filtered.map(inv => {
            const waMsg = encodeURIComponent(`Hello, I am interested in the investment: ${inv.title || 'this property'}`);
            const normalizedStatus = normalizeStatus(inv.status);
            return (
              <div key={inv.id} style={s.card}>
                {/* Image — clean, no overlays */}
                <div style={s.imageContainer}>
                  {inv.images?.[0] ? (
                    <img src={inv.images[0]} alt={inv.title || 'Investment'} style={s.image} />
                  ) : (
                    <div style={s.noImage}>
                      <span style={{ fontSize: 32 }}>{inv.asset_type === 'property' ? '🏠' : '🌴'}</span>
                      <span>No image</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={s.cardContent}>
                  {/* Status + type + tenure row */}
                  <div style={s.metaRow}>
                    {inv.status && (
                      <span style={{ ...s.metaBadge, background: getStatusColor(normalizedStatus), color: '#fff' }}>
                        {getStatusLabel(inv.status)}
                      </span>
                    )}
                    <span style={{ ...s.metaBadge, background: inv.asset_type === 'property' ? '#ede9fe' : '#dcfce7', color: inv.asset_type === 'property' ? '#6d28d9' : '#059669' }}>
                      {inv.asset_type === 'property' ? 'Villa' : 'Land'}
                    </span>
                    <span style={{ ...s.metaBadge, background: inv.tenure === 'freehold' ? '#dbeafe' : '#fef3c7', color: inv.tenure === 'freehold' ? '#1d4ed8' : '#b45309' }}>
                      {inv.tenure === 'freehold' ? 'Freehold' : inv.lease_years ? `Lease ${inv.lease_years}y` : 'Leasehold'}
                    </span>
                    {(inv.images?.length || 0) > 1 && (
                      <span style={{ ...s.metaBadge, background: '#f3f4f6', color: '#6b7280' }}>
                        {inv.images?.length} photos
                      </span>
                    )}
                  </div>

                  <h3 style={s.cardTitle}>{inv.title || 'Untitled'}</h3>
                  <p style={s.location}>📍 {inv.location || '—'}</p>

                  <div style={s.priceSection}>
                    <span style={s.price}>{inv.price ? fmtPrice(inv.price, inv.currency || 'USD') : '—'}</span>
                    {inv.asset_type === 'land' && <span style={s.priceUnit}>/are</span>}
                  </div>

                  {inv.expected_yield && (
                    <div style={s.yieldBadge}>📈 {inv.expected_yield}% est. yield</div>
                  )}

                  <div style={s.tagRow}>
                    {inv.legal_checked && <span style={s.tag}>✅ Verified</span>}
                    {inv.management_available && <span style={s.tag}>🏢 Management</span>}
                  </div>

                  <div style={s.actions}>
                    <Link href={`/admin/investments/${inv.id}`} style={s.btnEdit}>✏️ Edit</Link>
                    <a href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`} target="_blank" rel="noopener noreferrer" style={s.btnWa} title="WhatsApp">💬</a>
                    <button onClick={() => handleDelete(inv.id)} disabled={deleting === inv.id} style={s.btnDelete}>
                      {deleting === inv.id ? '...' : '🗑️'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

const s: { [key: string]: React.CSSProperties } = {
  container: { padding: 24, maxWidth: 1200, margin: '0 auto' },
  loading: { padding: 40, textAlign: 'center', color: '#6b7280' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 800, color: '#111827', margin: 0 },
  subtitle: { color: '#6b7280', marginTop: 4, fontSize: 14 },
  btnAdd: { padding: '12px 22px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14, boxShadow: '0 4px 14px rgba(245,158,11,0.25)' },
  error: { background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '12px 16px', borderRadius: 8, marginBottom: 20 },
  /* Search bar */
  searchBar: { display: 'flex', background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: 28, boxShadow: '0 2px 12px rgba(15,23,42,0.06)', alignItems: 'stretch' },
  seg: { flex: 1, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 4 },
  segLabel: { fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', color: '#9ca3af' },
  segSel: { border: 'none', outline: 'none', fontSize: 14, fontWeight: 600, color: '#111827', background: 'transparent', cursor: 'pointer', padding: 0 },
  divider: { width: 1, background: '#f3f4f6', margin: '10px 0' },
  clearBtn: { alignSelf: 'center', margin: '0 16px', padding: '8px 14px', background: '#f3f4f6', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#6b7280', cursor: 'pointer' },
  /* Grid */
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 60, background: '#f9fafb', borderRadius: 16, color: '#6b7280' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 },
  card: { background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 16px rgba(15,23,42,0.08)', border: '1px solid #e8e8e8', display: 'flex', flexDirection: 'column' },
  imageContainer: { position: 'relative', height: 160, background: '#f3f4f6', flexShrink: 0, overflow: 'hidden' },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  noImage: { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#9ca3af', fontSize: 14 },
  cardContent: { padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', flex: 1 },
  metaRow: { display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 },
  metaBadge: { fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6 },
  cardTitle: { fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 3px', lineHeight: 1.3 },
  location: { color: '#9ca3af', fontSize: 12, margin: '0 0 8px' },
  priceSection: { display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 },
  price: { fontSize: 18, fontWeight: 800, color: '#f59e0b' },
  priceUnit: { fontSize: 12, color: '#6b7280' },
  yieldBadge: { display: 'inline-block', padding: '4px 9px', background: '#ecfdf5', color: '#059669', borderRadius: 7, fontSize: 11, fontWeight: 600, marginBottom: 8, alignSelf: 'flex-start' },
  tagRow: { display: 'flex', gap: 5, marginBottom: 12, flexWrap: 'wrap' },
  tag: { padding: '3px 8px', background: '#f3f4f6', borderRadius: 6, fontSize: 11, fontWeight: 500, color: '#374151' },
  actions: { display: 'flex', gap: 8, marginTop: 'auto' },
  btnEdit: { flex: 1, padding: '9px 12px', background: '#f3f4f6', color: '#374151', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 12, textAlign: 'center', border: '1px solid #e5e7eb' },
  btnWa: { padding: '9px 12px', background: '#dcfce7', borderRadius: 8, textDecoration: 'none', fontSize: 15, textAlign: 'center', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  btnDelete: { padding: '9px 10px', background: '#fef2f2', color: '#b91c1c', borderRadius: 8, border: '1px solid #fca5a5', cursor: 'pointer', fontSize: 13 },
};
