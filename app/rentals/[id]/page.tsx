'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

const WA_NUMBER = '6287873487940';
type MediaItem = { src: string; isVideo: boolean };

type PropertyData = {
  id: string; title: string; description: string | null; location: string | null;
  bedrooms: number | null; bathrooms: number | null; built_area: number | null;
  land_area: number | null; pool: boolean; garden: boolean; furnished: boolean;
  aircon: boolean; wifi: boolean; parking: boolean;
  images: string[] | null; videos: string[] | null;
  status?: 'draft' | 'published' | 'paused';
};

type RentalData = {
  id: string; min_duration_months: number; max_duration_months: number;
  monthly_price_idr: number; upfront_months: number; legal_checked: boolean;
  available_from: string | null; available_to: string | null;
  properties: PropertyData | null;
};

function fmtIDR(v: number) { return new Intl.NumberFormat('id-ID').format(v); }
function isVid(url: string) {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase();
  return !!ext && ['mp4','mov','webm','avi','m4v','mkv'].includes(ext);
}

export default function RentalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [rental, setRental] = useState<RentalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const load = async () => {
      let { data } = await supabase.from('long_term_rentals')
        .select(`*, properties (id, title, description, location, bedrooms, bathrooms, built_area, land_area, pool, garden, furnished, aircon, wifi, parking, images, videos, status)`)
        .eq('property_id', id).single();
      if (!data) {
        const res = await supabase.from('long_term_rentals')
          .select(`*, properties (id, title, description, location, bedrooms, bathrooms, built_area, land_area, pool, garden, furnished, aircon, wifi, parking, images, videos, status)`)
          .eq('id', id).single();
        data = res.data;
      }
      setRental(data as unknown as RentalData);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <main style={s.page}><div style={s.loading}>Loading...</div></main>;

  if (!rental?.properties || rental.properties.status !== 'published') {
    return (
      <main style={s.page}>
        <div style={s.notFound}>
          <h1>Property not available</h1>
          <Link href="/rentals" style={s.backBtn}>← Back to rentals</Link>
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

  return (
    <main style={s.page}>
      <Link href="/rentals" style={s.backLink}>← Back to rentals</Link>

      <div style={s.layout}>
        {/* Gallery */}
        <div>
          {media.length > 0 ? (
            <>
              <div style={s.mainMedia}>
                {cur.isVideo
                  ? <video key={cur.src} src={cur.src} style={s.mediaEl} controls autoPlay playsInline />
                  : <img src={cur.src} alt={`${p.title} ${idx + 1}`} style={s.mediaEl} />
                }
                {media.length > 1 && (
                  <>
                    <button onClick={() => setIdx(i => (i - 1 + media.length) % media.length)} style={{ ...s.navBtn, left: 14 }}>‹</button>
                    <button onClick={() => setIdx(i => (i + 1) % media.length)} style={{ ...s.navBtn, right: 14 }}>›</button>
                    <div style={s.counter}>{idx + 1} / {media.length}</div>
                  </>
                )}
              </div>
              {media.length > 1 && (
                <div style={s.thumbRow}>
                  {media.map((m, i) => (
                    <button key={i} onClick={() => setIdx(i)} style={{ ...s.thumb, borderColor: i === idx ? '#2563eb' : 'transparent' }}>
                      {m.isVideo
                        ? <div style={s.vidThumb}>▶</div>
                        : <img src={m.src} alt="" style={s.thumbImg} />
                      }
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={s.noMedia}>🏠</div>
          )}
        </div>

        {/* Details */}
        <div>
          {rental.legal_checked && <div style={s.verifiedBadge}>✓ Verified by RumahYa</div>}
          <h1 style={s.title}>{p.title}</h1>
          <p style={s.location}>📍 {p.location || 'Lombok'}</p>

          <div style={s.priceCard}>
            <div style={s.priceRow}>
              <span style={s.priceVal}>{fmtIDR(rental.monthly_price_idr)}</span>
              <span style={s.pricePer}>IDR / month</span>
            </div>
            <div style={s.priceMeta}>
              {rental.min_duration_months}–{rental.max_duration_months} months
              {rental.upfront_months > 0 && ` • ${rental.upfront_months} months upfront`}
            </div>
            {(rental.available_from || rental.available_to) && (
              <p style={s.avail}>
                {rental.available_from && !rental.available_to && `Available from ${new Date(rental.available_from).toLocaleDateString('en-US')}`}
                {rental.available_from && rental.available_to && `${new Date(rental.available_from).toLocaleDateString('en-US')} → ${new Date(rental.available_to).toLocaleDateString('en-US')}`}
                {!rental.available_from && rental.available_to && `Available until ${new Date(rental.available_to).toLocaleDateString('en-US')}`}
              </p>
            )}
          </div>

          <div style={s.specs}>
            {p.bedrooms && <div style={s.spec}><span style={s.specIcon}>🛏️</span>{p.bedrooms} bed{p.bedrooms > 1 ? 's' : ''}</div>}
            {p.bathrooms && <div style={s.spec}><span style={s.specIcon}>🚿</span>{p.bathrooms} bath{p.bathrooms > 1 ? 's' : ''}</div>}
            {p.built_area && <div style={s.spec}><span style={s.specIcon}>📐</span>{p.built_area} m²</div>}
            {p.land_area && <div style={s.spec}><span style={s.specIcon}>🌍</span>{p.land_area} are</div>}
          </div>

          <div style={s.amenities}>
            {p.pool && <span style={s.amenity}>🏊 Pool</span>}
            {p.garden && <span style={s.amenity}>🌳 Garden</span>}
            {p.furnished && <span style={s.amenity}>🛋️ Furnished</span>}
            {p.aircon && <span style={s.amenity}>❄️ Air con</span>}
            {p.wifi && <span style={s.amenity}>📶 WiFi</span>}
            {p.parking && <span style={s.amenity}>🚗 Parking</span>}
          </div>

          {p.description && (
            <div style={s.desc}>
              <h3 style={s.descTitle}>Description</h3>
              <p style={s.descText}>{p.description}</p>
            </div>
          )}

          <div style={s.cta}>
            <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hello, I am interested in the rental: ${p.title}`)}`} target="_blank" rel="noopener noreferrer" style={s.ctaWa}>
              <span style={{ fontSize: 18 }}>💬</span> Request info
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

const s: { [k: string]: React.CSSProperties } = {
  page: { maxWidth: 1200, margin: '0 auto', padding: '24px 24px 60px' },
  loading: { textAlign: 'center', padding: 80, color: '#6b7280', fontSize: 18 },
  notFound: { textAlign: 'center', padding: 80 },
  backBtn: { display: 'inline-block', marginTop: 20, padding: '13px 26px', background: '#2563eb', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 15 },
  backLink: { display: 'inline-block', marginBottom: 28, color: '#6b7280', textDecoration: 'none', fontSize: 15, fontWeight: 600 },
  layout: { display: 'grid', gridTemplateColumns: '1fr 420px', gap: 48 },
  mainMedia: { position: 'relative', aspectRatio: '16/10', borderRadius: 20, overflow: 'hidden', background: '#111827' },
  mediaEl: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  navBtn: { position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', border: 'none', fontSize: 28, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', color: '#111' },
  counter: { position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', padding: '7px 16px', background: 'rgba(0,0,0,0.6)', color: '#fff', borderRadius: 20, fontSize: 14, fontWeight: 600 },
  thumbRow: { display: 'flex', gap: 10, marginTop: 14, overflowX: 'auto', paddingBottom: 4 },
  thumb: { flexShrink: 0, width: 80, height: 60, borderRadius: 10, overflow: 'hidden', border: '3px solid transparent', cursor: 'pointer', padding: 0, background: '#1f2937' },
  thumbImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  vidThumb: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#fff', background: '#374151' },
  noMedia: { aspectRatio: '16/10', borderRadius: 20, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80, color: '#d1d5db' },
  verifiedBadge: { display: 'inline-block', padding: '7px 14px', background: '#059669', color: '#fff', borderRadius: 20, fontSize: 13, fontWeight: 700, marginBottom: 14 },
  title: { fontSize: 32, fontWeight: 800, color: '#111827', margin: '0 0 8px' },
  location: { fontSize: 16, color: '#6b7280', margin: '0 0 24px' },
  priceCard: { background: 'linear-gradient(135deg,#f0fdf4,#ecfeff)', borderRadius: 16, padding: 24, marginBottom: 24, border: '2px solid #d1fae5' },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 },
  priceVal: { fontSize: 34, fontWeight: 800, color: '#059669' },
  pricePer: { fontSize: 16, color: '#6b7280' },
  priceMeta: { fontSize: 15, color: '#374151' },
  avail: { marginTop: 12, fontSize: 14, color: '#2563eb', fontWeight: 600 },
  specs: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 },
  spec: { display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', background: '#f9fafb', borderRadius: 12, fontSize: 15, fontWeight: 500 },
  specIcon: { fontSize: 20 },
  amenities: { display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  amenity: { padding: '10px 16px', background: '#fff', border: '2px solid #e5e7eb', borderRadius: 10, fontSize: 14, fontWeight: 600 },
  desc: { marginBottom: 28 },
  descTitle: { fontSize: 18, fontWeight: 700, color: '#374151', marginBottom: 10 },
  descText: { fontSize: 15, color: '#4b5563', lineHeight: 1.75 },
  cta: { display: 'flex' },
  ctaWa: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '16px 24px', background: '#25a244', color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 16, textAlign: 'center' as const },
};