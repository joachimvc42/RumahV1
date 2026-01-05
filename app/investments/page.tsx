'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';

type Item = {
  id: string;
  type: 'land' | 'villa';
  title: string;
  location: string;
  price: string;
  legal_checked: boolean | null;
  management_available: boolean | null;
  href: string;
};

export default function InvestmentsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  /* filters */
  const [typeFilter, setTypeFilter] = useState<'all' | 'land' | 'villa'>('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [legalFilter, setLegalFilter] = useState(false);
  const [managementFilter, setManagementFilter] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const { data: investments, error } = await supabase
        .from('investments')
        .select('*');

      if (error || !investments) {
        setItems([]);
        setLoading(false);
        return;
      }

      const landIds = investments
        .filter((i) => i.asset_type === 'land')
        .map((i) => i.asset_id);

      const propertyIds = investments
        .filter((i) => i.asset_type === 'property')
        .map((i) => i.asset_id);

      const [{ data: lands }, { data: properties }] = await Promise.all([
        landIds.length
          ? supabase
              .from('lands')
              .select('id,title,location,price_per_are')
              .in('id', landIds)
          : Promise.resolve({ data: [] }),
        propertyIds.length
          ? supabase
              .from('properties')
              .select('id,title,location,price')
              .in('id', propertyIds)
          : Promise.resolve({ data: [] }),
      ]);

      const merged: Item[] = [];

      for (const inv of investments) {
        if (inv.asset_type === 'land') {
          const land = lands?.find((l) => l.id === inv.asset_id);
          if (land) {
            merged.push({
              id: inv.id,
              type: 'land',
              title: land.title,
              location: land.location,
              price: `${land.price_per_are} Mio IDR / are`,
              legal_checked: inv.legal_checked,
              management_available: inv.management_available,
              href: '/land',
            });
          }
        }

        if (inv.asset_type === 'property') {
          const prop = properties?.find((p) => p.id === inv.asset_id);
          if (prop) {
            merged.push({
              id: inv.id,
              type: 'villa',
              title: prop.title,
              location: prop.location,
              price: `${prop.price} USD`,
              legal_checked: inv.legal_checked,
              management_available: inv.management_available,
              href: `/villa/${prop.id}`,
            });
          }
        }
      }

      setItems(merged);
      setLoading(false);
    };

    load();
  }, []);

  const filtered = items.filter((i) => {
    if (typeFilter !== 'all' && i.type !== typeFilter) return false;
    if (
      locationFilter &&
      !i.location.toLowerCase().includes(locationFilter.toLowerCase())
    )
      return false;
    if (legalFilter && !i.legal_checked) return false;
    if (managementFilter && !i.management_available) return false;
    return true;
  });

  return (
    <main className="page">
      {/* INTRO */}
      <section className="section">
        <h1>Investment opportunities in Lombok</h1>
        <p className="muted">
          Land and villa assets identified as suitable for long-term investment.
        </p>
      </section>

      {/* FILTERS */}
      <section className="section">
        <div className="filters-pill">
          <div className="filter-segment">
            <div className="filter-label-top">Asset type</div>
            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as 'all' | 'land' | 'villa')
              }
            >
              <option value="all">All</option>
              <option value="land">Land</option>
              <option value="villa">Villa</option>
            </select>
          </div>

          <div className="filter-segment">
            <div className="filter-label-top">Location</div>
            <input
              type="text"
              placeholder="Search location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>

          <div className="filter-segment checkbox">
            <label>
              <input
                type="checkbox"
                checked={legalFilter}
                onChange={(e) => setLegalFilter(e.target.checked)}
              />
              Legal checked
            </label>
          </div>

          <div className="filter-segment checkbox">
            <label>
              <input
                type="checkbox"
                checked={managementFilter}
                onChange={(e) => setManagementFilter(e.target.checked)}
              />
              Management available
            </label>
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="section">
        {loading ? (
          <p className="muted">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="muted">No investment opportunities match your criteria.</p>
        ) : (
          <div className="grid grid-3">
            {filtered.map((item) => (
              <Link key={item.id} href={item.href} className="card">
                <div className="card-body">
                  <h3>{item.title}</h3>
                  <p className="muted">{item.location}</p>

                  <p className="strong">{item.price}</p>

                  <div className="card-meta">
                    <span className="badge-soft">
                      {item.type === 'land' ? 'Land' : 'Villa'}
                    </span>

                    {item.legal_checked && (
                      <span className="badge-soft">Legal checked</span>
                    )}

                    {item.management_available && (
                      <span className="badge-soft">Management</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
