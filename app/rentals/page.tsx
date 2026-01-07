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
  properties: {
    id: string;
    title: string;
    location: string | null;
    bedrooms: number | null;
    bathrooms: number | null;
    pool: boolean;
    garden: boolean;
    furnished: boolean;
    aircon: boolean;
    wifi: boolean;
    images: string[] | null;
  } | null;
};

type Filters = {
  location: string;
  minBeds: string;
  maxPrice: string;
  pool: boolean;
};

function fmtIDR(v: number) {
  return new Intl.NumberFormat('id-ID').format(v);
}

export default function RentalsPage() {
  const [rentals, setRentals] = useState<RentalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    location: '',
    minBeds: '',
    maxPrice: '',
    pool: false,
  });

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('long_term_rentals')
        .select(`
          id,
          min_duration_months,
          max_duration_months,
          monthly_price_idr,
          upfront_months,
          legal_checked,
          available_from,
          properties (
            id,
            title,
            location,
            bedrooms,
            bathrooms,
            pool,
            garden,
            furnished,
            aircon,
            wifi,
            images
          )
        `)
        .order('created_at', { ascending: false });

      setRentals((data as unknown as RentalRow[]) || []);
      setLoading(false);
    };

    load();
  }, []);

  // Filter rentals
  const filtered = rentals.filter(r => {
    if (filters.location && !r.properties?.location?.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    if (filters.minBeds && (r.properties?.bedrooms || 0) < Number(filters.minBeds)) {
      return false;
    }
    if (filters.maxPrice && r.monthly_price_idr > Number(filters.maxPrice)) {
      return false;
    }
    if (filters.pool && !r.properties?.pool) {
      return false;
    }
    return true;
  });

  // Get unique locations for filter dropdown
  const locations = [...new Set(rentals.map(r => r.properties?.location).filter(Boolean))];

  if (loading) {
    return (
      <main style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.spinner} />
          <p>Chargement des biens...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Locations longue durée à Lombok</h1>
        <p style={styles.heroSubtitle}>
          Villas et maisons sélectionnées pour les expatriés
        </p>
      </section>

      {/* Filters */}
      <section style={styles.filters}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Localisation</label>
          <select
            style={styles.filterSelect}
            value={filters.location}
            onChange={e => setFilters({ ...filters, location: e.target.value })}
          >
            <option value="">Toutes les zones</option>
            {locations.map(loc => (
              <option key={loc} value={loc!}>{loc}</option>
            ))}
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Chambres min</label>
          <select
            style={styles.filterSelect}
            value={filters.minBeds}
            onChange={e => setFilters({ ...filters, minBeds: e.target.value })}
          >
            <option value="">Tous</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Budget max (IDR/mois)</label>
          <select
            style={styles.filterSelect}
            value={filters.maxPrice}
            onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}
          >
            <option value="">Tous budgets</option>
            <option value="15000000">15 Mio</option>
            <option value="25000000">25 Mio</option>
            <option value="35000000">35 Mio</option>
            <option value="50000000">50 Mio</option>
            <option value="75000000">75 Mio</option>
          </select>
        </div>

        <label style={styles.filterCheckbox}>
          <input
            type="checkbox"
            checked={filters.pool}
            onChange={e => setFilters({ ...filters, pool: e.target.checked })}
          />
          <span>🏊 Piscine</span>
        </label>
      </section>

      {/* Results count */}
      <p style={styles.resultCount}>
        {filtered.length} bien{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Property Grid */}
      {filtered.length === 0 ? (
        <div style={styles.empty}>
          <span style={{ fontSize: 48 }}>🏠</span>
          <p>Aucun bien ne correspond à vos critères</p>
          <button
            onClick={() => setFilters({ location: '', minBeds: '', maxPrice: '', pool: false })}
            style={styles.resetBtn}
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {filtered.map(rental => (
            <Link
              key={rental.id}
              href={`/rentals/${rental.properties?.id}`}
              style={styles.card}
            >
              {/* Image */}
              <div style={styles.imageContainer}>
                {rental.properties?.images?.[0] ? (
                  <img
                    src={rental.properties.images[0]}
                    alt={rental.properties?.title || 'Villa'}
                    style={styles.image}
                  />
                ) : (
                  <div style={styles.noImage}>
                    <span style={{ fontSize: 40 }}>🏠</span>
                  </div>
                )}

                {/* Badges */}
                {rental.legal_checked && (
                  <div style={styles.verifiedBadge}>✓ Vérifié</div>
                )}

                {/* Image count */}
                {(rental.properties?.images?.length || 0) > 1 && (
                  <div style={styles.imageCount}>
                    📷 {rental.properties?.images?.length}
                  </div>
                )}
              </div>

              {/* Content */}
              <div style={styles.cardContent}>
                <h3 style={styles.cardTitle}>{rental.properties?.title || 'Villa'}</h3>
                <p style={styles.location}>📍 {rental.properties?.location || 'Lombok'}</p>

                {/* Features */}
                <div style={styles.features}>
                  {rental.properties?.bedrooms && (
                    <span style={styles.feature}>🛏️ {rental.properties.bedrooms}</span>
                  )}
                  {rental.properties?.bathrooms && (
                    <span style={styles.feature}>🚿 {rental.properties.bathrooms}</span>
                  )}
                  {rental.properties?.pool && <span style={styles.feature}>🏊</span>}
                  {rental.properties?.garden && <span style={styles.feature}>🌳</span>}
                  {rental.properties?.wifi && <span style={styles.feature}>📶</span>}
                  {rental.properties?.aircon && <span style={styles.feature}>❄️</span>}
                </div>

                {/* Price */}
                <div style={styles.priceRow}>
                  <span style={styles.price}>{fmtIDR(rental.monthly_price_idr)}</span>
                  <span style={styles.pricePer}>IDR / mois</span>
                </div>

                {/* Duration */}
                <p style={styles.duration}>
                  {rental.min_duration_months}–{rental.max_duration_months} mois
                  {rental.upfront_months > 0 && ` • ${rental.upfront_months} mois d'avance`}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 24px 60px',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: 16,
    color: '#6b7280',
  },
  spinner: {
    width: 40,
    height: 40,
    border: '4px solid #e5e7eb',
    borderTopColor: '#2563eb',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  hero: {
    textAlign: 'center',
    padding: '60px 0 40px',
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: 800,
    color: '#111827',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#6b7280',
    maxWidth: 500,
    margin: '0 auto',
  },
  filters: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 16,
    padding: 24,
    background: '#f9fafb',
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'flex-end',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    minWidth: 160,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: '#4b5563',
  },
  filterSelect: {
    padding: '12px 14px',
    borderRadius: 10,
    border: '2px solid #e5e7eb',
    fontSize: 14,
    background: '#fff',
    cursor: 'pointer',
  },
  filterCheckbox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 16px',
    background: '#fff',
    borderRadius: 10,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
    border: '2px solid #e5e7eb',
  },
  resultCount: {
    color: '#6b7280',
    marginBottom: 20,
    fontSize: 14,
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
  resetBtn: {
    padding: '12px 24px',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
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
    textDecoration: 'none',
    color: 'inherit',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: '16/10',
    background: '#f3f4f6',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s',
  },
  noImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#9ca3af',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    padding: '6px 12px',
    borderRadius: 20,
    background: '#059669',
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
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  feature: {
    fontSize: 14,
    color: '#374151',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 4,
  },
  price: {
    fontSize: 22,
    fontWeight: 800,
    color: '#059669',
  },
  pricePer: {
    fontSize: 14,
    color: '#6b7280',
  },
  duration: {
    color: '#6b7280',
    fontSize: 13,
    margin: 0,
  },
};
