'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

// NOTE: Database functionality has been stubbed.
// In the original PHP version, villa details were fetched from a MySQL database.
// To restore this functionality, implement an API route that connects to your
// database and returns villa details.
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Villa = {
  id: string;
  title: string;
  location: string;
  bedrooms: string;
  bathrooms: string;
  price: string;
  leaseType: string;
  description: string;
  features: string[];
  images: string[];
};

function getVillaById(id: string): Villa | null {
  // Placeholder data - replace with database integration
  const villas: Villa[] = [
    {
      id: '1',
      title: 'Luxury Beachfront Villa',
      location: 'Kuta, Lombok',
      bedrooms: '3',
      bathrooms: '3',
      price: '25',
      leaseType: 'Monthly',
      description:
        'Stunning beachfront villa with panoramic ocean views. Features modern amenities, private pool, and direct beach access. Perfect for long-term stays or investment rental property.',
      features: [
        'Private infinity pool',
        'Direct beach access',
        'Fully furnished',
        'Modern kitchen',
        'Air conditioning',
        'WiFi included',
        'Weekly cleaning service',
      ],
      images: ['/assets/lombok.jpg', '/assets/lombok.jpg', '/assets/lombok.jpg'],
    },
    {
      id: '2',
      title: 'Traditional Lombok Villa',
      location: 'Senggigi, Lombok',
      bedrooms: '2',
      bathrooms: '2',
      price: '18',
      leaseType: 'Monthly',
      description:
        'Beautiful traditional-style villa surrounded by tropical gardens. Combines authentic Lombok architecture with modern comforts. Close to restaurants and amenities while maintaining privacy.',
      features: [
        'Tropical garden',
        'Traditional architecture',
        'Private terrace',
        'Kitchenette',
        'Air conditioning',
        'WiFi included',
        'Garden maintenance',
      ],
      images: ['/assets/lombok.jpg', '/assets/lombok.jpg'],
    },
    {
      id: '3',
      title: 'Modern Hillside Retreat',
      location: 'Selong Belanak, Lombok',
      bedrooms: '4',
      bathrooms: '4',
      price: '35',
      leaseType: 'Monthly',
      description:
        'Contemporary villa perched on a hillside with breathtaking valley and ocean views. Features floor-to-ceiling windows, spacious living areas, and premium finishes throughout.',
      features: [
        'Panoramic views',
        'Modern design',
        'Large swimming pool',
        'Spacious living areas',
        'Premium finishes',
        'Security system',
        'Staff quarters',
      ],
      images: ['/assets/lombok.jpg', '/assets/lombok.jpg', '/assets/lombok.jpg'],
    },
  ];

  return villas.find((v) => v.id === id) || null;
}

function formatPrice(value: string): string {
  if (!value) return '';
  return `${value} Mio IDR / month`;
}

export default function VillaDetailPage({ params }: { params: { id: string } }) {
  const villa = getVillaById(params.id);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (villa?.images?.length) {
      setSelectedImage(villa.images[0]);
    }
  }, [villa?.images]);

  if (!villa) {
    return (
      <main className="page">
        <section className="section">
          <div className="container">
            <h1 className="h1">Villa not found</h1>
            <p className="muted">The requested villa listing does not exist.</p>
            <div style={{ marginTop: 16 }}>
              <Link className="btn btn-primary" href="/villa">
                Back to Villas
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="hero hero--compact">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/villa">Villas</Link>
            <span className="sep">/</span>
            <span>{villa.title}</span>
          </div>

          <h1 className="h1">{villa.title}</h1>
          <p className="lead">{villa.location}</p>

          <div className="hero-actions">
            <Link className="btn btn-primary" href="/contact">
              Request availability
            </Link>
            <Link className="btn btn-ghost" href="/legal-verification">
              Legal verification
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2">
          <div className="card">
            <div className="card-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedImage || villa.images[0]} alt={villa.title} />
            </div>

            {villa.images.length > 1 && (
              <div className="thumbs">
                {villa.images.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    className={`thumb ${selectedImage === img ? 'is-active' : ''}`}
                    onClick={() => setSelectedImage(img)}
                    aria-label={`Select image ${idx + 1}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-body">
              <h2 className="h2">Key details</h2>

              <dl className="details">
                <div className="row">
                  <dt>Location</dt>
                  <dd>{villa.location}</dd>
                </div>
                <div className="row">
                  <dt>Bedrooms</dt>
                  <dd>{villa.bedrooms}</dd>
                </div>
                <div className="row">
                  <dt>Bathrooms</dt>
                  <dd>{villa.bathrooms}</dd>
                </div>
                <div className="row">
                  <dt>Lease type</dt>
                  <dd>{villa.leaseType}</dd>
                </div>
                <div className="row">
                  <dt>Price</dt>
                  <dd>{formatPrice(villa.price)}</dd>
                </div>
              </dl>

              <div className="card-actions">
                <Link className="btn btn-primary" href="/contact">
                  Contact us
                </Link>
                <Link className="btn btn-ghost" href="/villa">
                  Back to listings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card">
            <div className="card-body">
              <h2 className="h2">Description</h2>
              <p className="text">{villa.description}</p>

              <h2 className="h2" style={{ marginTop: 22 }}>
                Features
              </h2>
              <ul className="bullets">
                {villa.features.map((feature, idx) => (
                  <li key={`${feature}-${idx}`}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

interface Villa {
  id: number;
  title: string;
  location: string;
  price: string;
  duration: string;
  bedrooms: number;
  bathrooms: number;
  pool: boolean;
  garden: boolean;
  isFinished: boolean;
  description: string;
  images: string[];
}

// Placeholder function - replace with actual API call
function getVillaById(id: string): Villa | null {
  // TODO: Implement database lookup via API
  return {
    id: parseInt(id),
    title: 'Sample Villa',
    location: 'Kuta, Lombok',
    price: '25',
    duration: '6',
    bedrooms: 3,
    bathrooms: 2,
    pool: true,
    garden: true,
    isFinished: true,
    description: 'Beautiful villa with stunning ocean views, modern amenities, and a private pool. Perfect for long-term stays in Lombok.',
    images: ['/assets/lombok.jpg'],
  };
}

// Calendar component for availability
function AvailabilityCalendar({ villaId }: { villaId: number }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  // NOTE: Unavailable dates would be fetched from an API in production
  const unavailableRanges: { start: Date; end: Date }[] = [];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);
  const startWeekday = firstOfMonth.getDay();

  const isUnavailable = (date: Date): boolean => {
    for (const r of unavailableRanges) {
      const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const s = new Date(r.start.getFullYear(), r.start.getMonth(), r.start.getDate());
      const e = new Date(r.end.getFullYear(), r.end.getMonth(), r.end.getDate());
      if (d >= s && d <= e) {
        return true;
      }
    }
    return false;
  };

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const emptyCells = [];
  for (let i = 0; i < startWeekday; i++) {
    emptyCells.push(<div key={`empty-${i}`} className="av-cal-cell av-cal-cell-empty"></div>);
  }

  const dayCells = [];
  for (let day = 1; day <= lastOfMonth.getDate(); day++) {
    const date = new Date(year, month, day);
    const unavailable = isUnavailable(date);
    const cls = unavailable ? 'av-cal-cell-unavailable' : 'av-cal-cell-available';
    dayCells.push(
      <div key={day} className={`av-cal-cell ${cls}`}>
        {day}
      </div>
    );
  }

  return (
    <div id="availability-calendar">
      <div className="av-cal-header">
        <button type="button" onClick={goToPrevMonth}>&lt;</button>
        <div>{monthNames[month]} {year}</div>
        <button type="button" onClick={goToNextMonth}>&gt;</button>
      </div>
      <div className="av-cal-grid">
        {dayNames.map(d => (
          <div key={d} className="av-cal-dayname">{d}</div>
        ))}
        {emptyCells}
        {dayCells}
      </div>
    </div>
  );
}

export default function VillaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const villa = getVillaById(resolvedParams.id);

  if (!villa) {
    return (
      <main className="container" style={{ marginTop: '40px', marginBottom: '40px' }}>
        <h1>Villa not found</h1>
        <p>The villa you are looking for does not exist or is no longer available.</p>
        <Link href="/rentals" className="btn btn-primary mt-3">
          Back to all villas
        </Link>
      </main>
    );
  }

  const thumbs = villa.images.slice(0, 5);
  const mainImage = thumbs[0] || '/assets/lombok.jpg';

  return (
    <main className="container" style={{ marginTop: '32px', marginBottom: '40px' }}>
      <Link href="/rentals" className="btn btn-secondary mb-3">
        &larr; Back to all villas
      </Link>

      <header className="villa-hero">
        <h1 className="section-title">{villa.title}</h1>
        {villa.location && (
          <p className="section-subtitle">{villa.location}</p>
        )}
      </header>

      {/* Gallery: 5 thumbnails max */}
      {thumbs.length > 0 ? (
        <div className="villa-gallery">
          {thumbs.map((img, idx) => (
            <div key={idx} className="villa-gallery-item">
              <img src={img} alt={villa.title} />
            </div>
          ))}
        </div>
      ) : (
        <div className="villa-gallery">
          <div className="villa-gallery-item">
            <img src={mainImage} alt={villa.title} />
          </div>
        </div>
      )}

      {/* Meta */}
      <section className="villa-meta">
        {villa.price && (
          <div className="villa-meta-item">
            <span className="villa-meta-label">Price</span>
            <span className="villa-meta-value">
              {villa.price} million IDR / month
            </span>
          </div>
        )}

        {villa.duration && (
          <div className="villa-meta-item">
            <span className="villa-meta-label">Minimum term</span>
            <span className="villa-meta-value">
              {villa.duration} months
            </span>
          </div>
        )}

        {villa.bedrooms !== undefined && villa.bedrooms !== null && (
          <div className="villa-meta-item">
            <span className="villa-meta-label">Bedrooms</span>
            <span className="villa-meta-value">{villa.bedrooms}</span>
          </div>
        )}

        {villa.bathrooms !== undefined && villa.bathrooms !== null && (
          <div className="villa-meta-item">
            <span className="villa-meta-label">Bathrooms</span>
            <span className="villa-meta-value">{villa.bathrooms}</span>
          </div>
        )}

        <div className="villa-meta-item">
          <span className="villa-meta-label">Pool</span>
          <span className="villa-meta-value">{villa.pool ? 'Yes' : 'No'}</span>
        </div>

        <div className="villa-meta-item">
          <span className="villa-meta-label">Garden</span>
          <span className="villa-meta-value">{villa.garden ? 'Yes' : 'No'}</span>
        </div>

        <div className="villa-meta-item">
          <span className="villa-meta-label">Status</span>
          <span className="villa-meta-value">{villa.isFinished ? 'Finished' : 'Under construction'}</span>
        </div>
      </section>

      {/* Description */}
      {villa.description && (
        <section className="mt-4">
          <h2 className="section-title">Description</h2>
          <p>{villa.description}</p>
        </section>
      )}

      {/* Availability */}
      <section className="mt-5">
        <h2 className="section-title">Availability</h2>
        <p className="section-subtitle">Grey dates are unavailable.</p>
        <AvailabilityCalendar villaId={villa.id} />
      </section>
    </main>
  );
}

