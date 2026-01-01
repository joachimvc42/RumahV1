'use client';

import { useState } from 'react';

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

// Placeholder data
const sampleLands: Land[] = [
  {
    id: 1,
    title: 'Beachfront investment plot',
    location: 'Kuta, Lombok',
    area: 10,
    price: '150',
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
    price: '120',
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

  const lands = sampleLands;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filtering logic will be implemented via API later
  };

  return (
    <>
      {/* INTRO */}
      <section className="land-intro">
        <h1>Investing in land in Lombok</h1>
        <p className="section-subtitle">
          Selected land opportunities for long-term investment projects.
          All plots are reviewed locally and suitable for structured transactions.
        </p>
        <p className="muted">
          RumahYa assists investors by coordinating verification, tenure review,
          and transaction execution through local professionals.
        </p>
      </section>

      <section className="land-shell">
        <form onSubmit={handleSubmit}>
          <div className="land-layout">

            {/* SIDEBAR */}
            <aside className="land-sidebar">
              <h2>Investment criteria</h2>

              <div className="filter-checkbox">
                <input
                  type="checkbox"
                  id="filter-water"
                  checked={waterFilter}
                  onChange={(e) => setWaterFilter(e.target.checked)}
                />
                <label htmlFor="filter-water">Water access</label>
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

            {/* MAIN */}
            <section className="land-main">

              {/* FILTER BAR */}
              <div className="land-filters-pill">

                <div className="land-filter-segment land-filter-segment-where">
                  <div className="land-filter-label-top">Location</div>
                  <div className="land-filter-input-line">
                    <input
                      type="text"
                      placeholder="Area or region"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                    />
                  </div>
                </div>

                <div className="land-filter-segment">
                  <div className="land-filter-label-top">Minimum size</div>
                  <div className="land-filter-input-line">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={minAreaFilter}
                      onChange={(e) => setMinAreaFilter(e.target.value)}
                    />
                    <span className="unit">are</span>
                  </div>
                </div>

                <div className="land-filter-segment">
                  <div className="land-filter-label-top">Price range</div>
                  <span className="filter-field-label">Per are (M IDR)</span>

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

                <div className="land-filter-actions">
                  <button type="submit" className="btn btn-primary">
                    Apply filters
                  </button>
                </div>
              </div>

              {/* RESULTS */}
              {lands.length === 0 ? (
                <p className="muted" style={{ marginTop: 20 }}>
                  No land opportunities currently match your criteria.
                </p>
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

                        <div className="property-card-location">
                          {land.location}
                        </div>

                        <div className="property-card-meta">
                          <span className="badge-soft">{land.area} are</span>
                          <span className="badge-soft">{land.tenure}</span>
                          {land.hasWater && <span className="badge-soft">Water</span>}
                          {land.hasElectricity && <span className="badge-soft">Electricity</span>}
                          {land.hasRoad && <span className="badge-soft">Road access</span>}
                          {land.isVirgin && <span className="badge-soft">Virgin land</span>}
                        </div>

                        <div className="property-card-price">
                          {land.price} Mio IDR / are
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
