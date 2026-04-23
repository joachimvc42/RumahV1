'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import { dualPrice } from '../../lib/priceUtils';
import { getDict, prefixFor, type Locale } from '../../lib/i18n';

/* ─────────── Types ─────────── */
type Item = {
  id: string; type: 'villa' | 'land'; title: string; location: string;
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
        transition: `opacity 0.8s cubic-bezier(0.2,0.8,0.2,1) ${delay}ms, transform 0.8s cubic-bezier(0.2,0.8,0.2,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─────────── Investment card ─────────── */
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

  return (
    <Link
      href={item.href}
      className="inv-card"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="listing-media">
        {item.images.length > 0 ? item.images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={item.title}
            loading={i === 0 ? 'eager' : 'lazy'}
            className="listing-img"
            style={{ opacity: i === idx ? 1 : 0, transform: i === idx && hover ? 'scale(1.04)' : 'scale(1)' }}
          />
        )) : (
          <div className="listing-img-placeholder">Rumah<em>Ya</em></div>
        )}
        {item.images.length > 1 && (
          <>
            <button onClick={prev} className="listing-arrow listing-arrow-left" aria-label="Previous">‹</button>
            <button onClick={next} className="listing-arrow listing-arrow-right" aria-label="Next">›</button>
            <div className="listing-dots">
              {item.images.map((_, i) => (
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
        <div className="inv-meta-row">
          <span className={`inv-badge ${item.type === 'villa' ? 'inv-badge-villa' : 'inv-badge-land'}`}>
            {item.type === 'villa' ? t.inv.badgeVilla : t.inv.badgeLand}
          </span>
          <span className={`inv-badge ${item.tenure === 'freehold' ? 'inv-badge-freehold' : 'inv-badge-lease'}`}>
            {item.tenure === 'freehold' ? t.inv.freehold : item.leaseYears ? `${t.inv.leaseY} ${item.leaseYears}y` : t.inv.leasehold}
          </span>
          <span className="inv-loc">{item.location}</span>
        </div>

        <h3 className="inv-title">{item.title}</h3>

        {item.type === 'villa' && (
          <div className="inv-chips">
            {item.bedrooms ? <span>{item.bedrooms} {item.bedrooms === 1 ? t.inv.bed : t.inv.beds}</span> : null}
            {item.bathrooms ? <span>{item.bathrooms} {item.bathrooms === 1 ? t.inv.bath : t.inv.baths}</span> : null}
            {item.pool ? <span>{t.inv.pool}</span> : null}
            {item.garden ? <span>{t.inv.garden}</span> : null}
          </div>
        )}
        {item.type === 'land' && item.landSize && (
          <div className="inv-chips">
            <span>{item.landSize} {t.inv.areSuffix}</span>
            {item.hasWater ? <span>{t.inv.water}</span> : null}
            {item.hasElectricity ? <span>{t.inv.electricity}</span> : null}
            {item.hasRoad ? <span>{t.inv.road}</span> : null}
          </div>
        )}

        {item.description && <p className="inv-desc">{item.description}</p>}

        <div className="inv-price-block">
          {(() => {
            const { main, approx } = dualPrice(item.price, item.currency, item.type === 'land' ? '/are' : '');
            return (
              <>
                <p className="inv-price">{main}</p>
                <p className="inv-price-approx">{approx}</p>
              </>
            );
          })()}
          {item.expectedYield && <p className="inv-yield">{item.expectedYield}{t.inv.yieldSuffix}</p>}
        </div>
      </div>
    </Link>
  );
}

/* ─────────── Page ─────────── */
export default function InvestmentsClient({ locale = 'en' }: { locale?: Locale }) {
  const t = getDict(locale);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
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

  const resetFilters = () => {
    setVilla({ pool: false, garden: false, furnished: false, minBedrooms: '', minBathrooms: '' });
    setLand({ hasWater: false, hasElectricity: false, hasRoad: false, minArea: '', maxPrice: '' });
  };
  const hasActiveFilters = villa.pool || villa.garden || villa.furnished || !!villa.minBedrooms || !!villa.minBathrooms
    || land.hasWater || land.hasElectricity || land.hasRoad || !!land.minArea || !!land.maxPrice;

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
            {/* Sidebar filters */}
            <aside className="inv-sidebar">
              {(search.type === 'villa' || search.type === 'all') && (
                <>
                  <div className="inv-sidebar-group">
                    <p className="eyebrow">{t.inv.villaAmenities}</p>
                    {([['pool', t.inv.pool], ['garden', t.inv.garden], ['furnished', t.inv.furnished]] as [keyof VillaSidebar, string][]).map(([key, label]) => (
                      <label key={key} className="inv-check-row">
                        <input
                          type="checkbox"
                          checked={villa[key] as boolean}
                          onChange={e => setVilla(s => ({ ...s, [key]: e.target.checked }))}
                        />
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
                    {([['hasWater', t.inv.water], ['hasElectricity', t.inv.electricity], ['hasRoad', t.inv.road]] as [keyof LandSidebar, string][]).map(([key, label]) => (
                      <label key={key} className="inv-check-row">
                        <input
                          type="checkbox"
                          checked={land[key] as boolean}
                          onChange={e => setLand(s => ({ ...s, [key]: e.target.checked }))}
                        />
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

            {/* Grid */}
            <div>
              <div className="inv-result-row">
                <p className="inv-result-count">
                  {filtered.length} {filtered.length === 1 ? t.inv.opportunityOne : t.inv.opportunityMany}
                  {hasActiveFilters && <span> · {t.inv.filtered}</span>}
                </p>
              </div>
              {filtered.length === 0 ? (
                <div className="inv-empty">
                  <p>{t.inv.empty}</p>
                  <button onClick={resetFilters} className="btn-secondary">{t.inv.resetFilters}</button>
                </div>
              ) : (
                <div className="inv-grid">
                  {filtered.map((item, i) => (
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
