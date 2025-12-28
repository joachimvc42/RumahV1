'use client';

import { useState } from 'react';

// NOTE: Database functionality has been stubbed.
// In the original PHP version, land listings were fetched from a MySQL database.
// To restore this functionality, implement an API route or server component
// that connects to your database and returns land listings.

interface Land {
  id: number;
  title: string;
  location: string;
  area: number;
  price: string;
  tenure: string;
  hasWater: boolean;
  hasElectricity: boolean;
  hasRoad: boolean;
  isVirgin: boolean;
  image: string;
}

// Placeholder data - replace with actual API call
const sampleLands: Land[] = [
  {
    id: 1,
    title: 'Beachfront plot in Kuta',
    location: 'Kuta, Lombok',
    area: 10,
    price: '150M',
    tenure: 'leasehold',
    hasWater: true,
    hasElectricity: true,
    hasRoad: true,
    isVirgin: false,
    image: '/assets/lombok.jpg',
  },
  {
    id: 2,
    title: 'Hillside land with ocean view',
    location: 'Selong Belanak',
    area: 15,
    price: '120M',
    tenure: 'freehold',
    hasWater: true,
    hasElectricity: false,
    hasRoad: true,
    isVirgin: true,
    image: '/assets/lombok.jpg',
  },
];

export default function LandPage() {
  const [locationFilter, setLocationFilter] = useState('');
  const [minAreaFilter, setMinAreaFilter] = useState('');
  const [minPriceFilter, setMinPriceFilter] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState('');
  const [waterFilter, setWaterFilter] = useState(false);
  const [electricityFilter, setElectricityFilter] = useState(false);
  const [roadFilter, setRoadFilter] = useState(false);
  const [freeholdFilter, setFreeholdFilter] = useState(false);
  const [leaseholdFilter, setLeaseholdFilter] = useState(false);

  // In production, this would filter based on API response
  const lands = sampleLands;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement filtering logic via API call
    console.log('Filters applied:', {
      locationFilter,
      minAreaFilter,
      minPriceFilter,
      maxPriceFilter,
      waterFilter,
      electricityFilter,
      roadFilter,
      freeholdFilter,
      leaseholdFilter,
    });
  };

  return (
    <>
      <section className="land-intro">
        <h1>Land</h1>
        <p className="section-subtitle">
          Hand-picked plots of land across Lombok. Click a card to see key details
          about size, tenure and utilities.
        </p>
      </section>

      <section className="land-shell">
        <form onSubmit={handleSubmit}>
          <div className="land-layout">
            {/* Sidebar */}
            <aside className="land-sidebar">
              <h2>Extra filters</h2>
              <div className="filter-checkbox">
                <input
                  type="checkbox"
                  id="filter-water"
                  checked={waterFilter}
                  onChange={(e) => setWaterFilter(e.target.checked)}
                />
                <label htmlFor="filter-water">Water</label>
              </div>
              <div className="filter-checkbox">
                <input
                  type="checkbox"
                  id="filter-electricity"
                  checked={electricityFilter}
                  onChange={(e) => setElectricityFilter(e.target.checked)}
                />
                <label htmlFor="filter-electricity">Electricity</label>
              </div>
              <div className="filter-checkbox">
                <input
                  type="checkbox"
                  id="filter-road"
                  checked={roadFilter}
                  onChange={(e) => setRoadFilter(e.target.checked)}
                />
                <label htmlFor="filter-road">Road access</label>
              </div>
              <div className="filter-checkbox">
                <input
                  type="checkbox"
                  id="filter-freehold"
                  checked={freeholdFilter}
                  onChange={(e) => setFreeholdFilter(e.target.checked)}
                />
                <label htmlFor="filter-freehold">Freehold</label>
              </div>
              <div className="filter-checkbox">
                <input
                  type="checkbox"
                  id="filter-leasehold"
                  checked={leaseholdFilter}
                  onChange={(e) => setLeaseholdFilter(e.target.checked)}
                />
                <label htmlFor="filter-leasehold">Leasehold</label>
              </div>
            </aside>

            {/* Main content */}
            <section className="land-main">
              {/* Filter bar */}
              <div className="land-filters-pill">
                {/* WHERE */}
                <div className="land-filter-segment land-filter-segment-where">
                  <div className="land-filter-label-top">Where</div>
                  <div className="land-filter-input-line">
                    <input
                      type="text"
                      id="land-filter-location"
                      autoComplete="off"
                      placeholder="Search areas in Lombok"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                    />
                  </div>
                </div>

                {/* AREA */}
                <div className="land-filter-segment">
                  <div className="land-filter-label-top">Area</div>
                  <div className="land-filter-input-line">
                    <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Minimum size</span>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={minAreaFilter}
                      onChange={(e) => setMinAreaFilter(e.target.value)}
                    />
                    <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>are</span>
                  </div>
                </div>

                {/* PRICE */}
                <div className="land-filter-segment">
                  <div className="land-filter-label-top">Price</div>
                  <div className="land-filter-input-line">
                    <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Per are (M IDR)</span>
                  </div>
                  <div className="land-filter-input-line" style={{ marginTop: '4px' }}>
                    <div className="land-price-range">
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
                <div className="land-filter-actions">
                  <button type="submit" className="btn btn-primary">Apply filters</button>
                </div>
              </div>

              {/* Results */}
              {lands.length === 0 ? (
                <p style={{ marginTop: '16px' }}>No land plots match your criteria yet.</p>
              ) : (
                <section className="land-grid">
                  {lands.map((land) => (
                    <article key={land.id} className="property-card">
                      <img
                        src={land.image}
                        alt={land.title}
                        className="property-card-img"
                      />
                      <div className="property-card-body">
                        <h2 className="property-card-title">{land.title}</h2>
                        {land.location && (
                          <div className="property-card-location">{land.location}</div>
                        )}
                        <div className="property-card-meta">
                          {land.area > 0 && (
                            <span className="badge-soft">{land.area} are</span>
                          )}
                          {land.tenure && (
                            <span className="badge-soft">{land.tenure}</span>
                          )}
                          {land.hasElectricity && (
                            <span className="badge-soft">Electricity</span>
                          )}
                          {land.hasWater && (
                            <span className="badge-soft">Water</span>
                          )}
                          {land.hasRoad && (
                            <span className="badge-soft">Road access</span>
                          )}
                          {land.isVirgin && (
                            <span className="badge-soft">Virgin land</span>
                          )}
                        </div>
                        <div className="property-card-price">
                          {land.price && <>Price {land.price} / are</>}
                        </div>
                      </div>
                    </article>
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

