'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

type PropertyData = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  built_area: number | null;
  land_area: number | null;
  pool: boolean;
  garden: boolean;
  furnished: boolean;
  aircon: boolean;
  wifi: boolean;
  parking: boolean;
  images: string[] | null;
};

type RentalData = {
  id: string;
  min_duration_months: number;
  max_duration_months: number;
  monthly_price_idr: number;
  upfront_months: number;
  legal_checked: boolean;
  available_from: string | null;
  properties: PropertyData | null;
};

function fmtIDR(v: number) {
  return new Intl.NumberFormat('id-ID').format(v);
}

export default function RentalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [rental, setRental] = useState<RentalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const load = async () => {
      // First try to find by property_id (since URL uses property ID)
      let { data } = await supabase
        .from('long_term_rentals')
        .select(`
          *,
          properties (*)
        `)
        .eq('property_id', id)
        .single();

      // If not found, try by rental id
      if (!data) {
        const res = await supabase
          .from('long_term_rentals')
          .select(`
            *,
            properties (*)
          `)
          .eq('id', id)
          .single();
        data = res.data;
      }

      setRental(data as unknown as RentalData);
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

  if (!rental || !rental.properties) {
    return (
      <main style={styles.container}>
        <div style={styles.notFound}>
          <h1>Property not found</h1>
          <p>This property does not exist or is no longer available.</p>
          <Link href="/rentals" style={styles.backBtn}>
            ← Back to rentals
          </Link>
        </div>
      </main>
    );
  }

  const p = rental.properties;
  const images = p.images || [];

  const nextImage = () => setCurrentImage((c) => (c + 1) % images.length);
  const prevImage = () => setCurrentImage((c) => (c - 1 + images.length) % images.length);

  return (
    <main style={styles.container}>
      {/* Back link */}
      <Link href="/rentals" style={styles.backLink}>
        ← Retour aux locations
      </Link>

      <div style={styles.layout}>
        {/* Left: Image Gallery */}
        <div style={styles.gallerySection}>
          {images.length > 0 ? (
            <>
              <div style={styles.mainImage}>
                <img
                  src={images[currentImage]}
                  alt={`${p.title} - Image ${currentImage + 1}`}
                  style={styles.heroImage}
                />
                
                {images.length > 1 && (
                  <>
                    <button onClick={prevImage} style={{ ...styles.navBtn, left: 16 }}>
                      ‹
                    </button>
                    <button onClick={nextImage} style={{ ...styles.navBtn, right: 16 }}>
                      ›
                    </button>
                    <div style={styles.imageCounter}>
                      {currentImage + 1} / {images.length}
                    </div>
                  </>
                )}
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
                        borderColor: i === currentImage ? '#2563eb' : 'transparent',
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
              <span style={{ fontSize: 64 }}>🏠</span>
              <p>No photos available</p>
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div style={styles.detailsSection}>
          {/* Header */}
          <div style={styles.header}>
            {rental.legal_checked && (
              <span style={styles.verifiedBadge}>✓ Verified by RumahYa</span>
            )}
            <h1 style={styles.title}>{p.title}</h1>
            <p style={styles.location}>📍 {p.location || 'Lombok'}</p>
          </div>

          {/* Price Card */}
          <div style={styles.priceCard}>
            <div style={styles.priceMain}>
              <span style={styles.priceValue}>{fmtIDR(rental.monthly_price_idr)}</span>
              <span style={styles.pricePer}>IDR / month</span>
            </div>
            <div style={styles.priceDetails}>
              <span>{rental.min_duration_months}–{rental.max_duration_months} months</span>
              {rental.upfront_months > 0 && (
                <span> • {rental.upfront_months} months upfront</span>
              )}
            </div>
            {rental.available_from && (
              <p style={styles.available}>
                Available from {new Date(rental.available_from).toLocaleDateString('en-US')}
              </p>
            )}
          </div>

          {/* Features */}
          <div style={styles.features}>
            {p.bedrooms && (
              <div style={styles.featureItem}>
                <span style={styles.featureIcon}>🛏️</span>
                <span>{p.bedrooms} bedroom{p.bedrooms > 1 ? 's' : ''}</span>
              </div>
            )}
            {p.bathrooms && (
              <div style={styles.featureItem}>
                <span style={styles.featureIcon}>🚿</span>
                <span>{p.bathrooms} bathroom{p.bathrooms > 1 ? 's' : ''}</span>
              </div>
            )}
            {p.built_area && (
              <div style={styles.featureItem}>
                <span style={styles.featureIcon}>📐</span>
                <span>{p.built_area} m²</span>
              </div>
            )}
            {p.land_area && (
              <div style={styles.featureItem}>
                <span style={styles.featureIcon}>🌍</span>
                <span>{p.land_area} are of land</span>
              </div>
            )}
          </div>

          {/* Amenities */}
          <div style={styles.amenities}>
            {p.pool && <span style={styles.amenity}>🏊 Pool</span>}
            {p.garden && <span style={styles.amenity}>🌳 Garden</span>}
            {p.furnished && <span style={styles.amenity}>🛋️ Furnished</span>}
            {p.aircon && <span style={styles.amenity}>❄️ Air conditioning</span>}
            {p.wifi && <span style={styles.amenity}>📶 WiFi</span>}
            {p.parking && <span style={styles.amenity}>🚗 Parking</span>}
          </div>

          {/* Description */}
          {p.description && (
            <div style={styles.description}>
              <h3 style={styles.sectionTitle}>Description</h3>
              <p style={styles.descriptionText}>{p.description}</p>
            </div>
          )}

          {/* CTA */}
          <div style={styles.cta}>
            <a
              href={`mailto:contact@rumahya.com?subject=Interested in ${p.title}`}
              style={styles.ctaBtn}
            >
              📧 Contact RumahYa
            </a>
            <a
              href={`https://wa.me/6281234567890?text=Hello, I am interested in ${encodeURIComponent(p.title)}`}
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
    padding: '24px',
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
    background: '#2563eb',
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
  verifiedBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    background: '#059669',
    color: '#fff',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 12,
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
    background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    border: '2px solid #d1fae5',
  },
  priceMain: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 8,
  },
  priceValue: {
    fontSize: 32,
    fontWeight: 800,
    color: '#059669',
  },
  pricePer: {
    fontSize: 16,
    color: '#6b7280',
  },
  priceDetails: {
    fontSize: 14,
    color: '#374151',
  },
  available: {
    marginTop: 12,
    fontSize: 14,
    color: '#2563eb',
    fontWeight: 600,
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
    background: 'linear-gradient(135deg, #2563eb, #059669)',
    color: '#fff',
    borderRadius: 12,
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: 15,
    textAlign: 'center',
    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
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
