import Link from 'next/link';

type Villa = {
  id: string;
  title: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  price: string;
  leaseType: string;
  description: string;
  features: string[];
  images: string[];
};

// Placeholder data
function getVillaById(id: string): Villa | null {
  const villas: Villa[] = [
    {
      id: '1',
      title: 'Beachfront investment villa',
      location: 'Kuta, Lombok',
      bedrooms: 3,
      bathrooms: 3,
      price: '25',
      leaseType: 'Long-term lease',
      description:
        'Beachfront villa suitable for long-term investment projects. The property can be structured under a long-term lease with optional property management handled locally.',
      features: [
        'Private pool',
        'Direct beach access',
        'Fully furnished',
        'Air conditioning',
        'High rental demand area',
      ],
      images: ['/assets/lombok.jpg'],
    },
    {
      id: '2',
      title: 'Traditional Lombok-style villa',
      location: 'Senggigi, Lombok',
      bedrooms: 2,
      bathrooms: 2,
      price: '18',
      leaseType: 'Long-term lease',
      description:
        'Authentic Lombok-style villa located in a quiet residential area. Suitable for long-term leasing or rental yield strategies with local management.',
      features: [
        'Garden',
        'Terrace',
        'Traditional architecture',
        'Air conditioning',
      ],
      images: ['/assets/lombok.jpg'],
    },
  ];

  return villas.find((v) => v.id === id) || null;
}

function formatPrice(value: string): string {
  return `${value} Mio IDR / month (indicative)`;
}

export default function VillaDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const villa = getVillaById(params.id);

  if (!villa) {
    return (
      <main className="page">
        <section className="section">
          <div className="container">
            <h1 className="h1">Villa not found</h1>
            <p className="muted">
              This investment opportunity is no longer available.
            </p>
            <Link href="/land" className="btn btn-primary">
              Back to investment listings
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
            <Link href="/land">Investing in Lombok</Link>
            <span className="sep">/</span>
            <span>{villa.title}</span>
          </div>

          <h1 className="h1">{villa.title}</h1>
          <p className="lead">{villa.location}</p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="section">
        <div className="container grid grid-2">

          {/* IMAGE */}
          <div className="card">
            <div className="card-media">
              <img src={villa.images[0]} alt={villa.title} />
            </div>
          </div>

          {/* DETAILS */}
          <div className="card">
            <div className="card-body">
              <h2 className="h2">Investment overview</h2>

              <dl className="details">
                <div className="row">
                  <dt>Location</dt>
                  <dd>{villa.location}</dd>
                </div>
                <div className="row">
                  <dt>Bedrooms</dt>
                  <dd>{villa.bedrooms}</dd>
                </div>
                <div className="row">
                  <dt>Bathrooms</dt>
                  <dd>{villa.bathrooms}</dd>
                </div>
                <div className="row">
                  <dt>Structure</dt>
                  <dd>{villa.leaseType}</dd>
                </div>
                <div className="row">
                  <dt>Indicative value</dt>
                  <dd>{formatPrice(villa.price)}</dd>
                </div>
              </dl>

              <p className="muted" style={{ marginTop: 16 }}>
                Legal structure, tenure and payment execution are coordinated
                locally with independent professionals.
              </p>

              <div className="card-actions">
                <Link href="/contact" className="btn btn-primary">
                  Discuss this investment
                </Link>
                <Link href="/land" className="btn btn-ghost">
                  Back to investments
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
              <h2 className="h2">Project description</h2>
              <p>{villa.description}</p>

              <h3 className="h3" style={{ marginTop: 20 }}>
                Key characteristics
              </h3>
              <ul className="bullets">
                {villa.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>

              <p className="muted" style={{ marginTop: 20 }}>
                Property management services can be provided for investors
                seeking a passive setup.
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
