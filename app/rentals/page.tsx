'use client';

import { useState } from 'react';
import Link from 'next/link';

// NOTE: Database functionality has been stubbed.
// In the original PHP version, villa listings were fetched from a MySQL database.
// To restore this functionality, implement an API route or server component
// that connects to your database and returns villa listings.

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
  images: string[];
}

// Placeholder data - replace with actual API call
const sampleVillas: Villa[] = [
  {
    id: 1,
    title: 'Modern Villa with Pool',
    location: 'Kuta, Lombok',
    price: '25',
    duration: '6',
    bedrooms: 3,
    bathrooms: 2,
    pool: true,
    garden: true,
    images: ['/assets/lombok.jpg'],
  },
  {
    id: 2,
    title: 'Beachfront Retreat',
    location: 'Selong Belanak',
    price: '35',
    duration: '12',
    bedrooms: 4,
    bathrooms: 3,
    pool: true,
    garden: true,
    images: ['/assets/lombok.jpg'],
  },
];

export default function RentalsPage() {
  const [locationFilter, setLocationFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [minDurationFilter, setMinDurationFilter] = useState('');
  const [minPriceFilter, setMinPriceFilter] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState('');
  const [poolFilter, setPoolFilter] = useState(false);
  const [gardenFilter, setGardenFilter] = useState(false);
  const [finishedFilter, setFinishedFilter] = useState(false);
  const [unfinishedFilter, setUnfinishedFilter] = useState(false);

  // In production, this would filter based on API response
  const villas = sampleVillas;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement filtering logic via API call
    console.log('Filters applied:', {
      locationFilter,
      startDateFilter,
      minDurationFilter,
      minPriceFilter,
      maxPriceFilter,
      poolFilter,
      gardenFilter,
      finishedFilter,
      unfinishedFilter,
    });
  };

  return (
    <>
      <section className="rentals-intro">
        <h1>Long-term rentals</h1>
        <p>Browse villas and houses available for long-term rentals across Lombok. Click a card to see full details.</p>
      </section>

      <section className="rentals-shell">
        <form onSubmit={handleSubmit}>
          <div className="rentals-layout">
            {/* Sidebar */}
            <aside className="rentals-sidebar">
              <h2>Extra filters</h2>
              <div className="filter-checkbox">
                <input
                  type="checkbox"
                  id="filter-pool"
                  checked={poolFilter}
                  onChange={(e) => setPoolFilter(e.target.checked)}
                />
                <label htmlFor="filter-pool">Swimming pool</label>
              </div>
              <div className="filter-checkbox">
                <input
                  type="checkbox"
                  id="filter-garden"
                  checked={gardenFilter}
                  onChange={(e) => setGardenFilter(e.target.checked)}
                />
                <label htmlFor="filter-garden">Garden</label>
              </div>
              <div className="filter-checkbox">
                <input
                  type="checkbox"
                  id="filter-finished"
                  checked={finishedFilter}
                  onChange={(e) => setFinishedFilter(e.target.checked)}
                />
                <label htmlFor="filter-finished">Finished</label>
              </div>
              <div className="filter-checkbox">
                <input
                  type="checkbox"
                  id="filter-unfinished"
                  checked={unfinishedFilter}
                  onChange={(e) => setUnfinishedFilter(e.target.checked)}
                />
                <label htmlFor="filter-unfinished">Unfinished</label>
              </div>
            </aside>

            {/* Main content */}
            <section className="rentals-main">
              {/* Filter bar */}
              <div className="filters-pill">
                {/* WHERE */}
                <div className="filter-segment filter-segment-where">
                  <div className="filter-label-top">Where</div>
                  <div className="filter-input-line">
                    <input
                      type="text"
                      id="filter-location"
                      autoComplete="off"
                      placeholder="Search destinations"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                    />
                  </div>
                </div>

                {/* WHEN */}
                <div className="filter-segment">
                  <div className="filter-label-top">When</div>
                  <div className="filter-input-line filter-input-column">
                    <span className="filter-field-label">Start date</span>
                    <input
                      type="date"
                      id="filter-start-date"
                      value={startDateFilter}
                      onChange={(e) => setStartDateFilter(e.target.value)}
                    />
                  </div>
                  <div className="filter-input-line filter-input-column" style={{ marginTop: '6px' }}>
                    <span className="filter-field-label">Min duration (months)</span>
                    <input
                      type="number"
                      id="filter-min-duration"
                      min="1"
                      max="60"
                      value={minDurationFilter}
                      onChange={(e) => setMinDurationFilter(e.target.value)}
                    />
                  </div>
                </div>

                {/* PRICE */}
                <div className="filter-segment">
                  <div className="filter-label-top">Price</div>
                  <div className="filter-input-line filter-input-column">
                    <span className="filter-field-label">Per month (M IDR)</span>
                    <div className="price-range" style={{ marginTop: '4px', width: '100%' }}>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="Min"
                        value={minPriceFilter}
                        onChange={(e) => setMinPriceFilter(e.target.value)}
                      />
                      <input
                        type="number"
                        step="0.1"
                        placeholder="Max"
                        value={maxPriceFilter}
                        onChange={(e) => setMaxPriceFilter(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* ACTION */}
                <div className="filter-segment-actions">
                  <button type="submit" className="btn btn-primary">Apply filters</button>
                </div>
              </div>

              {/* Results */}
              {villas.length === 0 ? (
                <p style={{ marginTop: '16px' }}>No villas match your criteria.</p>
              ) : (
                <section className="rentals-grid">
                  {villas.map((villa) => (
                    <Link
                      key={villa.id}
                      href={`/villa/${villa.id}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <article className="rental-card">
                        <div className="rental-card-gallery">
                          {villa.images.slice(0, 3).map((img, idx) => (
                            <div key={idx} className="rental-card-thumb">
                              <img src={img} alt={villa.title} />
                            </div>
                          ))}
                        </div>
                        <div className="rental-card-body">
                          <h2 className="rental-card-title">{villa.title}</h2>
                          {villa.location && (
                            <div className="rental-card-location">
                              Location: {villa.location}
                            </div>
                          )}
                          <div className="rental-card-meta">
                            {villa.price && (
                              <span className="rental-pill">Price {villa.price}</span>
                            )}
                            {villa.duration && (
                              <span className="rental-pill">Min {villa.duration} months</span>
                            )}
                            {villa.bedrooms && (
                              <span className="rental-pill">{villa.bedrooms} bedrooms</span>
                            )}
                            {villa.bathrooms && (
                              <span className="rental-pill">{villa.bathrooms} bathrooms</span>
                            )}
                            {villa.pool && (
                              <span className="rental-pill">Pool</span>
                            )}
                            {villa.garden && (
                              <span className="rental-pill">Garden</span>
                            )}
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </section>
              )}
            </section>
          </div>
        </form>
      </section>
    </>
  );
}

