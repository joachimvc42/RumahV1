import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';

type Investment = {
  id: string;
  asset_type: 'land' | 'property';
  asset_id: string;
  legal_checked: boolean | null;
  management_available: boolean | null;
};

export default async function InvestmentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: investment, error } = await supabase
    .from('investments')
    .select('*')
    .eq('id', params.id)
    .single<Investment>();

  if (error || !investment) {
    return <p className="muted">Investment not found.</p>;
  }

  if (investment.asset_type === 'land') {
    const { data: land } = await supabase
      .from('lands')
      .select('*')
      .eq('id', investment.asset_id)
      .single();

    if (!land) {
      return <p className="muted">Land asset not found.</p>;
    }

    return (
      <main className="page">
        <section className="section">
          <h1>{land.title}</h1>
          <p className="muted">{land.location}</p>

          <ul className="bullets">
            <li>Type: Land</li>
            <li>Price: {land.price_per_are} Mio IDR / are</li>
            {investment.legal_checked && <li>Legal checked</li>}
            {investment.management_available && <li>Management available</li>}
          </ul>

          <div className="cta-group">
            <Link href="/contact" className="btn btn-primary">
              Discuss this investment
            </Link>
            <Link href="/land" className="btn btn-ghost">
              Back to land
            </Link>
          </div>
        </section>
      </main>
    );
  }

  /* property / villa */
  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', investment.asset_id)
    .single();

  if (!property) {
    return <p className="muted">Property asset not found.</p>;
  }

  return (
    <main className="page">
      <section className="section">
        <h1>{property.title}</h1>
        <p className="muted">{property.location}</p>

        <ul className="bullets">
          <li>Type: Villa</li>
          <li>Price: {property.price} USD</li>
          {investment.legal_checked && <li>Legal checked</li>}
          {investment.management_available && <li>Management available</li>}
        </ul>

        <div className="cta-group">
          <Link href="/contact" className="btn btn-primary">
            Discuss this investment
          </Link>
          <Link href="/villa" className="btn btn-ghost">
            Back to villas
          </Link>
        </div>
      </section>
    </main>
  );
}
