'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + '/');

  return (
    <header className="site-header">
      <div className="container header-inner">

        {/* BRAND */}
        <Link href="/" className="brand">
          <span className="brand-name">
            <strong>Rumah</strong>Ya
          </span>
          <span className="brand-tagline">
            Lombok · Living & Investing
          </span>
        </Link>

        {/* NAVIGATION */}
        <nav className="primary-nav" id="primaryNav">
          <ul>
            <li className={isActive('/rentals') ? 'active' : ''}>
              <Link href="/rentals">
                Living in Lombok
              </Link>
            </li>

            <li className={isActive('/land') || isActive('/villa') ? 'active' : ''}>
              <Link href="/land">
                Investing in Lombok
              </Link>
            </li>

            <li className={isActive('/about') ? 'active' : ''}>
              <Link href="/about">
                About
              </Link>
            </li>

            <li className={isActive('/contact') ? 'active' : ''}>
              <Link href="/contact" className="btn btn-primary btn-small">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* MOBILE TOGGLE */}
        <button
          className="nav-toggle"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => {
            const nav = document.getElementById('primaryNav');
            if (nav) {
              nav.classList.toggle('is-open');
            }
          }}
        >
          <span />
          <span />
          <span />
        </button>

      </div>
    </header>
  );
}
