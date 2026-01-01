import Link from 'next/link';

type Land = {
  id: string;
  title: string;
  location: string;
  area: string;
  price: string;
  distanceFromBeach: string;
  isBuildable: boolean;
  hasElectricity: boolean;
  hasWater: boolean;
  isRawLand: boolean;
  description: string;
  image: string;
};

function getLandById(id: string): Land | null {
  // Placeholder data - replace with database integration
  if (id === '1') {
    return {
      id: '1',
      title: 'Prime Beachside Development Land',
      location: 'Kuta, Lombok',
      area: '10 are',
      price: '150',
      distanceFromBeach: '500m',
      isBuildable: true,
      hasElectricity: true,
      hasWater: true,
      isRawLand: false,
      description:
        'Beautiful plot of land with ocean views, perfect for villa development. Easy access to main road and all utilities available.',
      image: '/assets/lombok.jpg',
    };
  }

  if (id === '2') {
    return {
      id: '2',
      title: 'Mountain View Investment Plot',
      location: 'Sembalun, Lombok',
      area: '15 are',
      price: '80',
      distanceFromBeach: '30km',
      isBuildable: true,
      hasElectricity: false,
      hasWater: true,
      isRawLand: true,
      description:
        'Large land plot with stunning mountain views. Perfect for eco-resort or private villa development. Natural water source nearby.',
      image: '/assets/lombok.jpg',
    };
  }

  return null;
}

function formatPrice(value: string): string {
  if (!value) return '';
  return `${value} Mio IDR / are`;
}

function formatBoolean(value: boolean): string {
  return value ? 'Yes' : 'No';
}

export default function LandDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const land = getLandById(id);

  if (!land) {
    return (
      <main className="page">
        <section className="section">
          <div className="container">
            <h1 className="h1">Land not found</h1>
            <p className="muted">The requested land listing does not exist.</p>
            <div style={{ marginTop: 16 }}>
              <Link className="btn btn-primary" href="/land">
                Back to Land Listings
              </Link>
            </div>
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
            <Link href="/land">Land</Link>
            <span className="sep">/</span>
            <span>{land.title}</span>
          </div>

          <h1 className="h1">{land.title}</h1>
          <p className="lead">{land.location}</p>

          <div className="hero-actions">
            <Link className="btn btn-primary" href="/contact">
              Request a viewing
            </Link>
            <Link className="btn btn-ghost" href="/legal-verification">
              Legal verification
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2">
          <div className="card">
            <div className="card-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={land.image} alt={land.title} />
            </div>
            <div className="card-body">
              <h2 className="h2">Overview</h2>
              <p className="text">{land.description}</p>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h2 className="h2">Key details</h2>

              <dl className="details">
                <div className="row">
                  <dt>Location</dt>
                  <dd>{land.location}</dd>
                </div>
                <div className="row">
                  <dt>Area</dt>
                  <dd>{land.area}</dd>
                </div>
                <div className="row">
                  <dt>Price</dt>
                  <dd>{formatPrice(land.price)}</dd>
                </div>
                <div className="row">
                  <dt>Distance to beach</dt>
                  <dd>{land.distanceFromBeach}</dd>
                </div>
                <div className="row">
                  <dt>Buildable</dt>
                  <dd>{formatBoolean(land.isBuildable)}</dd>
                </div>
                <div className="row">
                  <dt>Electricity</dt>
                  <dd>{formatBoolean(land.hasElectricity)}</dd>
                </div>
                <div className="row">
                  <dt>Water</dt>
                  <dd>{formatBoolean(land.hasWater)}</dd>
                </div>
                <div className="row">
                  <dt>Raw land</dt>
                  <dd>{formatBoolean(land.isRawLand)}</dd>
                </div>
              </dl>

              <div className="card-actions">
                <Link className="btn btn-primary" href="/contact">
                  Contact us
                </Link>
                <Link className="btn btn-ghost" href="/land">
                  Back to listings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
