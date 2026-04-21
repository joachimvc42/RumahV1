import Link from 'next/link';

const WA = '6287873487940';
const EMAIL = 'info@rumahya.com';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="brand-name">Rumah<span>Ya</span></span>
            <p className="footer-brand-tag">
              A local point of contact for long-term living and real estate investment in Lombok.
              Verified properties, honest terms, on-the-ground coordination.
            </p>
          </div>

          <div className="footer-col">
            <h3>Explore</h3>
            <ul>
              <li><Link href="/">Long-term rentals</Link></li>
              <li><Link href="/investments">Investments</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/about#contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Contact</h3>
            <ul>
              <li>
                <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </li>
              <li>Lombok, Indonesia</li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Services</h3>
            <ul>
              <li>Long-term rentals</li>
              <li>Legal verification</li>
              <li>Property management</li>
              <li>Land &amp; villa investment</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {currentYear} RumahYa. All rights reserved.</span>
          <span className="footer-langs">
            <span>EN</span>
            <span>·</span>
            <span>FR</span>
            <span>·</span>
            <span>ID</span>
          </span>
          <span>Based in Lombok, Indonesia</span>
        </div>
      </div>
    </footer>
  );
}
