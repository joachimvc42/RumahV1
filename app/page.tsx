import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>
              Invest in Lombok with clarity,<br />
              local expertise and verified processes
            </h1>
            <p className="hero-subtitle">
              RumahYa supports foreign investors and expatriates in Lombok by sourcing
              villas and land opportunities and securing each project with local
              due diligence, legal verification and on-the-ground property management.
            </p>
            <div className="hero-actions">
              <Link href="/land" className="btn-primary">Explore land opportunities</Link>
              <Link href="/rentals" className="btn-secondary">View villas &amp; rentals</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>A structured approach to real estate investment in Lombok</h2>
            <p>
              Investing in Indonesia requires more than attractive prices.
              It requires local presence, document verification and a clear operational model.
            </p>
          </div>

          <div className="grid-3">
            <div className="card">
              <h3>Local sourcing &amp; market access</h3>
              <p>
                We work directly with trusted local partners to identify villas and land
                that match long-term investment strategies. Every opportunity is sourced
                on the ground, not scraped from public listings.
              </p>
            </div>

            <div className="card">
              <h3>Legal &amp; notarial verification</h3>
              <p>
                For investors who require it, we coordinate independent lawyers and notaries
                to review land titles, lease structures and contracts—helping reduce legal
                uncertainty before any commitment.
              </p>
            </div>

            <div className="card">
              <h3>Property management &amp; execution</h3>
              <p>
                From tenant placement to maintenance and reporting, our local team ensures
                assets are managed professionally—especially for owners living abroad.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-light">
        <div className="container">
          <div className="section-header">
            <h2>Our services</h2>
            <p>
              RumahYa is not a marketplace. We act as an operational partner
              for investors who value structure, transparency and long-term viability.
            </p>
          </div>

          <div className="grid-3">
            <div className="card">
              <h3>Land acquisition support</h3>
              <p>
                Identification of suitable land, zoning context, access analysis and
                guidance on the appropriate legal structure for foreign investors.
              </p>
              <Link href="/land" className="text-link">View land listings</Link>
            </div>

            <div className="card">
              <h3>Villas &amp; long-term rentals</h3>
              <p>
                Villas selected for long-term rental strategies or private use,
                with optional management to ensure consistency and asset preservation.
              </p>
              <Link href="/rentals" className="text-link">View villas</Link>
            </div>

            <div className="card">
              <h3>Property management</h3>
              <p>
                Operational management for owners abroad: tenants, staff coordination,
                maintenance and periodic reporting for full visibility.
              </p>
              <Link href="/property-management" className="text-link">Learn more</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Who we work with</h2>
          </div>

          <div className="grid-2">
            <div className="card">
              <h3>Foreign investors</h3>
              <p>
                Investors seeking exposure to Lombok&apos;s growth while minimizing
                operational and legal risk through local execution.
              </p>
            </div>

            <div className="card">
              <h3>Expatriates living in Indonesia</h3>
              <p>
                Residents looking to acquire land, secure a long-term lease or
                delegate property management to a trusted local team.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-cta">
        <div className="container">
          <div className="cta-box">
            <h2>Discuss your project</h2>
            <p>
              Whether you are evaluating an opportunity or already own property in Lombok,
              we can help you structure the next steps with clarity.
            </p>
            <Link href="/contact" className="btn-primary">Contact RumahYa</Link>
          </div>
        </div>
      </section>
    </>
  );
}

