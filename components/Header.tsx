'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Brand */}
        <Link href="/" className="brand">
          <span className="brand-name">
            Rumah<span>Ya</span>
          </span>
          <span className="brand-tagline">
            Lombok rentals & investments
          </span>
        </Link>

        {/* Navigation */}
        <nav className="primary-nav">
          <Link
            href="/"
            className={isActive('/') ? 'nav-link is-active' : 'nav-link'}
          >
            Home
          </Link>

          <Link
            href="/rentals"
            className={isActive('/rentals') ? 'nav-link is-active' : 'nav-link'}
          >
            Rentals
          </Link>

          <Link
            href="/investments"
            className={isActive('/investments') || isActive('/land') ? 'nav-link is-active' : 'nav-link'}
          >
            Investments
          </Link>

          <Link
            href="/about"
            className={isActive('/about') ? 'nav-link is-active' : 'nav-link'}
          >
            About
          </Link>

          <Link
            href="/contact"
            className={isActive('/contact') ? 'nav-link nav-cta is-active' : 'nav-link nav-cta'}
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
