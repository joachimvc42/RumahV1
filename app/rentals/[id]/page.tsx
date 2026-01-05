import Link from 'next/link';
import { getRentalById } from '@/data/rentals';

function formatPrice(value: string): string {
  return `${value} Mio IDR / month`;
}

export default function RentalDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const rental = getRentalById(params.id);

  if (!rental) {
    return (
      <main className="page">
        <section className="section">
          <div className="container">
            <h1 className="h1">Rental not found</h1>
            <p className="muted">
              This rental property is no longer available.
            </p>
            <Link href="/rentals" className="btn btn-primary">
              Back to rental listings
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page">

      {/* HERO */}
      <section className="hero hero--compact">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/rentals">Long-term rentals</Link>
            <span className="sep">/</span>
            <span>{rental.title}</span>
          </div>

          <h1 className="h1">{rental.title}</h1>
          <p className="lead">{rental.location}</p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="section">
        <div className="container grid grid-2">

          {/* IMAGE */}
          <div className="card">
            <div className="card-media">
              <img src={rental.images[0]} alt={rental.title} />
            </div>
          </div>

          {/* DETAILS */}
          <div className="card">
            <div className="card-body">
              <h2 className="h2">Rental details</h2>

              <dl className="details">
                <div className="row">
                  <dt>Location</dt>
                  <dd>{rental.location}</dd>
                </div>
                <div className="row">
                  <dt>Bedrooms</dt>
                  <dd>{rental.bedrooms}</dd>
                </div>
                <div className="row">
                  <dt>Bathrooms</dt>
                  <dd>{rental.bathrooms}</dd>
                </div>
                <div className="row">
                  <dt>Monthly rent</dt>
                  <dd>{formatPrice(rental.price)}</dd>
                </div>
                <div className="row">
                  <dt>Minimum duration</dt>
                  <dd>{rental.duration} months</dd>
                </div>
                <div className="row">
                  <dt>Swimming pool</dt>
                  <dd>{rental.pool ? 'Yes' : 'No'}</dd>
                </div>
                <div className="row">
                  <dt>Garden</dt>
                  <dd>{rental.garden ? 'Yes' : 'No'}</dd>
                </div>
              </dl>

              <p className="muted" style={{ marginTop: 16 }}>
                RumahYa acts as your local intermediary to help secure and
                manage your rental agreement.
              </p>

              <div className="card-actions">
                <Link href="/contact" className="btn btn-primary">
                  Enquire about this rental
                </Link>
                <Link href="/rentals" className="btn btn-secondary">
                  Back to rentals
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DESCRIPTION */}
      <section className="section">
        <div className="container">
          <div className="card">
            <div className="card-body">
              <h2 className="h2">Property description</h2>
              <p>{rental.description}</p>

              <h3 className="h3" style={{ marginTop: 20 }}>
                Features included
              </h3>
              <ul className="bullets">
                {rental.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>

              <p className="muted" style={{ marginTop: 20 }}>
                Long-term rentals in Lombok often require significant upfront
                payments. We help you navigate this process safely.
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

