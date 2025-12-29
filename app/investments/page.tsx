import Link from 'next/link';

export default function InvestmentsPage() {
  return (
    <main className="page">
      {/* HERO */}
      <section className="section hero">
        <div className="container hero-inner">
          <h1 className="h1">
            Invest in Lombok<br />
            with local insight and clarity
          </h1>
          <p className="lead">
            RumahYa supports long-term investors with access to land and villas,
            local due diligence, and optional property management.
          </p>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="section">
        <div className="container">
          <h2 className="h2">A local partner for serious investors</h2>
          <p className="text">
            Lombok offers strong long-term potential, but investing remotely
            requires local understanding. RumahYa acts as a local intermediary,
            helping investors identify opportunities, understand constraints,
            and move forward with clarity.
          </p>
        </div>
      </section>

      {/* INVESTMENT TYPES */}
      <section className="section section-soft">
        <div className="container grid grid-3">
          {/* LAND */}
          <div className="card">
            <div className="card-body">
              <h3 className="h3">Land investment</h3>
              <p className="text">
                Carefully selected plots for development or land banking.
              </p>
              <ul className="bullets">
                <li>Freehold or long-term lease</li>
                <li>Zoning & buildability review</li>
                <li>Access, utilities, surroundings</li>
                <li>Clear ownership documentation</li>
              </ul>
              <Link href="/land" className="btn btn-ghost">
                View available land
              </Link>
            </div>
          </div>

          {/* VILLAS */}
          <div className="card">
            <div className="card-body">
              <h3 className="h3">Villa investment</h3>
              <p className="text">
                Existing villas or long-term lease opportunities.
              </p>
              <ul className="bullets">
                <li>Purchase or leasehold structures</li>
                <li>Rental potential assessment</li>
                <li>Existing or off-plan projects</li>
                <li>Exit considerations</li>
              </ul>
              <Link href="/villa" className="btn btn-ghost">
                View villas
              </Link>
            </div>
          </div>

          {/* MANAGEMENT */}
          <div className="card">
            <div className="card-body">
              <h3 className="h3">Property management</h3>
              <p className="text">
                Optional hands-off management for remote owners.
              </p>
              <ul className="bullets">
                <li>Local supervision</li>
                <li>Maintenance coordination</li>
                <li>Tenant interface</li>
                <li>Periodic reporting</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* DUE DILIGENCE */}
      <section className="section">
        <div className="container">
          <h2 className="h2">Due diligence is essential</h2>
          <p className="text">
            Ownership structures, permits and zoning vary across Lombok.
            All investment opportunities can be reviewed with independent
            local professionals before any commitment.
          </p>
          <p className="muted">
            RumahYa facilitates access to information but does not replace
            legal or notarial advice.
          </p>
        </div>
      </section>

      {/* WHO */}
      <section className="section section-soft">
        <div className="container">
          <h2 className="h2">Who this is for</h2>
          <div className="grid grid-2">
            <ul className="bullets">
              <li>Foreign investors not based in Indonesia</li>
              <li>Long-term investment strategies</li>
              <li>Investors seeking local oversight</li>
            </ul>
            <ul className="bullets">
              <li>Buyers looking for verified opportunities</li>
              <li>Hands-off ownership preferences</li>
              <li>Selective, non-speculative approach</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container cta-center">
          <h2 className="h2">Discuss an investment</h2>
          <p className="text">
            Every situation is different. We start with a conversation.
          </p>
          <Link href="/contact" className="btn btn-primary">
            Contact RumahYa
          </Link>
        </div>
      </section>
    </main>
  );
}
