import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="page">

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <h1>
            Settle or invest in Lombok<br />
            with local execution and verified processes
          </h1>

          <p className="hero-subtitle">
            RumahYa assists expatriates and foreign investors by securing long-term rentals
            and structuring real estate investments through on-the-ground verification
            and notarial coordination.
          </p>
        </div>
      </section>

      {/* TWO PILLARS */}
      <section className="section">
        <div className="container grid grid-2">

          {/* LIVING */}
          <div className="card">
            <div className="card-body">
              <h2 className="h2">Living in Lombok</h2>

              <p>
                For expatriates and families looking to live in Lombok under
                long-term rental agreements.
              </p>

              <p>
                Long-term rentals often require one to three years paid upfront.
                RumahYa helps reduce this risk by verifying properties, owners,
                and coordinating payments through a local notary.
              </p>

              <ul className="bullets">
                <li>Long-term villas & houses (1–10 years)</li>
                <li>Owner & document verification</li>
                <li>Payment coordination via notary</li>
                <li>Local presence before and after arrival</li>
              </ul>

              <Link href="/rentals" className="btn btn-primary">
                Explore long-term rentals
              </Link>
            </div>
          </div>

          {/* INVESTING */}
          <div className="card">
            <div className="card-body">
              <h2 className="h2">Investing in Lombok</h2>

              <p>
                For investors seeking exposure to Lombok real estate without
                operational burden.
              </p>

              <p>
                We assist with land and villa investments by coordinating
                verification, transaction structuring and long-term management.
              </p>

              <ul className="bullets">
                <li>Land acquisition & long-term leases</li>
                <li>Villas for investment</li>
                <li>Legal & notarial coordination</li>
                <li>Property management & reporting</li>
              </ul>

              <Link href="/land" className="btn btn-secondary">
                Explore investment opportunities
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* TRANSPARENCY */}
      <section className="section section-muted">
        <div className="container">
          <h2 className="h2">A neutral and structured approach</h2>

          <p>
            RumahYa does not hold client funds directly.
            Payments are coordinated through independent notaries to ensure
            neutrality, traceability and proper execution.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <h2>Discuss your project</h2>
          <p>
            Whether you plan to live in Lombok or invest long-term,
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
