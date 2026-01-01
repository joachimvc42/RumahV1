import Link from 'next/link';

export default function InvestmentsPage() {
  return (
    <main className="page">
      <section className="section hero">
        <div className="container hero-inner">
          <h1 className="h1">
            Invest in Lombok<br />
            with local insight and clarity
          </h1>
          <p className="lead">
            RumahYa works with long-term investors by providing local context,
            access to opportunities, and on-the-ground coordination in Lombok.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="h2">A local partner for serious investors</h2>
          <p className="text">
            Investing in Lombok requires local understanding.
            RumahYa acts as a local intermediary to help investors
            assess opportunities and move forward with clarity.
          </p>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container grid grid-3">
          <div className="card">
            <h3>Land investment</h3>
            <ul className="bullets">
              <li>Freehold or long-term lease</li>
              <li>Zoning and buildability review</li>
              <li>Access and utilities</li>
            </ul>
            <Link href="/land" className="btn btn-ghost">
              View land
            </Link>
          </div>

          <div className="card">
            <h3>Villa investment</h3>
            <ul className="bullets">
              <li>Purchase or lease structures</li>
              <li>Rental potential assessment</li>
              <li>Existing or off-plan projects</li>
            </ul>
            <Link href="/villa" className="btn btn-ghost">
              View villas
            </Link>
          </div>

          <div className="card">
            <h3>Property management</h3>
            <ul className="bullets">
              <li>Local supervision</li>
              <li>Maintenance coordination</li>
              <li>Tenant interface</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="h2">Important note</h2>
          <p className="text">
            RumahYa facilitates access to information but does not provide legal advice
            and does not act as a notary or legal representative.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container cta-center">
          <h2 className="h2">Discuss an investment</h2>
          <p className="text">
            Each situation is different. We start with a conversation.
          </p>
          <Link href="/contact" className="btn btn-primary">
            Contact RumahYa
          </Link>
        </div>
      </section>
    </main>
  );
}
