import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="page">
      {/* HERO */}
      <section className="section hero">
        <div className="container hero-inner">
          <h1 className="h1">
            A trusted local partner<br />
            for living and investing in Lombok
          </h1>
          <p className="lead">
            RumahYa helps expatriates secure long-term rentals safely,
            and investors access verified land and villa opportunities
            with local insight and clarity.
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
                without taking unnecessary risks.
              </p>
              <ul className="bullets">
                <li>Rent from 1 month to 10 years</li>
                <li>Reduced upfront exposure</li>
                <li>Verified local contacts</li>
                <li>Ideal before or after relocation</li>
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
                Carefully selected land and villas for long-term investors
                looking for exposure to Lombok with local oversight.
              </p>
              <ul className="bullets">
                <li>Land & villas (purchase or long-term lease)</li>
                <li>Due diligence & document review</li>
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
              <li>Based in Lombok, not remote</li>
              <li>Local partners and on-the-ground presence</li>
              <li>Clear communication, no hidden agenda</li>
            </ul>
            <ul className="bullets">
              <li>Independent verification possible</li>
              <li>Focus on long-term relationships</li>
              <li>Human-scale, not mass-market</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section">
        <div className="container cta-center">
          <h2 className="h2">Start with a conversation</h2>
          <p className="text">
            Whether you plan to live in Lombok or invest long-term,
            we start with understanding your situation.
          </p>
          <Link href="/contact" className="btn btn-primary">
            Contact RumahYa
          </Link>
        </div>
      </section>
    </main>
  );
}
