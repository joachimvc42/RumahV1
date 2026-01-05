import Link from 'next/link';

export default function PropertyManagementPage() {
  return (
    <div className="container">
      <div className="section-header">
        <h1 className="section-title">Property management, made simple.</h1>
        <p className="section-subtitle">
          For owners living abroad, RumahYa provides full-service management for villas and houses in Lombok.
          We act as your local team on the ground so you don&apos;t have to.
        </p>
      </div>

      <div className="section-block">
        <h2>What we take care of</h2>
        <div className="card-grid">
          <div className="card">
            <h3 className="card-title">Operations &amp; guests</h3>
            <p className="card-text">
              Check-ins and check-outs, guest communication, troubleshooting and day-to-day coordination with staff.
              Your guests feel looked after, you receive clear updates.
            </p>
          </div>
          <div className="card">
            <h3 className="card-title">Staff &amp; maintenance</h3>
            <p className="card-text">
              Coordination of cleaning teams, gardeners and maintenance. We help keep your property in good shape
              and follow-up on repairs with transparent reporting.
            </p>
          </div>
          <div className="card">
            <h3 className="card-title">Performance &amp; reporting</h3>
            <p className="card-text">
              Monthly summaries of bookings, revenue and costs. We can advise on pricing and positioning for
              both long-term and seasonal rentals.
            </p>
          </div>
        </div>
      </div>

      <div className="section-block">
        <h2>Fee structure</h2>
        <p>
          Our standard management fee ranges from <strong>20% to 25% of gross rental revenue</strong>,
          depending on the level of involvement and services required.
        </p>
        <p>
          For long-term contracts (1-year+ tenants), we can discuss a fixed monthly fee combined with
          a smaller success commission on new tenant placements.
        </p>
      </div>

      <div className="section-block">
        <h2>Is RumahYa a good fit for you?</h2>
        <p>
          We are a good fit if:
        </p>
        <ul>
          <li>You own a villa or house in Lombok but live abroad.</li>
          <li>You want a local partner who speaks both Bahasa Indonesia and English/French.</li>
          <li>You want clear communication and transparent reporting instead of surprises.</li>
        </ul>
        <p style={{ marginTop: '10px' }}>
          If that sounds like you, let&apos;s start with a short call to understand your property, your expectations
          and the type of guests you want to attract.
        </p>
        <Link href="/contact" className="btn btn-primary" style={{ marginTop: '10px' }}>
          Talk to us about management
        </Link>
      </div>
    </div>
  );
}

