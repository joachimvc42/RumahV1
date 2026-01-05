import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="page">
      {/* HERO */}
      <section className="section hero">
        <div className="container">
          <h1 className="h1 hero-headline">
            A local point of contact for long-term living<br />
            and investment in Lombok
          </h1>
        </div>
      </section>

      {/* POSITIONING */}
      <section className="section">
        <div className="container">
          <p className="lead">
            RumahYa supports expatriates and investors by providing
            local context, verified information, and long-term coordination
            for property projects in Lombok.
          </p>
        </div>
      </section>

      {/* PATHS */}
      <section className="section">
        <div className="container grid grid-2">
          {/* LIVING */}
          <div className="card path-card">
            <div className="card-body">
              <h2 className="h2">Live in Lombok</h2>
              <p className="text">
                Long-term rentals for people who want to live in Lombok
                without committing blindly or sending large upfront payments
                without local support.
              </p>
              <ul className="bullets">
                <li>Rental terms from 1 month to 10 years</li>
                <li>Identified owners</li>
                <li>Local intermediary coordination</li>
              </ul>
              <Link href="/rentals" className="btn btn-primary">
                Browse rentals
              </Link>
            </div>
          </div>

          {/* INVESTING */}
          <div className="card path-card">
            <div className="card-body">
              <h2 className="h2">Invest in Lombok</h2>
              <p className="text">
                Land and villa opportunities for long-term investors
                looking for clarity, structure and local execution.
              </p>
              <ul className="bullets">
                <li>Land and villa investment opportunities</li>
                <li>Legal verification available</li>
                <li>Optional property management</li>
              </ul>
              <Link href="/investments" className="btn btn-primary">
                Browse investments
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="section section-soft">
        <div className="container">
          <h2 className="h2">Why RumahYa</h2>

          <div className="grid grid-2">
            <ul className="bullets">
              <li>Based in Lombok</li>
              <li>On-the-ground presence</li>
              <li>Clear and direct communication</li>
            </ul>
            <ul className="bullets">
              <li>Verified information when possible</li>
              <li>Long-term relationship focus</li>
              <li>Human-scale approach</li>
            </ul>
          </div>

          <p className="muted" style={{ marginTop: 16 }}>
            RumahYa does not replace legal, notarial or tax professionals.
            Independent verification is always recommended.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container cta-center">
          <h2 className="h2">Start with a conversation</h2>
          <p className="text">
            We begin by understanding your situation and objectives.
          </p>
          <Link href="/contact" className="btn btn-primary">
            Contact RumahYa
          </Link>
        </div>
      </section>
    </main>
  );
}
