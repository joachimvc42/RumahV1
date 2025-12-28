'use client';

import { useState } from 'react';
import Link from 'next/link';

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

// Placeholder data
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

  const villas = sampleVillas;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filtering logic will be implemented via API later
  };

  return (
    <>
      {/* INTRO */}
      <section className="rentals-intro">
        <h1>Long-term rentals in Lombok</h1>
        <p>
          RumahYa assists expatriates seeking long-term rentals (1 to 10 years)
          by verifying properties locally and coordinating secure rental execution.
        </p>
        <p className="muted">
          Many rentals require one to three years paid upfront. We help reduce
          this risk by acting as a trusted local intermediary.
        </p>
      </section>

      <section className="rentals-shell">
        <form onSubmit={handleSubmit}>
          <div className="rentals-layout">

            {/* SIDEBAR */}
            <aside className="rentals-sidebar">
              <h2>Additional criteria</h2>

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
                <label htmlFor="filter-unfinished">Under construction</label>
              </div>
            </aside>

            {/* MAIN */}
            <section className="rentals-main">

              {/* FILTER BAR */}
              <div className="filters-pill">

                <div className="filter-segment filter-segment-where">
                  <div className="filter-label-top">Location</div>
                  <div className="filter-input-line">
                    <input
                      type="text"
                      placeholder="Area or village"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                    />
                  </div>
                </div>

                <div className="filter-segment">
                  <div className="filter-label-top">Timing</div>

                  <div className="filter-input-line filter-input-column">
                    <span className="filter-field-label">Start date</span>
                    <input
                      type="date"
                      value={startDateFilter}
                      onChange={(e) => setStartDateFilter(e.target.value)}
                    />
                  </div>

                  <div className="filter-input-line filter-input-column" style={{ marginTop: 6 }}>
                    <span className="filter-field-label">Minimum duration (months)</span>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={minDurationFilter}
                      onChange={(e) => setMinDurationFilter(e.target.value)}
                    />
                  </div>
                </div>

                <div className="filter-segment">
                  <div className="filter-label-top">Budget</div>
                  <span className="filter-field-label">Monthly rent (M IDR)</span>

                  <div className="price-range">
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

                <div className="filter-segment-actions">
                  <button type="submit" className="btn btn-primary">
                    Apply filters
                  </button>
                </div>
              </div>

              {/* RESULTS */}
              {villas.length === 0 ? (
                <p className="muted" style={{ marginTop: 20 }}>
                  No properties match your criteria.
                </p>
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

                          <div className="rental-card-location">
                            {villa.location}
                          </div>

                          <div className="rental-card-meta">
                            <span className="rental-pill">
                              {villa.price} Mio IDR / month
                            </span>
                            <span className="rental-pill">
                              Min. {villa.duration} months
                            </span>
                            <span className="rental-pill">
                              {villa.bedrooms} bedrooms
                            </span>
                            <span className="rental-pill">
                              {villa.bathrooms} bathrooms
                            </span>
                            {villa.pool && <span className="rental-pill">Pool</span>}
                            {villa.garden && <span className="rental-pill">Garden</span>}
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
