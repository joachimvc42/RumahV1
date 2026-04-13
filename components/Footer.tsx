export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <strong>RUMAHYA</strong><br />
          Lombok rentals & Investment
        </div>
        <div>
          WhatsApp: <a href="https://wa.me/6287873487940" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>+62 878 7348 7940</a><br />
          Email: <a href="mailto:info@rumahya.com" style={{ color: 'inherit' }}>info@rumahya.com</a>
        </div>
      </div>
      <div className="container" style={{ marginTop: '8px', fontSize: '0.78rem', color: '#9ca3af' }}>
        © {currentYear} RumahYa. All rights reserved.
      </div>
    </footer>
  );
}