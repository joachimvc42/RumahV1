'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" onClick={() => setNavOpen(false)}>
          <div className="brand-text">
            <div className="brand-name">
              <span>Rumah</span>Ya
            </div>
            <div className="brand-tagline">Lombok long-term rentals &amp; land</div>
          </div>
        </Link>

        {/* Mobile hamburger button */}
        <button
          className={`nav-toggle${navOpen ? ' is-open' : ''}`}
          aria-expanded={navOpen}
          type="button"
          aria-label="Toggle navigation"
          id="navToggle"
          onClick={() => setNavOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-main${navOpen ? ' is-open' : ''}`} id="primaryNav">
          <Link
            href="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setNavOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/villa"
            className={`nav-link ${isActive('/villa') ? 'active' : ''}`}
            onClick={() => setNavOpen(false)}
          >
            Villas
          </Link>
          <Link
            href="/rentals"
            className={`nav-link ${isActive('/rentals') ? 'active' : ''}`}
            onClick={() => setNavOpen(false)}
          >
            Rentals
          </Link>
          <Link
            href="/land"
            className={`nav-link ${isActive('/land') ? 'active' : ''}`}
            onClick={() => setNavOpen(false)}
          >
            Land
          </Link>
          <Link
            href="/property-management"
            className={`nav-link ${isActive('/property-management') ? 'active' : ''}`}
            onClick={() => setNavOpen(false)}
          >
            Property Management
          </Link>
          <Link
            href="/legal-verification"
            className={`nav-link ${isActive('/legal-verification') ? 'active' : ''}`}
            onClick={() => setNavOpen(false)}
          >
            Legal Verification
          </Link>
          <Link
            href="/contact"
            className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
            onClick={() => setNavOpen(false)}
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
