'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

interface Villa {
  id: string;
  title: string;
  location: string;
  price: number;
}

export default function VillaPage() {
  const [villas, setVillas] = useState<Villa[]>([]);
  const [investmentIds, setInvestmentIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const load = async () => {
      const [{ data: villas }, { data: investments }] = await Promise.all([
        supabase.from('properties').select('id,title,location,price'),
        supabase
          .from('investments')
          .select('asset_id')
          .eq('asset_type', 'property'),
      ]);

      setVillas(villas || []);
      setInvestmentIds(new Set(investments?.map((i) => i.asset_id)));
    };

    load();
  }, []);

  return (
    <main className="page">
      <section className="section">
        <h1>Villa investments</h1>

        <div className="grid grid-2">
          {villas.map((villa) => {
            const isInvestment = investmentIds.has(villa.id);

            return (
              <div key={villa.id} className="card">
                <div className="card-body">
                  <h3>{villa.title}</h3>
                  <p className="muted">{villa.location}</p>

                  <p className="strong">{villa.price} USD</p>

                  {isInvestment && (
                    <span className="badge-soft badge-investment">
                      Investment
                    </span>
                  )}

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
            );
          })}
        </div>
      </section>
    </main>
  );
}
