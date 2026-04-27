'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../../lib/supabaseClient';
import { dualPrice } from '../../lib/priceUtils';
import { getDict, prefixFor, type Locale } from '../../lib/i18n';

const WA_NUMBER = '6287873487940';

const AMENITY_ICONS: Record<string, string> = {
  pool: '🏊', garden: '🌿', furnished: '🛋️',
  water: '💧', electricity: '⚡', road: '🛣️',
};

/* ─────────── Types ─────────── */
type Item = {
  id: string; type: 'villa' | 'land'; title: string; location: string;
  reference?: string | null;
  price: number; currency: string; tenure: 'freehold' | 'leasehold'; leaseYears?: number;
  expectedYield: number | null; images: string[]; href: string;
  bedrooms?: number | null; bathrooms?: number | null;
  pool?: boolean; garden?: boolean; furnished?: boolean;
  condition?: string; landSize?: number | null;
  hasWater?: boolean; hasElectricity?: boolean; hasRoad?: boolean;
  latitude?: number | null; longitude?: number | null;
  description?: string | null;
};

type Search = { type: 'all' | 'villa' | 'land'; tenure: 'all' | 'freehold' | 'leasehold'; location: string };
type VillaSidebar = { pool: boolean; garden: boolean; furnished: boolean; minBedrooms: string; minBathrooms: string };
type LandSidebar = { hasWater: boolean; hasElectricity: boolean; hasRoad: boolean; minArea: string; maxPrice: string };
type SortBy = 'recent' | 'price_asc' | 'price_desc';

/* ─────────── Reveal on scroll ─────────── */
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

/* ─────────── Investment card v2 ─────────── */
function InvCard({ item, locale }: { item: Item; locale: Locale }) {
  const t = getDict(locale);
  const [idx, setIdx] = useState(0);
  const [hover, setHover] = useState(false);

  const prev = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setIdx(i => (i - 1 + item.images.length) % item.images.length);
  }, [item.images.length]);

  const next = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setIdx(i => (i + 1) % item.images.length);
  }, [item.images.length]);

  const waMsg = encodeURIComponent(`Hi, I'm interested in ${item.title}`);
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${waMsg}`;

  const { main: priceMain, approx: priceApprox } = dualPrice(item.price, item.currency, item.type === 'land' ? '/are' : '');

  const villaAmenities = ([
    item.pool && 'pool', item.garden && 'garden', item.furnished && 'furnished',
  ] as (string | false)[]).filter(Boolean) as string[];

  const villaAmenityLabels: Record<string, string> = {
    pool: t.inv.pool, garden: t.inv.garden, furnished: t.inv.furnished,
  };

  return (
    <div className="lc2-card">
      {/* Media — Link wraps only images; controls are siblings, not nested in <a> */}
      <div
        className="lc2-media listing-media"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Type + tenure overlay badges */}
        <div className="lc2-inv-badges">
          <span className={`lc2-inv-badge ${item.type === 'villa' ? 'lc2-inv-badge-villa' : 'lc2-inv-badge-land'}`}>
            {item.type === 'villa' ? t.inv.badgeVilla : t.inv.badgeLand}
          </span>
          <span className={`lc2-inv-badge ${item.tenure === 'freehold' ? 'lc2-inv-badge-freehold' : 'lc2-inv-badge-lease'}`}>
            {item.tenure === 'freehold' ? t.inv.freehold : item.leaseYears ? `${t.inv.leaseY} ${item.leaseYears}y` : t.inv.leasehold}
          </span>
        </div>

        <Link
          href={item.href}
          className="lc2-media-link"
          aria-label={item.title}
        >
          {item.images.length > 0 ? item.images.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading={i === 0 ? 'eager' : 'lazy'}
              className="listing-img"
              style={{
                opacity: i === idx ? 1 : 0,
                transform: i === idx && hover ? 'scale(1.04)' : 'scale(1)',
              }}
            />
          )) : (
            <div className="listing-img-placeholder">Rumah<em>Ya</em></div>
          )}
        </Link>

        {item.images.length > 1 && (
          <>
            <button type="button" onClick={prev} className="listing-arrow listing-arrow-left" aria-label="Previous">‹</button>
            <button type="button" onClick={next} className="listing-arrow listing-arrow-right" aria-label="Next">›</button>
            <div className="listing-dots">
              {item.images.map((_, i) => (
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
          {item.location}
        </p>

        <h3 className="lc2-title">{item.title}</h3>

        {item.type === 'villa' && (
          <div className="lc2-meta">
            {item.bedrooms ? <span className="lc2-meta-item">🛏 {item.bedrooms} {item.bedrooms === 1 ? t.inv.bed : t.inv.beds}</span> : null}
            {item.bathrooms ? <span className="lc2-meta-item">🚿 {item.bathrooms} {item.bathrooms === 1 ? t.inv.bath : t.inv.baths}</span> : null}
          </div>
        )}
        {item.type === 'land' && item.landSize && (
          <div className="lc2-meta">
            <span className="lc2-meta-item">📐 {item.landSize} {t.inv.areSuffix}</span>
          </div>
        )}

        {/* Amenity pills */}
        {item.type === 'villa' && villaAmenities.length > 0 && (
          <div className="lc2-amenities">
            {villaAmenities.map(key => (
              <span key={key} className="lc2-pill">
                {AMENITY_ICONS[key]} {villaAmenityLabels[key]}
              </span>
            ))}
          </div>
        )}
        {item.type === 'land' && (
          <div className="lc2-amenities">
            {item.hasWater && <span className="lc2-pill">{AMENITY_ICONS.water} {t.inv.water}</span>}
            {item.hasElectricity && <span className="lc2-pill">{AMENITY_ICONS.electricity} {t.inv.electricity}</span>}
            {item.hasRoad && <span className="lc2-pill">{AMENITY_ICONS.road} {t.inv.road}</span>}
          </div>
        )}

        <div className="lc2-price-block">
          <p className="lc2-price">
            <span>{priceMain}</span>
          </p>
          {priceApprox && <p className="lc2-price-year">{priceApprox}</p>}
          {item.expectedYield && (
            <p className="lc2-yield">{item.expectedYield}{t.inv.yieldSuffix}</p>
          )}
        </div>

        {item.reference && (
          <p className="lc2-ref">{item.reference}</p>
        )}

        <div className="lc2-ctas">
          <Link href={item.href} className="lc2-btn-detail">
            View details →
          </Link>
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
    </div>
  );
}

/* ─────────── Page ─────────── */
export default function InvestmentsClient({ locale = 'en' }: { locale?: Locale }) {
  const t = getDict(locale);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [search, setSearch] = useState<Search>({ type: 'all', tenure: 'all', location: '' });
  const [villa, setVilla] = useState<VillaSidebar>({ pool: false, garden: false, furnished: false, minBedrooms: '', minBathrooms: '' });
  const [land, setLand] = useState<LandSidebar>({ hasWater: false, hasElectricity: false, hasRoad: false, minArea: '', maxPrice: '' });

  useEffect(() => {
    const load = async () => {
      const { data: investments } = await supabase.from('investments').select('*');
      if (!investments) { setLoading(false); return; }
      const pIds = investments.filter(i => i.asset_type === 'property').map(i => i.asset_id);
      const lIds = investments.filter(i => i.asset_type === 'land').map(i => i.asset_id);
      const [{ data: props }, { data: lands }] = await Promise.all([
        pIds.length ? supabase.from('properties').select('*').in('id', pIds) : Promise.resolve({ data: [] }),
        lIds.length ? supabase.from('lands').select('*').in('id', lIds) : Promise.resolve({ data: [] }),
      ]);
      const merged: Item[] = [];
      for (const inv of investments) {
        if (inv.asset_type === 'property') {
          const p = (props as any[])?.find(x => x.id === inv.asset_id);
          if (p && p.status === 'published') merged.push({
            id: inv.id, type: 'villa', title: p.title, location: p.location || 'Lombok',
            reference: inv.reference,
            price: p.price || 0, currency: p.currency || 'USD', tenure: p.tenure || 'freehold',
            leaseYears: p.lease_years, expectedYield: inv.expected_yield, images: p.images || [],
            href: prefixFor(locale, `/investments/${inv.id}`), bedrooms: p.bedrooms, bathrooms: p.bathrooms,
            pool: p.pool, garden: p.garden, furnished: p.furnished, condition: p.condition,
            latitude: p.latitude, longitude: p.longitude, description: p.description,
          });
        }
        if (inv.asset_type === 'land') {
          const l = (lands as any[])?.find(x => x.id === inv.asset_id);
          if (l && l.status === 'published') merged.push({
            id: inv.id, type: 'land', title: l.title, location: l.location || 'Lombok',
            reference: inv.reference,
            price: l.price_per_are_idr ?? l.price_per_are ?? 0, currency: l.currency || 'IDR',
            tenure: l.tenure || 'freehold', leaseYears: l.lease_years,
            expectedYield: inv.expected_yield, images: l.images || [],
            href: prefixFor(locale, `/investments/${inv.id}`),
            landSize: l.land_size ? Number(l.land_size) : null, condition: l.condition,
            hasWater: l.has_water, hasElectricity: l.has_electricity, hasRoad: l.has_road,
            latitude: l.latitude, longitude: l.longitude, description: l.description,
          });
        }
      }
      setItems(merged); setLoading(false);
    };
    load();
  }, [locale]);

  const locations = [...new Set(items.map(i => i.location))].sort();

  const filtered = items.filter(item => {
    if (search.type !== 'all' && item.type !== search.type) return false;
    if (search.tenure !== 'all' && item.tenure !== search.tenure) return false;
    if (search.location && item.location !== search.location) return false;
    if (item.type === 'villa') {
      if (villa.pool && !item.pool) return false;
      if (villa.garden && !item.garden) return false;
      if (villa.furnished && !item.furnished) return false;
      if (villa.minBedrooms && (item.bedrooms ?? 0) < Number(villa.minBedrooms)) return false;
      if (villa.minBathrooms && (item.bathrooms ?? 0) < Number(villa.minBathrooms)) return false;
    }
    if (item.type === 'land') {
      if (land.hasWater && !item.hasWater) return false;
      if (land.hasElectricity && !item.hasElectricity) return false;
      if (land.hasRoad && !item.hasRoad) return false;
      if (land.minArea && (item.landSize ?? 0) < Number(land.minArea)) return false;
      if (land.maxPrice && item.price > Number(land.maxPrice)) return false;
    }
    return true;
  });

  /* Sort */
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    return 0;
  });

  const resetFilters = () => {
    setVilla({ pool: false, garden: false, furnished: false, minBedrooms: '', minBathrooms: '' });
    setLand({ hasWater: false, hasElectricity: false, hasRoad: false, minArea: '', maxPrice: '' });
  };

  const hasActiveFilters = villa.pool || villa.garden || villa.furnished || !!villa.minBedrooms || !!villa.minBathrooms
    || land.hasWater || land.hasElectricity || land.hasRoad || !!land.minArea || !!land.maxPrice;

  /* Active chips */
  const activeChips: { key: string; label: string; dismiss: () => void }[] = [];
  if (search.location) activeChips.push({ key: 'location', label: search.location, dismiss: () => setSearch(s => ({ ...s, location: '' })) });
  if (search.type !== 'all') activeChips.push({ key: 'type', label: search.type === 'villa' ? t.inv.villas : t.inv.land, dismiss: () => setSearch(s => ({ ...s, type: 'all' })) });
  if (search.tenure !== 'all') activeChips.push({ key: 'tenure', label: search.tenure === 'freehold' ? t.inv.freehold : t.inv.leasehold, dismiss: () => setSearch(s => ({ ...s, tenure: 'all' })) });
  if (villa.pool) activeChips.push({ key: 'pool', label: t.inv.pool, dismiss: () => setVilla(s => ({ ...s, pool: false })) });
  if (villa.garden) activeChips.push({ key: 'garden', label: t.inv.garden, dismiss: () => setVilla(s => ({ ...s, garden: false })) });
  if (villa.furnished) activeChips.push({ key: 'furnished', label: t.inv.furnished, dismiss: () => setVilla(s => ({ ...s, furnished: false })) });
  if (villa.minBedrooms) activeChips.push({ key: 'minBedrooms', label: `${villa.minBedrooms}+ ${t.inv.beds}`, dismiss: () => setVilla(s => ({ ...s, minBedrooms: '' })) });
  if (land.hasWater) activeChips.push({ key: 'water', label: t.inv.water, dismiss: () => setLand(s => ({ ...s, hasWater: false })) });
  if (land.hasElectricity) activeChips.push({ key: 'elec', label: t.inv.electricity, dismiss: () => setLand(s => ({ ...s, hasElectricity: false })) });
  if (land.hasRoad) activeChips.push({ key: 'road', label: t.inv.road, dismiss: () => setLand(s => ({ ...s, hasRoad: false })) });

  const resetAll = () => { resetFilters(); setSearch({ type: 'all', tenure: 'all', location: '' }); };

  return (
    <main>
      <section className="page-title">
        <div className="container">
          <Reveal>
            <h1 className="page-title-h">
              {t.inv.heroTitleA} <em>{t.inv.heroTitleB.replace(/,\s*$/, '')}</em>
            </h1>
          </Reveal>
        </div>
      </section>

      <div className="container">
        {/* Search bar */}
        <div className="inv-searchbar">
          <div className="inv-search-seg">
            <span className="eyebrow inv-search-label">{t.inv.assetType}</span>
            <select value={search.type} onChange={e => setSearch(s => ({ ...s, type: e.target.value as Search['type'] }))}>
              <option value="all">{t.inv.allAssets}</option>
              <option value="villa">{t.inv.villas}</option>
              <option value="land">{t.inv.land}</option>
            </select>
          </div>
          <div className="inv-search-div" />
          <div className="inv-search-seg">
            <span className="eyebrow inv-search-label">{t.inv.tenure}</span>
            <select value={search.tenure} onChange={e => setSearch(s => ({ ...s, tenure: e.target.value as Search['tenure'] }))}>
              <option value="all">{t.inv.all}</option>
              <option value="freehold">{t.inv.freehold}</option>
              <option value="leasehold">{t.inv.leasehold}</option>
            </select>
          </div>
          <div className="inv-search-div" />
          <div className="inv-search-seg">
            <span className="eyebrow inv-search-label">{t.inv.location}</span>
            <select value={search.location} onChange={e => setSearch(s => ({ ...s, location: e.target.value }))}>
              <option value="">{t.inv.allAreas}</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="home-loading">
            <div className="home-spinner" />
            <span>{t.inv.loading}</span>
          </div>
        ) : (
          <div className="inv-layout">
            {/* ── Sidebar filters ── */}
            <aside className="inv-sidebar">
              {(search.type === 'villa' || search.type === 'all') && (
                <>
                  <div className="inv-sidebar-group">
                    <p className="eyebrow">{t.inv.villaAmenities}</p>
                    {([['pool', t.inv.pool, '🏊'], ['garden', t.inv.garden, '🌿'], ['furnished', t.inv.furnished, '🛋️']] as [keyof VillaSidebar, string, string][]).map(([key, label, icon]) => (
                      <label key={key} className="inv-check-row">
                        <input
                          type="checkbox"
                          checked={villa[key] as boolean}
                          onChange={e => setVilla(s => ({ ...s, [key]: e.target.checked }))}
                        />
                        <span className="inv-check-icon" aria-hidden>{icon}</span>
                        <span className="inv-check-label">{label}</span>
                      </label>
                    ))}
                  </div>
                  <div className="inv-sidebar-group">
                    <p className="eyebrow">{t.inv.bedrooms}</p>
                    {[['1', '1+'], ['2', '2+'], ['3', '3+'], ['4', '4+']].map(([v, l]) => (
                      <label key={v} className="inv-check-row">
                        <input
                          type="checkbox"
                          checked={villa.minBedrooms === v}
                          onChange={e => setVilla(s => ({ ...s, minBedrooms: e.target.checked ? v : '' }))}
                        />
                        <span className="inv-check-label">{l} {t.inv.beds}</span>
                      </label>
                    ))}
                  </div>
                </>
              )}

              {(search.type === 'land' || search.type === 'all') && (
                <>
                  <div className="inv-sidebar-group">
                    <p className="eyebrow">{t.inv.utilities}</p>
                    {([['hasWater', t.inv.water, '💧'], ['hasElectricity', t.inv.electricity, '⚡'], ['hasRoad', t.inv.road, '🛣️']] as [keyof LandSidebar, string, string][]).map(([key, label, icon]) => (
                      <label key={key} className="inv-check-row">
                        <input
                          type="checkbox"
                          checked={land[key] as boolean}
                          onChange={e => setLand(s => ({ ...s, [key]: e.target.checked }))}
                        />
                        <span className="inv-check-icon" aria-hidden>{icon}</span>
                        <span className="inv-check-label">{label}</span>
                      </label>
                    ))}
                  </div>
                  <div className="inv-sidebar-group">
                    <p className="eyebrow">{t.inv.minArea}</p>
                    {[['5', '5+'], ['10', '10+'], ['20', '20+'], ['50', '50+']].map(([v, l]) => (
                      <label key={v} className="inv-check-row">
                        <input
                          type="checkbox"
                          checked={land.minArea === v}
                          onChange={e => setLand(s => ({ ...s, minArea: e.target.checked ? v : '' }))}
                        />
                        <span className="inv-check-label">{l} {t.inv.areSuffix}</span>
                      </label>
                    ))}
                  </div>
                  <div className="inv-sidebar-group">
                    <p className="eyebrow">{t.inv.maxPricePerAre}</p>
                    {[['100000000', '100 M IDR'], ['200000000', '200 M IDR'], ['300000000', '300 M IDR']].map(([v, l]) => (
                      <label key={v} className="inv-check-row">
                        <input
                          type="checkbox"
                          checked={land.maxPrice === v}
                          onChange={e => setLand(s => ({ ...s, maxPrice: e.target.checked ? v : '' }))}
                        />
                        <span className="inv-check-label">{l}</span>
                      </label>
                    ))}
                  </div>
                </>
              )}

              {hasActiveFilters && (
                <button onClick={resetFilters} className="inv-reset">{t.inv.resetFilters}</button>
              )}
            </aside>

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
                  <button className="active-chip active-chip-reset" onClick={resetAll}>
                    {t.inv.resetFilters}
                  </button>
                </div>
              )}

              {/* Result count + sort */}
              <div className="inv-result-row">
                <p className="inv-result-count">
                  {filtered.length} {filtered.length === 1 ? t.inv.opportunityOne : t.inv.opportunityMany}
                  {hasActiveFilters && <span> · {t.inv.filtered}</span>}
                </p>
                <div className="sort-row">
                  <span className="sort-label">Sort by</span>
                  <select
                    className="sort-select"
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as SortBy)}
                    aria-label="Sort investments"
                  >
                    <option value="recent">Most recent</option>
                    <option value="price_asc">Price ↑</option>
                    <option value="price_desc">Price ↓</option>
                  </select>
                </div>
              </div>

              {sorted.length === 0 ? (
                <div className="inv-empty">
                  <p>{t.inv.empty}</p>
                  <button onClick={resetAll} className="btn-secondary">{t.inv.resetFilters}</button>
                </div>
              ) : (
                <div className="inv-grid">
                  {sorted.map((item, i) => (
                    <Reveal key={item.id} delay={Math.min(i * 60, 400)}>
                      <InvCard item={item} locale={locale} />
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
