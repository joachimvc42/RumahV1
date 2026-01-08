'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

type InvestmentRow = {
  id: string;
  asset_type: 'property' | 'land';
  asset_id: string;
  expected_yield: number | null;
  management_available: boolean;
  legal_checked: boolean;
  created_at: string;
  // Joined data
  title?: string;
  location?: string;
  price?: number;
  currency?: string;
  tenure?: string;
  lease_years?: number;
  images?: string[];
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

      if (invErr || !invs) {
        setError('Failed to load investments');
        setLoading(false);
        return;
      }

      // Get asset details
      const propertyIds = invs.filter(i => i.asset_type === 'property').map(i => i.asset_id);
      const landIds = invs.filter(i => i.asset_type === 'land').map(i => i.asset_id);

      const [{ data: properties }, { data: lands }] = await Promise.all([
        propertyIds.length
          ? supabase.from('properties').select('id,title,location,price,currency,tenure,lease_years,images').in('id', propertyIds)
          : Promise.resolve({ data: [] }),
        landIds.length
          ? supabase.from('lands').select('id,title,location,price_per_are,currency,tenure,lease_years,images').in('id', landIds)
          : Promise.resolve({ data: [] }),
      ]);

      const enriched: InvestmentRow[] = invs.map(inv => {
        if (inv.asset_type === 'property') {
          const prop = properties?.find(p => p.id === inv.asset_id);
          return {
            ...inv,
            title: prop?.title,
            location: prop?.location,
            price: prop?.price,
            currency: prop?.currency || 'USD',
            tenure: prop?.tenure,
            lease_years: prop?.lease_years,
            images: prop?.images,
          };
        } else {
          const land = lands?.find(l => l.id === inv.asset_id);
          return {
            ...inv,
            title: land?.title,
            location: land?.location,
            price: land?.price_per_are,
            currency: land?.currency || 'IDR',
            tenure: land?.tenure,
            lease_years: land?.lease_years,
            images: land?.images,
          };
        }
      });

      setInvestments(enriched);
      setLoading(false);
    };

    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet investissement ?')) return;
    
    setDeleting(id);
    await supabase.from('investments').delete().eq('id', id);
    setInvestments(prev => prev.filter(i => i.id !== id));
    setDeleting(null);
  };

  if (loading) {
    return <div style={styles.loading}>Chargement des investissements...</div>;
  }

  return (
    <main style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Investissements</h1>
          <p style={styles.subtitle}>{investments.length} opportunité(s) enregistrée(s)</p>
        </div>
        <Link href="/admin/investments/new" style={styles.btnAdd}>
          + Ajouter un investissement
        </Link>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {/* Grid */}
      {investments.length === 0 ? (
        <div style={styles.empty}>
          <span style={{ fontSize: 48 }}>💰</span>
          <p>Aucun investissement pour le moment</p>
          <Link href="/admin/investments/new" style={styles.btnAdd}>
            Créer mon premier investissement
          </Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {investments.map(inv => (
            <div key={inv.id} style={styles.card}>
              {/* Image */}
              <div style={styles.imageContainer}>
                {inv.images?.[0] ? (
                  <img
                    src={inv.images[0]}
                    alt={inv.title || 'Investment'}
                    style={styles.image}
                  />
                ) : (
                  <div style={styles.noImage}>
                    <span style={{ fontSize: 32 }}>{inv.asset_type === 'property' ? '🏠' : '🌴'}</span>
                    <span>Pas d'image</span>
                  </div>
                )}
                
                {/* Type badge */}
                <div style={{
                  ...styles.typeBadge,
                  background: inv.asset_type === 'property' ? '#8b5cf6' : '#059669',
                }}>
                  {inv.asset_type === 'property' ? 'Villa' : 'Terrain'}
                </div>

                {/* Tenure badge */}
                <div style={{
                  ...styles.tenureBadge,
                  background: inv.tenure === 'freehold' ? '#2563eb' : '#f59e0b',
                }}>
                  {inv.tenure === 'freehold' ? '🔑 Freehold' : `📋 Lease ${inv.lease_years}y`}
                </div>

                {/* Image count */}
                {(inv.images?.length || 0) > 1 && (
                  <div style={styles.imageCount}>
                    📷 {inv.images?.length}
                  </div>
                )}
              </div>

              {/* Content */}
              <div style={styles.cardContent}>
                <h3 style={styles.cardTitle}>{inv.title || 'Sans titre'}</h3>
                <p style={styles.location}>📍 {inv.location || '—'}</p>

                {/* Price */}
                <div style={styles.priceSection}>
                  <span style={styles.price}>
                    {inv.price ? fmtPrice(inv.price, inv.currency || 'USD') : '—'}
                  </span>
                  {inv.asset_type === 'land' && <span style={styles.priceUnit}>/are</span>}
                </div>

                {/* Yield */}
                {inv.expected_yield && (
                  <div style={styles.yieldBadge}>
                    📈 {inv.expected_yield}% rendement estimé
                  </div>
                )}

                {/* Status */}
                <div style={styles.statusRow}>
                  {inv.legal_checked && <span style={styles.statusBadge}>✅ Verified</span>}
                  {inv.management_available && <span style={styles.statusBadge}>🏢 Gestion</span>}
                </div>

                {/* Actions */}
                <div style={styles.actions}>
                  <Link href={`/admin/investments/${inv.id}`} style={styles.btnEdit}>
                    ✏️ Modifier
                  </Link>
                  <button
                    onClick={() => handleDelete(inv.id)}
                    disabled={deleting === inv.id}
                    style={styles.btnDelete}
                  >
                    {deleting === inv.id ? '...' : '🗑️'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: 24,
    maxWidth: 1200,
    margin: '0 auto',
  },
  loading: {
    padding: 40,
    textAlign: 'center',
    color: '#6b7280',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    color: '#111827',
    margin: 0,
  },
  subtitle: {
    color: '#6b7280',
    marginTop: 4,
    fontSize: 14,
  },
  btnAdd: {
    padding: '14px 24px',
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    color: '#fff',
    borderRadius: 12,
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: 15,
    boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)',
  },
  error: {
    background: '#fef2f2',
    border: '1px solid #fca5a5',
    color: '#b91c1c',
    padding: '12px 16px',
    borderRadius: 8,
    marginBottom: 20,
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    padding: 60,
    background: '#f9fafb',
    borderRadius: 16,
    color: '#6b7280',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: 24,
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb',
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: '16/10',
    background: '#f3f4f6',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  noImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    color: '#9ca3af',
    fontSize: 14,
  },
  typeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    padding: '6px 12px',
    borderRadius: 20,
    color: '#fff',
    fontSize: 12,
    fontWeight: 700,
  },
  tenureBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: '6px 12px',
    borderRadius: 20,
    color: '#fff',
    fontSize: 11,
    fontWeight: 700,
  },
  imageCount: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    padding: '6px 10px',
    borderRadius: 8,
    background: 'rgba(0,0,0,0.6)',
    color: '#fff',
    fontSize: 12,
    fontWeight: 600,
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#111827',
    margin: 0,
    marginBottom: 4,
  },
  location: {
    color: '#6b7280',
    fontSize: 14,
    margin: 0,
    marginBottom: 12,
  },
  priceSection: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: 800,
    color: '#f59e0b',
  },
  priceUnit: {
    fontSize: 14,
    color: '#6b7280',
  },
  yieldBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    background: '#ecfdf5',
    color: '#059669',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 12,
  },
  statusRow: {
    display: 'flex',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  statusBadge: {
    padding: '4px 10px',
    background: '#f3f4f6',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
    color: '#374151',
  },
  actions: {
    display: 'flex',
    gap: 8,
  },
  btnEdit: {
    flex: 1,
    padding: '10px 16px',
    background: '#f3f4f6',
    color: '#374151',
    borderRadius: 10,
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: 14,
    textAlign: 'center',
    border: '2px solid #e5e7eb',
  },
  btnDelete: {
    padding: '10px 14px',
    background: '#fef2f2',
    color: '#b91c1c',
    borderRadius: 10,
    border: '2px solid #fca5a5',
    cursor: 'pointer',
    fontSize: 14,
  },
};
