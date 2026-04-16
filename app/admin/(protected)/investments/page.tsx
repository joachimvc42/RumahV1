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

function fmtPrice(price: number, currency: string) {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
  }
  return new Intl.NumberFormat('id-ID').format(price) + ' IDR';
}

export default function AdminInvestmentsPage() {
  const [investments, setInvestments] = useState<InvestmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: invs, error: invErr } = await supabase
        .from('investments')
        .select('*')
        .order('created_at', { ascending: false });

      if (invErr || !invs) { setError('Failed to load investments'); setLoading(false); return; }

      const propertyIds = invs.filter(i => i.asset_type === 'property').map(i => i.asset_id);
      const landIds = invs.filter(i => i.asset_type === 'land').map(i => i.asset_id);

      const [{ data: properties }, { data: lands }] = await Promise.all([
        propertyIds.length
          ? supabase.from('properties').select('id,title,location,price,currency,tenure,lease_years,images,status').in('id', propertyIds)
          : Promise.resolve({ data: [] }),
        landIds.length
          ? supabase.from('lands').select('id,title,location,price_per_are_idr,price_per_are,currency,tenure,lease_years,images,status').in('id', landIds)
          : Promise.resolve({ data: [] }),
      ]);

      const enriched: InvestmentRow[] = invs.map(inv => {
        if (inv.asset_type === 'property') {
          const prop = properties?.find(p => p.id === inv.asset_id);
          return { ...inv, title: prop?.title, location: prop?.location, price: prop?.price, currency: prop?.currency || 'USD', tenure: prop?.tenure, lease_years: prop?.lease_years, images: prop?.images, status: prop?.status };
        } else {
          const land = lands?.find(l => l.id === inv.asset_id);
          return { ...inv, title: land?.title, location: land?.location, price: land?.price_per_are_idr ?? land?.price_per_are, currency: land?.currency || 'IDR', tenure: land?.tenure, lease_years: land?.lease_years, images: land?.images, status: land?.status };
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

      {investments.length === 0 ? (
        <div style={s.empty}>
          <span style={{ fontSize: 48 }}>💰</span>
          <p>No investments yet</p>
          <Link href="/admin/investments/new" style={s.btnAdd}>Create my first investment</Link>
        </div>
      ) : (
        <div style={s.grid}>
          {investments.map(inv => {
            const waMsg = encodeURIComponent(`Hello, I am interested in the investment: ${inv.title || 'this property'}`);
            const normalizedStatus = normalizeStatus(inv.status);
            return (
              <div key={inv.id} style={s.card}>
                {/* Image */}
                <div style={s.imageContainer}>
                  {inv.images?.[0] ? (
                    <img src={inv.images[0]} alt={inv.title || 'Investment'} style={s.image} />
                  ) : (
                    <div style={s.noImage}>
                      <span style={{ fontSize: 32 }}>{inv.asset_type === 'property' ? '🏠' : '🌴'}</span>
                      <span>No image</span>
                    </div>
                  )}

                  {/* Top-left: status badge */}
                  {inv.status && (
                    <div style={{ ...s.badgeTopLeft, background: getStatusColor(normalizedStatus) }}>
                      {getStatusLabel(inv.status)}
                    </div>
                  )}

                  {/* Top-right: tenure badge */}
                  <div style={{ ...s.badgeTopRight, background: inv.tenure === 'freehold' ? '#2563eb' : '#f59e0b' }}>
                    {inv.tenure === 'freehold' ? '🔑 Freehold' : inv.lease_years ? `📋 Lease ${inv.lease_years}y` : '📋 Leasehold'}
                  </div>

                  {/* Bottom-left: type badge */}
                  <div style={{ ...s.badgeBottomLeft, background: inv.asset_type === 'property' ? '#8b5cf6' : '#059669' }}>
                    {inv.asset_type === 'property' ? '🏠 Villa' : '🌴 Land'}
                  </div>

                  {/* Bottom-right: image count */}
                  {(inv.images?.length || 0) > 1 && (
                    <div style={s.badgeBottomRight}>📷 {inv.images?.length}</div>
                  )}
                </div>

                {/* Content */}
                <div style={s.cardContent}>
                  <h3 style={s.cardTitle}>{inv.title || 'Untitled'}</h3>
                  <p style={s.location}>📍 {inv.location || '—'}</p>

                  <div style={s.priceSection}>
                    <span style={s.price}>{inv.price ? fmtPrice(inv.price, inv.currency || 'USD') : '—'}</span>
                    {inv.asset_type === 'land' && <span style={s.priceUnit}>/are</span>}
                  </div>

                  {inv.expected_yield && (
                    <div style={s.yieldBadge}>📈 {inv.expected_yield}% estimated yield</div>
                  )}

                  <div style={s.tagRow}>
                    {inv.legal_checked && <span style={s.tag}>✅ Verified</span>}
                    {inv.management_available && <span style={s.tag}>🏢 Management</span>}
                  </div>

                  {/* Actions */}
                  <div style={s.actions}>
                    <Link href={`/admin/investments/${inv.id}`} style={s.btnEdit}>✏️ Edit</Link>
                    <a
                      href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={s.btnWa}
                      title="Contact via WhatsApp"
                    >
                      💬
                    </a>
                    <button
                      onClick={() => handleDelete(inv.id)}
                      disabled={deleting === inv.id}
                      style={s.btnDelete}
                    >
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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 28, fontWeight: 800, color: '#111827', margin: 0 },
  subtitle: { color: '#6b7280', marginTop: 4, fontSize: 14 },
  btnAdd: { padding: '14px 24px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 15, boxShadow: '0 4px 14px rgba(245,158,11,0.3)' },
  error: { background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '12px 16px', borderRadius: 8, marginBottom: 20 },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 60, background: '#f9fafb', borderRadius: 16, color: '#6b7280' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 },
  card: { background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' },
  imageContainer: { position: 'relative', aspectRatio: '16/10', background: '#f3f4f6', flexShrink: 0 },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  noImage: { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#9ca3af', fontSize: 14 },
  badgeTopLeft: { position: 'absolute', top: 10, left: 10, padding: '5px 10px', borderRadius: 20, color: '#fff', fontSize: 11, fontWeight: 700 },
  badgeTopRight: { position: 'absolute', top: 10, right: 10, padding: '5px 10px', borderRadius: 20, color: '#fff', fontSize: 11, fontWeight: 700 },
  badgeBottomLeft: { position: 'absolute', bottom: 10, left: 10, padding: '5px 10px', borderRadius: 20, color: '#fff', fontSize: 11, fontWeight: 700 },
  badgeBottomRight: { position: 'absolute', bottom: 10, right: 10, padding: '5px 10px', borderRadius: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 11, fontWeight: 600 },
  cardContent: { padding: 18, display: 'flex', flexDirection: 'column', flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 700, color: '#111827', margin: 0, marginBottom: 4, lineHeight: 1.3 },
  location: { color: '#6b7280', fontSize: 13, margin: 0, marginBottom: 10 },
  priceSection: { display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 },
  price: { fontSize: 20, fontWeight: 800, color: '#f59e0b' },
  priceUnit: { fontSize: 13, color: '#6b7280' },
  yieldBadge: { display: 'inline-block', padding: '5px 10px', background: '#ecfdf5', color: '#059669', borderRadius: 8, fontSize: 12, fontWeight: 600, marginBottom: 10 },
  tagRow: { display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' },
  tag: { padding: '3px 8px', background: '#f3f4f6', borderRadius: 6, fontSize: 11, fontWeight: 500, color: '#374151' },
  actions: { display: 'flex', gap: 8, marginTop: 'auto' },
  btnEdit: { flex: 1, padding: '10px 14px', background: '#f3f4f6', color: '#374151', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 13, textAlign: 'center', border: '2px solid #e5e7eb' },
  btnWa: { padding: '10px 14px', background: '#dcfce7', borderRadius: 10, textDecoration: 'none', fontSize: 16, textAlign: 'center', border: '2px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  btnDelete: { padding: '10px 12px', background: '#fef2f2', color: '#b91c1c', borderRadius: 10, border: '2px solid #fca5a5', cursor: 'pointer', fontSize: 14 },
};
