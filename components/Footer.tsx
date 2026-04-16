export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer" style={{ paddingTop: 20, paddingBottom: 20 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span className="brand-name" style={{ fontSize: '1rem' }}>
            Rumah<span>Ya</span>
          </span>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Based in Lombok. Local partners, verified information, long-term coordination.
          </p>
        </div>
        <span style={{ fontSize: '0.78rem', color: '#6F6A64', flexShrink: 0 }}>
          © {currentYear} RumahYa. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
