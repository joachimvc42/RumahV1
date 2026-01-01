import Link from 'next/link';

type VillaInvestment = {
  id: string;
  title: string;
  location: string;
  price: string;
  yield: string;
};

const sampleVillas: VillaInvestment[] = [
  {
    id: '1',
    title: 'Luxury Beachfront Villa',
    location: 'Kuta, Lombok',
    price: '450,000 USD',
    yield: '8–10%',
  },
  {
    id: '2',
    title: 'Hillside Investment Villa',
    location: 'Selong Belanak',
    price: '320,000 USD',
    yield: '7–9%',
  },
];

export default function VillaInvestmentPage() {
  return (
    <main className="page">
      <section className="section">
        <div className="container">
          <h1 className="h1">Villa investments</h1>
          <p className="lead">
            Curated villa investment opportunities in Lombok, with optional
            property management and legal due diligence.
          </p>

          <div className="grid grid-2" style={{ marginTop: 32 }}>
            {sampleVillas.map((villa) => (
              <div key={villa.id} className="card">
                <div className="card-body">
                  <h3>{villa.title}</h3>
                  <p className="muted">{villa.location}</p>

                  <ul className="bullets" style={{ marginTop: 12 }}>
                    <li>Price: {villa.price}</li>
                    <li>Expected yield: {villa.yield}</li>
                  </ul>

                  <div style={{ marginTop: 16 }}>
                    <Link
                      href={`/villa/${villa.id}`}
                      className="btn btn-primary"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
