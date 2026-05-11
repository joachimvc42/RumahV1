'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  GoogleMap,
  OverlayView,
  InfoWindow,
  useJsApiLoader,
} from '@react-google-maps/api';
import { supabase } from '../../lib/supabaseClient';
import { getDict, prefixFor, type Locale } from '../../lib/i18n';
import { IDR_PER_USD, toMillions, fmtIDR, fmtUSD } from '../../lib/priceUtils';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const LOMBOK_CENTER = { lat: -8.65, lng: 116.32 };
// Must match the `libraries` array used by MapPicker and MapView — the
// @react-google-maps/api loader is a singleton and throws if re-initialized
// with different options.
const MAP_LIBRARIES: ('places')[] = ['places'];

type Category = 'rental' | 'villa-sale' | 'land-sale';
type Tenure = 'freehold' | 'leasehold';

type MapItem = {
  id: string;
  category: Category;
  title: string;
  location: string;
  lat: number;
  lng: number;
  href: string;
  thumbnail?: string | null;
  priceLabel: string;
  priceIDR: number;
  bedrooms?: number | null;
  bathrooms?: number | null;
  landSize?: number | null;
  tenure?: Tenure;
  leaseYears?: number | null;
  pool?: boolean;
  garden?: boolean;
  furnished?: boolean;
  minDuration?: number | null;
  maxDuration?: number | null;
};

type Amenity = 'pool' | 'garden' | 'furnished';

// Filters follow an "empty = everything" convention: nothing selected means
// no restriction. Multi-select groups use OR logic — adding chips widens
// the match set, so users never need to deselect to broaden results.
type DurationBucket = '' | 'short' | 'monthly' | 'yearly';

type Filters = {
  categories: Set<Category>;
  location: string;
  tenures: Set<Tenure>;
  minBedrooms: string;
  minBathrooms: string;
  maxRentMonthlyIDR: string;
  maxSalePriceIDR: string;
  duration: DurationBucket;
  amenities: Set<Amenity>;
};

const defaultFilters: Filters = {
  categories: new Set<Category>(),
  location: '',
  tenures: new Set<Tenure>(),
  minBedrooms: '',
  minBathrooms: '',
  maxRentMonthlyIDR: '',
  maxSalePriceIDR: '',
  duration: '',
  amenities: new Set<Amenity>(),
};

const DURATION_TARGET: Record<Exclude<DurationBucket, ''>, number> = {
  short: 1,
  monthly: 6,
  yearly: 12,
};

function priceForRental(monthlyIDR: number): { label: string; idr: number } {
  return { label: `${toMillions(monthlyIDR)} IDR/mo`, idr: monthlyIDR };
}

function priceForVilla(price: number, currency: string): { label: string; idr: number } {
  if (currency === 'USD') {
    return { label: fmtUSD(price), idr: price * IDR_PER_USD };
  }
  return { label: fmtIDR(price), idr: price };
}

function priceForLand(pricePerAreIDR: number): { label: string; idr: number } {
  return { label: `${toMillions(pricePerAreIDR)} IDR/are`, idr: pricePerAreIDR };
}

export default function MapClient({ locale = 'en', mode = 'all' }: { locale?: Locale; mode?: 'all' | 'rentals' | 'invest' }) {
  const t = getDict(locale);
  const [items, setItems] = useState<MapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const mapRef = useRef<google.maps.Map | null>(null);
  const hasFitRef = useRef(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: API_KEY ?? '',
    libraries: MAP_LIBRARIES,
  });

  /* ─── Load rentals + investments in parallel ─── */
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const [rentalsRes, investmentsRes] = await Promise.all([
        mode !== 'invest'
          ? supabase.from('long_term_rentals').select('*, properties (*)')
          : Promise.resolve({ data: [] as any[] }),
        mode !== 'rentals'
          ? supabase.from('investments').select('*')
          : Promise.resolve({ data: [] as any[] }),
      ]);

      const merged: MapItem[] = [];

      // Rentals
      if (rentalsRes.data) {
        for (const r of rentalsRes.data as any[]) {
          const p = r.properties;
          if (!p || p.status !== 'published') continue;
          if (p.latitude == null || p.longitude == null) continue;
          const { label, idr } = priceForRental(r.monthly_price_idr || 0);
          merged.push({
            id: `rental-${r.id}`,
            category: 'rental',
            title: p.title || 'Rental',
            location: p.location || 'Lombok',
            lat: Number(p.latitude),
            lng: Number(p.longitude),
            href: prefixFor(locale, `/rentals/${r.id}`),
            thumbnail: Array.isArray(p.images) ? p.images[0] : null,
            priceLabel: label,
            priceIDR: idr,
            bedrooms: p.bedrooms,
            bathrooms: p.bathrooms,
            pool: !!p.pool,
            garden: !!p.garden,
            furnished: !!p.furnished,
            minDuration: r.min_duration_months,
            maxDuration: r.max_duration_months,
          });
        }
      }

      // Investments — fetch linked properties + lands
      if (investmentsRes.data) {
        const invs = investmentsRes.data as any[];
        const pIds = invs.filter(i => i.asset_type === 'property').map(i => i.asset_id);
        const lIds = invs.filter(i => i.asset_type === 'land').map(i => i.asset_id);
        const [propsRes, landsRes] = await Promise.all([
          pIds.length ? supabase.from('properties').select('*').in('id', pIds) : Promise.resolve({ data: [] as any[] }),
          lIds.length ? supabase.from('lands').select('*').in('id', lIds) : Promise.resolve({ data: [] as any[] }),
        ]);
        const props = (propsRes.data as any[]) || [];
        const lands = (landsRes.data as any[]) || [];
        for (const inv of invs) {
          if (inv.asset_type === 'property') {
            const p = props.find(x => x.id === inv.asset_id);
            if (!p || p.status !== 'published') continue;
            if (p.latitude == null || p.longitude == null) continue;
            const { label, idr } = priceForVilla(p.price || 0, p.currency || 'USD');
            merged.push({
              id: `villa-${inv.id}`,
              category: 'villa-sale',
              title: p.title || 'Villa',
              location: p.location || 'Lombok',
              lat: Number(p.latitude),
              lng: Number(p.longitude),
              href: prefixFor(locale, `/investments/${inv.id}`),
              thumbnail: Array.isArray(p.images) ? p.images[0] : null,
              priceLabel: label,
              priceIDR: idr,
              bedrooms: p.bedrooms,
              bathrooms: p.bathrooms,
              tenure: p.tenure || 'freehold',
              leaseYears: p.lease_years,
              pool: !!p.pool,
              garden: !!p.garden,
              furnished: !!p.furnished,
            });
          } else if (inv.asset_type === 'land') {
            const l = lands.find(x => x.id === inv.asset_id);
            if (!l || l.status !== 'published') continue;
            if (l.latitude == null || l.longitude == null) continue;
            const pricePerAre = Number(l.price_per_are_idr ?? l.price_per_are ?? 0);
            const { label, idr } = priceForLand(pricePerAre);
            merged.push({
              id: `land-${inv.id}`,
              category: 'land-sale',
              title: l.title || 'Land',
              location: l.location || 'Lombok',
              lat: Number(l.latitude),
              lng: Number(l.longitude),
              href: prefixFor(locale, `/investments/${inv.id}`),
              thumbnail: Array.isArray(l.images) ? l.images[0] : null,
              priceLabel: label,
              priceIDR: idr,
              landSize: l.land_size ? Number(l.land_size) : null,
              tenure: l.tenure || 'freehold',
              leaseYears: l.lease_years,
            });
          }
        }
      }

      if (!cancelled) {
        setItems(merged);
        setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [locale]);

  /* ─── Derive locations for dropdown ─── */
  const locations = useMemo(
    () => [...new Set(items.map(i => i.location).filter(Boolean))].sort(),
    [items],
  );

  /* ─── Filter ─── */
  const filtered = useMemo(() => items.filter(item => {
    if (filters.categories.size > 0 && !filters.categories.has(item.category)) return false;
    if (filters.location && item.location !== filters.location) return false;

    // Tenure only applies to sale items (rentals have no tenure concept).
    // Non-empty tenure set excludes items without a matching tenure — which
    // naturally excludes rentals, so we don't short-circuit for them.
    if (filters.tenures.size > 0) {
      if (!item.tenure || !filters.tenures.has(item.tenure)) return false;
    }

    // Bedrooms: only applies to rental + villa-sale
    if (filters.minBedrooms && (item.category === 'rental' || item.category === 'villa-sale')) {
      if ((item.bedrooms ?? 0) < Number(filters.minBedrooms)) return false;
    }

    // Bathrooms: only applies to rental + villa-sale
    if (filters.minBathrooms && (item.category === 'rental' || item.category === 'villa-sale')) {
      if ((item.bathrooms ?? 0) < Number(filters.minBathrooms)) return false;
    }

    // Max price
    if (item.category === 'rental' && filters.maxRentMonthlyIDR) {
      if (item.priceIDR > Number(filters.maxRentMonthlyIDR)) return false;
    }
    if (item.category === 'villa-sale' && filters.maxSalePriceIDR) {
      if (item.priceIDR > Number(filters.maxSalePriceIDR)) return false;
    }

    // Duration bucket (rentals only): listing must accept the target month value
    if (item.category === 'rental' && filters.duration) {
      const target = DURATION_TARGET[filters.duration];
      const minD = item.minDuration ?? 0;
      const maxD = item.maxDuration ?? Infinity;
      if (minD > target || maxD < target) return false;
    }

    // Amenities — OR logic: item must have at least one of the selected amenities
    if (filters.amenities.size > 0) {
      const hasAny = [...filters.amenities].some(a => item[a]);
      if (!hasAny) return false;
    }

    return true;
  }), [items, filters]);

  /* ─── Fit bounds when items first arrive ─── */
  useEffect(() => {
    if (hasFitRef.current) return;
    if (!mapRef.current || filtered.length === 0) return;
    if (typeof google === 'undefined') return;
    const bounds = new google.maps.LatLngBounds();
    for (const it of filtered) bounds.extend({ lat: it.lat, lng: it.lng });
    mapRef.current.fitBounds(bounds, 80);
    hasFitRef.current = true;
  }, [filtered]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const toggleInSet = <K extends 'categories' | 'tenures' | 'amenities'>(
    key: K,
    value: K extends 'categories' ? Category : K extends 'tenures' ? Tenure : Amenity,
  ) => {
    setFilters(f => {
      const current = f[key] as Set<typeof value>;
      const next = new Set(current);
      if (next.has(value)) next.delete(value); else next.add(value);
      return { ...f, [key]: next };
    });
  };

  const resetFilters = () => setFilters({
    ...defaultFilters,
    categories: new Set<Category>(),
    tenures: new Set<Tenure>(),
    amenities: new Set<Amenity>(),
  });

  const selectedItem = filtered.find(i => i.id === selectedId) ?? null;

  // When the categories set is empty it means "all", so every optional filter
  // group stays visible. Once the user narrows to a single category the
  // groups that don't apply to it get hidden.
  const anyCategorySelected = filters.categories.size > 0;
  const isInvestMode = mode === 'invest';
  const isRentalsMode = mode === 'rentals';
  const catHasRental = !isInvestMode && (!anyCategorySelected || filters.categories.has('rental'));
  const catHasVilla = !isRentalsMode && (!anyCategorySelected || filters.categories.has('villa-sale'));
  const catHasLand = !isRentalsMode && (!anyCategorySelected || filters.categories.has('land-sale'));

  const showRentalFilters = catHasRental;
  const showSaleFilters = !isRentalsMode && (catHasVilla || catHasLand);
  const showBedroomFilter = catHasRental || catHasVilla;
  const showAmenityFilters = catHasRental || catHasVilla;
  const showCategoryFilter = !isRentalsMode;

  if (!API_KEY) {
    return (
      <main className="map-page">
        <div className="map-missing-key">
          <h1>{t.map.title}</h1>
          <p>{t.map.missingKey}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="map-page">
      <button
        className={`map-sidebar-toggle ${sidebarOpen ? 'is-open' : ''}`}
        onClick={() => setSidebarOpen(v => !v)}
        aria-label={sidebarOpen ? t.map.hideFilters : t.map.showFilters}
      >
        {sidebarOpen ? '◀' : '▶'}
      </button>

      <aside className={`map-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="map-sidebar-inner">
          <div className="map-sidebar-head">
            <h1 className="map-sidebar-title">{t.map.title}</h1>
            <p className="map-sidebar-count">
              {loading
                ? t.map.loading
                : `${filtered.length} ${filtered.length === 1 ? t.map.resultOne : t.map.resultMany}`}
            </p>
          </div>

          {/* Categories */}
          {showCategoryFilter && (
            <div className="map-filter-group map-filter-group--wide">
              <label className="map-filter-label">{t.map.type}</label>
              <div className="map-filter-chips">
                {(([
                  ['rental', t.map.catRental],
                  ['villa-sale', t.map.catVilla],
                  ['land-sale', t.map.catLand],
                ] as [Category, string][])
                  .filter(([key]) => {
                    if (isInvestMode && key === 'rental') return false;
                    if (isRentalsMode && key !== 'rental') return false;
                    return true;
                  })
                ).map(([key, label]) => (
                  <button
                    key={key}
                    className={`map-chip ${filters.categories.has(key) ? 'is-active' : ''}`}
                    onClick={() => toggleInSet('categories', key)}
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          {locations.length > 0 && (
            <div className="map-filter-group map-filter-group--wide">
              <label className="map-filter-label" htmlFor="f-location">{t.map.location}</label>
              <select
                id="f-location"
                value={filters.location}
                onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}
              >
                <option value="">{t.map.allAreas}</option>
                {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>
          )}

          {/* Tenure (investments only) */}
          {showSaleFilters && (
            <div className="map-filter-group map-filter-group--wide">
              <label className="map-filter-label">{t.map.tenure}</label>
              <div className="map-filter-chips">
                {([
                  ['freehold', t.map.freehold],
                  ['leasehold', t.map.leasehold],
                ] as [Tenure, string][]).map(([k, label]) => (
                  <button
                    key={k}
                    className={`map-chip ${filters.tenures.has(k) ? 'is-active' : ''}`}
                    onClick={() => toggleInSet('tenures', k)}
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bedrooms — chip row */}
          {showBedroomFilter && (
            <div className="map-filter-group map-filter-group--wide">
              <label className="map-filter-label">{t.map.minBedrooms}</label>
              <div className="map-filter-chips">
                {['1', '2', '3'].map(n => (
                  <button
                    key={n}
                    type="button"
                    className={`map-chip ${filters.minBedrooms === n ? 'is-active' : ''}`}
                    onClick={() => setFilters(f => ({ ...f, minBedrooms: f.minBedrooms === n ? '' : n }))}
                  >
                    {n}+
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bathrooms — chip row */}
          {showBedroomFilter && (
            <div className="map-filter-group map-filter-group--wide">
              <label className="map-filter-label">{t.map.minBathrooms}</label>
              <div className="map-filter-chips">
                {['1', '2', '3'].map(n => (
                  <button
                    key={n}
                    type="button"
                    className={`map-chip ${filters.minBathrooms === n ? 'is-active' : ''}`}
                    onClick={() => setFilters(f => ({ ...f, minBathrooms: f.minBathrooms === n ? '' : n }))}
                  >
                    {n}+
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Max monthly rent */}
          {showRentalFilters && (
            <div className="map-filter-group">
              <label className="map-filter-label" htmlFor="f-max-rent">{t.map.maxMonthlyRent}</label>
              <select
                id="f-max-rent"
                value={filters.maxRentMonthlyIDR}
                onChange={e => setFilters(f => ({ ...f, maxRentMonthlyIDR: e.target.value }))}
              >
                <option value="">{t.map.allBudgets}</option>
                <option value="5000000">≤ 5 M IDR</option>
                <option value="10000000">≤ 10 M IDR</option>
                <option value="20000000">≤ 20 M IDR</option>
                <option value="40000000">≤ 40 M IDR</option>
                <option value="80000000">≤ 80 M IDR</option>
              </select>
            </div>
          )}

          {/* Duration buckets */}
          {showRentalFilters && (
            <div className="map-filter-group map-filter-group--wide">
              <label className="map-filter-label">{t.map.duration}</label>
              <div className="map-filter-chips">
                {([
                  ['short', t.map.durationShort],
                  ['monthly', t.map.durationMonthly],
                  ['yearly', t.map.durationYearly],
                ] as [Exclude<DurationBucket, ''>, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    className={`map-chip ${filters.duration === key ? 'is-active' : ''}`}
                    onClick={() => setFilters(f => ({ ...f, duration: f.duration === key ? '' : key }))}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Max sale price */}
          {showSaleFilters && (
            <div className="map-filter-group">
              <label className="map-filter-label" htmlFor="f-max-sale">{t.map.maxSalePrice}</label>
              <select
                id="f-max-sale"
                value={filters.maxSalePriceIDR}
                onChange={e => setFilters(f => ({ ...f, maxSalePriceIDR: e.target.value }))}
              >
                <option value="">{t.map.allBudgets}</option>
                <option value="1000000000">≤ 1 Md IDR</option>
                <option value="3000000000">≤ 3 Md IDR</option>
                <option value="5000000000">≤ 5 Md IDR</option>
                <option value="10000000000">≤ 10 Md IDR</option>
                <option value="20000000000">≤ 20 Md IDR</option>
              </select>
            </div>
          )}

          {/* Amenities */}
          {showAmenityFilters && (
            <div className="map-filter-group map-filter-group--wide">
              <label className="map-filter-label">{t.map.amenities}</label>
              <div className="map-filter-chips">
                {([
                  ['pool', t.map.pool],
                  ['garden', t.map.garden],
                  ['furnished', t.map.furnished],
                ] as [Amenity, string][]).map(([k, label]) => (
                  <button
                    key={k}
                    className={`map-chip ${filters.amenities.has(k) ? 'is-active' : ''}`}
                    onClick={() => toggleInSet('amenities', k)}
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button className="map-reset" onClick={resetFilters} type="button">
            {t.map.resetFilters}
          </button>
        </div>
      </aside>

      <div className="map-wrap">
        {!isLoaded ? (
          <div className="map-skeleton">{t.map.loadingMap}</div>
        ) : (
          <GoogleMap
            mapContainerClassName="map-canvas"
            center={LOMBOK_CENTER}
            zoom={10}
            onLoad={onMapLoad}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: true,
              zoomControl: true,
              clickableIcons: false,
              gestureHandling: 'greedy',
            }}
          >
            {filtered.map(item => (
              <OverlayView
                key={item.id}
                position={{ lat: item.lat, lng: item.lng }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                getPixelPositionOffset={(w, h) => ({ x: -w / 2, y: -h - 4 })}
              >
                <button
                  className={`map-pill map-pill-${item.category} ${selectedId === item.id ? 'is-active' : ''}`}
                  onClick={() => setSelectedId(item.id)}
                  type="button"
                >
                  {item.priceLabel}
                </button>
              </OverlayView>
            ))}

            {selectedItem && (
              <InfoWindow
                position={{ lat: selectedItem.lat, lng: selectedItem.lng }}
                onCloseClick={() => setSelectedId(null)}
                options={{ pixelOffset: new google.maps.Size(0, -18) }}
              >
                <div className="map-card">
                  {selectedItem.thumbnail && (
                    <img src={selectedItem.thumbnail} alt={selectedItem.title} className="map-card-img" />
                  )}
                  <div className="map-card-body">
                    <div className="map-card-cat">
                      {selectedItem.category === 'rental' ? t.map.catRental
                        : selectedItem.category === 'villa-sale' ? t.map.catVilla
                        : t.map.catLand}
                      {selectedItem.tenure && selectedItem.category !== 'rental' && (
                        <span className="map-card-cat-sep"> · </span>
                      )}
                      {selectedItem.tenure && selectedItem.category !== 'rental' && (
                        <span>
                          {selectedItem.tenure === 'freehold'
                            ? t.map.freehold
                            : selectedItem.leaseYears
                              ? `${t.map.leasehold} ${selectedItem.leaseYears}y`
                              : t.map.leasehold}
                        </span>
                      )}
                    </div>
                    <h4 className="map-card-title">{selectedItem.title}</h4>
                    <p className="map-card-loc">{selectedItem.location}</p>

                    <div className="map-card-meta">
                      {selectedItem.category !== 'land-sale' && selectedItem.bedrooms != null && (
                        <span>🛏 {selectedItem.bedrooms}</span>
                      )}
                      {selectedItem.category !== 'land-sale' && selectedItem.bathrooms != null && (
                        <span>🚿 {selectedItem.bathrooms}</span>
                      )}
                      {selectedItem.category === 'land-sale' && selectedItem.landSize != null && (
                        <span>📐 {selectedItem.landSize} are</span>
                      )}
                    </div>

                    <div className="map-card-price">{selectedItem.priceLabel}</div>

                    <Link href={selectedItem.href} className="map-card-cta">
                      {t.map.viewDetails} →
                    </Link>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}
      </div>
    </main>
  );
}
