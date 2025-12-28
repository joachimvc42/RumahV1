export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <strong>RUMAHYA</strong><br />
          Lombok long-term rentals, land and property management.
        </div>
        <div>
          WhatsApp: +62 812 3456 7890<br />
          Email: info@rumahya.com
        </div>
      </div>
      <div className="container" style={{ marginTop: '8px', fontSize: '0.78rem', color: '#9ca3af' }}>
        © {currentYear} RumahYa. All rights reserved.
      </div>
    </footer>
  );
}

