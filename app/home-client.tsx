'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getDict, prefixFor, type Locale } from '../lib/i18n';
import SharePopup from '../components/SharePopup';

const WA_NUMBER = '6287873487940';

const AMENITY_ICONS: Record<string, string> = {
  pool: '🏊', garden: '🌿', aircon: '❄️', furnished: '🛋️',
  kitchen: '🍳', wifi: '📶', parking: '🅿️', privateSpace: '🔒',
};

/* ─────────── Types ─────────── */
type AvailBlock = { start_date: string; end_date: string };

type RentalRow = {
  id: string;
  reference?: string | null;
  min_duration_months: number | null;
  max_duration_months: number | null;
  monthly_price_idr: number;
  monthly_price_usd?: number | null;
  yearly_price_idr?: number | null;
  payment_terms?: string | null;
  legal_checked: boolean;
  available_from: string | null;
  available_to?: string | null;
  rental_availability_blocks?: AvailBlock[];
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

type DurationBucket = '' | 'short' | 'monthly' | 'yearly';

type Filters = {
  location: string; minBeds: string; minBaths: string; maxPrice: string;
  duration: DurationBucket;
  pool: boolean; garden: boolean; aircon: boolean;
  furnished: boolean; wifi: boolean; parking: boolean;
  privateSpace: boolean; kitchen: boolean;
  checkIn: string; checkOut: string;
};

// Bucket → target months for filter logic
const DURATION_TARGET: Record<Exclude<DurationBucket, ''>, number> = {
  short: 1,
  monthly: 6,
  yearly: 12,
};

type SortBy = 'recent' | 'price_asc' | 'price_desc';

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

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.7s cubic-bezier(0.2,0.8,0.2,1) ${delay}ms, transform 0.7s cubic-bezier(0.2,0.8,0.2,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─────────── Rental card v2 ─────────── */
function RentalCard({ rental, locale }: { rental: RentalRow; locale: Locale }) {
  const t = getDict(locale);
  const images = rental.properties?.images ?? [];
  const [idx, setIdx] = useState(0);
  const [hover, setHover] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const p = rental.properties;
  const touchStartX = useRef<number | null>(null);

  const sharePath = prefixFor(locale, `/rentals/${p?.id}`);
  const shareUrl = typeof window !== 'undefined' ? new URL(sharePath, window.location.origin).toString() : sharePath;

  const prev = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setIdx(i => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setIdx(i => (i + 1) % images.length);
  }, [images.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null || images.length < 2) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    if (delta > 0) setIdx(i => (i - 1 + images.length) % images.length);
    else setIdx(i => (i + 1) % images.length);
  };

  const onShare = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setShareOpen(true);
  };

  const chipDict: Record<string, string> = {
    pool: t.home.chip.pool, garden: t.home.chip.garden, aircon: t.home.chip.aircon,
    furnished: t.home.chip.furnished, kitchen: t.home.chip.kitchen, wifi: t.home.chip.wifi,
    parking: t.home.chip.parking, privateSpace: t.home.chip.privateSpace,
  };

  const amenityKeys = ([
    p?.pool && 'pool', p?.garden && 'garden', p?.aircon && 'aircon',
    p?.furnished && 'furnished', p?.kitchen && 'kitchen',
    p?.wifi && 'wifi', p?.parking && 'parking', p?.private_space && 'privateSpace',
  ] as (string | false)[]).filter(Boolean) as string[];

  const waMsg = encodeURIComponent(`Hi, I'm interested in ${p?.title ?? 'your property'}`);
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${waMsg}`;

  return (
    <div className="lc2-card">
      {/* Media section — Link wraps only images; controls are siblings, not nested in <a> */}
      <div
        className="lc2-media listing-media"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Link
          href={prefixFor(locale, `/rentals/${p?.id}`)}
          className="lc2-media-link"
          aria-label={p?.title ?? 'View property'}
        >
          {images.length > 0 ? images.map((src, i) => {
            const prev = (idx - 1 + images.length) % images.length;
            const next = (idx + 1) % images.length;
            if (i !== idx && i !== prev && i !== next) return null;
            return (
              <Image
                key={src}
                src={src}
                alt={p?.title ?? ''}
                fill
                sizes="(max-width: 640px) 100vw, 460px"
                loading={i === idx ? 'eager' : 'lazy'}
                className="listing-img"
                style={{
                  opacity: i === idx ? 1 : 0,
                  transform: i === idx && hover ? 'scale(1.04)' : 'scale(1)',
                }}
              />
            );
          }) : (
            <div className="listing-img-placeholder">Rumah<em>Ya</em></div>
          )}
        </Link>

        {images.length > 1 && (
          <>
            <button type="button" onClick={prev} className="listing-arrow listing-arrow-left" aria-label="Previous">‹</button>
            <button type="button" onClick={next} className="listing-arrow listing-arrow-right" aria-label="Next">›</button>
            <div className="listing-dots">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Photo ${i + 1}`}
                  onClick={e => { e.preventDefault(); e.stopPropagation(); setIdx(i); }}
                  className={`listing-dot ${i === idx ? 'is-active' : ''}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Body */}
      <div className="lc2-body">
        <p className="lc2-location">
          <svg className="lc2-pin" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5zm0 6.5C5.17 6.5 4.5 5.83 4.5 5S5.17 3.5 6 3.5 7.5 4.17 7.5 5 6.83 6.5 6 6.5z" fill="currentColor" />
          </svg>
          {p?.location ?? 'Lombok'}
        </p>

        <h3 className="lc2-title">{p?.title ?? 'Property'}</h3>

        <div className="lc2-meta">
          {p?.bedrooms != null && p.bedrooms > 0 && (
            <span className="lc2-meta-item">🛏 {p.bedrooms} {p.bedrooms === 1 ? t.home.bed : t.home.beds}</span>
          )}
          {p?.bathrooms != null && p.bathrooms > 0 && (
            <span className="lc2-meta-item">🚿 {p.bathrooms} {p.bathrooms === 1 ? t.home.bath : t.home.baths}</span>
          )}
        </div>

        {amenityKeys.length > 0 && (
          <div className="lc2-amenities">
            {amenityKeys.slice(0, 4).map(key => (
              <span key={key} className="lc2-pill">
                {AMENITY_ICONS[key]} {chipDict[key]}
              </span>
            ))}
          </div>
        )}

        <div className="lc2-price-block">
          {rental.monthly_price_idr > 0 && (
            <p className="lc2-price">
              <span>IDR {fmtIDR(rental.monthly_price_idr)}</span>
              <em> / {t.home.perMonth}</em>
            </p>
          )}
          {rental.yearly_price_idr ? (
            <p className="lc2-price-year">IDR {fmtIDR(rental.yearly_price_idr)} {t.home.perYear}</p>
          ) : null}
          {((rental.min_duration_months ?? 0) > 0 || (rental.max_duration_months ?? 0) > 0) && (
            <p className="lc2-duration">
              {(rental.min_duration_months ?? 0) > 0 && (rental.max_duration_months ?? 0) > 0
                ? `${rental.min_duration_months}–${rental.max_duration_months}`
                : (rental.min_duration_months ?? 0) > 0
                  ? `${rental.min_duration_months}+`
                  : `≤ ${rental.max_duration_months}`} {t.home.months}
            </p>
          )}
        </div>

        {rental.reference && (
          <p className="lc2-ref">{rental.reference}</p>
        )}

        <div className="lc2-ctas">
          <button type="button" onClick={onShare} className="lc2-btn-detail" aria-label="Share">
            🔗 Share
          </button>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="lc2-btn-wa"
          >
            💬 WhatsApp
          </a>
        </div>
      </div>
      <SharePopup url={shareUrl} title={p?.title ?? 'RumahYa property'} open={shareOpen} onClose={() => setShareOpen(false)} />
    </div>
  );
}

/* ─────────── Page ─────────── */
export default function HomeClient({ locale = 'en' }: { locale?: Locale }) {
  const t = getDict(locale);
  const [rentals, setRentals] = useState<RentalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [filters, setFilters] = useState<Filters>({
    location: '', minBeds: '', minBaths: '', maxPrice: '', duration: '',
    pool: false, garden: false, aircon: false,
    furnished: false, wifi: false, parking: false,
    privateSpace: false, kitchen: false,
    checkIn: '', checkOut: '',
  });

  useEffect(() => {
    supabase.from('long_term_rentals')
      .select(`id, reference, min_duration_months, max_duration_months, monthly_price_idr, yearly_price_idr, legal_checked, available_from, available_to,
        rental_availability_blocks (start_date, end_date),
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
    if (filters.duration) {
      const target = DURATION_TARGET[filters.duration];
      const minD = r.min_duration_months ?? 0;
      const maxD = r.max_duration_months ?? Infinity;
      if (minD > target || maxD < target) return false;
    }
    if (filters.pool && !p.pool) return false;
    if (filters.garden && !p.garden) return false;
    if (filters.aircon && !p.aircon) return false;
    if (filters.furnished && !p.furnished) return false;
    if (filters.wifi && !p.wifi) return false;
    if (filters.parking && !p.parking) return false;
    if (filters.privateSpace && !p.private_space) return false;
    if (filters.kitchen && !p.kitchen) return false;
    // Date availability filter
    if (filters.checkIn && filters.checkOut) {
      const ci = filters.checkIn;
      const co = filters.checkOut;
      // Exclude if the overall availability window doesn't cover the period
      if (r.available_from && r.available_from > ci) return false;
      if (r.available_to && r.available_to < co) return false;
      // Exclude if any blocked period overlaps the requested dates
      const hasBlock = (r.rental_availability_blocks ?? []).some(
        b => b.start_date <= co && b.end_date >= ci
      );
      if (hasBlock) return false;
    }
    return true;
  });

  /* Sort */
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price_asc') return a.monthly_price_idr - b.monthly_price_idr;
    if (sortBy === 'price_desc') return b.monthly_price_idr - a.monthly_price_idr;
    return 0;
  });

  const hasSearchBarFilter = !!filters.location || !!filters.duration || !!filters.checkIn || !!filters.checkOut;

  /* Active chips */
  const chipLabels: Record<string, string> = {
    pool: t.home.chip.pool, garden: t.home.chip.garden, aircon: t.home.chip.aircon,
    furnished: t.home.chip.furnished, kitchen: t.home.chip.kitchen, wifi: t.home.chip.wifi,
    parking: t.home.chip.parking, privateSpace: t.home.chip.privateSpace,
  };

  const activeChips: { key: string; label: string; dismiss: () => void }[] = [];
  if (filters.location) activeChips.push({ key: 'location', label: filters.location, dismiss: () => setFilters(f => ({ ...f, location: '' })) });
  if (filters.minBeds) activeChips.push({ key: 'minBeds', label: `${filters.minBeds}+ ${t.home.beds}`, dismiss: () => setFilters(f => ({ ...f, minBeds: '' })) });
  if (filters.minBaths) activeChips.push({ key: 'minBaths', label: `${filters.minBaths}+ ${t.home.baths}`, dismiss: () => setFilters(f => ({ ...f, minBaths: '' })) });
  if (filters.maxPrice) activeChips.push({ key: 'maxPrice', label: `≤ IDR ${fmtIDR(Number(filters.maxPrice))}`, dismiss: () => setFilters(f => ({ ...f, maxPrice: '' })) });
  if (filters.duration) {
    const lbl = filters.duration === 'short' ? t.home.durationShort : filters.duration === 'monthly' ? t.home.durationMonthly : t.home.durationYearly;
    activeChips.push({ key: 'duration', label: lbl, dismiss: () => setFilters(f => ({ ...f, duration: '' })) });
  }
  if (filters.checkIn) activeChips.push({ key: 'checkIn', label: `From ${filters.checkIn}`, dismiss: () => setFilters(f => ({ ...f, checkIn: '', checkOut: '' })) });
  if (filters.checkOut) activeChips.push({ key: 'checkOut', label: `Until ${filters.checkOut}`, dismiss: () => setFilters(f => ({ ...f, checkIn: '', checkOut: '' })) });
  (['pool', 'garden', 'aircon', 'furnished', 'kitchen', 'wifi', 'parking', 'privateSpace'] as (keyof Filters)[]).forEach(key => {
    if (filters[key]) activeChips.push({ key, label: chipLabels[key], dismiss: () => setFilters(f => ({ ...f, [key]: false })) });
  });

  const reset = () => setFilters({
    location: '', minBeds: '', minBaths: '', maxPrice: '', duration: '',
    pool: false, garden: false, aircon: false,
    furnished: false, wifi: false, parking: false,
    privateSpace: false, kitchen: false,
    checkIn: '', checkOut: '',
  });
  const hasActive = activeChips.length > 0;

  return (
    <main>
      <section className="page-title">
        <div className="container">
          <Reveal>
            <h1 className="page-title-h">
              {t.home.heroTitleA} <em>{t.home.heroTitleB.replace(/,\s*$/, '')}</em>
            </h1>
          </Reveal>
        </div>
      </section>

      <div className="container">
        {/* Top quick search */}
        <div className="inv-searchbar inv-searchbar--rentals">
          <div className="inv-search-seg">
            <span className="eyebrow inv-search-label">{t.home.location}</span>
            <select
              value={filters.location}
              onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}
            >
              <option value="">{t.home.allAreas}</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="inv-search-div" />
          <div className="inv-search-seg">
            <span className="eyebrow inv-search-label">{t.home.duration}</span>
            <select
              value={filters.duration}
              onChange={e => setFilters(f => ({ ...f, duration: e.target.value as DurationBucket }))}
            >
              <option value="">{t.home.any}</option>
              <option value="short">{t.home.durationShort}</option>
              <option value="monthly">{t.home.durationMonthly}</option>
              <option value="yearly">{t.home.durationYearly}</option>
            </select>
          </div>
          <div className="inv-search-div" />
          <div className="inv-search-seg inv-search-dates">
            <span className="eyebrow inv-search-label">Availability</span>
            <div className="inv-date-range">
              <input
                type="date"
                className="inv-date-input"
                value={filters.checkIn}
                onChange={e => setFilters(f => ({ ...f, checkIn: e.target.value, checkOut: f.checkOut && f.checkOut < e.target.value ? '' : f.checkOut }))}
              />
              <span className="inv-date-sep">→</span>
              <input
                type="date"
                className="inv-date-input"
                value={filters.checkOut}
                min={filters.checkIn || undefined}
                onChange={e => setFilters(f => ({ ...f, checkOut: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* ── Inline filter bars: shown when search bar has active filter ── */}
        {hasSearchBarFilter && (
          <>
            {/* Row 2: amenity chips */}
            <div className="inv-filter-bar inv-filter-bar--rentals">
              {([
                ['pool', t.home.chip.pool, '🏊'],
                ['garden', t.home.chip.garden, '🌿'],
                ['aircon', t.home.chip.aircon, '❄️'],
                ['furnished', t.home.chip.furnished, '🛋️'],
                ['kitchen', t.home.chip.kitchen, '🍳'],
                ['wifi', t.home.chip.wifi, '📶'],
                ['parking', t.home.chip.parking, '🅿️'],
                ['privateSpace', t.home.chip.privateSpace, '🔒'],
              ] as [keyof Filters, string, string][]).map(([key, label, icon]) => (
                <button key={key} type="button"
                  className={`filter-chip ${filters[key] ? 'is-active' : ''}`}
                  onClick={() => setFilters(f => ({ ...f, [key]: !f[key] }))}
                >{icon} {label}</button>
              ))}
            </div>

            {/* Row 3: beds / baths / budget */}
            <div className="inv-filter-bar inv-filter-bar--rentals">
              <div className="inv-filterbar-group">
                <span className="inv-filterbar-label">{t.home.bedrooms}</span>
                <div className="inv-filterbar-chips">
                  {['1', '2', '3'].map(v => (
                    <button key={v} type="button"
                      className={`filter-chip ${filters.minBeds === v ? 'is-active' : ''}`}
                      onClick={() => setFilters(f => ({ ...f, minBeds: f.minBeds === v ? '' : v }))}
                    >{v}+</button>
                  ))}
                </div>
              </div>
              <div className="inv-filter-sep" />
              <div className="inv-filterbar-group">
                <span className="inv-filterbar-label">{t.home.bathrooms}</span>
                <div className="inv-filterbar-chips">
                  {['1', '2', '3'].map(v => (
                    <button key={v} type="button"
                      className={`filter-chip ${filters.minBaths === v ? 'is-active' : ''}`}
                      onClick={() => setFilters(f => ({ ...f, minBaths: f.minBaths === v ? '' : v }))}
                    >{v}+</button>
                  ))}
                </div>
              </div>
              <div className="inv-filter-sep" />
              <div className="inv-filterbar-slider-full">
                <span className="inv-filterbar-label">{t.home.budget}</span>
                <input
                  type="range"
                  className="sidebar-slider"
                  min={1}
                  max={100}
                  step={1}
                  value={filters.maxPrice ? Math.min(100, Math.max(1, Math.round(Number(filters.maxPrice) / 1_000_000))) : 100}
                  onChange={e => setFilters(f => ({ ...f, maxPrice: String(Number(e.target.value) * 1_000_000) }))}
                />
                <span className="inv-filterbar-slider-val">
                  {filters.maxPrice ? `≤ ${Math.round(Number(filters.maxPrice) / 1_000_000)} M IDR` : '≤ 100 M IDR'}
                </span>
              </div>
            </div>
          </>
        )}

        {loading ? (
          <div className="home-loading">
            <div className="home-spinner" />
            <span>{t.home.loading}</span>
          </div>
        ) : (
          <div className="inv-layout">
            {/* ── Results area ── */}
            <div>
              {/* Active filter chips */}
              {activeChips.length > 0 && (
                <div className="active-chips-row">
                  {activeChips.map(chip => (
                    <button key={chip.key} className="active-chip" onClick={chip.dismiss}>
                      {chip.label} <span aria-hidden>×</span>
                    </button>
                  ))}
                  <button className="active-chip active-chip-reset" onClick={reset}>
                    {t.home.resetFilters}
                  </button>
                </div>
              )}

              {/* Result count + sort */}
              <div className="inv-result-row" id="inv-results">
                <p className="inv-result-count">
                  {filtered.length} {filtered.length === 1 ? t.home.resultOne : t.home.resultMany}
                  {hasActive && <span> · {t.home.filtered}</span>}
                </p>
                <div className="sort-row">
                  <span className="sort-label">Sort by</span>
                  <select
                    className="sort-select"
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as SortBy)}
                    aria-label="Sort listings"
                  >
                    <option value="recent">Most recent</option>
                    <option value="price_asc">Price ↑</option>
                    <option value="price_desc">Price ↓</option>
                  </select>
                </div>
              </div>

              {sorted.length === 0 ? (
                <div className="inv-empty">
                  <p>{t.home.empty}</p>
                  <button onClick={reset} className="btn-secondary">{t.home.resetFilters}</button>
                </div>
              ) : (
                <div className="home-grid">
                  {sorted.map((r, i) => (
                    <Reveal key={r.id} delay={Math.min(i * 60, 400)}>
                      <RentalCard rental={r} locale={locale} />
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
