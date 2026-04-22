'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import { dualPrice } from '../../../lib/priceUtils';
import MapView from '../../../components/MapView';
import { getDict, prefixFor, type Locale } from '../../../lib/i18n';

const WA_NUMBER = '6287873487940';
type MediaItem = { src: string; isVideo: boolean };

type InvestmentData = {
  id: string; type: 'villa' | 'land'; title: string; description: string | null;
  location: string; price: number; currency: string; tenure: 'freehold' | 'leasehold';
  leaseYears: number | null; expectedYield: number | null; legalChecked: boolean;
  managementAvailable: boolean; media: MediaItem[];
  bedrooms?: number; bathrooms?: number; builtArea?: number; landArea?: number;
  pool?: boolean; garden?: boolean; furnished?: boolean; landSize?: string;
  latitude?: number | null; longitude?: number | null;
};

function isVid(url: string) {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase();
  return !!ext && ['mp4', 'mov', 'webm', 'avi', 'm4v', 'mkv'].includes(ext);
}
function buildMedia(images: string[], videos: string[]): MediaItem[] {
  return [
    ...(images || []).map(src => ({ src, isVideo: false })),
    ...(videos || []).filter(Boolean).map(src => ({ src, isVideo: isVid(src) })),
  ];
}

export default function InvestmentDetailClient({ locale = 'en' }: { locale?: Locale }) {
  const t = getDict(locale);
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<InvestmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    if (data?.title) {
      document.title = `${data.title} — ${data.type === 'villa' ? 'Villa' : 'Land'} investment in Lombok | RumahYa`;
    }
  }, [data]);

  useEffect(() => {
    const load = async () => {
      const { data: inv } = await supabase.from('investments').select('*').eq('id', id).single();
      if (!inv) { setLoading(false); return; }

      let item: InvestmentData | null = null;
      if (inv.asset_type === 'property') {
        const { data: prop } = await supabase.from('properties').select('*').eq('id', inv.asset_id).single();
        if (prop && prop.status === 'published') {
          item = {
            id: inv.id, type: 'villa', title: prop.title || 'Villa',
            description: prop.description, location: prop.location || 'Lombok',
            price: prop.price || 0, currency: prop.currency || 'USD',
            tenure: prop.tenure || 'freehold', leaseYears: prop.lease_years,
            expectedYield: inv.expected_yield, legalChecked: inv.legal_checked,
            managementAvailable: inv.management_available,
            media: buildMedia(prop.images || [], prop.videos || []),
            bedrooms: prop.bedrooms, bathrooms: prop.bathrooms,
            builtArea: prop.built_area, landArea: prop.land_area,
            pool: prop.pool, garden: prop.garden, furnished: prop.furnished,
            latitude: prop.latitude, longitude: prop.longitude,
          };
        }
      } else {
        const { data: land } = await supabase.from('lands').select('*').eq('id', inv.asset_id).single();
        if (land) {
          item = {
            id: inv.id, type: 'land', title: land.title || 'Land',
            description: land.description, location: land.location || 'Lombok',
            price: land.price_per_are_idr ?? land.price_per_are ?? 0,
            currency: land.currency || 'IDR', tenure: land.tenure || 'freehold',
            leaseYears: land.lease_years, expectedYield: inv.expected_yield,
            legalChecked: inv.legal_checked, managementAvailable: inv.management_available,
            media: buildMedia(land.images || [], land.videos || []),
            landSize: land.land_size,
            latitude: land.latitude, longitude: land.longitude,
          };
        }
      }

      setData(item);
      setLoading(false);
    };
    load();
  }, [id]);

  // Keyboard shortcuts for lightbox
  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false);
      if (e.key === 'ArrowLeft' && data) setIdx(i => (i - 1 + data.media.length) % data.media.length);
      if (e.key === 'ArrowRight' && data) setIdx(i => (i + 1) % data.media.length);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, data]);

  const backHref = prefixFor(locale, '/investments');

  if (loading) return (
    <main className="detail-page">
      <div className="home-loading"><div className="home-spinner" /><span>{t.detail.loadingOpp}</span></div>
    </main>
  );

  if (!data) {
    return (
      <main className="detail-page">
        <div className="detail-notfound">
          <h1>{t.detail.notFound}</h1>
          <Link href={backHref} className="btn-secondary">{t.detail.investmentsBack}</Link>
        </div>
      </main>
    );
  }

  const { media } = data;
  const cur = media[idx];
  const { main: priceMain, approx: priceApprox } = dualPrice(data.price, data.currency, data.type === 'land' ? '/are' : '');

  const ldJson = {
    '@context': 'https://schema.org',
    '@type': data.type === 'villa' ? 'Accommodation' : 'Place',
    name: data.title,
    description: data.description ?? undefined,
    address: { '@type': 'PostalAddress', addressLocality: data.location, addressCountry: 'ID' },
    ...(data.latitude != null && data.longitude != null
      ? { geo: { '@type': 'GeoCoordinates', latitude: Number(data.latitude), longitude: Number(data.longitude) } }
      : {}),
    ...(data.media[0] && !data.media[0].isVideo
      ? { image: data.media.filter(m => !m.isVideo).map(m => m.src).slice(0, 6) }
      : {}),
    ...(data.type === 'villa' ? {
      numberOfRooms: data.bedrooms,
      numberOfBathroomsTotal: data.bathrooms,
      floorSize: data.builtArea ? { '@type': 'QuantitativeValue', value: data.builtArea, unitCode: 'MTK' } : undefined,
    } : {}),
    offers: {
      '@type': 'Offer',
      price: data.price,
      priceCurrency: data.currency,
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <main className="detail-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }} />
      <Link href={backHref} className="detail-back">← {t.detail.investmentsBack}</Link>

      <div className="detail-layout">
        {/* Gallery */}
        <div className="gallery">
          {media.length > 0 ? (
            <>
              <div className="gallery-main">
                <span className="detail-badge-type">{data.type === 'villa' ? t.inv.badgeVilla : t.inv.badgeLand}</span>
                {cur.isVideo ? (
                  <video key={cur.src} src={cur.src} className="gallery-media" controls autoPlay playsInline />
                ) : (
                  <button className="gallery-img-btn" onClick={() => setLightbox(true)} aria-label="Open in lightbox">
                    <Image
                      src={cur.src}
                      alt={`${data.title} — photo ${idx + 1}`}
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
            {data.legalChecked && <span className="detail-badge detail-badge-verified">{t.detail.badgeVerified}</span>}
            {data.managementAvailable && <span className="detail-badge detail-badge-mgmt">{t.detail.badgeMgmt}</span>}
          </div>
          <h1 className="detail-title">{data.title}</h1>
          <p className="detail-location">{data.location}</p>

          <div className="detail-price-card">
            <div className="detail-price-main">
              <span className="detail-price-value">{priceMain}</span>
            </div>
            {priceApprox && <p className="detail-price-approx">{priceApprox}</p>}

            <div className="detail-tenure">
              {data.tenure === 'freehold'
                ? <><strong>{t.inv.freehold}</strong> — {t.detail.freeholdFull}</>
                : <><strong>{t.inv.leasehold}</strong> — {data.leaseYears} {t.detail.leaseholdFor}</>}
            </div>

            {data.expectedYield && (
              <div className="detail-yield">
                <span className="detail-yield-label">{t.detail.estYield}</span>
                <span className="detail-yield-value">{data.expectedYield}{t.detail.yieldSuffix}</span>
              </div>
            )}
          </div>

          {data.type === 'villa' && (
            <div className="detail-specs">
              {data.bedrooms != null && data.bedrooms > 0 && (
                <div className="detail-spec">
                  <p className="detail-spec-label">{t.detail.bedrooms}</p>
                  <div className="detail-spec-value">{data.bedrooms}</div>
                </div>
              )}
              {data.bathrooms != null && data.bathrooms > 0 && (
                <div className="detail-spec">
                  <p className="detail-spec-label">{t.detail.bathrooms}</p>
                  <div className="detail-spec-value">{data.bathrooms}</div>
                </div>
              )}
              {data.builtArea && (
                <div className="detail-spec">
                  <p className="detail-spec-label">{t.detail.builtArea}</p>
                  <div className="detail-spec-value">{data.builtArea} m²</div>
                </div>
              )}
              {data.landArea && (
                <div className="detail-spec">
                  <p className="detail-spec-label">{t.detail.landArea}</p>
                  <div className="detail-spec-value">{data.landArea} are</div>
                </div>
              )}
            </div>
          )}

          {data.type === 'land' && data.landSize && (
            <div className="detail-specs">
              <div className="detail-spec">
                <p className="detail-spec-label">{t.detail.totalArea}</p>
                <div className="detail-spec-value">{data.landSize} are</div>
              </div>
            </div>
          )}

          {data.type === 'villa' && (data.pool || data.garden || data.furnished) && (
            <div className="detail-amenities">
              {data.pool && <span className="detail-amenity">{t.detail.amenities.pool}</span>}
              {data.garden && <span className="detail-amenity">{t.detail.amenities.garden}</span>}
              {data.furnished && <span className="detail-amenity">{t.detail.amenities.furnished}</span>}
            </div>
          )}

          {data.description && (
            <div className="detail-section">
              <h2 className="detail-section-title">{t.detail.description}</h2>
              <p className="detail-desc">{data.description}</p>
            </div>
          )}

          {data.latitude != null && data.longitude != null && (
            <div className="detail-section">
              <h2 className="detail-section-title">{t.detail.location}</h2>
              <MapView lat={Number(data.latitude)} lng={Number(data.longitude)} title={data.title} />
            </div>
          )}

          <div className="detail-cta">
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`${t.detail.waMsgInvestment} ${data.title}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="wa-button"
            >
              <span className="wa-icon" aria-hidden>✉</span>
              <div className="wa-text">
                <span className="wa-label">{t.detail.requestInfo}</span>
                <span className="wa-number">{t.detail.waPrefix} +62 878 7348 7940</span>
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
