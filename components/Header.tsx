'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Brand */}
        <Link href="/" className="brand">
          <span className="brand-name">
            Rumah<span>Ya</span>
          </span>
        </Link>

        {/* Tagline */}
        <p className="header-tagline">
          A local point of contact for long-term living and investment in Lombok
        </p>

        {/* Mobile toggle */}
        <button
          className={`nav-toggle ${menuOpen ? 'is-open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>

        {/* Navigation */}
        <nav className={`primary-nav ${menuOpen ? 'is-open' : ''}`}>
          <Link
            href="/"
            className={
              pathname === '/'
                ? 'nav-link is-active'
                : 'nav-link'
            }
            onClick={closeMenu}
          >
            Home
          </Link>

          <Link
            href="/rentals"
            className={isActive('/rentals') ? 'nav-link is-active' : 'nav-link'}
            onClick={closeMenu}
          >
            Rentals
          </Link>

          <Link
            href="/investments"
            className={
              isActive('/investments') || isActive('/land') || isActive('/villa')
                ? 'nav-link is-active'
                : 'nav-link'
            }
            onClick={closeMenu}
          >
            Investments
          </Link>

          <Link
            href="/contact"
            className={isActive('/contact') ? 'nav-link nav-cta is-active' : 'nav-link nav-cta'}
            onClick={closeMenu}
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
