import Link from 'next/link';

// NOTE: Database functionality has been stubbed.
// In the original PHP version, land details were fetched from a MySQL database.
// To restore this functionality, implement an API route or server component
// that connects to your database and returns land details.

interface LandDetail {
  id: number;
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
}

// Placeholder function - replace with actual API/database call
async function getLandById(id: string): Promise<LandDetail | null> {
  // TODO: Implement database lookup
  // For now, return placeholder data
  return {
    id: parseInt(id),
    title: 'Sample Land Plot',
    location: 'Kuta, Lombok',
    area: '10 are',
    price: '150',
    distanceFromBeach: '500m',
    isBuildable: true,
    hasElectricity: true,
    hasWater: true,
    isRawLand: false,
    description: 'Beautiful plot of land with ocean views, perfect for villa development. Easy access to main road and all utilities available.',
    image: '/assets/lombok.jpg',
  };
}

function formatPrice(value: string): string {
  if (!value) return '';
  return `${value} Mio IDR / month`;
}

function BooleanBadge({ value, label }: { value: boolean; label: string }) {
  if (!value) return null;
  return <span className="badge">{label}</span>;
}

export default async function LandDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const land = await getLandById(id);

  if (!land) {
    return (
      <div className="container">
        <h1>Land Not Found</h1>
        <p>Sorry, the land listing you are looking for does not exist.</p>
        <Link href="/land" className="btn btn-primary mt-3">
          Back to land listings
        </Link>
      </div>
    );
  }

  return (
    <section className="container fade-in-up">
      <h1 className="section-title">{land.title}</h1>
      <div className="detail-container">
        <div className="gallery">
          <img
            src={land.image || '/assets/lombok.jpg'}
            alt="Land image"
          />
        </div>
        <div className="detail-info">
          <h2>Land Details</h2>
          <div className="detail-meta">
            {land.distanceFromBeach && (
              <span className="badge">Beach: {land.distanceFromBeach}</span>
            )}
            {land.location && (
              <span className="badge">Area: {land.location}</span>
            )}
            {land.area && (
              <span className="badge">Size: {land.area}</span>
            )}
            <BooleanBadge value={land.isBuildable} label="Buildable" />
            <BooleanBadge value={land.hasElectricity} label="Electricity" />
            <BooleanBadge value={land.hasWater} label="Water" />
            <BooleanBadge value={land.isRawLand} label="Raw Land" />
          </div>
          {land.price && (
            <p>
              <strong>Price:</strong> {formatPrice(land.price)}
            </p>
          )}
          <div className="description">
            <p>{land.description}</p>
          </div>
          <Link href="/contact" className="btn btn-primary">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}

