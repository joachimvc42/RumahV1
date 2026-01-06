'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';

type Property = {
  id: string;
  title: string;
  location: string;
  price: number;
  tenure: string;
  created_at: string;
};

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from('properties')
      .select('id,title,location,price,tenure,created_at')
      .order('created_at', { ascending: false });

    setProperties(data ?? []);
    setSelected(new Set());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === properties.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(properties.map((p) => p.id)));
    }
  };

  const bulkDelete = async () => {
    if (selected.size === 0) return;

    const confirmed = window.confirm(
      `Delete ${selected.size} properties permanently?`
    );
    if (!confirmed) return;

    setDeleting(true);
    await supabase.from('properties').delete().in('id', Array.from(selected));
    setDeleting(false);
    load();
  };

  return (
    <main className="admin-page">
      <div className="admin-header">
        <h1>Villas / Properties</h1>

        <div className="admin-actions">
          {selected.size > 0 && (
            <button
              onClick={bulkDelete}
              className="btn btn-danger"
              disabled={deleting}
            >
              Delete selected ({selected.size})
            </button>
          )}

          <Link href="/admin/properties/new" className="btn btn-primary">
            Add villa
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="muted">Loading…</p>
      ) : properties.length === 0 ? (
        <p className="muted">No villas yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selected.size === properties.length}
                  onChange={toggleAll}
                />
              </th>
              <th>Title</th>
              <th>Location</th>
              <th>Price (USD)</th>
              <th>Tenure</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.has(p.id)}
                    onChange={() => toggle(p.id)}
                  />
                </td>
                <td>{p.title}</td>
                <td>{p.location}</td>
                <td>{p.price}</td>
                <td>{p.tenure}</td>
                <td>
                  <Link
                    href={`/admin/properties/${p.id}`}
                    className="btn btn-ghost"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
