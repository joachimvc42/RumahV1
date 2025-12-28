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

function getVillaById(id: string): Villa | null {
  const villas: Villa[] = [
    {
      id: '1',
      title: 'Luxury Beachfront Villa',
      location: 'Kuta, Lombok',
      bedrooms: 3,
      bathrooms: 3,
      price: '25',
      leaseType: 'Monthly',
      description:
        'Stunning beachfront villa with panoramic ocean views. Modern amenities, private pool and direct beach access. Suitable for long-term expatriate stays.',
      features: [
        'Private pool',
        'Beach access',
        'Fully furnished',
        'Air conditioning',
        'WiFi',
      ],
      images: ['/assets/lombok.jpg'],
    },
    {
      id: '2',
      title: 'Traditional Lombok Villa',
      location: 'Senggigi, Lombok',
      bedrooms: 2,
      bathrooms: 2,
      price: '18',
      leaseType: 'Monthly',
      description:
        'Traditional architecture combined with modern comfort. Quiet environment with easy access to amenities.',
      features: [
        'Garden',
        'Terrace',
        'Furnished',
        'Air conditioning',
      ],
      images: ['/assets/lombok.jpg'],
    },
  ];

  return villas.find((v) => v.id === id) || null;
}

function formatPrice(value: string): string {
  return `${value} Mio IDR / month`;
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
              The requested villa listing does not exist.
            </p>
            <Link href="/villa" className="btn btn-primary">
              Back to listings
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="hero hero--compact">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/villa">Villas</Link>
            <span className="sep">/</span>
            <span>{villa.title}</span>
          </div>

          <h1 className="h1">{villa.title}</h1>
          <p className="lead">{villa.location}</p>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2">
          <div className="card">
            <div className="card-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={villa.images[0]} alt={villa.title} />
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h2 className="h2">Key details</h2>

              <dl className="details">
                <div className="row">
                  <dt>Bedrooms</dt>
                  <dd>{villa.bedrooms}</dd>
                </div>
                <div className="row">
                  <dt>Bathrooms</dt>
                  <dd>{villa.bathrooms}</dd>
                </div>
                <div className="row">
                  <dt>Lease type</dt>
                  <dd>{villa.leaseType}</dd>
                </div>
                <div className="row">
                  <dt>Price</dt>
                  <dd>{formatPrice(villa.price)}</dd>
                </div>
              </dl>

              <div className="card-actions">
                <Link href="/contact" className="btn btn-primary">
                  Request availability
                </Link>
                <Link href="/villa" className="btn btn-ghost">
                  Back to listings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card">
            <div className="card-body">
              <h2 className="h2">Description</h2>
              <p>{villa.description}</p>

              <h3 className="h3" style={{ marginTop: 20 }}>
                Features
              </h3>
              <ul className="bullets">
                {villa.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
