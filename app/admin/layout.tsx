import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside
        style={{
          width: 220,
          padding: 20,
          borderRight: '1px solid #e5e7eb',
        }}
      >
        <h2 style={{ marginBottom: 20 }}>RumahYa Admin</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/rentals">Rentals</Link>
          <Link href="/admin/investments">Investments</Link>
          <Link href="/admin/lands">Land</Link>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 32 }}>{children}</main>
    </div>
  );
}
