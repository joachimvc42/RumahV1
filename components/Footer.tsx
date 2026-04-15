export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="brand-name">
            Rumah<span>Ya</span>
          </span>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: 560, lineHeight: 1.65 }}>
            RumahYa is based in Lombok and works with local partners. We do not act as agents pushing transactions. Our role is to provide clarity, context and local coordination.
          </p>
        </div>
      </div>
      <div className="container" style={{ marginTop: 16, fontSize: '0.78rem', color: '#9ca3af', borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
        © {currentYear} RumahYa. All rights reserved.
      </div>
    </footer>
  );
}
