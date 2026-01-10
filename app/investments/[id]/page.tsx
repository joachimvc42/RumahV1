'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

type InvestmentData = {
  id: string;
  type: 'villa' | 'land';
  title: string;
  description: string | null;
  location: string;
  price: number;
  currency: string;
  tenure: 'freehold' | 'leasehold';
  leaseYears: number | null;
  expectedYield: number | null;
  legalChecked: boolean;
  managementAvailable: boolean;
  images: string[];
  // Villa specific
  bedrooms?: number;
  bathrooms?: number;
  builtArea?: number;
  landArea?: number;
  pool?: boolean;
  garden?: boolean;
  furnished?: boolean;
  // Land specific
  landSize?: number;
};

function fmtPrice(price: number, currency: string) {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
  }
  return new Intl.NumberFormat('id-ID').format(price) + ' IDR';
}

export default function InvestmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<InvestmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const load = async () => {
      const { data: inv } = await supabase
        .from('investments')
        .select('*')
        .eq('id', id)
        .single();

      if (!inv) {
        setLoading(false);
        return;
      }

      let item: InvestmentData | null = null;

      if (inv.asset_type === 'property') {
        const { data: prop } = await supabase
          .from('properties')
          .select('*')
          .eq('id', inv.asset_id)
          .single();

        if (prop) {
          item = {
            id: inv.id,
            type: 'villa',
            title: prop.title || 'Villa',
            description: prop.description,
            location: prop.location || 'Lombok',
            price: prop.price || 0,
            currency: prop.currency || 'USD',
            tenure: prop.tenure || 'freehold',
            leaseYears: prop.lease_years,
            expectedYield: inv.expected_yield,
            legalChecked: inv.legal_checked,
            managementAvailable: inv.management_available,
            images: prop.images || [],
            bedrooms: prop.bedrooms,
            bathrooms: prop.bathrooms,
            builtArea: prop.built_area,
            landArea: prop.land_area,
            pool: prop.pool,
            garden: prop.garden,
            furnished: prop.furnished,
          };
        }
      } else {
        const { data: land } = await supabase
          .from('lands')
          .select('*')
          .eq('id', inv.asset_id)
          .single();

        if (land) {
          item = {
            id: inv.id,
            type: 'land',
            title: land.title || 'Land',
            description: land.description,
            location: land.location || 'Lombok',
            price: land.price_per_are || 0,
            currency: land.currency || 'IDR',
            tenure: land.tenure || 'freehold',
            leaseYears: land.lease_years,
            expectedYield: inv.expected_yield,
            legalChecked: inv.legal_checked,
            managementAvailable: inv.management_available,
            images: land.images || [],
            landSize: land.land_size,
          };
        }
      }

      setData(item);
      setLoading(false);
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <main style={styles.container}>
        <div style={styles.loading}>Loading...</div>
      </main>
    );
  }

  if (!data) {
    return (
      <main style={styles.container}>
        <div style={styles.notFound}>
          <h1>Opportunity not found</h1>
          <p>This investment opportunity does not exist or is no longer available.</p>
          <Link href="/investments" style={styles.backBtn}>
            ← Back to investments
          </Link>
        </div>
      </main>
    );
  }

  const images = data.images;
  const nextImage = () => setCurrentImage((c) => (c + 1) % images.length);
  const prevImage = () => setCurrentImage((c) => (c - 1 + images.length) % images.length);

  return (
    <main style={styles.container}>
      {/* Back link */}
      <Link href="/investments" style={styles.backLink}>
        ← Back to investments
      </Link>

      <div style={styles.layout}>
        {/* Left: Image Gallery */}
        <div style={styles.gallerySection}>
          {images.length > 0 ? (
            <>
              <div style={styles.mainImage}>
                <img
                  src={images[currentImage]}
                  alt={`${data.title} - Image ${currentImage + 1}`}
                  style={styles.heroImage}
                />
                
                {images.length > 1 && (
                  <>
                    <button onClick={prevImage} style={{ ...styles.navBtn, left: 16 }}>‹</button>
                    <button onClick={nextImage} style={{ ...styles.navBtn, right: 16 }}>›</button>
                    <div style={styles.imageCounter}>{currentImage + 1} / {images.length}</div>
                  </>
                )}

                {/* Badges */}
                <div style={{
                  ...styles.typeBadge,
                  background: data.type === 'villa' ? '#8b5cf6' : '#059669',
                }}>
                  {data.type === 'villa' ? '🏠 Villa' : '🌴 Land'}
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div style={styles.thumbnails}>
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      style={{
                        ...styles.thumbnail,
                        borderColor: i === currentImage ? '#f59e0b' : 'transparent',
                      }}
                    >
                      <img src={img} alt={`Thumbnail ${i + 1}`} style={styles.thumbImg} />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={styles.noImages}>
              <span style={{ fontSize: 64 }}>{data.type === 'villa' ? '🏠' : '🌴'}</span>
              <p>No photos available</p>
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div style={styles.detailsSection}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.badges}>
              {data.legalChecked && (
                <span style={styles.verifiedBadge}>✓ Verified by RumahYa</span>
              )}
              {data.managementAvailable && (
                <span style={styles.mgmtBadge}>🏢 Rental management available</span>
              )}
            </div>
            <h1 style={styles.title}>{data.title}</h1>
            <p style={styles.location}>📍 {data.location}</p>
          </div>

          {/* Price Card */}
          <div style={styles.priceCard}>
            <div style={styles.priceMain}>
              <span style={styles.priceValue}>
                {fmtPrice(data.price, data.currency)}
              </span>
              {data.type === 'land' && <span style={styles.priceUnit}>/are</span>}
            </div>

            {/* Tenure */}
            <div style={styles.tenureRow}>
              <div style={{
                ...styles.tenureBadge,
                background: data.tenure === 'freehold' ? '#dbeafe' : '#fef3c7',
                color: data.tenure === 'freehold' ? '#1e40af' : '#92400e',
              }}>
                {data.tenure === 'freehold' ? '🔑 Freehold - Full ownership' : `📋 Leasehold - ${data.leaseYears} years`}
              </div>
            </div>

            {/* Yield */}
            {data.expectedYield && (
              <div style={styles.yieldSection}>
                <span style={styles.yieldLabel}>Estimated yield</span>
                <span style={styles.yieldValue}>{data.expectedYield}% / year</span>
              </div>
            )}
          </div>

          {/* Features */}
          {data.type === 'villa' && (
            <div style={styles.features}>
              {data.bedrooms && (
                <div style={styles.featureItem}>
                  <span style={styles.featureIcon}>🛏️</span>
                  <span>{data.bedrooms} bedroom{data.bedrooms > 1 ? 's' : ''}</span>
                </div>
              )}
              {data.bathrooms && (
                <div style={styles.featureItem}>
                  <span style={styles.featureIcon}>🚿</span>
                  <span>{data.bathrooms} bathroom{data.bathrooms > 1 ? 's' : ''}</span>
                </div>
              )}
              {data.builtArea && (
                <div style={styles.featureItem}>
                  <span style={styles.featureIcon}>📐</span>
                  <span>{data.builtArea} m²</span>
                </div>
              )}
              {data.landArea && (
                <div style={styles.featureItem}>
                  <span style={styles.featureIcon}>🌍</span>
                  <span>{data.landArea} are</span>
                </div>
              )}
            </div>
          )}

          {data.type === 'land' && data.landSize && (
            <div style={styles.features}>
              <div style={styles.featureItem}>
                <span style={styles.featureIcon}>🌍</span>
                <span>{data.landSize} are of land</span>
              </div>
            </div>
          )}

          {/* Amenities for villa */}
          {data.type === 'villa' && (
            <div style={styles.amenities}>
              {data.pool && <span style={styles.amenity}>🏊 Pool</span>}
              {data.garden && <span style={styles.amenity}>🌳 Garden</span>}
              {data.furnished && <span style={styles.amenity}>🛋️ Furnished</span>}
            </div>
          )}

          {/* Description */}
          {data.description && (
            <div style={styles.description}>
              <h3 style={styles.sectionTitle}>Description</h3>
              <p style={styles.descriptionText}>{data.description}</p>
            </div>
          )}

          {/* CTA */}
          <div style={styles.cta}>
            <a
              href={`mailto:contact@rumahya.com?subject=Investment: ${data.title}`}
              style={styles.ctaBtn}
            >
              📧 Request more info
            </a>
            <a
              href={`https://wa.me/6281234567890?text=Hello, I am interested in the investment: ${encodeURIComponent(data.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.ctaBtnWhatsapp}
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: 24,
  },
  loading: {
    textAlign: 'center',
    padding: 60,
    color: '#6b7280',
  },
  notFound: {
    textAlign: 'center',
    padding: 60,
  },
  backBtn: {
    display: 'inline-block',
    marginTop: 20,
    padding: '12px 24px',
    background: '#f59e0b',
    color: '#fff',
    borderRadius: 10,
    textDecoration: 'none',
    fontWeight: 600,
  },
  backLink: {
    display: 'inline-block',
    marginBottom: 24,
    color: '#6b7280',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: 40,
  },
  gallerySection: {},
  mainImage: {
    position: 'relative',
    aspectRatio: '16/10',
    borderRadius: 20,
    overflow: 'hidden',
    background: '#f3f4f6',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  navBtn: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.9)',
    border: 'none',
    fontSize: 28,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  imageCounter: {
    position: 'absolute',
    bottom: 16,
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '8px 16px',
    background: 'rgba(0,0,0,0.6)',
    color: '#fff',
    borderRadius: 20,
    fontSize: 14,
    fontWeight: 600,
  },
  typeBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    padding: '8px 16px',
    borderRadius: 24,
    color: '#fff',
    fontSize: 14,
    fontWeight: 700,
  },
  thumbnails: {
    display: 'flex',
    gap: 10,
    marginTop: 16,
    overflowX: 'auto',
    paddingBottom: 8,
  },
  thumbnail: {
    flexShrink: 0,
    width: 80,
    height: 60,
    borderRadius: 10,
    overflow: 'hidden',
    border: '3px solid transparent',
    cursor: 'pointer',
    padding: 0,
    background: 'none',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  noImages: {
    aspectRatio: '16/10',
    borderRadius: 20,
    background: '#f3f4f6',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    color: '#9ca3af',
  },
  detailsSection: {},
  header: {
    marginBottom: 24,
  },
  badges: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  verifiedBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    background: '#059669',
    color: '#fff',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
  },
  mgmtBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    background: '#6366f1',
    color: '#fff',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    color: '#111827',
    margin: 0,
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: '#6b7280',
    margin: 0,
  },
  priceCard: {
    background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    border: '2px solid #fde68a',
  },
  priceMain: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 12,
  },
  priceValue: {
    fontSize: 32,
    fontWeight: 800,
    color: '#d97706',
  },
  priceUnit: {
    fontSize: 16,
    color: '#92400e',
  },
  tenureRow: {
    marginBottom: 16,
  },
  tenureBadge: {
    display: 'inline-block',
    padding: '10px 16px',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 700,
  },
  yieldSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    background: '#ecfdf5',
    borderRadius: 10,
  },
  yieldLabel: {
    fontSize: 14,
    color: '#065f46',
  },
  yieldValue: {
    fontSize: 20,
    fontWeight: 800,
    color: '#059669',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    marginBottom: 24,
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 16px',
    background: '#f9fafb',
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 500,
  },
  featureIcon: {
    fontSize: 20,
  },
  amenities: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  amenity: {
    padding: '10px 16px',
    background: '#fff',
    border: '2px solid #e5e7eb',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 500,
  },
  description: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 12,
    color: '#374151',
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 1.7,
    color: '#4b5563',
  },
  cta: {
    display: 'flex',
    gap: 12,
  },
  ctaBtn: {
    flex: 1,
    padding: '16px 24px',
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    color: '#fff',
    borderRadius: 12,
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: 15,
    textAlign: 'center',
    boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)',
  },
  ctaBtnWhatsapp: {
    padding: '16px 24px',
    background: '#25d366',
    color: '#fff',
    borderRadius: 12,
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: 15,
    textAlign: 'center',
  },
};
