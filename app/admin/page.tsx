'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

type RentalRow = {
  id: string;
  min_duration_months: number;
  max_duration_months: number;
  monthly_price_idr: number;
  upfront_months: number;
  legal_checked: boolean;
  available_from: string | null;
  created_at: string;
  properties: {
    id: string;
    title: string;
    location: string | null;
    bedrooms: number | null;
    bathrooms: number | null;
    pool: boolean;
    garden: boolean;
    images: string[] | null;
  } | null;
};

function fmtIDR(v: number) {
  return new Intl.NumberFormat('id-ID').format(v) + ' IDR';
}

export default function AdminHomePage() {
  const [rentals, setRentals] = useState<RentalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('long_term_rentals')
        .select(`
          id,
          min_duration_months,
          max_duration_months,
          monthly_price_idr,
          upfront_months,
          legal_checked,
          available_from,
          created_at,
          properties (
            id,
            title,
            location,
            bedrooms,
            bathrooms,
            pool,
            garden,
            images
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        setError('Failed to load rentals');
      } else {
        setRentals((data as unknown as RentalRow[]) || []);
      }
      setLoading(false);
    };

    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this rental property? This action is irreversible.')) return;
    
    setDeleting(id);
    setError(null);
    
    const { error } = await supabase.from('long_term_rentals').delete().eq('id', id);
    
    if (error) {
      setError(`Failed to delete property: ${error.message}`);
      setDeleting(null);
    } else {
      setRentals(prev => prev.filter(r => r.id !== id));
      setDeleting(null);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading properties...</div>;
  }

  return (
    <main style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Rental properties</h1>
          <p style={styles.subtitle}>{rentals.length} propert{rentals.length !== 1 ? 'ies' : 'y'} registered</p>
        </div>
        <Link href="/admin/rentals/new" style={styles.btnAdd}>
          + Add property
        </Link>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {/* Grid */}
      {rentals.length === 0 ? (
        <div style={styles.empty}>
          <span style={{ fontSize: 48 }}>🏠</span>
          <p>No rental properties yet</p>
          <Link href="/admin/rentals/new" style={styles.btnAdd}>
            Create my first property
          </Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {rentals.map(rental => (
            <div key={rental.id} style={styles.card}>
              {/* Image */}
              <div style={styles.imageContainer}>
                {rental.properties?.images?.[0] ? (
                  <img
                    src={rental.properties.images[0]}
                    alt={rental.properties?.title || 'Property'}
                    style={styles.image}
                  />
                ) : (
                  <div style={styles.noImage}>
                    <span style={{ fontSize: 32 }}>📷</span>
                    <span>No image</span>
                  </div>
                )}
                
                {/* Status badge */}
                <div style={{
                  ...styles.badge,
                  background: rental.legal_checked ? '#059669' : '#f59e0b',
                }}>
                  {rental.legal_checked ? '✓ Verified' : '⏳ Pending'}
                </div>

                {/* Image count */}
                {(rental.properties?.images?.length || 0) > 1 && (
                  <div style={styles.imageCount}>
                    📷 {rental.properties?.images?.length}
                  </div>
                )}
              </div>

              {/* Content */}
              <div style={styles.cardContent}>
                <h3 style={styles.cardTitle}>{rental.properties?.title || 'Untitled'}</h3>
                <p style={styles.location}>📍 {rental.properties?.location || '—'}</p>

                {/* Features */}
                <div style={styles.features}>
                  {rental.properties?.bedrooms && (
                    <span style={styles.feature}>🛏️ {rental.properties.bedrooms}</span>
                  )}
                  {rental.properties?.bathrooms && (
                    <span style={styles.feature}>🚿 {rental.properties.bathrooms}</span>
                  )}
                  {rental.properties?.pool && (
                    <span style={styles.feature}>🏊</span>
                  )}
                  {rental.properties?.garden && (
                    <span style={styles.feature}>🌳</span>
                  )}
                </div>

                {/* Price */}
                <div style={styles.priceSection}>
                  <span style={styles.price}>{fmtIDR(rental.monthly_price_idr)}</span>
                  <span style={styles.perMonth}>/month</span>
                </div>

                {/* Duration */}
                <p style={styles.duration}>
                  {rental.min_duration_months}–{rental.max_duration_months} months
                  {rental.upfront_months > 0 && ` • ${rental.upfront_months} months upfront`}
                </p>

                {/* Actions */}
                <div style={styles.actions}>
                  <Link href={`/admin/rentals/${rental.id}`} style={styles.btnEdit}>
                    ✏️ Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(rental.id)}
                    disabled={deleting === rental.id}
                    style={styles.btnDelete}
                  >
                    {deleting === rental.id ? '...' : '🗑️'}
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
    background: 'linear-gradient(135deg, #2563eb, #059669)',
    color: '#fff',
    borderRadius: 12,
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: 15,
    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
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
    transition: 'transform 0.2s, box-shadow 0.2s',
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
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    padding: '6px 12px',
    borderRadius: 20,
    color: '#fff',
    fontSize: 12,
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
  features: {
    display: 'flex',
    gap: 12,
    marginBottom: 16,
  },
  feature: {
    fontSize: 14,
    color: '#374151',
  },
  priceSection: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: 800,
    color: '#059669',
  },
  perMonth: {
    fontSize: 14,
    color: '#6b7280',
  },
  duration: {
    color: '#6b7280',
    fontSize: 13,
    margin: 0,
    marginBottom: 16,
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
