'use client';

import { useState } from 'react';
import Link from 'next/link';
import { rentals } from '@/data/rentals';

export default function RentalsPage() {
  const [locationFilter, setLocationFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [minDurationFilter, setMinDurationFilter] = useState('');
  const [minPriceFilter, setMinPriceFilter] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState('');
  const [poolFilter, setPoolFilter] = useState(false);
  const [gardenFilter, setGardenFilter] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <section className="rentals-intro container">
        <h1>Long-term rentals in Lombok</h1>
        <p>
          Long-term rentals in Lombok often require significant upfront payments.
          RumahYa helps expatriates reduce uncertainty by acting as a local intermediary
          before and during the rental process.
        </p>
        <p className="muted">
          Minimum rental duration starts from one month and can extend up to ten years,
          depending on the property and agreement structure.
        </p>
      </section>

      <section className="rentals-shell container">
        <form onSubmit={handleSubmit}>
          <div className="rentals-layout">
            {/* Sidebar */}
            <aside className="rentals-sidebar">
              <h2>Extra filters</h2>
              <div className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={poolFilter}
                  onChange={(e) => setPoolFilter(e.target.checked)}
                />
                <label>Swimming pool</label>
              </div>
              <div className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={gardenFilter}
                  onChange={(e) => setGardenFilter(e.target.checked)}
                />
                <label>Garden</label>
              </div>
            </aside>

            {/* Main */}
            <section className="rentals-main">
              <div className="filters-pill">
                <div className="filter-segment">
                  <div className="filter-label-top">Where</div>
                  <input
                    type="text"
                    placeholder="Search locations"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  />
                </div>

                <div className="filter-segment">
                  <div className="filter-label-top">When</div>
                  <input
                    type="date"
                    value={startDateFilter}
                    onChange={(e) => setStartDateFilter(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Minimum rental duration (months)"
                    value={minDurationFilter}
                    onChange={(e) => setMinDurationFilter(e.target.value)}
                  />
                </div>

                <div className="filter-segment">
                  <div className="filter-label-top">Monthly rent (M IDR)</div>
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPriceFilter}
                    onChange={(e) => setMinPriceFilter(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPriceFilter}
                    onChange={(e) => setMaxPriceFilter(e.target.value)}
                  />
                </div>

                <div className="filter-segment-actions">
                  <button type="submit" className="btn btn-primary">
                    Apply filters
                  </button>
                </div>
              </div>

              <section className="rentals-grid">
                {rentals.map((rental) => (
                  <Link
                    key={rental.id}
                    href={`/rentals/${rental.id}`}
                    className="rental-card"
                  >
                    <div className="rental-card-image">
                      <img src={rental.images[0]} alt={rental.title} />
                      <div className="rental-card-overlay">
                        <span className="rental-card-badge">{rental.duration}+ months</span>
                      </div>
                    </div>
                    <div className="rental-card-content">
                      <h2 className="rental-card-title">{rental.title}</h2>
                      <p className="rental-card-location">{rental.location}</p>
                      <div className="rental-card-features">
                        <span>{rental.bedrooms} bed</span>
                        <span>{rental.bathrooms} bath</span>
                        {rental.pool && <span>Pool</span>}
                        {rental.garden && <span>Garden</span>}
                      </div>
                      <p className="rental-card-price">{rental.price} M IDR<span>/month</span></p>
                    </div>
                  </Link>
                ))}
              </section>
            </section>
          </div>
        </form>
      </section>
    </>
  );
}
