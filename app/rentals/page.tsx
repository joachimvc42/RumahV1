'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Villa {
  id: number;
  title: string;
  location: string;
  price: string; // Mio IDR / month
  minDuration: number; // months
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
    minDuration: 3,
    bedrooms: 3,
    bathrooms: 2,
    pool: true,
    garden: true,
    images: ['/assets/lombok.jpg'],
  },
  {
    id: 2,
    title: 'Quiet Long-term Villa',
    location: 'Senggigi, Lombok',
    price: '18',
    minDuration: 1,
    bedrooms: 2,
    bathrooms: 2,
    pool: false,
    garden: true,
    images: ['/assets/lombok.jpg'],
  },
];

export default function RentalsPage() {
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [minDuration, setMinDuration] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [pool, setPool] = useState(false);
  const [garden, setGarden] = useState(false);

  const villas = sampleVillas;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API filtering later
  };

  return (
    <main className="page">
      {/* INTRO */}
      <section className="section section-soft">
        <div className="container">
          <h1 className="h1">Long-term rentals in Lombok</h1>
          <p className="lead">
            Many rentals in Lombok require <strong>1 to 2 years paid upfront</strong>.
            We help reduce this risk by acting as a trusted local intermediary,
            verifying owners and documents before you commit.
          </p>
          <p className="muted">
            Ideal for expatriates looking to rent for <strong>1 month up to 10 years</strong>,
            including those securing a home before arriving in Indonesia.
          </p>
        </div>
      </section>

      {/* SEARCH */}
      <section className="section">
        <div className="container">
          <form onSubmit={handleSubmit} className="search-pill">
            {/* WHERE */}
            <div className="search-segment">
              <span className="search-label">Location</span>
              <input
                type="text"
                placeholder="Area or village"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* WHEN */}
            <div className="search-segment">
              <span className="search-label">Start</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* DURATION */}
            <div className="search-segment">
              <span className="search-label">Minimum stay</span>
              <input
                type="number"
                min="1"
                max="120"
                placeholder="Months"
                value={minDuration}
                onChange={(e) => setMinDuration(e.target.value)}
              />
            </div>

            {/* PRICE */}
            <div className="search-segment">
              <span className="search-label">Budget (M IDR / month)</span>
              <div className="price-range">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            {/* ACTION */}
            <div className="search-action">
              <button className="btn btn-primary" type="submit">
                Apply filters
              </button>
            </div>
          </form>

          {/* EXTRA FILTERS */}
          <div className="extra-filters">
            <label>
              <input
                type="checkbox"
                checked={pool}
                onChange={(e) => setPool(e.target.checked)}
              />
              Swimming pool
            </label>

            <label>
              <input
                type="checkbox"
                checked={garden}
                onChange={(e) => setGarden(e.target.checked)}
              />
              Garden
            </label>
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="section">
        <div className="container grid grid-3">
          {villas.map((villa) => (
            <Link
              key={villa.id}
              href={`/villa/${villa.id}`}
              className="card property-card"
            >
              <img src={villa.images[0]} alt={villa.title} />
              <div className="card-body">
                <h2 className="h3">{villa.title}</h2>
                <p className="muted">{villa.location}</p>

                <div className="badges">
                  <span>{villa.price} M IDR / month</span>
                  <span>Min {villa.minDuration} month(s)</span>
                  <span>{villa.bedrooms} bd</span>
                  <span>{villa.bathrooms} ba</span>
                  {villa.pool && <span>Pool</span>}
                  {villa.garden && <span>Garden</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
