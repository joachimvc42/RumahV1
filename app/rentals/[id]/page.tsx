'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import MapView from '../../../components/MapView';

const WA_NUMBER = '6287873487940';
type MediaItem = { src: string; isVideo: boolean };

type PropertyData = {
  id: string; title: string; description: string | null; location: string | null;
  bedrooms: number | null; bathrooms: number | null; built_area: number | null;
  land_area: number | null; pool: boolean; garden: boolean; furnished: boolean;
  aircon: boolean; wifi: boolean; parking: boolean; kitchen?: boolean; private_space?: boolean;
  images: string[] | null; videos: string[] | null;
  status?: 'draft' | 'published' | 'paused';
  latitude?: number | null; longitude?: number | null;
};

type RentalData = {
  id: string; min_duration_months: number; max_duration_months: number;
  monthly_price_idr: number; yearly_price_idr?: number | null;
  upfront_months: number; upfront_amount_idr?: number | null; legal_checked: boolean;
  available_from: string | null; available_to: string | null;
  properties: PropertyData | null;
};

function fmtIDR(v: number) { return new Intl.NumberFormat('id-ID').format(v); }
function isVid(url: string) {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase();
  return !!ext && ['mp4', 'mov', 'webm', 'avi', 'm4v', 'mkv'].includes(ext);
}

export default function RentalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [rental, setRental] = useState<RentalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  // Dynamic title
  useEffect(() => {
    if (rental?.properties?.title) {
      document.title = `${rental.properties.title} — Long-term rental in Lombok | RumahYa`;
    }
  }, [rental]);

  useEffect(() => {
    const load = async () => {
      let { data } = await supabase.from('long_term_rentals')
        .select(`*, yearly_price_idr, upfront_amount_idr, properties (id, title, description, location, bedrooms, bathrooms, built_area, land_area, pool, garden, furnished, aircon, wifi, parking, kitchen, private_space, images, videos, status, latitude, longitude)`)
        .eq('property_id', id).single();
      if (!data) {
        const res = await supabase.from('long_term_rentals')
          .select(`*, yearly_price_idr, upfront_amount_idr, properties (id, title, description, location, bedrooms, bathrooms, built_area, land_area, pool, garden, furnished, aircon, wifi, parking, kitchen, private_space, images, videos, status, latitude, longitude)`)
          .eq('id', id).single();
        data = res.data;
      }
      setRental(data as unknown as RentalData);
      setLoading(false);
    };
    load();
  }, [id]);

  // Keyboard shortcuts for lightbox
  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false);
      if (e.key === 'ArrowLeft') setIdx(i => (i - 1 + media.length) % media.length);
      if (e.key === 'ArrowRight') setIdx(i => (i + 1) % media.length);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, rental]);

  if (loading) return (
    <main className="detail-page">
      <div className="home-loading"><div className="home-spinner" /><span>Loading property…</span></div>
    </main>
  );

  if (!rental?.properties || rental.properties.status !== 'published') {
    return (
      <main className="detail-page">
        <div className="detail-notfound">
          <h1>Property not available</h1>
          <Link href="/" className="btn-secondary">Back to rentals</Link>
        </div>
      </main>
    );
  }

  const p = rental.properties;
  const media: MediaItem[] = [
    ...(p.images || []).map(src => ({ src, isVideo: false })),
    ...(p.videos || []).filter(Boolean).map(src => ({ src, isVideo: isVid(src) })),
  ];
  const cur = media[idx];

  const ldJson = {
    '@context': 'https://schema.org',
    '@type': 'Accommodation',
    additionalType: 'https://schema.org/House',
    name: p.title,
    description: p.description ?? undefined,
    address: { '@type': 'PostalAddress', addressLocality: p.location ?? 'Lombok', addressCountry: 'ID' },
    ...(p.latitude != null && p.longitude != null
      ? { geo: { '@type': 'GeoCoordinates', latitude: Number(p.latitude), longitude: Number(p.longitude) } }
      : {}),
    ...(p.images?.[0] ? { image: p.images.slice(0, 6) } : {}),
    numberOfRooms: p.bedrooms ?? undefined,
    numberOfBathroomsTotal: p.bathrooms ?? undefined,
    floorSize: p.built_area ? { '@type': 'QuantitativeValue', value: p.built_area, unitCode: 'MTK' } : undefined,
    amenityFeature: [
      p.pool && { '@type': 'LocationFeatureSpecification', name: 'Pool', value: true },
      p.garden && { '@type': 'LocationFeatureSpecification', name: 'Garden', value: true },
      p.furnished && { '@type': 'LocationFeatureSpecification', name: 'Furnished', value: true },
      p.aircon && { '@type': 'LocationFeatureSpecification', name: 'Air conditioning', value: true },
      p.wifi && { '@type': 'LocationFeatureSpecification', name: 'WiFi', value: true },
      p.parking && { '@type': 'LocationFeatureSpecification', name: 'Parking', value: true },
    ].filter(Boolean),
    offers: {
      '@type': 'Offer',
      price: rental.monthly_price_idr,
      priceCurrency: 'IDR',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: rental.monthly_price_idr,
        priceCurrency: 'IDR',
        unitText: 'MONTH',
      },
      availability: 'https://schema.org/InStock',
      ...(rental.available_from ? { availabilityStarts: rental.available_from } : {}),
      ...(rental.available_to ? { availabilityEnds: rental.available_to } : {}),
    },
  };

  return (
    <main className="detail-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }} />
      <Link href="/" className="detail-back">← Back to rentals</Link>

      <div className="detail-layout">
        {/* Gallery */}
        <div className="gallery">
          {media.length > 0 ? (
            <>
              <div className="gallery-main">
                {cur.isVideo ? (
                  <video key={cur.src} src={cur.src} className="gallery-media" controls autoPlay playsInline />
                ) : (
                  <button className="gallery-img-btn" onClick={() => setLightbox(true)} aria-label="Open in lightbox">
                    <Image
                      src={cur.src}
                      alt={`${p.title} — photo ${idx + 1}`}
                      fill
                      sizes="(max-width: 900px) 100vw, 60vw"
                      priority={idx === 0}
                      className="gallery-media"
                      style={{ objectFit: 'cover' }}
                      unoptimized
                    />
                  </button>
                )}
                {media.length > 1 && (
                  <>
                    <button onClick={() => setIdx(i => (i - 1 + media.length) % media.length)} className="gallery-nav gallery-nav-left" aria-label="Previous">‹</button>
                    <button onClick={() => setIdx(i => (i + 1) % media.length)} className="gallery-nav gallery-nav-right" aria-label="Next">›</button>
                    <div className="gallery-counter">{idx + 1} / {media.length}</div>
                  </>
                )}
              </div>
              {media.length > 1 && (
                <div className="gallery-thumbs">
                  {media.map((m, i) => (
                    <button key={i} onClick={() => setIdx(i)} className={`gallery-thumb ${i === idx ? 'is-active' : ''}`} aria-label={`Show photo ${i + 1}`}>
                      {m.isVideo ? <div className="gallery-thumb-video">▶</div> : <img src={m.src} alt="" loading="lazy" />}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="gallery-no-media">Rumah<em>Ya</em></div>
          )}
        </div>

        {/* Details */}
        <div className="detail-body">
          <div className="detail-badges">
            {rental.legal_checked && <span className="detail-badge detail-badge-verified">✓ Verified by RumahYa</span>}
          </div>
          <h1 className="detail-title">{p.title}</h1>
          <p className="detail-location">{p.location || 'Lombok'}</p>

          <div className="detail-price-card">
            <div className="detail-price-main">
              <span className="detail-price-value">{fmtIDR(rental.monthly_price_idr)}</span>
              <span className="detail-price-unit">IDR / month</span>
            </div>
            {rental.yearly_price_idr && (
              <div className="detail-price-secondary">
                <strong>{fmtIDR(rental.yearly_price_idr)}</strong>
                <span>IDR / year</span>
              </div>
            )}
            <p className="detail-price-meta">
              {rental.min_duration_months}–{rental.max_duration_months} months
              {rental.upfront_amount_idr && rental.upfront_amount_idr > 0
                ? ` · ${fmtIDR(rental.upfront_amount_idr)} IDR upfront`
                : rental.upfront_months > 0 ? ` · ${rental.upfront_months} months upfront` : ''}
            </p>
            {(rental.available_from || rental.available_to) && (
              <p className="detail-price-avail">
                {rental.available_from && !rental.available_to && `Available from ${new Date(rental.available_from).toLocaleDateString('en-US')}`}
                {rental.available_from && rental.available_to && `${new Date(rental.available_from).toLocaleDateString('en-US')} → ${new Date(rental.available_to).toLocaleDateString('en-US')}`}
                {!rental.available_from && rental.available_to && `Available until ${new Date(rental.available_to).toLocaleDateString('en-US')}`}
              </p>
            )}
          </div>

          <div className="detail-specs">
            {p.bedrooms != null && p.bedrooms > 0 && (
              <div className="detail-spec">
                <p className="detail-spec-label">Bedrooms</p>
                <div className="detail-spec-value">{p.bedrooms}</div>
              </div>
            )}
            {p.bathrooms != null && p.bathrooms > 0 && (
              <div className="detail-spec">
                <p className="detail-spec-label">Bathrooms</p>
                <div className="detail-spec-value">{p.bathrooms}</div>
              </div>
            )}
            {p.built_area && (
              <div className="detail-spec">
                <p className="detail-spec-label">Built area</p>
                <div className="detail-spec-value">{p.built_area} m²</div>
              </div>
            )}
            {p.land_area && (
              <div className="detail-spec">
                <p className="detail-spec-label">Land area</p>
                <div className="detail-spec-value">{p.land_area} are</div>
              </div>
            )}
          </div>

          {(p.pool || p.garden || p.furnished || p.aircon || p.wifi || p.parking || p.kitchen || p.private_space) && (
            <div className="detail-amenities">
              {p.pool && <span className="detail-amenity">Pool</span>}
              {p.garden && <span className="detail-amenity">Garden</span>}
              {p.furnished && <span className="detail-amenity">Furnished</span>}
              {p.aircon && <span className="detail-amenity">Air conditioning</span>}
              {p.wifi && <span className="detail-amenity">WiFi</span>}
              {p.parking && <span className="detail-amenity">Parking</span>}
              {p.kitchen && <span className="detail-amenity">Kitchen</span>}
              {p.private_space && <span className="detail-amenity">Private space</span>}
            </div>
          )}

          {p.description && (
            <div className="detail-section">
              <h2 className="detail-section-title">Description</h2>
              <p className="detail-desc">{p.description}</p>
            </div>
          )}

          {p.latitude != null && p.longitude != null && (
            <div className="detail-section">
              <h2 className="detail-section-title">Location</h2>
              <MapView lat={Number(p.latitude)} lng={Number(p.longitude)} title={p.title} />
            </div>
          )}

          <div className="detail-cta">
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hello, I am interested in the rental: ${p.title}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="wa-button"
            >
              <span className="wa-icon" aria-hidden>✉</span>
              <div className="wa-text">
                <span className="wa-label">Request info</span>
                <span className="wa-number">WhatsApp · +62 878 7348 7940</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && cur && !cur.isVideo && (
        <div className="lightbox-overlay" onClick={() => setLightbox(false)}>
          <button className="lightbox-close" onClick={() => setLightbox(false)} aria-label="Close">✕</button>
          {media.length > 1 && (
            <button className="lightbox-nav lightbox-nav-left" onClick={e => { e.stopPropagation(); setIdx(i => (i - 1 + media.length) % media.length); }} aria-label="Previous">‹</button>
          )}
          <img src={cur.src} alt="" className="lightbox-img" onClick={e => e.stopPropagation()} />
          {media.length > 1 && (
            <button className="lightbox-nav lightbox-nav-right" onClick={e => { e.stopPropagation(); setIdx(i => (i + 1) % media.length); }} aria-label="Next">›</button>
          )}
          {media.length > 1 && <div className="lightbox-counter">{idx + 1} / {media.length}</div>}
        </div>
      )}
    </main>
  );
}
