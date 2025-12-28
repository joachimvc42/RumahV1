import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="page">

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <h1>
            Secure long-term rentals <br />
            and land opportunities in Lombok
          </h1>

          <p className="hero-subtitle">
            RumahYa assists expatriates and investors with verified properties,
            structured processes, and secure payment coordination through a local notary.
          </p>

          <div className="hero-actions">
            <Link href="/rentals" className="btn btn-primary">
              Long-term rentals
            </Link>
            <Link href="/land" className="btn btn-secondary">
              Land opportunities
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="trust">
        <div className="container">
          <h2>A safer way to commit in Lombok</h2>

          <p>
            Long-term rentals in Lombok often require one to three years paid upfront.
            For expatriates, sending such amounts before arrival involves uncertainty.
          </p>

          <p>
            RumahYa introduces a structured approach where verification, contract review,
            and payment execution are coordinated locally, with funds held by an independent notary
            until agreed conditions are met.
          </p>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services">
        <div className="container">
          <h2>Our services</h2>

          <div className="services-grid">

            <div className="service-card">
              <h3>Long-term rentals (1–10 years)</h3>
              <p>
                For expatriates seeking stability without exposing themselves
                to upfront payment risks.
              </p>
              <ul>
                <li>Property and ownership verification</li>
                <li>Lease terms reviewed before execution</li>
                <li>Payment coordinated through a local notary</li>
                <li>On-site confirmation before fund release</li>
              </ul>
            </div>

            <div className="service-card">
              <h3>Land opportunities</h3>
              <p>
                Carefully selected land plots for residential or investment projects,
                with clear documentation and local guidance.
              </p>
              <ul>
                <li>Land status verification</li>
                <li>Buildability assessment</li>
                <li>Local zoning insights</li>
                <li>Independent transaction coordination</li>
              </ul>
            </div>

            <div className="service-card">
              <h3>Local coordination</h3>
              <p>
                Acting as a neutral intermediary between foreign clients,
                local owners, and trusted professionals.
              </p>
              <ul>
                <li>Local presence</li>
                <li>Clear communication</li>
                <li>Process transparency</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* TRANSPARENCY */}
      <section className="transparency">
        <div className="container">
          <h2>Transparency & role</h2>

          <p>
            RumahYa does not hold client funds directly.
            All payments are coordinated through an independent notary,
            ensuring neutrality, traceability, and clear execution steps.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <h2>Discuss your project</h2>
          <p>
            Whether you are relocating, settling long-term, or exploring land opportunities,
            we help you move forward with clarity.
          </p>

          <Link href="/contact" className="btn btn-primary">
            Contact RumahYa
          </Link>
        </div>
      </section>

    </main>
  );
}
