'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import { dualPrice } from '../../../lib/priceUtils';

const WA_NUMBER = '6287873487940';
type MediaItem = { src: string; isVideo: boolean };

type InvestmentData = {
  id: string; type: 'villa' | 'land'; title: string; description: string | null;
  location: string; price: number; currency: string; tenure: 'freehold' | 'leasehold';
  leaseYears: number | null; expectedYield: number | null; legalChecked: boolean;
  managementAvailable: boolean; media: MediaItem[];
  bedrooms?: number; bathrooms?: number; builtArea?: number; landArea?: number;
  pool?: boolean; garden?: boolean; furnished?: boolean; landSize?: string;
};

function isVid(url: string) {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase();
  return !!ext && ['mp4','mov','webm','avi','m4v','mkv'].includes(ext);
}
function buildMedia(images: string[], videos: string[]): MediaItem[] {
  return [
    ...(images || []).map(src => ({ src, isVideo: false })),
    ...(videos || []).filter(Boolean).map(src => ({ src, isVideo: isVid(src) })),
  ];
}

export default function InvestmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<InvestmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);

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
          };
        }
      }

      setData(item);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <main style={s.page}><div style={s.loading}>Loading...</div></main>;

  if (!data) {
    return (
      <main style={s.page}>
        <div style={s.notFound}>
          <h1>Opportunity not found</h1>
          <Link href="/investments" style={s.backBtn}>← Back to investments</Link>
        </div>
      </main>
    );
  }

  const { media } = data;
  const cur = media[idx];

  return (
    <main style={s.page}>
      <Link href="/investments" style={s.backLink}>← Back to investments</Link>

      <div style={s.layout}>
        {/* Gallery */}
        <div>
          {media.length > 0 ? (
            <>
              <div style={s.mainMedia}>
                {cur.isVideo
                  ? <video key={cur.src} src={cur.src} style={s.mediaEl} controls autoPlay playsInline />
                  : <img src={cur.src} alt={`${data.title} ${idx + 1}`} style={s.mediaEl} />
                }
                {media.length > 1 && (
                  <>
                    <button onClick={() => setIdx(i => (i - 1 + media.length) % media.length)} style={{ ...s.navBtn, left: 14 }}>‹</button>
                    <button onClick={() => setIdx(i => (i + 1) % media.length)} style={{ ...s.navBtn, right: 14 }}>›</button>
                    <div style={s.counter}>{idx + 1} / {media.length}</div>
                  </>
                )}
                <div style={{ ...s.typeBadge, background: data.type === 'villa' ? '#1F4E5F' : '#2FB7A6' }}>
                  {data.type === 'villa' ? '🏠 Villa' : '🌴 Land'}
                </div>
              </div>
              {media.length > 1 && (
                <div style={s.thumbRow}>
                  {media.map((m, i) => (
                    <button key={i} onClick={() => setIdx(i)} style={{ ...s.thumb, borderColor: i === idx ? '#C9A96A' : 'transparent' }}>
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
            <div style={s.noMedia}>{data.type === 'villa' ? '🏠' : '🌴'}</div>
          )}
        </div>

        {/* Details */}
        <div>
          <div style={s.badges}>
            {data.legalChecked && <span style={s.verifiedBadge}>✓ Verified by RumahYa</span>}
            {data.managementAvailable && <span style={s.mgmtBadge}>🏢 Management available</span>}
          </div>
          <h1 style={s.title}>{data.title}</h1>
          <p style={s.location}>📍 {data.location}</p>

          <div style={s.priceCard}>
            {(() => {
              const { main, approx } = dualPrice(data.price, data.currency, data.type === 'land' ? '/are' : '');
              return (
                <div style={s.priceRow}>
                  <span style={s.priceVal}>{main}</span>
                  <span style={s.priceApprox}>{approx}</span>
                </div>
              );
            })()}
            <div style={{ ...s.tenureBadge, background: data.tenure === 'freehold' ? '#d4f0ec' : '#f5eedc', color: data.tenure === 'freehold' ? '#1F4E5F' : '#7A6030' }}>
              {data.tenure === 'freehold' ? '🔑 Freehold — Full ownership' : `📋 Leasehold — ${data.leaseYears} years`}
            </div>
            {data.expectedYield && (
              <div style={s.yieldRow}>
                <span style={{ fontSize: 14, color: '#2F2A26' }}>Estimated yield</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: '#C9A96A' }}>{data.expectedYield}% / year</span>
              </div>
            )}
          </div>

          {data.type === 'villa' && (
            <div style={s.specs}>
              {data.bedrooms && <div style={s.spec}><span>🛏️</span>{data.bedrooms} bed{data.bedrooms > 1 ? 's' : ''}</div>}
              {data.bathrooms && <div style={s.spec}><span>🚿</span>{data.bathrooms} bath{data.bathrooms > 1 ? 's' : ''}</div>}
              {data.builtArea && <div style={s.spec}><span>📐</span>{data.builtArea} m²</div>}
              {data.landArea && <div style={s.spec}><span>🌍</span>{data.landArea} are</div>}
            </div>
          )}

          {data.type === 'villa' && (
            <div style={s.amenities}>
              {data.pool && <span style={s.amenity}>🏊 Pool</span>}
              {data.garden && <span style={s.amenity}>🌳 Garden</span>}
              {data.furnished && <span style={s.amenity}>🛋️ Furnished</span>}
            </div>
          )}

          {data.description && (
            <div style={s.desc}>
              <h3 style={s.descTitle}>Description</h3>
              <p style={s.descText}>{data.description}</p>
            </div>
          )}

          <div style={s.cta}>
            <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hello, I am interested in: ${data.title}`)}`} target="_blank" rel="noopener noreferrer" style={s.ctaWa}>
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
  loading: { textAlign: 'center', padding: 80, color: '#6F6A64', fontSize: 18 },
  notFound: { textAlign: 'center', padding: 80 },
  backBtn: { display: 'inline-block', marginTop: 20, padding: '13px 26px', background: '#2FB7A6', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 15 },
  backLink: { display: 'inline-block', marginBottom: 28, color: '#6F6A64', textDecoration: 'none', fontSize: 15, fontWeight: 600 },
  layout: { display: 'grid', gridTemplateColumns: '1fr 420px', gap: 48 },
  mainMedia: { position: 'relative', aspectRatio: '16/10', borderRadius: 20, overflow: 'hidden', background: '#2F2A26' },
  mediaEl: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  navBtn: { position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', border: 'none', fontSize: 28, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', color: '#111' },
  counter: { position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', padding: '7px 16px', background: 'rgba(0,0,0,0.6)', color: '#fff', borderRadius: 20, fontSize: 14, fontWeight: 600 },
  typeBadge: { position: 'absolute', top: 16, left: 16, padding: '8px 16px', borderRadius: 24, color: '#fff', fontSize: 14, fontWeight: 700 },
  thumbRow: { display: 'flex', gap: 10, marginTop: 14, overflowX: 'auto', paddingBottom: 4 },
  thumb: { flexShrink: 0, width: 80, height: 60, borderRadius: 10, overflow: 'hidden', border: '3px solid transparent', cursor: 'pointer', padding: 0, background: '#2F2A26' },
  thumbImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  vidThumb: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#fff', background: '#2F2A26' },
  noMedia: { aspectRatio: '16/10', borderRadius: 20, background: '#F6F1E9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80, color: '#DDD6C8' },
  badges: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  verifiedBadge: { display: 'inline-block', padding: '7px 14px', background: '#059669', color: '#fff', borderRadius: 20, fontSize: 13, fontWeight: 700 },
  mgmtBadge: { display: 'inline-block', padding: '7px 14px', background: '#1F4E5F', color: '#fff', borderRadius: 20, fontSize: 13, fontWeight: 700 },
  title: { fontSize: 32, fontWeight: 800, color: '#2F2A26', margin: '0 0 8px' },
  location: { fontSize: 16, color: '#6F6A64', margin: '0 0 24px' },
  priceCard: { background: 'linear-gradient(135deg,#f5eedc,#f0fbf9)', borderRadius: 16, padding: 24, marginBottom: 24, border: '2px solid #DDD6C8' },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14, flexWrap: 'wrap' as const },
  priceVal: { fontSize: 34, fontWeight: 800, color: '#2F2A26' },
  priceApprox: { fontSize: 14, color: '#6F6A64', fontWeight: 500 },
  tenureBadge: { display: 'inline-block', padding: '10px 16px', borderRadius: 10, fontSize: 14, fontWeight: 700, marginBottom: 14 },
  yieldRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f5eedc', borderRadius: 10 },
  specs: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 },
  spec: { display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', background: '#F6F1E9', borderRadius: 12, fontSize: 15, fontWeight: 500 },
  amenities: { display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  amenity: { padding: '10px 16px', background: '#FDFAF5', border: '2px solid #DDD6C8', borderRadius: 10, fontSize: 14, fontWeight: 600 },
  desc: { marginBottom: 28 },
  descTitle: { fontSize: 18, fontWeight: 700, color: '#2F2A26', marginBottom: 10 },
  descText: { fontSize: 15, color: '#6F6A64', lineHeight: 1.75 },
  cta: { display: 'flex' },
  ctaWa: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '16px 24px', background: '#25a244', color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 16, textAlign: 'center' as const },
};