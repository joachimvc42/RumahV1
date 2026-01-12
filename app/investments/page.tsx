'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

type InvestmentItem = {
  id: string;
  type: 'villa' | 'land';
  title: string;
  location: string;
  price: number;
  currency: string;
  tenure: 'freehold' | 'leasehold';
  leaseYears?: number;
  expectedYield: number | null;
  images: string[];
  href: string;
  // Property/land specific fields
  bedrooms?: number | null;
  bathrooms?: number | null;
  pool?: boolean;
  garden?: boolean;
  furnished?: boolean;
  landSize?: number | null; // For lands (land_size)
  builtArea?: number | null; // For properties (built_area)
  landArea?: number | null; // For properties (land_area)
};

type Filters = {
  type: 'all' | 'villa' | 'land';
  tenure: 'all' | 'freehold' | 'leasehold';
  location: string;
  pool: boolean;
  garden: boolean;
  furnished: boolean;
  minBedrooms: string;
  minBathrooms: string;
  yield20Plus: boolean;
  yield30Plus: boolean;
};

function fmtPrice(price: number, currency: string, isLand: boolean) {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
  }
  const formatted = new Intl.NumberFormat('id-ID').format(price);
  return isLand ? `${formatted} IDR/are` : `${formatted} IDR`;
}

export default function InvestmentsPage() {
  const [items, setItems] = useState<InvestmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    type: 'all',
    tenure: 'all',
    location: '',
    pool: false,
    garden: false,
    furnished: false,
    minBedrooms: '',
    minBathrooms: '',
    yield20Plus: false,
    yield30Plus: false,
  });

  useEffect(() => {
    const load = async () => {
      const { data: investments } = await supabase.from('investments').select('*');

      if (!investments) {
        setItems([]);
        setLoading(false);
        return;
      }

      const propertyIds = investments.filter(i => i.asset_type === 'property').map(i => i.asset_id);
      const landIds = investments.filter(i => i.asset_type === 'land').map(i => i.asset_id);

      const [{ data: properties }, { data: lands }] = await Promise.all([
        propertyIds.length
          ? supabase.from('properties').select('*').in('id', propertyIds)
          : Promise.resolve({ data: [] }),
        landIds.length
          ? supabase.from('lands').select('*').in('id', landIds)
          : Promise.resolve({ data: [] }),
      ]);

      const merged: InvestmentItem[] = [];

      for (const inv of investments) {
        if (inv.asset_type === 'property') {
          const prop = properties?.find(p => p.id === inv.asset_id);
          // Only include published properties
          if (prop && prop.status === 'published') {
            merged.push({
              id: inv.id,
              type: 'villa',
              title: prop.title,
              location: prop.location || 'Lombok',
              price: prop.price || 0,
              currency: prop.currency || 'USD',
              tenure: prop.tenure || 'freehold',
              leaseYears: prop.lease_years,
              expectedYield: inv.expected_yield,
              images: prop.images || [],
              href: `/investments/${inv.id}`,
              bedrooms: prop.bedrooms,
              bathrooms: prop.bathrooms,
              pool: prop.pool,
              garden: prop.garden,
              furnished: prop.furnished,
              builtArea: prop.built_area,
              landArea: prop.land_area,
            });
          }
        }

        if (inv.asset_type === 'land') {
          const land = lands?.find(l => l.id === inv.asset_id);
          // Only include published lands
          if (land && land.status === 'published') {
            merged.push({
              id: inv.id,
              type: 'land',
              title: land.title,
              location: land.location || 'Lombok',
              price: land.price_per_are || 0,
              currency: land.currency || 'IDR',
              tenure: land.tenure || 'freehold',
              leaseYears: land.lease_years,
              expectedYield: inv.expected_yield,
              images: land.images || [],
              href: `/investments/${inv.id}`,
              landSize: land.land_size,
            });
          }
        }
      }

      setItems(merged);
      setLoading(false);
    };

    load();
  }, []);

  // Filter items
  const filtered = items.filter(item => {
    if (filters.type !== 'all' && item.type !== filters.type) return false;
    if (filters.tenure !== 'all' && item.tenure !== filters.tenure) return false;
    if (filters.location && !item.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.pool && !item.pool) return false;
    if (filters.garden && !item.garden) return false;
    if (filters.furnished && !item.furnished) return false;
    if (filters.minBedrooms && (item.bedrooms || 0) < Number(filters.minBedrooms)) return false;
    if (filters.minBathrooms && (item.bathrooms || 0) < Number(filters.minBathrooms)) return false;
    if (filters.yield20Plus && (!item.expectedYield || item.expectedYield < 20)) return false;
    if (filters.yield30Plus && (!item.expectedYield || item.expectedYield < 30)) return false;
    return true;
  });

  // Get unique locations
  const locations = [...new Set(items.map(i => i.location))];

  if (loading) {
    return (
      <main style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.spinner} />
          <p>Loading opportunities...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.container}>
      {/* Hero */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Invest in Lombok</h1>
        <p style={styles.heroSubtitle}>
          Selected villas and land for investment
        </p>
      </section>

      <div style={styles.layout}>
        {/* Sidebar Filters */}
        <aside style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}>Filters</h3>
          
          <div style={styles.sidebarSection}>
            <h4 style={styles.sidebarSectionTitle}>Amenities</h4>
            <label style={styles.sidebarCheckbox}>
              <input
                type="checkbox"
                checked={filters.pool}
                onChange={e => setFilters({ ...filters, pool: e.target.checked })}
              />
              <span>Pool</span>
            </label>
            <label style={styles.sidebarCheckbox}>
              <input
                type="checkbox"
                checked={filters.garden}
                onChange={e => setFilters({ ...filters, garden: e.target.checked })}
              />
              <span>Garden</span>
            </label>
            <label style={styles.sidebarCheckbox}>
              <input
                type="checkbox"
                checked={filters.furnished}
                onChange={e => setFilters({ ...filters, furnished: e.target.checked })}
              />
              <span>Furnished</span>
            </label>
          </div>

          <div style={styles.sidebarSection}>
            <h4 style={styles.sidebarSectionTitle}>Property Details</h4>
            <label style={styles.sidebarCheckbox}>
              <input
                type="checkbox"
                checked={filters.minBedrooms === '1'}
                onChange={e => setFilters({ ...filters, minBedrooms: e.target.checked ? '1' : '' })}
              />
              <span>1+ bedrooms</span>
            </label>
            <label style={styles.sidebarCheckbox}>
              <input
                type="checkbox"
                checked={filters.minBedrooms === '2'}
                onChange={e => setFilters({ ...filters, minBedrooms: e.target.checked ? '2' : '' })}
              />
              <span>2+ bedrooms</span>
            </label>
            <label style={styles.sidebarCheckbox}>
              <input
                type="checkbox"
                checked={filters.minBedrooms === '3'}
                onChange={e => setFilters({ ...filters, minBedrooms: e.target.checked ? '3' : '' })}
              />
              <span>3+ bedrooms</span>
            </label>
            <label style={styles.sidebarCheckbox}>
              <input
                type="checkbox"
                checked={filters.minBathrooms === '1'}
                onChange={e => setFilters({ ...filters, minBathrooms: e.target.checked ? '1' : '' })}
              />
              <span>1+ bathrooms</span>
            </label>
            <label style={styles.sidebarCheckbox}>
              <input
                type="checkbox"
                checked={filters.minBathrooms === '2'}
                onChange={e => setFilters({ ...filters, minBathrooms: e.target.checked ? '2' : '' })}
              />
              <span>2+ bathrooms</span>
            </label>
          </div>

          <div style={styles.sidebarSection}>
            <h4 style={styles.sidebarSectionTitle}>Yield</h4>
            <label style={styles.sidebarCheckbox}>
              <input
                type="checkbox"
                checked={filters.yield20Plus}
                onChange={e => setFilters({ ...filters, yield20Plus: e.target.checked })}
              />
              <span>20% or more</span>
            </label>
            <label style={styles.sidebarCheckbox}>
              <input
                type="checkbox"
                checked={filters.yield30Plus}
                onChange={e => setFilters({ ...filters, yield30Plus: e.target.checked })}
              />
              <span>30% or more</span>
            </label>
          </div>
        </aside>

        {/* Main Content */}
        <div style={styles.mainContent}>
          {/* Search Bar */}
          <section style={styles.filters}>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Asset type</label>
              <select
                style={styles.filterSelect}
                value={filters.type}
                onChange={e => setFilters({ ...filters, type: e.target.value as any })}
              >
                <option value="all">All</option>
                <option value="villa">🏠 Villas</option>
                <option value="land">🌴 Land</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Property type</label>
              <select
                style={styles.filterSelect}
                value={filters.tenure}
                onChange={e => setFilters({ ...filters, tenure: e.target.value as any })}
              >
                <option value="all">All</option>
                <option value="freehold">🔑 Freehold</option>
                <option value="leasehold">📋 Leasehold</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Location</label>
              <select
                style={styles.filterSelect}
                value={filters.location}
                onChange={e => setFilters({ ...filters, location: e.target.value })}
              >
                <option value="">All areas</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <button style={styles.searchBtn} type="button">
              🔍 Search
            </button>
          </section>

      {/* Results count */}
      <p style={styles.resultCount}>
        {filtered.length} opportunit{filtered.length !== 1 ? 'ies' : 'y'} available
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={styles.empty}>
          <p>No opportunities match your criteria</p>
          <button
            onClick={() => setFilters({ 
              type: 'all', 
              tenure: 'all', 
              location: '', 
              pool: false,
              garden: false,
              furnished: false,
              minBedrooms: '',
              minBathrooms: '',
              yield20Plus: false,
              yield30Plus: false,
            })}
            style={styles.resetBtn}
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {filtered.map(item => (
            <Link key={item.id} href={item.href} style={styles.card}>
              {/* Image */}
              <div style={styles.imageContainer}>
                {item.images[0] ? (
                  <img src={item.images[0]} alt={item.title} style={styles.image} />
                ) : (
                  <div style={styles.noImage}>
                    <span style={{ fontSize: 40 }}>{item.type === 'villa' ? '🏠' : '🌴'}</span>
                  </div>
                )}

                {/* Type badge */}
                <div style={{
                  ...styles.typeBadge,
                  background: item.type === 'villa' ? '#8b5cf6' : '#059669',
                }}>
                  {item.type === 'villa' ? 'Villa' : 'Land'}
                </div>

                {/* Tenure badge */}
                <div style={{
                  ...styles.tenureBadge,
                  background: item.tenure === 'freehold' ? '#2563eb' : '#f59e0b',
                }}>
                  {item.tenure === 'freehold' ? '🔑 Freehold' : `📋 Lease ${item.leaseYears}y`}
                </div>

                {/* Image count */}
                {item.images.length > 1 && (
                  <div style={styles.imageCount}>📷 {item.images.length}</div>
                )}
              </div>

              {/* Content */}
              <div style={styles.cardContent}>
                <h3 style={styles.cardTitle}>{item.title}</h3>
                <p style={styles.location}>📍 {item.location}</p>

                {/* Price */}
                <div style={styles.priceRow}>
                  <span style={styles.price}>
                    {fmtPrice(item.price, item.currency, item.type === 'land')}
                  </span>
                </div>

                {/* Yield */}
                {item.expectedYield && (
                  <div style={styles.yieldBadge}>
                    📈 {item.expectedYield}% estimated yield
                  </div>
                )}
              </div>
              </Link>
            ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: 1400,
    margin: '0 auto',
    padding: '0 24px 60px',
  },
  layout: {
    display: 'flex',
    gap: 24,
    alignItems: 'flex-start',
  },
  sidebar: {
    width: 240,
    padding: 20,
    background: '#fffbeb',
    borderRadius: 16,
    border: '1px solid #fde68a',
    position: 'sticky',
    top: 20,
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#111827',
    margin: 0,
    marginBottom: 20,
  },
  sidebarSection: {
    marginBottom: 24,
  },
  sidebarSectionTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#92400e',
    margin: 0,
    marginBottom: 12,
  },
  sidebarCheckbox: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 0',
    cursor: 'pointer',
    fontSize: 14,
    color: '#374151',
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
    borderTopColor: '#f59e0b',
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
    background: '#fffbeb',
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'flex-end',
    border: '1px solid #fde68a',
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
    color: '#92400e',
  },
  filterSelect: {
    padding: '12px 14px',
    borderRadius: 10,
    border: '2px solid #fde68a',
    fontSize: 14,
    background: '#fff',
    cursor: 'pointer',
  },
  searchBtn: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #2563eb, #059669)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
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
    background: '#f59e0b',
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
  priceRow: {
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: 800,
    color: '#f59e0b',
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
  badges: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    padding: '4px 10px',
    background: '#f3f4f6',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
    color: '#374151',
  },
};
