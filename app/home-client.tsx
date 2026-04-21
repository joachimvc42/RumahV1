'use client';

import Link from 'next/link';
import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

/* ─────────── Types ─────────── */
type RentalRow = {
  id: string;
  min_duration_months: number;
  max_duration_months: number;
  monthly_price_idr: number;
  monthly_price_usd?: number | null;
  yearly_price_idr?: number | null;
  upfront_months: number;
  upfront_amount_idr?: number | null;
  legal_checked: boolean;
  available_from: string | null;
  available_to?: string | null;
  properties: {
    id: string; title: string; location: string | null;
    bedrooms: number | null; bathrooms: number | null;
    pool: boolean; garden: boolean; furnished: boolean;
    aircon: boolean; wifi: boolean; parking: boolean;
    private_space?: boolean; kitchen?: boolean;
    images: string[] | null; status?: string;
    latitude?: number | null; longitude?: number | null;
    description?: string | null;
  } | null;
};

type Filters = {
  location: string; minBeds: string; minBaths: string; maxPrice: string;
  pool: boolean; garden: boolean; aircon: boolean;
  furnished: boolean; wifi: boolean; parking: boolean;
  privateSpace: boolean; kitchen: boolean;
};

/* ─────────── Utilities ─────────── */
function fmtIDR(v: number) { return new Intl.NumberFormat('id-ID').format(v); }

/* Intersection observer fade-in */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, shown };
}

function Reveal({ children, delay = 0, as: Tag = 'div' }: { children: React.ReactNode; delay?: number; as?: 'div' | 'section' | 'article' }) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const Component = Tag as any;
  return (
    <Component
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.8s cubic-bezier(0.2,0.8,0.2,1) ${delay}ms, transform 0.8s cubic-bezier(0.2,0.8,0.2,1) ${delay}ms`,
      }}
    >
      {children}
    </Component>
  );
}

/* ─────────── Rental card ─────────── */
function RentalCard({ rental }: { rental: RentalRow }) {
  const images = rental.properties?.images ?? [];
  const [idx, setIdx] = useState(0);
  const [hover, setHover] = useState(false);

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
    <Link
      href={`/rentals/${p?.id}`}
      className="listing-card"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="listing-media">
        {images.length > 0 ? images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={p?.title ?? ''}
            loading={i === 0 ? 'eager' : 'lazy'}
            className="listing-img"
            style={{ opacity: i === idx ? 1 : 0, transform: i === idx && hover ? 'scale(1.04)' : 'scale(1)' }}
          />
        )) : (
          <div className="listing-img-placeholder">Rumah<em>Ya</em></div>
        )}
        {rental.legal_checked && <span className="listing-verified">Verified</span>}
        {images.length > 1 && (
          <>
            <button onClick={prev} className="listing-arrow listing-arrow-left" aria-label="Previous">‹</button>
            <button onClick={next} className="listing-arrow listing-arrow-right" aria-label="Next">›</button>
            <div className="listing-dots">
              {images.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Photo ${i + 1}`}
                  onClick={e => { e.preventDefault(); e.stopPropagation(); setIdx(i); }}
                  className={`listing-dot ${i === idx ? 'is-active' : ''}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="listing-body">
        <p className="listing-location">{p?.location ?? 'Lombok'}</p>
        <h3 className="listing-title">{p?.title ?? 'Property'}</h3>

        <div className="listing-meta">
          {p?.bedrooms != null && p.bedrooms > 0 && <span>{p.bedrooms} bed{p.bedrooms !== 1 ? 's' : ''}</span>}
          {p?.bathrooms != null && p.bathrooms > 0 && <span>· {p.bathrooms} bath{p.bathrooms !== 1 ? 's' : ''}</span>}
          {p?.pool && <span>· Pool</span>}
          {p?.furnished && <span>· Furnished</span>}
        </div>

        <div className="listing-price-row">
          <div>
            {rental.monthly_price_idr > 0 && (
              <p className="listing-price"><span>{fmtIDR(rental.monthly_price_idr)}</span><em> IDR / month</em></p>
            )}
            {rental.yearly_price_idr ? (
              <p className="listing-price-sub">{fmtIDR(rental.yearly_price_idr)} IDR / year</p>
            ) : null}
          </div>
          <div className="listing-duration">
            {rental.min_duration_months}–{rental.max_duration_months} months
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─────────── Page ─────────── */
export default function HomeClient() {
  const [rentals, setRentals] = useState<RentalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    location: '', minBeds: '', minBaths: '', maxPrice: '',
    pool: false, garden: false, aircon: false,
    furnished: false, wifi: false, parking: false,
    privateSpace: false, kitchen: false,
  });

  useEffect(() => {
    supabase.from('long_term_rentals')
      .select(`id, min_duration_months, max_duration_months, monthly_price_idr, yearly_price_idr, upfront_months, upfront_amount_idr, legal_checked, available_from, available_to,
        properties (id, title, description, location, bedrooms, bathrooms, pool, garden, furnished, aircon, wifi, parking, private_space, kitchen, images, status, latitude, longitude)`)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('Rentals query error:', error.message);
        setRentals((data as unknown as RentalRow[]) || []);
        setLoading(false);
      });
  }, []);

  const published = rentals.filter(r => r.properties?.status === 'published');
  const locations = [...new Set(published.map(r => r.properties?.location).filter(Boolean))] as string[];

  const filtered = published.filter(r => {
    const p = r.properties!;
    if (filters.location && p.location !== filters.location) return false;
    if (filters.minBeds && (p.bedrooms ?? 0) < Number(filters.minBeds)) return false;
    if (filters.minBaths && (p.bathrooms ?? 0) < Number(filters.minBaths)) return false;
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
    location: '', minBeds: '', minBaths: '', maxPrice: '',
    pool: false, garden: false, aircon: false,
    furnished: false, wifi: false, parking: false,
    privateSpace: false, kitchen: false,
  });
  const hasActive = Object.values(filters).some(v => v !== '' && v !== false);

  return (
    <main>
      {/* ── Hero ── */}
      <section className="home-hero">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Long-term rentals · Lombok</p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="home-hero-title">
              Verified villas,<br />honest terms,<br /><em>local coordination.</em>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="home-hero-lead">
              From a six-month stay to a ten-year home. We verify the titles, meet the owners,
              and coordinate every detail on the ground.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Search bar ── */}
      <div className="container">
        <div className="home-searchbar">
          <div className="home-search-seg">
            <span className="eyebrow home-search-label">Location</span>
            <select
              value={filters.location}
              onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}
            >
              <option value="">All areas</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="home-search-div" />
          <div className="home-search-seg">
            <span className="eyebrow home-search-label">Max budget</span>
            <select
              value={filters.maxPrice}
              onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
            >
              <option value="">All budgets</option>
              <option value="15000000">15 M IDR / mo</option>
              <option value="25000000">25 M IDR / mo</option>
              <option value="35000000">35 M IDR / mo</option>
              <option value="50000000">50 M IDR / mo</option>
              <option value="75000000">75 M IDR / mo</option>
            </select>
          </div>
          <div className="home-search-div" />
          <div className="home-search-seg">
            <span className="eyebrow home-search-label">Bedrooms</span>
            <select
              value={filters.minBeds}
              onChange={e => setFilters(f => ({ ...f, minBeds: e.target.value }))}
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>
          <button
            className="home-filters-toggle"
            onClick={() => setFiltersOpen(o => !o)}
            aria-expanded={filtersOpen}
          >
            {filtersOpen ? 'Hide filters' : 'More filters'}
          </button>
        </div>

        {/* Expandable extra filters */}
        {filtersOpen && (
          <div className="home-filters-extra">
            <div className="home-filters-group">
              <p className="eyebrow">Amenities</p>
              <div className="home-chip-row">
                {([
                  ['pool', 'Pool'],
                  ['garden', 'Garden'],
                  ['aircon', 'Air conditioning'],
                  ['furnished', 'Furnished'],
                  ['kitchen', 'Kitchen'],
                  ['wifi', 'WiFi'],
                  ['parking', 'Parking'],
                  ['privateSpace', 'Private space'],
                ] as [keyof Filters, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    className={`home-chip ${filters[key] ? 'is-active' : ''}`}
                    onClick={() => setFilters(f => ({ ...f, [key]: !(f[key] as boolean) }))}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="home-filters-group">
              <p className="eyebrow">Bathrooms</p>
              <div className="home-chip-row">
                {[['1', '1+'], ['2', '2+'], ['3', '3+']].map(([v, l]) => (
                  <button
                    key={v}
                    type="button"
                    className={`home-chip ${filters.minBaths === v ? 'is-active' : ''}`}
                    onClick={() => setFilters(f => ({ ...f, minBaths: f.minBaths === v ? '' : v }))}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Result row */}
        <div className="home-result-row">
          <p className="home-result-count">
            {loading ? 'Loading…' : `${filtered.length} propert${filtered.length !== 1 ? 'ies' : 'y'}`}
            {!loading && hasActive && <span> · filtered</span>}
          </p>
          {hasActive && (
            <button onClick={reset} className="text-link" style={{ fontSize: '0.82rem' }}>Reset filters</button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="home-loading">
            <div className="home-spinner" />
            <span>Loading properties…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="home-empty">
            <p>No properties match your criteria.</p>
            <button onClick={reset} className="btn-secondary">Reset filters</button>
          </div>
        ) : (
          <div className="home-grid">
            {filtered.map((r, i) => (
              <Reveal key={r.id} delay={Math.min(i * 60, 400)}>
                <RentalCard rental={r} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
