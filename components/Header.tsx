'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Logo / brand */}
        <Link href="/" className="brand">
          <div className="brand-logo"></div>
          <div className="brand-text">
            <div className="brand-name"><span>Rumah</span>Ya</div>
            <div className="brand-tagline">Lombok long-term rentals &amp; land</div>
          </div>
        </Link>

        {/* Mobile hamburger button */}
        <button
          className="nav-toggle"
          type="button"
          aria-label="Toggle navigation"
          id="navToggle"
          onClick={() => {
            const nav = document.getElementById('primaryNav');
            if (nav) nav.classList.toggle('is-open');
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Main navigation */}
        <nav className="nav-main" id="primaryNav">
          <Link
            href="/"
            className={isActive('/') && pathname === '/' ? 'nav-active' : ''}
          >
            Home
          </Link>
          <Link
            href="/rentals"
            className={isActive('/rentals') ? 'nav-active' : ''}
          >
            Rentals
          </Link>
          <Link
            href="/land"
            className={isActive('/land') ? 'nav-active' : ''}
          >
            Land
          </Link>
          <Link
            href="/property-management"
            className={isActive('/property-management') ? 'nav-active' : ''}
          >
            Property Management
          </Link>
          <Link
            href="/contact"
            className={isActive('/contact') ? 'nav-active' : ''}
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}

