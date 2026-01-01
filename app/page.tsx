import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="page">
      {/* HERO */}
      <section className="section hero">
        <div className="container hero-inner">
          <h1 className="h1">
            A local point of contact for long-term living<br />
            and investment in Lombok
          </h1>
          <p className="lead">
            RumahYa acts as a local intermediary for expatriates seeking long-term rentals
            and investors exploring land or villa opportunities in Lombok.
          </p>
        </div>
      </section>

      {/* PATHS */}
      <section className="section">
        <div className="container grid grid-2">
          {/* Rentals */}
          <div className="card path-card">
            <div className="card-body">
              <h2 className="h2">Live in Lombok</h2>
              <p className="text">
                Long-term rentals for expatriates who want to live in Lombok
                while reducing uncertainty and unnecessary upfront exposure.
              </p>
              <ul className="bullets">
                <li>Rental terms from 1 month to 10 years</li>
                <li>Local intermediary support</li>
                <li>Reduced upfront risk</li>
                <li>Suitable before or after relocation</li>
              </ul>
              <Link href="/rentals" className="btn btn-primary">
                Browse rentals
              </Link>
            </div>
          </div>

          {/* Investments */}
          <div className="card path-card">
            <div className="card-body">
              <h2 className="h2">Invest in Lombok</h2>
              <p className="text">
                Land and villa opportunities for long-term investors
                looking for local context, coordination and clarity.
              </p>
              <ul className="bullets">
                <li>Land and villa investment opportunities</li>
                <li>Purchase or long-term lease structures</li>
                <li>Local coordination</li>
                <li>Optional property management</li>
              </ul>
              <Link href="/investments" className="btn btn-ghost">
                View investments
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="section section-soft">
        <div className="container">
          <h2 className="h2">Why RumahYa</h2>
          <p className="lead">
            Lombok offers opportunities, but local context matters.
          </p>

          <div className="grid grid-2">
            <ul className="bullets">
              <li>Based in Lombok</li>
              <li>Local partners and on-the-ground presence</li>
              <li>Clear and direct communication</li>
            </ul>
            <ul className="bullets">
              <li>Independent verification possible</li>
              <li>Long-term relationship focus</li>
              <li>Human-scale approach</li>
            </ul>
          </div>

          <p className="muted" style={{ marginTop: '16px' }}>
            RumahYa does not replace legal, notarial or tax professionals.
            Independent verification is always recommended.
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section">
        <div className="container cta-center">
          <h2 className="h2">Start with a conversation</h2>
          <p className="text">
            Whether you plan to live in Lombok or invest long-term,
            we begin by understanding your situation.
          </p>
          <Link href="/contact" className="btn btn-primary">
            Contact RumahYa
          </Link>
        </div>
      </section>
    </main>
  );
}
