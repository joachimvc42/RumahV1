'use client';

import Link from 'next/link';

export default function AdminHomePage() {
  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ fontSize: 24, marginBottom: 30 }}>Admin – RumahYa</h1>

      <div style={{ display: 'grid', gap: 20, maxWidth: 600 }}>
        <Link href="/admin/rentals" style={cardStyle}>
          Long-term Rentals
        </Link>

        <Link href="/admin/investments" style={cardStyle}>
          Investments
        </Link>

        <Link href="/admin/owners" style={cardStyle}>
          Owners (internal)
        </Link>

        <Link href="/admin/leads" style={cardStyle}>
          Leads / Contacts
        </Link>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  padding: 20,
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  textDecoration: 'none',
  color: '#111827',
  fontWeight: 600,
  background: '#fff',
};
