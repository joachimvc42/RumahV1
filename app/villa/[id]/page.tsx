'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

// NOTE: Database functionality has been stubbed.
// In the original PHP version, villa details were fetched from a MySQL database.
// To restore this functionality, implement an API route that connects to your
// database and returns villa details.

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

